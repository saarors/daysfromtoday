/**
 * 博客文章标准组件
 * 
 * 可复用的博客文章展示组件，包含：
 * - 文章头部（标题、作者、日期等）
 * - 文章内容（支持 Markdown）
 * - CTA 区域
 * - 相关文章
 */

'use client';

import Link from 'next/link';
import { processMarkdown, getCategoryColor } from '@/lib/blog-utils';
import type { BlogContent } from '@/types/blog';

interface BlogArticleProps {
  content: BlogContent['en'] | BlogContent['zh'];
  locale: string;
  category: string;
  slug: string;
  author: string;
}

export default function BlogArticle({ 
  content, 
  locale, 
  category,
  author 
}: BlogArticleProps) {
  
  const text = {
    en: {
      tryDaysFromToday: 'Try DaysFromToday',
      tryDescription: 'Experience zero-friction date calculation now',
      getStarted: 'Get Started',
      backToBlog: 'Back to Blog',
    },
    zh: {
      tryDaysFromToday: '试试 DaysFromToday',
      tryDescription: '立即体验零摩擦的日期计算',
      getStarted: '开始使用',
      backToBlog: '返回博客',
    },
  };
  
  const t = text[locale as keyof typeof text] || text.en;
  
  const categoryText = {
    'Story': { en: 'Founder Story', zh: '创始人故事' },
    'Guide': { en: 'Guide', zh: '指南' },
    'News': { en: 'News', zh: '新闻' },
    'Update': { en: 'Update', zh: '更新' },
  };
  
  const categoryLabel = categoryText[category as keyof typeof categoryText]?.[locale as 'en' | 'zh'] || category;

  return (
    <article className="mt-8">
      {/* Article Header */}
      <header className="mb-16 text-center">
        <div className={`inline-block px-5 py-2 ${getCategoryColor(category)} text-white rounded-full text-sm font-medium mb-8 shadow-lg`}>
          🕰️ {categoryLabel}
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
          {content.title}
        </h1>
        
        <div className="flex items-center justify-center gap-6 text-gray-600 text-lg">
          <span>📅 {content.date}</span>
          <span className="text-gray-400">|</span>
          <span>⏱️ {content.readTime}</span>
          <span className="text-gray-400">|</span>
          <span>✍️ {author}</span>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {content.sections.map((section, index) => (
          <section key={index} className="mb-16">
            {/* 添加分隔线（第一段除外） */}
            {index > 0 && (
              <div className="my-12 flex items-center justify-center">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <div className="mx-4 text-gray-400">⸻</div>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
            )}
            
            {section.heading && (
              <h2 className="text-3xl font-bold mb-8 text-gray-900 border-l-4 border-blue-600 pl-6">
                {section.heading}
              </h2>
            )}
            
            <div className="space-y-6">
              {section.content.map((paragraph, pIndex) => {
                // 空段落用于段落间距
                if (paragraph === '') {
                  return <div key={pIndex} className="h-4"></div>;
                }
                
                // 引用块（以 > 开头）
                if (paragraph.startsWith('>')) {
                  return (
                    <blockquote key={pIndex} className="pl-6 border-l-4 border-blue-300 bg-blue-50 py-4 pr-4 rounded-r-lg italic text-gray-700">
                      {processMarkdown(paragraph.slice(1).trim())}
                    </blockquote>
                  );
                }
                
                return (
                  <p key={pIndex} className="text-gray-700 leading-relaxed text-lg">
                    {processMarkdown(paragraph)}
                  </p>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl text-center shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">
          {t.tryDaysFromToday}
        </h3>
        <p className="text-gray-600 mb-6">
          {t.tryDescription}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          {t.getStarted}
        </Link>
      </div>

      {/* Back to Blog */}
      <div className="mt-12 text-center">
        <Link
          href={`/${locale}/blog`}
          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
        >
          <span>←</span>
          <span>{t.backToBlog}</span>
        </Link>
      </div>
    </article>
  );
}

