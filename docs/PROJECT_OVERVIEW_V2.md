### 项目总览（v2）

- 名称: DaysFromToday（多语言日期计算 + 内容博客）
- 技术栈: Next.js 14.2.15（App Router, TypeScript）, Contentlayer 0.3.4, next-intl, Tailwind CSS v4, date-fns/date-fns-tz, Cloudflare R2（CDN存储）, GA4, Vercel
- 运行模式: 以 SSG/ISR 为主的预渲染 + 少量客户端交互
- 目标体验: 打开即得答案（日期结果），多语言自动适配，内容发布稳定、SEO 友好、可扩展

---

### 功能—技术模块映射

| 功能 | 技术模块 | 关键文件/点 | 原理（一句话） |
|---|---|---|---|
| 多语言（i18n） | next-intl | `app/[locale]/...` 路由 | 按 URL 前缀 `en/zh` 区分语言，组件读取对应语言包渲染 |
| 日期计算（自然日/工作日） | date-fns + date-fns-tz | 各页面计算逻辑 | 按用户时区和 IANA TZ 做加减天数，工作日排除周末/节假日 |
| 节假日页面 | Nager.Date（后续） | 暂用占位，支持升级 | API 缓存 24h；与工作日结合形成“排除”日 |
| 博客系统（内容源） | Contentlayer 0.3.4 | `contentlayer.config.ts`；内容在 `obsidian/content` | 读取 `.md`（或 `.mdx`）生成 `allBlogs` 数据供页面列表/详情使用 |
| MDX 组件（表格卡片等） | MDX + 自定义组件 | `components/blog-cards/*` | 在文章中导入 React 组件，替代复杂 Markdown 表格 |
| 图片与媒体 | Cloudflare R2（S3 兼容）+ CDN | 图片上传脚本（已存在），CDN 域 `cdn.daysfromtoday.ai` | 将本地相对路径替换为 CDN 绝对地址，保证线上可访问 |
| 博客列表自动聚合 | Contentlayer allBlogs | `app/[locale]/blog/page.tsx` | 读取 `allBlogs`，按 `locale` 过滤、按 `date` 排序 |
| 动态文章页面 | Contentlayer + 动态路由 | `app/[locale]/blog/[slug]/page.tsx` | 用 URL `slug` 匹配 `allBlogs`，渲染 MDX 内容 |
| Sitemap 自动生成 | Next Metadata API + Contentlayer | `app/sitemap.ts` | 遍历语言、日期页、博客 `allBlogs` 动态输出 sitemap.xml |
| SEO 元数据 | Metadata API + JSON-LD | 各页面 `generateMetadata` | 设置 title/description/canonical/hreflang/OG/Twitter/Article Schema |
| GA4 数据采集 | `@next/third-parties/google` + 轻量路由跟踪 | 布局注入；`ga-tracker.tsx` | 以 GA ID 注入 gtag.js 并跟踪路由变化 |
| 状态管理（预留） | Zustand | 未来多国家/多时区 | 在客户端保存国家/时区选择，影响计算显示 |
| 样式系统 | Tailwind CSS v4 | 全站 UI | 原子化样式 + 设计 token，快速一致化风格 |
| 部署 | Vercel | Preview/Prod | Git 推送触发构建，产出静态/边缘可执行资源 |

---

### 核心技术原理（通俗解释）

- 多语言（next-intl）
  - 原理: URL 前缀决定语言包，组件读取对应文案渲染。例如 `/zh/blog` 显示中文。
  - 价值: 清晰、SEO 友好（hreflang 指向两种语言版本）。

- 日期计算（date-fns + date-fns-tz）
  - 原理: 先获取用户时区（`Intl.DateTimeFormat().resolvedOptions().timeZone`），再做加/减天数；工作日排除周六周日；未来会结合节假日排除。
  - 价值: 本地时区准确、DST（夏令时）安全。

- 内容系统（Contentlayer + MDX）
  - 原理: 读取 `obsidian/content/blog/**.md`，解析 frontmatter（title/date/tags/locale…）和正文，产出 `allBlogs`。每篇 MDX 编译为可在 React 中直接渲染的函数。
  - 价值: 类型安全、构建期生成、热更新；适合协作与自动化。

- 表格/复杂内容（MDX 自定义组件）
  - 原理: 复杂 Markdown 表格容易出错，使用 `<DataCard>`、`<TimelineCard>`、`<StatCard>`、`<ComparisonCard>` 组件表达结构化内容，更稳定美观。
  - 用法: 在 MDX 顶部 `import { DataCard } from '@/components/blog-cards'`，正文 `<DataCard .../>`。

- 图片与媒体（R2 + CDN）
  - 原理: 文章内 `images/xxx.jpg` 由脚本上传到 Cloudflare R2，并替换为 `https://cdn.daysfromtoday.ai/images/...`。
  - 价值: 加载快、成本低、与内容解耦。

- 博客列表自动化（Contentlayer allBlogs）
  - 原理: 列表页读取 `allBlogs`，按 `locale` 过滤、按 `date` 排序，自动展示最新内容。
  - 价值: 无需手动维护列表与 sitemap。

- Sitemap 与 SEO 元数据
  - 原理: `app/sitemap.ts` 用 `locales + allBlogs` 生成所有 URL；页面用 `generateMetadata` 输出标题、描述、canonical、hreflang、OG/Twitter；文章输出 `Article` JSON-LD。
  - 价值: 让搜索引擎“更懂我们”，提升抓取与索引质量。

- GA4 集成
  - 原理: 布局层注入 GA 脚本（`@next/third-parties/google`），在路由变化时发送 `page_view`。
  - 价值: 保证页面访问数据完整，便于持续优化。

---

### 当前 SEO 实施清单

- 路由与 hreflang: `en`/`zh` 双语言路径清晰，互相声明 `alternate`。
- Canonical: 每页设置 canonical，避免重复收录。
- Metadata: 每页 title/description/keywords（必要页面）齐全。
- Open Graph / Twitter: 文章/列表页提供 OG 信息，利于社交分享卡片。
- JSON-LD:
  - `Organization` / `WebApplication`（站点级）
  - `Article`（文章页，含发布时间/作者/关键词）
- Sitemap: 动态包含首页、博客列表、每篇文章、常用日期计算页（自然日/工作日/过去/未来）。
- Robots: 允许收录（可按需要收紧）。

一句话：搜索引擎能“看懂”网站是谁、在哪、讲什么，而不是盲猜。

---

### GA4（Google Analytics）实现要点

- 注入: 通过 `@next/third-parties/google` 在 App Router 布局注入脚本，ID 使用环境变量。
- 路由跟踪: 监听路由变化，发送 `page_view`。
- 数据一致性: 建议本地使用 DebugView 或单独测 ID，避免污染正式数据。

---

### 构建与部署（本地 → Preview → Prod）

- 本地开发: `npm run dev`；Contentlayer 监听 `obsidian/content` 变化自动生成；Next.js 热重载。
- 本地构建: `npm run build`（先 `contentlayer build` 再 `next build`）。
- 部署: Git 推送 → Vercel 自动构建（Preview）；确认无误 → Promote 到 Production 或 `vercel --prod`。
- 环境变量: GA ID、R2 凭据、SITE_URL 等在 Vercel 环境配置（不进 Git）。

---

### 目录结构（核心）

- `app/[locale]/blog/page.tsx`：博客列表（按 `allBlogs` 动态生成）
- `app/[locale]/blog/[slug]/page.tsx`：文章详情（按 `slug` 渲染 MDX）
- `app/sitemap.ts`：全站 sitemap 动态生成
- `obsidian/content/blog/{en,zh}/*.md`：内容源（Obsidian 主目录）
- `components/blog-cards/*`：文章内可用 UI 组件（卡片、时间线、对比表等）
- `contentlayer.config.ts`：内容类型定义、插件链（remark-gfm、rehype-*）

---

### 性能策略（易懂版）

- 预渲染（SSG）: 大部分页面构建期生成，打开快。
- 按需加载: 只加载当前页所需 JS/CSS。
- CDN: 静态资源 + 图片走 CDN，更接近用户。
- Tailwind 原子样式: 减少 CSS 冗余。
- 组件卡片: 替代表格，降低 DOM 复杂度与解析负担。

---

### 安全与合规（关键点）

- 环境变量: R2 凭据、GA ID、SITE_URL 等放 Vercel 环境，不进 Git。
- 隐私: 不收集个人信息，只做页面级统计（GA）。
- CSP: 后续收紧前先用 Report-Only 收集报告，再逐步锁定。
- 广告: 仅 AdSense；EU/UK/CH 需 CMP + Consent Mode v2（上线时配置）。

---

### 已知限制与可扩展点

- Markdown 复杂表格: 建议用 MDX 组件（`ComparisonCard` 等）替代。
- 媒体格式（HEIC/PDF/MP4/M4A）: 已支持上传；转码与预览可按需增强（如 `sharp`/FFmpeg）。
- 多国家/多时区: Zustand 状态与页面计算已准备；后续完善切换 UI 与节假日缓存。
- 节假日数据: Nager.Date 接入可做 24h 缓存与本地 fallback（Markdown 配置）。

---

### 当前版本整体总结（对外可用）

- 产品定位: 面向想“快速知道某天是哪天”的用户，一键得到结果；博客承载方法论与故事。
- 技术稳定性: Next.js + Contentlayer + R2 CDN 架构清晰，构建与部署流程标准化。
- 内容能力: Obsidian 写作 → Contentlayer 自动读取 → 列表自动聚合 → sitemap 自动更新。
- SEO 友好: 多语言、hreflang、canonical、JSON-LD、sitemap 全覆盖。
- 数据采集: GA4 正常记录页面访问，便于持续优化。
- 可扩展: MDX 组件化可持续沉淀；节假日、多国家/时区、广告/合规等均已布局。

---

### 自检清单（日常巡检/上线前）

- 页面可用：首页、日期页、博客列表与文章均 200。
- `sitemap.xml` 200，包含最新文章链接。
- 文章页元数据：title/description/canonical/hreflang/Article JSON-LD 完整。
- GA 实时可见访问；本地调试用 DebugView。
- 图片均来自 CDN，加载正常。
- Contentlayer 本地 `build` 正常；Vercel 构建日志无错误。
- Vercel 环境变量已配置齐全（GA、R2、SITE_URL）。


