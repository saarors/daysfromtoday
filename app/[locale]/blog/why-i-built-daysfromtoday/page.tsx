import type { Metadata } from 'next';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Breadcrumb from '@/components/Breadcrumb';

interface PageParams {
  locale: string;
}

interface PageProps {
  params: PageParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  
  const title = locale === 'zh' 
    ? '为什么我要做 DaysFromToday' 
    : 'Why I Built DaysFromToday';
  
  const description = locale === 'zh'
    ? '今年9月，我13岁的儿子开始寄宿生活。每次通话他都会问："还有几天？" 这让我意识到，时间是我们唯一公平且稀缺的资源。于是我做了 DaysFromToday。'
    : 'In September, my 13-year-old son started boarding school. Every call, he asks: "How many days left?" It made me realize — time is the only truly fair and scarce resource we have. So I built DaysFromToday.';

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

export default async function WhyIBuiltPage({ params }: PageProps) {
  const { locale } = params;
  const isChinese = locale === 'zh';

  const content = {
    en: {
      title: "Why I Built DaysFromToday",
      date: 'October 8, 2025',
      readTime: '6 min read',
      sections: [
        {
          heading: '',
          content: [
            'Hi, I\'m Leon.',
            'I live in London — an internet product manager, and an individual investor.'
          ]
        },
        {
          heading: '',
          content: [
            '**Time** — for all of us, is perhaps the only resource that\'s truly fair, limited, and worth mastering completely.',
            'If we can measure time precisely, we can take back control of our lives.'
          ]
        },
        {
          heading: '',
          content: [
            'In September this year, my 13-year-old son started his first full boarding life.',
            'He goes to a school just outside London.',
            '',
            'For the past decade, we\'ve seen each other every single day.',
            'Now, he only comes home once every three or four weeks.',
            '',
            'That change is small, but it\'s emotional —',
            'for him, and for us as parents.'
          ]
        },
        {
          heading: '',
          content: [
            'During his first few days at school, we agreed to call each other every day.',
            'Almost every call, he would bring up one word — **time**.',
            '',
            '"Dad, only three days till the weekend! I can sleep in."',
            '"Dad, three more weeks and I can come home and eat your cooking."',
            '"Dad, how many months until my birthday?"',
            '',
            'Every time he asked, I\'d grab my phone, open the calendar,',
            'and quickly calculate the exact date.',
            '',
            'He loves hearing the countdown —',
            'as if one day less meant happiness one step closer.',
            '',
            'I could sense a little time anxiety in him.',
            'But I actually think that\'s a good thing —',
            'a boy learning to own his time.'
          ]
        },
        {
          heading: '',
          content: [
            'Even as adults, we do similar mental math every day:',
            '',
            '**How long since my last loan payment? When will I finally be debt-free?**',
            '**How many days until my wedding anniversary — please, don\'t let me forget.**',
            '**When\'s our next family gathering? I\'d better prepare, not like last year.**',
            '',
            'To manage time is, in a way, to manage life itself.'
          ]
        },
        {
          heading: '',
          content: [
            'But most calendar apps don\'t calculate "time left".',
            'So I built **Days From Today**.',
            '',
            'At first, it was just to answer my son\'s questions —',
            'and to remind myself of the dates that matter.',
            'Then I thought, maybe there are other fathers like me.',
            'Or anyone who simply wants to take back ownership of their time.',
            '',
            'So I put it online — **free, simple, accurate**.',
            'It supports different countries, time zones, weekdays, holidays,',
            'so every countdown feels real and precise.'
          ]
        },
        {
          heading: '',
          content: [
            'If you, too, want to own your time,',
            'I hope **Days From Today** can help you, even just a little.',
            '',
            'Thank you for reading.',
            'I wish you a joyful, peaceful, and time-free life —',
            'where your time truly belongs to you.',
            '',
            'And if you ever feel something while using it,',
            'I\'d love to hear from you.',
            '',
            '— **Leon**'
          ]
        }
      ]
    },
    zh: {
      title: '为什么我要做 DaysFromToday',
      date: '2025年10月8日',
      readTime: '6 分钟阅读',
      sections: [
        {
          heading: '',
          content: [
            '你好，我是 Leon。',
            '我现在住在伦敦，是一名互联网产品经理，也是一位独立投资人。'
          ]
        },
        {
          heading: '',
          content: [
            '**时间** —— 对于我们每个人来说，几乎是唯一公平、稀缺且值得完全掌控的资源。',
            '能精准地把握时间，我们就能重新掌握生活的主动权。'
          ]
        },
        {
          heading: '',
          content: [
            '今年 9 月，我 13 岁的儿子开始了他人生中的第一次全寄宿生活。',
            '他进入了一所位于伦敦郊区的中学。',
            '',
            '过去十多年，我们几乎每天都见面。',
            '而从现在起，他要 3～4 周才能回家一次。',
            '',
            '这对他，对我和他妈妈，都是一次新的挑战。'
          ]
        },
        {
          heading: '',
          content: [
            '在他开始寄宿生活后的几天，我们约定每天都要通电话。',
            '几乎每次通话，他都会提到一个词——**时间**。',
            '',
            '「爸爸，还有 3 天就周末啦，到时候我就不用 6 点半起床啦。」',
            '「爸爸，还有 3 个星期我们就能见面啦，我可以回家吃好吃的！」',
            '「爸爸，离我生日还有几个月呀？」',
            '',
            '每次他问这些问题时，我都会一边接电话，一边手忙脚乱地打开日历，帮他算一个精确的日子。',
            '',
            '他喜欢听「倒计时」，',
            '好像只要少一天，幸福就近了一点。',
            '',
            '我知道，他有一点"时间焦虑"。',
            '但我想，这其实是件好事——',
            '一个男孩，开始学习掌握他自己的时间资源。'
          ]
        },
        {
          heading: '',
          content: [
            '其实，对成年人来说，我们每天也都在做「关于时间的计算」。',
            '',
            '**距离上次还贷已经多久？我的负债还要几年能结束？**',
            '**我和太太的结婚纪念日还有多久？我可不能再忘记。**',
            '**家庭聚会哪天？还剩多少天？得提前准备，别像去年那样仓促。**',
            '',
            '掌握了时间，就掌握了生活最重要的秩序。'
          ]
        },
        {
          heading: '',
          content: [
            '但在各种日历应用中，没有人帮我们算「倒计时」。',
            '所以我做了这个应用 —— **Days From Today**。',
            '',
            '它最初只是为了方便回答儿子的问题，',
            '也提醒我那些重要的日期和纪念日。',
            '后来我想，也许世界上有许多和我一样的爸爸，',
            '或者同样希望掌控自己时间的人。',
            '',
            '我把它发布到了网上，**免费、简洁、准确**。',
            '它能帮你计算不同国家和时区的自然日、节假日和工作日，',
            '让每一次「倒计时」都准确无误。'
          ]
        },
        {
          heading: '',
          content: [
            '如果你也希望重新掌控自己的时间，',
            '希望 **Days From Today** 能帮到你一点点。',
            '',
            '感谢你读到这里。',
            '祝你拥有一个愉快的、自由的、掌握在自己手里的时间生活。',
            '',
            '如果你有任何想法或感受，',
            '我真心欢迎你告诉我。',
            '',
            '谢谢。',
            '—— **Leon**'
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
        <Breadcrumb locale={locale} />

        <article className="mt-8">
          {/* Article Header */}
          <header className="mb-16 text-center">
            <div className="inline-block px-5 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
              🕰️ {isChinese ? '创始人故事' : 'Founder Story'}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
              {t.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-gray-600 text-lg">
              <span>📅 {t.date}</span>
              <span className="text-gray-400">|</span>
              <span>⏱️ {t.readTime}</span>
              <span className="text-gray-400">|</span>
              <span>✍️ Leon</span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {t.sections.map((section, index) => (
              <section key={index} className="mb-16">
                {/* 添加分隔线（第一段除外） */}
                {index > 0 && (
                  <div className="my-12 flex items-center justify-center">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <div className="mx-4 text-gray-400">⸻</div>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>
                )}
                
                {section.heading && (
                  <h2 className="text-3xl font-bold mb-8 text-gray-900 border-l-4 border-gradient-to-b from-blue-600 to-purple-600 pl-6">
                    {section.heading}
                  </h2>
                )}
                
                <div className="space-y-6">
                  {section.content.map((paragraph, pIndex) => {
                    // 空段落用于段落间距
                    if (paragraph === '') {
                      return <div key={pIndex} className="h-4"></div>;
                    }
                    
                    // 处理 Markdown 粗体语法
                    const processMarkdown = (text: string) => {
                      const parts = text.split(/(\*\*.*?\*\*)/g);
                      return parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      });
                    };
                    
                    return (
                      <p key={pIndex} className="text-gray-700 leading-relaxed text-lg">
                        {processMarkdown(paragraph)}
                      </p>
                    );
                  })}
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

