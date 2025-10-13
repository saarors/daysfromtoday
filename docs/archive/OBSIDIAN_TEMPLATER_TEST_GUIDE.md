# 🧪 Obsidian Templater 测试指南

## 🔍 **配置检查**

根据你的截图，Templater 配置看起来很好！以下是关键配置的检查：

### ✅ **已正确配置的项目**

1. **Template Folder Location**: `obsidian/templates` ✅
2. **Syntax Highlighting**: 桌面端已启用 ✅
3. **Automatic Jump to Cursor**: 已启用 ✅
4. **Trigger Templater on New File Creation**: 已启用 ✅
5. **Folder Templates**: 已启用 ✅
6. **File Regex Templates**: 已禁用（正确，与 Folder Templates 互斥）✅

### ⚠️ **需要配置的项目**

1. **Folder Templates**: 目前没有配置具体的文件夹模板规则
2. **Template Hotkeys**: 没有配置快捷键
3. **Startup Templates**: 没有配置启动模板

## 🧪 **测试步骤**

### **步骤 1: 配置文件夹模板规则**

1. **打开 Templater 设置**
2. **在 "Folder Templates" 部分，点击 "Add new folder template"**
3. **配置以下规则**：

   **规则 1: 博客文章模板**
   - **Folder Path**: `obsidian/content/blog/en`
   - **Template Path**: `blog-template`

   **规则 2: 中文博客文章模板**
   - **Folder Path**: `obsidian/content/blog/zh`
   - **Template Path**: `blog-template`

   **规则 3: 哲学文章模板**
   - **Folder Path**: `obsidian/content/philosophy/en`
   - **Template Path**: `philosophy-template`

   **规则 4: 中文哲学文章模板**
   - **Folder Path**: `obsidian/content/philosophy/zh`
   - **Template Path**: `philosophy-template`

   **规则 5: 工具文章模板**
   - **Folder Path**: `obsidian/content/tools/en`
   - **Template Path**: `tools-template`

   **规则 6: 中文工具文章模板**
   - **Folder Path**: `obsidian/content/tools/zh`
   - **Template Path**: `tools-template`

### **步骤 2: 测试模板功能**

#### **测试 1: 手动插入模板**

1. **创建新文件**：
   - 在 Obsidian 中按 `Ctrl/Cmd + N` 创建新文件
   - 保存到 `obsidian/content/blog/en/` 目录
   - 文件名：`test-manual-template.md`

2. **手动插入模板**：
   - 按 `Ctrl/Cmd + P` 打开命令面板
   - 输入 "Templater: Insert template"
   - 选择 `blog-template`
   - 观察模板是否正确插入

3. **验证结果**：
   - 检查 Frontmatter 是否正确填充
   - 检查日期格式是否正确
   - 检查光标是否跳转到 `tp.file.cursor()` 位置

#### **测试 2: 自动触发模板**

1. **创建新文件**：
   - 在 `obsidian/content/blog/en/` 目录下创建新文件
   - 文件名：`test-auto-template.md`

2. **观察自动填充**：
   - 如果配置正确，Templater 应该自动填充模板内容
   - 检查是否触发了 "Trigger Templater on new file creation"

3. **验证结果**：
   - 检查文件是否自动填充了模板内容
   - 检查 Frontmatter 是否正确

#### **测试 3: 不同内容类型测试**

1. **测试博客文章**：
   - 在 `obsidian/content/blog/en/` 创建文件
   - 在 `obsidian/content/blog/zh/` 创建文件

2. **测试哲学文章**：
   - 在 `obsidian/content/philosophy/en/` 创建文件
   - 在 `obsidian/content/philosophy/zh/` 创建文件

3. **测试工具文章**：
   - 在 `obsidian/content/tools/en/` 创建文件
   - 在 `obsidian/content/tools/zh/` 创建文件

### **步骤 3: 测试 Templater 语法**

#### **测试日期函数**

在模板中测试以下语法：

```markdown
---
title: "测试文章"
date: "<% tp.date.now("YYYY-MM-DDTHH:mm:ssZ") %>"
author: "Leon"
category: "Blog"
tags: ["test"]
featured: false
image: ""
locale: "en"
---

# 测试文章

创建时间：<% tp.date.now("YYYY-MM-DD HH:mm:ss") %>
文件路径：<% tp.file.path() %>
文件标题：<% tp.file.title %>
```

#### **测试文件信息函数**

```markdown
## 文件信息

- 文件名：<% tp.file.title %>
- 文件路径：<% tp.file.path() %>
- 父文件夹：<% tp.file.folder(true) %>
- 创建时间：<% tp.date.now("YYYY-MM-DD") %>
```

### **步骤 4: 测试图片上传集成**

1. **创建测试文章**：
   - 使用模板创建新文章
   - 保存到 `obsidian/content/blog/en/` 目录

2. **测试图片上传**：
   - 拖拽图片到文章中
   - 观察 Image Uploader 是否自动上传
   - 检查图片链接是否更新为 CDN URL

3. **验证结果**：
   - 图片链接应该类似：`https://cdn.daysfromtoday.ai/images/blog/en/xxx.jpg`
   - 在浏览器中访问该链接应该能正常显示图片

## 🔧 **故障排除**

### **常见问题**

1. **模板不自动填充**：
   - 检查 "Trigger Templater on new file creation" 是否启用
   - 检查 "Folder Templates" 是否配置正确
   - 重启 Obsidian

2. **模板语法不工作**：
   - 检查 "Syntax Highlighting" 是否启用
   - 检查模板文件是否存在
   - 检查语法是否正确

3. **图片上传失败**：
   - 检查 Image Uploader 配置
   - 检查开发服务器是否运行
   - 检查 R2 配置

### **调试步骤**

1. **检查模板文件**：
   ```bash
   ls -la obsidian/templates/
   ```

2. **检查内容目录**：
   ```bash
   ls -la obsidian/content/
   ```

3. **测试开发服务器**：
   ```bash
   npm run dev
   ```

## 📋 **测试检查清单**

- [ ] Templater 插件已安装并启用
- [ ] 模板文件夹路径正确：`obsidian/templates`
- [ ] 文件夹模板规则已配置
- [ ] 手动插入模板功能正常
- [ ] 自动触发模板功能正常
- [ ] 不同内容类型模板工作正常
- [ ] Templater 语法功能正常
- [ ] 图片上传集成正常
- [ ] 开发服务器运行正常

## 🎉 **完成测试后**

测试完成后，你就可以：

1. **高效创建内容**：使用模板快速创建各种类型的文章
2. **自动化工作流**：新文件自动填充模板内容
3. **图片管理**：拖拽图片自动上传到 CDN
4. **内容同步**：运行 `npm run content:sync` 同步到项目

---

*配置完成后，你就可以享受高效的内容创作体验了！* 🚀

