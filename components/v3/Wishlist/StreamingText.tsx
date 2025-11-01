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
 * 核心优化：
 * 1. 使用 memo 防止父组件更新时重渲染
 * 2. 流式阶段使用纯文本（快速渲染）
 * 3. 完成后使用 Markdown（格式化显示）
 * 4. 使用 transform: translateZ(0) 开启 GPU 加速
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
      className={`${className} transform-gpu`}
      style={{
        // GPU 加速，减少重绘
        transform: 'translateZ(0)',
        // 防止布局抖动
        willChange: 'auto',
      }}
    >
      {isStreaming ? (
        // 流式阶段：纯文本显示
        <div 
          className="text-gray-700 leading-relaxed"
          style={{
            // 使用 contain 属性隔离渲染
            contain: 'layout style paint',
            // 固定内容区域
            contentVisibility: 'auto',
          }}
        >
          <div 
            className="whitespace-pre-wrap font-sans"
            dangerouslySetInnerHTML={{ 
              __html: content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br/>')
            }}
          />
          {/* 光标 */}
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
  // 自定义比较函数：只有在内容或状态真正改变时才重渲染
  return prevProps.content === nextProps.content && 
         prevProps.isStreaming === nextProps.isStreaming;
});

StreamingText.displayName = 'StreamingText';

