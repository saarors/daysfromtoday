/**
 * 面包屑导航组件
 * 
 * 功能：
 * - 显示页面层级结构
 * - 支持多语言
 * - 与语言切换器在同一行
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BreadcrumbProps {
  locale: string;
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumb({ locale }: BreadcrumbProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const text = {
    en: {
      home: 'Home',
      anniversaries: 'My Anniversaries',
      blog: 'Blog',
      days: 'Days Calculation',
      businessDays: 'Business Days'
    },
    zh: {
      home: '首页',
      anniversaries: '我的纪念日',
      blog: '博客',
      days: '日期计算',
      businessDays: '工作日'
    }
  };

  const t = text[locale as keyof typeof text] || text.en;

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (!mounted || !pathname) return [{ label: t.home, href: `/${locale}` }];

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t.home, href: `/${locale}` }
    ];

    // 移除语言前缀
    if (segments[0] === locale || segments[0] === 'en' || segments[0] === 'zh') {
      segments.shift();
    }

    // 特殊路径处理 - 简化面包屑
    const path = segments.join('/');
    
    // 1. 纪念日页面
    if (path === 'anniversaries') {
      breadcrumbs.push({ label: t.anniversaries, href: `/${locale}/anniversaries` });
      return breadcrumbs;
    }
    
    // 2. 博客列表页
    if (path === 'blog') {
      breadcrumbs.push({ label: t.blog, href: `/${locale}/blog` });
      return breadcrumbs;
    }
    
    // 3. 博客文章详情页
    if (path.startsWith('blog/')) {
      breadcrumbs.push({ label: t.blog, href: `/${locale}/blog` });
      // 文章标题会由具体页面提供，这里只添加博客列表链接
      return breadcrumbs;
    }
    
    // 3. 未来日期计算：/days/[n] 或 /business-days/[n]
    const futureCalendarMatch = path.match(/^days\/(\d+)$/);
    const futureBusinessMatch = path.match(/^business-days\/(\d+)$/);
    
    if (futureCalendarMatch) {
      const days = futureCalendarMatch[1];
      const label = locale === 'zh' ? `未来${days}天` : `${days} Days Later`;
      breadcrumbs.push({ label, href: `/${locale}/days/${days}` });
      return breadcrumbs;
    }
    
    if (futureBusinessMatch) {
      const days = futureBusinessMatch[1];
      const label = locale === 'zh' ? `未来${days}个工作日` : `${days} Business Days Later`;
      breadcrumbs.push({ label, href: `/${locale}/business-days/${days}` });
      return breadcrumbs;
    }
    
    // 4. 过去日期计算：/days/ago/[n] 或 /business-days/ago/[n]
    const pastCalendarMatch = path.match(/^days\/ago\/(\d+)$/);
    const pastBusinessMatch = path.match(/^business-days\/ago\/(\d+)$/);
    
    if (pastCalendarMatch) {
      const days = pastCalendarMatch[1];
      const label = locale === 'zh' ? `过去${days}天` : `${days} Days Ago`;
      breadcrumbs.push({ label, href: `/${locale}/days/ago/${days}` });
      return breadcrumbs;
    }
    
    if (pastBusinessMatch) {
      const days = pastBusinessMatch[1];
      const label = locale === 'zh' ? `过去${days}个工作日` : `${days} Business Days Ago`;
      breadcrumbs.push({ label, href: `/${locale}/business-days/ago/${days}` });
      return breadcrumbs;
    }

    // 默认处理（其他页面）
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // 在客户端挂载前不显示详细路径
  if (!mounted) {
    return (
      <nav className="flex items-center text-sm text-gray-600" suppressHydrationWarning>
        <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors">
          {t.home}
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center text-sm text-gray-600" suppressHydrationWarning>
      {breadcrumbs.map((item, index) => (
        <span key={item.href} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-gray-400">/</span>
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link 
              href={item.href} 
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

