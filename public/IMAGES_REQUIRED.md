# 所需图片清单

## 📸 必需的图片文件

为了完整的 SEO 和社交媒体优化，需要创建以下图片：

### 1. Open Graph 图片
**文件名：** `og-image.png`  
**尺寸：** 1200 x 630 px  
**格式：** PNG  
**用途：** 社交媒体分享（Facebook, Twitter, LinkedIn）

**设计要求：**
- 使用 Calendly 风格渐变背景（紫-粉-蓝）
- 品牌名称：DaysFromToday
- Slogan: "Calculate Any Date Easily"
- 清晰的视觉层次
- 确保文字在缩略图中可读

---

### 2. Logo (PNG)
**文件名：** `logo.png`  
**尺寸：** 512 x 512 px  
**格式：** PNG（透明背景）  
**用途：** Organization Schema, 社交媒体

**设计要求：**
- 日历图标 + 渐变
- 可缩放到小尺寸（48x48）时仍清晰
- 与 favicon.svg 风格一致

---

### 3. PWA 图标 (小)
**文件名：** `icon-192.png`  
**尺寸：** 192 x 192 px  
**格式：** PNG  
**用途：** PWA 安装图标、Android

**设计要求：**
- 与 logo.png 相同设计
- 周围留白 10%（安全区域）
- 适合作为应用图标

---

### 4. PWA 图标 (大)
**文件名：** `icon-512.png`  
**尺寸：** 512 x 512 px  
**格式：** PNG  
**用途：** PWA 安装图标、高分辨率设备

**设计要求：**
- 与 icon-192.png 相同设计
- 高清晰度
- 周围留白 10%

---

### 5. Apple Touch Icon
**文件名：** `apple-touch-icon.png`  
**尺寸：** 180 x 180 px  
**格式：** PNG  
**用途：** iOS/macOS 添加到主屏幕

**设计要求：**
- 与 logo.png 相同设计
- iOS 会自动添加圆角，所以设计应填满整个画布
- 不需要透明背景（使用白色或品牌色）

---

### 6. 截图 - 移动端
**文件名：** `screenshot-mobile.png`  
**尺寸：** 390 x 844 px（iPhone 标准尺寸）  
**格式：** PNG  
**用途：** PWA manifest, 应用商店

**内容：**
- 实际应用截图
- 显示首页或日期计算页面
- 清晰的 UI 展示

---

### 7. 截图 - 桌面端
**文件名：** `screenshot-desktop.png`  
**尺寸：** 1920 x 1080 px  
**格式：** PNG  
**用途：** PWA manifest, 营销材料

**内容：**
- 实际应用截图
- 显示完整的首页布局
- 展示主要功能

---

## 🎨 设计工具推荐

### 选项 1: Figma（推荐）
- 专业设计工具
- 支持协作
- 导出多种格式
- 免费版足够使用

**Figma 模板：**
- 创建 1200x630 画布（OG 图片）
- 创建 512x512 画布（Logo）
- 使用渐变：#D946EF → #8B5CF6 → #0069FF

### 选项 2: Canva
- 简单易用
- 提供模板
- 免费版可用
- 适合快速制作

**Canva 搜索：**
- "Social Media Banner"（用于 OG 图片）
- "Logo"（用于品牌 Logo）

### 选项 3: Adobe Express
- Adobe 在线工具
- 高质量模板
- 免费账号可用

---

## 🚀 快速创建方案

### 方案 A：使用 AI 工具生成
使用 Midjourney、DALL-E 或 Stable Diffusion：

**Prompt 示例：**
```
Modern gradient calendar icon, purple to pink to blue gradient,
minimalist design, flat style, transparent background,
for date calculator app, professional, clean
```

### 方案 B：在线图片生成工具
- **OG Image Generator:** https://www.opengraph.xyz/
- **PWA Asset Generator:** https://www.pwabuilder.com/imageGenerator

### 方案 C：使用代码生成（Node.js）
创建一个 Node.js 脚本使用 Canvas 或 Sharp 库自动生成所有图片。

---

## ✅ 当前状态

- [x] `favicon.svg` - 已创建（矢量图标）
- [ ] `og-image.png` - 待创建
- [ ] `logo.png` - 待创建
- [ ] `icon-192.png` - 待创建
- [ ] `icon-512.png` - 待创建
- [ ] `apple-touch-icon.png` - 待创建
- [ ] `screenshot-mobile.png` - 待创建（可选）
- [ ] `screenshot-desktop.png` - 待创建（可选）

---

## 📝 优先级

### 高优先级（SEO 必需）
1. **og-image.png** - 社交媒体分享
2. **logo.png** - Organization Schema
3. **icon-192.png** - PWA 基本图标
4. **icon-512.png** - PWA 基本图标

### 中优先级（用户体验）
5. **apple-touch-icon.png** - iOS 用户
6. **screenshot-mobile.png** - PWA 安装体验
7. **screenshot-desktop.png** - PWA 安装体验

---

## 💡 临时方案

在专业设计完成前，可以使用 favicon.svg 转换为 PNG：

```bash
# 使用 ImageMagick 或在线转换工具
# 将 favicon.svg 转换为不同尺寸的 PNG
```

或者使用纯色占位图：
- 背景：品牌渐变
- 文字：白色 "DFT" 或 "📅"
- 简洁、清晰、可识别

---

## 🎯 下一步

1. 选择设计工具
2. 创建品牌 Logo
3. 生成所有尺寸的图片
4. 测试图片在各平台的显示效果
5. 优化图片大小（压缩）

**工具推荐：** TinyPNG (https://tinypng.com/) 用于压缩

