# 🖼️ Obsidian Image Uploader 配置指南

## 🎯 **配置目标**

将 Obsidian 的 Image Uploader 插件配置为使用我们的项目 API，实现图片自动上传到 Cloudflare R2 CDN。

## 🔧 **详细配置步骤**

### 1. **打开 Image Uploader 设置**

1. 打开 Obsidian
2. 进入 `Settings` → `Community plugins` → `Image Uploader`
3. 确保插件已启用

### 2. **配置上传参数**

根据你的截图界面，按以下方式配置：

#### **Api Endpoint**
```
http://localhost:3000/api/upload-image
```
*说明：这是我们项目中创建的图片上传 API 端点*

#### **Upload Header**
```json
{
  "Content-Type": "multipart/form-data"
}
```
*说明：指定请求内容类型为 multipart/form-data*

#### **Upload Body**
```json
{
  "file": "$FILE",
  "category": "<% tp.file.folder(true) %>",
  "locale": "<% tp.file.folder(true) %>"
}
```
*说明：*
- `$FILE` 是插件自动替换的图片文件
- `category` 和 `locale` 用于确定图片在 R2 上的存储路径
- `<% tp.file.folder(true) %>` 是 Templater 语法，获取当前文件的父文件夹名

#### **Image Url Path**
```
obsidian/images/<% tp.file.folder(true) %>/
```
*说明：这是 Obsidian 在 Markdown 文件中插入图片链接时使用的相对路径*

#### **Enable Resize**
根据你的需求开启或关闭
- **开启**：上传前自动缩放图片
- **关闭**：保持原始图片尺寸

## 🎨 **配置说明**

### **工作原理**

1. **拖拽图片**：在 Obsidian 中拖拽图片到 Markdown 文件
2. **自动上传**：插件将图片发送到我们的 API
3. **R2 存储**：API 将图片上传到 Cloudflare R2
4. **CDN 链接**：返回 CDN URL 并替换原始链接
5. **路径管理**：根据文章类型和语言自动组织图片路径

### **路径结构示例**

假设你在 `obsidian/content/blog/en/` 目录下创建文章：

- **图片存储路径**：`images/blog/en/unique-filename.jpg`
- **CDN 访问 URL**：`https://cdn.daysfromtoday.ai/images/blog/en/unique-filename.jpg`
- **Obsidian 链接**：`obsidian/images/en/unique-filename.jpg`

## 🧪 **测试配置**

### 1. **启动开发服务器**
```bash
npm run dev
```

### 2. **创建测试文章**
1. 在 Obsidian 中使用博客模板创建文章
2. 保存到 `obsidian/content/blog/en/` 目录
3. 标题：`test-image-upload`

### 3. **测试图片上传**
1. 拖拽一张图片到文章中
2. 观察图片链接是否自动更新为 CDN URL
3. 检查图片是否能在浏览器中正常访问

### 4. **验证结果**
- 图片链接应该类似：`https://cdn.daysfromtoday.ai/images/blog/en/xxx.jpg`
- 在浏览器中访问该链接应该能正常显示图片

## 🔧 **故障排除**

### 常见问题

1. **图片上传失败**
   - 确认开发服务器正在运行 (`npm run dev`)
   - 检查 API 端点是否正确
   - 确认网络连接正常

2. **图片链接不正确**
   - 检查 "Image Url Path" 配置
   - 确认 Templater 语法是否正确
   - 重启 Obsidian

3. **图片无法访问**
   - 确认 R2 配置正确
   - 检查 CDN 域名是否正常
   - 验证图片是否成功上传到 R2

### 调试步骤

1. **检查 API 响应**
   - 打开浏览器开发者工具
   - 查看网络请求是否成功
   - 检查 API 返回的响应

2. **验证 R2 配置**
   ```bash
   npm run images:check-r2
   ```

3. **测试图片上传**
   ```bash
   npm run images:test
   ```

## 📋 **配置检查清单**

- [ ] Image Uploader 插件已安装并启用
- [ ] Api Endpoint 设置为 `http://localhost:3000/api/upload-image`
- [ ] Upload Header 配置正确
- [ ] Upload Body 包含必要的字段
- [ ] Image Url Path 使用 Templater 语法
- [ ] 开发服务器正在运行
- [ ] R2 配置正确
- [ ] 测试图片上传成功

## 🎉 **完成！**

配置完成后，你就可以：

1. **拖拽图片**：直接拖拽图片到 Obsidian 文章中
2. **自动上传**：图片自动上传到 R2 CDN
3. **链接替换**：原始链接自动替换为 CDN URL
4. **路径管理**：根据文章类型和语言自动组织图片

## 📚 **相关文档**

- `OBSIDIAN_PROJECT_SETUP.md` - Obsidian 项目集成配置指南
- `R2_SETUP_SUCCESS.md` - R2 配置成功总结
- `PROJECT_STRUCTURE_FINAL.md` - 项目最终结构

---

*配置完成后，你就可以享受流畅的图片上传体验了！* 🚀

