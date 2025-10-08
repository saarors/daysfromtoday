#!/usr/bin/env node

/**
 * 博客文章创建脚本
 * 
 * 使用方法：
 * node scripts/create-blog-post.js <slug> <category>
 * 
 * 示例：
 * node scripts/create-blog-post.js my-new-post Story
 */

const fs = require('fs');
const path = require('path');

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('❌ Usage: node scripts/create-blog-post.js <slug> <category>');
  console.error('   Categories: Story, Guide, News, Update');
  process.exit(1);
}

const [slug, category] = args;
const validCategories = ['Story', 'Guide', 'News', 'Update'];

if (!validCategories.includes(category)) {
  console.error(`❌ Invalid category: ${category}`);
  console.error(`   Valid categories: ${validCategories.join(', ')}`);
  process.exit(1);
}

// 生成文件内容
const today = new Date().toISOString().split('T')[0];

const categoryTranslations = {
  'Story': '故事',
  'Guide': '指南',
  'News': '新闻',
  'Update': '更新',
};

const template = `import type { Metadata } from 'next';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Breadcrumb from '@/components/Breadcrumb';
import BlogArticle from '@/components/BlogArticle';
import { generateBlogMetadata, generateBlogJsonLd } from '@/lib/blog-utils';
import type { BlogPost } from '@/types/blog';

interface PageParams {
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

// 博客文章数据
const blogPost: BlogPost = {
  slug: '${slug}',
  title: {
    en: 'Your English Title Here',
    zh: '您的中文标题'
  },
  author: 'Leon',
  date: '${today}',
  excerpt: {
    en: 'Your English excerpt here (100-160 characters)',
    zh: '您的中文摘要（80-120字符）'
  },
  description: {
    en: 'Your English description for SEO (120-160 characters)',
    zh: '您的中文描述用于SEO（80-120字符）'
  },
  category: {
    en: '${category}',
    zh: '${categoryTranslations[category]}'
  },
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  readTime: {
    en: '5 min read',
    zh: '5 分钟阅读'
  },
  cover: '/images/blog/${slug}-cover.jpg',
  ogImage: '/images/blog/${slug}-og.jpg',
  published: true,
  featured: false,
  lang: 'zh-en',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateBlogMetadata(blogPost, locale);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale } = await params;
  const isChinese = locale === 'zh';

  const content = {
    en: {
      title: blogPost.title.en,
      date: 'October 8, 2025',
      readTime: blogPost.readTime.en,
      sections: [
        {
          heading: '',
          content: [
            'Your opening paragraph here.',
            '',
            'Add more content...'
          ]
        },
        {
          heading: 'Section Heading',
          content: [
            'Section content here.',
            '',
            '**Bold text** for emphasis.'
          ]
        },
      ]
    },
    zh: {
      title: blogPost.title.zh,
      date: '2025年10月8日',
      readTime: blogPost.readTime.zh,
      sections: [
        {
          heading: '',
          content: [
            '您的开场段落。',
            '',
            '添加更多内容...'
          ]
        },
        {
          heading: '章节标题',
          content: [
            '章节内容。',
            '',
            '**粗体文字** 用于强调。'
          ]
        },
      ]
    }
  };

  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <TopNav locale={locale} />
      
      <div className="container mx-auto px-4 py-12 pt-24 md:pt-32 max-w-4xl">
        <Breadcrumb locale={locale} />

        <BlogArticle 
          content={t}
          locale={locale}
          category={blogPost.category.en}
          slug={blogPost.slug}
          author={blogPost.author}
        />
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogJsonLd(blogPost, locale))
        }}
      />
    </div>
  );
}
`;

// 创建文件
const blogDir = path.join(process.cwd(), 'app', '[locale]', 'blog', slug);
const pagePath = path.join(blogDir, 'page.tsx');

try {
  // 检查目录是否已存在
  if (fs.existsSync(blogDir)) {
    console.error(`❌ Blog post already exists: ${slug}`);
    process.exit(1);
  }

  // 创建目录
  fs.mkdirSync(blogDir, { recursive: true });

  // 写入文件
  fs.writeFileSync(pagePath, template);

  console.log('✅ Blog post created successfully!');
  console.log('');
  console.log('📁 Location:');
  console.log(`   ${pagePath}`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Edit the file and add your content');
  console.log('   2. Add cover image to: /public/images/blog/${slug}-cover.jpg');
  console.log('   3. Add OG image to: /public/images/blog/${slug}-og.jpg');
  console.log('   4. Update the blog list in: app/[locale]/blog/page.tsx');
  console.log('');
  console.log('🔗 Preview URLs:');
  console.log(`   EN: http://localhost:3000/en/blog/${slug}`);
  console.log(`   ZH: http://localhost:3000/zh/blog/${slug}`);

} catch (error) {
  console.error('❌ Error creating blog post:', error.message);
  process.exit(1);
}

