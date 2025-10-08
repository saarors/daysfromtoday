# 📋 博客发布快速参考卡

> 一页纸速查手册，适合打印或保存为书签

---

## 🚀 快速发布（5分钟）

```bash
# 1. 创建文章
node scripts/create-blog-post.js my-article Story

# 2. 编辑内容
# 打开 app/[locale]/blog/my-article/page.tsx
# 填写中英文内容

# 3. 发布
git add . && \
git commit -m "feat: 发布博客 - 文章标题" && \
git push origin main && \
vercel --prod
```

---

## 📝 文章分类

| 分类 | 英文 | 中文 | 用途 |
|------|------|------|------|
| Story | Story | 故事 | 个人故事、产品故事 |
| Guide | Guide | 指南 | 教程、操作指南 |
| News | News | 新闻 | 产品更新、公告 |
| Update | Update | 更新 | 功能更新、版本 |

---

## 🖼️ 图片规范

| 类型 | 尺寸 | 格式 | 大小 | 位置 |
|------|------|------|------|------|
| 封面图 | 1200×675 | JPG/WebP | <200KB | `/public/images/blog/{slug}-cover.jpg` |
| OG图 | 1200×630 | JPG/PNG | <200KB | `/public/images/blog/{slug}-og.jpg` |
| 内文图 | 800-1200宽 | JPG/WebP | <150KB | `/public/images/blog/{slug}-1.jpg` |

---

## 📊 SEO 检查清单

### 必填项
- [ ] 标题：50-60字符，包含关键词
- [ ] 描述：中文80-120字符，英文120-160字符
- [ ] 关键词：3-8个
- [ ] 封面图和OG图
- [ ] Canonical URL
- [ ] Hreflang标签

### 验证工具
- **Google Rich Results**: https://search.google.com/test/rich-results
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card**: https://cards-dev.twitter.com/validator

---

## 🏠 首页置顶

### 1. 更新文本内容
编辑 `app/[locale]/home-client.tsx`：

```typescript
// 英文版本
blog: {
  title: 'Featured Story',
  firstPost: {
    title: '文章标题',
    date: 'October 8, 2025',
    excerpt: '摘要内容（100-160字符）',
    readMore: 'Read Story',
    readTime: '6 min read'
  }
}

// 中文版本
blog: {
  title: '精选故事',
  firstPost: {
    title: '文章标题',
    date: '2025年10月8日',
    excerpt: '摘要内容（80-120字符）',
    readMore: '阅读故事',
    readTime: '6 分钟阅读'
  }
}
```

### 2. 更新链接
```typescript
<Link href={`/${locale}/blog/your-article-slug`}>
```

### 3. 提交
```bash
git add app/[locale]/home-client.tsx
git commit -m "feat: 首页置顶博客 - 文章标题"
git push origin main && vercel --prod
```

---

## 🔄 常用命令

```bash
# 创建新文章
node scripts/create-blog-post.js <slug> <category>

# 本地预览
npm run dev

# 清理缓存
rm -rf .next && npm run dev

# 提交并部署
git add . && \
git commit -m "feat: 发布博客 - 标题" && \
git push origin main && \
vercel --prod

# 回滚部署
vercel rollback
```

---

## 📐 排版规范

### 文章结构
```typescript
const content = {
  en: {
    sections: [
      {
        heading: "",  // 空标题 = 无标题段落
        content: [
          "段落文本",
          "",  // 空行 = 段落间距
          "**粗体文本**",  // Markdown粗体
          "> 引用文本"  // 引用块
        ]
      }
    ]
  }
}
```

### 信息密度优化
- 段落间距: `space-y-4` ✅
- 标题大小: `text-4xl/5xl` ✅
- 正文字号: `text-base` ✅
- 行高: `leading-relaxed` ✅

---

## 🎨 Featured 标识

### 添加
```typescript
<div className="absolute top-4 right-4 z-10">
  <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold px-4 py-1.5 text-sm shadow-lg">
    ⭐ Featured Story
  </Badge>
</div>
```

### 移除
```typescript
// 删除或注释掉上述代码
```

---

## 🔗 重要链接

### 生产环境
- 首页: https://www.daysfromtoday.ai
- 博客列表: https://www.daysfromtoday.ai/zh/blog
- 创始人故事: https://www.daysfromtoday.ai/zh/blog/why-i-built-daysfromtoday

### 本地开发
- 首页: http://localhost:3000/zh
- 博客列表: http://localhost:3000/zh/blog

### 管理工具
- Vercel Dashboard: https://vercel.com/dashboard
- Google Search Console: https://search.google.com/search-console
- Google Analytics: https://analytics.google.com

---

## 📞 获取帮助

### 文档
- 完整指南: `docs/BLOG_SYSTEM.md`
- 模板规范: `docs/templates/BLOG_TEMPLATE.md`
- 类型定义: `types/blog.ts`

### 示例
- 创始人故事: `app/[locale]/blog/why-i-built-daysfromtoday/page.tsx`

### 工具
- 创建脚本: `scripts/create-blog-post.js`
- 工具函数: `lib/blog-utils.ts`
- 文章组件: `components/BlogArticle.tsx`

---

**最后更新**: 2025-10-08  
**维护者**: Leon  
**版本**: v1.0

