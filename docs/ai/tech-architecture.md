# ⚙️ 技术架构说明

## 一、核心技术栈

| 模块        | 技术                              | 说明                            |
| ----------- | --------------------------------- | ------------------------------- |
| 前端框架    | Next.js 15 (App Router, TS, Edge) | 基于 Vercel 平台构建与部署      |
| 运行环境    | Vercel Edge Runtime               | 支持 ISR / SSR / Edge Functions |
| 样式系统    | Tailwind CSS + next/font          | 极简轻量、快速首屏              |
| 国际化      | next-intl                         | 路由多语言化 + 翻译文件管理     |
| 时间计算    | date-fns + date-fns-tz            | IANA TZ 时区库，DST 安全        |
| 节假日 API  | Nager.Date API                    | 获取各国节假日，缓存 24h        |
| 配置中心    | Vercel Edge Config                | 控制开关、灰度发布、性能预算    |
| 数据层      | 无数据库（MVP）                   | 所有数据从 API / 前端计算获取   |
| 构建 & 部署 | Vercel CI/CD                      | Git push 自动触发构建           |
| 域名管理    | Cloudflare DNS Only               | 灰云模式，HTTPS 由 Vercel 管理  |

## 二、文件结构（规划）

app/

├─ [locale]/days/[n]/page.tsx

├─ [locale]/weekdays/[n]/page.tsx

├─ [locale]/business-days/[n]/page.tsx

├─ api/ics/route.ts**  **→ 生成日历文件 (.ics)

├─ sitemap.ts / robots.txt

lib/

├─ tz.ts**            **→ 时区与DST计算

├─ holidays.ts**      **→ 假日获取与缓存

├─ bizdays.ts **      **→ 工作日逻辑

└─ i18n.ts**          **→ 国际化工具

messages/

├─ en.json / zh.json / … → 多语言翻译文本

## 三、扩展规划

- **订阅功能**：未来接入 Supabase (Auth + DB)
- **AI 模块**：Dify / Claude 生成 FAQ 内容
- **Edge Config**：管理广告展示策略、性能开关
