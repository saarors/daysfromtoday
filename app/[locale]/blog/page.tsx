import type { Metadata } from 'next';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { allBlogs } from '@/.contentlayer/generated';

interface PageParams {
  locale: string;
}

interface PageProps {
  params: PageParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  
  const title = locale === 'zh' ? '博客 - DaysFromToday' : 'Blog - DaysFromToday';
  const description = locale === 'zh' 
    ? '探索日期计算、时间管理和工作效率提升的实用技巧和深度文章。'
    : 'Explore practical tips and in-depth articles on date calculation, time management, and productivity.';
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
  const blogUrl = `${baseUrl}/${locale}/blog`;
  
  return {
    title,
    description,
    keywords: locale === 'zh' 
      ? '日期计算,时间管理,工作效率,博客,文章'
      : 'date calculation,time management,productivity,blog,articles',
    alternates: {
      canonical: blogUrl,
      languages: {
        'en': `${baseUrl}/en/blog`,
        'zh': `${baseUrl}/zh/blog`,
      }
    },
    openGraph: {
      title,
      description,
      url: blogUrl,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/blog-og.jpg`,
          alt: title,
          width: 1200,
          height: 630,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/blog-og.jpg`],
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
      },
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = params;
  
  // 动态获取当前语言的博客文章
  const currentLocaleBlogs = allBlogs
    .filter(blog => blog.locale === locale)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const text = {
    en: {
      title: 'Blog',
      subtitle: 'Tips, guides, and insights on date calculation',
      allPosts: 'All Posts',
      readMore: 'Read More',
      noPosts: 'No blog posts found',
      totalPosts: (count: number) => `${count} ${count === 1 ? 'post' : 'posts'}`
    },
    zh: {
      title: '博客',
      subtitle: '关于日期计算的技巧、指南和见解',
      allPosts: '所有文章',
      readMore: '阅读更多',
      noPosts: '暂无博客文章',
      totalPosts: (count: number) => `共 ${count} 篇文章`
    }
  };
  
  const t = text[locale as keyof typeof text] || text.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Navigation */}
      <TopNav locale={locale} />
      
      <div className="container mx-auto px-4 py-12 pt-24 md:pt-32 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-calendly">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.subtitle}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t.totalPosts(currentLocaleBlogs.length)}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t.allPosts}
          </h2>
          
          {currentLocaleBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t.noPosts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentLocaleBlogs.map((blog) => {
                return (
                  <Link key={blog.slug} href={`/${locale}/blog/${blog.slug}`}>
                    <Card className="card-glass hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="primary">{blog.category}</Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(blog.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                          </span>
                        </div>
                        <CardTitle className="text-xl hover:text-blue-600 transition-colors line-clamp-2">
                          {blog.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {blog.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">📖 {blog.readingTime || '5 min read'}</span>
                          <span className="text-blue-600 font-medium hover:text-blue-700">
                            {t.readMore} →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
