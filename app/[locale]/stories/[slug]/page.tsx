/**
 * Stories 动态路由
 * 
 * 路径示例: /en/stories/wedding-countdown
 * 内容类型: 用户故事、真实案例、情感共鸣
 */

import { notFound } from 'next/navigation';
import { allStories } from 'contentlayer/generated';
import { Metadata } from 'next';
import { MDXContent } from '@/components/mdx-content';
import { Breadcrumb } from '@/components/breadcrumb';
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
  const story = allStories.find(
    (s) => s.slug === params.slug && s.locale === params.locale
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
      images: story.coverImage ? [story.coverImage] : [],
      type: 'article',
      publishedTime: story.publishedAt,
      authors: [story.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.description,
      images: story.coverImage ? [story.coverImage] : [],
    },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const story = allStories.find(
    (s) => s.slug === params.slug && s.locale === params.locale
  );

  if (!story) {
    notFound();
  }

  const t = await getTranslations({ locale: params.locale });

  const breadcrumbs = [
    { label: t('common.home'), href: `/${params.locale}` },
    { label: t('breadcrumb.stories'), href: `/${params.locale}/stories` },
    { label: story.title, href: story.url },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb items={breadcrumbs} locale={params.locale} />

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {story.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>{story.author}</span>
          <span>•</span>
          <time dateTime={story.publishedAt}>
            {new Date(story.publishedAt).toLocaleDateString(params.locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{story.readingTime}</span>
        </div>
      </header>

      {story.coverImage && (
        <div className="mb-8">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full rounded-lg"
          />
        </div>
      )}

      <MDXContent code={story.body.code} />

      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {story.tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}

