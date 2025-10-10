/**
 * Tools 动态路由
 * 
 * 路径示例: /en/tools/business-day-calculator
 * 内容类型: 工具介绍、功能说明、使用案例
 */

import { notFound } from 'next/navigation';
import { allTools } from 'contentlayer/generated';
import { Metadata } from 'next';
import { MDXContent } from '@/components/mdx-content';
import { Breadcrumb } from '@/components/breadcrumb';
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
  const tool = allTools.find(
    (t) => t.slug === params.slug && t.locale === params.locale
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
      images: tool.coverImage ? [tool.coverImage] : [],
      type: 'article',
      publishedTime: tool.publishedAt,
      authors: [tool.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
      images: tool.coverImage ? [tool.coverImage] : [],
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const tool = allTools.find(
    (t) => t.slug === params.slug && t.locale === params.locale
  );

  if (!tool) {
    notFound();
  }

  const t = await getTranslations({ locale: params.locale });

  const breadcrumbs = [
    { label: t('common.home'), href: `/${params.locale}` },
    { label: t('breadcrumb.tools'), href: `/${params.locale}/tools` },
    { label: tool.title, href: tool.url },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb items={breadcrumbs} locale={params.locale} />

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{tool.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {tool.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span>{tool.author}</span>
          <span>•</span>
          <time dateTime={tool.publishedAt}>
            {new Date(tool.publishedAt).toLocaleDateString(params.locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>{tool.readingTime}</span>
        </div>
      </header>

      {tool.coverImage && (
        <div className="mb-8">
          <img
            src={tool.coverImage}
            alt={tool.title}
            className="w-full rounded-lg"
          />
        </div>
      )}

      <MDXContent code={tool.body.code} />

      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {tool.tags?.map((tag) => (
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

