'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TopNav from '@/components/TopNav';
import { useStreamingBuffer } from '@/hooks/useStreamingBuffer';

const DEFAULT_PROMPT = '我是一个想在 90 天内跑完马拉松的上班族，帮我制定训练计划。';

export default function StreamingDemoPage() {
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const streaming = useStreamingBuffer();
  const controllerRef = useRef<AbortController | null>(null);
  const insideThinkingRef = useRef(false);
  const pendingTextRef = useRef('');

  const [goalText, setGoalText] = useState(DEFAULT_PROMPT);
  const [status, setStatus] = useState<'idle' | 'streaming' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chunkCount, setChunkCount] = useState(0);
  const [finalMarkdown, setFinalMarkdown] = useState('');

  useEffect(() => {
    if (!streaming.isStreaming && streaming.content) {
      setFinalMarkdown(streaming.content);
    }
  }, [streaming.isStreaming, streaming.content]);

  useEffect(() => () => {
    controllerRef.current?.abort();
  }, []);

  const startStreaming = async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    streaming.reset();
    streaming.startStreaming();
    insideThinkingRef.current = false;
    pendingTextRef.current = '';
    setStatus('streaming');
    setErrorMessage(null);
    setChunkCount(0);
    setFinalMarkdown('');

    const processDelta = (delta: string) => {
      if (!delta) return;
      
      // 累积到缓冲区
      pendingTextRef.current += delta;
      let buffer = pendingTextRef.current;
      
      let processedUpTo = 0;

      while (processedUpTo < buffer.length) {
        if (insideThinkingRef.current) {
          // 当前在 <think> 内部，查找 </think>
          const closeIndex = buffer.indexOf('</think>', processedUpTo);
          if (closeIndex === -1) {
            // 没找到结束标签，可能标签被切断，输出已确定的部分
            // 但保留最后 8 个字符（'</think>' 的长度），防止标签被切断
            const safeEnd = Math.max(processedUpTo, buffer.length - 8);
            const safeContent = buffer.slice(processedUpTo, safeEnd);
            if (safeContent) streaming.appendChunk('thinking', safeContent);
            pendingTextRef.current = buffer.slice(safeEnd);
            break;
          }
          // 找到结束标签
          const thinkingContent = buffer.slice(processedUpTo, closeIndex);
          if (thinkingContent) streaming.appendChunk('thinking', thinkingContent);
          insideThinkingRef.current = false;
          processedUpTo = closeIndex + '</think>'.length;
        } else {
          // 当前在 <think> 外部，查找 <think>
          const openIndex = buffer.indexOf('<think>', processedUpTo);
          if (openIndex === -1) {
            // 没找到开始标签，可能标签被切断，输出已确定的部分
            // 但保留最后 7 个字符（'<think>' 的长度），防止标签被切断
            const safeEnd = Math.max(processedUpTo, buffer.length - 7);
            const safeContent = buffer.slice(processedUpTo, safeEnd);
            if (safeContent) streaming.appendChunk('content', safeContent);
            pendingTextRef.current = buffer.slice(safeEnd);
            break;
          }
          // 找到开始标签
          const contentBeforeThink = buffer.slice(processedUpTo, openIndex);
          if (contentBeforeThink) streaming.appendChunk('content', contentBeforeThink);
          insideThinkingRef.current = true;
          processedUpTo = openIndex + '<think>'.length;
        }
      }

      // 如果全部处理完，清空缓冲
      if (processedUpTo >= buffer.length) {
        pendingTextRef.current = '';
      }

      setChunkCount((prev) => prev + 1);
    };

    try {
      const response = await fetch('/api/ai/chat/stream', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalText,
          daysCount: 90,
          targetDate: '2026-02-01',
          personaCode: 'coach',
          language: locale === 'zh' ? 'zh' : 'en',
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (!data || data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const rawDelta: string = parsed.delta ?? parsed.content ?? '';

            if (process.env.NODE_ENV !== 'production') {
              console.log('[streaming-demo] chunk', {
                rawDelta,
                insideThinking: insideThinkingRef.current,
              });
            }

            // DeepSeek 的 <think> 内容混在普通 content 中，通过标签解析
            processDelta(rawDelta);
          } catch (err) {
            console.warn('解析流式数据失败', err, data);
          }
        }
      }

      streaming.finishStreaming();
      if (pendingTextRef.current) {
        if (insideThinkingRef.current) {
          streaming.appendChunk('thinking', pendingTextRef.current);
        } else {
          streaming.appendChunk('content', pendingTextRef.current);
        }
        pendingTextRef.current = '';
      }
      setStatus('done');
      setFinalMarkdown(streaming.snapshotContent());
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        setStatus('idle');
        return;
      }
      console.error('流式输出失败', error);
      streaming.finishStreaming();
      pendingTextRef.current = '';
      setStatus('error');
      setErrorMessage(error?.message || '流式输出失败');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <TopNav locale={locale} />
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI 流式输出测试</h1>
          <p className="text-slate-600">
            这个页面独立验证“像 ChatGPT 一样顺滑的渐显效果”。流式阶段仅更新纯文本，结束后再解析 Markdown。
          </p>
        </header>

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8 max-w-4xl">
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="goalText">
            输入要发送给 AI 的目标描述
          </label>
          <textarea
            id="goalText"
            rows={4}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={goalText}
            onChange={(event) => setGoalText(event.target.value)}
          />
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={startStreaming}
              disabled={status === 'streaming'}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'streaming' ? (
                <>
                  <Spinner />
                  正在生成...
                </>
              ) : (
                '开始流式生成'
              )}
            </button>
            <span className="text-sm text-slate-500">
              {status === 'streaming'
                ? `正在接收... 已处理 ${chunkCount} 个 chunk`
                : status === 'done'
                ? `完成：共接收 ${chunkCount} 个 chunk`
                : '点击按钮体验流式输出效果'}
            </span>
          </div>
          {errorMessage && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 border border-red-200">
              {errorMessage}
            </p>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <StreamingPanel
            title="流式阶段（纯文本，渐显效果）"
            description="仅追加纯文本，不解析 Markdown，用于观察渐显效果。"
            isStreaming={streaming.isStreaming}
            content={streaming.content}
          />

          <ThinkingPanel
            thinking={streaming.thinking}
            isStreaming={streaming.isStreaming}
          />

          <MarkdownPanel
            isStreaming={streaming.isStreaming}
            content={finalMarkdown}
          />
        </div>
      </main>
    </div>
  );
}

function StreamingPanel({
  title,
  description,
  isStreaming,
  content,
}: {
  title: string;
  description: string;
  isStreaming: boolean;
  content: string;
}) {
  const textRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (isStreaming && textRef.current) {
      textRef.current.textContent = content;
    }
  }, [content, isStreaming]);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-full">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[220px]">
        {isStreaming ? (
          <pre
            ref={textRef}
            className="whitespace-pre-wrap text-slate-800 font-sans text-sm leading-6"
          />
        ) : (
          <pre className="whitespace-pre-wrap text-slate-800 font-sans text-sm leading-6">
            {content || '（等待生成...）'}
          </pre>
        )}
        {isStreaming && (
          <span className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-blue-600">
            <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />
            正在流式输出...
          </span>
        )}
      </div>
    </section>
  );
}

function ThinkingPanel({
  thinking,
  isStreaming,
}: {
  thinking: string;
  isStreaming: boolean;
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-full">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">AI 思考链</h2>
      <p className="text-sm text-slate-500 mb-4">
        展示模型返回的 <code className="bg-slate-100 px-2 py-0.5 rounded">&lt;think&gt;</code> 内容。
      </p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[220px]">
        <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-6">
          {thinking
            ? thinking
            : isStreaming
            ? 'AI 正在思考中...'
            : '（暂无思考过程，可能模型未返回 <think> 标签）'}
        </pre>
      </div>
    </section>
  );
}

function MarkdownPanel({
  isStreaming,
  content,
}: {
  isStreaming: boolean;
  content: string;
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Markdown 渲染（流式结束后）</h2>
      <p className="text-sm text-slate-500 mb-4">
        流式阶段不解析 Markdown，结束后一次性渲染，避免频繁重排。
      </p>
      <div className="prose prose-slate max-w-none">
        {isStreaming ? (
          <p className="text-slate-400">流式阶段进行中，等待完成后展示 Markdown...</p>
        ) : content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        ) : (
          <p className="text-slate-400">暂无内容</p>
        )}
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  );
}

