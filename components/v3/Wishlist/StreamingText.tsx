'use client';

import { memo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
  className?: string;
}

/**
 * 流式文本组件（带渐显动画）
 * 
 * 策略：
 * 1. 流式阶段：纯文本 + 渐显动画
 * 2. 完成后：Markdown 渲染
 * 3. 使用 CSS transition 实现平滑过渡
 */
export const StreamingText = memo(function StreamingText({ 
  content, 
  isStreaming,
  className = '' 
}: StreamingTextProps) {
  
  const contentRef = useRef<HTMLDivElement>(null);
  const lastLengthRef = useRef(0);

  // 监听内容变化，添加渐显动画
  useEffect(() => {
    if (isStreaming && content.length > lastLengthRef.current) {
      const el = contentRef.current;
      if (el) {
        // 触发淡入动画
        el.style.opacity = '0.7';
        requestAnimationFrame(() => {
          el.style.opacity = '1';
        });
      }
      lastLengthRef.current = content.length;
    }
  }, [content, isStreaming]);

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
        // 流式阶段：纯文本显示 + 渐显效果
        <div 
          ref={contentRef}
          className="text-gray-700 leading-7 font-sans whitespace-pre-wrap"
          style={{
            transition: 'opacity 0.15s ease-out',
            opacity: 1,
          }}
        >
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

