<!-- 0caa6b2f-5ae4-4aa1-8954-dd2f11bba637 43e91419-115f-4117-b71b-63c51f13ea36 -->
# DaysFromToday 精品内容管理系统 - 最终执行方案

> 基于融合方案：Contentlayer + Obsidian + Cloudflare R2 + 5大内容分类体系

## 一、方案总览

### 1.1 核心架构

```
Obsidian 编辑器（本地，所见即所得）
  ↓
MDX 文件（content/ 目录，5大分类）
  ↓
Contentlayer（内容索引 + 类型安全 + 自动生成）
  ↓
Next.js 15 App Router（SSG/ISR，完美 SEO）
  ↓
富媒体组件库（17+ 组件）+ 功能植入（计算器等）
  ↓
Cloudflare R2（媒体存储，零流量费用）
```

### 1.2 技术栈（最终确定）

| 模块 | 技术选型 | 核心优势 |

|-----|---------|---------|

| **编辑器** | Obsidian + 自动上传插件 | 本地编辑，拖拽上传，所见即所得 |

| **内容层** | Contentlayer | 类型安全，自动索引，性能优秀 |

| **前端** | Next.js 15 + TypeScript | SSG/ISR，SEO 完美，已在使用 |

| **富文本** | MDX（Markdown + React） | 支持组件嵌入，灵活性极高 |

| **媒体** | Cloudflare R2 | 零流量费用，年成本 <$1 |

| **国际化** | next-intl | 已集成，完美支持中英双语 |

| **SEO** | Metadata API + JSON-LD | 自动生成 meta、面包屑、结构化数据 |

### 1.3 核心价值

- ✅ **编辑体验极佳**: Obsidian 本地编辑，拖拽上传图片自动优化
- ✅ **内容结构清晰**: 5大分类体系，多级目录，自动面包屑
- ✅ **功能深度植入**: MDX 支持内嵌 React 组件（计算器、纪念日等）
- ✅ **SEO 完美友好**: 完全静态生成，结构化数据，Google 最爱
- ✅ **双语无缝支持**: 中英文独立管理，自动路由和 hreflang
- ✅ **成本极低**: R2 年成本 <$1，无 CMS 订阅费，完全掌控
- ✅ **富媒体支持**: 图片、视频、图表、交互组件，一应俱全

---

## 二、内容架构设计

### 2.1 目录结构（多级分类）

```
content/
├── guides/                    # 类型1：教程指南
│   ├── en/
│   │   ├── time-management/   # 主题：时间管理
│   │   │   ├── basics/        # 子分类：基础
│   │   │   │   ├── getting-started.mdx
│   │   │   │   └── core-concepts.mdx
│   │   │   └── advanced/      # 子分类：进阶
│   │   │       └── productivity-hacks.mdx
│   │   ├── date-calculation/  # 主题：日期计算
│   │   │   ├── business-days.mdx
│   │   │   └── timezone-conversion.mdx
│   │   └── tools/             # 主题：工具使用
│   │       └── anniversary-setup.mdx
│   └── zh/
│       ├── time-management/
│       │   ├── basics/
│       │   │   ├── getting-started.mdx
│       │   │   └── core-concepts.mdx
│       │   └── advanced/
│       │       └── productivity-hacks.mdx
│       ├── date-calculation/
│       │   ├── business-days.mdx
│       │   └── timezone-conversion.mdx
│       └── tools/
│           └── anniversary-setup.mdx
│
├── cases/                     # 类型2：实战案例
│   ├── en/
│   │   ├── success-stories/
│   │   │   └── 100-day-challenge.mdx
│   │   └── tips/
│   │       └── deadline-management.mdx
│   └── zh/
│       ├── success-stories/
│       │   └── 100-day-challenge.mdx
│       └── tips/
│           └── deadline-management.mdx
│
├── features/                  # 类型3：功能展示
│   ├── en/
│   │   ├── countdown/
│   │   │   └── how-it-works.mdx
│   │   └── anniversary/
│   │       └── complete-guide.mdx
│   └── zh/
│       ├── countdown/
│       │   └── how-it-works.mdx
│       └── anniversary/
│           └── complete-guide.mdx
│
└── blog/                      # 类型4：博客文章
    ├── en/
    │   └── why-i-built.mdx
    └── zh/
        └── why-i-built.mdx
```

### 2.2 URL 结构（清晰的路径）

```
中文内容：
/zh/guides/time-management/basics/getting-started
/zh/cases/success-stories/100-day-challenge
/zh/features/countdown/how-it-works
/zh/blog/why-i-built

英文内容：
/en/guides/time-management/basics/getting-started
/en/cases/success-stories/100-day-challenge
/en/features/countdown/how-it-works
/en/blog/why-i-built

分类页面：
/zh/guides                           # 所有教程指南
/zh/guides/time-management           # 时间管理主题
/zh/guides/time-management/basics    # 基础子分类
```

### 2.3 Frontmatter 元数据（完整）

```yaml
---
# 基础信息
title: "如何计算工作日：完整指南"
description: "学习如何准确计算工作日，排除周末和节假日，掌握实用的时间管理技巧"
date: "2025-10-10"
lastModified: "2025-10-10"
author: "Leon"

# 分类（多维度）
type: "guide"                    # guide | case | feature | blog
category: "time-management"      # 主题分类
subcategory: "basics"            # 子分类（可选）
topics: ["工作日计算", "时间管理", "节假日"]  # 标签

# 难度和时长
level: "beginner"                # beginner | intermediate | advanced
readingTime: 8                   # 阅读时长（分钟）

# 功能植入
embeds:
  - type: "calculator"           # 内嵌组件
    id: "business-days-calc"
  - type: "link"                 # 跳转链接
    url: "/business-days"
    label: "试用工作日计算器"

# SEO
slug: "how-to-calculate-business-days"
ogImage: "https://cdn.daysfromtoday.ai/content/zh/guides/business-days-og.jpg"
keywords: ["工作日计算", "business days", "节假日", "时间管理"]

# 内容结构（自动生成面包屑）
breadcrumbs:
  - { label: "首页", url: "/" }
  - { label: "教程指南", url: "/guides" }
  - { label: "时间管理", url: "/guides/time-management" }
  - { label: "基础入门", url: "/guides/time-management/basics" }
  - { label: "如何计算工作日", url: "/guides/time-management/basics/how-to-calculate-business-days" }

# 相关内容推荐
related:
  - "/guides/time-management/basics/getting-started"
  - "/cases/tips/deadline-management"

# 状态
published: true
featured: false                  # 是否精选
---
```

---

## 三、Obsidian 工作流配置

### 3.1 Obsidian Vault 设置

**Vault 路径**: `/Users/leonmini/quantum-era/daysfromtoday/content`

**推荐插件**:

1. **Templater** - 自动生成 Frontmatter 模板
2. **Local Images Plus** - 图片自动上传到 R2
3. **Linter** - 自动格式化 Markdown
4. **Dataview** - 内容关联和查询
5. **Obsidian Git** - 自动 Git 同步

### 3.2 图片上传配置（Local Images Plus）

**配置文件**: `.obsidian/plugins/obsidian-local-images-plus/data.json`

```json
{
  "uploadScript": "scripts/obsidian-upload-image.ts",
  "uploadScriptArgs": "--path={filepath} --vault={vaultpath}",
  "urlPattern": "https://cdn.daysfromtoday.ai/content/{path}"
}
```

**上传脚本**: `scripts/obsidian-upload-image.ts`

```typescript
// 当在 Obsidian 中拖拽图片时自动触发
// 1. 压缩优化图片（WebP + JPEG）
// 2. 上传到 R2
// 3. 返回 CDN URL
// 4. 自动插入到 MDX
```

### 3.3 内容模板（Templater）

**模板文件**: `.obsidian/templates/guide-template.md`

```mdx
---
title: "{{title}}"
description: ""
date: "{{date:YYYY-MM-DD}}"
author: "Leon"
type: "guide"
category: "{{category}}"
level: "beginner"
published: false
---

# {{title}}

## 目录

<TableOfContents />

## 引言

<!-- 写引言 -->

## 主要内容

<!-- 写主要内容 -->

## 实践示例

<!-- 嵌入功能组件 -->
<EmbedCalculator type="business-days" />

## 相关资源

<RelatedContent topics={["{{category}}"]} limit={3} />
```

### 3.4 Obsidian 工作流

```
1. 新建笔记
   - 选择模板（guide/case/feature/blog）
   - 自动填充 Frontmatter

2. 编辑内容
   - Markdown + MDX 语法
   - 拖拽插入图片 → 自动上传到 R2
   - 使用 MDX 组件（如 <EmbedCalculator />）

3. 预览
   - Obsidian 实时预览
   - 或 npm run dev 查看实际效果

4. 翻译（如需双语）
   - 复制到对应语言目录
   - 翻译内容
   - 保持 slug 和结构一致

5. 发布
   - Obsidian Git 自动同步
   - 或手动 git push
   - Vercel 自动部署
```

---

## 四、技术实现方案

### 4.1 Contentlayer 配置

**安装依赖**:

```bash
npm install contentlayer next-contentlayer
```

**配置文件**: `contentlayer.config.ts`

```typescript
import { defineDocumentType, makeSource } from 'contentlayer/source-files';

// 定义内容类型
const Guide = defineDocumentType(() => ({
  name: 'Guide',
  filePathPattern: `guides/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    type: { type: 'string', required: true },
    category: { type: 'string', required: true },
    subcategory: { type: 'string' },
    topics: { type: 'list', of: { type: 'string' } },
    level: { type: 'enum', options: ['beginner', 'intermediate', 'advanced'] },
    embeds: { type: 'json' },
    breadcrumbs: { type: 'json' },
    related: { type: 'list', of: { type: 'string' } },
    published: { type: 'boolean', default: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split('/');
        const lang = parts[1]; // en or zh
        const path = parts.slice(2).join('/');
        return `/${lang}/guides/${path}`;
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop(),
    },
  },
}));

// 类似定义 Case, Feature, Blog

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Guide, Case, Feature, Blog],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
```

### 4.2 Next.js 动态路由

**文件**: `app/[locale]/guides/[...slug]/page.tsx`

```typescript
import { allGuides } from 'contentlayer/generated';
import { MDXContent } from '@/components/mdx-content';
import { Breadcrumb } from '@/components/breadcrumb';

export async function generateStaticParams() {
  return allGuides.map((guide) => ({
    locale: guide.url.split('/')[1],
    slug: guide.url.split('/').slice(3),
  }));
}

export default async function GuidePage({ params }) {
  const guide = allGuides.find((g) => 
    g.url === `/${params.locale}/guides/${params.slug.join('/')}`
  );

  if (!guide || !guide.published) {
    notFound();
  }

  return (
    <article>
      <Breadcrumb items={guide.breadcrumbs} />
      
      <header>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
        <div className="meta">
          <span>{guide.date}</span>
          <span>{guide.readingTime} min read</span>
          <span>{guide.level}</span>
        </div>
      </header>

      <MDXContent code={guide.body.code} />

      {/* 相关内容推荐 */}
      <RelatedContent items={guide.related} />
    </article>
  );
}
```

### 4.3 分类页面（自动聚合）

**文件**: `app/[locale]/guides/[category]/page.tsx`

```typescript
export default async function CategoryPage({ params }) {
  const guides = allGuides.filter((g) => 
    g.category === params.category &&
    g.url.startsWith(`/${params.locale}`)
  );

  // 按子分类分组
  const grouped = guides.reduce((acc, guide) => {
    const sub = guide.subcategory || 'general';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(guide);
    return acc;
  }, {});

  return (
    <div>
      <h1>{getCategoryName(params.category)}</h1>
      <Breadcrumb items={[
        { label: '首页', url: '/' },
        { label: '教程指南', url: '/guides' },
        { label: getCategoryName(params.category), url: `/guides/${params.category}` }
      ]} />

      {Object.entries(grouped).map(([subcategory, items]) => (
        <section key={subcategory}>
          <h2>{getSubcategoryName(subcategory)}</h2>
          <div className="grid">
            {items.map((guide) => (
              <GuideCard key={guide.url} guide={guide} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

---

## 五、富媒体组件库

### 5.1 基础展示组件

```mdx
<!-- 1. Hero Banner -->
<HeroBanner 
  image="https://cdn.daysfromtoday.ai/content/hero.jpg"
  title="如何计算工作日"
  subtitle="完整指南，从基础到进阶"
/>

<!-- 2. 目录导航（自动生成） -->
<TableOfContents />

<!-- 3. 图片（支持灯箱） -->
<BlogImage 
  src="https://cdn.daysfromtoday.ai/content/example.jpg"
  alt="示例图"
  caption="这是图片说明"
  lightbox={true}
/>

<!-- 4. 图文混排 -->
<ImageWithText 
  image="https://cdn.daysfromtoday.ai/content/feature.jpg"
  alt="功能展示"
  position="left"
>
  这里是文字内容，图片在左侧显示
</ImageWithText>

<!-- 5. 视频播放器 -->
<VideoPlayer 
  src="https://cdn.daysfromtoday.ai/content/demo.mp4"
  poster="https://cdn.daysfromtoday.ai/content/poster.jpg"
  caption="演示视频"
/>

<!-- 6. 图片画廊 -->
<ImageGallery images={[
  { src: '...', alt: '...', caption: '...' },
  { src: '...', alt: '...', caption: '...' }
]} />

<!-- 7. 图表容器 -->
<ChartContainer 
  src="https://cdn.daysfromtoday.ai/content/chart.png"
  alt="流量趋势"
  caption="流量增长趋势（2025 Q1-Q4）"
  source="Google Analytics"
/>
```

### 5.2 功能植入组件

```mdx
<!-- 8. 内嵌计算器 -->
<EmbedCalculator 
  type="business-days"
  defaultDays={30}
  title="试试计算工作日"
  description="输入天数，自动排除周末和节假日"
/>

<!-- 9. 内嵌纪念日添加 -->
<EmbedAnniversary 
  presetDate="2025-12-25"
  presetName="圣诞节"
  title="添加纪念日"
/>

<!-- 10. 功能跳转卡片 -->
<FeatureCard 
  icon="calendar"
  title="添加纪念日"
  description="永远不会忘记重要的日子"
  link="/anniversaries"
  cta="立即使用"
/>

<!-- 11. 倒计时展示 -->
<CountdownDisplay 
  targetDate="2025-12-31"
  title="距离 2026 年还有"
  showDays={true}
  showBusinessDays={true}
/>
```

### 5.3 交互增强组件

```mdx
<!-- 12. 可折叠区块 -->
<Accordion title="高级技巧">
  这里是可折叠的内容，点击展开查看详情
</Accordion>

<!-- 13. 标签页 -->
<Tabs>
  <Tab label="方法一">
    使用自然日计算...
  </Tab>
  <Tab label="方法二">
    使用工作日计算...
  </Tab>
</Tabs>

<!-- 14. 提示框 -->
<Callout type="info">
  💡 小提示：工作日计算会自动排除周末和节假日
</Callout>

<Callout type="warning">
  ⚠️ 注意：不同国家的节假日不同
</Callout>

<!-- 15. 代码块（如需要） -->
<CodeBlock language="javascript">
  const result = calculateBusinessDays(30);
  console.log(result);
</CodeBlock>

<!-- 16. 步骤指引 -->
<StepGuide>
  <Step number={1} title="选择开始日期">
    在日历中选择你的开始日期
  </Step>
  <Step number={2} title="输入天数">
    输入需要计算的天数
  </Step>
  <Step number={3} title="查看结果">
    系统自动计算并显示结果
  </Step>
</StepGuide>

<!-- 17. 相关内容推荐 -->
<RelatedContent 
  type="guide"
  topics={["time-management", "date-calculation"]}
  limit={3}
/>
```

---

## 六、SEO 优化方案

### 6.1 自动面包屑导航

**组件**: `components/breadcrumb.tsx`

```tsx
export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => (
          <li 
            key={index}
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <Link href={item.url} itemProp="item">
              <span itemProp="name">{item.label}</span>
            </Link>
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### 6.2 结构化数据（自动注入）

```typescript
// app/[locale]/guides/[...slug]/page.tsx
export async function generateMetadata({ params }) {
  const guide = await getGuide(params);
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    image: guide.ogImage,
    datePublished: guide.date,
    dateModified: guide.lastModified,
    author: {
      '@type': 'Person',
      name: guide.author,
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
      itemListElement: guide.breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': item.url,
          name: item.label,
        },
      })),
    },
  };

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: [guide.ogImage],
      type: 'article',
    },
    alternates: {
      canonical: guide.url,
      languages: {
        'en': guide.url.replace('/zh/', '/en/'),
        'zh': guide.url.replace('/en/', '/zh/'),
      },
    },
    other: {
      'structured-data': JSON.stringify(structuredData),
    },
  };
}
```

### 6.3 Sitemap 自动生成

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const guides = allGuides.map((guide) => ({
    url: `https://www.daysfromtoday.ai${guide.url}`,
    lastModified: guide.lastModified || guide.date,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const cases = allCases.map((c) => ({ ... }));
  const features = allFeatures.map((f) => ({ ... }));
  const blogs = allBlogs.map((b) => ({ ... }));

  return [...guides, ...cases, ...features, ...blogs];
}
```

---

## 七、图片管理方案

### 7.1 Obsidian 图片自动上传

**脚本**: `scripts/obsidian-upload-image.ts`

```typescript
import sharp from 'sharp';
import { uploadToR2 } from './r2-client';

export async function uploadObsidianImage(filepath: string) {
  // 1. 读取图片
  const buffer = await fs.readFile(filepath);
  
  // 2. 智能处理
  const { width, height } = await sharp(buffer).metadata();
  
  // 3. 优化压缩
  const optimized = await sharp(buffer)
    .resize({ width: Math.min(width, 1200), withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  
  // 4. 生成路径
  const filename = path.basename(filepath, path.extname(filepath));
  const key = `content/${detectLanguage()}/${detectCategory()}/${filename}.webp`;
  
  // 5. 上传到 R2
  const url = await uploadToR2(optimized, key);
  
  // 6. 返回 CDN URL（Obsidian 自动插入）
  return url;
}
```

### 7.2 图片自动优化规则

1. **过大图片**（>3MB）: 自动压缩到 85 质量
2. **尺寸不符**: 智能裁剪或填充到目标尺寸
3. **格式转换**: 自动生成 WebP + JPEG
4. **长图保留**: 高>宽×2 的图片保持完整

---

## 八、实施步骤

### Phase 1: 基础架构（第 1-2 周）

1. 安装 Contentlayer 和依赖
2. 配置 Contentlayer（定义内容类型）
3. 创建动态路由（guides/cases/features/blog）
4. 配置 Obsidian Vault 和插件
5. 开发图片自动上传脚本
6. 创建基础 MDX 组件库（10+ 组件）

### Phase 2: 内容迁移（第 2-3 周）

1. 迁移现有 4 篇博客到新结构
2. 创建第一篇 Guide 内容（测试完整流程）
3. 双语版本测试
4. SEO 验证（面包屑、结构化数据）

### Phase 3: 内容扩充（第 3-8 周）

1. 创建 10+ 篇 Guide（时间管理、日期计算、工具使用）
2. 创建 5+ 篇 Case（成功案例、实用技巧）
3. 创建 3+ 篇 Feature（功能展示）
4. 所有内容双语化

### Phase 4: 优化迭代（第 8+ 周）

1. 根据 GSC 数据优化关键词
2. 添加更多富媒体内容（视频、图表）
3. 优化功能植入（计算器、纪念日等）
4. 监控 SEO 效果，持续优化

### To-dos

- [ ] 安装并配置 Contentlayer（定义 Guide/Case/Feature/Blog 内容类型）
- [ ] 创建 Next.js 动态路由（[locale]/guides/[...slug]、cases、features、blog）
- [ ] 配置 Obsidian Vault（路径、插件：Templater、Local Images Plus、Linter、Git）
- [ ] 开发图片自动上传脚本（obsidian-upload-image.ts，支持智能压缩和 R2 上传）
- [ ] 创建基础 MDX 组件库（HeroBanner、BlogImage、VideoPlayer、EmbedCalculator 等 15+ 组件）
- [ ] 实现自动面包屑导航和结构化数据
- [ ] 迁移现有 4 篇博客到新目录结构（content/blog/en 和 content/blog/zh）
- [ ] 创建第一篇 Guide 内容（测试完整流程：Obsidian 编辑 → 图片上传 → MDX 组件 → 双语）
- [ ] 验证 SEO 优化（面包屑、结构化数据、OG 图片、Sitemap）
- [ ] 创建 10+ 篇 Guide 内容（时间管理、日期计算、工具使用，中英双语）
- [ ] 创建 5+ 篇 Case 内容（成功案例、实用技巧，中英双语）
- [ ] 创建 3+ 篇 Feature 内容（功能展示，中英双语）
- [ ] 根据 GSC 数据优化关键词和内容结构
- [ ] 添加更多富媒体内容（视频、图表、交互组件）