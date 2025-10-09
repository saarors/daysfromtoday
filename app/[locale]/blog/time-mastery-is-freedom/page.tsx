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
    ? '时间的哲学：为什么掌控时间 = 掌控人生' 
    : 'Time Mastery = Life Mastery: Why Time is Your Only Fair Advantage';
  
  const description = locale === 'zh'
    ? '说真的，人生这场游戏不公平的地方太多了。但偏偏有一件事，老天挺公道——那就是时间。每个人，一天都是 24 小时。问题是：你是时间的老板，还是它的打工人？'
    : 'Life\'s unfair. Some people are born rich, some lucky, some just tired. But here\'s the one thing that\'s fair: time. Everyone gets 24 hours a day. The only question is: are you the boss of your time, or just another employee working for it?';

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/blog/time-mastery-is-freedom`,
      languages: {
        'en': 'https://www.daysfromtoday.ai/en/blog/time-mastery-is-freedom',
        'zh': 'https://www.daysfromtoday.ai/zh/blog/time-mastery-is-freedom',
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/blog/time-mastery-is-freedom`,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      publishedTime: '2025-10-09T00:00:00Z',
      authors: ['Leon'],
    },
  };
}

export default async function TimeMasteryPage({ params }: PageProps) {
  const { locale } = await params;
  const isChinese = locale === 'zh';

  const content = {
    zh: {
      title: "时间的哲学：为什么掌控时间 = 掌控人生",
      date: '2025年10月9日',
      readTime: '6 分钟阅读',
      author: 'Leon',
      sections: [
        {
          content: [
            '说真的，人生这场游戏吧，不公平的地方太多了。',
            '',
            '有的人出生就含着金汤勺，有的人一出生就在起跑线上往后退两步。',
            '有的人聪明，有的人有资源，有的人有背景。',
            '',
            '但偏偏有一件事，老天挺公道。',
            '那就是——**时间**。',
            '',
            '每个人，一天都是 24 小时，不多给你一秒，也不少算我一分钟。',
            '',
            '问题是：',
            '**你是时间的老板，还是它的打工人？**'
          ]
        },
        {
          heading: '💡 时间，是我们唯一可以"管理"的命运',
          content: [
            '我记得我第一次从大公司出来创业的时候，投资人对我说了一句话，我现在都记得特清楚：',
            '',
            '> "Leon，一个 CEO 能不能成，不在于多聪明，而在于你把时间花在哪。"',
            '',
            '当时我还挺不服的，心想：',
            '我这人干活又快又稳，时间当然都花在正事上。',
            '',
            '结果……几年后才发现，人家那句话是真理。',
            '',
            '**你现在在干嘛，三年后就是结果。**',
            '你今天磨磨蹭蹭浪费掉的一小时，未来都得用十小时去还。',
            '',
            '有的人总觉得命运不公平，',
            '其实只是因为他没想清楚——**自己把时间都浪费在哪了**。'
          ]
        },
        {
          heading: '📍 "在对的时间，做对的事"这句话，不是鸡汤',
          content: [
            '巴菲特说过一句特实在的话：',
            '',
            '> "聪明人，会在有时间的时候，去做正确的事。"',
            '',
            '简单，但很扎心。',
            '',
            '因为多数人**不是没时间**，',
            '而是**花太多时间在不重要的事上**——',
            '',
            '- 比如看别人过得好不好',
            '- 比如纠结过去的破事儿',
            '- 或者干脆，一边焦虑一边刷短视频',
            '',
            '**时间其实挺现实的**，你爱惜它，它就帮你；',
            '你糟蹋它，它就报复你。'
          ]
        },
        {
          heading: '🧭 DaysFromToday：和未来签个"时间契约"',
          content: [
            '我做 [DaysFromToday](https://www.daysfromtoday.ai) 的时候，其实就是想帮人**"看见未来"**。',
            '',
            '不是玄学，是字面意思。',
            '',
            '你设一个目标，一个纪念日，一个想达成的愿望。',
            '它帮你把那个**「模糊的未来」拉到眼前**，让你每天都能看到——',
            '**你离它还有几天。**',
            '',
            '你会发现，那种倒计时的感觉，真的不一样。',
            '那是一种**「我和时间的合作关系」**，',
            '它不再是敌人，而是你的搭档。'
          ]
        },
        {
          heading: '🔥 未来的你，正在被今天塑造',
          content: [
            '有时候我也会想：',
            '三年前的我，可能想不到今天能活成这样；',
            '但我现在做的每个决定，',
            '也正在塑造**三年后的我**。',
            '',
            '这事儿想明白了，时间就不再是个抽象的词，',
            '而是一种**选择权**。',
            '',
            '你准备好了吗？',
            '不如现在就去看看——',
            '',
            '**从今天开始，100 天后，你想变成谁？**',
            '',
            '👉 [开始你的时间规划](https://www.daysfromtoday.ai/zh)'
          ]
        },
        {
          heading: '📌 金句摘录',
          content: [
            '- "你现在在干嘛，三年后就是结果。"',
            '- "时间其实挺现实的，你爱惜它，它就帮你；你糟蹋它，它就报复你。"',
            '- "时间不再是敌人，而是你的搭档。"',
            '- "时间不再是个抽象的词，而是一种选择权。"'
          ]
        }
      ]
    },
    en: {
      title: "Time Mastery = Life Mastery: Why Time is Your Only Fair Advantage",
      date: 'October 9, 2025',
      readTime: '6 min read',
      author: 'Leon',
      sections: [
        {
          content: [
            'Life\'s unfair.',
            '',
            'Some people are born rich, some are born lucky,',
            'and some are just born tired.',
            '',
            'But here\'s the one thing that\'s fair:',
            '**time.**',
            '',
            'Everyone gets 24 hours a day — no more, no less.',
            '',
            'The only question is:',
            '**Are you the boss of your time, or just another employee working for it?**'
          ]
        },
        {
          heading: '⏳ Time is destiny — literally',
          content: [
            'When I left my comfy corporate job and started my first company,',
            'my investor said something I didn\'t get back then:',
            '',
            '> "Leon, a CEO\'s success depends on where he spends his time."',
            '',
            'I rolled my eyes a bit.',
            '',
            'Nine years later — **he\'s still right, and I was still wrong.**',
            '',
            'Your life right now? That\'s what you built three years ago.',
            'Your life three years from now? That\'s what you\'re building **today**.',
            '',
            'Time doesn\'t lie. It\'s your most honest partner — and the toughest boss.'
          ]
        },
        {
          heading: '💡 It\'s not about having time, it\'s about spending it right',
          content: [
            'Warren Buffett said:',
            '',
            '> "The wise man does the right thing when he has time."',
            '',
            'It sounds like a fortune cookie, but it\'s gospel truth.',
            '',
            'Most people **don\'t lack time** — they just **waste it worrying about the wrong things**.',
            '',
            '- Scrolling',
            '- Complaining',
            '- Comparing',
            '',
            'Classic human stuff.',
            '',
            'But time?',
            '**If you treat it like a friend, it pays you back.**',
            'If you ignore it, it\'ll ghost you.'
          ]
        },
        {
          heading: '🧭 DaysFromToday — A deal with your future self',
          content: [
            'That\'s why I built [DaysFromToday](https://www.daysfromtoday.ai).',
            '',
            'It\'s like **making a promise with your future self**.',
            '',
            'You set a date, a goal, a dream —',
            'and it keeps it right in front of you, every single day.',
            '',
            'You stop saying **"someday"** and start saying **"in 87 days."**',
            '',
            'It\'s not just a countdown;',
            'it\'s a quiet reminder that **time\'s on your side, if you know how to spend it**.'
          ]
        },
        {
          heading: '🔥 Your future self is being built today',
          content: [
            'Sometimes I think:',
            'Three years ago, I couldn\'t imagine living the life I have now.',
            'But the decisions I\'m making today are shaping the me of **three years from now**.',
            '',
            'Once you get that, time stops being abstract.',
            'It becomes a **choice**.',
            '',
            'You ready?',
            '',
            '**Go set your 100 days goal.**',
            '',
            '👉 [Start Your Time Planning](https://www.daysfromtoday.ai/en)'
          ]
        },
        {
          heading: '📌 Key Quotes',
          content: [
            '- "Your life right now? That\'s what you built three years ago."',
            '- "If you treat time like a friend, it pays you back."',
            '- "Time\'s on your side, if you know how to spend it."',
            '- "Time stops being abstract. It becomes a choice."'
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

