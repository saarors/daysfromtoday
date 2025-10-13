/**
 * 博客文章增强组件
 * 提供更好的视觉效果和用户体验
 */

import React from 'react';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

interface BlogPostEnhancedProps {
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

export function BlogPostEnhanced({
  title,
  description,
  date,
  author,
  category,
  tags,
  readingTime,
  locale,
  children
}: BlogPostEnhancedProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPP', { 
      locale: locale === 'zh' ? zhCN : enUS 
    });
  };

  return (
    <div className="blog-post-container">
      {/* 文章标题 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        
        {/* 文章描述 */}
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        
        {/* 元信息 */}
        <div className="blog-meta">
          <div className="meta-item author">
            <span>{author}</span>
          </div>
          <div className="meta-item date">
            <span>{formatDate(date)}</span>
          </div>
          {readingTime && (
            <div className="meta-item reading-time">
              <span>{readingTime}</span>
            </div>
          )}
          <div className="meta-item category">
            <span>{category}</span>
          </div>
        </div>
        
        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="blog-tags">
            {tags.map((tag) => (
              <span key={tag} className="blog-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      
      {/* 文章内容 */}
      <article className="prose prose-lg max-w-none">
        {children}
      </article>
      
      {/* 文章底部 */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>📝 发布于 {formatDate(date)}</span>
          <span>👤 作者：{author}</span>
          <span>📂 分类：{category}</span>
        </div>
      </footer>
    </div>
  );
}

/**
 * 文章摘要组件
 */
export function ArticleSummary({ 
  summary, 
  points 
}: { 
  summary: string; 
  points: string[]; 
}) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8 rounded-r-lg">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">
        📋 文章摘要
      </h3>
      <p className="text-blue-800 mb-4">{summary}</p>
      <ul className="list-none space-y-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span className="text-blue-800">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 提示框组件
 */
export function TipBox({ 
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
    <div className={`border-l-4 p-4 my-6 rounded-r-lg ${styles[type]}`}>
      <h4 className="font-semibold mb-2 flex items-center">
        <span className="mr-2">{icons[type]}</span>
        {title}
      </h4>
      <div>{children}</div>
    </div>
  );
}

/**
 * 代码示例组件
 */
export function CodeExample({ 
  title, 
  children, 
  language = 'javascript' 
}: { 
  title: string;
  children: string;
  language?: string;
}) {
  return (
    <div className="my-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">
        📝 {title}
      </h4>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}
