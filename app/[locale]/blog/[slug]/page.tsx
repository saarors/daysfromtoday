import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allBlogs } from 'contentlayer/generated';
import { getTranslations } from 'next-intl/server';
import TopNav from '@/components/TopNav';
import { MDXContent } from '@/components/mdx-content';
import { BlogPostTailwind } from '@/components/BlogPostTailwind';

interface PageParams {
  locale: string;
  slug: string;
}

interface PageProps {
  params: PageParams;
}

export async function generateStaticParams() {
  return allBlogs.map((post) => ({
    slug: post.slug,
    locale: post.locale,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = params;
  const post = allBlogs.find((post) => post.slug === slug && post.locale === locale);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
  const postUrl = `${baseUrl}/${locale}/blog/${slug}`;
  
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags?.join(', ') || '',
    authors: [{ name: post.author }],
    alternates: {
      canonical: postUrl,
      languages: {
        'en': `${baseUrl}/en/blog/${slug}`,
        'zh': `${baseUrl}/zh/blog/${slug}`,
      }
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: postUrl,
      siteName: 'DaysFromToday',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.image ? [
        {
          url: post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`,
          alt: post.title,
          width: 1200,
          height: 630,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [
        post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`
      ] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = params;
  
  // Decode URL-encoded slug for Chinese characters
  const decodedSlug = decodeURIComponent(slug);
  
  const post = allBlogs.find((post) => post.slug === decodedSlug && post.locale === locale);
  
  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'common' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
  const postUrl = `${baseUrl}/${locale}/blog/${post.slug}`;


  // Article 结构化数据
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image ? (post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`) : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DaysFromToday',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
    wordCount: post.body.raw?.length || 0,
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav locale={locale} />
      
      {/* Article 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      
      <main className="container mx-auto px-4 py-8 pt-24 md:pt-32">
        <BlogPostTailwind
          title={post.title}
          description={post.description}
          date={post.date}
          author={post.author}
          category={post.category}
          tags={post.tags || []}
          readingTime={post.readingTime}
          locale={locale}
        >
          <MDXContent code={post.body.code} />
        </BlogPostTailwind>
      </main>
    </div>
  );
}
