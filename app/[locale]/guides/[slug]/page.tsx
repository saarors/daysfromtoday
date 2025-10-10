/**
 * Guides 动态路由
 * 
 * 路径示例: /en/guides/how-to-use-business-days
 * 内容类型: 使用指南、操作教程、FAQ
 */

import { notFound } from 'next/navigation';
import { allGuides } from 'contentlayer/generated';
import { Metadata } from 'next';
import { MDXContent } from '@/components/mdx-content';
import { Breadcrumb } from '@/components/breadcrumb';
import { getTranslations } from 'next-intl/server';

interface GuidePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  const paths: { locale: string; slug: string }[] = [];

  allGuides.forEach((guide) => {
    paths.push({
      locale: guide.locale,
      slug: guide.slug,
    });
  });

  return paths;
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guide = allGuides.find(
    (g) => g.slug === params.slug && g.locale === params.locale
  );

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: guide.coverImage ? [guide.coverImage] : [],
      type: 'article',
      publishedTime: guide.publishedAt,
      authors: [guide.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
      images: guide.coverImage ? [guide.coverImage] : [],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = allGuides.find(
    (g) => g.slug === params.slug && g.locale === params.locale
  );

  if (!guide) {
    notFound();
  }

  const t = await getTranslations({ locale: params.locale });

  const breadcrumbs = [
    { label: t('common.home'), href: `/${params.locale}` },
    { label: t('breadcrumb.guides'), href: `/${params.locale}/guides` },
    { label: guide.title, href: guide.url },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb items={breadcrumbs} locale={params.locale} />

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {guide.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>{guide.author}</span>
          <span>•</span>
          <time dateTime={guide.publishedAt}>
            {new Date(guide.publishedAt).toLocaleDateString(params.locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{guide.readingTime}</span>
        </div>
      </header>

      {guide.coverImage && (
        <div className="mb-8">
          <img
            src={guide.coverImage}
            alt={guide.title}
            className="w-full rounded-lg"
          />
        </div>
      )}

      <MDXContent code={guide.body.code} />

      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {guide.tags?.map((tag) => (
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

