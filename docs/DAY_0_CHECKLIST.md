# 📋 Day 0：前置准备清单

**开始时间**：2025-10-16  
**预计耗时**：8 小时  
**当前状态**：🟢 进行中

---

## ✅ 任务 1：Git 分支准备（已完成）

- [x] 确保 main 分支最新
- [x] 创建 develop 分支
- [x] 推送到远程仓库
- [ ] 在 GitHub 设置 Branch Protection Rules

**验证**：
```bash
✅ develop 分支已创建并推送到远程
✅ 当前分支：develop
```

---

## 🔄 任务 2：Supabase 配置（进行中）

### 2.1 创建项目
- [ ] 访问 https://supabase.com
- [ ] 创建新项目：`daysfromtoday-v3`
- [ ] 选择区域：Singapore
- [ ] 记录项目信息到 `.env.local`

### 2.2 环境变量
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 2.3 安装依赖
```bash
npm install @supabase/supabase-js@latest
npm install @supabase/ssr@latest
npm install @supabase/auth-helpers-nextjs@latest
```

### 2.4 验证连接
- [ ] 创建测试脚本：`scripts/test-supabase-connection.ts`
- [ ] 运行测试：`npx tsx scripts/test-supabase-connection.ts`

---

## 📦 任务 3：Cloudflare Workers KV（待开始）

### 3.1 创建 KV Namespace
- [ ] 登录 Cloudflare Dashboard
- [ ] 创建 KV Namespace：`daysfromtoday-short-links`
- [ ] 记录 Namespace ID

### 3.2 安装 Wrangler CLI
```bash
npm install -g wrangler
wrangler login
wrangler whoami
```

### 3.3 创建 Worker 项目
```bash
mkdir -p workers/short-link-resolver
cd workers/short-link-resolver
npm init -y
npm install -D wrangler @cloudflare/workers-types
```

### 3.4 配置 wrangler.toml
- [ ] 创建 `wrangler.toml` 文件
- [ ] 配置 KV 绑定

### 3.5 创建 Worker 代码
- [ ] 创建 `src/index.ts`
- [ ] 实现短链接跳转逻辑

### 3.6 部署 Worker
```bash
npm run build
wrangler deploy
```

---

## ⚙️ 任务 4：Vercel Edge Config（待开始）

### 4.1 创建 Edge Config
- [ ] 登录 Vercel Dashboard
- [ ] 创建 Edge Config：`feature-flags`
- [ ] 初始配置：`{ "rollout_percentage": 0 }`

### 4.2 安装依赖
```bash
npm install @vercel/edge-config@latest
```

### 4.3 环境变量
```bash
EDGE_CONFIG=https://edge-config.vercel.com/xxxx
```

### 4.4 创建工具函数
- [ ] 创建 `lib/feature-flags.ts`
- [ ] 测试：`npx tsx scripts/test-edge-config.ts`

---

## 📚 任务 5：核心依赖安装（待开始）

### 5.1 V3.0 新增依赖
```bash
npm install @vercel/og@latest              # 图片生成
npm install react-hook-form@latest         # 表单管理
npm install zod@latest                     # 表单验证
npm install framer-motion@latest           # 动画效果
npm install nanoid@latest                  # 短链接 ID
npm install @upstash/ratelimit@latest      # 限流
npm install @upstash/redis@latest          # Redis 客户端
```

### 5.2 开发依赖
```bash
npm install -D vitest@latest               # 单元测试
npm install -D @vitest/ui@latest           # Vitest UI
npm install -D @testing-library/react@latest
npm install -D @testing-library/jest-dom@latest
npm install -D @playwright/test@latest     # E2E 测试
npm install -D @lhci/cli@latest            # Lighthouse CI
```

### 5.3 验证安装
- [ ] `npm run build` 成功
- [ ] `npm run dev` 启动正常
- [ ] 记录依赖版本：`npm list --depth=0 > docs/v3.0-dependencies.txt`

---

## 🔍 任务 6：监控工具配置（待开始）

### 6.1 Sentry（错误监控）
```bash
npm install @sentry/nextjs@latest
npx @sentry/wizard@latest -i nextjs
```

- [ ] 创建 Sentry 项目
- [ ] 记录 DSN
- [ ] 配置环境变量
- [ ] 测试错误上报

### 6.2 Upstash Redis（限流）
- [ ] 访问 https://upstash.com
- [ ] 创建 Redis 数据库：`daysfromtoday-ratelimit`
- [ ] 记录连接信息
- [ ] 配置环境变量
- [ ] 创建 `lib/ratelimit.ts`
- [ ] 测试限流：`npx tsx scripts/test-ratelimit.ts`

---

## 📝 任务 7：环境变量配置（待开始）

### 7.1 创建 .env.local
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_KV_NAMESPACE_ID=
CLOUDFLARE_API_TOKEN=

# Vercel Edge Config
EDGE_CONFIG=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Site URL
NEXT_PUBLIC_SITE_URL=https://www.daysfromtoday.ai
```

### 7.2 验证
- [ ] 所有环境变量已配置
- [ ] `.env.local` 已添加到 `.gitignore`
- [ ] 创建 `.env.example` 模板

---

## 🎯 Day 0 完成标准

### 必须完成（阻塞 Phase 1）
- [ ] Supabase 项目创建并连接成功
- [ ] 核心依赖安装成功
- [ ] `npm run build` 通过
- [ ] `npm run dev` 正常启动
- [ ] `.env.local` 配置完整

### 可选（不阻塞 Phase 1）
- [ ] Cloudflare Workers KV 配置
- [ ] Vercel Edge Config 配置
- [ ] Sentry 配置
- [ ] Upstash Redis 配置

### 风险评估
- 🟡 Supabase 配置可能需要等待项目初始化（2-5 分钟）
- 🟢 核心依赖安装风险低
- 🟡 Cloudflare 配置需要域名配置权限

---

## 📊 进度追踪

**总进度**：1/7 (14%)

| 任务 | 状态 | 耗时 |
|------|------|------|
| 1. Git 分支准备 | ✅ 已完成 | 5 分钟 |
| 2. Supabase 配置 | 🔄 进行中 | - |
| 3. Cloudflare Workers KV | ⏳ 待开始 | - |
| 4. Vercel Edge Config | ⏳ 待开始 | - |
| 5. 核心依赖安装 | ⏳ 待开始 | - |
| 6. 监控工具配置 | ⏳ 待开始 | - |
| 7. 环境变量配置 | ⏳ 待开始 | - |

---

**下一步**：开始任务 2 - Supabase 配置

**更新时间**：2025-10-16 18:30

