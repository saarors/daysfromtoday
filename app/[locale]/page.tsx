/**
 * 多语言首页组件 - 重新设计
 * 
 * 设计目标：
 * - 提供所有计算类型的入口（未来/过去、自然日/工作日）
 * - 模块化卡片设计（参考 Calendly）
 * - 清晰的视觉层级
 * - 完整的多语言支持
 */
import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

type PageParams = {
  locale: string;
};

/**
 * 生成首页 metadata（SEO 优化）
 */
export async function generateMetadata({
  params
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
  
  const title = locale === 'zh' 
    ? 'DaysFromToday - 日期计算器 | 轻松计算任意日期'
    : 'DaysFromToday - Date Calculator | Calculate Any Date Easily';
  
  const description = locale === 'zh'
    ? '简单、快速、强大的日期计算工具。计算未来或过去的日期，支持工作日、自然日、节假日。一键添加到日历，多语言支持。'
    : 'Simple, fast, and powerful date calculator. Calculate future or past dates with support for business days, weekends, and holidays. One-click calendar integration and multi-language support.';

  return {
    title,
    description,
    keywords: locale === 'zh'
      ? ['日期计算器', '天数计算', '日期倒计时', '工作日计算', '日历工具', 'DaysFromToday']
      : ['date calculator', 'days calculator', 'date counter', 'business days', 'calendar tool', 'DaysFromToday'],
    authors: [{ name: 'Leon', url: `${baseUrl}/${locale}/faq` }],
    creator: 'DaysFromToday',
    publisher: 'DaysFromToday',
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/${locale}`,
      siteName: 'DaysFromToday',
      locale: locale,
      images: [{
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'DaysFromToday - Date Calculator'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`]
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'zh': `${baseUrl}/zh`,
        'x-default': `${baseUrl}/en`
      }
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

/**
 * 首页主组件
 */
export default async function HomePage({
  params
}: {
  params: Promise<PageParams>
}) {
  const { locale } = await params;

  // 文本内容（支持中英文）
  const content = {
    en: {
      hero: {
        title: 'Easy Date Calculation Ahead',
        subtitle: 'Calculate future or past dates with precision',
        description: 'Simple, fast, and powerful date calculator supporting business days, natural days, and holidays.'
      },
      sections: {
        future: {
          title: 'Future Dates',
          description: 'Calculate dates in the future'
        },
        past: {
          title: 'Past Dates',
          description: 'Calculate dates in the past'
        },
        calendar: {
          title: 'Calendar Days',
          description: 'Including all days'
        },
        business: {
          title: 'Business Days',
          description: 'Excluding weekends & holidays'
        }
      },
      quickLinks: {
        title: 'Popular Calculations',
        days: 'days'
      },
      features: {
        title: 'Why Choose DaysFromToday?',
        items: [
          {
            title: 'Business Days',
            description: 'Automatically exclude weekends and holidays based on your country'
          },
          {
            title: 'Multi-language',
            description: 'Full support for English and Chinese with more coming soon'
          },
          {
            title: 'Calendar Export',
            description: 'One-click export to your calendar app (.ics format)'
          },
          {
            title: 'SEO Optimized',
            description: 'Lightning-fast loading with excellent search engine visibility'
          }
        ]
      }
    },
    zh: {
      hero: {
        title: '轻松计算任意日期',
        subtitle: '精确计算未来或过去的日期',
        description: '简单、快速、强大的日期计算工具，支持工作日、自然日和节假日。'
      },
      sections: {
        future: {
          title: '未来日期',
          description: '计算未来的日期'
        },
        past: {
          title: '过去日期',
          description: '计算过去的日期'
        },
        calendar: {
          title: '自然日',
          description: '包含所有日期'
        },
        business: {
          title: '工作日',
          description: '排除周末和节假日'
        }
      },
      quickLinks: {
        title: '热门计算',
        days: '天'
      },
      features: {
        title: '为什么选择 DaysFromToday？',
        items: [
          {
            title: '工作日计算',
            description: '根据您的国家自动排除周末和节假日'
          },
          {
            title: '多语言支持',
            description: '完整支持中英文，更多语言即将推出'
          },
          {
            title: '日历导出',
            description: '一键导出到您的日历应用（.ics 格式）'
          },
          {
            title: 'SEO 优化',
            description: '闪电般的加载速度和优秀的搜索引擎可见性'
          }
        ]
      }
    }
  };

  const text = content[locale as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {text.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            {text.hero.subtitle}
          </p>
          <p className="text-gray-500 mb-8">
            {text.hero.description}
          </p>
        </div>

        {/* 主计算入口 - 2x2 网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-12">
          {/* 未来日期 - 自然日 */}
          <Card variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="primary">🔮 {text.sections.future.title}</Badge>
                <Badge variant="default">{text.sections.calendar.title}</Badge>
              </div>
              <CardTitle className="text-blue-600">
                {text.sections.future.title} - {text.sections.calendar.title}
              </CardTitle>
              <CardDescription>
                {text.sections.future.description} ({text.sections.calendar.description})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[7, 14, 30, 90].map(days => (
                  <Link
                    key={days}
                    href={`/${locale}/days/${days}`}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors font-medium"
                  >
                    {days} {text.quickLinks.days}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 未来日期 - 工作日 */}
          <Card variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="primary">🔮 {text.sections.future.title}</Badge>
                <Badge variant="success">{text.sections.business.title}</Badge>
              </div>
              <CardTitle className="text-cyan-600">
                {text.sections.future.title} - {text.sections.business.title}
              </CardTitle>
              <CardDescription>
                {text.sections.future.description} ({text.sections.business.description})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 14, 30].map(days => (
                  <Link
                    key={days}
                    href={`/${locale}/business-days/${days}`}
                    className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm hover:bg-cyan-200 transition-colors font-medium"
                  >
                    {days} {text.quickLinks.days}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 过去日期 - 自然日 */}
          <Card variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">⏮️ {text.sections.past.title}</Badge>
                <Badge variant="default">{text.sections.calendar.title}</Badge>
              </div>
              <CardTitle className="text-purple-600">
                {text.sections.past.title} - {text.sections.calendar.title}
              </CardTitle>
              <CardDescription>
                {text.sections.past.description} ({text.sections.calendar.description})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[7, 14, 30, 90].map(days => (
                  <Link
                    key={days}
                    href={`/${locale}/days/ago/${days}`}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors font-medium"
                  >
                    {days} {text.quickLinks.days}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 过去日期 - 工作日 */}
          <Card variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">⏮️ {text.sections.past.title}</Badge>
                <Badge variant="success">{text.sections.business.title}</Badge>
              </div>
              <CardTitle className="text-indigo-600">
                {text.sections.past.title} - {text.sections.business.title}
              </CardTitle>
              <CardDescription>
                {text.sections.past.description} ({text.sections.business.description})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 14, 30].map(days => (
                  <Link
                    key={days}
                    href={`/${locale}/business-days/ago/${days}`}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200 transition-colors font-medium"
                  >
                    {days} {text.quickLinks.days}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {text.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {text.features.items.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Switcher */}
      <section className="container mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/en"
            className={`px-4 py-2 rounded-lg transition-colors ${
              locale === 'en' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            English
          </Link>
          <Link
            href="/zh"
            className={`px-4 py-2 rounded-lg transition-colors ${
              locale === 'zh' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            中文
          </Link>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': 'DaysFromToday',
            'alternateName': 'Days From Today',
            'url': `https://www.daysfromtoday.ai/${locale}`,
            'applicationCategory': 'UtilitiesApplication',
            'operatingSystem': 'Any',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            },
            'description': text.hero.description,
            'featureList': text.features.items.map(f => f.title).join(', ')
          })
        }}
      />
    </div>
  );
}
