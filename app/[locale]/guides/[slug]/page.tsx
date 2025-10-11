/**
 * Guides 动态路由
 * 
 * 路径示例: /en/guides/how-to-use-business-days
 * 内容类型: 使用指南、操作教程、FAQ
 */

import { notFound } from 'next/navigation';
import { allGuides } from '@/.contentlayer/generated';
import { Metadata } from 'next';
import { MDXContent } from '@/components/mdx-content';
import Breadcrumb from '@/components/Breadcrumb';
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
  const { locale, slug } = await params;
  const guide = allGuides.find(
    (g) => g.slug === slug && g.locale === locale
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
      type: 'article',
      publishedTime: String(new Date().toISOString()),
      authors: [guide.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale, slug } = params;
  const guide = allGuides.find(
    (g) => g.slug === slug && g.locale === locale
  );

  if (!guide) {
    notFound();
  }

  const t = await getTranslations({ locale });

  const breadcrumbs = [
    { label: t('common.home'), href: `/${locale}` },
    { label: t('breadcrumb.guides'), href: `/${locale}/guides` },
    { label: guide.title, href: guide.url },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {guide.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>{guide.author}</span>
          <span>•</span>
          <time dateTime={guide.date}>
            {new Date(guide.date).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{guide.readingTime}</span>
        </div>
      </header>

      <MDXContent code={guide.body?.code || guide.body?.raw || ''} />

    </div>
  );
}

