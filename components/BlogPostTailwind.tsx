/**
 * 使用 Tailwind CSS 的博客文章组件
 * 无需额外 CSS 文件，直接使用 Tailwind 类
 */

import React from 'react';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

interface BlogPostTailwindProps {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime?: string;
  locale: string;
  children: React.ReactNode;
}

export function BlogPostTailwind({
  title,
  description,
  date,
  author,
  category,
  tags,
  readingTime,
  locale,
  children
}: BlogPostTailwindProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPP', { 
      locale: locale === 'zh' ? zhCN : enUS 
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* 文章标题区域 */}
      <header className="mb-12">
        {/* 主标题 */}
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
        </h1>
        
        {/* 副标题/描述 */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        
        {/* 元信息卡片 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👤</span>
              <span className="font-medium">{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <span className="font-medium">{formatDate(date)}</span>
            </div>
            {readingTime && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span className="font-medium">{readingTime}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-2xl">📂</span>
              <span className="font-medium">{category}</span>
            </div>
          </div>
        </div>
        
        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>
      
      {/* 文章内容 */}
      <article className="prose prose-lg prose-blue max-w-none">
        <div className="text-gray-700 leading-relaxed space-y-6">
          {children}
        </div>
      </article>
      
      {/* 文章底部 */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span>发布于 {formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span>作者：{author}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📂</span>
            <span>分类：{category}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * 美观的提示框组件
 */
export function TipBoxTailwind({ 
  type = 'info', 
  title, 
  children 
}: { 
  type?: 'info' | 'warning' | 'success' | 'error';
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };
  
  const icons = {
    info: '💡',
    warning: '⚠️',
    success: '✅',
    error: '❌'
  };
  
  return (
    <div className={`border-l-4 p-6 my-8 rounded-r-lg shadow-sm ${styles[type]}`}>
      <h4 className="font-semibold mb-3 flex items-center text-lg">
        <span className="mr-3 text-xl">{icons[type]}</span>
        {title}
      </h4>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

/**
 * 代码示例组件
 */
export function CodeExampleTailwind({ 
  title, 
  children, 
  language = 'javascript' 
}: { 
  title: string;
  children: string;
  language?: string;
}) {
  return (
    <div className="my-8">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <span className="mr-2">📝</span>
        {title}
      </h4>
      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto shadow-lg">
        <pre>
          <code className={`language-${language} text-sm`}>{children}</code>
        </pre>
      </div>
    </div>
  );
}

/**
 * 文章摘要组件
 */
export function ArticleSummaryTailwind({ 
  summary, 
  points 
}: { 
  summary: string; 
  points: string[]; 
}) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-8 my-10 rounded-r-xl shadow-sm">
      <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
        <span className="mr-3">📋</span>
        文章摘要
      </h3>
      <p className="text-blue-800 text-lg mb-6 leading-relaxed">{summary}</p>
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1 text-xl">✨</span>
            <span className="text-blue-800 leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
