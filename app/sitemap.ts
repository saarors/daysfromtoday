/**
 * 动态站点地图生成器
 * 
 * 功能：
 * 1. 为所有语言版本生成首页 URL
 * 2. 为所有核心计算页面生成 URL
 * 3. 为所有内容页面生成 URL（Philosophy/Tools/Stories/Guides/Updates）
 * 4. 设置正确的更新频率和优先级
 * 5. 自动包含 lastModified 时间戳
 * 
 * 已包含页面：
 * - 首页（priority: 1.0）
 * - 纪念日页面（priority: 0.8）
 * - 节假日页面（priority: 0.8）
 * - 博客页面（priority: 0.7）
 * - 未来日期计算（priority: 0.8）
 * - 过去日期计算（priority: 0.7）
 * - 工作日计算（未来）（priority: 0.9）- 高价值关键词
 * - 工作日计算（过去）（priority: 0.7）
 * - Philosophy 文章（priority: 0.7）
 * - Tools 文章（priority: 0.8）
 * - Stories 文章（priority: 0.6）
 * - Guides 文章（priority: 0.8）
 * - Updates 文章（priority: 0.7）
 * 
 * 总页面数：约 200+ 页（2 语言 x 100+ 路由）
 * 
 * SEO 优化：
 * - 工作日页面高优先级（business days = 高搜索量）
 * - 内容页面基于类型设置优先级
 * - 所有页面 weekly 更新频率
 * - 完整多语言支持（en/zh）
 * 
 * 符合项目规范：SEO 友好、多语言支持、性能优化
 */
import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import {
  allPhilosophies,
  allTools,
  allStories,
  allGuides,
  allUpdates,
} from 'contentlayer/generated';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
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

  // 2. 纪念日页面（所有语言）
  locales.forEach(locale => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/anniversaries`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 3. 节假日列表页面（所有语言）
  locales.forEach(locale => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/holidays`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 4. 博客页面（所有语言）
  locales.forEach(locale => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
    
    // 博客文章
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/blog/why-i-built-daysfromtoday`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  // 5. 常用日期计算页面（优化 SEO）
  const commonDays = [
    1, 2, 3, 4, 5, 6, 7, 10, 14, 15, 20, 21, 28, 30, 
    45, 60, 90, 100, 120, 180, 365
  ];

  // 5.1 未来日期（自然日）
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

  // 5.2 过去日期（自然日）
  locales.forEach(locale => {
    commonDays.forEach(days => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/days/ago/${days}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  // 5.3 工作日（未来）
  const businessDays = [
    1, 2, 3, 5, 7, 10, 14, 15, 20, 21, 28, 30, 
    45, 60, 90
  ];

  locales.forEach(locale => {
    businessDays.forEach(days => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/business-days/${days}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9, // 工作日计算高优先级（高价值关键词）
      });
    });
  });

  // 5.4 工作日（过去）
  locales.forEach(locale => {
    businessDays.forEach(days => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/business-days/ago/${days}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  // 6. 内容类型页面（Philosophy/Tools/Stories/Guides/Updates）

  // 6.1 Philosophy（哲学思考）
  allPhilosophies.forEach(philosophy => {
    sitemapEntries.push({
      url: `${baseUrl}${philosophy.url}`,
      lastModified: new Date(philosophy.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // 6.2 Tools（工具介绍）
  allTools.forEach(tool => {
    sitemapEntries.push({
      url: `${baseUrl}${tool.url}`,
      lastModified: new Date(tool.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.8, // 工具介绍优先级较高
    });
  });

  // 6.3 Stories（用户故事）
  allStories.forEach(story => {
    sitemapEntries.push({
      url: `${baseUrl}${story.url}`,
      lastModified: new Date(story.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  // 6.4 Guides（使用指南）
  allGuides.forEach(guide => {
    sitemapEntries.push({
      url: `${baseUrl}${guide.url}`,
      lastModified: new Date(guide.publishedAt),
      changeFrequency: 'weekly', // 指南可能更新更频繁
      priority: 0.8,
    });
  });

  // 6.5 Updates（产品更新）
  allUpdates.forEach(update => {
    sitemapEntries.push({
      url: `${baseUrl}${update.url}`,
      lastModified: new Date(update.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  return sitemapEntries;
}

