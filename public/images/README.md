# 图片目录说明

## 📁 目录结构

```
public/images/
├── blog/           # 博客文章图片
│   ├── en/         # 英文博客图片
│   └── zh/         # 中文博客图片
├── philosophy/     # 哲学文章图片
│   ├── en/
│   └── zh/
├── tools/          # 工具介绍图片
│   ├── en/
│   └── zh/
├── stories/        # 用户故事图片
│   ├── en/
│   └── zh/
├── guides/         # 使用指南图片
│   ├── en/
│   └── zh/
└── updates/        # 产品更新图片
    ├── en/
    └── zh/
```

## 🎯 使用方式

### 1. 本地开发
将图片放在对应的目录中，在 MDX 文件中使用相对路径：

```markdown
![图片描述](images/blog/en/example.jpg)
```

### 2. 生产环境
图片会自动上传到 R2 CDN，链接会自动更新为：

```markdown
![图片描述](https://cdn.daysfromtoday.ai/images/blog/en/example-1234567890.jpg)
```

## 📝 命名规范

- **文章封面**: `article-slug-cover.jpg`
- **内容图片**: `article-slug-image-1.jpg`
- **图表**: `article-slug-chart-1.png`
- **截图**: `article-slug-screenshot-1.png`

## 🔧 上传脚本

```bash
# 上传特定类型的图片
npm run images:upload "/path/to/obsidian/vault" blog

# 批量上传所有类型
npm run images:upload:all
```

## 📏 图片规格建议

- **封面图**: 1200x630px (16:9)
- **内容图**: 800x600px (4:3)
- **图表**: 1000x600px (5:3)
- **格式**: WebP > JPEG > PNG
- **大小**: < 500KB

