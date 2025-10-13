import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPhilosophies } from '@/.contentlayer/generated';
import { MDXContent } from '@/components/mdx-content';
import { Breadcrumb } from '@/components/Breadcrumb';
import { getTranslations } from 'next-intl/server';

interface PhilosophyPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  return allPhilosophies.map((philosophy) => ({
    slug: philosophy.slug,
  }));
}

export async function generateMetadata({ params }: PhilosophyPageProps): Promise<Metadata> {
  const { locale, slug } = params;
  const philosophy = allPhilosophies.find((p) => p.slug === slug && p.locale === locale);

  if (!philosophy) {
    return {
      title: 'Philosophy Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
  const url = `${baseUrl}/${locale}/philosophy/${slug}`;

  return {
    title: philosophy.title,
    description: philosophy.description,
    openGraph: {
      title: philosophy.title,
      description: philosophy.description,
      url,
      type: 'article',
      publishedTime: philosophy.date,
      authors: [philosophy.author],
      tags: philosophy.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: philosophy.title,
      description: philosophy.description,
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/philosophy/${slug}`,
        zh: `${baseUrl}/zh/philosophy/${slug}`,
      },
    },
  };
}

export default async function PhilosophyPage({ params }: PhilosophyPageProps) {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: 'common' });
  
  const philosophy = allPhilosophies.find((p) => p.slug === slug && p.locale === locale);

  if (!philosophy) {
    notFound();
  }

  const breadcrumbItems = [
    { label: t('home'), href: `/${locale}` },
    { label: t('breadcrumb.philosophy'), href: `/${locale}/philosophy` },
    { label: philosophy.title },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} locale={locale} />
        
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {philosophy.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span>By {philosophy.author}</span>
              <span>•</span>
              <time dateTime={philosophy.date}>
                {new Date(philosophy.date).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>{philosophy.readingTime}</span>
            </div>

            {philosophy.tags && philosophy.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {philosophy.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose dark:prose-invert max-w-none">
            <MDXContent code={philosophy.body.code} />
          </div>
        </article>
      </div>
    </div>
  );
}
