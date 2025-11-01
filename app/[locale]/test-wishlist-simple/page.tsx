'use client';

import { useState } from 'react';
import { StreamingText } from '@/components/v3/Wishlist/StreamingText';

/**
 * 简化的 Wishlist 测试页面
 * 
 * 直接测试 StreamingText 组件
 */
export default function TestWishlistSimplePage() {
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = async () => {
    setContent('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/ai/chat/stream', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalText: '测试流式输出',
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
      let contentBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'content') {
                contentBuffer += parsed.delta;
                // 🔥 直接更新 content（让 useStreamedText 处理显示）
                setContent(contentBuffer);
              }
            } catch (e) {
              console.warn('Parse error:', e);
            }
          }
        }
      }

      setIsStreaming(false);
    } catch (err: any) {
      console.error('Stream error:', err);
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🧪 StreamingText 组件测试</h1>
        
        <button
          onClick={startStream}
          disabled={isStreaming}
          className="mb-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isStreaming ? '正在流式输出...' : '开始测试'}
        </button>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="mb-4">
            <span className="font-medium">isStreaming: </span>
            <span className={isStreaming ? 'text-green-600' : 'text-gray-400'}>
              {isStreaming ? 'true ✅' : 'false'}
            </span>
          </div>

          <div className="mb-4">
            <span className="font-medium">content.length: </span>
            <span className="text-blue-600">{content.length} 字符</span>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">📝 StreamingText 组件输出：</p>
            <div className="bg-gray-50 p-4 rounded border min-h-[200px]">
              <StreamingText 
                content={content}
                isStreaming={isStreaming}
                className=""
              />
            </div>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-medium mb-2">🔍 测试要点：</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>观察文字是否逐字出现（不是一次性蹦出）</li>
            <li>观察 content.length 是否实时增加</li>
            <li>如果 content.length 增加但文字不出现 → useStreamedText Hook 问题</li>
            <li>如果 content.length 一直是 0 → fetch 解析问题</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

