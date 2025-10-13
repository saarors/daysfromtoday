#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// 加载环境变量
config({ path: '.env.local' });

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.heic', '.heif'];

// 支持的其他媒体格式
const MEDIA_EXTENSIONS = ['.mp4', '.mov', '.m4a', '.mp3', '.wav', '.pdf', '.csv', '.xlsx', '.docx'];

function testFileTypeDetection() {
  console.log('🧪 测试文件类型检测...\n');
  
  const testFiles = [
    'test.jpg',
    'test.png',
    'test.heic',
    'test.pdf',
    'test.mp4',
    'test.mov',
    'test.m4a',
    'test.csv',
    'test.unknown'
  ];
  
  testFiles.forEach(file => {
    const ext = file.split('.').pop()?.toLowerCase();
    const extension = ext ? `.${ext}` : '';
    
    let type = '未知';
    if (IMAGE_EXTENSIONS.includes(extension)) {
      type = '图片';
    } else if (MEDIA_EXTENSIONS.includes(extension)) {
      type = '媒体';
    }
    
    console.log(`📁 ${file} → ${type} (${extension})`);
  });
}

function testMarkdownLinkGeneration() {
  console.log('\n🧪 测试 Markdown 链接生成...\n');
  
  const testCases = [
    { file: 'test.jpg', url: 'https://cdn.daysfromtoday.ai/images/blog/en/test.jpg' },
    { file: 'test.heic', url: 'https://cdn.daysfromtoday.ai/images/blog/en/test.heic' },
    { file: 'test.pdf', url: 'https://cdn.daysfromtoday.ai/media/blog/en/test.pdf' },
    { file: 'test.mp4', url: 'https://cdn.daysfromtoday.ai/media/blog/en/test.mp4' },
    { file: 'test.m4a', url: 'https://cdn.daysfromtoday.ai/media/blog/en/test.m4a' },
    { file: 'test.csv', url: 'https://cdn.daysfromtoday.ai/media/blog/en/test.csv' }
  ];
  
  testCases.forEach(({ file, url }) => {
    const fileExtension = file.split('.').pop()?.toLowerCase() || '';
    const extension = `.${fileExtension}`;
    const fileName = file.replace(extension, '');
    
    let markdownLink = '';
    if (IMAGE_EXTENSIONS.includes(extension)) {
      markdownLink = `![${fileName}](${url})`;
    } else if (MEDIA_EXTENSIONS.includes(extension)) {
      if (extension === '.mp4' || extension === '.mov') {
        markdownLink = `[📹 ${fileName}](${url})`;
      } else if (extension === '.m4a' || extension === '.mp3') {
        markdownLink = `[🎵 ${fileName}](${url})`;
      } else if (extension === '.pdf') {
        markdownLink = `[📄 ${fileName}](${url})`;
      } else if (extension === '.csv') {
        markdownLink = `[📊 ${fileName}](${url})`;
      } else {
        markdownLink = `[📎 ${fileName}](${url})`;
      }
    }
    
    console.log(`📁 ${file}`);
    console.log(`   → ${markdownLink}`);
    console.log('');
  });
}

function testContentTypeDetection() {
  console.log('🧪 测试 Content-Type 检测...\n');
  
  const testFiles = [
    'test.jpg',
    'test.png',
    'test.heic',
    'test.pdf',
    'test.mp4',
    'test.mov',
    'test.m4a',
    'test.csv'
  ];
  
  testFiles.forEach(file => {
    const ext = file.split('.').pop()?.toLowerCase() || '';
    const extension = `.${ext}`;
    
    let contentType = 'application/octet-stream';
    if (IMAGE_EXTENSIONS.includes(extension)) {
      contentType = `image/${ext}`;
    } else if (extension === '.pdf') {
      contentType = 'application/pdf';
    } else if (extension === '.mp4' || extension === '.mov') {
      contentType = 'video/mp4';
    } else if (extension === '.m4a' || extension === '.mp3') {
      contentType = 'audio/mpeg';
    } else if (extension === '.csv') {
      contentType = 'text/csv';
    }
    
    console.log(`📁 ${file} → ${contentType}`);
  });
}

async function main() {
  console.log('🚀 开始测试媒体文件上传功能...\n');
  
  testFileTypeDetection();
  testMarkdownLinkGeneration();
  testContentTypeDetection();
  
  console.log('\n✅ 测试完成！');
  console.log('\n📋 支持的文件类型：');
  console.log(`   图片: ${IMAGE_EXTENSIONS.join(', ')}`);
  console.log(`   媒体: ${MEDIA_EXTENSIONS.join(', ')}`);
}

main().catch(console.error);

