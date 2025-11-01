'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
  className?: string;
}

/**
 * 简化的流式文本组件
 * 
 * 策略：
 * 1. 流式阶段：纯文本显示
 * 2. 完成后：Markdown 渲染
 * 3. 使用 CSS 优化避免频闪
 */
export const StreamingText = memo(function StreamingText({ 
  content, 
  isStreaming,
  className = '' 
}: StreamingTextProps) {
  
  if (!content) {
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
        // 流式阶段：纯文本显示
        <div className="text-gray-700 leading-7 font-sans whitespace-pre-wrap">
          {content}
          <span className="inline-block w-0.5 h-4 bg-blue-600 ml-1 animate-pulse" />
        </div>
      ) : (
        // 完成阶段：Markdown 渲染
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

