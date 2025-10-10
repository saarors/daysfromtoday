/**
 * Image Sitemap Generator
 * 
 * 功能：
 * - 提取所有内容页面的图片
 * - 生成符合 Google Image Sitemap 规范的 XML
 * - 支持 R2 CDN 图片和本地图片
 * - 包含图片标题、描述、位置信息
 * 
 * Google Image Sitemap 规范：
 * https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 * 
 * SEO 优化：
 * - 帮助 Google 发现和索引图片
 * - 提升图片搜索排名
 * - 增加网站流量
 */

import { NextResponse } from 'next/server';
import {
  allPhilosophies,
  allTools,
  allStories,
  allGuides,
  allUpdates,
} from 'contentlayer/generated';

interface ImageInfo {
  loc: string;           // 图片 URL
  title?: string;        // 图片标题
  caption?: string;      // 图片描述
  geoLocation?: string;  // 地理位置
  license?: string;      // 许可证
}

interface PageImage {
  pageUrl: string;
  images: ImageInfo[];
}

/**
 * 从 MDX 内容中提取图片 URL
 */
function extractImagesFromContent(content: string, title: string): ImageInfo[] {
  const images: ImageInfo[] = [];
  
  // 匹配 Markdown 图片语法：![alt](url)
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = markdownImageRegex.exec(content)) !== null) {
    const alt = match[1] || title;
    const url = match[2];
    
    // 只包含完整 URL（http/https）
    if (url.startsWith('http')) {
      images.push({
        loc: url,
        title: alt,
        caption: alt,
      });
    }
  }
  
  // 匹配 HTML img 标签：<img src="url" alt="alt" />
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/g;
  
  while ((match = htmlImageRegex.exec(content)) !== null) {
    const url = match[1];
    const alt = match[2] || title;
    
    if (url.startsWith('http')) {
      images.push({
        loc: url,
        title: alt,
        caption: alt,
      });
    }
  }
  
  return images;
}

/**
 * 生成 Image Sitemap XML
 */
function generateImageSitemapXML(pageImages: PageImage[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  
  pageImages.forEach(page => {
    if (page.images.length === 0) return;
    
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.pageUrl}</loc>\n`;
    
    page.images.forEach(image => {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(image.loc)}</image:loc>\n`;
      
      if (image.title) {
        xml += `      <image:title>${escapeXml(image.title)}</image:title>\n`;
      }
      
      if (image.caption) {
        xml += `      <image:caption>${escapeXml(image.caption)}</image:caption>\n`;
      }
      
      xml += `    </image:image>\n`;
    });
    
    xml += `  </url>\n`;
  });
  
  xml += '</urlset>';
  
  return xml;
}

/**
 * 转义 XML 特殊字符
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * GET /image-sitemap.xml
 */
export async function GET() {
  const pageImages: PageImage[] = [];
  
  // 1. Philosophy 页面
  allPhilosophies.forEach(philosophy => {
    const images: ImageInfo[] = [];
    
    // 封面图
    if (philosophy.coverImage) {
      images.push({
        loc: philosophy.coverImage,
        title: philosophy.title,
        caption: philosophy.description,
      });
    }
    
    // 内容中的图片
    const contentImages = extractImagesFromContent(
      philosophy.body.raw,
      philosophy.title
    );
    images.push(...contentImages);
    
    if (images.length > 0) {
      pageImages.push({
        pageUrl: philosophy.url,
        images,
      });
    }
  });
  
  // 2. Tools 页面
  allTools.forEach(tool => {
    const images: ImageInfo[] = [];
    
    if (tool.coverImage) {
      images.push({
        loc: tool.coverImage,
        title: tool.title,
        caption: tool.description,
      });
    }
    
    const contentImages = extractImagesFromContent(tool.body.raw, tool.title);
    images.push(...contentImages);
    
    if (images.length > 0) {
      pageImages.push({
        pageUrl: tool.url,
        images,
      });
    }
  });
  
  // 3. Stories 页面
  allStories.forEach(story => {
    const images: ImageInfo[] = [];
    
    if (story.coverImage) {
      images.push({
        loc: story.coverImage,
        title: story.title,
        caption: story.description,
      });
    }
    
    const contentImages = extractImagesFromContent(story.body.raw, story.title);
    images.push(...contentImages);
    
    if (images.length > 0) {
      pageImages.push({
        pageUrl: story.url,
        images,
      });
    }
  });
  
  // 4. Guides 页面
  allGuides.forEach(guide => {
    const images: ImageInfo[] = [];
    
    if (guide.coverImage) {
      images.push({
        loc: guide.coverImage,
        title: guide.title,
        caption: guide.description,
      });
    }
    
    const contentImages = extractImagesFromContent(guide.body.raw, guide.title);
    images.push(...contentImages);
    
    if (images.length > 0) {
      pageImages.push({
        pageUrl: guide.url,
        images,
      });
    }
  });
  
  // 5. Updates 页面
  allUpdates.forEach(update => {
    const images: ImageInfo[] = [];
    
    if (update.coverImage) {
      images.push({
        loc: update.coverImage,
        title: update.title,
        caption: update.description,
      });
    }
    
    const contentImages = extractImagesFromContent(update.body.raw, update.title);
    images.push(...contentImages);
    
    if (images.length > 0) {
      pageImages.push({
        pageUrl: update.url,
        images,
      });
    }
  });
  
  // 生成 XML
  const xml = generateImageSitemapXML(pageImages);
  
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

