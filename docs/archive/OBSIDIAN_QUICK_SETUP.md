# 🚀 Obsidian 快速配置指南

## ✅ **前置条件完成**

- ✅ R2 存储桶配置完成
- ✅ CDN 自定义域名正常
- ✅ 图片上传 API 测试成功
- ✅ Obsidian 目录结构已创建
- ✅ 文章模板已创建

## 🔧 **步骤 1: 安装 Obsidian 插件**

### 必需插件列表

1. **Templater** (社区插件)
   - 功能：动态模板系统
   - 用途：文章模板和元数据自动填充

2. **Image Uploader** (社区插件)
   - 功能：图片自动上传
   - 用途：拖拽图片到 R2 CDN

### 安装步骤

1. 打开 Obsidian
2. 进入 `Settings` → `Community plugins`
3. 点击 `Browse` 搜索并安装上述插件
4. 启用所有安装的插件

## 🎨 **步骤 2: 配置 Templater**

1. 进入 `Settings` → `Templater`
2. 设置模板文件夹：`00-Templates`
3. 启用自动跳转光标

## 🖼️ **步骤 3: 配置 Image Uploader**

1. 进入 `Settings` → `Image Uploader`
2. 配置上传设置：
   - **Upload Service**: Custom
   - **Upload URL**: `http://localhost:3000/api/upload-image`
   - **Image Path**: `99-Images/<% tp.file.folder(true) %>/`
   - **Image Name**: `<% tp.file.title %>-<% tp.date.now("YYYYMMDDHHmmss") %>`

## 🎯 **步骤 4: 测试工作流**

### 创建测试文章

1. 在 Obsidian 中按 `Ctrl+P` (Windows) 或 `Cmd+P` (Mac)
2. 输入 "Templater: Create new note from template"
3. 选择 `Blog-Template.md`
4. 输入标题：`test-obsidian-workflow`

### 插入测试图片

1. 拖拽一张图片到文章中
2. 图片会自动上传到 R2 CDN
3. 链接会自动更新为 CDN URL

### 同步内容

1. 将文章复制到项目目录：
   ```bash
   cp ~/Obsidian/DaysFromToday/01-Blog/en/test-obsidian-workflow.md ~/quantum-era/daysfromtoday/content/blog/en/
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 访问测试文章页面验证

## 📁 **目录结构说明**

```
~/Obsidian/DaysFromToday/
├── 00-Templates/           # 模板目录 ✅
│   ├── Blog-Template.md    # 博客模板 ✅
│   ├── Philosophy-Template.md # 哲学模板 ✅
│   └── Tools-Template.md   # 工具模板 ✅
├── 01-Blog/               # 博客文章 ✅
│   ├── en/               # 英文文章 ✅
│   └── zh/               # 中文文章 ✅
├── 02-Philosophy/         # 哲学思考 ✅
├── 03-Tools/              # 工具介绍 ✅
├── 04-Stories/            # 故事分享 ✅
├── 05-Guides/             # 使用指南 ✅
├── 06-Updates/            # 更新日志 ✅
└── 99-Images/             # 图片资源 ✅
```

## 🎉 **完成！**

配置完成后，你就可以：
- 在 Obsidian 中快速创建文章
- 拖拽图片自动上传到 CDN
- 享受流畅的内容创作体验

## 🔧 **故障排除**

### 常见问题

1. **图片上传失败**：
   - 确认开发服务器正在运行 (`npm run dev`)
   - 检查 R2 环境变量配置
   - 确认网络连接正常

2. **模板不工作**：
   - 确认 Templater 插件已启用
   - 检查模板语法是否正确
   - 重启 Obsidian

3. **同步失败**：
   - 检查文件路径是否正确
   - 确认有写入权限

## 📚 **下一步**

1. 安装并配置 Obsidian 插件
2. 测试文章创建和图片上传
3. 开始内容创作
4. 享受高效的工作流程

---

*配置完成后，你就可以开始高效的内容创作了！* 🚀

