/**
 * MDX Content Renderer - 极简版本
 * 
 * 基础渲染器：将 MDX 内容渲染为 React 组件
 * 使用 Tailwind 的 prose 类来简化样式
 */

import { useMDXComponent } from 'next-contentlayer/hooks';

/**
 * MDX 内容渲染器组件
 */
export function MDXContent({ code }: { code: string }) {
  // 安全检查：确保 code 存在且不为空
  if (!code || typeof code !== 'string') {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-500 italic">Content is being processed...</p>
      </div>
    );
  }

  try {
    const Component = useMDXComponent(code);
    
    return (
      <div className="prose dark:prose-invert max-w-none">
        <Component />
      </div>
    );
  } catch (error) {
    console.error('MDX rendering error:', error);
    return (
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-red-500">Error rendering content. Please try again later.</p>
      </div>
    );
  }
}