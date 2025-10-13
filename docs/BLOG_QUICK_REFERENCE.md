# 博客发布快速参考

## 🚀 快速开始

### 发布新博客的3个步骤

1. **创建中文博客**
   ```bash
   # 在 obsidian/content/blog/zh/ 创建新文件
   # 使用模板：blog-template-optimized.md
   ```

2. **生成英文翻译**
   ```bash
   # 手动翻译或使用AI工具
   # 保存到 obsidian/content/blog/en/
   ```

3. **执行发布流程**
   ```bash
   npm run blog:workflow
   ```

## 📋 标准流程

### 完整发布流程
```bash
# 1. 检查博客文件
npm run blog:check

# 2. 生成英文翻译
npm run blog:translate

# 3. 更新博客首页
npm run blog:update

# 4. 部署验证
npm run blog:deploy

# 或者一键执行
npm run blog:workflow
```

## 📁 文件结构

```
obsidian/content/blog/
├── zh/                           # 中文博客目录
│   ├── blog-template-optimized.md # 博客模板
│   └── [新博客].md               # 中文博客文件
└── en/                           # 英文博客目录
    └── [翻译后的博客].md         # 英文博客文件
```

## 🔧 博客首页更新

### 更新 app/[locale]/blog/page.tsx
```typescript
const blogPosts = [
  {
    slug: 'new-blog-slug',
    title: {
      en: 'English Title',
      zh: '中文标题'
    },
    excerpt: {
      en: 'English excerpt...',
      zh: '中文摘要...'
    },
    date: '2025-10-13',
    readTime: {
      en: 'X min read',
      zh: 'X 分钟阅读'
    },
    category: {
      en: 'Category',
      zh: '分类'
    },
    featured: true  // 置顶显示
  },
  // ... 其他文章
];
```

## ✅ 质量检查

### 发布前检查
- [ ] 中文博客内容完整
- [ ] 英文翻译准确
- [ ] 博客首页配置正确
- [ ] 新文章置顶显示
- [ ] 所有页面访问正常

### 发布后验证
- [ ] 生产环境部署成功
- [ ] 中英文博客页面正常
- [ ] 新文章在首页置顶
- [ ] SEO和sitemap更新

## 🚨 常见问题

### Contentlayer解析错误
```bash
# 检查Markdown表格格式
# 避免复杂表格，使用列表格式
```

### 博客页面不更新
```bash
# 检查博客首页配置
# 确认featured属性设置
# 验证文章顺序
```

### 部署问题
```bash
# 检查Git提交
# 验证Vercel部署状态
# 确认生产环境访问
```

## 📊 成功指标

- ✅ 中文博客创建：100%
- ✅ 英文翻译生成：100%
- ✅ 博客首页更新：100%
- ✅ 生产环境部署：100%
- ✅ 新文章置顶显示：100%

## 🎯 最佳实践

1. **内容质量**
   - 使用标准博客模板
   - 确保内容结构清晰
   - 检查SEO优化

2. **翻译质量**
   - 保持原文结构
   - 调整文化背景
   - 验证专业术语

3. **技术实现**
   - 遵循标准流程
   - 使用自动化脚本
   - 验证每个步骤

---

**快速命令参考**:
- `npm run blog:workflow` - 完整发布流程
- `npm run blog:check` - 检查博客文件
- `npm run blog:translate` - 生成翻译
- `npm run blog:update` - 更新首页
- `npm run blog:deploy` - 部署验证
