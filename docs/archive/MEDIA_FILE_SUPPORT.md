# 媒体文件支持说明

## 📋 概述

DaysFromToday 项目现在支持上传和处理多种类型的媒体文件，不仅仅是图片。当你在 Obsidian 中拖拽文件到 Markdown 文档时，系统会自动检测文件类型并生成相应的 Markdown 链接。

## 🖼️ 支持的图片格式

- **标准格式**：`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- **苹果格式**：`.heic`, `.heif`

### 处理方式
- 上传到 `images/` 目录
- 生成图片 Markdown 链接：`![filename](cdn-url)`
- 在网页中直接显示

## 📎 支持的媒体格式

- **视频文件**：`.mp4`, `.mov`
- **音频文件**：`.m4a`, `.mp3`, `.wav`
- **文档文件**：`.pdf`
- **数据文件**：`.csv`, `.xlsx`, `.docx`

### 处理方式
- 上传到 `media/` 目录
- 生成下载链接，带有相应的图标：
  - 📹 视频文件：`[📹 filename](cdn-url)`
  - 🎵 音频文件：`[🎵 filename](cdn-url)`
  - 📄 PDF 文件：`[📄 filename](cdn-url)`
  - 📊 CSV 文件：`[📊 filename](cdn-url)`
  - 📎 其他文件：`[📎 filename](cdn-url)`

## 🔧 技术实现

### 文件类型检测
```typescript
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.heic', '.heif'];
const MEDIA_EXTENSIONS = ['.mp4', '.mov', '.m4a', '.mp3', '.wav', '.pdf', '.csv', '.xlsx', '.docx'];
```

### Content-Type 设置
- 图片文件：`image/{extension}`
- PDF 文件：`application/pdf`
- 视频文件：`video/mp4`
- 音频文件：`audio/mpeg`
- CSV 文件：`text/csv`
- 其他文件：`application/octet-stream`

### 存储结构
```
cdn.daysfromtoday.ai/
├── images/
│   └── blog/
│       └── en/
│           ├── image1.jpg
│           └── image2.heic
└── media/
    └── blog/
        └── en/
            ├── video.mp4
            ├── audio.m4a
            ├── document.pdf
            └── data.csv
```

## 🚀 使用方法

### 1. 在 Obsidian 中拖拽文件
- 将任何支持的文件拖拽到 Markdown 文档中
- Obsidian 会自动生成 `![[filename.ext]]` 链接

### 2. 运行工作流程
```bash
npm run dev:obsidian
```

### 3. 查看结果
- 图片文件会显示为图片
- 媒体文件会显示为带图标的下载链接

## 🧪 测试

运行测试脚本验证功能：
```bash
npm run images:test-media
```

## 📝 示例

### 原始 Obsidian 链接
```markdown
![[screenshot.png]]
![[presentation.pdf]]
![[demo.mp4]]
![[audio.m4a]]
![[data.csv]]
```

### 转换后的 Markdown
```markdown
![screenshot](https://cdn.daysfromtoday.ai/images/blog/en/screenshot.png)
[📄 presentation](https://cdn.daysfromtoday.ai/media/blog/en/presentation.pdf)
[📹 demo](https://cdn.daysfromtoday.ai/media/blog/en/demo.mp4)
[🎵 audio](https://cdn.daysfromtoday.ai/media/blog/en/audio.m4a)
[📊 data](https://cdn.daysfromtoday.ai/media/blog/en/data.csv)
```

## ⚠️ 注意事项

1. **文件大小**：大文件上传可能需要较长时间
2. **浏览器支持**：某些格式（如 HEIC）可能在某些浏览器中无法直接显示
3. **CDN 缓存**：文件上传后可能需要几分钟才能在 CDN 中生效
4. **权限**：确保 R2 存储桶有正确的公共访问权限

## 🔄 更新日志

- **v1.0**：支持标准图片格式
- **v1.1**：添加 HEIC/HEIF 支持
- **v1.2**：添加媒体文件支持（视频、音频、文档）
- **v1.3**：优化文件类型检测和 Content-Type 设置

