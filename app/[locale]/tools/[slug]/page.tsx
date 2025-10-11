/**
 * Tools 动态路由
 * 
 * 路径示例: /en/tools/business-day-calculator
 * 内容类型: 工具介绍、功能说明、使用案例
 */

import { notFound } from 'next/navigation';
import { allTools } from '@/.contentlayer/generated';
import { Metadata } from 'next';
import { MDXContent } from '@/components/mdx-content';
import Breadcrumb from '@/components/Breadcrumb';
import { getTranslations } from 'next-intl/server';

interface ToolPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  const paths: { locale: string; slug: string }[] = [];

  allTools.forEach((tool) => {
    paths.push({
      locale: tool.locale,
      slug: tool.slug,
    });
  });

  return paths;
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = allTools.find(
    (t) => t.slug === slug && t.locale === locale
  );

  if (!tool) {
    return {};
  }

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: tool.title,
      description: tool.description,
      type: 'article',
      publishedTime: String(new Date().toISOString()),
      authors: [tool.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { locale, slug } = params;
  const tool = allTools.find(
    (t) => t.slug === slug && t.locale === locale
  );

  if (!tool) {
    notFound();
  }

  const t = await getTranslations({ locale });

  const breadcrumbs = [
    { label: t('common.home'), href: `/${locale}` },
    { label: t('breadcrumb.tools'), href: `/${locale}/tools` },
    { label: tool.title, href: tool.url },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{tool.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {tool.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>{tool.author}</span>
          <span>•</span>
          <time dateTime={tool.date}>
            {new Date(tool.date).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>


      <MDXContent code={tool.body?.code || tool.body?.raw || ''} />

    </div>
  );
}

