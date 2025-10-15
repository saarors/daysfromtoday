/**
 * 博客 Sitemap - 动态文章
 */
import { NextResponse } from 'next/server';
import { allBlogs } from '@/.contentlayer/generated';

export const revalidate = 3600;

export async function GET() {
  const BASE = 'https://www.daysfromtoday.ai';
  const sitemapEntries: string[] = [];

  // 博客文章
  allBlogs.forEach(blog => {
    sitemapEntries.push(`
  <url>
    <loc>${BASE}/${blog.locale}/blog/${blog.slug}</loc>
    <lastmod>${new Date(blog.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
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
