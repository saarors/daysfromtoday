import type { Metadata } from 'next';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Breadcrumb from '@/components/Breadcrumb';

interface PageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  
  const title = locale === 'zh' 
    ? '为什么我要做 DaysFromToday：一个程序员的时间焦虑' 
    : 'Why I Built DaysFromToday: A Programmer\'s Time Anxiety';
  
  const description = locale === 'zh'
    ? '作为一个程序员，我经常需要计算日期。这个看似简单的需求，却让我意识到时间管理的重要性。这是 DaysFromToday 诞生的故事。'
    : 'As a programmer, I often need to calculate dates. This seemingly simple need made me realize the importance of time management. This is the story of how DaysFromToday was born.';

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/blog/why-i-built-daysfromtoday`,
      languages: {
        'en': 'https://www.daysfromtoday.ai/en/blog/why-i-built-daysfromtoday',
        'zh': 'https://www.daysfromtoday.ai/zh/blog/why-i-built-daysfromtoday',
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/blog/why-i-built-daysfromtoday`,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      publishedTime: '2025-10-08T00:00:00Z',
      authors: ['Leon'],
    },
  };
}

export default function WhyIBuiltPage({ params }: PageProps) {
  const { locale } = params;
  const isChinese = locale === 'zh';

  const content = {
    en: {
      title: "Why I Built DaysFromToday: A Programmer's Time Anxiety",
      date: 'October 8, 2025',
      readTime: '5 min read',
      sections: [
        {
          heading: 'The Problem That Started It All',
          content: [
            'As a programmer, I deal with dates constantly. Project deadlines, sprint planning, holiday schedules, client deliverables - they all revolve around one question: "What date will it be X days from now?"',
            'You\'d think this would be simple in 2025. Just Google it, right? But here\'s what actually happens:',
            '• Google gives you a calendar widget that requires multiple clicks',
            '• Online calculators are cluttered with ads',
            '• Spreadsheets require manual formulas',
            '• And none of them handle business days properly',
            'I found myself doing this calculation dozens of times a week, and it was frustrating every single time.'
          ]
        },
        {
          heading: 'The "Aha!" Moment',
          content: [
            'The breaking point came during a client call. They asked: "Can you deliver this in 60 business days?"',
            'I paused. Opened a calendar. Started counting. Realized I needed to exclude weekends. Then holidays. Then I had to figure out which country\'s holidays...',
            'The client was waiting. I felt stupid. This should be instant.',
            'That night, I couldn\'t sleep. Not because of the project, but because I kept thinking: "Why doesn\'t this tool exist?"'
          ]
        },
        {
          heading: 'Building the Solution I Wished Existed',
          content: [
            'I started with a simple rule: **The answer should be visible the moment you open the page.**',
            'No forms to fill. No buttons to click. Just open "/days/60" and see the date. That\'s it.',
            'Then I added business days, because that\'s what professionals actually need. Not "60 days from now" but "60 working days from now."',
            'Then timezone awareness, because a deadline in New York is different from one in Tokyo.',
            'Then holidays, because missing a client\'s national holiday is embarrassing.',
            'And finally, multi-language support, because time anxiety is universal.'
          ]
        },
        {
          heading: 'What I Learned About Time',
          content: [
            'Building this tool taught me something unexpected: **we\'re all terrible at thinking about time.**',
            'We say "next month" but mean different things. We forget about holidays. We underestimate how many working days are in a quarter.',
            'DaysFromToday isn\'t just a calculator - it\'s a reality check. It shows you, in black and white, exactly when things will happen.',
            'No optimism. No "roughly." Just facts.'
          ]
        },
        {
          heading: 'Why I Made It Free',
          content: [
            'I could have put this behind a paywall. Added a subscription. Made it a SaaS.',
            'But that felt wrong. Time calculation should be like air - available to everyone.',
            'Instead, I focused on making it fast, accurate, and beautiful. The kind of tool I\'d be proud to use in front of a client.',
            'If it helps you avoid one awkward pause during a meeting, I\'ve done my job.'
          ]
        },
        {
          heading: 'What\'s Next',
          content: [
            'I\'m constantly improving DaysFromToday based on real usage:',
            '• Anniversary tracking (because we all forget important dates)',
            '• Custom holiday calendars (for teams working across regions)',
            '• Calendar integration (one-click export to Google/Outlook)',
            '• Mobile app (because you need this on the go)',
            'But the core will never change: **instant answers, zero friction.**'
          ]
        },
        {
          heading: 'A Personal Note',
          content: [
            'If you\'re reading this, you probably have the same time anxiety I do. The constant mental math. The fear of missing deadlines. The embarrassment of wrong estimates.',
            'I built DaysFromToday for you. And for me.',
            'Because time is the one resource we can\'t create more of. But we can get better at understanding it.',
            '**Bookmark this tool. Share it with your team. Let it save you from one more moment of calendar confusion.**',
            'And if it helps you even once, send me a message. I\'d love to hear how you\'re using it.',
            '— Leon, Creator of DaysFromToday'
          ]
        }
      ]
    },
    zh: {
      title: '为什么我要做 DaysFromToday：一个程序员的时间焦虑',
      date: '2025年10月8日',
      readTime: '5 分钟阅读',
      sections: [
        {
          heading: '一切从一个问题开始',
          content: [
            '作为一名程序员，我每天都要和日期打交道。项目截止日期、冲刺规划、假期安排、客户交付——所有这些都围绕着一个问题："从今天起 X 天后是哪天？"',
            '你可能觉得这很简单，毕竟现在是 2025 年了。Google 一下不就行了？但实际情况是这样的：',
            '• Google 会给你一个需要点好几下的日历小工具',
            '• 在线计算器充满了广告',
            '• 电子表格需要手动写公式',
            '• 而且没有一个能正确处理工作日',
            '我发现自己每周要做这个计算几十次，每次都很烦人。'
          ]
        },
        {
          heading: '顿悟时刻',
          content: [
            '转折点出现在一次客户电话会议中。他们问："你能在 60 个工作日内交付吗？"',
            '我停顿了。打开日历。开始数日子。意识到要排除周末。然后是节假日。然后还要搞清楚是哪个国家的节假日...',
            '客户在等我回答。我感觉很蠢。这应该是秒答的事情。',
            '那天晚上我睡不着。不是因为项目压力，而是一直在想："为什么这个工具不存在？"'
          ]
        },
        {
          heading: '打造我想要的工具',
          content: [
            '我从一个简单的规则开始：**答案应该在你打开页面的瞬间就看到。**',
            '不用填表单。不用点按钮。只需要打开 "/days/60" 就能看到日期。就这么简单。',
            '然后我加入了工作日计算，因为这才是专业人士真正需要的。不是"从今天起 60 天后"，而是"60 个工作日后"。',
            '接着是时区感知，因为纽约的截止日期和东京的不一样。',
            '再然后是节假日，因为忘记客户国家的节假日很尴尬。',
            '最后是多语言支持，因为时间焦虑是全球通用的。'
          ]
        },
        {
          heading: '关于时间，我学到的事',
          content: [
            '做这个工具让我有了一个意外发现：**我们都不擅长思考时间。**',
            '我们说"下个月"，但每个人理解的都不一样。我们会忘记节假日。我们会低估一个季度有多少工作日。',
            'DaysFromToday 不只是个计算器——它是现实检验。它白纸黑字地告诉你，事情到底会在什么时候发生。',
            '没有乐观估计。没有"大概"。只有事实。'
          ]
        },
        {
          heading: '为什么我把它做成免费的',
          content: [
            '我本可以收费。加个订阅。做成 SaaS。',
            '但这感觉不对。时间计算应该像空气一样——对所有人开放。',
            '相反，我专注于让它快速、准确、美观。那种我在客户面前使用也会感到自豪的工具。',
            '如果它能帮你避免会议中一次尴尬的停顿，我就完成了使命。'
          ]
        },
        {
          heading: '接下来要做什么',
          content: [
            '我在根据实际使用情况不断改进 DaysFromToday：',
            '• 纪念日跟踪（因为我们都会忘记重要日期）',
            '• 自定义节假日日历（为跨区域团队准备）',
            '• 日历集成（一键导出到 Google/Outlook）',
            '• 移动应用（因为你需要随时使用）',
            '但核心永远不变：**即时答案，零摩擦。**'
          ]
        },
        {
          heading: '个人感言',
          content: [
            '如果你在读这篇文章，你可能和我有一样的时间焦虑。不断的心算。对错过截止日期的恐惧。对错误估计的尴尬。',
            '我为你做了 DaysFromToday。也为我自己。',
            '因为时间是我们无法创造更多的唯一资源。但我们可以变得更擅长理解它。',
            '**收藏这个工具。分享给你的团队。让它帮你摆脱又一次日历混乱。**',
            '如果它哪怕帮到你一次，给我发个消息。我很想听听你是如何使用它的。',
            '— Leon，DaysFromToday 创始人'
          ]
        }
      ]
    }
  };

  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <TopNav locale={locale} />
      
      <div className="container mx-auto px-4 py-12 pt-24 md:pt-32 max-w-4xl">
        <Breadcrumb 
          locale={locale}
          items={[
            { label: isChinese ? '博客' : 'Blog', href: `/${locale}/blog` },
            { label: t.title }
          ]}
        />

        <article className="mt-8">
          {/* Article Header */}
          <header className="mb-12 text-center">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-6">
              📝 {isChinese ? '创始人故事' : 'Founder Story'}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              {t.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-gray-600">
              <span>📅 {t.date}</span>
              <span>•</span>
              <span>⏱️ {t.readTime}</span>
              <span>•</span>
              <span>✍️ Leon</span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {t.sections.map((section, index) => (
              <section key={index} className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 border-l-4 border-blue-600 pl-4">
                  {section.heading}
                </h2>
                
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-700 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              {isChinese ? '试试 DaysFromToday' : 'Try DaysFromToday'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isChinese 
                ? '立即体验零摩擦的日期计算'
                : 'Experience zero-friction date calculation now'}
            </p>
            <Link
              href={`/${locale}`}
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {isChinese ? '开始使用' : 'Get Started'}
            </Link>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href={`/${locale}/blog`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← {isChinese ? '返回博客' : 'Back to Blog'}
            </Link>
          </div>
        </article>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: t.title,
            datePublished: '2025-10-08T00:00:00Z',
            dateModified: '2025-10-08T00:00:00Z',
            author: {
              '@type': 'Person',
              name: 'Leon',
            },
            publisher: {
              '@type': 'Organization',
              name: 'DaysFromToday',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.daysfromtoday.ai/logo.png',
              },
            },
            description: isChinese
              ? '作为一个程序员，我经常需要计算日期。这个看似简单的需求，却让我意识到时间管理的重要性。这是 DaysFromToday 诞生的故事。'
              : 'As a programmer, I often need to calculate dates. This seemingly simple need made me realize the importance of time management. This is the story of how DaysFromToday was born.',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.daysfromtoday.ai/${locale}/blog/why-i-built-daysfromtoday`,
            },
          }),
        }}
      />
    </div>
  );
}

