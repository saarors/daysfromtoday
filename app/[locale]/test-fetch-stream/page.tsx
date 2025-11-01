'use client';

import { useEffect, useState } from 'react';

/**
 * 最小化浏览器 fetch 流式测试
 * 
 * 测试浏览器是否能正确处理 ReadableStream
 */
export default function TestFetchStreamPage() {
  const [chunks, setChunks] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('准备中...');

  const startTest = async () => {
    setChunks([]);
    setText('');
    setStatus('🔄 开始测试...');

    try {
      const response = await fetch('/api/ai/chat/stream', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalText: '测试：说3句话',
          daysCount: 30,
          targetDate: '2026-02-01',
          personaCode: 'coach',
          language: 'zh'
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Stream error');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let chunkCount = 0;

      setStatus('✅ 连接成功，开始接收...');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.delta || parsed.content) {
                chunkCount++;
                const delta = parsed.delta || parsed.content || '';
                const timestamp = new Date().toISOString().slice(17, 23);
                
                // 立即显示
                setText(prev => prev + delta);
                setChunks(prev => [...prev, `[${chunkCount}] ${timestamp} → "${delta}"`]);
                setStatus(`📡 接收中... (${chunkCount} chunks)`);
                
                // 🔥 关键：立即强制渲染
                await new Promise(resolve => setTimeout(resolve, 0));
              }
            } catch (e) {
              console.warn('Parse error:', e);
            }
          }
        }
      }

      setStatus(`✅ 完成！共接收 ${chunkCount} 个 chunks`);
    } catch (err: any) {
      setStatus(`❌ 错误: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🧪 浏览器 Fetch Stream 测试</h1>
        
        <button
          onClick={startTest}
          className="mb-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          开始测试
        </button>

        <div className="bg-white rounded-lg p-6 shadow mb-4">
          <div className="mb-4">
            <span className="font-medium">状态：</span>
            <span className="text-blue-600 ml-2">{status}</span>
          </div>

          <div className="border-t pt-4 mb-4">
            <p className="text-sm text-gray-500 mb-2">📝 接收内容：</p>
            <div className="bg-gray-50 p-4 rounded border max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">{text || '（等待...）'}</pre>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">
              ⏱️ Chunk 时间轴（{chunks.length} 条）：
            </p>
            <div className="bg-gray-50 p-4 rounded border max-h-64 overflow-y-auto">
              {chunks.map((chunk, i) => (
                <div key={i} className="text-xs font-mono text-gray-700 mb-1">
                  {chunk}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <p className="font-medium mb-2">🔍 诊断标准：</p>
          <ul className="list-disc list-inside space-y-1 text-yellow-800">
            <li><strong>正常</strong>：Chunk 时间轴逐条出现，时间间隔 0.1-0.5 秒</li>
            <li><strong>异常</strong>：等很久，最后一次性全部出现</li>
            <li><strong>curl 已验证后端正常</strong>，如果浏览器还异常 → 浏览器环境问题</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

