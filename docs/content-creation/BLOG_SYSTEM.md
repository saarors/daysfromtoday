# 📚 DaysFromToday 博客系统使用指南

> 完整的博客发布工作流程，从创建到上线一站式解决。

---

## 📋 目录

1. [快速开始](#快速开始)
2. [创建新文章](#创建新文章)
3. [编写内容](#编写内容)
4. [图片准备](#图片准备)
5. [SEO 优化](#seo-优化)
6. [发布上线](#发布上线)
7. [最佳实践](#最佳实践)

---

## 🚀 快速开始

### 使用脚本创建新文章

```bash
# 创建一篇新的故事类文章
node scripts/create-blog-post.js my-story-slug Story

# 创建一篇指南类文章
node scripts/create-blog-post.js how-to-guide Guide

# 创建一篇新闻类文章
node scripts/create-blog-post.js latest-update News
```

### 文章分类

| 分类 | 英文 | 中文 | 用途 |
|------|------|------|------|
| Story | Story | 故事 | 个人故事、产品背后的故事 |
| Guide | Guide | 指南 | 教程、操作指南 |
| News | News | 新闻 | 产品更新、公告 |
| Update | Update | 更新 | 功能更新、版本发布 |

---

## ✍️ 创建新文章

### 1. 使用脚本生成模板

```bash
node scripts/create-blog-post.js your-article-slug Story
```

这会自动创建：
- ✅ 文章页面：`app/[locale]/blog/your-article-slug/page.tsx`
- ✅ 基础 SEO 元数据
- ✅ JSON-LD 结构化数据
- ✅ 双语支持框架

### 2. 手动创建（高级）

如果需要更多自定义，可以：

1. 复制现有文章模板
2. 修改文件名和路径
3. 更新所有元数据
4. 添加到博客列表

---

## 📝 编写内容

### 文章结构

```typescript
const content = {
  en: {
    title: "Your Article Title",
    date: "October 8, 2025",
    readTime: "5 min read",
    sections: [
      {
        heading: "", // 空标题表示无标题段落
        content: [
          "First paragraph",
          "", // 空行表示段落间距
          "**Bold text** for emphasis",
          "> Quote block starts with >"
        ]
      },
      {
        heading: "Section Title",
        content: [
          "Section content..."
        ]
      }
    ]
  },
  zh: {
    // 中文版本...
  }
}
```

### Markdown 语法支持

| 语法 | 效果 | 示例 |
|------|------|------|
| `**粗体**` | **粗体** | `**时间**是唯一资源` |
| `> 引用` | 引用块 | `> "还有几天？"` |
| 空字符串 `""` | 段落间距 | 用于段落之间的留白 |

### 分隔线

文章会自动在章节之间添加优雅的分隔线（⸻），无需手动添加。

---

## 🖼️ 图片准备

### 封面图（Cover Image）

**规格要求**:
- 尺寸: 1200 × 675 px (16:9)
- 格式: JPG / WebP
- 大小: < 200KB
- 位置: `/public/images/blog/{slug}-cover.jpg`

**设计建议**:
- 使用产品相关的视觉元素
- 保持 Calendly 风格的色彩（蓝、紫、粉渐变）
- 添加文字标题（可选）
- 确保在小屏幕上也清晰可见

### OG 分享图（Open Graph Image）

**规格要求**:
- 尺寸: 1200 × 630 px
- 格式: JPG / PNG
- 大小: < 200KB
- 位置: `/public/images/blog/{slug}-og.jpg`

**内容建议**:
- 文章标题（大字号）
- DaysFromToday Logo
- 装饰性背景
- 保持简洁

### 内文配图

**规格要求**:
- 宽度: 800-1200 px
- 格式: JPG / WebP
- 大小: < 150KB
- 命名: `{slug}-1.jpg`, `{slug}-2.jpg`

---

## 🔍 SEO 优化

### 元数据检查清单

- [ ] **标题**（Title）
  - 长度: 50-60 字符
  - 包含核心关键词
  - 吸引人点击

- [ ] **描述**（Description）
  - 中文: 80-120 字符
  - 英文: 120-160 字符
  - 包含行动号召

- [ ] **关键词**（Keywords）
  - 数量: 3-8 个
  - 相关性强
  - 包含长尾关键词

- [ ] **URL**（Slug）
  - 简短易记
  - 包含关键词
  - 使用连字符分隔

### SEO 验证工具

发布前使用以下工具验证：

1. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - 验证 JSON-LD 结构化数据

2. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - 验证 Open Graph 标签

3. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - 验证 Twitter Card

---

## 🚢 发布上线

### 完整发布流程

#### 方法一：标准发布流程（推荐）

```bash
# 1. 创建新文章
node scripts/create-blog-post.js your-article-slug Story

# 2. 编辑内容
# 打开生成的文件 app/[locale]/blog/your-article-slug/page.tsx
# 填写中英文内容、标题、摘要等

# 3. 准备图片
# 上传封面图到 /public/images/blog/your-article-slug-cover.jpg (1200×675px)
# 上传OG图到 /public/images/blog/your-article-slug-og.jpg (1200×630px)

# 4. 本地预览
npm run dev
# 访问 http://localhost:3000/zh/blog/your-article-slug
# 检查排版、内容、链接

# 5. 提交代码
git add .
git commit -m "feat: 发布博客 - 文章标题"
git push origin main

# 6. 部署到生产环境
vercel --prod

# 7. 验证部署
# 访问 https://www.daysfromtoday.ai/zh/blog/your-article-slug
# 测试 SEO 元数据、社交分享
```

#### 方法二：快速发布流程

```bash
# 一键创建、编辑、提交、部署
node scripts/create-blog-post.js my-story Story && \
vim app/[locale]/blog/my-story/page.tsx && \
git add . && \
git commit -m "feat: 发布博客 - My Story" && \
git push origin main && \
vercel --prod
```

---

## 🔄 更新博客内容

### 更新已发布的文章

```bash
# 1. 编辑文章
vim app/[locale]/blog/existing-article/page.tsx

# 2. 更新修改日期（可选）
# 在 blogPost 对象中更新 date 字段

# 3. 本地预览
npm run dev

# 4. 提交更新
git add app/[locale]/blog/existing-article/page.tsx
git commit -m "fix: 更新博客内容 - 文章标题"
git push origin main

# 5. 部署
vercel --prod
```

### 更新博客图片

```bash
# 1. 替换图片文件
cp new-cover.jpg public/images/blog/article-slug-cover.jpg

# 2. 优化图片（推荐使用 ImageOptim 或在线工具）
# 确保大小 < 200KB

# 3. 提交
git add public/images/blog/
git commit -m "chore: 更新博客封面图"
git push origin main
vercel --prod
```

---

## 🏠 首页博客卡片管理

### 置顶博客文章到首页

编辑 `app/[locale]/home-client.tsx`：

1. **更新博客文本内容**：

```typescript
// 在 text.en 和 text.zh 中更新
blog: {
  title: 'Featured Story',  // 或 'Latest from Blog'
  firstPost: {
    title: '您的文章标题',
    date: '2025-10-08',
    excerpt: '吸引人的摘要内容（100-160字符）',
    readMore: 'Read Story',
    readTime: '6 min read'
  }
}
```

2. **更新博客卡片链接**：

```typescript
// 找到 Blog Section，更新链接
<Link href={`/${locale}/blog/your-article-slug`} className="block">
```

3. **自定义卡片样式**（可选）：

```typescript
// 修改配图部分
<div className="md:w-2/5 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
  <div className="text-white text-center">
    <div className="text-7xl mb-4">🕰️</div>  {/* 自定义图标 */}
    <div className="text-2xl font-bold mb-2">标题行1</div>
    <div className="text-3xl font-extrabold mb-3">标题行2</div>
  </div>
</div>
```

4. **提交更新**：

```bash
git add app/[locale]/home-client.tsx
git commit -m "feat: 首页置顶博客 - 文章标题"
git push origin main
vercel --prod
```

### Featured 标识管理

显示 Featured 标识：
```typescript
<div className="absolute top-4 right-4 z-10">
  <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold px-4 py-1.5 text-sm shadow-lg">
    ⭐ Featured Story
  </Badge>
</div>
```

移除 Featured 标识：
```typescript
// 删除或注释掉上述代码块
```

---

## 📋 博客列表页面管理

### 添加文章到博客列表

编辑 `app/[locale]/blog/page.tsx`：

```typescript
const blogPosts = [
  // 新文章放在最前面（按时间倒序）
  {
    slug: 'newest-article',
    title: {
      en: 'Newest Article Title',
      zh: '最新文章标题'
    },
    excerpt: {
      en: 'English excerpt (100-160 chars)',
      zh: '中文摘要（80-120字符）'
    },
    date: '2025-10-08',
    readTime: {
      en: '5 min read',
      zh: '5 分钟阅读'
    },
    category: {
      en: 'Story',
      zh: '故事'
    },
    featured: true  // 可选：标记为精选文章
  },
  // ... 其他文章
];
```

### 文章排序

- **时间倒序**（推荐）：最新文章在最前面
- **Featured 优先**：精选文章置顶
- **分类排序**：按Story/Guide/News/Update分组

---

## 🔍 SEO 提交与验证

### Google Search Console 提交

```bash
# 1. 获取新文章 URL
https://www.daysfromtoday.ai/zh/blog/your-article-slug

# 2. 在 GSC 中提交
- 打开 Google Search Console
- 使用 URL 检查工具
- 请求编入索引

# 3. 验证 Sitemap（自动更新）
https://www.daysfromtoday.ai/sitemap.xml
```

### 社交分享测试

```bash
# Facebook Debugger
https://developers.facebook.com/tools/debug/
# 输入文章 URL，检查 OG 标签

# Twitter Card Validator
https://cards-dev.twitter.com/validator
# 输入文章 URL，检查 Twitter Card

# LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/
# 输入文章 URL，检查预览效果
```

---

## 🛠️ 常见操作命令

### 快速命令清单

```bash
# 创建新文章
node scripts/create-blog-post.js <slug> <category>

# 本地预览
npm run dev

# 清理缓存重新构建
rm -rf .next && npm run dev

# 提交代码
git add . && git commit -m "feat: 发布博客 - 标题" && git push origin main

# 部署到生产
vercel --prod

# 查看部署日志
vercel inspect <deployment-url> --logs

# 回滚到上一个版本
vercel rollback
```

### 批量操作

```bash
# 批量创建文章
for slug in story-1 story-2 story-3; do
  node scripts/create-blog-post.js $slug Story
done

# 批量优化图片（需要 ImageOptim CLI）
imageoptim public/images/blog/*.jpg

# 批量提交多篇文章
git add app/[locale]/blog/*/
git commit -m "feat: 批量发布博客文章"
git push origin main
```

---

## 💡 最佳实践

### 内容质量

1. **原创性**
   - 100% 原创内容
   - 避免 AI 生成的机械感
   - 注入个人情感和经验

2. **可读性**
   - 短句子，清晰表达
   - 使用列表和小标题
   - 段落间适当留白

3. **价值**
   - 解决实际问题
   - 提供可操作建议
   - 引发情感共鸣

### 排版规范

1. **层级结构**
   - H1: 文章标题
   - H2: 主要章节
   - H3: 次级小节

2. **视觉元素**
   - 每 3-5 段插入配图
   - 使用引用块突出重点
   - 粗体强调关键词

3. **响应式**
   - 确保移动端可读
   - 图片自适应缩放
   - 合理的字号和行距

### SEO 技巧

1. **关键词布局**
   - 标题包含主关键词
   - 首段出现关键词
   - 自然分布，不堆砌

2. **内部链接**
   - 链接到相关文章
   - 链接到产品页面
   - 使用描述性锚文本

3. **外部链接**
   - 引用权威来源
   - 添加 nofollow 属性
   - 在新窗口打开

---

## 🎯 质量检查清单

### 发布前检查

- [ ] 中英文内容完整且准确
- [ ] 封面图和 OG 图已准备
- [ ] SEO 元数据完整
- [ ] 图片已优化压缩
- [ ] 本地预览正常
- [ ] 移动端适配良好
- [ ] 所有链接可访问
- [ ] 无语法和拼写错误
- [ ] JSON-LD 验证通过
- [ ] 已添加到博客列表

### 发布后检查

- [ ] 生产环境访问正常
- [ ] Google Search Console 提交
- [ ] 社交分享测试
- [ ] 性能指标达标
- [ ] Google Analytics 追踪
- [ ] 错误监控配置

---

## 📊 参考资源

### 模板文件
- `docs/templates/BLOG_TEMPLATE.md` - 完整模板规范
- `types/blog.ts` - TypeScript 类型定义
- `lib/blog-utils.ts` - 工具函数库
- `components/BlogArticle.tsx` - 可复用组件

### 示例文章
- `app/[locale]/blog/why-i-built-daysfromtoday/page.tsx` - 创始人故事

### 工具脚本
- `scripts/create-blog-post.js` - 创建新文章

---

## 🤝 需要帮助？

如有任何问题或建议，请：

1. 查看模板文档
2. 参考示例文章
3. 联系技术负责人

**祝您写作愉快！✍️**

