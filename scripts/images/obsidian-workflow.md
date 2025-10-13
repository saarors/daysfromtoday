# Obsidian + DaysFromToday 工作流指南

## 🎯 最简便的文章编辑方案

### 方案概述
使用 **Obsidian** 作为主要编辑器，配合自动图片上传脚本，实现：
- ✅ 本地编辑，实时预览
- ✅ 图片自动上传到 R2 CDN
- ✅ 链接自动更新
- ✅ 版本控制和备份
- ✅ 插件生态丰富

---

## 📁 推荐的 Obsidian Vault 结构

```
DaysFromToday-Vault/
├── 00-Templates/           # 文章模板
│   ├── Blog-Template.md
│   ├── Philosophy-Template.md
│   └── Tools-Template.md
├── 01-Blog/               # 博客文章
│   ├── en/
│   │   ├── why-i-built-daysfromtoday.md
│   │   └── images/        # 文章图片
│   └── zh/
│       ├── why-i-built-daysfromtoday.md
│       └── images/
├── 02-Philosophy/         # 哲学思考
│   ├── en/
│   └── zh/
├── 03-Tools/              # 工具介绍
│   ├── en/
│   └── zh/
├── 04-Stories/            # 用户故事
│   ├── en/
│   └── zh/
├── 05-Guides/             # 使用指南
│   ├── en/
│   └── zh/
├── 06-Updates/            # 产品更新
│   ├── en/
│   └── zh/
└── 99-Assets/             # 共享资源
    ├── images/
    └── templates/
```

---

## 🔧 必需的 Obsidian 插件

### 1. **Templater** (必需)
- **功能**: 动态模板系统
- **用途**: 自动生成文章 frontmatter
- **安装**: Community Plugins → Templater

### 2. **Image Toolkit** (推荐)
- **功能**: 图片预览和编辑
- **用途**: 查看图片、调整大小
- **安装**: Community Plugins → Image Toolkit

### 3. **Paste Image Rename** (推荐)
- **功能**: 粘贴图片时自动重命名
- **用途**: 保持图片名称规范
- **安装**: Community Plugins → Paste Image Rename

### 4. **Advanced Tables** (推荐)
- **功能**: 表格编辑增强
- **用途**: 更好的表格编辑体验
- **安装**: Community Plugins → Advanced Tables

### 5. **Markdown Table Editor** (可选)
- **功能**: 可视化表格编辑
- **用途**: 复杂表格编辑
- **安装**: Community Plugins → Markdown Table Editor

---

## 📝 文章模板配置

### Blog 文章模板
```markdown
---
title: "{{title}}"
description: "{{description}}"
date: "{{date:YYYY-MM-DD}}"
author: "Leon"
category: "{{category}}"
tags: ["{{tags}}"]
featured: {{featured}}
image: "/images/blog/{{locale}}/{{slug}}.jpg"
readingTime: "{{readingTime}} min read"
locale: "{{locale}}"
---

# {{title}}

{{description}}

## 正文内容

在这里写你的文章内容...

### 插入图片

![图片描述](images/example.jpg)

## 结论

总结你的观点...

---

*本文发布于 {{date:YYYY-MM-DD}}*
```

### Philosophy 文章模板
```markdown
---
title: "{{title}}"
description: "{{description}}"
date: "{{date:YYYY-MM-DD}}"
author: "Leon"
category: "Philosophy"
tags: ["philosophy", "{{tags}}"]
featured: {{featured}}
image: "/images/philosophy/{{locale}}/{{slug}}.jpg"
readingTime: "{{readingTime}} min read"
locale: "{{locale}}"
---

# {{title}}

## 核心观点

{{description}}

## 深入思考

### 问题提出

### 分析过程

### 结论与启示

## 实践应用

如何将这些思考应用到实际生活中...

---

*哲学思考 | {{date:YYYY-MM-DD}}*
```

---

## 🚀 工作流程

### 1. **创建新文章**
```bash
# 在 Obsidian 中
1. 打开 Templater 插件
2. 选择对应的文章模板
3. 填写模板变量
4. 开始写作
```

### 2. **插入图片**
```bash
# 方法1: 拖拽图片到 Obsidian
1. 将图片拖拽到文章编辑区域
2. 图片自动保存到 images/ 文件夹
3. 链接自动生成

# 方法2: 复制粘贴
1. 复制图片到剪贴板
2. 在 Obsidian 中 Ctrl+V
3. 图片自动保存并插入
```

### 3. **上传图片到 CDN**
```bash
# 在项目根目录执行
npm run images:upload "/path/to/your/obsidian/vault" blog

# 或者批量处理所有类型
npm run images:upload "/path/to/your/obsidian/vault" blog
npm run images:upload "/path/to/your/obsidian/vault" philosophy
npm run images:upload "/path/to/your/obsidian/vault" tools
```

### 4. **同步到项目**
```bash
# 将 Obsidian 中的 .md 文件复制到项目
cp "/path/to/obsidian/vault/01-Blog/en/article.md" "content/blog/en/article.mdx"

# 或者使用符号链接（推荐）
ln -s "/path/to/obsidian/vault/01-Blog/en" "content/blog/en"
```

---

## ⚙️ 自动化配置

### 1. **环境变量设置**
```bash
# .env.local
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_BUCKET_NAME=daysfromtoday-images
CDN_BASE_URL=https://cdn.daysfromtoday.ai
```

### 2. **package.json 脚本**
```json
{
  "scripts": {
    "images:upload": "tsx scripts/images/obsidian-upload.ts",
    "images:upload:all": "npm run images:upload \"/path/to/vault\" blog && npm run images:upload \"/path/to/vault\" philosophy && npm run images:upload \"/path/to/vault\" tools",
    "content:sync": "rsync -av /path/to/obsidian/vault/01-Blog/ content/blog/",
    "dev:obsidian": "npm run content:sync && npm run images:upload:all && npm run dev"
  }
}
```

### 3. **Obsidian 自动化**
```javascript
// Templater 脚本示例
<%*
// 自动生成 slug
const title = tp.file.title;
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
tR += slug;
%>
```

---

## 🎨 图片管理最佳实践

### 1. **命名规范**
```
# 文章封面图
article-slug-cover.jpg

# 内容图片
article-slug-image-1.jpg
article-slug-image-2.jpg

# 图表
article-slug-chart-1.png
article-slug-diagram-1.svg
```

### 2. **图片优化**
- **尺寸**: 文章图片建议 800x600px
- **格式**: 优先使用 WebP，兼容性考虑用 JPEG
- **压缩**: 使用 TinyPNG 或类似工具压缩
- **Alt 文本**: 始终添加有意义的描述

### 3. **CDN 使用**
```markdown
<!-- 本地开发 -->
![图片描述](images/example.jpg)

<!-- 生产环境（自动转换） -->
![图片描述](https://cdn.daysfromtoday.ai/images/blog/en/example-1234567890.jpg)
```

---

## 🔄 同步策略

### 方案 A: 手动同步（推荐新手）
```bash
# 1. 在 Obsidian 中完成文章
# 2. 手动复制到项目
cp "obsidian/article.md" "content/blog/en/article.mdx"
# 3. 上传图片
npm run images:upload "/path/to/vault" blog
# 4. 启动开发服务器
npm run dev
```

### 方案 B: 符号链接（推荐高级用户）
```bash
# 创建符号链接，实现实时同步
ln -s "/path/to/obsidian/vault/01-Blog/en" "content/blog/en"
ln -s "/path/to/obsidian/vault/02-Philosophy/en" "content/philosophy/en"
ln -s "/path/to/obsidian/vault/03-Tools/en" "content/tools/en"
```

### 方案 C: 自动化脚本（推荐团队）
```bash
# 创建同步脚本
#!/bin/bash
rsync -av --delete /path/to/obsidian/vault/01-Blog/ content/blog/
rsync -av --delete /path/to/obsidian/vault/02-Philosophy/ content/philosophy/
npm run images:upload:all
npm run dev
```

---

## 🎯 优势总结

### ✅ **为什么选择 Obsidian + R2 方案**

1. **编辑体验最佳**
   - 实时预览
   - 丰富的插件生态
   - 强大的搜索和链接功能

2. **图片管理自动化**
   - 拖拽即上传
   - 自动 CDN 分发
   - 链接自动更新

3. **版本控制友好**
   - 纯文本格式
   - Git 友好
   - 易于协作

4. **成本效益高**
   - Obsidian 免费
   - R2 存储成本低
   - 自动化减少人工成本

5. **扩展性强**
   - 支持复杂内容结构
   - 易于添加新功能
   - 插件生态丰富

---

## 🚀 快速开始

1. **安装 Obsidian** 并创建 vault
2. **安装推荐插件**
3. **配置环境变量**
4. **创建文章模板**
5. **开始写作！**

这个方案让你可以专注于内容创作，而不用担心技术细节。图片会自动上传到 CDN，文章会自动同步到项目，一切都是自动化的！

