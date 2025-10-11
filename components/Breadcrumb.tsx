/**
 * Breadcrumb - 面包屑导航组件
 * 
 * 功能:
 * - 动态生成路径导航
 * - 多语言支持
 * - Schema.org 结构化数据（SEO 优化）
 * - 响应式设计
 */

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  locale: string;
}

interface BreadcrumbItem {
  label: string;   // 显示文本
  href: string;    // 链接地址
}

export function Breadcrumb({ items, locale }: BreadcrumbProps) {
  const t = useTranslations();

  // 如果没有提供 items，生成默认的面包屑
  const breadcrumbItems = items || [
    { label: t('common.home'), href: `/${locale}` },
    { label: t('common.currentPage'), href: '' }
  ];

  // 构建 Schema.org 结构化数据
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`,
    })),
  };

  return (
    <>
      {/* Schema.org 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 面包屑导航 */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-sm text-gray-600 dark:text-gray-400"
      >
        <ol className="flex items-center space-x-2 flex-wrap">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <li key={item.href} className="flex items-center">
                {/* 分隔符 */}
                {index > 0 && (
                  <span className="mx-2 text-gray-400 dark:text-gray-600">
                    /
                  </span>
                )}

                {/* 链接或当前页 */}
                {isLast ? (
                  <span
                    className="font-medium text-gray-900 dark:text-gray-100"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * 工具函数：从路径生成面包屑数据
 */
export function generateBreadcrumbs(
  pathname: string,
  locale: string,
  t: any
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // 添加首页
  breadcrumbs.push({
    label: t('common.home'),
    href: `/${locale}`,
  });

  // 移除 locale 部分
  const pathSegments = segments.filter((seg) => seg !== locale);

  // 构建路径
  let currentPath = `/${locale}`;
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // 获取翻译标签（如果存在）
    const labelKey = `breadcrumb.${segment}`;
    const label = t.has(labelKey) ? t(labelKey) : segment;

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}
