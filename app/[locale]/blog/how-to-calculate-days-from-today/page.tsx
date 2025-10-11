import type { Metadata } from 'next';
import TopNav from '@/components/TopNav';

interface PageParams {
  locale: string;
}

interface PageProps {
  params: PageParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  
  const title = locale === 'zh' 
    ? '如何计算从今天起的日期：完整指南 - DaysFromToday' 
    : 'How to Calculate Days From Today: A Complete Guide - DaysFromToday';
  const description = locale === 'zh'
    ? '了解关于计算未来和过去日期的所有知识，包括自然日、工作日、节假日和时区注意事项。'
    : 'Learn everything about calculating future and past dates, including natural days, business days, holidays, and timezone considerations.';
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/blog/how-to-calculate-days-from-today`,
      languages: {
        'en': 'https://www.daysfromtoday.ai/en/blog/how-to-calculate-days-from-today',
        'zh': 'https://www.daysfromtoday.ai/zh/blog/how-to-calculate-days-from-today',
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/blog/how-to-calculate-days-from-today`,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale } = params;
  
  const content = {
    en: {
      title: 'How to Calculate Days From Today: A Complete Guide',
      date: 'October 7, 2025',
      readTime: '8 min read',
      sections: [
        {
          title: 'What is Days From Today Calculator?',
          content: 'Days From Today is a powerful online tool that helps you calculate future or past dates with precision. Whether you need to know what date it will be 30 days from now, or what date it was 90 days ago, our calculator provides instant, accurate results.'
        },
        {
          title: 'How to Use the Calculator',
          content: 'Using our date calculator is simple:\n1. Enter the number of days you want to calculate\n2. Choose whether you want to calculate forward (future) or backward (past)\n3. Select between calendar days or business days\n4. Get your result instantly with detailed information'
        },
        {
          title: 'Calendar Days vs Business Days',
          content: 'Calendar Days: Include all days of the week, including weekends and holidays. This is useful for general date calculations.\n\nBusiness Days: Only count working days, excluding weekends and public holidays. This is essential for business planning and project management.'
        },
        {
          title: 'Understanding Timezone and Holidays',
          content: 'Our calculator automatically detects your timezone and considers local holidays. This ensures accurate calculations for business days, taking into account regional differences in public holidays and working schedules.'
        },
        {
          title: 'Practical Use Cases',
          content: '• Project Planning: Calculate project deadlines and milestones\n• Legal Deadlines: Determine important legal dates and filing deadlines\n• Event Planning: Plan events and schedule activities\n• Personal Planning: Track important dates and anniversaries\n• Business Operations: Schedule meetings and calculate delivery dates'
        },
        {
          title: 'Tips for Accurate Calculations',
          content: '1. Always verify if you need calendar days or business days\n2. Consider timezone differences for international planning\n3. Check local holiday calendars for business day calculations\n4. Use our download feature to save important dates to your calendar\n5. Bookmark frequently used calculations for quick access'
        }
      ]
    },
    zh: {
      title: '如何计算从今天起的日期：完整指南',
      date: '2025年10月7日',
      readTime: '8 分钟阅读',
      sections: [
        {
          title: '什么是日期计算器？',
          content: 'Days From Today 是一个强大的在线工具，可以帮助您精确计算未来或过去的日期。无论您需要知道从今天起30天后是哪一天，还是90天前是哪一天，我们的计算器都能提供即时、准确的结果。'
        },
        {
          title: '如何使用计算器',
          content: '使用我们的日期计算器非常简单：\n1. 输入您要计算的天数\n2. 选择是计算未来日期还是过去日期\n3. 在自然日和工作日之间选择\n4. 立即获得详细的计算结果'
        },
        {
          title: '自然日 vs 工作日',
          content: '自然日：包括一周中的所有日期，包括周末和节假日。这适用于一般的日期计算。\n\n工作日：只计算工作日，不包括周末和公共假期。这对于业务规划和项目管理至关重要。'
        },
        {
          title: '了解时区和节假日',
          content: '我们的计算器会自动检测您的时区并考虑当地节假日。这确保了工作日计算的准确性，考虑到公共假期和工作时间表的地区差异。'
        },
        {
          title: '实际应用场景',
          content: '• 项目规划：计算项目截止日期和里程碑\n• 法律期限：确定重要的法律日期和申报截止日期\n• 活动策划：规划活动和安排日程\n• 个人规划：跟踪重要日期和纪念日\n• 业务运营：安排会议和计算交付日期'
        },
        {
          title: '准确计算的技巧',
          content: '1. 始终确认您需要的是自然日还是工作日\n2. 考虑国际规划的时区差异\n3. 检查本地节假日日历以进行工作日计算\n4. 使用我们的下载功能将重要日期保存到您的日历\n5. 将常用计算加入书签以便快速访问'
        }
      ]
    }
  };
  
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Navigation */}
      <TopNav locale={locale} />
      
      <article className="container mx-auto px-4 py-12 pt-24 md:pt-32 max-w-4xl">
        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-calendly">
            {t.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>📅 {t.date}</span>
            <span>•</span>
            <span>📖 {t.readTime}</span>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {t.sections.map((section, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <a 
              href={`/${locale}`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {locale === 'zh' ? '开始使用计算器' : 'Try Calculator Now'}
            </a>
          </div>
        </footer>
      </article>
    </div>
  );
}

