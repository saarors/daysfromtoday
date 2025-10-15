/**
 * 工具页面 Sitemap - 精选日期计算页面
 * 
 * 注意：只包含高价值、高搜索量的日期
 * 避免列出所有 1-365 天，防止"薄内容"问题
 */
import { NextResponse } from 'next/server';
import { locales } from '@/i18n/config';

export const revalidate = 3600;

export async function GET() {
  const BASE = 'https://www.daysfromtoday.ai';
  const sitemapEntries: string[] = [];

  // 精选日期 - 高搜索量、高价值
  const highValueDays = [1, 2, 3, 7, 14, 21, 28, 30, 45, 60, 90, 100, 120, 180, 365];
  const businessDays = [1, 2, 3, 5, 7, 10, 14, 15, 20, 21, 28, 30, 45, 60, 90];

  // 1. 未来日期（自然日）
  locales.forEach(locale => {
    highValueDays.forEach(days => {
      sitemapEntries.push(`
  <url>
    <loc>${BASE}/${locale}/days/${days}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    });
  });

  // 2. 过去日期（自然日）
  locales.forEach(locale => {
    highValueDays.forEach(days => {
      sitemapEntries.push(`
  <url>
    <loc>${BASE}/${locale}/days/ago/${days}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
    });
  });

  // 3. 工作日（未来）- 高优先级
  locales.forEach(locale => {
    businessDays.forEach(days => {
      sitemapEntries.push(`
  <url>
    <loc>${BASE}/${locale}/business-days/${days}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
    });
  });

  // 4. 工作日（过去）
  locales.forEach(locale => {
    businessDays.forEach(days => {
      sitemapEntries.push(`
  <url>
    <loc>${BASE}/${locale}/business-days/ago/${days}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
