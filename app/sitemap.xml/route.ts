/**
 * 主 Sitemap 索引 - 分层结构
 * 
 * 优势：
 * 1. 便于 GSC 诊断问题
 * 2. 避免单文件过大
 * 3. 提高抓取效率
 */
import { NextResponse } from 'next/server';

export async function GET() {
  const BASE = 'https://www.daysfromtoday.ai';
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE}/sitemap-pages.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE}/sitemap-blog.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE}/sitemap-tools.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1小时缓存
    },
  });
}
