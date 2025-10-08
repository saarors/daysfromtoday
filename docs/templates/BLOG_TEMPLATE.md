# 📝 DaysFromToday 博客文章标准模板

> **目标**：建立统一的博客发布标准，确保所有文章在 SEO、排版、用户体验上保持一致。

---

## 📋 模板要素清单

### 1️⃣ 必备元素（Required）

| 元素 | 说明 | 示例 |
|------|------|------|
| **标题（Title）** | 简洁有力，中英文双语 | "为什么我要做 DaysFromToday \| Why I Built DaysFromToday" |
| **Slug** | URL 友好的唯一标识符 | `why-i-built-daysfromtoday` |
| **日期（Date）** | 发布日期（YYYY-MM-DD） | `2025-10-08` |
| **作者（Author）** | 作者名称 | `Leon` |
| **摘要（Description）** | 100-160 字符，吸引点击 | "今年9月，我13岁的儿子开始寄宿生活。每次通话他都会问：'还有几天？'" |
| **关键词（Keywords）** | 3-8 个核心关键词 | `["时间管理", "产品故事", "父与子", "倒计时工具"]` |
| **语言（Lang）** | 单语或双语标识 | `zh-en` / `zh` / `en` |
| **封面图（Cover）** | 16:9 比例，1200×675px | `/images/blog/article-slug-cover.jpg` |

### 2️⃣ SEO 优化元素

| 元素 | 说明 | 规范 |
|------|------|------|
| **Meta Title** | 搜索引擎标题 | 50-60 字符，包含核心关键词 |
| **Meta Description** | 搜索描述 | 120-160 字符，行动导向 |
| **Canonical URL** | 规范链接 | `https://www.daysfromtoday.ai/{locale}/blog/{slug}` |
| **Hreflang** | 多语言标签 | `en`, `zh` 双向链接 |
| **Open Graph (OG)** | 社交分享元数据 | 标题、描述、图片 |
| **Twitter Card** | Twitter 分享卡片 | `summary_large_image` |
| **JSON-LD** | 结构化数据 | `BlogPosting` Schema |

### 3️⃣ 视觉排版元素

| 元素 | 规范 |
|------|------|
| **标题层级** | H1 (文章标题) → H2 (章节) → H3 (小节) |
| **段落间距** | 1.5-2 倍行距 |
| **字号** | 正文 18px，标题 24-48px |
| **配图** | 每 3-5 段落插入一张配图，宽度 100% |
| **分隔线** | 使用 `⸻` 或渐变线条 |
| **引用块** | 使用灰色背景或左边框高亮 |
| **代码块** | 使用语法高亮 |
| **粗体强调** | 使用 `**粗体**` 标记关键句 |

### 4️⃣ 文章结构（Recommended）

```
1. 【文章头部】
   - 分类标签（Story / Guide / News）
   - 标题（渐变色）
   - 作者 + 日期 + 阅读时间
   - 封面图（可选）

2. 【引言】
   - 1-2 段简短开场
   - 建立情感连接或抛出问题

3. 【主体内容】
   - 3-7 个章节
   - 每个章节 2-5 段
   - 使用分隔线区分章节

4. 【结尾】
   - 总结核心观点
   - 行动号召（CTA）
   - 作者署名

5. 【互动区】
   - 相关文章推荐
   - 返回博客列表
```

---

## 🎨 Calendly 风格设计规范

### 色彩系统
```css
--primary: #0069FF (主蓝色)
--gradient-start: #D946EF (粉紫)
--gradient-mid: #8B5CF6 (紫色)
--gradient-end: #0069FF (蓝色)
--text-primary: #0F172A (深蓝灰)
--text-secondary: #475569 (中灰)
```

### 排版规范
- **标题**：使用渐变色 `text-gradient-calendly`
- **标签**：圆角背景，渐变色或纯色
- **卡片**：玻璃拟态效果 `card-glass`
- **按钮**：蓝色主色调，阴影+过渡效果
- **分隔线**：渐变线 + 装饰符号 `⸻`

---

## 📐 Front Matter 模板（MDX）

```yaml
---
title: "文章标题（中英文）"
slug: "article-slug"
date: "2025-10-08"
author: "Leon"
description: "简短摘要，120-160 字符"
keywords: ["关键词1", "关键词2", "关键词3"]
lang: "zh-en"
category: "Story" # Story / Guide / News / Update
cover: "/images/blog/article-slug-cover.jpg"
ogTitle: "社交分享标题"
ogDescription: "社交分享描述"
ogImage: "/images/blog/article-slug-og.jpg"
readTime: "6 min read"
published: true
featured: false
---
```

---

## 🖼️ 图片规范

### 封面图（Cover Image）
- **尺寸**: 1200 × 675 px (16:9)
- **格式**: JPG / WebP
- **大小**: < 200KB
- **命名**: `{slug}-cover.jpg`
- **位置**: `/public/images/blog/`

### OG 社交分享图
- **尺寸**: 1200 × 630 px
- **格式**: JPG / PNG
- **内容**: 标题 + Logo + 视觉元素
- **命名**: `{slug}-og.jpg`

### 内文配图
- **尺寸**: 800-1200 px 宽
- **格式**: JPG / WebP
- **大小**: < 150KB
- **命名**: `{slug}-{序号}.jpg`

---

## 📊 SEO Checklist

### On-Page SEO
- [ ] 标题包含核心关键词
- [ ] Meta Description 吸引点击
- [ ] 使用语义化 HTML 标签
- [ ] 图片包含 Alt 文本
- [ ] 内部链接到相关文章
- [ ] URL 简洁易读
- [ ] 移动端响应式

### Technical SEO
- [ ] Canonical URL 正确
- [ ] Hreflang 标签完整
- [ ] Open Graph 完整
- [ ] JSON-LD 结构化数据
- [ ] 页面加载速度 < 3s
- [ ] Core Web Vitals 达标

### Content SEO
- [ ] 原创内容，无抄袭
- [ ] 字数 > 800 字
- [ ] 段落结构清晰
- [ ] 使用列表和小标题
- [ ] 包含行动号召（CTA）

---

## 🚀 发布流程

### 1. 准备阶段
```bash
# 创建文章目录
mkdir -p app/[locale]/blog/{slug}

# 准备封面图
# 上传到 /public/images/blog/
```

### 2. 编写内容
- 使用模板填充内容
- 中英文双语同步
- 添加配图和格式

### 3. SEO 优化
- 填写完整 metadata
- 生成 OG 图片
- 添加 JSON-LD

### 4. 测试验证
```bash
# 本地预览
npm run dev

# 检查 SEO
- Google Rich Results Test
- Facebook Sharing Debugger
- Twitter Card Validator
```

### 5. 发布上线
```bash
# 提交代码
git add .
git commit -m "feat: 发布博客 - {文章标题}"
git push origin main

# 部署到 Vercel
vercel --prod
```

### 6. 后续优化
- 提交到 Google Search Console
- 监控 Google Analytics
- 收集用户反馈
- 定期更新内容

---

## 📝 示例文章

参考：`/app/[locale]/blog/why-i-built-daysfromtoday/page.tsx`

这篇文章展示了：
- ✅ 完整的双语内容
- ✅ Calendly 风格设计
- ✅ Markdown 渲染支持
- ✅ SEO 优化元素
- ✅ 情感化叙事风格

---

## 🎯 质量标准

### 内容质量
- **原创性**: 100% 原创，避免 AI 味
- **情感**: 真实、温暖、有共鸣
- **价值**: 提供实用信息或情感价值
- **可读性**: 小学六年级能读懂

### 技术质量
- **性能**: LCP < 2.5s, CLS < 0.1
- **SEO**: Google 100 分
- **可访问性**: WCAG AA 标准
- **响应式**: 完美支持移动端

### 视觉质量
- **设计**: 符合 Calendly 风格
- **排版**: 清晰、舒适、专业
- **配图**: 高质量、相关性强
- **一致性**: 与网站整体风格统一

---

## 🔄 未来优化方向

1. **MDX 支持**: 支持 Markdown + React 组件
2. **评论系统**: 允许读者互动
3. **目录生成**: 自动生成文章目录
4. **相关推荐**: 智能推荐相关文章
5. **RSS 订阅**: 支持 RSS/Atom Feed
6. **多语言路由**: 自动语言切换
7. **阅读进度**: 显示阅读进度条
8. **分享按钮**: 社交媒体分享

---

**模板版本**: v1.0  
**最后更新**: 2025-10-08  
**维护者**: Leon  

