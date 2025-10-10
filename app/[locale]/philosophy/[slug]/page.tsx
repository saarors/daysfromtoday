/**
 * Philosophy 动态路由
 * 
 * 路径示例: /en/philosophy/time-management
 * 内容类型: 哲学思考、时间观念、方法论
 */

import { notFound } from 'next/navigation';
import { allPhilosophies } from 'contentlayer/generated';
import { Metadata } from 'next';
import { MDXContent } from '@/components/mdx-content';
import { Breadcrumb, generateBreadcrumbs } from '@/components/breadcrumb';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

interface PhilosophyPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

/**
 * 生成静态路径
 */
export async function generateStaticParams() {
  const paths: { locale: string; slug: string }[] = [];

  allPhilosophies.forEach((philosophy) => {
    paths.push({
      locale: philosophy.locale,
      slug: philosophy.slug,
    });
  });

  return paths;
}

/**
 * 生成 Metadata（SEO）
 */
export async function generateMetadata({
  params,
}: PhilosophyPageProps): Promise<Metadata> {
  const philosophy = allPhilosophies.find(
    (p) => p.slug === params.slug && p.locale === params.locale
  );

  if (!philosophy) {
    return {};
  }

  const t = await getTranslations({ locale: params.locale });

  return {
    title: philosophy.title,
    description: philosophy.description,
    keywords: philosophy.keywords,
    openGraph: {
      title: philosophy.title,
      description: philosophy.description,
      images: philosophy.coverImage ? [philosophy.coverImage] : [],
      type: 'article',
      publishedTime: philosophy.publishedAt,
      authors: [philosophy.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: philosophy.title,
      description: philosophy.description,
      images: philosophy.coverImage ? [philosophy.coverImage] : [],
    },
  };
}

/**
 * Philosophy 页面
 */
export default async function PhilosophyPage({ params }: PhilosophyPageProps) {
  const philosophy = allPhilosophies.find(
    (p) => p.slug === params.slug && p.locale === params.locale
  );

  if (!philosophy) {
    notFound();
  }

  const t = await getTranslations({ locale: params.locale });

  // 生成面包屑
  const breadcrumbs = [
    { label: t('common.home'), href: `/${params.locale}` },
    { label: t('breadcrumb.philosophy'), href: `/${params.locale}/philosophy` },
    { label: philosophy.title, href: philosophy.url },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 面包屑导航 */}
      <Breadcrumb items={breadcrumbs} locale={params.locale} />

      {/* 文章头部 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{philosophy.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {philosophy.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>{philosophy.author}</span>
          <span>•</span>
          <time dateTime={philosophy.publishedAt}>
            {new Date(philosophy.publishedAt).toLocaleDateString(params.locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{philosophy.readingTime}</span>
        </div>
      </header>

      {/* 封面图 */}
      {philosophy.coverImage && (
        <div className="mb-8">
          <img
            src={philosophy.coverImage}
            alt={philosophy.title}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* MDX 内容 */}
      <MDXContent code={philosophy.body.code} />

      {/* 文章底部 */}
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {philosophy.tags?.map((tag) => (
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

