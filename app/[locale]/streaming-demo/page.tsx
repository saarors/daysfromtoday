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
  const [mounted, setMounted] = useState(false);

  // 避免 hydration 错误:只在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);
  const controllerRef = useRef<AbortController | null>(null);
  const insideThinkingRef = useRef(false);
  const pendingTextRef = useRef('');

  const [goalText, setGoalText] = useState(DEFAULT_PROMPT);
  const [status, setStatus] = useState<'idle' | 'streaming' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chunkCount, setChunkCount] = useState(0);
  const [finalMarkdown, setFinalMarkdown] = useState('');

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
      const buffer = pendingTextRef.current;
      
      let processedUpTo = 0;
      let foundTag = false;

      while (processedUpTo < buffer.length) {
        if (insideThinkingRef.current) {
          // 当前在 <think> 内部，查找 </think>
          const closeIndex = buffer.indexOf('</think>', processedUpTo);
          if (closeIndex === -1) {
            // 没找到结束标签，检查是否可能被切断
            const remaining = buffer.slice(processedUpTo);
            const possibleTag = '</think>';
            let keepBack = 0;
            
            // 检查末尾是否包含标签的前缀
            for (let i = 1; i < possibleTag.length && i <= remaining.length; i++) {
              if (remaining.endsWith(possibleTag.substring(0, i))) {
                keepBack = i;
              }
            }
            
            // 输出安全部分
            const safeContent = remaining.slice(0, remaining.length - keepBack);
            if (safeContent) {
              console.log('[processDelta] 输出到 thinking:', safeContent.length, '字符');
              streaming.appendChunk('thinking', safeContent);
            }
            pendingTextRef.current = remaining.slice(remaining.length - keepBack);
            if (pendingTextRef.current) {
              console.log('[processDelta] 保留 pending:', pendingTextRef.current.length, '字符');
            }
            break;
          }
          // 找到结束标签
          foundTag = true;
          const thinkingContent = buffer.slice(processedUpTo, closeIndex);
          if (thinkingContent) streaming.appendChunk('thinking', thinkingContent);
          insideThinkingRef.current = false;
          processedUpTo = closeIndex + '</think>'.length;
        } else {
          // 当前在 <think> 外部，查找 <think>
          const openIndex = buffer.indexOf('<think>', processedUpTo);
          if (openIndex === -1) {
            // 没找到开始标签，检查是否可能被切断
            const remaining = buffer.slice(processedUpTo);
            const possibleTag = '<think>';
            let keepBack = 0;
            
            // 检查末尾是否包含标签的前缀
            for (let i = 1; i < possibleTag.length && i <= remaining.length; i++) {
              if (remaining.endsWith(possibleTag.substring(0, i))) {
                keepBack = i;
              }
            }
            
            // 输出安全部分
            const safeContent = remaining.slice(0, remaining.length - keepBack);
            if (safeContent) {
              console.log('[processDelta] 输出到 content:', safeContent.length, '字符', safeContent.substring(0, 30));
              streaming.appendChunk('content', safeContent);
            }
            pendingTextRef.current = remaining.slice(remaining.length - keepBack);
            if (pendingTextRef.current) {
              console.log('[processDelta] 保留 pending:', pendingTextRef.current.length, '字符');
            }
            break;
          }
          // 找到开始标签
          foundTag = true;
          const contentBeforeThink = buffer.slice(processedUpTo, openIndex);
          if (contentBeforeThink) streaming.appendChunk('content', contentBeforeThink);
          insideThinkingRef.current = true;
          processedUpTo = openIndex + '<think>'.length;
        }
      }

      // 如果全部处理完（找到了完整标签），清空缓冲
      if (foundTag && processedUpTo >= buffer.length) {
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

      console.log('[streaming-demo] 流式结束前 - streaming.content:', streaming.content.substring(0, 100));
      console.log('[streaming-demo] 流式结束前 - streaming.thinking:', streaming.thinking.substring(0, 100));
      console.log('[streaming-demo] 流式结束前 - pendingText:', pendingTextRef.current);
      
      // 先处理剩余的 pendingText
      if (pendingTextRef.current) {
        console.log('[streaming-demo] 处理剩余 pendingText:', pendingTextRef.current.length, '字符');
        if (insideThinkingRef.current) {
          streaming.appendChunk('thinking', pendingTextRef.current);
        } else {
          streaming.appendChunk('content', pendingTextRef.current);
        }
        pendingTextRef.current = '';
      }
      
      // 调用 finishStreaming，确保所有 pending chunks 都被 flush
      streaming.finishStreaming();
      
      // ✅ 使用 snapshotContent() 立即从 ref 读取最新内容（不依赖 React state）
      const finalContent = streaming.snapshotContent();
      
      console.log('[streaming-demo] finishStreaming 后 - finalContent 长度:', finalContent.length);
      console.log('[streaming-demo] finalContent 前 200 字符:', finalContent.substring(0, 200));
      
      setFinalMarkdown(finalContent);
      setStatus('done');
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

  // 避免 hydration 错误:等待客户端挂载
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
  // 使用 React 状态而不是直接 DOM 操作,避免 hydration 错误
  const [displayChars, setDisplayChars] = useState<string[]>([]);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayChars([]);
      prevLengthRef.current = 0;
      return;
    }

    const prevLength = prevLengthRef.current;
    const newLength = content.length;

    // 只处理新增的字符
    if (newLength > prevLength) {
      const newChars = content.slice(prevLength).split('');
      setDisplayChars(prev => [...prev, ...newChars]);
      prevLengthRef.current = newLength;
    }
  }, [content, isStreaming]);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-full">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[220px]">
        {isStreaming ? (
          <div className="whitespace-pre-wrap text-slate-800 font-sans text-sm leading-6">
            {displayChars.map((char, i) => (
              <span key={i} className="fade-in-char">{char}</span>
            ))}
          </div>
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
      
      <style jsx>{`
        :global(.fade-in-char) {
          display: inline;
          animation: fadeIn 0.4s ease-in;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            filter: blur(1px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
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
  // 使用 React 状态而不是直接 DOM 操作,避免 hydration 错误
  const [displayChars, setDisplayChars] = useState<string[]>([]);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (!isStreaming || !thinking) {
      setDisplayChars([]);
      prevLengthRef.current = 0;
      return;
    }

    const prevLength = prevLengthRef.current;
    const newLength = thinking.length;

    // 只处理新增的字符
    if (newLength > prevLength) {
      const newChars = thinking.slice(prevLength).split('');
      setDisplayChars(prev => [...prev, ...newChars]);
      prevLengthRef.current = newLength;
    }
  }, [thinking, isStreaming]);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-full">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">AI 思考链</h2>
      <p className="text-sm text-slate-500 mb-4">
        展示模型返回的 <code className="bg-slate-100 px-2 py-0.5 rounded">&lt;think&gt;</code> 内容。
      </p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[220px]">
        {isStreaming && thinking ? (
          <div className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-6">
            {displayChars.map((char, i) => (
              <span key={i} className="fade-in-char-thinking">{char}</span>
            ))}
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-6">
            {thinking
              ? thinking
              : isStreaming
              ? 'AI 正在思考中...'
              : '（暂无思考过程，可能模型未返回 <think> 标签）'}
          </pre>
        )}
      </div>
      
      <style jsx>{`
        :global(.fade-in-char-thinking) {
          display: inline;
          animation: fadeInThinking 0.5s ease-in;
        }
        
        @keyframes fadeInThinking {
          from {
            opacity: 0;
            color: #cbd5e1;
          }
          to {
            opacity: 1;
            color: #64748b;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * 智能表格识别与转换
 * 将类似 "列1  列2  列3" 的空格分隔文本转换为 Markdown 表格
 */
function enhanceMarkdownTables(markdown: string): string {
  const lines = markdown.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    
    // 检测潜在的表格行（包含中文和多个空格分隔）
    // 如果一行中有2个及以上的连续空格，可能是表格
    if (line && /\s{2,}/.test(line) && !/^[#\-*>|]/.test(line)) {
      // 尝试找到连续的类表格行
      const tableLines: string[] = [line];
      let j = i + 1;
      
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        if (nextLine && /\s{2,}/.test(nextLine) && !/^[#\-*>|]/.test(nextLine)) {
          tableLines.push(nextLine);
          j++;
        } else {
          break;
        }
      }
      
      // 如果找到了至少2行，转换为表格
      if (tableLines.length >= 2) {
        const converted = convertToMarkdownTable(tableLines);
        result.push(converted);
        i = j;
        continue;
      }
    }
    
    result.push(lines[i]);
    i++;
  }
  
  return result.join('\n');
}

/**
 * 将多行文本转换为 Markdown 表格
 */
function convertToMarkdownTable(lines: string[]): string {
  // 将每行按多个空格分割为列
  const rows = lines.map(line => 
    line.split(/\s{2,}/).map(cell => cell.trim()).filter(Boolean)
  );
  
  // 找出最大列数
  const maxCols = Math.max(...rows.map(r => r.length));
  
  // 补齐列数
  const normalizedRows = rows.map(row => {
    while (row.length < maxCols) {
      row.push('');
    }
    return row;
  });
  
  // 生成表头分隔行
  const separator = Array(maxCols).fill('---').join('|');
  
  // 生成 Markdown 表格
  const headerRow = normalizedRows[0].join(' | ');
  const dataRows = normalizedRows.slice(1).map(row => row.join(' | '));
  
  return `\n| ${headerRow} |\n|${separator}|\n${dataRows.map(r => `| ${r} |`).join('\n')}\n`;
}

function MarkdownPanel({
  isStreaming,
  content,
}: {
  isStreaming: boolean;
  content: string;
}) {
  // 增强 Markdown 内容，自动转换表格
  const enhancedContent = content ? enhanceMarkdownTables(content) : '';
  
  // 调试：输出原始内容和增强后的内容对比
  useEffect(() => {
    if (content && !isStreaming) {
      console.log('\n========== Markdown 内容调试 ==========');
      console.log('原始内容长度:', content.length);
      console.log('增强后内容长度:', enhancedContent.length);
      
      // 查找包含多个空格的行
      const linesWithSpaces = content.split('\n').filter(line => /\s{2,}/.test(line));
      console.log('\n包含多空格的行数:', linesWithSpaces.length);
      if (linesWithSpaces.length > 0) {
        console.log('示例行:');
        linesWithSpaces.slice(0, 5).forEach((line, idx) => {
          console.log(`  ${idx + 1}. "${line}"`);
        });
      }
      
      // 检测 Markdown 表格
      const tableLines = content.split('\n').filter(line => line.trim().startsWith('|'));
      console.log('\n包含表格标记的行数:', tableLines.length);
      if (tableLines.length > 0) {
        console.log('✅ 检测到标准 Markdown 表格!');
        console.log('表格内容预览:');
        tableLines.slice(0, 6).forEach((line, idx) => {
          console.log(`  ${idx + 1}. ${line}`);
        });
      }
      
      // 显示转换差异
      if (content !== enhancedContent) {
        console.log('\n✅ 内容已增强（检测到表格并转换）');
        console.log('\n增强后内容片段:');
        const enhancedLines = enhancedContent.split('\n');
        const tableStart = enhancedLines.findIndex(line => line.startsWith('|'));
        if (tableStart >= 0) {
          console.log(enhancedLines.slice(tableStart, tableStart + 5).join('\n'));
        }
      } else {
        console.log('\n⚠️ 内容未增强（未检测到可转换的表格或已是标准格式）');
      }
      
      console.log('\n原始内容完整输出:');
      console.log(content);
      
      // 延迟检查渲染后的 HTML
      setTimeout(() => {
        const markdownDiv = document.querySelector('.markdown-content');
        const tables = markdownDiv?.querySelectorAll('table');
        console.log('\n========== 渲染结果检查 ==========');
        console.log('在 DOM 中找到的 <table> 元素数量:', tables?.length || 0);
        if (tables && tables.length > 0) {
          console.log('✅ 表格已渲染!');
          tables.forEach((table, idx) => {
            console.log(`表格 ${idx + 1}:`, table);
            console.log('  行数:', table.querySelectorAll('tr').length);
            console.log('  列数:', table.querySelectorAll('th').length);
          });
        } else {
          console.log('❌ 未找到渲染的表格元素');
          console.log('markdown-content 的 HTML:', markdownDiv?.innerHTML.substring(0, 500));
        }
        console.log('========================================\n');
      }, 500);
      
      console.log('========================================\n');
    }
  }, [content, enhancedContent, isStreaming]);
  
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Markdown 渲染（流式结束后）</h2>
      <p className="text-sm text-slate-500 mb-4">
        流式阶段不解析 Markdown，结束后一次性渲染，避免频繁重排。
      </p>
      
      {/* 详细调试信息面板 */}
      {!isStreaming && content && (
        <details className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-blue-600">
            🔍 详细调试信息（点击展开查看原始内容）
          </summary>
          <div className="mt-3 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-white rounded border">
                <div className="font-semibold text-slate-600 mb-1">原始长度</div>
                <div className="text-lg font-mono">{content.length} 字符</div>
              </div>
              <div className="p-2 bg-white rounded border">
                <div className="font-semibold text-slate-600 mb-1">增强后长度</div>
                <div className="text-lg font-mono">{enhancedContent.length} 字符</div>
              </div>
              <div className="p-2 bg-white rounded border">
                <div className="font-semibold text-slate-600 mb-1">多空格行</div>
                <div className="text-lg font-mono">
                  {content.split('\n').filter(line => /\s{2,}/.test(line)).length} 行
                </div>
              </div>
              <div className="p-2 bg-white rounded border">
                <div className="font-semibold text-slate-600 mb-1">内容变化</div>
                <div className="text-lg font-mono">
                  {content === enhancedContent ? '❌ 未变化' : '✅ 已增强'}
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-1 text-slate-700">原始内容（完整）:</div>
              <pre className="bg-white p-3 rounded border border-slate-300 overflow-x-auto text-xs max-h-64 overflow-y-auto whitespace-pre-wrap">
                {content}
              </pre>
            </div>
            
            {content !== enhancedContent && (
              <div>
                <div className="font-semibold mb-1 text-slate-700">增强后内容（完整）:</div>
                <pre className="bg-white p-3 rounded border border-slate-300 overflow-x-auto text-xs max-h-64 overflow-y-auto whitespace-pre-wrap">
                  {enhancedContent}
                </pre>
              </div>
            )}
          </div>
        </details>
      )}
      
      <div className="markdown-content">
        {isStreaming ? (
          <p className="text-slate-400">流式阶段进行中，等待完成后展示 Markdown...</p>
        ) : enhancedContent ? (
          <>
            {/* 检测表格 */}
            {enhancedContent.includes('|') && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <strong>✅ 检测到 Markdown 表格</strong> (包含 | 字符)
                <br />
                表格行数: {enhancedContent.split('\n').filter(line => line.includes('|')).length}
              </div>
            )}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{enhancedContent}</ReactMarkdown>
          </>
        ) : (
          <p className="text-slate-400">
            暂无内容（content 为空或 undefined）
            <br />
            <span className="text-xs">请查看 Console 日志获取详细信息</span>
          </p>
        )}
      </div>
      <style jsx>{`
        .markdown-content {
          @apply max-w-none text-slate-900;
        }

        .markdown-content :global(h1) {
          @apply text-2xl font-bold text-slate-900 mt-6 mb-4;
        }

        .markdown-content :global(h2) {
          @apply text-xl font-bold text-slate-900 mt-5 mb-3;
        }

        .markdown-content :global(h3) {
          @apply text-lg font-semibold text-slate-900 mt-4 mb-2;
        }

        .markdown-content :global(h4) {
          @apply text-base font-semibold text-slate-900 mt-3 mb-2;
        }

        .markdown-content :global(p) {
          @apply text-slate-700 leading-7 mb-4;
        }

        .markdown-content :global(strong) {
          @apply font-bold text-slate-900;
        }

        .markdown-content :global(em) {
          @apply italic text-slate-800;
        }

        .markdown-content :global(code) {
          @apply bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono;
        }

        .markdown-content :global(pre) {
          @apply bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto mb-4;
        }

        .markdown-content :global(pre code) {
          @apply bg-transparent text-slate-100 p-0;
        }

        .markdown-content :global(ul) {
          @apply list-disc list-outside ml-6 mb-4 space-y-2;
        }

        .markdown-content :global(ol) {
          @apply list-decimal list-outside ml-6 mb-4 space-y-2;
        }

        .markdown-content :global(li) {
          @apply text-slate-700 leading-7;
        }

        .markdown-content :global(li > p) {
          @apply mb-2;
        }

        .markdown-content :global(blockquote) {
          @apply border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-slate-700 italic;
        }

        .markdown-content :global(hr) {
          @apply border-slate-300 my-6;
        }

        .markdown-content :global(a) {
          @apply text-blue-600 hover:text-blue-700 underline;
        }

        /* 表格样式 - 关键 */
        .markdown-content :global(table) {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #cbd5e1;
          margin: 1.5rem 0;
          font-size: 0.875rem;
          display: table !important;
          visibility: visible !important;
        }

        .markdown-content :global(thead) {
          background-color: #f1f5f9;
        }

        .markdown-content :global(th) {
          border: 1px solid #cbd5e1;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #0f172a;
          background-color: #f1f5f9;
        }

        .markdown-content :global(td) {
          border: 1px solid #cbd5e1;
          padding: 0.75rem 1rem;
          color: #334155;
        }

        .markdown-content :global(tbody tr:nth-child(even)) {
          background-color: #f8fafc;
        }

        .markdown-content :global(tbody tr:hover) {
          background-color: #dbeafe;
        }
        
        .markdown-content :global(tbody tr) {
          border-bottom: 1px solid #cbd5e1;
        }
      `}</style>
    </section>
  );
}

function Spinner() {
  return (
    <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  );
}

