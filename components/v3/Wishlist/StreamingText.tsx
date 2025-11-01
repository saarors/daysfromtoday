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
 * 优化的流式文本组件（ChatGPT 风格）
 * 
 * 核心策略：
 * 1. 使用 requestAnimationFrame 批量渲染
 * 2. 每帧显示固定字符数，模拟"缓释"效果
 * 3. 流式阶段：纯文本 | 完成后：Markdown 渲染
 */
export const StreamingText = memo(function StreamingText({ 
  content, 
  isStreaming,
  className = '' 
}: StreamingTextProps) {
  
  // 使用 Hook 处理流式渲染
  const displayText = useStreamedText(content, isStreaming, {
    charsPerFrame: 10, // 每帧 10 个字符
  });

  if (!displayText && !content) {
    return null;
  }

  return (
    <div 
      className={`${className}`}
      style={{
        // 使用 contain 隔离布局计算
        contain: 'layout',
        // 启用 GPU 加速
        willChange: 'contents',
      }}
    >
      {isStreaming ? (
        // 流式阶段：纯文本显示（渐进式出现）
        <div className="text-gray-700 leading-7 font-sans whitespace-pre-wrap">
          {displayText}
          <span className="inline-block w-0.5 h-4 bg-blue-600 ml-1 animate-pulse" />
        </div>
      ) : (
        // 完成阶段：Markdown 渲染（一次性）
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

