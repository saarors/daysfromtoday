# 🚀 Obsidian 项目集成配置指南

## 🎯 **新的文件结构**

Obsidian 现在直接集成在项目目录中，无需单独的 vault：

```
daysfromtoday/
├── obsidian/                    # Obsidian 工作目录
│   ├── templates/              # 文章模板
│   │   ├── blog-template.md
│   │   ├── philosophy-template.md
│   │   ├── tools-template.md
│   │   ├── stories-template.md
│   │   ├── guides-template.md
│   │   └── updates-template.md
│   ├── content/               # 内容创作目录
│   │   ├── blog/
│   │   │   ├── en/           # 英文博客
│   │   │   └── zh/           # 中文博客
│   │   ├── philosophy/
│   │   │   ├── en/           # 英文哲学
│   │   │   └── zh/           # 中文哲学
│   │   ├── tools/
│   │   │   ├── en/           # 英文工具
│   │   │   └── zh/           # 中文工具
│   │   ├── stories/
│   │   │   ├── en/           # 英文故事
│   │   │   └── zh/           # 中文故事
│   │   ├── guides/
│   │   │   ├── en/           # 英文指南
│   │   │   └── zh/           # 中文指南
│   │   └── updates/
│   │       ├── en/           # 英文更新
│   │       └── zh/           # 中文更新
│   └── images/               # 图片资源
├── content/                   # 项目内容目录 (自动同步)
│   ├── blog/
│   ├── philosophy/
│   ├── tools/
│   ├── stories/
│   ├── guides/
│   └── updates/
└── app/api/upload-image/     # 图片上传 API
```

## 🔧 **步骤 1: 配置 Obsidian Vault**

### 设置 Vault 位置

1. 打开 Obsidian
2. 选择 "Open folder as vault"
3. 选择项目目录：`/Users/leonmini/quantum-era/daysfromtoday`
4. 点击 "Open"

### 配置 Vault 设置

1. 进入 `Settings` → `Files & Links`
2. 设置：
   - **New link format**: `Shortest path when possible`
   - **Use [[Wikilinks]]**: 启用
   - **Automatically update internal links**: 启用

## 🎨 **步骤 2: 安装必需插件**

### 插件列表

1. **Templater** (社区插件)
   - 功能：动态模板系统
   - 用途：文章模板和元数据自动填充

2. **Image Uploader** (社区插件)
   - 功能：图片自动上传
   - 用途：拖拽图片到 R2 CDN

### 安装步骤

1. 进入 `Settings` → `Community plugins`
2. 点击 `Browse` 搜索并安装上述插件
3. 启用所有安装的插件

## 🎨 **步骤 3: 配置 Templater**

1. 进入 `Settings` → `Templater`
2. 设置模板文件夹：`obsidian/templates`
3. 启用自动跳转光标
4. 配置模板热键：`Ctrl+T` (Windows) 或 `Cmd+T` (Mac)

## 🖼️ **步骤 4: 配置 Image Uploader**

1. 进入 `Settings` → `Image Uploader`
2. 配置上传设置：
   - **Upload Service**: Custom
   - **Upload URL**: `http://localhost:3000/api/upload-image`
   - **Image Path**: `obsidian/images/`
   - **Image Name**: `<% tp.file.title %>-<% tp.date.now("YYYYMMDDHHmmss") %>`

## 🎯 **步骤 5: 工作流程**

### 创建新文章

1. 在 Obsidian 中按 `Ctrl+T` (Windows) 或 `Cmd+T` (Mac)
2. 选择对应的模板：
   - `blog-template.md` - 博客文章
   - `philosophy-template.md` - 哲学思考
   - `tools-template.md` - 工具介绍
   - `stories-template.md` - 故事分享
   - `guides-template.md` - 使用指南
   - `updates-template.md` - 更新日志

3. 选择保存位置：
   - 英文内容：`obsidian/content/[类型]/en/`
   - 中文内容：`obsidian/content/[类型]/zh/`

### 插入图片

1. 直接拖拽图片到文章中
2. 图片会自动上传到 R2 CDN
3. 链接会自动更新为 CDN URL

### 同步到项目

1. 将完成的文章复制到项目 `content/` 目录：
   ```bash
   # 示例：复制博客文章
   cp obsidian/content/blog/en/my-article.md content/blog/en/
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 访问文章页面验证效果

## 🔄 **步骤 6: 自动化同步脚本**

创建同步脚本来自动化内容同步：

```bash
#!/bin/bash
# sync-content.sh

echo "🔄 同步 Obsidian 内容到项目目录..."

# 同步博客文章
rsync -av --delete obsidian/content/blog/ content/blog/

# 同步哲学文章
rsync -av --delete obsidian/content/philosophy/ content/philosophy/

# 同步工具文章
rsync -av --delete obsidian/content/tools/ content/tools/

# 同步故事文章
rsync -av --delete obsidian/content/stories/ content/stories/

# 同步指南文章
rsync -av --delete obsidian/content/guides/ content/guides/

# 同步更新日志
rsync -av --delete obsidian/content/updates/ content/updates/

echo "✅ 内容同步完成！"
```

### 使用同步脚本

1. 将脚本保存为 `sync-content.sh`
2. 添加执行权限：`chmod +x sync-content.sh`
3. 运行同步：`./sync-content.sh`

## 🧪 **步骤 7: 测试工作流**

### 测试步骤

1. **创建测试文章**：
   - 使用博客模板创建一篇测试文章
   - 标题：`test-obsidian-integration`
   - 保存到：`obsidian/content/blog/en/`

2. **插入测试图片**：
   - 拖拽一张图片到文章中
   - 确认图片上传到 R2 CDN

3. **同步内容**：
   - 运行同步脚本或手动复制
   - 检查 `content/blog/en/` 目录

4. **验证结果**：
   - 启动开发服务器：`npm run dev`
   - 访问测试文章页面
   - 确认图片正常显示

## 🎉 **完成！**

配置完成后，你就可以：

- 在项目目录中直接使用 Obsidian
- 使用模板快速创建文章
- 拖拽图片自动上传到 CDN
- 自动同步内容到项目目录
- 享受流畅的创作体验

## 🔧 **故障排除**

### 常见问题

1. **图片上传失败**：
   - 确认开发服务器正在运行 (`npm run dev`)
   - 检查 R2 环境变量配置
   - 确认网络连接正常

2. **模板不工作**：
   - 确认 Templater 插件已启用
   - 检查模板路径设置
   - 重启 Obsidian

3. **同步失败**：
   - 检查文件路径是否正确
   - 确认有写入权限
   - 检查 rsync 是否安装

## 📚 **优势**

### 集成优势

1. **统一管理**：所有内容都在项目目录中
2. **版本控制**：可以直接使用 Git 管理内容
3. **团队协作**：团队成员可以共享同一个 vault
4. **自动化**：更容易实现自动化工作流
5. **部署友好**：内容直接在生产环境中

### 工作流优势

1. **快速创作**：模板系统加速内容创建
2. **图片管理**：自动上传到 CDN
3. **多语言支持**：中英文内容分离
4. **类型分类**：不同类型内容有专门模板
5. **SEO 友好**：自动生成元数据

---

*现在你可以在项目目录中直接使用 Obsidian 进行高效的内容创作了！* 🚀

