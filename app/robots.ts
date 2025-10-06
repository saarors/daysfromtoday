/**
 * robots.txt 生成器
 * 
 * 功能：
 * 1. 允许所有搜索引擎抓取
 * 2. 指向动态生成的 sitemap.xml
 * 3. 设置爬虫规则
 * 
 * SEO 要求：
 * - 允许所有搜索引擎（userAgent: '*'）
 * - 提供 sitemap 位置
 * - 不阻止任何路径
 * 
 * 符合项目规范：
 * - SEO 友好
 * - 支持多语言
 * - 符合搜索引擎标准
 */
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 可选：未来可以添加 disallow 规则
      // disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

