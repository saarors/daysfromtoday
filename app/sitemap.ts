/**
 * 动态站点地图生成器
 * 
 * 功能：
 * 1. 为所有语言版本生成首页 URL
 * 2. 设置正确的更新频率和优先级
 * 3. 自动包含 lastModified 时间戳
 * 
 * SEO 要求：
 * - 包含所有语言版本的页面
 * - 设置合理的 changeFrequency
 * - 设置正确的 priority（首页 1.0）
 * 
 * 当前状态：基础版本
 * TODO: 后续添加动态页面
 * - /[locale]/days/[n]
 * - /[locale]/weekdays/[n]
 * - /[locale]/business-days/[n]
 * 
 * 符合项目规范：SEO 友好、多语言支持
 */
import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daysfromtoday.com';
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. 首页（所有语言）
  locales.forEach(locale => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  });

  // 2. FAQ 页面（所有语言）
  locales.forEach(locale => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  });

  // 3. 常用日期计算页面（优化 SEO）
  const commonDays = [
    1, 2, 3, 4, 5, 6, 7, 10, 14, 15, 20, 21, 28, 30, 
    45, 60, 90, 100, 120, 180, 365
  ];

  locales.forEach(locale => {
    commonDays.forEach(days => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/days/${days}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  return sitemapEntries;
}

