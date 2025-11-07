/**
 * Wish Books 聚合页 - 展示所有愿望卡片
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import TopNav from '@/components/TopNav';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '愿望宝典 - 用时间记录人类目标与实现之路 | DaysFromToday',
    en: 'Wish Books - Encyclopedia of Human Goals | DaysFromToday'
  };
  
  const descriptions = {
    zh: '探索 7 天到 5 年的人生目标百科，从健身、学习到职业成长，看看别人是怎么做到的。',
    en: 'Explore the encyclopedia of life goals from 7 days to 5 years, from fitness and learning to career growth.'
  };
  
  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/wish-books`,
      languages: {
        'zh': 'https://www.daysfromtoday.ai/zh/wish-books',
        'en': 'https://www.daysfromtoday.ai/en/wish-books'
      }
    },
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: `https://www.daysfromtoday.ai/${locale}/wish-books`,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [{
        url: 'https://www.daysfromtoday.ai/og-wish-books.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'zh' ? '愿望宝典' : 'Wish Books'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
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

export default async function WishBooksPage({ 
  params,
  searchParams 
}: { 
  params: { locale: string };
  searchParams: {
    category?: string;
    time_dimension?: string;
    search?: string;
  };
}) {
  const { locale } = await params;
  const filters = await searchParams;
  
  const text = {
    zh: {
      title: '愿望宝典',
      subtitle: '用时间记录人类目标与实现之路',
      description: '从 7 天到 5 年，探索时间的可能性',
      search: '搜索目标...',
      allCategories: '全部类别',
      allDurations: '全部时长',
      noResults: '暂无卡片',
      noResultsDesc: '还没有符合条件的愿望卡片',
      createFirst: '成为第一个创建者'
    },
    en: {
      title: 'Wish Books',
      subtitle: 'Encyclopedia of Human Goals',
      description: 'From 7 days to 5 years, explore the possibilities of time',
      search: 'Search goals...',
      allCategories: 'All Categories',
      allDurations: 'All Durations',
      noResults: 'No Cards',
      noResultsDesc: 'No wish cards match your criteria yet',
      createFirst: 'Be the first creator'
    }
  };
  
  const t = text[locale as keyof typeof text] || text.en;
  
  // 获取已发布的卡片
  const supabase = createClient();
  
  let query = supabase
    .from('wish_books')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .eq('locale', locale)
    .order('published_at', { ascending: false });
  
  // 应用筛选
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.time_dimension) {
    query = query.eq('time_dimension', filters.time_dimension);
  }
  
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,subtitle.ilike.%${filters.search}%`);
  }
  
  const { data: wishBooks, error, count } = await query;
  
  if (error) {
    console.error('获取卡片列表失败:', error);
  }
  
  return (
    <>
      <TopNav locale={locale} />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-2 font-medium">
            {t.subtitle}
          </p>
          <p className="text-lg text-gray-600">
            {t.description}
          </p>
        </header>
        
        {/* 卡片网格 */}
        {wishBooks && wishBooks.length > 0 ? (
          <section aria-label="愿望卡片列表">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {wishBooks.map((book) => {
              const timeDim = TIME_DIMENSIONS[book.time_dimension as keyof typeof TIME_DIMENSIONS];
              const category = CATEGORIES[book.category as keyof typeof CATEGORIES];
              
              return (
                <Link
                  key={book.id}
                  href={`/${locale}/wish-books/${book.slug}`}
                  className="block bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  {/* 封面图 */}
                  {book.cover_image_url ? (
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-400 bg-cover bg-center" style={{ backgroundImage: `url(${book.cover_image_url})` }}></div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                      {/* 装饰性光斑 */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* 内容 */}
                  <div className="p-6">
                    {/* 标签 */}
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {timeDim?.emoji} {timeDim?.label}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {category?.emoji} {category?.name}
                      </span>
                    </div>
                    
                    {/* 标题 */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    
                    {/* 副标题 */}
                    {book.subtitle && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {book.subtitle}
                      </p>
                    )}
                    
                    {/* 统计 */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>👁️ {book.view_count || 0}</span>
                      <span>❤️ {book.save_count || 0}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
            </div>
          </section>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {t.noResults}
            </h3>
            <p className="text-gray-600">
              {t.noResultsDesc}
            </p>
          </div>
        )}
        </div>
      </main>
    </>
  );
}

// 静态生成
export const revalidate = 3600; // 1小时重新验证

