/**
 * Google Analytics 路由追踪组件
 * 
 * 功能：
 * - 追踪 SPA 路由变化（无刷新导航）
 * - 自动向 GA 报告页面浏览
 * 
 * 使用方法：
 * 在 layout.tsx 中引入：
 * import GATracker from '@/app/ga-tracker';
 * 
 * 在 <body> 中添加：
 * <GATracker />
 */
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// 扩展 Window 类型以包含 gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function GATracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    
    // 检查环境
    if (!gaId || typeof window === 'undefined') return;
    
    // 检查 gtag 是否已加载
    if (!('gtag' in window)) {
      console.warn('Google Analytics not loaded yet');
      return;
    }

    // 构建完整 URL
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
    
    // 发送页面浏览事件
    window.gtag?.('config', gaId, {
      page_path: url,
    });

    console.log('GA page view tracked:', url);
  }, [pathname, searchParams]);

  return null;
}

