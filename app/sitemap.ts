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
  // TODO: 从环境变量读取，当前使用占位符
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daysfromtoday.com';

  // 为每个语言生成首页 URL
  const homepages = locales.map(locale => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  return homepages;
}

