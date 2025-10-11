/**
 * Philosophy 动态路由
 * 
 * 路径示例: /en/philosophy/time-management
 * 内容类型: 哲学思考、时间观念、方法论
 */

import { notFound } from 'next/navigation';
import { allPhilosophies } from '@/.contentlayer/generated';
import { Metadata } from 'next';
import { MDXContent } from '@/components/mdx-content';
import Breadcrumb from '@/components/Breadcrumb';
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
  const { locale, slug } = await params;
  const philosophy = allPhilosophies.find(
    (p) => p.slug === slug && p.locale === locale
  );

  if (!philosophy) {
    return {};
  }

  return {
    title: philosophy.title,
    description: philosophy.description,
    keywords: philosophy.keywords,
    openGraph: {
      title: philosophy.title,
      description: philosophy.description,
      type: 'article',
      publishedTime: String(new Date().toISOString()),
      authors: [philosophy.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: philosophy.title,
      description: philosophy.description,
    },
  };
}

/**
 * Philosophy 页面
 */
export default async function PhilosophyPage({ params }: PhilosophyPageProps) {
  const { locale, slug } = params;
  const philosophy = allPhilosophies.find(
    (p) => p.slug === slug && p.locale === locale
  );

  if (!philosophy) {
    notFound();
  }

  const t = await getTranslations({ locale });

  // 生成面包屑
  const breadcrumbs = [
    { label: t('common.home'), href: `/${locale}` },
    { label: t('breadcrumb.philosophy'), href: `/${locale}/philosophy` },
    { label: philosophy.title, href: philosophy.url },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 面包屑导航 */}

      {/* 文章头部 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{philosophy.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {philosophy.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>{philosophy.author}</span>
          <span>•</span>
          <time dateTime={philosophy.date}>
            {new Date(philosophy.date).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      {/* 封面图 */}

      {/* MDX 内容 */}
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent code={philosophy.body?.code || philosophy.body?.raw || ''} />
        </div>

      {/* 文章底部 */}
    </div>
  );
}

