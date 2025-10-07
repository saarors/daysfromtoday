# Cursor 环境 CLI 工具配置指南

**文档版本：** v1.0  
**最后更新：** 2025-01-07  
**适用项目：** daysfromtoday  
**环境：** macOS (darwin 25.0.0) + Cursor

---

## 📋 目录

1. [已安装的 CLI 工具](#已安装的-cli-工具)
2. [核心工具详解](#核心工具详解)
3. [常用命令速查](#常用命令速查)
4. [CLI vs Web UI 对比](#cli-vs-web-ui-对比)
5. [最佳实践](#最佳实践)
6. [故障排查](#故障排查)

---

## 📦 已安装的 CLI 工具

### **版本信息（当前环境）**

| 工具 | 版本 | 路径 | 用途 |
|------|------|------|------|
| **Vercel CLI** | 48.2.3 | `/Users/leonmini/.n/bin/vercel` | 部署到 Vercel |
| **Git** | 2.50.1 | `/usr/bin/git` | 版本控制 |
| **Node.js** | 22.20.0 | `/Users/leonmini/.n/bin/node` | JavaScript 运行时 |
| **npm** | 11.6.1 | `/Users/leonmini/.local/npm-global/bin/npm` | 包管理器 |
| **npx** | 11.6.1 | `/Users/leonmini/.local/npm-global/bin/npx` | 执行 npm 包 |
| **curl** | 系统自带 | `/usr/bin/curl` | HTTP 请求测试 |
| **grep** | 系统自带 | `/usr/bin/grep` | 文本搜索 |

---

## 🛠 核心工具详解

### 1. Vercel CLI

**用途：** 直接从命令行部署和管理 Vercel 项目

**安装：**
```bash
npm i -g vercel
```

**登录：**
```bash
vercel login
```

**核心命令：**

#### 部署到生产环境
```bash
# 标准部署
vercel --prod

# 强制重新构建（不使用缓存）
vercel --prod --force

# 非交互式部署（CI/CD 环境）
vercel --prod --force --yes
```

#### 查看部署日志
```bash
# 查看最新部署的日志
vercel logs <deployment-url>

# 实时查看日志
vercel logs --follow
```

#### 查看部署信息
```bash
# 查看部署详情
vercel inspect <deployment-url>

# 列出所有部署
vercel ls
```

#### 环境变量管理
```bash
# 添加环境变量
vercel env add NEXT_PUBLIC_GA_ID

# 列出环境变量
vercel env ls

# 删除环境变量
vercel env rm NEXT_PUBLIC_GA_ID
```

**优势（vs Vercel Web UI）：**
- ✅ **可靠性高**：直接控制部署过程，不受 Git 集成问题影响
- ✅ **速度快**：跳过 webhook 触发，立即开始构建
- ✅ **可控性强**：可以选择是否使用缓存、是否强制重建
- ✅ **易于调试**：实时查看构建日志
- ✅ **可自动化**：适合 CI/CD 流程

**本项目中的应用：**
- ✅ 解决了 Vercel Web UI 部署同步问题
- ✅ 强制清除缓存部署：`vercel --prod --force`
- ✅ 绕过 Git 集成问题，直接部署最新代码

---

### 2. Git

**用途：** 版本控制和代码协作

**核心配置：**
```bash
# 配置用户信息（重要！Vercel CLI 会检查）
git config --global user.email "leeleon2020@gmail.com"
git config --global user.name "leeleon"

# 查看配置
git config --global --list
```

**核心命令：**

#### 基本操作
```bash
# 查看状态
git status

# 暂存所有更改
git add -A

# 提交（遵循 Conventional Commits）
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复 bug"
git commit -m "chore: 清理代码"
git commit -m "docs: 更新文档"

# 推送到远程
git push origin main
```

#### 空提交（触发部署）
```bash
# 创建空提交以触发 CI/CD
git commit --allow-empty -m "deploy: 触发部署"
git push origin main
```

#### 查看历史
```bash
# 查看最近的 commit
git log --oneline -5

# 查看当前 commit
git rev-parse --short HEAD
```

**优势（vs Web UI）：**
- ✅ **速度快**：本地操作，无需等待页面加载
- ✅ **批量操作**：一次提交多个文件
- ✅ **精确控制**：可以选择性暂存、修改 commit 信息
- ✅ **历史回溯**：快速查看和回退版本

**本项目中的应用：**
- ✅ 配置正确的 Git author 信息（解决 Vercel CLI 权限问题）
- ✅ 遵循 Conventional Commits 规范
- ✅ 使用空 commit 触发部署

---

### 3. npm / npx

**用途：** Node.js 包管理和执行

**核心命令：**

#### 包管理
```bash
# 安装项目依赖
npm install

# 安装全局包
npm i -g <package-name>

# 安装开发依赖
npm i -D <package-name>

# 更新依赖
npm update
```

#### 项目构建
```bash
# 本地开发（热重载）
npm run dev

# 生产构建（检查 linter 错误）
npm run build

# 启动生产服务器
npm start

# 运行 linter
npm run lint
```

#### npx（执行 npm 包）
```bash
# 运行 Next.js
npx next dev

# 创建 Next.js 项目
npx create-next-app@latest

# 运行一次性脚本（不全局安装）
npx <package-name>
```

**优势（vs Web UI）：**
- ✅ **本地验证**：部署前在本地运行 `npm run build` 检查错误
- ✅ **快速迭代**：`npm run dev` 热重载，即时查看更改
- ✅ **依赖管理**：快速安装和更新依赖

**本项目中的应用：**
- ✅ 本地构建验证（修复 ESLint 错误）
- ✅ 开发环境热重载
- ✅ 依赖安装和管理

---

### 4. curl

**用途：** HTTP 请求测试和网站验证

**核心命令：**

#### 检查 HTTP 状态
```bash
# 查看响应头（不下载内容）
curl -I https://www.daysfromtoday.ai

# 查看完整响应（包括重定向）
curl -sI https://www.daysfromtoday.ai

# 跟随重定向
curl -L https://www.daysfromtoday.ai
```

#### 验证 SEO 配置
```bash
# 检查 Sitemap
curl -s https://www.daysfromtoday.ai/sitemap.xml | head -30

# 检查 Robots.txt
curl -s https://www.daysfromtoday.ai/robots.txt

# 检查 Canonical 标签
curl -s https://www.daysfromtoday.ai/en | grep canonical

# 检查 Hreflang
curl -s https://www.daysfromtoday.ai/en | grep hreflang

# 检查 GA 脚本
curl -s https://www.daysfromtoday.ai/en | grep gtag
```

#### 检查部署版本（chunk hash）
```bash
# 检查 layout chunk hash（验证新代码是否部署）
curl -s https://www.daysfromtoday.ai/en | grep -o 'layout-[a-f0-9]\+\.js'
```

**优势（vs 浏览器）：**
- ✅ **快速验证**：无需打开浏览器，秒级获取结果
- ✅ **自动化**：可以编写脚本批量检查
- ✅ **精确控制**：只获取需要的信息
- ✅ **无缓存干扰**：每次都是新鲜请求

**本项目中的应用：**
- ✅ 验证所有 SEO 配置（Canonical, Hreflang, OG, Schema）
- ✅ 检查部署是否成功（chunk hash 验证）
- ✅ 测试重定向和状态码

---

### 5. grep

**用途：** 文本搜索和过滤

**核心命令：**

#### 基本搜索
```bash
# 在文件中搜索
grep "pattern" file.txt

# 在多个文件中搜索
grep "pattern" *.txt

# 递归搜索目录
grep -r "pattern" ./src

# 忽略大小写
grep -i "pattern" file.txt
```

#### 与其他命令组合
```bash
# 在 curl 结果中搜索
curl -s https://example.com | grep "keyword"

# 搜索并显示行号
grep -n "pattern" file.txt

# 搜索并显示前后文
grep -C 3 "pattern" file.txt

# 反向搜索（不包含）
grep -v "pattern" file.txt
```

**优势（vs GUI 搜索）：**
- ✅ **速度快**：处理大文件非常高效
- ✅ **正则表达式**：强大的模式匹配
- ✅ **管道组合**：与其他命令无缝集成
- ✅ **批量操作**：一次搜索多个文件

**本项目中的应用：**
- ✅ 验证 SEO 标签是否存在
- ✅ 检查部署版本（chunk hash）
- ✅ 搜索日志和配置文件

---

## 🚀 常用命令速查

### **开发流程（完整）**

```bash
# 1. 本地开发
npm run dev

# 2. 本地构建验证（重要！）
npm run build

# 3. 提交代码
git add -A
git commit -m "feat: 描述你的更改"
git push origin main

# 4. 部署到 Vercel（推荐使用 CLI）
vercel --prod --force

# 5. 验证部署
curl -I https://www.daysfromtoday.ai/en
curl -s https://www.daysfromtoday.ai/en | grep -o 'layout-[a-f0-9]\+\.js'
```

---

### **SEO 验证速查（一键脚本）**

创建一个快速验证脚本：

```bash
# 保存为 scripts/verify-seo.sh
#!/bin/bash

echo "=== SEO 验证报告 ==="
echo ""

echo "1. 主域名重定向:"
curl -sI https://www.daysfromtoday.ai | grep -E "(HTTP|location)"

echo ""
echo "2. Sitemap:"
curl -s https://www.daysfromtoday.ai/sitemap.xml | head -5

echo ""
echo "3. Robots.txt:"
curl -s https://www.daysfromtoday.ai/robots.txt

echo ""
echo "4. Canonical:"
curl -s https://www.daysfromtoday.ai/en | grep -o '<link rel="canonical"[^>]*>'

echo ""
echo "5. Hreflang:"
curl -s https://www.daysfromtoday.ai/en | grep -o '<link rel="alternate" hrefLang[^>]*>' | head -3

echo ""
echo "6. GA 脚本:"
curl -s https://www.daysfromtoday.ai/en | grep -o 'gtag/js?id=G-[^"]*'

echo ""
echo "✅ SEO 验证完成！"
```

**使用方法：**
```bash
chmod +x scripts/verify-seo.sh
./scripts/verify-seo.sh
```

---

## 📊 CLI vs Web UI 对比

### **Vercel 部署**

| 操作 | Web UI | CLI |
|------|--------|-----|
| **部署速度** | 慢（需等待 Git webhook） | 快（立即开始） |
| **可靠性** | 中等（可能同步失败） | 高（直接控制） |
| **缓存控制** | 有限 | 完全控制 `--force` |
| **日志查看** | 需要点击多次 | 一行命令 `vercel logs` |
| **环境变量** | 需要手动 Redeploy | 可以一次性部署 |
| **错误排查** | 困难（界面分散） | 容易（实时日志） |

**推荐：** ✅ 重要部署使用 CLI

---

### **Git 操作**

| 操作 | Web UI (GitHub) | CLI |
|------|-----------------|-----|
| **提交速度** | 慢（需上传） | 快（本地操作） |
| **批量操作** | 困难（一次一个文件） | 容易（`git add -A`） |
| **提交信息** | 自由格式 | 可强制规范 |
| **历史查看** | 需要刷新页面 | 一行命令 `git log` |
| **分支操作** | 需要多次点击 | 一行命令 |

**推荐：** ✅ 日常开发使用 CLI

---

### **SEO 验证**

| 操作 | 浏览器 | CLI (curl) |
|------|--------|------------|
| **速度** | 慢（需加载页面） | 极快（秒级） |
| **自动化** | 困难（手动操作） | 容易（编写脚本） |
| **批量检查** | 非常困难 | 容易（循环） |
| **缓存干扰** | 有（需清除） | 无（每次新鲜） |
| **精确性** | 中等（受浏览器影响） | 高（原始 HTTP） |

**推荐：** ✅ SEO 验证使用 CLI

---

## 💡 最佳实践

### 1. **部署前必做检查**

```bash
# ✅ 本地构建验证（捕获 linter 错误）
npm run build

# ✅ 检查 Git 状态
git status

# ✅ 查看即将提交的更改
git diff

# ✅ 提交代码
git add -A
git commit -m "feat: 你的更改"
git push origin main

# ✅ 使用 CLI 部署（更可靠）
vercel --prod --force
```

---

### 2. **SEO 变更后验证**

```bash
# ✅ 等待 2-3 分钟（CDN 刷新）

# ✅ 验证关键标签
curl -s https://www.daysfromtoday.ai/en | grep canonical
curl -s https://www.daysfromtoday.ai/en | grep hreflang
curl -s https://www.daysfromtoday.ai/en | grep "og:url"

# ✅ 验证 Sitemap
curl -s https://www.daysfromtoday.ai/sitemap.xml | head -30

# ✅ 验证 GA
curl -s https://www.daysfromtoday.ai/en | grep gtag
```

---

### 3. **快速回滚策略**

```bash
# 如果部署出现问题：

# 方法 1: Git 回退
git log --oneline -5          # 查看最近的 commit
git revert HEAD               # 回退最后一次 commit
git push origin main
vercel --prod --force

# 方法 2: Vercel 回滚到之前的部署
vercel ls                     # 查看所有部署
vercel alias <old-deployment-url> production
```

---

### 4. **环境变量管理**

```bash
# ✅ 推荐：使用 Vercel CLI 管理环境变量
vercel env add NEXT_PUBLIC_GA_ID

# ❌ 不推荐：在 Web UI 中添加后还需手动 Redeploy

# ✅ 验证环境变量
vercel env ls

# ✅ 部署时环境变量会自动注入
vercel --prod --force
```

---

## 🔧 故障排查

### 问题 1: Vercel CLI 报错 "Git author must have access"

**原因：** Git commit author 与 Vercel 团队权限不匹配

**解决：**
```bash
# 配置正确的 Git 用户信息
git config --global user.email "your-vercel-email@example.com"
git config --global user.name "your-username"

# 验证配置
git config --global --list | grep user

# 创建新 commit（使用新 author）
git commit --allow-empty -m "deploy: 触发部署"
git push origin main

# 再次尝试 CLI 部署
vercel --prod --force
```

---

### 问题 2: `npm run build` 失败但本地开发正常

**原因：** 生产构建会强制执行严格的 linter 检查

**解决：**
```bash
# 查看详细错误
npm run build

# 运行 linter
npm run lint

# 修复 ESLint 错误
# 常见错误：
# - react/no-unescaped-entities: 使用 &apos; &quot;
# - @typescript-eslint/ban-ts-comment: 使用 @ts-expect-error 并添加注释
# - @typescript-eslint/no-unused-vars: 删除或使用未使用的变量

# 再次构建验证
npm run build
```

---

### 问题 3: curl 无法访问网站

**原因：** 网络问题或域名未解析

**解决：**
```bash
# 检查网络连接
ping google.com

# 检查域名解析
dig daysfromtoday.ai

# 使用 IP 直接访问（绕过 DNS）
curl -I -H "Host: www.daysfromtoday.ai" <vercel-ip>

# 或使用 Vercel 提供的 .vercel.app 域名
curl -I https://daysfromtoday.vercel.app
```

---

### 问题 4: 部署成功但新代码未生效

**原因：** CDN 缓存或 Vercel 部署问题

**解决：**
```bash
# 1. 检查 chunk hash（确认是否是新代码）
curl -s https://www.daysfromtoday.ai/en | grep -o 'layout-[a-f0-9]\+\.js'

# 2. 如果 hash 未变，强制重新部署（清除缓存）
vercel --prod --force

# 3. 等待 2-3 分钟后再次检查
curl -s https://www.daysfromtoday.ai/en | grep -o 'layout-[a-f0-9]\+\.js'

# 4. 如果还是不行，检查 Vercel 部署日志
vercel logs --follow
```

---

## 📚 相关资源

### **官方文档**
- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [Git 文档](https://git-scm.com/doc)
- [npm 文档](https://docs.npmjs.com/)
- [curl 文档](https://curl.se/docs/)

### **项目文档**
- [Vercel 部署故障排查](./VERCEL_DEPLOYMENT_TROUBLESHOOTING.md)
- [Google Search Console 提交指南](../SUBMIT_TO_GOOGLE_SEARCH_CONSOLE.md)
- [SEO 优化报告](../SEO_OPTIMIZATION_REPORT.md)

---

## 🎯 总结

### **核心优势**

CLI 相比 Web UI 的主要优势：

1. ✅ **速度快** - 本地操作，无需等待页面加载
2. ✅ **可靠性高** - 直接控制，不受网络和 UI 问题影响
3. ✅ **可自动化** - 编写脚本，批量操作
4. ✅ **易于调试** - 实时日志，精确控制
5. ✅ **可重复性** - 命令可保存和分享

### **推荐工作流**

```bash
# 日常开发
npm run dev              # 本地开发

# 提交前
npm run build            # 构建验证
git status               # 检查状态
git add -A               # 暂存更改
git commit -m "..."      # 提交
git push origin main     # 推送

# 部署
vercel --prod --force    # CLI 部署（推荐）

# 验证
curl -I https://...      # 检查部署
curl -s https://... | grep ...  # 验证配置
```

### **关键教训**

在本项目中，CLI 工具帮助我们：
- ✅ 解决了 Vercel Web UI 部署同步问题
- ✅ 快速验证了所有 SEO 配置
- ✅ 精确定位了部署版本（chunk hash）
- ✅ 节省了大量调试时间

**记住：重要的部署和验证，优先使用 CLI！**

---

**文档维护者：** AI Coding Assistant  
**反馈与更新：** 如有新的 CLI 工具或最佳实践，请更新本文档

