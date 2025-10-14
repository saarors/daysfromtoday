# 📸 图片管理指南

## 🎯 图片组织结构

### 推荐结构
```
obsidian/content/
├── blog/
│   ├── zh/
│   │   ├── images/                    # 中文博客图片
│   │   │   ├── 2024-01-20-article/   # 按文章分组
│   │   │   │   ├── hero-image.jpg
│   │   │   │   ├── diagram-1.png
│   │   │   │   └── screenshot-2.jpg
│   │   │   ├── shared/               # 共享图片
│   │   │   │   ├── logo.png
│   │   │   │   └── icons/
│   │   │   └── temp/                 # 临时图片
│   │   └── *.md
│   └── en/
│       ├── images/                   # 英文博客图片
│       └── *.md
├── philosophy/
│   ├── images/                       # 哲学思考图片
│   └── *.md
└── tools/
    ├── images/                       # 工具介绍图片
    └── *.md
```

## 📋 命名规范

### 1. **文件夹命名**
- 格式：`YYYY-MM-DD-article-title`
- 示例：`2024-01-20-why-i-built-daysfromtoday`

### 2. **图片文件命名**
- 格式：`descriptive-name.extension`
- 示例：
  - `hero-image.jpg`
  - `workflow-diagram.png`
  - `screenshot-1.jpg`
  - `infographic-final.png`

### 3. **特殊用途图片**
- `cover-*` - 封面图片
- `hero-*` - 主图
- `diagram-*` - 图表
- `screenshot-*` - 截图
- `icon-*` - 图标

## 🔄 工作流程

### 1. **创建新文章时**
```bash
# 1. 创建图片文件夹
mkdir obsidian/content/blog/zh/images/2024-01-20-article-title

# 2. 将图片放入对应文件夹
# 3. 在 Markdown 中引用
![描述](images/2024-01-20-article-title/hero-image.jpg)
```

### 2. **图片上传到 R2**
```bash
# 自动上传到 R2 CDN
npm run images:upload obsidian/content/blog/zh/images/2024-01-20-article-title
```

### 3. **清理临时图片**
```bash
# 定期清理 temp 文件夹
rm -rf obsidian/content/blog/zh/images/temp/*
```

## 🎨 图片优化建议

### 1. **尺寸规范**
- **封面图片**：1200x630px (16:9)
- **文章插图**：800x600px (4:3)
- **图标**：64x64px 或 128x128px
- **截图**：保持原始比例，最大宽度 1200px

### 2. **格式选择**
- **照片**：JPEG (质量 85-90%)
- **图标/图表**：PNG (支持透明)
- **矢量图**：SVG
- **动画**：GIF 或 WebP

### 3. **文件大小**
- **封面图片**：< 200KB
- **文章插图**：< 100KB
- **图标**：< 10KB

## 🔧 自动化脚本

### 1. **图片压缩脚本**
```bash
# 使用 Sharp 压缩图片
npm run images:compress obsidian/content/blog/zh/images/2024-01-20-article-title
```

### 2. **批量上传脚本**
```bash
# 上传所有图片到 R2
npm run images:upload:all
```

### 3. **清理脚本**
```bash
# 清理未使用的图片
npm run images:cleanup
```

## 📱 响应式图片

### 1. **多尺寸支持**
```markdown
![描述](images/article/hero-image.jpg)
<!-- 自动生成不同尺寸 -->
```

### 2. **懒加载**
```markdown
![描述](images/article/hero-image.jpg){loading="lazy"}
```

## 🗂️ 维护建议

### 1. **定期清理**
- 每月清理 `temp/` 文件夹
- 删除未使用的图片
- 压缩大文件

### 2. **备份策略**
- 本地：Git 版本控制
- 云端：R2 CDN 自动备份
- 定期：本地备份到外部存储

### 3. **SEO 优化**
- 使用描述性的文件名
- 添加 alt 文本
- 优化图片元数据

## 🚀 高级功能

### 1. **自动生成缩略图**
```bash
npm run images:thumbnails
```

### 2. **图片水印**
```bash
npm run images:watermark
```

### 3. **批量重命名**
```bash
npm run images:rename --pattern="*.jpg" --prefix="article-"
```

## 📊 监控指标

### 1. **性能指标**
- 图片加载时间
- 文件大小分布
- 格式使用统计

### 2. **使用情况**
- 最常用图片
- 未使用图片
- 存储空间使用

## 🔍 故障排除

### 1. **常见问题**
- 图片不显示：检查路径和文件名
- 上传失败：检查文件大小和格式
- 加载慢：优化图片大小和格式

### 2. **调试工具**
```bash
# 检查图片状态
npm run images:status

# 验证图片完整性
npm run images:verify
```

---

## 📝 总结

1. **按内容类型组织**：blog/zh/images/, blog/en/images/
2. **按文章分组**：2024-01-20-article-title/
3. **使用描述性命名**：hero-image.jpg, diagram-1.png
4. **定期清理**：删除未使用图片
5. **优化性能**：压缩图片，使用合适格式
6. **自动化流程**：使用脚本批量处理

这样的组织结构既便于管理，又支持自动化处理，是内容管理的最佳实践。
