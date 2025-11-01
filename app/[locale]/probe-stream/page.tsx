'use client';

import { useEffect, useState } from 'react';

/**
 * 保底流式输出测试页面
 * 
 * 不使用 rAF、不使用 Markdown
 * 只要后端真在流，中途就会出现文字
 */
export default function ProbeStreamPage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('准备中...');
  const [chunks, setChunks] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setStatus('🔄 正在连接 AI...');
        
        const response = await fetch('/api/ai/chat/stream', {
          method: 'POST',
          cache: 'no-store',           // 🔥 防止缓存
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            goalText: '测试流式输出：说5句话，逐步输出',
            daysCount: 30,
            targetDate: '2026-02-01',
            personaCode: 'coach',
            goalTypeCode: 'health',
            difficultyLevel: 'medium',
            language: 'zh'
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setStatus('✅ 连接成功，开始接收数据...');

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let pending = '';
        let chunkCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setStatus('✅ 流式输出完成');
            break;
          }

          pending += decoder.decode(value, { stream: true });
          const lines = pending.split(/\r?\n/);
          pending = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]') continue;
            if (!data) continue;

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'content' || parsed.type === 'thinking') {
                const delta = parsed.delta || '';
                if (delta) {
                  chunkCount++;
                  // 🔥 直接 append（保底，不做任何节流）
                  setText((prev) => prev + delta);
                  setChunks((prev) => [...prev, `[${chunkCount}] ${new Date().toISOString().slice(17, 23)} → ${delta.slice(0, 20)}...`]);
                  setStatus(`📡 正在接收... (已收到 ${chunkCount} 个 chunk)`);
                }
              }
            } catch (e) {
              console.warn('解析失败:', e, data);
            }
          }
        }
      } catch (err: any) {
        setStatus(`❌ 出错: ${err.message}`);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🧪 保底流式输出测试</h1>
        
        <div className="bg-white rounded-lg p-6 mb-4 shadow">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-medium">状态：</span>
            <span className="text-blue-600">{status}</span>
          </div>

          <div className="border-t pt-4 mb-4">
            <p className="text-sm text-gray-500 mb-2">
              📝 接收到的内容（{text.length} 字符）：
            </p>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto">
              {text || '（等待数据...）'}
            </pre>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">
              📊 Chunk 接收时间轴（共 {chunks.length} 个）：
            </p>
            <div className="bg-gray-50 p-4 rounded border max-h-48 overflow-y-auto">
              {chunks.length > 0 ? (
                chunks.map((chunk, i) => (
                  <div key={i} className="text-xs font-mono text-gray-700 mb-1">
                    {chunk}
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400">（等待 chunk...）</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <p className="font-medium text-yellow-900 mb-2">🔍 诊断标准：</p>
          <ul className="list-disc list-inside space-y-1 text-yellow-800">
            <li><strong>理想状态</strong>：Chunk 时间轴每 0.1-0.5 秒出现新条目 → 后端流式正常 ✅</li>
            <li><strong>问题状态</strong>：时间轴空白，最后一次性全部出现 → 中间层缓冲 ❌</li>
            <li><strong>如果是后者</strong>：问题在 Edge Runtime / Cloudflare / 响应头，不在前端 rAF</li>
          </ul>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-medium text-blue-900 mb-2">🔧 下一步操作：</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>测试简单调试路由：<code className="bg-white px-2 py-0.5 rounded">/api/_debug/stream</code></li>
            <li>打开 DevTools Network 面板，查看 Response 是否逐行出现</li>
            <li>检查响应头是否包含 <code className="bg-white px-2 py-0.5 rounded">Content-Encoding: identity</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

