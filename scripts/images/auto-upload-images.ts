#!/usr/bin/env tsx

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';

// 加载环境变量
config({ path: '.env.local' });

// 配置
const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: process.env.R2_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'daysfromtoday-assets';
const CDN_BASE_URL = process.env.CDN_BASE_URL || 'https://cdn.daysfromtoday.ai';

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.heic', '.heif'];

// 支持的其他媒体格式
const MEDIA_EXTENSIONS = ['.mp4', '.mov', '.m4a', '.mp3', '.wav', '.pdf', '.csv', '.xlsx', '.docx'];

// 上传文件到 R2
async function uploadImageToR2(filePath: string, category: string, locale: string): Promise<string> {
  try {
    const fileBuffer = readFileSync(filePath);
    const fileExtension = extname(filePath);
    const fileName = `${uuidv4()}${fileExtension}`;
    
    // 根据文件类型决定存储路径
    const isImage = IMAGE_EXTENSIONS.includes(fileExtension.toLowerCase());
    const folder = isImage ? 'images' : 'media';
    const key = `${folder}/${category}/${locale}/${fileName}`;

    // 根据文件类型设置 Content-Type
    let contentType = 'application/octet-stream';
    if (isImage) {
      contentType = `image/${fileExtension.slice(1)}`;
    } else if (fileExtension === '.pdf') {
      contentType = 'application/pdf';
    } else if (fileExtension === '.mp4' || fileExtension === '.mov') {
      contentType = 'video/mp4';
    } else if (fileExtension === '.m4a' || fileExtension === '.mp3') {
      contentType = 'audio/mpeg';
    } else if (fileExtension === '.csv') {
      contentType = 'text/csv';
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000',
    });

    await s3Client.send(command);
    return `${CDN_BASE_URL}/${key}`;
  } catch (error) {
    console.error(`❌ 上传文件失败 ${filePath}:`, error);
    throw error;
  }
}

// 处理单个 Markdown 文件
async function processMarkdownFile(filePath: string): Promise<boolean> {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const obsidianImageRegex = /!\[\[([^\]]+)\]\]/g;
    let hasChanges = false;
    let newContent = content;

    // 查找所有 Obsidian 图片链接
    const matches = Array.from(content.matchAll(obsidianImageRegex));
    
    if (matches.length === 0) {
      return false;
    }

    console.log(`📝 处理文件: ${filePath}`);
    console.log(`🖼️  发现 ${matches.length} 个文件链接`);

    // 从文件路径推断 category 和 locale
    const pathParts = filePath.split('/');
    const category = pathParts.includes('blog') ? 'blog' : 
                   pathParts.includes('philosophy') ? 'philosophy' :
                   pathParts.includes('tools') ? 'tools' :
                   pathParts.includes('stories') ? 'stories' :
                   pathParts.includes('guides') ? 'guides' :
                   pathParts.includes('updates') ? 'updates' : 'blog';
    
    const locale = pathParts.includes('en') ? 'en' : 
                  pathParts.includes('zh') ? 'zh' : 'en';

    // 处理每个图片链接
    for (const match of matches) {
      const obsidianImageName = match[1];
      const fullMatch = match[0];
      
      // 查找对应的图片文件
      const obsidianDir = join(process.cwd(), 'obsidian');
      const imageFile = findImageFile(obsidianDir, obsidianImageName);
      
      if (imageFile) {
        console.log(`⬆️  上传文件: ${obsidianImageName}`);
        const cdnUrl = await uploadImageToR2(imageFile, category, locale);
        
        // 根据文件类型生成不同的 Markdown 链接
        const fileExtension = extname(obsidianImageName).toLowerCase();
        const fileName = basename(obsidianImageName, extname(obsidianImageName));
        
        let markdownLink = '';
        if (IMAGE_EXTENSIONS.includes(fileExtension)) {
          // 图片文件：生成图片链接
          markdownLink = `![${fileName}](${cdnUrl})`;
        } else if (MEDIA_EXTENSIONS.includes(fileExtension)) {
          // 媒体文件：生成下载链接
          if (fileExtension === '.mp4' || fileExtension === '.mov') {
            markdownLink = `[📹 ${fileName}](${cdnUrl})`;
          } else if (fileExtension === '.m4a' || fileExtension === '.mp3') {
            markdownLink = `[🎵 ${fileName}](${cdnUrl})`;
          } else if (fileExtension === '.pdf') {
            markdownLink = `[📄 ${fileName}](${cdnUrl})`;
          } else if (fileExtension === '.csv') {
            markdownLink = `[📊 ${fileName}](${cdnUrl})`;
          } else {
            markdownLink = `[📎 ${fileName}](${cdnUrl})`;
          }
        }
        
        newContent = newContent.replace(fullMatch, markdownLink);
        hasChanges = true;
        
        console.log(`✅ 替换为: ${cdnUrl}`);
      } else {
        console.log(`⚠️  未找到文件: ${obsidianImageName}`);
      }
    }

    // 如果有更改，写回文件
    if (hasChanges) {
      writeFileSync(filePath, newContent, 'utf-8');
      console.log(`💾 已更新文件: ${filePath}`);
    }

    return hasChanges;
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error);
    return false;
  }
}

// 查找文件（支持图片和其他媒体文件）
function findImageFile(dir: string, imageName: string): string | null {
  try {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        const found = findImageFile(fullPath, imageName);
        if (found) return found;
      } else if (stat.isFile()) {
        const ext = extname(file);
        const allSupportedExtensions = [...IMAGE_EXTENSIONS, ...MEDIA_EXTENSIONS];
        
        if (allSupportedExtensions.includes(ext.toLowerCase())) {
          // 检查文件名是否匹配（忽略扩展名）
          const baseName = basename(file, ext);
          const targetBaseName = basename(imageName, extname(imageName));
          
          if (baseName === targetBaseName || file === imageName) {
            return fullPath;
          }
        }
      }
    }
  } catch (error) {
    // 忽略权限错误等
  }
  
  return null;
}

// 递归处理目录
async function processDirectory(dirPath: string): Promise<number> {
  let processedCount = 0;
  
  try {
    const items = readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        processedCount += await processDirectory(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        const hasChanges = await processMarkdownFile(fullPath);
        if (hasChanges) {
          processedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`❌ 处理目录失败 ${dirPath}:`, error);
  }
  
  return processedCount;
}

// 主函数
async function main() {
  console.log('🚀 开始自动上传 Obsidian 图片...');
  
  // 检查环境变量
  if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.error('❌ 请先配置 R2 环境变量');
    process.exit(1);
  }

  const obsidianContentDir = join(process.cwd(), 'obsidian', 'content');
  
  if (!statSync(obsidianContentDir).isDirectory()) {
    console.error('❌ Obsidian content 目录不存在');
    process.exit(1);
  }

  const processedCount = await processDirectory(obsidianContentDir);
  
  console.log(`\n✅ 处理完成！共处理了 ${processedCount} 个文件`);
  console.log('💡 现在可以运行 "npm run content:sync" 同步内容');
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

export { processMarkdownFile, processDirectory };
