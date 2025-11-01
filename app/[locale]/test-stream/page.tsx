'use client';

import { useEffect, useState } from 'react';

/**
 * 流式输出测试页面（保底可见方案）
 * 
 * 目的：验证后端 SSE 是否真正流式输出
 * 不使用 rAF、不使用 Markdown，最小化干扰
 */
export default function TestStreamPage() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('准备中...');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setStatus('🔄 正在连接...');
        
        const response = await fetch('/api/ai/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            goalText: '测试流式输出效果',
            daysCount: 30,
            targetDate: '2026-02-01',
            personaCode: 'coach',
            goalTypeCode: 'health',
            difficultyLevel: 'medium',
            language: 'zh'
          }),
          cache: 'no-store',
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setStatus('✅ 连接成功，开始接收数据...');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setStatus('✅ 流式输出完成');
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]') continue;
            if (!data) continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.delta || parsed.content || '';
              
              // 🔥 关键：直接 append（不做任何节流）
              if (delta) {
                setText((prev) => prev + delta);
                setStatus('📡 正在接收...');
              }
            } catch (e) {
              console.warn('解析失败:', e, data);
            }
          }
        }
      } catch (err: any) {
        setError(err.message);
        setStatus('❌ 出错了');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🧪 流式输出测试</h1>
        
        <div className="bg-white rounded-lg p-6 mb-4 shadow">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-medium">状态：</span>
            <span className="text-blue-600">{status}</span>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-600 font-medium">错误：</p>
              <pre className="text-sm text-red-800 mt-2">{error}</pre>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">
              📝 接收到的内容（{text.length} 字符）：
            </p>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded border">
              {text || '（等待数据...）'}
            </pre>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-medium text-blue-900 mb-2">🔍 测试说明：</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>如果文字<strong>逐字出现</strong> → 后端流式正常 ✅</li>
            <li>如果<strong>空白到最后才一次性出现</strong> → 后端/代理缓冲 ❌</li>
            <li>如果<strong>连接错误</strong> → 检查 API 配置 ❌</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

