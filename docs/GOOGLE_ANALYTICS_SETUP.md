# 🎯 Google Analytics 4 (GA4) 完整配置指南

本文档记录 DaysFromToday.ai 项目中 Google Analytics 4 的完整配置过程和排查步骤。

---

## 📋 目录

1. [配置概览](#配置概览)
2. [核心问题与解决方案](#核心问题与解决方案)
3. [验证步骤](#验证步骤)
4. [常见问题排查](#常见问题排查)
5. [技术实现细节](#技术实现细节)

---

## 🎯 配置概览

### **环境变量**

在 Vercel 中设置：

```bash
Name: NEXT_PUBLIC_GA_ID
Value: [GA_ID]
Environment: ✅ Production (必须勾选)
```

**重要提示：**
- 变量名必须以 `NEXT_PUBLIC_` 开头（客户端访问）
- 修改环境变量后**必须重新部署**才能生效
- Production 环境必须勾选

---

## 🔧 核心问题与解决方案

### **问题 1：使用普通 `<script>` 标签**

❌ **错误做法：**
```typescript
<script async src="https://www.googletagmanager.com/gtag/js?id=..."></script>
<script dangerouslySetInnerHTML={{...}}></script>
```

**问题：** Next.js 15 App Router 不支持在 `<head>` 或 `<body>` 中直接使用普通 `<script>` 标签。

---

### **问题 2：脚本放在 `<head>` 中**

❌ **错误做法：**
```typescript
<html>
  <head>
    <script>...</script>  // 会被忽略
  </head>
  <body>...</body>
</html>
```

**问题：** Next.js 15 严格控制 `<head>` 内容，只允许 `<meta>`, `<title>`, `<link>` 等元数据标签。

---

### ✅ **正确解决方案：使用 `next/script` 组件**

**在 `app/[locale]/layout.tsx` 中：**

```typescript
import Script from "next/script";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  
  return (
    <html lang={locale}>
      <head>
        {/* 只放元数据 */}
      </head>
      
      <body>
        {/* ✅ GA 脚本放在 body 内，使用 Script 组件 */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* ✅ SPA 路由追踪 */}
        {gaId && <GATracker />}

        {children}
      </body>
    </html>
  );
}
```

---

## 🔍 验证步骤

### **Step 1：命令行快速验证**

```bash
curl -s 'https://www.daysfromtoday.ai/en' | grep '[GA_ID]'
```

**预期输出：**
```html
<script src="https://www.googletagmanager.com/gtag/js?id=[GA_ID]" ...
window.dataLayer = window.dataLayer || [];
gtag('config', '[GA_ID]', {
```

---

### **Step 2：浏览器源代码验证**

1. 访问：https://www.daysfromtoday.ai/en
2. 右键 → "查看源代码" (View Page Source)
3. `Ctrl/Cmd + F` 搜索：`[GA_ID]`
4. ✅ 应该在 `<body>` 标签内找到 GA 脚本

---

### **Step 3：DevTools Network 验证**

1. 按 `F12` 打开 DevTools
2. 切换到 **Network** 标签
3. 硬刷新页面（`Ctrl/Cmd + Shift + R`）
4. 搜索：`gtag` 或 `googletagmanager`

**预期结果：**
```
✅ gtag/js?id=[GA_ID]  (Status: 200)
✅ collect?v=2&...           (Status: 200)
```

---

### **Step 4：Console 验证**

在 DevTools Console 中：

```javascript
typeof gtag
// 应该返回: "function" ✅

window.dataLayer
// 应该返回: Array [...] ✅
```

---

### **Step 5：Google Analytics 实时报告**

1. 访问：https://analytics.google.com/
2. 选择属性：`DaysFromToday ([GA_ID])`
3. 报告 → 实时 → 概览
4. 打开网站：https://www.daysfromtoday.ai/en
5. ✅ 应该看到 **1 个活跃用户**

---

### **Step 6：GA Test Installation**

1. GA 管理后台 → Admin → Data Streams → Web
2. 点击 Web 流 → 展开 **Tagging instructions**
3. 点击 **Test Installation**
4. ✅ 应该显示：
   ```
   ✅ Your Google tag was detected on "www.daysfromtoday.ai"
   ```

---

## 🚨 常见问题排查

### **问题 A：页面源代码中找不到 GA 代码**

**原因：**
1. 环境变量未设置或未生效
2. 没有重新部署
3. 使用了普通 `<script>` 标签而不是 `Script` 组件

**解决方案：**
1. 确认 Vercel 环境变量正确设置
2. 在 Vercel 中 Redeploy
3. 使用 `next/script` 组件

---

### **问题 B：Network 中看不到 GA 请求**

**原因：**
1. 广告拦截器拦截了 GA
2. CSP (Content Security Policy) 拦截
3. 浏览器缓存

**解决方案：**

#### **1. 无痕模式测试**
- 打开浏览器无痕窗口
- 访问网站
- 查看 Network

#### **2. 关闭广告拦截器**
- AdBlock
- uBlock Origin
- Privacy Badger
- Ghostery

#### **3. 检查 CSP 错误**
在 Console 中查看是否有：
```
❌ Refused to load script ... because it violates the Content Security Policy
```

如果有 CSP 错误，在 `next.config.ts` 中添加：

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
              "img-src 'self' data: https://www.google-analytics.com",
            ].join('; ')
          }
        ]
      }
    ]
  }
}
```

---

### **问题 C：GA Test Installation 仍然失败**

**可能原因：**
1. DNS 缓存未清除
2. Vercel Edge CDN 缓存
3. 浏览器缓存

**解决方案：**
1. 等待 5-10 分钟
2. 硬刷新（`Ctrl/Cmd + Shift + R`）
3. 清除浏览器缓存
4. 使用无痕模式测试

---

## 🔬 技术实现细节

### **1. Script 组件的 `strategy` 选项**

```typescript
<Script
  src="..."
  strategy="afterInteractive"  // ← 关键参数
/>
```

**可选值：**
- `beforeInteractive`: 在页面可交互前加载（阻塞）
- `afterInteractive`: 在页面可交互后加载（推荐）✅
- `lazyOnload`: 空闲时才加载（最低优先级）
- `worker`: 在 Web Worker 中加载

**推荐使用 `afterInteractive`：**
- 不阻塞首屏渲染
- 确保 DOM 已准备好
- GA 可以正常工作

---

### **2. 为什么需要给脚本添加 `id`**

```typescript
<Script id="google-analytics" strategy="afterInteractive">
  {`...`}
</Script>
```

**原因：**
- Next.js 使用 `id` 来去重
- 防止同一个脚本被多次注入
- 在开发模式下很重要（热重载）

---

### **3. GATracker 组件的作用**

`app/ga-tracker.tsx` 追踪 SPA 路由变化：

```typescript
'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function GATracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId || typeof window === 'undefined' || !('gtag' in window)) return;
    
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
    
    // @ts-ignore
    window.gtag('config', gaId, { page_path: url });
  }, [pathname, searchParams]);

  return null;
}
```

**功能：**
- 监听路由变化（`pathname` 和 `searchParams`）
- 自动向 GA 报告页面浏览
- 适用于 SPA 导航（无刷新）

**使用场景：**
- 用户从 `/en` 跳转到 `/en/days/7`
- 不刷新页面的导航
- 确保 GA 追踪到每一次页面切换

---

## 📊 性能考虑

### **GA 对页面加载速度的影响**

| 指标 | 影响 |
|------|------|
| **LCP (Largest Contentful Paint)** | 无影响（异步加载） |
| **INP (Interaction to Next Paint)** | 无影响 |
| **CLS (Cumulative Layout Shift)** | 无影响 |
| **首屏加载时间** | +200-300ms（可接受） |

**优化建议：**
- ✅ 使用 `strategy="afterInteractive"`
- ✅ 不要使用 `beforeInteractive`
- ✅ GA 脚本是异步的，不阻塞渲染

---

## 🔒 隐私与合规

### **GDPR / CCPA 合规**

目前配置：
```javascript
gtag('config', '[GA_ID]', {
  page_path: window.location.pathname,
  // anonymize_ip: true,  // 可选：IP 匿名化
});
```

**未来增强（如果需要）：**

1. **添加 Cookie Consent Banner**
   - 使用 `react-cookie-consent` 或类似库
   - 用户同意后再加载 GA

2. **IP 匿名化**
   ```javascript
   gtag('config', '[GA_ID]', {
     anonymize_ip: true,
   });
   ```

3. **数据保留期限**
   - GA 管理后台 → Admin → Data Settings → Data Retention
   - 设置为 14 个月或更短

---

## ✅ 检查清单（Deployment Checklist）

部署前确认：

- [ ] ✅ Vercel 环境变量 `NEXT_PUBLIC_GA_ID` 已设置
- [ ] ✅ 环境变量勾选了 **Production**
- [ ] ✅ 使用了 `next/script` 组件（不是普通 `<script>`）
- [ ] ✅ `strategy="afterInteractive"` 已设置
- [ ] ✅ 脚本有 `id="google-analytics"`
- [ ] ✅ `GATracker` 组件已添加到 layout
- [ ] ✅ 部署完成后已重新测试
- [ ] ✅ 无痕模式测试通过
- [ ] ✅ GA 实时报告看到活跃用户
- [ ] ✅ GA Test Installation 通过

---

## 📚 参考资料

- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)
- [Google Analytics 4 Setup](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## 🎉 总结

**最终配置：**

1. ✅ 使用 `next/script` 组件
2. ✅ 脚本放在 `<body>` 内
3. ✅ `strategy="afterInteractive"`
4. ✅ 添加 `GATracker` 追踪 SPA 导航
5. ✅ 环境变量正确设置
6. ✅ 所有验证步骤通过

**预期结果：**
- GA Test Installation 成功 ✅
- 实时报告显示活跃用户 ✅
- SPA 导航自动追踪 ✅
- 不影响页面性能 ✅

---

**最后更新：** 2025-01-07  
**维护者：** Leon  
**状态：** ✅ 已完成并验证
