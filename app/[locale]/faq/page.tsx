/**
 * FAQ 页面
 * 
 * 路由：/[locale]/faq
 * 
 * 功能：
 * 1. 介绍产品背景和创始人故事
 * 2. 回答常见问题
 * 3. SEO 优化（JSON-LD FAQ Schema）
 * 4. 人性化内容，提升用户信任
 * 
 * 符合项目规范：
 * - 多语言支持
 * - 完整的 SEO metadata
 * - 响应式设计
 * - TypeScript 严格模式
 */

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

// 页面参数类型
type PageParams = {
  locale: string;
};

/**
 * 生成 metadata（SEO 优化）
 */
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<PageParams> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  const title = locale === 'zh' 
    ? 'FAQ - 关于 DaysFromToday | 创始人的故事'
    : 'FAQ - About DaysFromToday | Founder\'s Story';
  
  const description = locale === 'zh'
    ? '了解 DaysFromToday 的诞生故事。一个父亲为儿子创建的日期计算工具，帮助你掌握时间，掌握命运。'
    : 'Learn about the story behind DaysFromToday. A date calculator created by a father for his son, helping you master time and destiny.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website'
    },
    alternates: {
      canonical: `/${locale}/faq`,
      languages: {
        'en': '/en/faq',
        'zh': '/zh/faq'
      }
    }
  };
}

/**
 * FAQ 页面组件
 */
export default async function FAQPage({ 
  params 
}: { 
  params: Promise<PageParams> 
}) {
  const { locale } = await params;
  const t = await getTranslations();
  
  // 根据语言选择内容
  const content = locale === 'zh' ? chineseContent : englishContent;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 返回首页链接 */}
        <div className="mb-8">
          <Link
            href={`/${locale}`}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('calculateAnother')}
          </Link>
        </div>

        {/* 页面标题 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {content.subtitle}
          </p>
        </header>

        {/* Leon 的信 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* 作者信息 */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                L
              </div>
              <div>
                <div className="font-bold text-xl text-gray-900 dark:text-white">
                  Leon
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {content.authorTitle}
                </div>
              </div>
            </div>

            {/* 信件内容 */}
            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              {content.letterContent.map((paragraph, index) => (
                <p key={index} className="text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* 签名 */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 italic">
                {content.signature}
              </p>
            </div>
          </div>
        </div>

        {/* 产品功能列表 */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {content.featuresTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-4"
              >
                <svg 
                  className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 反馈征集 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {content.feedbackTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {content.feedbackText}
          </p>
          <a
            href={`mailto:feedback@daysfromtoday.com?subject=${encodeURIComponent(content.emailSubject)}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {content.feedbackButton}
          </a>
        </div>
      </div>

      {/* JSON-LD 结构化数据（SEO）*/}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': content.faqSchema.questions[0],
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': content.faqSchema.answers[0]
                }
              },
              {
                '@type': 'Question',
                'name': content.faqSchema.questions[1],
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': content.faqSchema.answers[1]
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}

// 中文内容
const chineseContent = {
  title: '关于 DaysFromToday',
  subtitle: '一个父亲的故事',
  authorTitle: '产品经理 & 自由股票投资人',
  letterContent: [
    '你好，我是 Leon，一个互联网产品经理，也是一个自由股票投资人。',
    '在今年（2025年）的9月份，我13岁的儿子在伦敦开始了他的全寄宿生活。在电话中，他经常会问到：',
    '"爸爸，离周末还有3天……"',
    '"爸爸，离假期是不是还有两周？"',
    '"爸爸，离我的生日是不是还有几个月？"',
    '有时候，我不得不一边接着电话，一边仓促地翻开日历，以便帮他确定准确的日期。我知道，他一定对这些时间点有一点小焦虑。',
    '其实，在我们工作的时候，也经常会有对过去和未来日期的需求：',
    '距离我上次还贷款过去几天了？',
    '距离我下一次的美股定投还有多少天？',
    '距离我们的结婚纪念日还有几天？',
    '掌握了时间，就是掌握了资源，也是把命运掌握在自己的手上。',
    '因此，有了 DaysFromToday 这款小产品。',
  ],
  signature: '希望通过这个产品，能够帮你掌握未来。\n\nLeon',
  featuresTitle: '它能够帮你实现',
  features: [
    '计算到未来某一天的间隔天数',
    '计算到过去某一天的间隔天数',
    '计算间隔多少个自然日',
    '计算间隔多少个工作日',
    '匹配的地区和时区',
    '一键添加到日历',
  ],
  feedbackTitle: '我希望得到你的反馈',
  feedbackText: '如果这个工具对你有帮助，或者你有任何建议，欢迎通过邮件告诉我。',
  feedbackButton: '发送反馈',
  emailSubject: 'DaysFromToday 反馈',
  faqSchema: {
    questions: [
      '什么是 DaysFromToday？',
      '为什么创建这个产品？'
    ],
    answers: [
      'DaysFromToday 是一个简单易用的日期计算工具，帮助你快速计算从今天到未来或过去任意一天的间隔天数。支持自然日和工作日计算，并可以一键添加到日历。',
      '这个产品由产品经理 Leon 创建，灵感来自于他13岁儿子在伦敦寄宿学校的经历。儿子经常询问距离周末、假期、生日还有多少天，Leon 希望通过这个工具帮助人们更好地掌握时间和计划未来。'
    ]
  }
};

// 英文内容
const englishContent = {
  title: 'About DaysFromToday',
  subtitle: "A Father's Story",
  authorTitle: 'Product Manager & Stock Investor',
  letterContent: [
    "Hello, I'm Leon, an internet product manager and independent stock investor.",
    "In September 2025, my 13-year-old son started his full boarding school life in London. During our phone calls, he often asks:",
    '"Dad, there are 3 days until the weekend..."',
    '"Dad, is there two weeks until the holiday?"',
    '"Dad, is my birthday in a few months?"',
    "Sometimes, I have to flip through the calendar while on the phone to help him confirm the exact dates. I know he has a bit of anxiety about these time points.",
    "Actually, in our work and daily life, we often need to calculate past and future dates:",
    "How many days since my last loan payment?",
    "How many days until my next US stock investment?",
    "How many days until our wedding anniversary?",
    "Mastering time means mastering resources, and having control over your destiny.",
    "That's why DaysFromToday was created.",
  ],
  signature: 'I hope this product helps you master your future.\n\nLeon',
  featuresTitle: 'What It Can Do For You',
  features: [
    'Calculate days to any future date',
    'Calculate days from any past date',
    'Calculate calendar days',
    'Calculate business days (excluding weekends)',
    'Support for different regions and timezones',
    'One-click add to calendar',
  ],
  feedbackTitle: 'I Would Love Your Feedback',
  feedbackText: "If this tool helps you, or if you have any suggestions, please don't hesitate to email me.",
  feedbackButton: 'Send Feedback',
  emailSubject: 'Feedback for DaysFromToday',
  faqSchema: {
    questions: [
      'What is DaysFromToday?',
      'Why was this product created?'
    ],
    answers: [
      'DaysFromToday is a simple and user-friendly date calculator that helps you quickly calculate the number of days between today and any future or past date. It supports both calendar days and business days calculations, and allows you to add dates to your calendar with one click.',
      'This product was created by product manager Leon, inspired by his 13-year-old son\'s experience at a boarding school in London. His son often asked about the days until weekends, holidays, and birthdays. Leon hoped to create this tool to help people better master time and plan their future.'
    ]
  }
};

