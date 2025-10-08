import type { Metadata } from 'next';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface PageParams {
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

// 博客文章列表（未来可以从数据库或文件系统读取）
const blogPosts = [
  {
    slug: 'why-i-built-daysfromtoday',
    title: {
      en: 'Why I Built DaysFromToday',
      zh: '为什么我要做 DaysFromToday'
    },
    excerpt: {
      en: 'In September, my 13-year-old son started boarding school. Every call, he asks: "How many days left?" It made me realize — time is the only truly fair and scarce resource we have. So I built DaysFromToday.',
      zh: '今年9月，我13岁的儿子开始寄宿生活。每次通话他都会问："还有几天？" 这让我意识到，时间是我们唯一公平且稀缺的资源。于是我做了 DaysFromToday。'
    },
    date: '2025-10-08',
    readTime: {
      en: '6 min read',
      zh: '6 分钟阅读'
    },
    category: {
      en: 'Story',
      zh: '故事'
    }
  },
  {
    slug: 'how-to-calculate-days-from-today',
    title: {
      en: 'How to Calculate Days From Today: A Complete Guide',
      zh: '如何计算从今天起的日期：完整指南'
    },
    excerpt: {
      en: 'Learn everything about calculating future and past dates, including natural days, business days, holidays, and timezone considerations.',
      zh: '了解关于计算未来和过去日期的所有知识，包括自然日、工作日、节假日和时区注意事项。'
    },
    date: '2025-10-07',
    readTime: {
      en: '8 min read',
      zh: '8 分钟阅读'
    },
    category: {
      en: 'Guide',
      zh: '指南'
    }
  }
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const title = locale === 'zh' ? '博客 - DaysFromToday' : 'Blog - DaysFromToday';
  const description = locale === 'zh' 
    ? '探索日期计算、时间管理和工作效率提升的实用技巧和深度文章。'
    : 'Explore practical tips and in-depth articles on date calculation, time management, and productivity.';
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/blog`,
      languages: {
        'en': 'https://www.daysfromtoday.ai/en/blog',
        'zh': 'https://www.daysfromtoday.ai/zh/blog',
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/blog`,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    }
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  
  const text = {
    en: {
      title: 'Blog',
      subtitle: 'Tips, guides, and insights on date calculation',
      allPosts: 'All Posts',
      readMore: 'Read More'
    },
    zh: {
      title: '博客',
      subtitle: '关于日期计算的技巧、指南和见解',
      allPosts: '所有文章',
      readMore: '阅读更多'
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
        </div>

        {/* Blog Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t.allPosts}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => {
              const postTitle = post.title[locale as keyof typeof post.title] || post.title.en;
              const postExcerpt = post.excerpt[locale as keyof typeof post.excerpt] || post.excerpt.en;
              const postReadTime = post.readTime[locale as keyof typeof post.readTime] || post.readTime.en;
              const postCategory = post.category[locale as keyof typeof post.category] || post.category.en;
              
              return (
                <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
                  <Card className="card-glass hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="primary">{postCategory}</Badge>
                        <span className="text-sm text-gray-500">{post.date}</span>
                      </div>
                      <CardTitle className="text-xl hover:text-blue-600 transition-colors line-clamp-2">
                        {postTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {postExcerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">📖 {postReadTime}</span>
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
        </div>
      </div>
    </div>
  );
}
