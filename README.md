# 🕰️ DaysFromToday

> 精确的日期计算工具 - 支持自然日、工作日、节假日和多语言

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**网站地址**: [https://www.daysfromtoday.ai](https://www.daysfromtoday.ai)

---

## 📖 项目简介

**DaysFromToday** 是一个专业的日期计算工具，帮助用户快速计算未来或过去的日期。

### 核心功能

- ✅ **自然日计算** - 包含所有日期
- ✅ **工作日计算** - 自动排除周末和节假日
- ✅ **多语言支持** - 中文/英文双语
- ✅ **纪念日管理** - 跟踪生日、纪念日等重要日期
- ✅ **日历集成** - 一键下载 ICS 文件
- ✅ **博客系统** - 分享时间管理的故事和技巧
- ✅ **SEO 优化** - 完整的 SEO 和社交分享支持

---

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/leeleon/daysfromtoday.git
cd daysfromtoday

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 环境变量

创建 `.env.local` 文件：

```bash
# 站点 URL
NEXT_PUBLIC_SITE_URL=https://www.daysfromtoday.ai

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 时区检测（Vercel 自动提供）
# x-vercel-ip-country
# x-vercel-ip-timezone
```

---

## 📚 博客系统

### 快速发布博客

```bash
# 1. 创建新文章
node scripts/create-blog-post.js my-story Story

# 2. 编辑内容
# 打开 app/[locale]/blog/my-story/page.tsx

# 3. 发布
git add . && \
git commit -m "feat: 发布博客 - 我的故事" && \
git push origin main && \
vercel --prod
```

### 置顶博客到首页

编辑 `app/[locale]/home-client.tsx`，更新博客文本和链接。

详细文档：
- 📘 [完整博客系统指南](docs/BLOG_SYSTEM.md)
- 📋 [快速参考卡](docs/BLOG_QUICK_REFERENCE.md)
- 📝 [博客模板规范](docs/templates/BLOG_TEMPLATE.md)

---

## 🛠️ 技术栈

### 核心框架
- **Next.js 15** - React 框架（App Router）
- **TypeScript** - 类型安全
- **Tailwind CSS v4** - 样式系统

### 功能库
- **date-fns / date-fns-tz** - 日期计算和时区处理
- **next-intl** - 国际化（i18n）
- **Radix UI** - 无障碍 UI 组件

### 部署与监控
- **Vercel** - 部署平台（Edge Runtime）
- **Google Analytics 4** - 数据分析
- **Google Search Console** - SEO 监控

---

## 📁 项目结构

```
daysfromtoday/
├── app/
│   ├── [locale]/              # 多语言路由
│   │   ├── page.tsx           # 首页（Server Component）
│   │   ├── home-client.tsx    # 首页（Client Component）
│   │   ├── days/[n]/          # 自然日计算
│   │   ├── business-days/[n]/ # 工作日计算
│   │   ├── anniversaries/     # 纪念日管理
│   │   └── blog/              # 博客系统
│   ├── api/
│   │   └── holidays/          # 节假日 API
│   └── layout.tsx             # Root Layout
├── components/
│   ├── TopNav.tsx             # 顶部导航
│   ├── BlogArticle.tsx        # 博客文章组件
│   ├── DateCalculator.tsx     # 日期计算器
│   └── ui/                    # UI 组件库
├── lib/
│   ├── date-utils.ts          # 日期工具函数
│   ├── bizdays.ts             # 工作日计算
│   ├── blog-utils.ts          # 博客工具函数
│   └── ics-generator.ts       # ICS 文件生成
├── types/
│   └── blog.ts                # 博客类型定义
├── docs/
│   ├── BLOG_SYSTEM.md         # 博客系统完整指南
│   ├── BLOG_QUICK_REFERENCE.md# 快速参考卡
│   └── templates/             # 模板文档
├── scripts/
│   └── create-blog-post.js    # 博客创建脚本
└── public/
    └── images/blog/           # 博客图片资源
```

---

## 🎨 设计系统

本项目采用 **Calendly 风格** 设计：

- 🎨 **色彩**: 蓝色主色调 + 紫粉渐变
- ✨ **效果**: 玻璃拟态（Glassmorphism）
- 🔘 **交互**: 流畅的过渡动画
- 📱 **响应式**: 完美支持移动端

详见：`app/globals.css`

---

## 📝 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npm run lint             # 代码检查

# 博客
node scripts/create-blog-post.js <slug> <category>  # 创建博客

# 部署
vercel --prod            # 部署到生产环境
vercel rollback          # 回滚部署
```

---

## 🔍 SEO 优化

### 已实现
- ✅ 动态 Sitemap（`/sitemap.xml`）
- ✅ Robots.txt（`/robots.txt`）
- ✅ Canonical URLs
- ✅ Hreflang 标签（中英文）
- ✅ Open Graph 标签
- ✅ Twitter Card
- ✅ JSON-LD 结构化数据
- ✅ 图片 Alt 文本
- ✅ 语义化 HTML

### Core Web Vitals
- LCP: ≤ 2.5s ✅
- INP: ≤ 200ms ✅
- CLS: ≤ 0.1 ✅

---

## 📊 功能特性

### 日期计算
- 未来/过去 N 天
- 自然日/工作日
- 节假日识别（Nager.Date API）
- 时区和 DST 支持

### 纪念日管理
- 添加/编辑/删除纪念日
- 自动倒计时计算
- 分类管理（生日、纪念日等）
- LocalStorage 数据持久化

### 博客系统
- 标准化模板
- SEO 优化
- 社交分享
- Markdown 支持
- 自动化创建脚本

---

## 🌍 多语言支持

- 🇺🇸 English
- 🇨🇳 简体中文

使用 `next-intl` 实现路由级别的国际化。

---

## 📖 文档

### 🚀 **快速开始**
- [Obsidian 博客创作工作流](docs/getting-started/OBSIDIAN_BLOG_WORKFLOW.md) - **新文档** ⭐
- [博客快速参考](docs/getting-started/BLOG_QUICK_REFERENCE.md)
- [技术栈快速参考](docs/getting-started/TECH_STACK_QUICK_REFERENCE.md)

### 📝 **内容创作**
- [Obsidian 完整工作流](docs/OBSIDIAN_COMPLETE_WORKFLOW.md) - **新文档** ⭐
- [博客系统完整指南](docs/content-creation/BLOG_SYSTEM.md)
- [博客内容指南](docs/content-creation/BLOG_CONTENT_GUIDELINES.md)
- [MDX 组件使用](docs/content-creation/MDX_COMPONENTS.md)
- [Obsidian 工作流](docs/content-creation/OBSIDIAN_WORKFLOW.md)

### 🔍 **SEO 与优化**
- [SEO 检查清单](docs/seo-optimization/SEO_CHECKLIST.md)
- [Google Search Console 指南](docs/seo-optimization/GOOGLE_SEARCH_CONSOLE_GUIDE.md)
- [Google Analytics 设置](docs/analytics/GOOGLE_ANALYTICS_SETUP.md)

### 🏗️ **技术架构**
- [技术栈文档](docs/technical-architecture/TECH_STACK.md)
- [产品路线图 v2](docs/technical-architecture/PRODUCT_ROADMAP_V2.md)
- [部署指南](docs/deployment/DEPLOYMENT_CHECKLIST.md)

### 📊 **完整文档库**
- [文档库索引](docs/README.md) - 查看所有文档
- [文档整理方案](docs/DOCUMENTATION_REORGANIZATION_PLAN.md) - 文档整理详情

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 👤 作者

**Leon**
- 网站: [https://www.daysfromtoday.ai](https://www.daysfromtoday.ai)
- GitHub: [@leeleon](https://github.com/leeleon)

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Vercel](https://vercel.com/) - 部署平台
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Radix UI](https://www.radix-ui.com/) - UI 组件
- [date-fns](https://date-fns.org/) - 日期处理
- [Nager.Date](https://date.nager.at/) - 节假日 API

---

**Built with ❤️ in London**
