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
| **Claude Code CLI** | 2.0.9 | `/Users/leonmini/.n/bin/claude` | AI 代码助手 |
| **OpenAI Codex CLI** | 0.42.0 | `/Users/leonmini/.local/npm-global/bin/codex` | AI 代码生成 |
| **Vercel CLI** | 48.2.3 | `/Users/leonmini/.n/bin/vercel` | 部署到 Vercel |
| **Git** | 2.50.1 | `/usr/bin/git` | 版本控制 |
| **Node.js** | 22.20.0 | `/Users/leonmini/.n/bin/node` | JavaScript 运行时 |
| **npm** | 11.6.1 | `/Users/leonmini/.local/npm-global/bin/npm` | 包管理器 |
| **npx** | 11.6.1 | `/Users/leonmini/.local/npm-global/bin/npx` | 执行 npm 包 |
| **curl** | 系统自带 | `/usr/bin/curl` | HTTP 请求测试 |
| **grep** | 系统自带 | `/usr/bin/grep` | 文本搜索 |

---

## 🛠 核心工具详解

### 1. Claude Code CLI

**用途：** Anthropic 官方的 AI 代码助手命令行工具，直接在终端中使用 Claude 进行代码生成、重构、解释等操作

**安装：**
```bash
npm i -g @anthropic-ai/claude-code
```

**核心命令：**

#### 代码生成
```bash
# 生成代码
claude "创建一个 React 组件用于显示用户列表"

# 从文件生成
claude --file component.tsx "优化这个组件的性能"

# 生成并保存到文件
claude "创建一个日期计算函数" --output utils/date.ts
```

#### 代码审查和重构
```bash
# 审查代码
claude review ./src/components/Header.tsx

# 重构代码
claude refactor ./src/utils/helpers.ts --style functional

# 添加注释
claude "为这个函数添加 JSDoc 注释" --file utils.ts
```

#### 代码解释
```bash
# 解释代码
claude explain ./app/[locale]/layout.tsx

# 解释特定部分
claude "解释这段代码的工作原理" --file layout.tsx --lines 50-100
```

#### 交互模式
```bash
# 启动交互式对话
claude chat

# 在交互模式下可以：
# - 连续提问
# - 查看上下文
# - 迭代优化代码
```

**优势：**
- ✅ **AI 增强开发**：直接在终端获得 Claude 的帮助
- ✅ **上下文感知**：理解项目结构和代码上下文
- ✅ **批量操作**：可以处理多个文件
- ✅ **集成工作流**：与 Git、编辑器无缝集成

**本项目中的应用：**
- ✅ 代码重构和优化建议
- ✅ 快速生成工具函数
- ✅ 代码审查和质量检查
- ✅ 文档和注释生成

**示例工作流：**
```bash
# 1. 生成新组件
claude "创建一个日期选择器组件" --output components/DatePicker.tsx

# 2. 审查生成的代码
claude review components/DatePicker.tsx

# 3. 优化
claude "优化性能并添加 TypeScript 类型" --file components/DatePicker.tsx

# 4. 生成测试
claude "为这个组件生成测试用例" --file components/DatePicker.tsx --output __tests__/DatePicker.test.tsx
```

---

### 2. OpenAI Codex CLI

**用途：** OpenAI 的代码生成和补全工具，专注于快速生成高质量代码片段

**安装：**
```bash
npm i -g codex-cli
```

**核心命令：**

#### 代码生成
```bash
# 生成函数
codex "写一个函数计算两个日期之间的天数"

# 生成 React 组件
codex "创建一个带有加载状态的按钮组件"

# 生成 TypeScript 接口
codex "为用户数据创建 TypeScript 接口"
```

#### 代码补全
```bash
# 基于上下文补全
codex complete --file app.ts

# 交互式补全
codex interactive
```

#### 代码转换
```bash
# JavaScript 转 TypeScript
codex convert --from js --to ts --file script.js

# Python 转 JavaScript
codex convert --from python --to javascript --file script.py
```

#### 代码优化
```bash
# 优化性能
codex optimize --file slow-function.ts

# 重构代码
codex refactor --file legacy-code.js --style modern
```

**优势：**
- ✅ **快速生成**：秒级生成代码片段
- ✅ **多语言支持**：支持几十种编程语言
- ✅ **智能补全**：基于上下文的精准建议
- ✅ **代码转换**：跨语言代码迁移

**本项目中的应用：**
- ✅ 快速生成工具函数
- ✅ TypeScript 类型定义
- ✅ 代码片段补全
- ✅ 算法实现

**示例工作流：**
```bash
# 1. 生成日期计算函数
codex "创建一个函数，计算 N 天后的日期，考虑工作日" --output utils/calculate-date.ts

# 2. 生成测试
codex "为 calculate-date.ts 生成单元测试" --output __tests__/calculate-date.test.ts

# 3. 优化性能
codex optimize --file utils/calculate-date.ts
```

---

### 3. Vercel CLI

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

### 4. Git

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

### 5. npm / npx

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

### 6. curl

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

### 7. grep

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
- [Claude Code CLI 文档](https://docs.anthropic.com/claude/docs/cli)
- [OpenAI Codex 文档](https://platform.openai.com/docs/guides/code)
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

### **当前环境 CLI 工具生态（9 个核心工具）**

| 类别 | 工具 | 版本 | 核心用途 |
|------|------|------|----------|
| **AI 助手** | Claude Code CLI | 2.0.9 | AI 代码生成、审查、重构 |
| **AI 助手** | OpenAI Codex CLI | 0.42.0 | 快速代码生成和补全 |
| **部署** | Vercel CLI | 48.2.3 | 生产部署和管理 |
| **版本控制** | Git | 2.50.1 | 代码版本管理 |
| **开发环境** | Node.js | 22.20.0 | JavaScript 运行时 |
| **包管理** | npm / npx | 11.6.1 | 依赖管理和执行 |
| **测试验证** | curl | 系统自带 | HTTP 请求测试 |
| **文本处理** | grep | 系统自带 | 文本搜索过滤 |

### **核心优势**

CLI 相比 Web UI 的主要优势：

1. ✅ **速度快** - 本地操作，无需等待页面加载
2. ✅ **可靠性高** - 直接控制，不受网络和 UI 问题影响
3. ✅ **可自动化** - 编写脚本，批量操作
4. ✅ **易于调试** - 实时日志，精确控制
5. ✅ **可重复性** - 命令可保存和分享
6. ✅ **AI 增强** - Claude 和 Codex 提供智能辅助

### **推荐工作流（AI 增强）**

```bash
# AI 辅助开发
claude "创建一个日期计算组件" --output components/DateCalc.tsx
codex "为这个组件生成 TypeScript 类型" --file components/DateCalc.tsx

# 代码审查
claude review components/DateCalc.tsx

# 本地开发
npm run dev              # 本地开发（热重载）

# 提交前验证
npm run build            # ✅ 构建验证（捕获 linter 错误）
git status               # ✅ 检查状态
git add -A               # ✅ 暂存更改
git commit -m "..."      # ✅ 提交（Conventional Commits）
git push origin main     # ✅ 推送

# 部署（推荐使用 CLI）
vercel --prod --force    # ✅ 可靠、快速、可控

# 验证部署
curl -I https://...      # ✅ 检查状态码和重定向
curl -s https://... | grep canonical  # ✅ 验证 SEO 配置
curl -s https://... | grep gtag  # ✅ 验证 GA 脚本
```

### **关键教训**

在本项目中，CLI 工具帮助我们：

**传统 CLI 工具：**
- ✅ 解决了 Vercel Web UI 部署同步问题
- ✅ 快速验证了所有 SEO 配置
- ✅ 精确定位了部署版本（chunk hash）
- ✅ 节省了大量调试时间

**AI CLI 工具：**
- ✅ 快速生成代码组件和工具函数
- ✅ 自动化代码审查和优化建议
- ✅ 智能生成 TypeScript 类型定义
- ✅ 提供代码解释和重构方案

**核心理念：**
> **传统 CLI** 解决效率问题（速度、可靠性）  
> **AI CLI** 解决生产力问题（代码质量、开发速度）  
> **两者结合** 实现最佳开发体验

**记住：重要的部署和验证，优先使用 CLI！复杂的代码任务，优先使用 AI CLI！**

---

**文档维护者：** AI Coding Assistant  
**反馈与更新：** 如有新的 CLI 工具或最佳实践，请更新本文档

