# DaysFromToday 技术实施方案

**文档版本：** v1.0  
**创建日期：** 2025-10-07  
**目标：** 在保持 SEO 友好的前提下，通过功能和 UI 升级提升用户体验

---

## 📋 目录

1. [项目目标与原则](#项目目标与原则)
2. [技术栈选型与依赖](#技术栈选型与依赖)
3. [架构设计](#架构设计)
4. [数据源与 API 策略](#数据源与-api-策略)
5. [路由与 URL 规划](#路由与-url-规划)
6. [UI/UX 设计原则](#uiux-设计原则)
7. [功能实施清单](#功能实施清单)
8. [SEO 优化策略](#seo-优化策略)
9. [性能与缓存策略](#性能与缓存策略)
10. [测试与验收标准](#测试与验收标准)
11. [实施时间表](#实施时间表)
12. [风险评估与回滚计划](#风险评估与回滚计划)

---

## 🎯 项目目标与原则

### **核心目标**

1. **用户体验优先** - "开页即答案"，所有复杂选项在不干扰主结果的前提下展开
2. **SEO 友好** - 所有新页面遵循现有 SEO 标准（metadata, canonical, hreflang, JSON-LD）
3. **性能优化** - 保持 CWV 红线（LCP≤2.5s，INP≤200ms，CLS≤0.1）
4. **国际化优先** - 多语言、多时区、多国节假日支持
5. **渐进增强** - 功能分阶段上线，每阶段可独立验证

### **设计原则（参考 Calendly）**

```
✅ 模块化卡片布局 - 每个功能独立卡片，可折叠/展开
✅ 清晰的视觉层级 - Hero → 功能区 → 详细信息 → 操作按钮
✅ 即时反馈 - 用户操作后立即显示结果，无需跳转
✅ 移动优先 - 所有 UI 组件移动端优先设计
✅ 一致性 - 保持现有品牌色彩和交互模式
```

---

## 🔧 技术栈选型与依赖

### **现有技术栈（保持不变）**

```json
{
  "framework": "Next.js 15 (App Router)",
  "language": "TypeScript (strict mode)",
  "styling": "Tailwind CSS v4",
  "i18n": "next-intl",
  "deployment": "Vercel (Edge Runtime)",
  "analytics": "Google Analytics 4"
}
```

### **新增依赖（最小化原则）**

```json
{
  "dependencies": {
    // ✅ 核心依赖（必须）
    "date-fns": "^3.0.0",           // 日期计算
    "date-fns-tz": "^2.0.0",        // 时区安全
    
    // ✅ UI 组件（必须）
    "@radix-ui/react-tabs": "^1.0.0",      // 选项卡
    "@radix-ui/react-select": "^2.0.0",    // 下拉选择
    "@radix-ui/react-dialog": "^1.0.0",    // 对话框
    "@radix-ui/react-checkbox": "^1.0.0",  // 复选框
    
    // ✅ MDX（博客系统）
    "@next/mdx": "^15.0.0",
    "gray-matter": "^4.0.3",        // 解析 frontmatter
    "rehype-highlight": "^7.0.0",   // 代码高亮
    
    // ❌ 不使用的依赖（理由）
    // "recharts" - 暂不需要图表，用 CSS 实现进度条
    // "@nager/date" npm 包 - 直接调用 API 更灵活
    // "supabase" - MVP 阶段使用 localStorage
  }
}
```

**依赖选择理由：**

1. **date-fns** vs moment.js - 更轻量（17KB vs 67KB），模块化，Tree-shaking 友好
2. **Radix UI** vs Headless UI - 更好的可访问性，与 Tailwind 集成更佳
3. **直接调用 API** vs npm 包 - Vercel Edge 环境限制，避免 node runtime 依赖

---

## 🏗 架构设计

### **整体架构（三层模型）**

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (UI)             │
│  - React Server Components (RSC)            │
│  - Client Components (交互)                  │
│  - Tailwind CSS (样式)                       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│       Business Logic Layer (Utils)          │
│  - lib/bizdays.ts (工作日计算)               │
│  - lib/holidays.ts (节假日管理)              │
│  - lib/geo.ts (地理位置)                     │
│  - lib/storage.ts (本地存储)                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Data Layer (API/Cache)             │
│  - app/api/holidays (节假日代理)             │
│  - app/api/bizdays (工作日计算)              │
│  - app/api/geo (地理检测)                    │
│  - Vercel Edge Config (配置)                │
│  - ISR Cache (24h 缓存)                     │
└─────────────────────────────────────────────┘
```

### **文件结构（新增部分）**

```
app/
├── [locale]/
│   ├── page.tsx                          # ✅ 改版：模块化首页
│   │
│   ├── days/                             # ✅ 新增：自然日计算
│   │   ├── [n]/
│   │   │   └── page.tsx                  # /en/days/14
│   │   └── ago/
│   │       └── [n]/
│   │           └── page.tsx              # /en/days/ago/14
│   │
│   ├── business-days/                    # ✅ 新增：工作日计算
│   │   ├── [n]/
│   │   │   └── page.tsx                  # /en/business-days/14
│   │   └── ago/
│   │       └── [n]/
│   │           └── page.tsx              # /en/business-days/ago/14
│   │
│   ├── from/                             # ✅ 新增：从指定日期计算
│   │   └── [date]/
│   │       ├── days/
│   │       │   └── [n]/
│   │       │       └── page.tsx          # /en/from/2025-01-01/days/14
│   │       └── business-days/
│   │           └── [n]/
│   │               └── page.tsx          # /en/from/2025-01-01/business-days/14
│   │
│   ├── anniversary/                      # ✅ 新增：纪念日管理
│   │   └── page.tsx
│   │
│   ├── blog/                             # ✅ 新增：博客系统
│   │   ├── page.tsx                      # 文章列表
│   │   ├── [slug]/
│   │   │   └── page.tsx                  # 文章详情
│   │   └── category/
│   │       └── [category]/
│   │           └── page.tsx              # 分类页
│   │
│   └── faq/
│       └── page.tsx                      # ✅ 改版：重定向到博客第一篇
│
├── api/
│   ├── holidays/
│   │   └── route.ts                      # ✅ 新增：节假日 API
│   ├── bizdays/
│   │   └── route.ts                      # ✅ 新增：工作日计算 API
│   └── geo/
│       └── route.ts                      # ✅ 已存在：地理检测
│
components/
├── calculators/                          # ✅ 新增：计算器组件
│   ├── DateCalculator.tsx                # 日期计算器卡片
│   ├── BusinessDaysCalculator.tsx        # 工作日计算器
│   ├── ExcludedDatesList.tsx             # 排除日期展示
│   └── AnniversaryManager.tsx            # 纪念日管理
│
├── ui/                                   # ✅ 新增：基础 UI 组件
│   ├── CountrySelector.tsx               # 国家选择器
│   ├── TimezoneSelector.tsx              # 时区选择器
│   ├── DatePicker.tsx                    # 日期选择器
│   ├── Card.tsx                          # 卡片组件
│   ├── Tabs.tsx                          # 选项卡
│   ├── Badge.tsx                         # 徽章
│   └── Button.tsx                        # 按钮
│
└── blog/                                 # ✅ 新增：博客组件
    ├── BlogCard.tsx                      # 文章卡片
    ├── BlogList.tsx                      # 文章列表
    ├── FeaturedPost.tsx                  # 精选文章
    └── MDXComponents.tsx                 # MDX 自定义组件
│
lib/                                      # ✅ 新增：业务逻辑层
├── bizdays.ts                            # 工作日计算逻辑
├── holidays.ts                           # 节假日数据管理
├── geo.ts                                # 地理位置工具
├── storage.ts                            # LocalStorage 封装
├── date-utils.ts                         # 日期工具函数
└── weekend-rules.ts                      # 周末规则配置
│
content/                                  # ✅ 新增：内容管理
└── blog/
    ├── faq-comprehensive-guide.mdx       # 从 FAQ 迁移
    ├── business-days-explained.mdx
    ├── timezone-safety-guide.mdx
    └── holiday-planning-tips.mdx
│
data/                                     # ✅ 新增：静态数据
└── weekend-rules.json                    # 不同国家的周末规则
```

---

## 🌐 数据源与 API 策略

### **节假日数据源：Nager.Date API**

**选择理由：**
- ✅ 免费开放 API
- ✅ 覆盖 100+ 国家
- ✅ 数据质量高（政府来源）
- ✅ RESTful API，易于集成
- ✅ 支持多年数据

**API 端点：**
```
GET https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}

返回示例：
[
  {
    "date": "2025-01-01",
    "localName": "New Year's Day",
    "name": "New Year's Day",
    "countryCode": "US",
    "global": true,
    "counties": null,
    "launchYear": null,
    "types": ["Public"]
  }
]
```

**缓存策略：**
```typescript
// app/api/holidays/route.ts
export const revalidate = 86400; // 24 小时 ISR

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'US';
  const year = searchParams.get('year') || new Date().getFullYear();
  
  try {
    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`,
      { next: { revalidate: 86400 } } // Next.js 缓存
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch holidays');
    }
    
    const holidays = await response.json();
    
    return Response.json({
      success: true,
      data: holidays,
      cached: true,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    // 回退策略：仅使用周末规则
    return Response.json({
      success: false,
      data: [],
      fallback: 'weekend-only',
      error: error.message
    }, { status: 500 });
  }
}
```

### **地理位置检测：Vercel Headers**

**优势：**
- ✅ 零成本（Vercel 内置）
- ✅ 无需外部 API
- ✅ Edge Runtime 原生支持

**实现：**
```typescript
// app/api/geo/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Vercel 自动提供的地理信息
  const country = request.geo?.country || 'US';
  const city = request.geo?.city;
  const region = request.geo?.region;
  
  // 客户端时区（从 Headers 获取或推断）
  const timezone = request.headers.get('x-vercel-ip-timezone') 
    || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return NextResponse.json({
    country,
    city,
    region,
    timezone,
    detected: true
  });
}
```

### **周末规则：静态数据**

**数据结构：**
```typescript
// data/weekend-rules.json
{
  "US": { "days": [0, 6], "names": ["Sunday", "Saturday"] },
  "CN": { "days": [0, 6], "names": ["Sunday", "Saturday"] },
  "AE": { "days": [5, 6], "names": ["Friday", "Saturday"] },
  "IL": { "days": [5, 6], "names": ["Friday", "Saturday"] },
  "SA": { "days": [5, 6], "names": ["Friday", "Saturday"] },
  "IR": { "days": [4, 5], "names": ["Thursday", "Friday"] }
}
```

**使用方式：**
```typescript
// lib/weekend-rules.ts
import weekendRules from '@/data/weekend-rules.json';

export function getWeekendDays(countryCode: string): number[] {
  return weekendRules[countryCode]?.days || [0, 6]; // 默认周六日
}

export function isWeekend(date: Date, countryCode: string): boolean {
  const weekendDays = getWeekendDays(countryCode);
  return weekendDays.includes(date.getDay());
}
```

---

## 🗺 路由与 URL 规划

### **路由设计原则**

1. **SEO 友好** - 语义化 URL，包含关键词
2. **i18n 优先** - 所有路由在 `[locale]` 下
3. **向后兼容** - 保留现有 `/[locale]/[days]` 路由
4. **可预测** - 统一的命名规范

### **完整路由表**

| 功能 | 路由模式 | 示例 | SEO 关键词 |
|------|---------|------|-----------|
| **自然日（未来）** | `/{locale}/days/{n}` | `/en/days/14` | "14 days from today" |
| **自然日（过去）** | `/{locale}/days/ago/{n}` | `/en/days/ago/14` | "14 days ago from today" |
| **工作日（未来）** | `/{locale}/business-days/{n}` | `/en/business-days/14` | "14 business days from today" |
| **工作日（过去）** | `/{locale}/business-days/ago/{n}` | `/en/business-days/ago/14` | "14 business days ago" |
| **从指定日期（自然日）** | `/{locale}/from/{date}/days/{n}` | `/en/from/2025-01-01/days/14` | "14 days from January 1" |
| **从指定日期（工作日）** | `/{locale}/from/{date}/business-days/{n}` | `/en/from/2025-01-01/business-days/14` | "14 business days from date" |
| **纪念日管理** | `/{locale}/anniversary` | `/en/anniversary` | "anniversary calculator" |
| **博客列表** | `/{locale}/blog` | `/en/blog` | "date calculation guide" |
| **博客文章** | `/{locale}/blog/{slug}` | `/en/blog/business-days-explained` | 文章标题 |
| **博客分类** | `/{locale}/blog/category/{category}` | `/en/blog/category/planning` | 分类名 |

### **向后兼容路由**

```typescript
// app/[locale]/[days]/page.tsx
// 保留现有路由，重定向到新路由
import { redirect } from 'next/navigation';

export default function LegacyDaysPage({ params }) {
  // 重定向到新的 /days/{n} 路由
  redirect(`/${params.locale}/days/${params.days}`);
}
```

### **动态路由生成（SEO 优化）**

```typescript
// app/[locale]/days/[n]/page.tsx
export async function generateStaticParams() {
  // 预生成高频页面
  const popularDays = [
    1, 2, 3, 5, 7, 10, 14, 15, 20, 21, 28, 30, 
    45, 60, 90, 100, 180, 365
  ];
  
  return popularDays.map(n => ({
    n: n.toString()
  }));
}

export async function generateMetadata({ params }) {
  const { locale, n } = params;
  const days = Number(n);
  const targetDate = addDays(new Date(), days);
  
  return {
    title: `${days} Days from Today - ${format(targetDate, 'MMMM d, yyyy')}`,
    description: `Calculate ${days} days from today. The date will be ${format(targetDate, 'EEEE, MMMM d, yyyy')}.`,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/days/${n}`,
      languages: {
        'en': `https://www.daysfromtoday.ai/en/days/${n}`,
        'zh': `https://www.daysfromtoday.ai/zh/days/${n}`,
      }
    },
    openGraph: {
      title: `${days} Days from Today`,
      description: `The date ${days} days from today is ${format(targetDate, 'MMMM d, yyyy')}.`,
      url: `https://www.daysfromtoday.ai/${locale}/days/${n}`,
    }
  };
}
```

---

## 🎨 UI/UX 设计原则

### **页面布局结构（参考 Calendly）**

```
┌─────────────────────────────────────────┐
│  Header (固定导航)                       │
│  - Logo                                  │
│  - 国家/时区选择器                        │
│  - 语言切换                               │
├─────────────────────────────────────────┤
│                                          │
│  Hero Section (主功能区)                 │
│  ┌────────────────────────────────────┐ │
│  │  大标题 + 描述                      │ │
│  │  ┌──────────┐    ┌──────────┐     │ │
│  │  │ 未来计算 │    │ 过去计算 │     │ │
│  │  │          │    │          │     │ │
│  │  │ [输入框] │    │ [输入框] │     │ │
│  │  │ [按钮]   │    │ [按钮]   │     │ │
│  │  └──────────┘    └──────────┘     │ │
│  └────────────────────────────────────┘ │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  结果展示区 (Answer Card)                │
│  ┌────────────────────────────────────┐ │
│  │  🗓 Target Date                    │ │
│  │  Friday, November 3, 2025          │ │
│  │                                     │ │
│  │  详细信息网格                       │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐       │ │
│  │  │起始  │ │天数  │ │结果  │       │ │
│  │  └──────┘ └──────┘ └──────┘       │ │
│  └────────────────────────────────────┘ │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  扩展信息区 (可折叠)                     │
│  ┌────────────────────────────────────┐ │
│  │  🔎 排除的日期 (工作日模式)         │ │
│  │  [展开/折叠]                        │ │
│  │                                     │ │
│  │  • 2025-10-11 (Saturday)           │ │
│  │  • 2025-10-12 (Sunday)             │ │
│  │  • 2025-10-31 (Holiday: Halloween) │ │
│  │  ...                                │ │
│  └────────────────────────────────────┘ │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  节假日提示卡 (如有)                     │
│  ┌────────────────────────────────────┐ │
│  │  🎉 Upcoming Holiday                │ │
│  │  Thanksgiving - 15 days away        │ │
│  │  [Add to Calendar]                  │ │
│  └────────────────────────────────────┘ │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  操作区                                  │
│  [📥 Download .ics] [📤 Share] [🔗 Copy Link] │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  相关功能模块 (卡片网格)                  │
│  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │工作日│  │节假日│  │纪念日│         │
│  │计算  │  │倒计时│  │管理  │         │
│  └──────┘  └──────┘  └──────┘         │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  博客/指南 (最新文章)                     │
│  ┌────────────────────────────────────┐ │
│  │  📚 Latest Guides                   │ │
│  │  [文章卡片 1] [文章卡片 2]          │ │
│  └────────────────────────────────────┘ │
│                                          │
└─────────────────────────────────────────┘
```

### **设计系统（基于现有风格）**

**颜色方案：**
```css
/* 保持现有品牌色 */
--primary: #0069FF;      /* Calendly Blue */
--primary-dark: #0052CC;
--primary-light: #4A9FFF;

--secondary: #6E56CF;    /* Purple accent */
--accent: #E93CAC;       /* Pink accent */

--success: #30A46C;
--warning: #F76B15;
--error: #E5484D;

--gray-50: #FAFAFA;
--gray-100: #F5F5F5;
--gray-900: #1A1A1A;

/* 新增：渐变背景 */
--gradient-blue: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-hero: linear-gradient(135deg, #0069FF 0%, #6E56CF 100%);
```

**组件样式规范：**
```tsx
// components/ui/Card.tsx
export function Card({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white border-0 shadow-lg',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 border-0',
  };
  
  return (
    <div className={cn(
      'rounded-2xl p-6 transition-all duration-200',
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}

// 使用示例
<Card variant="elevated">
  <h3 className="text-2xl font-bold mb-4">14 Days from Today</h3>
  <p className="text-gray-600">Friday, November 3, 2025</p>
</Card>
```

**响应式断点：**
```css
/* Tailwind 默认断点 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 笔记本 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大屏 */

/* 移动优先设计 */
.grid {
  @apply grid-cols-1;        /* 默认单列 */
  @apply md:grid-cols-2;     /* 平板双列 */
  @apply lg:grid-cols-3;     /* 桌面三列 */
}
```

### **交互动画**

```css
/* 卡片悬停效果 */
.card {
  @apply transition-all duration-200;
  @apply hover:shadow-lg hover:-translate-y-1;
}

/* 按钮点击反馈 */
.button {
  @apply active:scale-95 transition-transform;
}

/* 展开/折叠动画 */
.collapsible {
  @apply transition-all duration-300 ease-in-out;
  @apply data-[state=open]:animate-slideDown;
  @apply data-[state=closed]:animate-slideUp;
}
```

---

## 🚀 功能实施清单

### **阶段 0：基础设施准备（1-2 天）**

#### **任务 0.1: 安装依赖**

```bash
npm install date-fns date-fns-tz
npm install @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-dialog @radix-ui/react-checkbox
npm install @next/mdx gray-matter rehype-highlight
npm install -D @types/mdx
```

**验收标准：**
- [ ] `npm install` 成功无错误
- [ ] TypeScript 类型正常
- [ ] `npm run build` 通过

---

#### **任务 0.2: 创建工具函数库**

**lib/date-utils.ts**
```typescript
import { addDays, subDays, format, isValid, parseISO } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

/**
 * 时区安全的日期加法
 */
export function addDaysSafe(
  date: Date | string,
  days: number,
  timezone: string = 'UTC'
): Date {
  const baseDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(baseDate)) {
    throw new Error('Invalid date');
  }
  
  // 转换到时区 → 计算 → 转回 UTC
  const zonedDate = utcToZonedTime(baseDate, timezone);
  const result = addDays(zonedDate, days);
  
  return result;
}

/**
 * 时区安全的日期减法
 */
export function subDaysSafe(
  date: Date | string,
  days: number,
  timezone: string = 'UTC'
): Date {
  return addDaysSafe(date, -days, timezone);
}

/**
 * 格式化日期（考虑时区）
 */
export function formatInTimezone(
  date: Date,
  formatStr: string,
  timezone: string
): string {
  const zonedDate = utcToZonedTime(date, timezone);
  return format(zonedDate, formatStr);
}
```

**lib/weekend-rules.ts**
```typescript
import weekendRules from '@/data/weekend-rules.json';

export interface WeekendRule {
  days: number[];      // [0, 6] = Sunday, Saturday
  names: string[];
}

export function getWeekendDays(countryCode: string): number[] {
  return weekendRules[countryCode]?.days || [0, 6];
}

export function getWeekendNames(countryCode: string): string[] {
  return weekendRules[countryCode]?.names || ['Sunday', 'Saturday'];
}

export function isWeekend(date: Date, countryCode: string): boolean {
  const weekendDays = getWeekendDays(countryCode);
  return weekendDays.includes(date.getDay());
}
```

**lib/holidays.ts**
```typescript
export interface Holiday {
  date: string;        // ISO 8601: "2025-01-01"
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  types: string[];
}

/**
 * 获取节假日（带缓存）
 */
export async function getHolidays(
  country: string,
  year: number
): Promise<Holiday[]> {
  try {
    const response = await fetch(
      `/api/holidays?country=${country}&year=${year}`,
      { next: { revalidate: 86400 } } // 24h 缓存
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch holidays');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}

/**
 * 检查日期是否是节假日
 */
export function isHoliday(
  date: Date,
  holidays: Holiday[]
): Holiday | null {
  const dateStr = format(date, 'yyyy-MM-dd');
  return holidays.find(h => h.date === dateStr) || null;
}
```

**lib/bizdays.ts**
```typescript
import { addDays, format, isValid } from 'date-fns';
import { isWeekend } from './weekend-rules';
import { isHoliday, getHolidays, type Holiday } from './holidays';

export interface ExcludedDate {
  date: Date;
  dateStr: string;
  reason: 'weekend' | 'holiday';
  name?: string;       // 节假日名称
  dayName: string;     // "Saturday", "Sunday", etc.
}

export interface BusinessDaysResult {
  targetDate: Date;
  excludedDates: ExcludedDate[];
  totalCalendarDays: number;
  totalBusinessDays: number;
}

/**
 * 计算工作日（向未来）
 */
export async function addBusinessDays(
  startDate: Date,
  businessDays: number,
  countryCode: string,
  timezone: string = 'UTC'
): Promise<BusinessDaysResult> {
  if (!isValid(startDate)) {
    throw new Error('Invalid start date');
  }
  
  if (businessDays < 0) {
    throw new Error('Business days must be positive');
  }
  
  const excluded: ExcludedDate[] = [];
  let currentDate = new Date(startDate);
  let remainingDays = businessDays;
  let totalDays = 0;
  
  // 获取节假日数据
  const currentYear = currentDate.getFullYear();
  const nextYear = currentYear + 1;
  const holidays = [
    ...(await getHolidays(countryCode, currentYear)),
    ...(await getHolidays(countryCode, nextYear))
  ];
  
  while (remainingDays > 0) {
    currentDate = addDays(currentDate, 1);
    totalDays++;
    
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayName = format(currentDate, 'EEEE');
    
    // 检查是否是周末
    if (isWeekend(currentDate, countryCode)) {
      excluded.push({
        date: new Date(currentDate),
        dateStr,
        reason: 'weekend',
        dayName
      });
      continue;
    }
    
    // 检查是否是节假日
    const holiday = isHoliday(currentDate, holidays);
    if (holiday) {
      excluded.push({
        date: new Date(currentDate),
        dateStr,
        reason: 'holiday',
        name: holiday.localName || holiday.name,
        dayName
      });
      continue;
    }
    
    // 是工作日，计数减一
    remainingDays--;
  }
  
  return {
    targetDate: currentDate,
    excludedDates: excluded,
    totalCalendarDays: totalDays,
    totalBusinessDays: businessDays
  };
}

/**
 * 计算工作日（向过去）
 */
export async function subBusinessDays(
  startDate: Date,
  businessDays: number,
  countryCode: string,
  timezone: string = 'UTC'
): Promise<BusinessDaysResult> {
  // 类似逻辑，但使用 subDays
  // 实现略（与 addBusinessDays 对称）
}
```

**lib/storage.ts**
```typescript
/**
 * LocalStorage 封装（类型安全）
 */
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },
  
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },
  
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

// 用户偏好存储
export interface UserPreferences {
  country: string;
  timezone: string;
  locale: string;
}

export const preferences = {
  get(): UserPreferences {
    return storage.get<UserPreferences>('user_preferences', {
      country: 'US',
      timezone: 'America/New_York',
      locale: 'en'
    });
  },
  
  set(prefs: Partial<UserPreferences>): void {
    const current = this.get();
    storage.set('user_preferences', { ...current, ...prefs });
  }
};
```

**验收标准：**
- [ ] 所有工具函数有 TypeScript 类型
- [ ] 单元测试覆盖核心逻辑（可选，但推荐）
- [ ] 无 ESLint 错误

---

#### **任务 0.3: 创建 API 端点**

**app/api/holidays/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 86400; // 24 小时

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'US';
  const year = searchParams.get('year') || new Date().getFullYear().toString();
  
  try {
    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`,
      {
        next: { revalidate: 86400 },
        headers: {
          'User-Agent': 'DaysFromToday/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Nager.Date API error: ${response.status}`);
    }
    
    const holidays = await response.json();
    
    return NextResponse.json({
      success: true,
      data: holidays,
      meta: {
        country,
        year: Number(year),
        count: holidays.length,
        source: 'Nager.Date API',
        cached: true,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Holidays API error:', error);
    
    return NextResponse.json({
      success: false,
      data: [],
      meta: {
        country,
        year: Number(year),
        fallback: 'weekend-only',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}
```

**app/api/bizdays/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { addBusinessDays } from '@/lib/bizdays';
import { parseISO } from 'date-fns';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    const from = searchParams.get('from') || new Date().toISOString();
    const days = Number(searchParams.get('days') || '0');
    const country = searchParams.get('country') || 'US';
    const timezone = searchParams.get('timezone') || 'UTC';
    
    if (days < 0) {
      throw new Error('Days must be a positive number');
    }
    
    const startDate = parseISO(from);
    const result = await addBusinessDays(startDate, days, country, timezone);
    
    return NextResponse.json({
      success: true,
      data: {
        startDate: from,
        targetDate: result.targetDate.toISOString(),
        businessDays: days,
        calendarDays: result.totalCalendarDays,
        excludedDates: result.excludedDates.map(d => ({
          date: d.dateStr,
          reason: d.reason,
          name: d.name,
          dayName: d.dayName
        }))
      },
      meta: {
        country,
        timezone,
        calculatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
```

**验收标准：**
- [ ] `/api/holidays?country=US&year=2025` 返回正确数据
- [ ] `/api/bizdays?from=2025-01-01&days=14&country=US` 返回正确结果
- [ ] API 错误处理正常（400/500 状态码）
- [ ] Edge Runtime 部署成功

---

### **阶段 1：核心功能实现（3-5 天）**

#### **任务 1.1: 未来/过去日期计算**

**app/[locale]/days/[n]/page.tsx**
```typescript
import { addDaysSafe, formatInTimezone } from '@/lib/date-utils';
import { format } from 'date-fns';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const popularDays = [
    1, 2, 3, 5, 7, 10, 14, 15, 20, 21, 28, 30, 
    45, 60, 90, 100, 180, 365
  ];
  
  return popularDays.map(n => ({ n: n.toString() }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, n } = await params;
  const days = Number(n);
  const targetDate = addDaysSafe(new Date(), days);
  
  const title = `${days} Days from Today - ${format(targetDate, 'MMMM d, yyyy')}`;
  const description = `Calculate ${days} days from today. The date will be ${format(targetDate, 'EEEE, MMMM d, yyyy')}.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/days/${n}`,
      languages: {
        'en': `https://www.daysfromtoday.ai/en/days/${n}`,
        'zh': `https://www.daysfromtoday.ai/zh/days/${n}`,
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/days/${n}`,
      type: 'website'
    }
  };
}

export default async function DaysFromTodayPage({ params }) {
  const { locale, n } = await params;
  const days = Number(n);
  
  // 计算目标日期
  const today = new Date();
  const targetDate = addDaysSafe(today, days);
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          {days} Days from Today
        </h1>
        <p className="text-xl text-gray-600">
          {format(targetDate, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      
      {/* Answer Card */}
      <AnswerCard
        days={days}
        startDate={today}
        targetDate={targetDate}
        direction="future"
      />
      
      {/* Related Tools */}
      <RelatedToolsGrid currentTool="days" />
    </div>
  );
}
```

**app/[locale]/days/ago/[n]/page.tsx**
```typescript
// 类似结构，使用 subDaysSafe
```

**验收标准：**
- [ ] `/en/days/14` 显示正确日期
- [ ] `/en/days/ago/14` 显示正确日期
- [ ] 跨月、跨年计算正确
- [ ] SEO metadata 完整
- [ ] Mobile 响应式正常

---

#### **任务 1.2: 工作日计算器**

**app/[locale]/business-days/[n]/page.tsx**
```typescript
import { addBusinessDays } from '@/lib/bizdays';
import { BusinessDaysResultCard } from '@/components/calculators/BusinessDaysResultCard';
import { ExcludedDatesList } from '@/components/calculators/ExcludedDatesList';

export default async function BusinessDaysPage({ params }) {
  const { locale, n } = await params;
  const days = Number(n);
  const country = 'US'; // 后续从用户偏好获取
  
  const today = new Date();
  const result = await addBusinessDays(today, days, country);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-center mb-4">
        {days} Business Days from Today
      </h1>
      <p className="text-xl text-gray-600 text-center mb-12">
        Excluding weekends and holidays
      </p>
      
      <BusinessDaysResultCard result={result} days={days} />
      
      <ExcludedDatesList 
        excludedDates={result.excludedDates}
        country={country}
      />
    </div>
  );
}
```

**components/calculators/ExcludedDatesList.tsx**
```typescript
'use client';

import { useState } from 'react';
import { ExcludedDate } from '@/lib/bizdays';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function ExcludedDatesList({ 
  excludedDates, 
  country 
}: { 
  excludedDates: ExcludedDate[];
  country: string;
}) {
  const [expanded, setExpanded] = useState(false);
  
  const weekends = excludedDates.filter(d => d.reason === 'weekend');
  const holidays = excludedDates.filter(d => d.reason === 'holiday');
  
  if (excludedDates.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold">Excluded Dates</h3>
            <p className="text-sm text-gray-600">
              {weekends.length} weekends, {holidays.length} holidays
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      
      {expanded && (
        <div className="mt-6 space-y-4">
          {/* Summary Badges */}
          <div className="flex gap-2">
            <Badge variant="secondary">
              {weekends.length} Weekends
            </Badge>
            <Badge variant="primary">
              {holidays.length} Holidays
            </Badge>
          </div>
          
          {/* Holidays List */}
          {holidays.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Holidays Excluded:
              </h4>
              <ul className="space-y-2">
                {holidays.map((holiday, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <div>
                      <strong>{holiday.name}</strong>
                      <span className="text-gray-600 ml-2">
                        {holiday.dateStr} ({holiday.dayName})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Weekends Summary */}
          <div className="text-sm text-gray-600">
            + {weekends.length} weekend days excluded
          </div>
        </div>
      )}
    </div>
  );
}
```

**验收标准：**
- [ ] 工作日计算排除周末正确
- [ ] 节假日数据加载成功
- [ ] 排除列表展示清晰
- [ ] 可折叠/展开功能正常

---

（完整的实施清单继续...）

---

## 📊 SEO 优化策略

### **每个页面必须包含的 SEO 元素**

```typescript
// 标准 SEO 模板
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    // 1. 基础 Meta
    title: "...",
    description: "...",
    keywords: ["date calculator", "business days", "..."],
    
    // 2. Canonical + Alternates
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/...`,
      languages: {
        'en': `https://www.daysfromtoday.ai/en/...`,
        'zh': `https://www.daysfromtoday.ai/zh/...`,
      }
    },
    
    // 3. Open Graph
    openGraph: {
      title: "...",
      description: "...",
      url: `https://www.daysfromtoday.ai/${locale}/...`,
      siteName: 'DaysFromToday',
      type: 'website',
      images: [{
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      }]
    },
    
    // 4. Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: "...",
      description: "...",
      images: ['/og-image.jpg'],
    }
  };
}
```

### **JSON-LD 结构化数据**

```typescript
// 每个页面添加 FAQ Schema
export function FAQSchema({ questions }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': questions.map(q => ({
            '@type': 'Question',
            'name': q.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': q.answer
            }
          }))
        })
      }}
    />
  );
}
```

---

## ⚡ 性能与缓存策略

### **ISR（增量静态生成）策略**

```typescript
// 高频页面：预生成 + 10 分钟重新验证
export const revalidate = 600;

// 节假日 API：24 小时缓存
export const revalidate = 86400;

// 用户内容（纪念日）：客户端渲染
// 无需 revalidate
```

### **图片优化**

```tsx
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Date Calculator"
  width={1200}
  height={630}
  priority // Hero 图片优先加载
  placeholder="blur" // 模糊占位
/>
```

---

## ✅ 测试与验收标准

### **单元测试（推荐但可选）**

```typescript
// lib/__tests__/bizdays.test.ts
import { addBusinessDays } from '../bizdays';

describe('addBusinessDays', () => {
  it('should exclude weekends', async () => {
    // 2025-01-01 是周三
    const start = new Date('2025-01-01');
    const result = await addBusinessDays(start, 5, 'US');
    
    // 5 个工作日 = 周三到下周二（跳过周末）
    expect(result.targetDate).toEqual(new Date('2025-01-08'));
    expect(result.excludedDates.length).toBe(2); // 周六日
  });
  
  it('should exclude holidays', async () => {
    // 测试包含节假日的情况
  });
});
```

### **E2E 测试（关键路径）**

```typescript
// Playwright 示例
test('calculate 14 days from today', async ({ page }) => {
  await page.goto('/en/days/14');
  
  // 检查标题
  await expect(page.locator('h1')).toContainText('14 Days from Today');
  
  // 检查日期显示
  const dateElement = page.locator('[data-testid="target-date"]');
  await expect(dateElement).toBeVisible();
  
  // 检查 SEO meta
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute('href', /\/en\/days\/14/);
});
```

### **验收清单**

**功能验收：**
- [ ] 所有计算结果与手动验证一致
- [ ] 跨月、跨年、闰年边界情况正确
- [ ] 不同国家周末规则正确（US, AE, IL）
- [ ] 节假日数据加载成功
- [ ] 错误处理友好（无效输入、API 失败）

**SEO 验收：**
- [ ] 所有页面有 canonical 标签
- [ ] hreflang 标签正确
- [ ] JSON-LD 结构化数据验证通过
- [ ] sitemap.xml 包含所有新页面
- [ ] robots.txt 允许抓取

**性能验收：**
- [ ] Lighthouse 分数 > 90（所有指标）
- [ ] LCP < 2.5s
- [ ] FID/INP < 100ms
- [ ] CLS < 0.1
- [ ] 移动端体验良好

**可访问性验收：**
- [ ] WCAG AA 标准通过
- [ ] 键盘导航正常
- [ ] 屏幕阅读器友好
- [ ] 颜色对比度 > 4.5:1

---

## 📅 实施时间表

### **第 1 周：基础设施 + 核心功能**

| 天数 | 任务 | 产出 |
|------|------|------|
| Day 1 | 依赖安装 + 工具函数库 | `lib/` 完成 |
| Day 2 | API 端点实现 | `/api/holidays`, `/api/bizdays` |
| Day 3 | 未来/过去日期页面 | `/days/[n]`, `/days/ago/[n]` |
| Day 4 | 工作日计算器 | `/business-days/[n]` |
| Day 5 | 排除日期展示 + 测试 | `ExcludedDatesList` 组件 |

### **第 2 周：高级功能 + UI 优化**

| 天数 | 任务 | 产出 |
|------|------|------|
| Day 6 | 国家/时区选择器 | `CountrySelector` 组件 |
| Day 7 | 节假日倒计时页面 | `/holidays` |
| Day 8 | 纪念日管理功能 | `/anniversary` |
| Day 9 | 首页模块化改版 | Hero + 功能卡片 |
| Day 10 | UI 优化 + 响应式调整 | 移动端完善 |

### **第 3 周：博客系统 + SEO**

| 天数 | 任务 | 产出 |
|------|------|------|
| Day 11 | MDX 配置 + 博客列表页 | `/blog` |
| Day 12 | 博客详情页 + 组件 | `/blog/[slug]` |
| Day 13 | FAQ 迁移到博客 | 第一篇文章 |
| Day 14 | SEO 全面检查 | metadata, schema, sitemap |
| Day 15 | 性能优化 + 缓存调优 | Lighthouse 95+ |

### **第 4 周：测试 + 上线**

| 天数 | 任务 | 产出 |
|------|------|------|
| Day 16-17 | E2E 测试 + Bug 修复 | 测试通过 |
| Day 18 | 多国数据验证 | US, CN, UK, DE |
| Day 19 | 部署到 Vercel Production | 上线 |
| Day 20 | 监控 + 收集反馈 | GA4 数据 |

---

## 🚨 风险评估与回滚计划

### **潜在风险**

| 风险 | 影响 | 概率 | 缓解策略 |
|------|------|------|---------|
| Nager.Date API 不稳定 | 高 | 低 | 本地备份数据 + 降级策略 |
| 性能下降（大量节假日数据） | 中 | 中 | ISR 缓存 + Edge Config |
| 新路由与旧路由冲突 | 中 | 低 | 重定向 + 测试 |
| 移动端布局问题 | 低 | 中 | 移动优先设计 + 测试 |

### **回滚计划**

```bash
# 如果新功能出现问题，快速回滚到上一个稳定版本
git revert <commit-hash>
git push origin main
vercel --prod --force
```

**分阶段上线策略：**
1. **Week 1 结束：** 核心功能上线（未来/过去 + 工作日）
2. **Week 2 结束：** 高级功能上线（节假日 + 纪念日）
3. **Week 3 结束：** 博客系统上线
4. **每周五：** 代码审查 + 性能监控

---

## 📚 参考资源

- [Next.js App Router 文档](https://nextjs.org/docs/app)
- [date-fns 文档](https://date-fns.org/)
- [Nager.Date API](https://date.nager.at/Api)
- [Radix UI](https://www.radix-ui.com/)
- [Vercel Edge Runtime](https://vercel.com/docs/functions/edge-functions)
- [Calendly 设计参考](https://calendly.com/)

---

## ✅ 确认清单

在开始开发前，请确认以下事项：

- [ ] 我理解了整体技术架构
- [ ] 依赖选择合理且最小化
- [ ] 路由规划符合 SEO 要求
- [ ] UI 设计与现有风格一致
- [ ] 性能指标有明确目标
- [ ] 测试和验收标准清晰
- [ ] 时间表合理可行
- [ ] 风险已识别并有缓解策略

---

**下一步：**

请审阅本方案，确认后我们将开始执行 **阶段 0：基础设施准备**。

如有任何疑问或需要调整，请告知！🚀

