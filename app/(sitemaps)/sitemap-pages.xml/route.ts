/**
 * 页面 Sitemap - 静态页面
 */
import { NextResponse } from 'next/server';
import { locales } from '@/i18n/config';

export const revalidate = 3600; // 1小时缓存

export async function GET() {
  const BASE = 'https://www.daysfromtoday.ai';
  const sitemapEntries: string[] = [];

  // 1. 首页（所有语言版本）
  locales.forEach(locale => {
    sitemapEntries.push(`
  <url>
    <loc>${BASE}/${locale}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);
  });

  // 2. 纪念日页面
  locales.forEach(locale => {
    sitemapEntries.push(`
  <url>
    <loc>${BASE}/${locale}/anniversaries</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // 3. 节假日页面
  locales.forEach(locale => {
    sitemapEntries.push(`
  <url>
    <loc>${BASE}/${locale}/holidays</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // 4. 博客列表页面
  locales.forEach(locale => {
    sitemapEntries.push(`
  <url>
    <loc>${BASE}/${locale}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
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
