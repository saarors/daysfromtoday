/**
 * Wish Book 详情页
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import TopNav from '@/components/TopNav';

// 时间维度配置
const TIME_DIMENSIONS = {
  '7-days': { label: '7天', emoji: '⚡' },
  '30-days': { label: '30天', emoji: '🌱' },
  '90-days': { label: '90天', emoji: '🎯' },
  '100-days': { label: '100天', emoji: '💯' },
  '180-days': { label: '180天', emoji: '📈' },
  '365-days': { label: '365天', emoji: '🏆' },
  '3-years': { label: '3年', emoji: '🌟' },
  '5-years': { label: '5年', emoji: '🚀' }
};

// 类别配置
const CATEGORIES = {
  fitness: { name: '健身', emoji: '💪' },
  learning: { name: '学习', emoji: '📚' },
  career: { name: '职业', emoji: '💼' },
  personal_growth: { name: '成长', emoji: '🌱' },
  relationships: { name: '关系', emoji: '❤️' },
  creative: { name: '创意', emoji: '🎨' },
  lifestyle: { name: '生活', emoji: '🏠' },
  mental_health: { name: '心理', emoji: '🧠' }
};

// 难度配置
const DIFFICULTY_LEVELS = {
  easy: { label: '简单', emoji: '😊', color: 'green' },
  medium: { label: '中等', emoji: '💪', color: 'blue' },
  hard: { label: '困难', emoji: '🔥', color: 'orange' },
  expert: { label: '专家', emoji: '🏆', color: 'purple' }
};

// 生成静态路径（ISR）
// 注意：由于需要在构建时访问数据库，我们使用 dynamicParams = true
// 让 Next.js 按需生成页面，而不是预先生成所有页面

// 生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = createClient();
  
  const { data: book } = await supabase
    .from('wish_books')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .eq('status', 'published')
    .single();
  
  if (!book) {
    return {
      title: 'Not Found',
      robots: 'noindex, nofollow'
    };
  }
  
  return {
    title: book.meta_title || `${book.title} | 愿望宝典`,
    description: book.meta_description || book.subtitle,
    keywords: book.keywords,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/wish-books/${slug}`
    },
    openGraph: {
      title: book.title,
      description: book.subtitle,
      url: `https://www.daysfromtoday.ai/${locale}/wish-books/${slug}`,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      publishedTime: book.published_at,
      modifiedTime: book.updated_at,
      images: book.og_image_url ? [{ 
        url: book.og_image_url,
        width: 1200,
        height: 630,
        alt: book.title 
      }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: book.title,
      description: book.subtitle,
      images: book.og_image_url ? [book.og_image_url] : []
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    }
  };
}

export default async function WishBookDetailPage({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}) {
  const { locale, slug } = await params;
  const supabase = createClient();
  
  // 获取卡片数据
  const { data: book, error } = await supabase
    .from('wish_books')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .eq('status', 'published')
    .single();
  
  if (error || !book) {
    notFound();
  }
  
  // 更新浏览量（异步，不阻塞页面）
  supabase
    .from('wish_books')
    .update({ view_count: (book.view_count || 0) + 1 })
    .eq('id', book.id)
    .then();
  
  const timeDim = TIME_DIMENSIONS[book.time_dimension as keyof typeof TIME_DIMENSIONS];
  const category = CATEGORIES[book.category as keyof typeof CATEGORIES];
  const difficulty = DIFFICULTY_LEVELS[book.difficulty as keyof typeof DIFFICULTY_LEVELS];
  
  // JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: book.title,
    description: book.subtitle,
    image: book.og_image_url || book.hero_image_url || book.cover_image_url,
    datePublished: book.published_at,
    dateModified: book.updated_at || book.published_at,
    author: {
      '@type': 'Organization',
      name: 'DaysFromToday',
      url: 'https://www.daysfromtoday.ai'
    },
    publisher: {
      '@type': 'Organization',
      name: 'DaysFromToday',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.daysfromtoday.ai/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.daysfromtoday.ai/${locale}/wish-books/${slug}`
    }
  };
  
  // 面包屑 JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'zh' ? '首页' : 'Home',
        item: `https://www.daysfromtoday.ai/${locale}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'zh' ? '愿望宝典' : 'Wish Books',
        item: `https://www.daysfromtoday.ai/${locale}/wish-books`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: book.title,
        item: `https://www.daysfromtoday.ai/${locale}/wish-books/${slug}`
      }
    ]
  };
  
  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <TopNav locale={locale} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
      {/* Hero 图片 */}
      {book.hero_image_url ? (
        <div 
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${book.hero_image_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50"></div>
        </div>
      ) : (
        <div className="h-96 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
          {/* 装饰性光斑 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>
        </div>
      )}
      
      {/* 主内容 */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 面包屑导航 */}
          <nav aria-label="面包屑" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-gray-600">
              <li>
                <Link href={`/${locale}`} className="hover:text-gray-900">
                  {locale === 'zh' ? '首页' : 'Home'}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/${locale}/wish-books`} className="hover:text-gray-900">
                  {locale === 'zh' ? '愿望宝典' : 'Wish Books'}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium truncate max-w-xs">
                {book.title}
              </li>
            </ol>
          </nav>
          
          {/* 卡片主体 */}
          <article className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            {/* 头部 */}
            <div className="p-8 md:p-12 border-b">
              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                  {timeDim?.emoji} {timeDim?.label}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                  {category?.emoji} {category?.name}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full font-medium
                  ${difficulty?.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                  ${difficulty?.color === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                  ${difficulty?.color === 'orange' ? 'bg-orange-100 text-orange-700' : ''}
                  ${difficulty?.color === 'purple' ? 'bg-purple-100 text-purple-700' : ''}
                `}>
                  {difficulty?.emoji} {difficulty?.label}
                </span>
              </div>
              
              {/* 标题 */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {book.title}
              </h1>
              
              {/* 副标题 */}
              {book.subtitle && (
                <p className="text-xl text-gray-600 mb-6">
                  {book.subtitle}
                </p>
              )}
              
              {/* 统计 */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>👁️ {book.view_count || 0} 浏览</span>
                <span>❤️ {book.save_count || 0} 收藏</span>
                {book.published_at && (
                  <span>📅 {new Date(book.published_at).toLocaleDateString('zh-CN')}</span>
                )}
              </div>
            </div>
            
            {/* 正文内容 */}
            <div className="p-8 md:p-12">
              {/* 故事引入 */}
              {book.story_intro && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    📖 故事开始
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {book.story_intro}
                  </div>
                </div>
              )}
              
              {/* 主要内容 */}
              {book.content_html && (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: book.content_html }}
                />
              )}
              
              {/* 如果没有内容，显示提示 */}
              {!book.story_intro && !book.content_html && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl">内容正在完善中...</p>
                </div>
              )}
            </div>
          </article>
        </div>
      </main>
    </div>
    </>
  );
}

// ISR: 每小时重新验证
export const revalidate = 3600;

// 动态路由参数
export const dynamicParams = true;

