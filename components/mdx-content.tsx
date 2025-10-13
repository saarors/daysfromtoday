/**
 * MDX 内容渲染组件
 * 
 * 功能：
 * 1. 渲染 Contentlayer 生成的 MDX 内容
 * 2. 提供自定义组件映射
 * 3. 错误处理和回退机制
 * 4. 支持语法高亮和样式
 * 
 * 符合项目规范：
 * - TypeScript 严格模式
 * - 错误边界处理
 * - 性能优化
 */
import { useMDXComponent } from 'next-contentlayer/hooks';
import { ReactNode } from 'react';

// 自定义 MDX 组件映射
const mdxComponents = {
  // 标题组件
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100" style={{ color: '#111827' }}>
      {children}
    </h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-3xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100" style={{ color: '#111827' }}>
      {children}
    </h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100" style={{ color: '#111827' }}>
      {children}
    </h3>
  ),
  h4: ({ children }: { children: ReactNode }) => (
    <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100" style={{ color: '#111827' }}>
      {children}
    </h4>
  ),

  // 段落和文本
  p: ({ children }: { children: ReactNode }) => (
    <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" style={{ color: '#374151' }}>
      {children}
    </p>
  ),
  strong: ({ children }: { children: ReactNode }) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" style={{ color: '#111827' }}>
      {children}
    </strong>
  ),
  em: ({ children }: { children: ReactNode }) => (
    <em className="italic text-gray-800 dark:text-gray-200" style={{ color: '#1F2937' }}>
      {children}
    </em>
  ),

  // 列表
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="mb-4 ml-6 list-disc text-gray-700 dark:text-gray-300" style={{ color: '#374151' }}>
      {children}
    </ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="mb-4 ml-6 list-decimal text-gray-700 dark:text-gray-300" style={{ color: '#374151' }}>
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="mb-1">
      {children}
    </li>
  ),

  // 链接
  a: ({ href, children }: { href?: string; children: ReactNode }) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  // 代码
  code: ({ children }: { children: ReactNode }) => (
    <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children }: { children: ReactNode }) => (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
      {children}
    </pre>
  ),

  // 引用
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">
      {children}
    </blockquote>
  ),

  // 分割线
  hr: () => (
    <hr className="my-8 border-gray-300 dark:border-gray-600" />
  ),

  // 表格
  table: ({ children }: { children: ReactNode }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: { children: ReactNode }) => (
    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left">
      {children}
    </th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
      {children}
    </td>
  ),
};

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  // 安全检查
  if (!code || typeof code !== 'string') {
    return (
      <div className="max-w-none">
        <p className="text-gray-500 italic" style={{ color: '#6B7280' }}>Content is being processed...</p>
      </div>
    );
  }

  try {
    const Component = useMDXComponent(code);
    return (
      <div className="max-w-none" style={{ color: '#374151' }}>
        <Component components={mdxComponents} />
      </div>
    );
  } catch (error) {
    console.error('MDX rendering error:', error);
    return (
      <div className="max-w-none">
        <p className="text-red-500" style={{ color: '#EF4444' }}>Error rendering content. Please try again later.</p>
      </div>
    );
  }
}
