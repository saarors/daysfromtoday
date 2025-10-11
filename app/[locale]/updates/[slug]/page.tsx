/**
 * Updates 动态路由
 * 
 * 路径示例: /en/updates/v2-launch
 * 内容类型: 产品更新、新功能发布、变更日志
 */

import { notFound } from 'next/navigation';
import { allUpdates } from '@/.contentlayer/generated';
import { Metadata } from 'next';
import { MDXContent } from '@/components/mdx-content';
import Breadcrumb from '@/components/Breadcrumb';
import { getTranslations } from 'next-intl/server';

interface UpdatePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  const paths: { locale: string; slug: string }[] = [];

  allUpdates.forEach((update) => {
    paths.push({
      locale: update.locale,
      slug: update.slug,
    });
  });

  return paths;
}

export async function generateMetadata({
  params,
}: UpdatePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const update = allUpdates.find(
    (u) => u.slug === slug && u.locale === locale
  );

  if (!update) {
    return {};
  }

  return {
    title: update.title,
    description: update.description,
    keywords: update.keywords,
    openGraph: {
      title: update.title,
      description: update.description,
      type: 'article',
      publishedTime: String(new Date().toISOString()),
      authors: [update.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: update.title,
      description: update.description,
    },
  };
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const { locale, slug } = params;
  const update = allUpdates.find(
    (u) => u.slug === slug && u.locale === locale
  );

  if (!update) {
    notFound();
  }

  const t = await getTranslations({ locale });

  const breadcrumbs = [
    { label: t('common.home'), href: `/${locale}` },
    { label: t('breadcrumb.updates'), href: `/${locale}/updates` },
    { label: update.title, href: update.url },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      <header className="mb-8">
        {/* 版本标签（如果有） */}
        {update.version && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              v{update.version}
            </span>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{update.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {update.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>{update.author}</span>
          <span>•</span>
          <time dateTime={update.date}>
            {new Date(update.date).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{update.readingTime}</span>
        </div>
      </header>


      <MDXContent code={update.body?.code || update.body?.raw || ''} />

    </div>
  );
}

