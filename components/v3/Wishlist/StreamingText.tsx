'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStreamedText } from '@/hooks/useStreamedText';

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
  className?: string;
}

/**
 * 流式文本组件（rAF 缓释版）
 * 
 * 核心策略（参考 ChatGPT 最佳实践）：
 * 1. 流式阶段：使用 useStreamedText Hook（rAF + 队列）
 * 2. 每帧显示固定字符数，按词切分
 * 3. 完成后：一次性 Markdown 渲染
 */
export const StreamingText = memo(function StreamingText({ 
  content, 
  isStreaming,
  className = '' 
}: StreamingTextProps) {
  
  // 使用 rAF 缓释 Hook
  const displayText = useStreamedText({
    sourceText: content,
    isStreaming,
    speed: 'normal', // 可调整：slow / normal / fast
  });

  if (!content && !displayText) {
    return null;
  }

  return (
    <div 
      className={`${className}`}
      style={{
        contain: 'layout',
      }}
    >
      {isStreaming ? (
        // 流式阶段：纯文本显示（rAF 控制渐进）
        <div className="prose max-w-none whitespace-pre-wrap leading-7 text-gray-700 font-sans">
          {displayText}
          <Cursor />
        </div>
      ) : (
        // 完成阶段：一次性 Markdown 渲染
        <div className="prose prose-blue max-w-none markdown-content leading-7">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
});

StreamingText.displayName = 'StreamingText';

// 光标组件
function Cursor() {
  return (
    <span className="ml-0.5 inline-block h-5 w-0.5 align-baseline bg-blue-600 animate-pulse" />
  );
}

