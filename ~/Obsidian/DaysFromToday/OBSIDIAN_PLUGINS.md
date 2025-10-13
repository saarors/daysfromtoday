# 🔌 Obsidian 插件配置指南

## 📦 必需插件

### 1. **Templater** (必需)
- **功能**: 动态模板系统
- **用途**: 自动生成文章 frontmatter
- **安装步骤**:
  1. 打开 Obsidian
  2. 进入 Settings → Community plugins
  3. 点击 "Browse" 搜索 "Templater"
  4. 安装并启用
  5. 在 Templater 设置中，设置模板文件夹为 `00-Templates`

### 2. **Image Toolkit** (推荐)
- **功能**: 图片预览和编辑
- **用途**: 查看图片、调整大小
- **安装步骤**:
  1. 搜索 "Image Toolkit"
  2. 安装并启用
  3. 在设置中启用 "Enable image toolkit"

### 3. **Paste Image Rename** (推荐)
- **功能**: 粘贴图片时自动重命名
- **用途**: 保持图片名称规范
- **安装步骤**:
  1. 搜索 "Paste Image Rename"
  2. 安装并启用
  3. 设置重命名格式：`{{title}}-{{date:YYYY-MM-DD}}-{{index}}`

### 4. **Advanced Tables** (推荐)
- **功能**: 表格编辑增强
- **用途**: 更好的表格编辑体验
- **安装步骤**:
  1. 搜索 "Advanced Tables"
  2. 安装并启用

### 5. **Markdown Table Editor** (可选)
- **功能**: 可视化表格编辑
- **用途**: 复杂表格编辑
- **安装步骤**:
  1. 搜索 "Markdown Table Editor"
  2. 安装并启用

## ⚙️ 插件配置

### Templater 配置
1. 打开 Templater 设置
2. 设置模板文件夹：`00-Templates`
3. 启用 "Enable System Commands"
4. 启用 "Enable JavaScript"

### Image Toolkit 配置
1. 打开 Image Toolkit 设置
2. 启用 "Enable image toolkit"
3. 设置图片预览大小：800px
4. 启用 "Show image title"

### Paste Image Rename 配置
1. 打开 Paste Image Rename 设置
2. 设置重命名格式：`{{title}}-{{date:YYYY-MM-DD}}-{{index}}`
3. 启用 "Auto rename on paste"
4. 设置图片保存路径：`images/`

## 🎯 使用技巧

### 创建新文章
1. 按 `Ctrl+P` 打开命令面板
2. 输入 "Templater: Create new note from template"
3. 选择对应的文章模板
4. 填写模板变量

### 插入图片
1. 拖拽图片到文章编辑区域
2. 图片自动保存到 `images/` 文件夹
3. 链接自动生成

### 表格编辑
1. 使用 `|` 创建表格
2. 按 `Tab` 键快速编辑
3. 使用 Advanced Tables 插件增强功能

## 🔧 故障排除

### 插件无法安装
- 检查网络连接
- 重启 Obsidian
- 检查插件兼容性

### 模板无法使用
- 检查 Templater 插件是否启用
- 检查模板文件夹路径是否正确
- 检查模板语法是否正确

### 图片无法显示
- 检查图片路径是否正确
- 检查图片文件是否存在
- 检查图片格式是否支持

