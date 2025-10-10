/**
 * MDX Content Renderer
 * 
 * 核心渲染器：将 MDX 内容渲染为 React 组件
 * - 集成所有 17 个自定义 MDX 组件
 * - 自定义 HTML 元素样式（h1/h2/p/a/img 等）
 * - 支持代码高亮、图片优化、链接处理
 */

import { useMDXComponent } from 'next-contentlayer/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

// 导入所有 MDX 组件
import {
  // 基础展示组件
  ImageWithCaption,
  VideoEmbed,
  Quote,
  CodeBlock,
  Highlight,
  InlineLink,
  StatCard,
  // 功能植入组件
  EmbedCalculator,
  AddAnniversary,
  FeatureCard,
  CountdownDisplay,
  // 交互增强组件
  Accordion,
  Tabs,
  Tab,
  Callout,
  StepGuide,
  Step,
  ComparisonTable,
  ToggleContent,
} from '@/components/mdx';

/**
 * 自定义 HTML 元素映射
 * 
 * 将 MDX 中的标准 HTML 标签映射为自定义组件
 */
const mdxComponents = {
  // ========== 自定义 MDX 组件 ==========
  // 基础展示组件
  ImageWithCaption,
  VideoEmbed,
  Quote,
  CodeBlock,
  Highlight,
  InlineLink,
  StatCard,
  // 功能植入组件
  EmbedCalculator,
  AddAnniversary,
  FeatureCard,
  CountdownDisplay,
  // 交互增强组件
  Accordion,
  Tabs,
  Tab,
  Callout,
  StepGuide,
  Step,
  ComparisonTable,
  ToggleContent,

  // ========== HTML 元素重写 ==========
  // 标题
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">
      {children}
    </h3>
  ),
  h4: ({ children }: { children: ReactNode }) => (
    <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">
      {children}
    </h4>
  ),

  // 段落
  p: ({ children }: { children: ReactNode }) => (
    <p className="my-4 leading-7 text-gray-700 dark:text-gray-300">
      {children}
    </p>
  ),

  // 链接（内部链接用 Link，外部链接用 a）
  a: ({ href, children }: { href?: string; children: ReactNode }) => {
    if (!href) return <span>{children}</span>;
    
    const isExternal = href.startsWith('http') || href.startsWith('//');
    const isAnchor = href.startsWith('#');

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {children}
        </a>
      );
    }

    if (isAnchor) {
      return (
        <a
          href={href}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {children}
      </Link>
    );
  },

  // 图片（使用 Next.js Image 优化）
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    if (!src) return null;

    // R2 图片（CDN 优化）
    if (src.startsWith('http')) {
      return (
        <Image
          src={src}
          alt={alt || ''}
          width={800}
          height={600}
          className="rounded-lg my-6"
          loading="lazy"
        />
      );
    }

    // 本地图片
    return (
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={600}
        className="rounded-lg my-6"
        loading="lazy"
      />
    );
  },

  // 列表
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="leading-7">{children}</li>
  ),

  // 代码
  code: ({ children }: { children: ReactNode }) => (
    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-pink-600 dark:text-pink-400">
      {children}
    </code>
  ),
  pre: ({ children }: { children: ReactNode }) => (
    <pre className="my-4 p-4 bg-gray-900 dark:bg-gray-950 rounded-lg overflow-x-auto">
      {children}
    </pre>
  ),

  // 引用
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-blue-500 italic text-gray-700 dark:text-gray-300">
      {children}
    </blockquote>
  ),

  // 分割线
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,

  // 表格
  table: ({ children }: { children: ReactNode }) => (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: ReactNode }) => (
    <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
  ),
  tbody: ({ children }: { children: ReactNode }) => <tbody>{children}</tbody>,
  tr: ({ children }: { children: ReactNode }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {children}
    </tr>
  ),
  th: ({ children }: { children: ReactNode }) => (
    <th className="px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-600">
      {children}
    </th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
      {children}
    </td>
  ),
};

/**
 * MDX Content 组件
 */
interface MDXContentProps {
  code: string;  // Contentlayer 生成的 MDX 代码
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <Component components={mdxComponents} />
    </article>
  );
}

