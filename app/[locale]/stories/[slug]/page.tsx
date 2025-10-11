/**
 * Stories 动态路由
 * 
 * 路径示例: /en/stories/wedding-countdown
 * 内容类型: 用户故事、真实案例、情感共鸣
 */

import { notFound } from 'next/navigation';
import { allStories } from '@/.contentlayer/generated';
import { Metadata } from 'next';
import { MDXContent } from '@/components/mdx-content';
import Breadcrumb from '@/components/Breadcrumb';
import { getTranslations } from 'next-intl/server';

interface StoryPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  const paths: { locale: string; slug: string }[] = [];

  allStories.forEach((story) => {
    paths.push({
      locale: story.locale,
      slug: story.slug,
    });
  });

  return paths;
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const story = allStories.find(
    (s) => s.slug === slug && s.locale === locale
  );

  if (!story) {
    return {};
  }

  return {
    title: story.title,
    description: story.description,
    keywords: story.keywords,
    openGraph: {
      title: story.title,
      description: story.description,
      type: 'article',
      publishedTime: String(new Date().toISOString()),
      authors: [story.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.description,
    },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { locale, slug } = params;
  const story = allStories.find(
    (s) => s.slug === slug && s.locale === locale
  );

  if (!story) {
    notFound();
  }

  const t = await getTranslations({ locale });

  const breadcrumbs = [
    { label: t('common.home'), href: `/${locale}` },
    { label: t('breadcrumb.stories'), href: `/${locale}/stories` },
    { label: story.title, href: story.url },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {story.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>{story.author}</span>
          <span>•</span>
          <time dateTime={story.date}>
            {new Date(story.date).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{story.readingTime}</span>
        </div>
      </header>


      <MDXContent code={story.body?.code || story.body?.raw || ''} />

    </div>
  );
}

