import type { Metadata } from 'next';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Breadcrumb from '@/components/Breadcrumb';

interface PageParams {
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const title = locale === 'zh' 
    ? '我们为什么要记住未来的某一天' 
    : 'Why We Need to Remember a Day in the Future';
  
  const description = locale === 'zh'
    ? '年过四十之后，我发现自己变了。原来能记住的小事儿，现在老忘。时间吧，真是个狡猾的朋友。它不提醒、不催促，但它默默地让你付出代价。'
    : 'When you hit forty, something changes. Your memory starts playing hide and seek. Time doesn\'t yell. It whispers. And one day you realize it\'s already gone.';

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/blog/why-remember-future-day`,
      languages: {
        'en': 'https://www.daysfromtoday.ai/en/blog/why-remember-future-day',
        'zh': 'https://www.daysfromtoday.ai/zh/blog/why-remember-future-day',
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/blog/why-remember-future-day`,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      publishedTime: '2025-10-09T00:00:00Z',
      authors: ['Leon'],
    },
  };
}

export default async function WhyRememberFutureDayPage({ params }: PageProps) {
  const { locale } = await params;
  const isChinese = locale === 'zh';

  const content = {
    zh: {
      title: "我们为什么要记住未来的某一天",
      date: '2025年10月9日',
      readTime: '5 分钟阅读',
      author: 'Leon',
      sections: [
        {
          content: [
            '年过四十之后，我发现自己变了。',
            '',
            '原来能记住的小事儿，现在老忘。',
            '老婆笑我说，"你这人还没老，记性先老了。"',
            '',
            '其实，别说四十，二十五岁那会儿我就经常忘事儿。',
            '',
            '想庆祝结婚纪念日，结果加班出差，草草带过；',
            '想拿股票长期投资，结果一年多就卖了，错过了翻十倍；',
            '想跑马拉松，结果训练计划拖着拖着，',
            '等想起来的时候，比赛只剩十天。',
            '',
            '**时间吧，真是个狡猾的朋友。**',
            '它不提醒、不催促，',
            '但它默默地让你付出代价。'
          ]
        },
        {
          heading: '🔦 未来的那一天，其实是个"灯塔"',
          content: [
            '我后来想明白了，',
            '其实**不是我记性差**，',
            '是**"未来"离我太远了**。',
            '',
            '如果一个目标太模糊，',
            '人就很容易把它搁一边。',
            '',
            '而**「未来的某一天」——**',
            '其实就像一座**灯塔**，让我们在日常生活的海里不至于迷航。'
          ]
        },
        {
          heading: '⏳ 日历提醒"今天"，但谁提醒"那一天"？',
          content: [
            '日历，提醒我们今天是几号；',
            '手表，提醒我们现在几点；',
            '',
            '而我们缺的，是一个**提醒"未来某天"的工具**。',
            '',
            '[DaysFromToday](https://www.daysfromtoday.ai) 就是干这个的。',
            '它帮你数日子、设目标、看未来。',
            '',
            '**它不是那种滴答作响的倒计时器，**',
            '**而是一个安静的领航员，**',
            '让你知道自己在时间的航程上，正往哪儿走。'
          ]
        },
        {
          heading: '📅 那些值得被倒数的日子',
          content: [
            '有些日子，值得被记住。',
            '有些未来，值得被倒数。',
            '',
            '- **100 天后的产品发布会**',
            '  让你每天多推进一步，而不是临时抱佛脚',
            '',
            '- **180 天后的婚礼**',
            '  让你从容筹备，而不是手忙脚乱',
            '',
            '- **365 天后的退休**',
            '  让你珍惜每一天，而不是忽然发现时光飞逝',
            '',
            '- **30 天后的孩子生日**',
            '  让你提前准备，而不是又一次错过',
            '',
            '**每一个倒计时，都是一次和未来的约定。**'
          ]
        },
        {
          heading: '🚀 我设好了 100 天后的愿望，你呢？',
          content: [
            '我现在有一个**「100 天倒计时」**。',
            '那天我要完成一个新目标。',
            '',
            '每天看到它，我就提醒自己：',
            '**今天得多迈一步，不然那一天永远不会来。**',
            '',
            '你呢？',
            '**你有没有一个值得被倒数的未来？**',
            '',
            '👉 [开始你的倒计时](https://www.daysfromtoday.ai/zh/anniversaries)'
          ]
        },
        {
          heading: '💭 时间不等人，但你可以和它约定',
          content: [
            '时间从不回头，',
            '但你可以提前和它约好——',
            '',
            '**未来的某一天，你想成为谁？**',
            '**未来的某一天，你想完成什么？**',
            '',
            '记住那一天，',
            '就是给自己一个理由，',
            '让今天的每一步，都变得有意义。'
          ]
        },
        {
          heading: '📌 金句摘录',
          content: [
            '- "时间吧，真是个狡猾的朋友。它不提醒、不催促，但它默默地让你付出代价。"',
            '- "未来的某一天，其实就像一座灯塔，让我们在日常生活的海里不至于迷航。"',
            '- "每一个倒计时，都是一次和未来的约定。"',
            '- "记住那一天，就是给自己一个理由，让今天的每一步，都变得有意义。"'
          ]
        }
      ]
    },
    en: {
      title: "Why We Need to Remember a Day in the Future",
      date: 'October 9, 2025',
      readTime: '5 min read',
      author: 'Leon',
      sections: [
        {
          content: [
            'When you hit forty, something changes.',
            '',
            'Your body\'s fine, but your memory? It starts playing hide and seek.',
            '',
            'My wife says, "You\'re not old, but your brain\'s retired."',
            'She\'s right.',
            '',
            'But honestly, I started forgetting things **way earlier**.',
            '',
            'Like that time I wanted to celebrate my wedding anniversary —',
            'then got stuck on a work trip.',
            '',
            'Or that stock I planned to hold for five years —',
            'sold it after one and missed a 10x gain.',
            '',
            'Or the marathon I signed up for —',
            'and forgot until 10 days before the race.',
            '',
            '**Time doesn\'t yell. It whispers.**',
            'And one day you realize it\'s already gone.'
          ]
        },
        {
          heading: '🔦 A day in the future is like a lighthouse',
          content: [
            'I realized something simple:',
            '**It\'s not that I forget — it\'s that the future is too far away.**',
            '',
            'When the goal is vague, you let it slide.',
            '',
            'But when there\'s **a date — a real day —**',
            'it becomes a **promise**.',
            '',
            '**That future day is a lighthouse.**',
            'It helps you navigate the ocean of everyday chaos.'
          ]
        },
        {
          heading: '⏳ Calendars tell you "today." But who reminds you of "that day"?',
          content: [
            'Calendars tell you what day it is.',
            'Watches tell you what time it is.',
            '',
            'But no one reminds you of **that day** —',
            'the one that actually matters.',
            '',
            'That\'s what [DaysFromToday](https://www.daysfromtoday.ai) does.',
            '',
            '**It\'s not about ticking seconds.**',
            '**It\'s about lighting up the future.**'
          ]
        },
        {
          heading: '📅 Days worth counting down',
          content: [
            'Some days deserve to be remembered.',
            'Some futures deserve a countdown.',
            '',
            '- **100 days until product launch**',
            '  So you move forward every day, not scramble at the last minute',
            '',
            '- **180 days until the wedding**',
            '  So you prepare with calm, not chaos',
            '',
            '- **365 days until retirement**',
            '  So you cherish each day, not realize time flew by',
            '',
            '- **30 days until your kid\'s birthday**',
            '  So you plan ahead, not miss it again',
            '',
            '**Every countdown is a promise to your future self.**'
          ]
        },
        {
          heading: '🚀 I\'ve set my 100-day wish. Have you?',
          content: [
            'I\'ve already set a **100-day goal**.',
            '',
            'Every morning when I open the page,',
            'I\'m reminded:',
            '**"Hey, time\'s not waiting — better move."**',
            '',
            'So yeah — your turn.',
            '',
            '**What\'s your "someday" that deserves a countdown?**',
            '',
            '👉 [Start Your Countdown](https://www.daysfromtoday.ai/en/anniversaries)'
          ]
        },
        {
          heading: '💭 Time doesn\'t wait, but you can make a deal with it',
          content: [
            'Time never looks back.',
            'But you can make a promise with it —',
            '',
            '**Who do you want to be on that future day?**',
            '**What do you want to achieve?**',
            '',
            'Remember that day,',
            'and every step you take today',
            'becomes meaningful.'
          ]
        },
        {
          heading: '📌 Key Quotes',
          content: [
            '- "Time doesn\'t yell. It whispers. And one day you realize it\'s already gone."',
            '- "That future day is a lighthouse. It helps you navigate the ocean of everyday chaos."',
            '- "Every countdown is a promise to your future self."',
            '- "Remember that day, and every step you take today becomes meaningful."'
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
        
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mt-8">
          {/* Header */}
          <header className="mb-8 pb-8 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {t.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <span>✍️</span>
                <span>{t.author}</span>
              </span>
              <span>•</span>
              <time>{t.date}</time>
              <span>•</span>
              <span>📖 {t.readTime}</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {t.sections.map((section, index) => (
              <section key={index} className="mb-8">
                {section.heading && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {section.heading}
                  </h2>
                )}
                {section.content.map((paragraph, pIndex) => {
                  if (paragraph === '') {
                    return <br key={pIndex} />;
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={pIndex} className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">
                        {paragraph.substring(2)}
                      </blockquote>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={pIndex} className="ml-6 text-gray-700">
                        {paragraph.substring(2)}
                      </li>
                    );
                  }
                  if (paragraph.includes('**')) {
                    const parts = paragraph.split('**');
                    return (
                      <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                        {parts.map((part, i) => 
                          i % 2 === 0 ? part : <strong key={i} className="font-bold text-gray-900">{part}</strong>
                        )}
                      </p>
                    );
                  }
                  if (paragraph.includes('[')) {
                    const linkMatch = paragraph.match(/\[(.*?)\]\((.*?)\)/);
                    if (linkMatch) {
                      const [fullMatch, linkText, linkUrl] = linkMatch;
                      const beforeLink = paragraph.substring(0, paragraph.indexOf(fullMatch));
                      const afterLink = paragraph.substring(paragraph.indexOf(fullMatch) + fullMatch.length);
                      return (
                        <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                          {beforeLink}
                          <a href={linkUrl} className="text-blue-600 hover:text-blue-700 underline">
                            {linkText}
                          </a>
                          {afterLink}
                        </p>
                      );
                    }
                  }
                  return (
                    <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </section>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/${locale}/blog`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← {isChinese ? '返回博客' : 'Back to Blog'}
              </Link>
              <Link 
                href={`/${locale}`}
                className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {isChinese ? '返回首页' : 'Back to Homepage'}
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}

