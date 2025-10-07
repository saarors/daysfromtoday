# Vercel 部署故障排查指南

**文档版本：** v1.0  
**最后更新：** 2025-01-07  
**适用项目：** daysfromtoday  
**相关技术：** Vercel、Next.js 15、Google Analytics

---

## 📋 目录

1. [问题背景](#问题背景)
2. [根本原因](#根本原因)
3. [解决方案](#解决方案)
4. [经验教训](#经验教训)
5. [最佳实践](#最佳实践)
6. [故障排查清单](#故障排查清单)

---

## 🚨 问题背景

### 症状描述
- **问题：** Google Analytics 脚本无法在 Vercel 部署的生产环境中加载
- **表现：** 
  - `view-source` 中找不到 GA 脚本（`gtag/js?id=...`）
  - DevTools Network 中没有 GA 请求
  - Google Analytics Realtime 无数据
  - 调试探针（probe）在源码中找不到

### 排查过程
1. ✅ 检查环境变量 `NEXT_PUBLIC_GA_ID` → 已正确配置
2. ✅ 检查代码逻辑 → GA 组件已正确添加到布局
3. ✅ 多次通过 Git push 触发 Vercel 自动部署 → **部署显示成功**
4. ✅ 通过 Vercel Dashboard 手动 Redeploy（清除缓存）→ **仍然失败**
5. ❌ **关键发现：** Vercel 一直在部署旧代码，新代码从未部署成功

### 验证方法
通过对比 JavaScript chunk hash 确认部署版本：
```bash
# 检查线上的 layout chunk hash
curl -s 'https://www.daysfromtoday.ai/en' | grep -o 'layout-[a-f0-9]\+\.js'

# 结果：layout-46286062afb8fd09.js（旧版本）
# 即使 Git push 后，hash 仍然不变 → 说明 Vercel 没有部署新代码
```

---

## 🔍 根本原因

### **Vercel 网页 UI 部署存在同步问题**

**问题分析：**

1. **Git 集成可能存在延迟或失败：**
   - Git push 触发的自动部署可能因为各种原因（webhook 延迟、Git 权限问题、缓存问题）未能拉取最新代码
   - Vercel Dashboard 显示"部署成功"，但实际使用的是旧的构建缓存或旧的 commit

2. **手动 Redeploy 也可能使用旧代码：**
   - 即使在 Vercel Dashboard 中手动触发"Redeploy"并清除缓存
   - 如果 Git 集成有问题，Vercel 仍然可能从旧的 commit 构建

3. **Git Author 权限问题导致 CLI 失败：**
   - 初期尝试使用 Vercel CLI 部署时，遇到 Git author 权限错误
   - 本地 Git 配置的用户信息与 Vercel 团队权限不匹配

---

## ✅ 解决方案

### **方案：使用 Vercel CLI 直接部署**

**步骤：**

#### 1. 配置正确的 Git 用户信息
```bash
# 设置与 Vercel 账户匹配的邮箱和用户名
git config --global user.email "your-vercel-email@example.com"
git config --global user.name "your-username"

# 验证配置
git config --global --list | grep user
```

#### 2. 修复所有 Linter 错误
```bash
# 运行本地构建以检查错误
npm run build

# 修复所有 ESLint 和 TypeScript 错误
# （Vercel 生产构建会失败如果有 linter 错误）
```

**常见错误修复：**
- 未转义的引号：`'` → `&apos;` 或 `"`  → `&quot;`
- `@ts-ignore` → `@ts-expect-error`（并添加注释）
- 未使用的变量：删除或使用

#### 3. 使用 Vercel CLI 部署
```bash
# 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到生产环境（强制重新构建，不使用缓存）
vercel --prod --force
```

**关键参数：**
- `--prod`：部署到生产环境（而不是 preview）
- `--force`：强制重新构建，忽略缓存

#### 4. 验证部署成功
```bash
# 等待 2-3 分钟后，检查是否部署了最新代码
curl -s 'https://your-domain.com' | grep 'your-test-marker'

# 或检查 chunk hash 是否变化
curl -s 'https://your-domain.com/en' | grep -o 'layout-[a-f0-9]\+\.js'
```

---

## 💡 经验教训

### 1. **不要盲目信任 Vercel Dashboard 的部署状态**

- ✅ Vercel 显示"部署成功" ≠ 新代码已上线
- ✅ 务必通过实际验证（chunk hash、探针、功能测试）确认部署

### 2. **Git Push 自动部署不一定可靠**

**可能的问题：**
- Git webhook 延迟或失败
- Vercel Git 集成配置错误
- 分支配置不正确（部署了错误的分支）
- Git author 权限问题

**推荐做法：**
- 重要部署使用 Vercel CLI 手动触发
- 验证 Git 集成配置（Settings → Git）
- 检查部署使用的 commit hash（Deployments → 点击部署 → 查看 commit）

### 3. **建立可靠的部署验证机制**

**验证方法（按优先级）：**

1. **Chunk Hash 验证（最可靠）：**
   ```bash
   curl -s 'https://your-domain.com/en' | grep -o 'layout-[a-f0-9]\+\.js'
   ```
   - 如果 hash 不变 → 新代码未部署

2. **探针验证（临时调试用）：**
   ```tsx
   <div style={{ display: 'none' }} data-probe="v2025-01-07">PROBE_MARKER</div>
   ```
   - 在 `view-source` 搜索 `PROBE_MARKER`

3. **功能验证：**
   - 测试新功能是否生效
   - 检查 DevTools Network 是否有预期的请求

### 4. **Linter 错误会导致生产构建失败**

- Next.js 生产构建（`npm run build`）会强制执行 ESLint 和 TypeScript 检查
- 本地开发可能不会报错，但 Vercel 部署会失败
- **最佳实践：** 部署前在本地运行 `npm run build`

### 5. **Git 用户配置很重要**

- Vercel CLI 会检查 Git commit author 是否有团队权限
- 确保本地 Git 配置的邮箱与 Vercel 账户一致：
  ```bash
  git config --global user.email "your-vercel-email@example.com"
  ```

### 6. **环境变量需要重新部署才能生效**

- ❌ 在 Vercel Dashboard 添加/修改环境变量后，必须重新部署
- ❌ 仅保存环境变量不会自动触发重新部署
- ✅ 修改环境变量后，手动触发 Redeploy 或新的 Git push

---

## 🛠 最佳实践

### 部署前检查清单

#### ✅ 代码质量
- [ ] 运行 `npm run build` 确保本地构建成功
- [ ] 修复所有 ESLint 和 TypeScript 错误
- [ ] 删除所有调试代码和探针
- [ ] 检查所有硬编码的值是否已改为环境变量

#### ✅ Git 配置
- [ ] 确认 Git 用户信息与 Vercel 账户匹配
  ```bash
  git config --global --list | grep user
  ```
- [ ] 确认所有更改已提交并推送
  ```bash
  git status
  git log --oneline -1
  ```

#### ✅ 环境变量
- [ ] 在 Vercel Dashboard 确认所有环境变量已设置
- [ ] 确认 `Production` 环境已勾选
- [ ] 使用 `NEXT_PUBLIC_` 前缀的变量才能在前端访问

#### ✅ 部署验证
- [ ] 使用 Vercel CLI 部署（`vercel --prod --force`）
- [ ] 等待 2-3 分钟让 CDN 刷新
- [ ] 在无痕窗口验证新功能
- [ ] 检查 chunk hash 或探针确认新代码已部署

### 推荐工作流

```bash
# 1. 本地开发完成后
npm run build  # 确保构建成功

# 2. 提交代码
git add -A
git commit -m "feat: 描述你的更改"
git push origin main

# 3. 使用 CLI 部署（推荐）
vercel --prod --force

# 4. 验证部署
# 等待 2-3 分钟后，在无痕窗口打开网站验证

# 5. 如果出现问题，检查 Build Logs
vercel logs <deployment-url>
```

---

## 📝 故障排查清单

### 问题：代码推送后没有部署到生产环境

#### Step 1: 检查 Git 集成
1. 打开 Vercel Dashboard → 项目 → Settings → Git
2. 确认：
   - ✅ Connected Git Repository 正确
   - ✅ Production Branch 是 `main`（或你使用的分支）
   - ✅ 最近的部署 commit hash 是否是最新的

#### Step 2: 检查部署日志
1. Deployments → 点击最新部署
2. 查看 Build Logs
3. 搜索关键词：
   - `Error`、`Warning`
   - 你修改的文件名（如 `layout.tsx`）
   - 环境变量名（如 `NEXT_PUBLIC_GA_ID`）

#### Step 3: 验证 chunk hash
```bash
# 检查线上的 chunk hash
curl -s 'https://your-domain.com/en' | grep -o 'layout-[a-f0-9]\+\.js'

# 在本地构建并检查 hash
npm run build
ls -la .next/static/chunks/app/

# 对比两个 hash，如果相同 → 新代码未部署
```

#### Step 4: 使用 Vercel CLI 强制部署
```bash
# 配置 Git 用户（如果还没有）
git config --global user.email "your-vercel-email@example.com"
git config --global user.name "your-username"

# 强制部署
vercel --prod --force

# 查看部署日志
vercel logs --follow
```

#### Step 5: 清除所有缓存
1. Vercel Dashboard → Settings → Caching
2. 点击 "Purge All Caches"
3. 回到 Deployments → Redeploy（不使用缓存）

---

## 🔧 常见问题

### Q1: Vercel CLI 报错 "Git author must have access"

**原因：** 本地 Git commit 的 author 没有 Vercel 团队权限

**解决：**
```bash
# 配置正确的 Git 用户信息
git config --global user.email "your-vercel-email@example.com"
git config --global user.name "your-username"

# 创建一个新的 commit（使用新的 author）
git commit --allow-empty -m "deploy: 触发部署"
git push origin main

# 再次尝试 CLI 部署
vercel --prod --force
```

### Q2: Vercel 构建失败，提示 ESLint 错误

**原因：** 生产构建会强制执行严格的 linter 检查

**解决：**
```bash
# 本地运行构建以查看所有错误
npm run build

# 修复所有 linter 错误
# 常见错误：
# - react/no-unescaped-entities: 使用 &apos; &quot;
# - @typescript-eslint/ban-ts-comment: 使用 @ts-expect-error 并添加注释
# - @typescript-eslint/no-unused-vars: 删除或使用未使用的变量
```

### Q3: 环境变量在部署后仍然是 undefined

**原因：**
1. 环境变量未勾选 "Production"
2. 添加环境变量后没有重新部署
3. 前端访问的变量没有 `NEXT_PUBLIC_` 前缀

**解决：**
1. Vercel Dashboard → Settings → Environment Variables
2. 确认 `Production` 已勾选
3. 确认变量名以 `NEXT_PUBLIC_` 开头（前端访问）
4. 保存后，手动触发 Redeploy

---

## 📚 相关文档

- [Vercel 官方文档 - Deployments](https://vercel.com/docs/deployments)
- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [Next.js 环境变量](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [项目规则 - Project Rules](../PROJECT_RULES.md)

---

## 🎯 总结

**关键要点：**

1. ✅ **不要盲目信任 Vercel Dashboard 的部署状态** → 务必验证
2. ✅ **重要部署使用 Vercel CLI** → 更可靠、可控
3. ✅ **建立可靠的验证机制** → chunk hash、探针、功能测试
4. ✅ **部署前运行本地构建** → `npm run build`
5. ✅ **配置正确的 Git 用户信息** → 匹配 Vercel 账户

**记住：**
> 部署显示成功 ≠ 新代码已上线  
> 验证是唯一的真相来源

---

**文档维护者：** AI Coding Assistant  
**反馈与更新：** 如遇到新的部署问题，请更新本文档

