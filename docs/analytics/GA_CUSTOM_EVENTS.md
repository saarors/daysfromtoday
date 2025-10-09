# 🎯 Google Analytics 自定义事件设置指南

> **目标**: 追踪关键用户行为，优化产品功能  
> **适用**: DaysFromToday v2.0+  
> **前置条件**: GA4 已部署 (G-9D2SZK734G)  

---

## 📋 核心事件体系

### 事件优先级分级

| 优先级 | 说明 | 实施时间 |
|--------|------|---------|
| **P0** | 基础事件，自动采集 | ✅ 已完成 |
| **P1** | 核心业务指标，立即实施 | 本周 |
| **P2** | 重要功能指标，2周内实施 | 2周内 |
| **P3** | 优化指标，1月内实施 | 1月内 |

---

## 🎯 P0: 基础事件（已自动采集）

### 1. page_view

**说明**: 页面浏览事件  
**触发**: 自动，每次页面加载  
**参数**:
```javascript
{
  page_location: "https://www.daysfromtoday.ai/zh/days/7",
  page_title: "7 Days from Today",
  page_path: "/zh/days/7"
}
```

**用途**:
- 流量统计
- 热门页面分析
- 用户路径分析

---

### 2. scroll

**说明**: 页面滚动事件  
**触发**: 自动，用户滚动到 90%  
**参数**:
```javascript
{
  percent_scrolled: 90
}
```

**用途**:
- 内容吸引力评估
- 博客完读率统计

---

### 3. session_start

**说明**: 会话开始事件  
**触发**: 自动，新会话开始  
**参数**:
```javascript
{
  session_id: "1234567890.1234567890"
}
```

**用途**:
- 会话统计
- 用户活跃度分析

---

## 🔥 P1: 核心业务事件（立即实施）

### 1. share_click

**业务意义**: 衡量内容传播力和用户参与度  
**触发条件**: 用户点击任何分享按钮  
**优先级**: ⭐⭐⭐⭐⭐

#### 实施代码

**位置**: `components/DateCalculator.tsx` (分享按钮组件)

```typescript
'use client';

import { useCallback } from 'react';

// 声明 gtag 类型
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function ShareButton({ 
  platform, 
  url, 
  text 
}: { 
  platform: string;
  url: string; 
  text: string;
}) {
  const handleShare = useCallback(() => {
    // 发送 GA 事件
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share_click', {
        method: platform, // 'twitter', 'facebook', 'linkedin'
        content_type: 'date_calculation',
        item_id: url
      });
    }
    
    // 执行分享逻辑
    // ...
  }, [platform, url]);

  return (
    <button onClick={handleShare}>
      Share on {platform}
    </button>
  );
}
```

#### 事件参数

| 参数 | 类型 | 说明 | 示例 |
|-----|------|------|------|
| `method` | string | 分享平台 | 'twitter', 'facebook', 'linkedin' |
| `content_type` | string | 内容类型 | 'date_calculation', 'blog', 'anniversary' |
| `item_id` | string | 内容 ID | '/zh/days/7' |

#### 分析用途

```
Reports → Events → share_click

分析维度:
1. 哪个平台分享最多？
2. 哪种内容被分享最多？
3. 分享率趋势如何？

优化方向:
• 分享率 < 5%: 优化分享按钮位置和设计
• 某平台分享多: 加强该平台运营
• 某内容分享多: 扩展相似内容
```

---

### 2. calendar_download

**业务意义**: 核心转化指标，用户价值体现  
**触发条件**: 用户点击"下载 ICS 文件"或"添加到日历"  
**优先级**: ⭐⭐⭐⭐⭐

#### 实施代码

**位置**: `lib/ics-generator.ts` (ICS 下载函数)

```typescript
export function downloadDateCalculationICS(
  days: number,
  targetDate: Date,
  type: 'future' | 'past',
  mode: 'calendar' | 'business'
) {
  // 发送 GA 事件
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calendar_download', {
      calculation_type: `${type}_${mode}`, // 'future_calendar', 'past_business'
      days_count: days,
      target_date: targetDate.toISOString().split('T')[0]
    });
  }
  
  // 执行下载逻辑
  // ...
}
```

#### 事件参数

| 参数 | 类型 | 说明 | 示例 |
|-----|------|------|------|
| `calculation_type` | string | 计算类型 | 'future_calendar', 'future_business', 'past_calendar', 'past_business' |
| `days_count` | number | 天数 | 7, 30, 90 |
| `target_date` | string | 目标日期 | '2025-10-15' |

#### 分析用途

```
Reports → Conversions → calendar_download

分析维度:
1. 下载转化率是多少？
2. 哪种计算类型下载最多？
3. 哪个天数被下载最多？

目标设定:
• 转化率目标: > 10%
• 每日下载目标: > 50 次

优化方向:
• 转化率低: 优化下载按钮设计和位置
• 某类型下载多: 优先优化该类型功能
```

---

## 🎯 P2: 重要功能事件（2周内实施）

### 3. anniversary_create

**业务意义**: 核心功能使用率，用户粘性指标  
**触发条件**: 用户成功创建纪念日  
**优先级**: ⭐⭐⭐⭐

#### 实施代码

**位置**: `lib/anniversary-utils.ts` (纪念日创建函数)

```typescript
export function createAnniversary(anniversary: Anniversary): void {
  // 保存到 localStorage
  const anniversaries = getAnniversaries();
  anniversaries.push(anniversary);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(anniversaries));
  
  // 发送 GA 事件
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'anniversary_create', {
      anniversary_type: anniversary.type, // 'birthday', 'wedding', etc.
      recurring: anniversary.recurring,
      days_until: Math.floor(
        (new Date(anniversary.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    });
  }
}
```

#### 事件参数

| 参数 | 类型 | 说明 | 示例 |
|-----|------|------|------|
| `anniversary_type` | string | 纪念日类型 | 'birthday', 'wedding', 'holiday', 'other' |
| `recurring` | boolean | 是否重复 | true, false |
| `days_until` | number | 距离天数 | 30, 90, 365 |

#### 分析用途

```
Reports → Events → anniversary_create

分析维度:
1. 纪念日创建率？
2. 最受欢迎的类型？
3. 重复纪念日占比？

目标设定:
• 每日创建: > 10 个
• 重复纪念日比例: > 60%

优化方向:
• 创建率低: 简化创建流程
• 某类型创建多: 提供更多该类型模板
```

---

### 4. country_change

**业务意义**: 国际化需求分析，多国家支持验证  
**触发条件**: 用户切换国家选择器  
**优先级**: ⭐⭐⭐

#### 实施代码

**位置**: `components/CountrySelector.tsx`

```typescript
const handleCountryChange = (newCountry: CountryCode) => {
  // 发送 GA 事件
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'country_change', {
      from_country: country,
      to_country: newCountry,
      source: source === 'auto' ? 'manual_override' : 'user_selection'
    });
  }
  
  // 执行切换逻辑
  setCountry(newCountry, 'user');
};
```

#### 事件参数

| 参数 | 类型 | 说明 | 示例 |
|-----|------|------|------|
| `from_country` | string | 切换前国家 | 'US', 'CN', 'GB' |
| `to_country` | string | 切换后国家 | 'US', 'CN', 'GB' |
| `source` | string | 切换来源 | 'manual_override', 'user_selection' |

#### 分析用途

```
Reports → Events → country_change

分析维度:
1. 用户手动切换国家频率？
2. 最常切换的国家组合？
3. 自动检测准确率？

优化方向:
• 切换频率高: 优化自动检测逻辑
• 某国家切换多: 可能需要该国家的本地化内容
```

---

## 📝 P3: 优化指标事件（1月内实施）

### 5. blog_read_complete

**业务意义**: 内容质量评估，用户参与度  
**触发条件**: 用户滚动到博客文章底部（90%+）  
**优先级**: ⭐⭐⭐

#### 实施代码

**位置**: `app/[locale]/blog/[slug]/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

export function BlogReadTracker({ slug }: { slug: string }) {
  const [hasTracked, setHasTracked] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (hasTracked) return;
      
      const scrollPercent = 
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      
      if (scrollPercent >= 90) {
        // 发送 GA 事件
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'blog_read_complete', {
            blog_slug: slug,
            reading_time_estimate: '6min', // 可以动态计算
          });
        }
        setHasTracked(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug, hasTracked]);
  
  return null;
}
```

#### 事件参数

| 参数 | 类型 | 说明 | 示例 |
|-----|------|------|------|
| `blog_slug` | string | 博客标识 | 'why-i-built-daysfromtoday' |
| `reading_time_estimate` | string | 预计阅读时间 | '6min', '10min' |

#### 分析用途

```
Reports → Events → blog_read_complete

分析维度:
1. 完读率是多少？
2. 哪篇博客完读率最高？
3. 完读用户的后续行为？

目标设定:
• 完读率: > 30%

优化方向:
• 完读率低: 优化内容结构和可读性
• 完读率高的博客: 扩展相似主题
```

---

### 6. custom_days_input

**业务意义**: 用户自定义需求分析  
**触发条件**: 用户在自定义输入框输入天数并计算  
**优先级**: ⭐⭐

#### 实施代码

**位置**: `app/[locale]/home-client.tsx`

```typescript
const handleCustomCalculate = (
  days: string, 
  type: 'future' | 'past', 
  mode: 'calendar' | 'business'
) => {
  const num = parseInt(days);
  if (isNaN(num) || num <= 0) return;
  
  // 发送 GA 事件
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'custom_days_input', {
      days_value: num,
      calculation_type: `${type}_${mode}`,
      is_common_value: [7, 14, 30, 90, 180, 365].includes(num)
    });
  }
  
  // 执行计算导航
  const basePath = mode === 'calendar' ? 'days' : 'business-days';
  const agoPart = type === 'past' ? '/ago' : '';
  router.push(`/${locale}/${basePath}${agoPart}/${num}`);
};
```

#### 事件参数

| 参数 | 类型 | 说明 | 示例 |
|-----|------|------|------|
| `days_value` | number | 输入天数 | 7, 45, 1000 |
| `calculation_type` | string | 计算类型 | 'future_calendar', 'past_business' |
| `is_common_value` | boolean | 是否常用值 | true, false |

#### 分析用途

```
Reports → Events → custom_days_input

分析维度:
1. 用户最常输入的天数？
2. 非常用值的分布？
3. 自定义输入占比？

优化方向:
• 高频自定义值: 添加到快捷按钮
• 自定义占比高: 优化预设值列表
```

---

## 🛠️ 实施步骤

### Step 1: 创建全局事件追踪工具

**文件**: `lib/ga-events.ts`

```typescript
/**
 * Google Analytics 事件追踪工具
 */

// 声明 gtag 类型
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * 检查 GA 是否可用
 */
function isGAAvailable(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.gtag === 'function';
}

/**
 * 发送自定义事件
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (!isGAAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('GA Event (dev):', eventName, params);
    }
    return;
  }
  
  window.gtag!('event', eventName, params);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('GA Event:', eventName, params);
  }
}

/**
 * P1 事件: 分享点击
 */
export function trackShareClick(
  platform: string,
  contentType: string,
  itemId: string
) {
  trackEvent('share_click', {
    method: platform,
    content_type: contentType,
    item_id: itemId
  });
}

/**
 * P1 事件: 日历下载
 */
export function trackCalendarDownload(
  type: 'future' | 'past',
  mode: 'calendar' | 'business',
  days: number,
  targetDate: string
) {
  trackEvent('calendar_download', {
    calculation_type: `${type}_${mode}`,
    days_count: days,
    target_date: targetDate
  });
}

/**
 * P2 事件: 纪念日创建
 */
export function trackAnniversaryCreate(
  type: string,
  recurring: boolean,
  daysUntil: number
) {
  trackEvent('anniversary_create', {
    anniversary_type: type,
    recurring,
    days_until: daysUntil
  });
}

/**
 * P2 事件: 国家切换
 */
export function trackCountryChange(
  fromCountry: string,
  toCountry: string,
  source: string
) {
  trackEvent('country_change', {
    from_country: fromCountry,
    to_country: toCountry,
    source
  });
}

/**
 * P3 事件: 博客完读
 */
export function trackBlogComplete(
  slug: string,
  readingTime: string
) {
  trackEvent('blog_read_complete', {
    blog_slug: slug,
    reading_time_estimate: readingTime
  });
}

/**
 * P3 事件: 自定义天数输入
 */
export function trackCustomDaysInput(
  days: number,
  type: 'future' | 'past',
  mode: 'calendar' | 'business',
  isCommon: boolean
) {
  trackEvent('custom_days_input', {
    days_value: days,
    calculation_type: `${type}_${mode}`,
    is_common_value: isCommon
  });
}
```

---

### Step 2: 在组件中使用

**示例 1**: 分享按钮

```typescript
import { trackShareClick } from '@/lib/ga-events';

function ShareButton() {
  const handleClick = () => {
    trackShareClick('twitter', 'date_calculation', '/zh/days/7');
    // ... 执行分享
  };
  
  return <button onClick={handleClick}>Share</button>;
}
```

**示例 2**: ICS 下载

```typescript
import { trackCalendarDownload } from '@/lib/ga-events';

export function downloadICS(/* ... */) {
  trackCalendarDownload('future', 'calendar', 7, '2025-10-15');
  // ... 执行下载
}
```

---

### Step 3: 验证事件

#### 开发环境验证

1. 查看浏览器控制台
2. 确认事件日志输出

#### 生产环境验证

1. 打开 GA4 → Reports → Realtime
2. 触发事件
3. 在 "Event count by Event name" 中查看
4. 通常 5-10 秒内显示

#### DebugView 验证（推荐）

1. 安装 [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)
2. 开启 Debug 模式
3. 在 GA4 → Admin → DebugView 中查看实时事件
4. 可以看到完整的事件参数

---

## 📊 事件分析看板

### 在 GA4 中创建自定义报告

**路径**: GA4 → Explore → Create new exploration

**推荐看板**:

#### 1. 用户参与看板

```
指标:
• share_click 次数
• calendar_download 次数
• anniversary_create 次数

维度:
• 日期
• 页面路径
• 地理位置

可视化: 趋势线图
```

#### 2. 功能使用漏斗

```
步骤:
1. page_view (所有用户)
2. scroll (滚动用户)
3. share_click / calendar_download (互动用户)

转化率目标:
• 滚动率: > 60%
• 互动率: > 10%
```

#### 3. 内容表现对比

```
维度: blog_slug
指标:
• page_view
• blog_read_complete
• 平均停留时间

排序: 按完读率降序
```

---

## 🎯 事件成功指标

### P1 事件目标（首月）

| 事件 | 当前 | 目标 | 达成策略 |
|-----|------|------|---------|
| `share_click` | - | 100+/月 | 优化分享按钮设计和位置 |
| `calendar_download` | - | 200+/月 | 突出下载功能，简化流程 |

### P2 事件目标（首月）

| 事件 | 当前 | 目标 | 达成策略 |
|-----|------|------|---------|
| `anniversary_create` | - | 50+/月 | 主页引导，简化创建流程 |
| `country_change` | - | 数据分析 | 评估自动检测准确性 |

### P3 事件目标（首月）

| 事件 | 当前 | 目标 | 达成策略 |
|-----|------|------|---------|
| `blog_read_complete` | - | 30%+ 完读率 | 优化内容质量和可读性 |
| `custom_days_input` | - | 数据分析 | 发现高频自定义值 |

---

## 📋 实施清单

### 本周完成（P1 事件）

- [ ] 创建 `lib/ga-events.ts` 工具文件
- [ ] 实施 `share_click` 事件
- [ ] 实施 `calendar_download` 事件
- [ ] 开发环境验证
- [ ] 生产环境部署
- [ ] DebugView 验证

### 2 周内完成（P2 事件）

- [ ] 实施 `anniversary_create` 事件
- [ ] 实施 `country_change` 事件
- [ ] 创建 GA4 自定义报告
- [ ] 建立每周监控流程

### 1 月内完成（P3 事件）

- [ ] 实施 `blog_read_complete` 事件
- [ ] 实施 `custom_days_input` 事件
- [ ] 完整事件数据分析
- [ ] 优化建议报告

---

**文档版本**: v1.0  
**最后更新**: 2025-10-08  
**状态**: 待实施  
**预计完成**: 2025-10-31  

