import type { Metadata } from 'next';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface PageParams {
  locale: string;
}

interface PageProps {
  params: PageParams;
}

// 博客文章列表（未来可以从数据库或文件系统读取）
const blogPosts = [
  {
    slug: '21-days-to-build-a-new-you',
    title: {
      en: '21 Days to Build a New You: The Magic Time Between Humans and Habits',
      zh: '21天养成一个好习惯：你会遇见一个全新的自己'
    },
    excerpt: {
      en: 'Discover how 21 days can be a powerful starting point for forming new habits and transforming your life. Based on scientific research and real-world examples.',
      zh: '发现21天如何成为养成新习惯和改变生活的强大起点。基于科学研究和真实案例。'
    },
    date: '2025-10-12',
    readTime: {
      en: '7 min read',
      zh: '7 分钟阅读'
    },
    category: {
      en: 'Habits',
      zh: '习惯养成'
    },
    featured: true
  },
  {
    slug: 'why-i-created-daysfromtoday',
    title: {
      en: 'Why I Created DaysFromToday',
      zh: '我为什么创建了 DaysFromToday'
    },
    excerpt: {
      en: 'In September this year, my 13-year-old son began his first full boarding school life. This changed how he views time. Time — for each of us, it\'s almost the only fair, scarce, and completely controllable resource worth mastering.',
      zh: '今年9月，我13岁的儿子开始了他人生中的第一次全寄宿生活。这改变了他看待时间的方式。时间 —— 对于我们每个人来说，几乎是唯一公平、稀缺且值得完全掌控的资源。'
    },
    date: '2025-10-10',
    readTime: {
      en: '6 min read',
      zh: '6 分钟阅读'
    },
    category: {
      en: 'Personal',
      zh: '个人'
    }
  },
  {
    slug: 'why-we-need-to-remember-a-future-day',
    title: {
      en: 'Why We Need to Remember a Day in the Future',
      zh: '我们为什么要记住未来的某一天'
    },
    excerpt: {
      en: 'After turning forty, I noticed something had changed in me. Things I used to remember easily, I now keep forgetting. Time, what a sneaky friend it is. It doesn\'t remind you, doesn\'t rush you, but it silently makes you pay the price.',
      zh: '年过四十之后，我发现自己变了。原来能记住的小事儿，现在老忘。时间吧，真是个狡猾的朋友。它不提醒、不催促，但它默默地让你付出代价。'
    },
    date: '2025-10-11',
    readTime: {
      en: '5 min read',
      zh: '5 分钟阅读'
    },
    category: {
      en: 'Blog',
      zh: '博客'
    }
  }
];

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
