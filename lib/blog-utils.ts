/**
 * 博客工具函数
 * 
 * 用于生成博客相关的 SEO 元数据、JSON-LD 等
 */

import React from 'react';
import type { Metadata } from 'next';
import type { BlogPost, BlogPostJsonLd, BlogMetadata } from '@/types/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
const SITE_NAME = 'DaysFromToday';

/**
 * 生成博客文章的 Next.js Metadata
 */
export function generateBlogMetadata(
  post: BlogPost,
  locale: string
): Metadata {
  const isZh = locale === 'zh';
  const title = isZh ? post.title.zh : post.title.en;
  const description = isZh ? post.description.zh : post.description.en;
  const url = `${SITE_URL}/${locale}/blog/${post.slug}`;
  
  return {
    title,
    description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: {
      canonical: url,
      languages: {
        'en': `${SITE_URL}/en/blog/${post.slug}`,
        'zh': `${SITE_URL}/zh/blog/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.ogImage ? [
        {
          url: post.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
  };
}

/**
 * 生成博客文章的 JSON-LD 结构化数据
 */
export function generateBlogJsonLd(
  post: BlogPost,
  locale: string
): BlogPostJsonLd {
  const isZh = locale === 'zh';
  const title = isZh ? post.title.zh : post.title.en;
  const description = isZh ? post.description.zh : post.description.en;
  const url = `${SITE_URL}/${locale}/blog/${post.slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    image: post.cover || post.ogImage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.keywords,
  };
}

/**
 * 处理 Markdown 粗体语法
 * 
 * @param text 要处理的文本
 * @returns 处理后的内容数组
 */
export function processMarkdown(text: string): (string | React.ReactElement)[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return React.createElement('strong', { 
        key: i, 
        className: 'font-bold text-gray-900' 
      }, part.slice(2, -2));
    }
    return part;
  });
}

/**
 * 格式化日期
 */
export function formatBlogDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  
  if (locale === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 估算阅读时间（基于字数）
 */
export function estimateReadTime(content: string, locale: string): string {
  const wordsPerMinute = locale === 'zh' ? 300 : 200; // 中文每分钟300字，英文200词
  const wordCount = locale === 'zh' 
    ? content.length // 中文按字数
    : content.split(/\s+/).length; // 英文按单词数
  
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return locale === 'zh' 
    ? `${minutes} 分钟阅读` 
    : `${minutes} min read`;
}

/**
 * 生成面包屑导航数据
 */
export function generateBlogBreadcrumb(
  post: BlogPost,
  locale: string
) {
  const isZh = locale === 'zh';
  const title = isZh ? post.title.zh : post.title.en;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isZh ? '首页' : 'Home',
        item: `${SITE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isZh ? '博客' : 'Blog',
        item: `${SITE_URL}/${locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${SITE_URL}/${locale}/blog/${post.slug}`,
      },
    ],
  };
}

/**
 * 验证博客文章数据
 */
export function validateBlogPost(post: BlogPost): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // 检查必填字段
  if (!post.slug) errors.push('Missing slug');
  if (!post.title.en || !post.title.zh) errors.push('Missing title (en or zh)');
  if (!post.author) errors.push('Missing author');
  if (!post.date) errors.push('Missing date');
  
  // 检查描述长度
  if (post.description.en.length < 120 || post.description.en.length > 160) {
    errors.push('English description should be 120-160 characters');
  }
  if (post.description.zh.length < 80 || post.description.zh.length > 120) {
    errors.push('Chinese description should be 80-120 characters');
  }
  
  // 检查关键词数量
  if (post.keywords.length < 3 || post.keywords.length > 8) {
    errors.push('Keywords should be 3-8 items');
  }
  
  // 检查分类
  const validCategories = ['Story', 'Guide', 'News', 'Update'];
  if (!validCategories.includes(post.category.en)) {
    errors.push('Invalid category');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 获取分类的中文翻译
 */
export function getCategoryTranslation(category: string): string {
  const translations: Record<string, string> = {
    'Story': '故事',
    'Guide': '指南',
    'News': '新闻',
    'Update': '更新',
  };
  
  return translations[category] || category;
}

/**
 * 生成分类颜色样式
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Story': 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600',
    'Guide': 'bg-blue-600',
    'News': 'bg-green-600',
    'Update': 'bg-orange-600',
  };
  
  return colors[category] || 'bg-gray-600';
}

