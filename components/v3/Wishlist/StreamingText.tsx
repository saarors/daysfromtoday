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
 * 优化的流式文本组件
 * 
 * 核心策略：
 * 1. 流式阶段和完成阶段都使用纯文本显示
 * 2. 避免频繁的 Markdown 解析
 * 3. 使用 CSS 隔离渲染
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
        // 使用 contain 隔离布局计算
        contain: 'layout',
      }}
    >
      {isStreaming ? (
        // 流式阶段：纯文本显示，保持 Markdown 语法可见
        <div className="text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
          {content}
          <span className="inline-block w-0.5 h-4 bg-blue-600 ml-1 animate-pulse" />
        </div>
      ) : (
        // 完成阶段：Markdown 渲染
        <div className="prose prose-blue max-w-none markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // 只在内容或状态改变时重渲染
  return prevProps.content === nextProps.content && 
         prevProps.isStreaming === nextProps.isStreaming;
});

StreamingText.displayName = 'StreamingText';

