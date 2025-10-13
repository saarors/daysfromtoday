# DaysFromToday 内容管理系统 - 技术实施方案

> 版本: v2.0  
> 更新: 2025-10-10  
> 作者: Leon  
> 目标: 详细说明内容管理系统的技术实现方案

---

## 一、技术架构总览

### 1.1 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     编辑层（本地）                            │
│  Obsidian + 插件 (Templater, Local Images Plus, Git)       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Git 同步
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                     内容层（文件系统）                        │
│  MDX 文件 (content/philosophy|tools|stories|guides|updates) │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Contentlayer 处理
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                     数据层（构建时）                          │
│  Contentlayer 生成 .contentlayer/ (JSON + 类型定义)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Next.js 导入
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                     渲染层（运行时）                          │
│  Next.js App Router + MDX 组件 + 富媒体组件库               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Vercel 部署
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                     用户访问                                  │
│  静态页面 (SSG/ISR) + CDN 加速                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈清单

| 层次 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 编辑器 | Obsidian | Latest | 本地 Markdown 编辑 |
| 内容 | MDX | 2.x | Markdown + React 组件 |
| 内容索引 | Contentlayer | 0.3.x | 内容处理和类型生成 |
| 前端框架 | Next.js | 15.x | SSG/ISR 渲染 |
| 语言 | TypeScript | 5.x | 类型安全 |
| 样式 | Tailwind CSS | 3.x | 样式系统 |
| 国际化 | next-intl | 3.x | 多语言支持 |
| 媒体存储 | Cloudflare R2 | - | 图片/视频存储 |
| 图片处理 | Sharp | Latest | 图片压缩优化 |
| 部署 | Vercel | - | CI/CD + Edge |

---

## 二、Contentlayer 配置详解

### 2.1 安装依赖

```bash
npm install contentlayer next-contentlayer
npm install @aws-sdk/client-s3 sharp
```

### 2.2 配置文件：contentlayer.config.ts

```typescript
import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

// ============================================================
// 1. 定义共享字段
// ============================================================

const sharedFields = {
  title: {
    type: 'string',
    required: true,
    description: '文章标题',
  },
  description: {
    type: 'string',
    required: true,
    description: '文章描述（用于 SEO）',
  },
  date: {
    type: 'date',
    required: true,
    description: '发布日期',
  },
  lastModified: {
    type: 'date',
    description: '最后修改日期',
  },
  author: {
    type: 'string',
    default: 'Leon',
    description: '作者',
  },
  published: {
    type: 'boolean',
    default: true,
    description: '是否发布',
  },
  featured: {
    type: 'boolean',
    default: false,
    description: '是否精选',
  },
  topics: {
    type: 'list',
    of: { type: 'string' },
    description: '主题标签',
  },
  keywords: {
    type: 'list',
    of: { type: 'string' },
    description: 'SEO 关键词',
  },
  ogImage: {
    type: 'string',
    description: 'Open Graph 图片 URL',
  },
  readingTime: {
    type: 'number',
    description: '阅读时长（分钟）',
  },
};

// ============================================================
// 2. 定义 Philosophy（时间哲学）
// ============================================================

const Philosophy = defineDocumentType(() => ({
  name: 'Philosophy',
  filePathPattern: 'philosophy/**/*.mdx',
  contentType: 'mdx',
  fields: {
    ...sharedFields,
    category: {
      type: 'string',
      required: true,
      description: '主分类（如 time-value, growth, mindset）',
    },
    level: {
      type: 'enum',
      options: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
      description: '难度级别',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1]; // en or zh
        const rest = parts.slice(2).join('/');
        return `/${lang}/philosophy/${rest}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop(),
    },
    locale: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
    },
    breadcrumbs: {
      type: 'json',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1];
        const category = parts[2];
        
        const breadcrumbs = [
          { label: lang === 'zh' ? '首页' : 'Home', url: `/${lang}` },
          { label: lang === 'zh' ? '时间哲学' : 'Philosophy', url: `/${lang}/philosophy` },
        ];
        
        if (parts.length > 3) {
          breadcrumbs.push({
            label: getCategoryName(category, lang),
            url: `/${lang}/philosophy/${category}`,
          });
        }
        
        breadcrumbs.push({
          label: doc.title,
          url: doc.url,
        });
        
        return breadcrumbs;
      },
    },
  },
}));

// ============================================================
// 3. 定义 Tools（实用工具）
// ============================================================

const Tools = defineDocumentType(() => ({
  name: 'Tools',
  filePathPattern: 'tools/**/*.mdx',
  contentType: 'mdx',
  fields: {
    ...sharedFields,
    category: {
      type: 'string',
      required: true,
      description: '主分类（如 date-calculation, timezone, holidays）',
    },
    embeds: {
      type: 'json',
      description: '植入的功能组件（如 calculator）',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1];
        const rest = parts.slice(2).join('/');
        return `/${lang}/tools/${rest}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop(),
    },
    locale: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
    },
    breadcrumbs: {
      type: 'json',
      resolve: (doc) => generateBreadcrumbs(doc, 'tools'),
    },
  },
}));

// ============================================================
// 4. 定义 Stories（故事与人）
// ============================================================

const Stories = defineDocumentType(() => ({
  name: 'Stories',
  filePathPattern: 'stories/**/*.mdx',
  contentType: 'mdx',
  fields: {
    ...sharedFields,
    category: {
      type: 'string',
      required: true,
      description: '主分类（如 user-stories, founder, community）',
    },
    storyType: {
      type: 'enum',
      options: ['user', 'founder', 'community'],
      description: '故事类型',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1];
        const rest = parts.slice(2).join('/');
        return `/${lang}/stories/${rest}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop(),
    },
    locale: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
    },
    breadcrumbs: {
      type: 'json',
      resolve: (doc) => generateBreadcrumbs(doc, 'stories'),
    },
  },
}));

// ============================================================
// 5. 定义 Guides（教程指南）
// ============================================================

const Guides = defineDocumentType(() => ({
  name: 'Guides',
  filePathPattern: 'guides/**/*.mdx',
  contentType: 'mdx',
  fields: {
    ...sharedFields,
    category: {
      type: 'string',
      required: true,
      description: '主分类（如 getting-started, features, best-practices）',
    },
    embeds: {
      type: 'json',
      description: '植入的功能组件',
    },
    prerequisites: {
      type: 'list',
      of: { type: 'string' },
      description: '前置要求',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1];
        const rest = parts.slice(2).join('/');
        return `/${lang}/guides/${rest}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop(),
    },
    locale: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
    },
    breadcrumbs: {
      type: 'json',
      resolve: (doc) => generateBreadcrumbs(doc, 'guides'),
    },
  },
}));

// ============================================================
// 6. 定义 Updates（新闻更新）
// ============================================================

const Updates = defineDocumentType(() => ({
  name: 'Updates',
  filePathPattern: 'updates/**/*.mdx',
  contentType: 'mdx',
  fields: {
    ...sharedFields,
    category: {
      type: 'string',
      required: true,
      description: '主分类（如 releases, roadmap, changelog）',
    },
    version: {
      type: 'string',
      description: '版本号（如 v2.0）',
    },
    releaseDate: {
      type: 'date',
      description: '发布日期',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1];
        const rest = parts.slice(2).join('/');
        return `/${lang}/updates/${rest}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop(),
    },
    locale: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
    },
    breadcrumbs: {
      type: 'json',
      resolve: (doc) => generateBreadcrumbs(doc, 'updates'),
    },
  },
}));

// ============================================================
// 7. 辅助函数
// ============================================================

function generateBreadcrumbs(doc: any, type: string) {
  const parts = doc._raw.flattenedPath.split('/');
  const lang = parts[1];
  const category = parts[2];
  
  const typeNames = {
    zh: {
      philosophy: '时间哲学',
      tools: '实用工具',
      stories: '故事与人',
      guides: '教程指南',
      updates: '新闻更新',
    },
    en: {
      philosophy: 'Philosophy',
      tools: 'Tools',
      stories: 'Stories',
      guides: 'Guides',
      updates: 'Updates',
    },
  };
  
  const breadcrumbs = [
    { label: lang === 'zh' ? '首页' : 'Home', url: `/${lang}` },
    { label: typeNames[lang][type], url: `/${lang}/${type}` },
  ];
  
  if (parts.length > 3) {
    breadcrumbs.push({
      label: getCategoryName(category, lang),
      url: `/${lang}/${type}/${category}`,
    });
  }
  
  breadcrumbs.push({
    label: doc.title,
    url: `/${lang}/${type}/${parts.slice(2).join('/')}`,
  });
  
  return breadcrumbs;
}

function getCategoryName(slug: string, lang: string): string {
  const categoryNames = {
    'time-value': { zh: '时间价值', en: 'Time Value' },
    'growth': { zh: '成长思考', en: 'Growth' },
    'mindset': { zh: '心态管理', en: 'Mindset' },
    'date-calculation': { zh: '日期计算', en: 'Date Calculation' },
    'timezone': { zh: '时区换算', en: 'Timezone' },
    'holidays': { zh: '节假日', en: 'Holidays' },
    'user-stories': { zh: '用户故事', en: 'User Stories' },
    'founder': { zh: '创始人故事', en: 'Founder' },
    'getting-started': { zh: '快速上手', en: 'Getting Started' },
    'features': { zh: '功能详解', en: 'Features' },
    'releases': { zh: '版本发布', en: 'Releases' },
    'roadmap': { zh: '产品路线图', en: 'Roadmap' },
  };
  
  return categoryNames[slug]?.[lang] || slug;
}

// ============================================================
// 8. 导出配置
// ============================================================

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Philosophy, Tools, Stories, Guides, Updates],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor'],
          },
        },
      ],
      rehypeHighlight,
    ],
  },
});
```

### 2.3 Next.js 配置集成

**文件**: `next.config.mjs`

```javascript
import { withContentlayer } from 'next-contentlayer';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.daysfromtoday.ai'],
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(withContentlayer(nextConfig));
```

---

## 三、MDX 渲染系统

### 3.1 MDX 组件映射

**文件**: `components/mdx-content.tsx`

```typescript
import { useMDXComponent } from 'next-contentlayer/hooks';
import { HeroBanner } from './mdx/hero-banner';
import { BlogImage } from './mdx/blog-image';
import { ImageWithText } from './mdx/image-with-text';
import { ImageGallery } from './mdx/image-gallery';
import { VideoPlayer } from './mdx/video-player';
import { ChartContainer } from './mdx/chart-container';
import { TableOfContents } from './mdx/table-of-contents';
import { EmbedCalculator } from './mdx/embed-calculator';
import { AddAnniversary } from './mdx/add-anniversary';
import { FeatureCard } from './mdx/feature-card';
import { CountdownDisplay } from './mdx/countdown-display';
import { Accordion } from './mdx/accordion';
import { Tabs, Tab } from './mdx/tabs';
import { Callout } from './mdx/callout';
import { StepGuide, Step } from './mdx/step-guide';
import { CodeBlock } from './mdx/code-block';
import { RelatedContent } from './mdx/related-content';

const components = {
  // 基础展示组件
  HeroBanner,
  BlogImage,
  ImageWithText,
  ImageGallery,
  VideoPlayer,
  ChartContainer,
  TableOfContents,
  
  // 功能植入组件
  EmbedCalculator,
  AddAnniversary,
  FeatureCard,
  CountdownDisplay,
  
  // 交互增强组件
  Accordion,
  Tabs,
  Tab,
  Callout,
  StepGuide,
  Step,
  CodeBlock,
  RelatedContent,
  
  // 标准 HTML 元素增强
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="text-base leading-7 mb-4" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono" {...props} />
  ),
};

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);
  
  return (
    <div className="prose prose-lg max-w-none">
      <Component components={components} />
    </div>
  );
}
```

### 3.2 根组件配置

**文件**: `mdx-components.tsx`（Next.js 15 要求）

```typescript
import type { MDXComponents } from 'mdx/types';
import { HeroBanner } from '@/components/mdx/hero-banner';
// ... 导入其他组件

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    HeroBanner,
    BlogImage,
    // ... 其他组件映射
    ...components,
  };
}
```

---

## 四、动态路由实现

### 4.1 Philosophy 路由

**文件**: `app/[locale]/philosophy/[...slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { allPhilosophies } from 'contentlayer/generated';
import { MDXContent } from '@/components/mdx-content';
import { Breadcrumb } from '@/components/breadcrumb';
import { RelatedContent } from '@/components/related-content';

export async function generateStaticParams() {
  return allPhilosophies.map((doc) => {
    const parts = doc._raw.flattenedPath.split('/');
    return {
      locale: parts[1],
      slug: parts.slice(2),
    };
  });
}

export async function generateMetadata({ params }: any) {
  const path = `philosophy/${params.locale}/${params.slug.join('/')}`;
  const doc = allPhilosophies.find((d) => d._raw.flattenedPath === path);
  
  if (!doc) return {};
  
  return {
    title: doc.title,
    description: doc.description,
    keywords: doc.keywords,
    openGraph: {
      title: doc.title,
      description: doc.description,
      images: [doc.ogImage],
      type: 'article',
      publishedTime: doc.date,
      modifiedTime: doc.lastModified,
    },
    alternates: {
      canonical: `https://www.daysfromtoday.ai${doc.url}`,
      languages: {
        en: doc.url.replace('/zh/', '/en/'),
        zh: doc.url.replace('/en/', '/zh/'),
      },
    },
  };
}

export default async function PhilosophyPage({ params }: any) {
  const path = `philosophy/${params.locale}/${params.slug.join('/')}`;
  const doc = allPhilosophies.find((d) => d._raw.flattenedPath === path);
  
  if (!doc || !doc.published) {
    notFound();
  }
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 面包屑 */}
      <Breadcrumb items={doc.breadcrumbs} />
      
      {/* 文章头部 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{doc.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{doc.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{doc.author}</span>
          <span>·</span>
          <time dateTime={doc.date}>
            {new Date(doc.date).toLocaleDateString(params.locale)}
          </time>
          {doc.readingTime && (
            <>
              <span>·</span>
              <span>{doc.readingTime} min read</span>
            </>
          )}
        </div>
      </header>
      
      {/* MDX 内容 */}
      <MDXContent code={doc.body.code} />
      
      {/* 相关内容推荐 */}
      <RelatedContent topics={doc.topics} currentSlug={doc.slug} />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: doc.title,
            description: doc.description,
            image: doc.ogImage,
            datePublished: doc.date,
            dateModified: doc.lastModified || doc.date,
            author: {
              '@type': 'Person',
              name: doc.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'DaysFromToday',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.daysfromtoday.ai/logo.png',
              },
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: doc.breadcrumbs.map((item: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@id': `https://www.daysfromtoday.ai${item.url}`,
                  name: item.label,
                },
              })),
            },
          }),
        }}
      />
    </article>
  );
}
```

### 4.2 分类聚合页

**文件**: `app/[locale]/philosophy/page.tsx`

```typescript
import { allPhilosophies } from 'contentlayer/generated';
import { Breadcrumb } from '@/components/breadcrumb';
import { ContentCard } from '@/components/content-card';

export default async function PhilosophyIndexPage({ params }: any) {
  const docs = allPhilosophies
    .filter((d) => d.locale === params.locale && d.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // 按 category 分组
  const grouped = docs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof docs>);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: params.locale === 'zh' ? '首页' : 'Home', url: `/${params.locale}` },
          { label: params.locale === 'zh' ? '时间哲学' : 'Philosophy', url: `/${params.locale}/philosophy` },
        ]}
      />
      
      <h1 className="text-4xl font-bold mb-8">
        {params.locale === 'zh' ? '时间哲学' : 'Philosophy'}
      </h1>
      
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            {getCategoryName(category, params.locale)}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((doc) => (
              <ContentCard key={doc.url} doc={doc} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

---

## 五、图片管理系统

### 5.1 Cloudflare R2 配置

**环境变量** (`.env.local`):

```bash
# R2 配置
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=[R2_ACCESS_KEY]
R2_SECRET_ACCESS_KEY=[R2_SECRET]
R2_BUCKET_NAME=daysfromtoday-content
R2_PUBLIC_URL=https://cdn.daysfromtoday.ai

# CDN 域名（可选，绑定自定义域名）
CDN_DOMAIN=cdn.daysfromtoday.ai
```

### 5.2 R2 客户端封装

**文件**: `lib/r2-client.ts`

```typescript
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const CDN_URL = process.env.R2_PUBLIC_URL!;

/**
 * 上传图片到 R2（自动优化）
 */
export async function uploadImage(
  buffer: Buffer,
  path: string,
  options: {
    maxWidth?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): Promise<string> {
  const { maxWidth = 1200, quality = 85, format = 'webp' } = options;
  
  // 1. 优化图片
  const optimized = await sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .toFormat(format, { quality })
    .toBuffer();
  
  // 2. 上传到 R2
  const key = `${path}.${format}`;
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: optimized,
      ContentType: `image/${format}`,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  
  // 3. 返回 CDN URL
  return `${CDN_URL}/${key}`;
}

/**
 * 上传多格式图片（WebP + JPEG）
 */
export async function uploadMultiFormatImage(
  buffer: Buffer,
  path: string
): Promise<{ webp: string; jpeg: string }> {
  const [webp, jpeg] = await Promise.all([
    uploadImage(buffer, path, { format: 'webp' }),
    uploadImage(buffer, path, { format: 'jpeg' }),
  ]);
  
  return { webp, jpeg };
}

/**
 * 删除图片
 */
export async function deleteImage(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}

/**
 * 获取公开 URL
 */
export function getPublicUrl(key: string): string {
  return `${CDN_URL}/${key}`;
}
```

### 5.3 Obsidian 图片上传脚本

**文件**: `scripts/obsidian-upload-image.ts`

```typescript
#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { uploadMultiFormatImage } from '../lib/r2-client';

/**
 * Obsidian 拖拽图片时自动调用此脚本
 * 
 * 用法:
 * node scripts/obsidian-upload-image.ts --path=/path/to/image.jpg --vault=/path/to/vault
 */
async function main() {
  const args = process.argv.slice(2);
  const pathArg = args.find((arg) => arg.startsWith('--path='));
  const vaultArg = args.find((arg) => arg.startsWith('--vault='));
  
  if (!pathArg) {
    console.error('❌ Missing --path argument');
    process.exit(1);
  }
  
  const filepath = pathArg.split('=')[1];
  const vaultPath = vaultArg?.split('=')[1] || process.cwd();
  
  // 1. 读取图片
  const buffer = await fs.readFile(filepath);
  
  // 2. 确定上传路径（基于 Vault 内的相对路径）
  const relativePath = path.relative(vaultPath, filepath);
  const parts = relativePath.split(path.sep);
  
  // 假设目录结构: content/philosophy/zh/time-value/image.jpg
  const lang = parts[1]; // zh or en
  const category = parts[2]; // philosophy, tools, etc.
  const filename = path.basename(filepath, path.extname(filepath));
  
  const uploadPath = `content/${lang}/${category}/${filename}`;
  
  // 3. 上传到 R2（生成 WebP + JPEG）
  console.log(`📤 Uploading ${filepath}...`);
  const { webp, jpeg } = await uploadMultiFormatImage(buffer, uploadPath);
  
  // 4. 输出 Markdown 引用代码（Obsidian 会自动插入）
  console.log(`\n✅ Upload successful!`);
  console.log(`\nWebP: ${webp}`);
  console.log(`JPEG: ${jpeg}`);
  console.log(`\n📝 Markdown:`);
  console.log(`<BlogImage src="${webp}" alt="${filename}" />`);
  
  // 5. 返回 WebP URL 给 Obsidian
  process.stdout.write(webp);
}

main().catch((error) => {
  console.error('❌ Upload failed:', error);
  process.exit(1);
});
```

---

## 六、SEO 自动化方案

### 6.1 Sitemap 生成

**文件**: `app/sitemap.ts`

```typescript
import { allPhilosophies, allTools, allStories, allGuides, allUpdates } from 'contentlayer/generated';

export default function sitemap() {
  const baseUrl = 'https://www.daysfromtoday.ai';
  
  const philosophies = allPhilosophies
    .filter((d) => d.published)
    .map((d) => ({
      url: `${baseUrl}${d.url}`,
      lastModified: d.lastModified || d.date,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  
  const tools = allTools
    .filter((d) => d.published)
    .map((d) => ({
      url: `${baseUrl}${d.url}`,
      lastModified: d.lastModified || d.date,
      changeFrequency: 'weekly' as const,
      priority: 0.9, // Tools 优先级更高（SEO 流量主要来源）
    }));
  
  const stories = allStories
    .filter((d) => d.published)
    .map((d) => ({
      url: `${baseUrl}${d.url}`,
      lastModified: d.lastModified || d.date,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  
  const guides = allGuides
    .filter((d) => d.published)
    .map((d) => ({
      url: `${baseUrl}${d.url}`,
      lastModified: d.lastModified || d.date,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }));
  
  const updates = allUpdates
    .filter((d) => d.published)
    .map((d) => ({
      url: `${baseUrl}${d.url}`,
      lastModified: d.lastModified || d.date,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  
  return [
    ...philosophies,
    ...tools,
    ...stories,
    ...guides,
    ...updates,
  ];
}
```

### 6.2 Image Sitemap

**文件**: `app/image-sitemap.xml/route.ts`

```typescript
import { allPhilosophies, allTools, allStories, allGuides, allUpdates } from 'contentlayer/generated';

export async function GET() {
  const baseUrl = 'https://www.daysfromtoday.ai';
  
  // 从所有 MDX 内容中提取图片 URL
  const allDocs = [
    ...allPhilosophies,
    ...allTools,
    ...allStories,
    ...allGuides,
    ...allUpdates,
  ].filter((d) => d.published);
  
  const images = allDocs.flatMap((doc) => {
    const imageUrls: string[] = [];
    
    // 提取 ogImage
    if (doc.ogImage) {
      imageUrls.push(doc.ogImage);
    }
    
    // 提取正文中的图片（从 MDX body 中解析）
    const imageRegex = /src=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/gi;
    let match;
    while ((match = imageRegex.exec(doc.body.raw)) !== null) {
      imageUrls.push(match[1]);
    }
    
    return imageUrls.map((url) => ({
      loc: `${baseUrl}${doc.url}`,
      image: url,
      title: doc.title,
      caption: doc.description,
    }));
  });
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images
  .map(
    ({ loc, image, title, caption }) => `  <url>
    <loc>${loc}</loc>
    <image:image>
      <image:loc>${image}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
    </image:image>
  </url>`
  )
  .join('\n')}
</urlset>`;
  
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
```

### 6.3 Robots.txt

**文件**: `app/robots.ts`

```typescript
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: [
      'https://www.daysfromtoday.ai/sitemap.xml',
      'https://www.daysfromtoday.ai/image-sitemap.xml',
    ],
  };
}
```

---

## 七、部署流程

### 7.1 Vercel 配置

**文件**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://www.daysfromtoday.ai",
    "NEXT_PUBLIC_GA_ID": "@ga_id",
    "R2_ACCOUNT_ID": "@r2_account_id",
    "R2_ACCESS_KEY_ID": "@r2_access_key",
    "R2_SECRET_ACCESS_KEY": "@r2_secret_key",
    "R2_BUCKET_NAME": "daysfromtoday-content",
    "R2_PUBLIC_URL": "https://cdn.daysfromtoday.ai"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/image-sitemap.xml",
      "destination": "/image-sitemap.xml"
    }
  ]
}
```

### 7.2 CI/CD 流程

```
1. Git Push
   ↓
2. Vercel 检测到新提交
   ↓
3. 安装依赖（npm install）
   ↓
4. Contentlayer 处理 MDX → 生成 JSON + 类型
   ↓
5. Next.js 构建（SSG）
   ↓
6. 部署到 Edge Network
   ↓
7. 完成（自动清除旧缓存）
```

---

## 八、性能优化

### 8.1 构建优化

- **增量静态生成 (ISR)**: 
  - 所有内容页使用 ISR，`revalidate: 3600`（1小时）
  - 首次访问时生成，后续从缓存读取
  
- **图片优化**:
  - 使用 Next.js Image 组件
  - 自动 WebP/AVIF 格式
  - 响应式尺寸
  
- **代码分割**:
  - MDX 组件按需加载
  - 使用 `dynamic` 动态导入

### 8.2 CDN 优化

- **Cloudflare R2 + CDN**:
  - 全球边缘节点
  - 永久缓存（immutable）
  - 零流量费用
  
- **Vercel Edge Network**:
  - 静态资源自动 CDN
  - Edge Functions（如需）

---

## 九、开发流程

### 9.1 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 R2 凭证

# 3. 启动开发服务器
npm run dev

# 4. Contentlayer 自动监听 content/ 目录变化
# 修改 MDX 文件时，自动重新生成
```

### 9.2 内容创作流程

```
1. 使用 Obsidian 打开 Vault（content/ 目录）
   ↓
2. 新建笔记，选择模板
   ↓
3. 编辑内容，拖拽插入图片（自动上传到 R2）
   ↓
4. 保存，Obsidian Git 自动同步
   ↓
5. Vercel 自动部署
   ↓
6. 访问网站查看效果
```

---

## 十、验收标准

### ✅ 技术实施完整性
- [ ] Contentlayer 配置完成，5种内容类型可用
- [ ] MDX 组件库集成完成，17+组件可用
- [ ] 动态路由创建完成，所有分类可访问
- [ ] 图片管理系统可用，自动上传和优化
- [ ] SEO 自动化完成，Sitemap 和结构化数据正确

### ✅ 功能验证
- [ ] 可创建和访问 Philosophy 内容
- [ ] 可创建和访问 Tools 内容
- [ ] 可创建和访问 Stories 内容
- [ ] 可创建和访问 Guides 内容
- [ ] 可创建和访问 Updates 内容
- [ ] 面包屑导航正确显示
- [ ] 相关内容推荐正常工作
- [ ] 多语言切换正常
- [ ] 图片上传和显示正常

### ✅ SEO 验证
- [ ] Metadata 正确生成
- [ ] 结构化数据正确注入
- [ ] Sitemap 包含所有内容
- [ ] Image Sitemap 包含所有图片
- [ ] Robots.txt 配置正确
- [ ] hreflang 标签正确

### ✅ 性能验证
- [ ] Core Web Vitals 达标（LCP≤2.5s, INP≤200ms, CLS≤0.1）
- [ ] 图片自动 WebP 格式
- [ ] 页面完全静态生成（SSG）
- [ ] CDN 缓存正常

---

**版本历史**:
- v2.0 (2025-10-10): 初始版本，详细技术实施方案

