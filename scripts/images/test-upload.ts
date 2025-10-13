#!/usr/bin/env tsx

/**
 * 测试图片上传功能
 * 
 * 使用方法：
 * npm run images:test
 */

import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// R2 配置
const R2_CONFIG = {
  endpoint: process.env.R2_ENDPOINT || 'https://your-account-id.r2.cloudflarestorage.com',
  region: process.env.R2_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  bucket: process.env.R2_BUCKET_NAME || 'daysfromtoday-assets',
};

const CDN_BASE_URL = process.env.CDN_BASE_URL || 'https://cdn.daysfromtoday.ai';

async function testR2Connection() {
  console.log('🔍 测试 R2 连接...');
  
  try {
    const s3Client = new S3Client(R2_CONFIG);
    
    // 测试列出对象
    const listCommand = new ListObjectsV2Command({
      Bucket: R2_CONFIG.bucket,
      MaxKeys: 1,
    });
    
    const result = await s3Client.send(listCommand);
    console.log('✅ R2 连接成功！');
    console.log(`📦 存储桶: ${R2_CONFIG.bucket}`);
    console.log(`🌐 Endpoint: ${R2_CONFIG.endpoint}`);
    console.log(`📊 对象数量: ${result.KeyCount || 0}`);
    
    return true;
  } catch (error) {
    console.error('❌ R2 连接失败:', error);
    return false;
  }
}

async function createTestImage() {
  console.log('🖼️ 创建测试图片...');
  
  // 创建一个简单的 SVG 图片
  const svgContent = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f0f0f0"/>
  <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">
    Test Image
  </text>
  <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">
    ${new Date().toISOString()}
  </text>
</svg>`;
  
  const testImagePath = join(process.cwd(), 'public', 'images', 'test-image.svg');
  writeFileSync(testImagePath, svgContent);
  
  console.log(`✅ 测试图片已创建: ${testImagePath}`);
  return testImagePath;
}

async function uploadTestImage(imagePath: string) {
  console.log('📤 上传测试图片...');
  
  try {
    const s3Client = new S3Client(R2_CONFIG);
    const imageBuffer = readFileSync(imagePath);
    
    const timestamp = Date.now();
    const key = `images/test/test-image-${timestamp}.svg`;
    
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucket,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/svg+xml',
      CacheControl: 'public, max-age=31536000',
    });

    await s3Client.send(command);
    
    const cdnUrl = `${CDN_BASE_URL}/${key}`;
    console.log(`✅ 图片上传成功！`);
    console.log(`🔗 CDN URL: ${cdnUrl}`);
    
    return cdnUrl;
  } catch (error) {
    console.error('❌ 图片上传失败:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 开始测试图片上传功能...\n');
  
  // 检查环境变量
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.error('❌ 请先配置 R2 环境变量:');
    console.error('  R2_ACCESS_KEY_ID');
    console.error('  R2_SECRET_ACCESS_KEY');
    console.error('  R2_ENDPOINT (可选)');
    console.error('  R2_BUCKET_NAME (可选)');
    console.error('  CDN_BASE_URL (可选)');
    process.exit(1);
  }
  
  try {
    // 测试连接
    const connected = await testR2Connection();
    if (!connected) {
      process.exit(1);
    }
    
    console.log('');
    
    // 创建测试图片
    const testImagePath = await createTestImage();
    
    console.log('');
    
    // 上传测试图片
    const cdnUrl = await uploadTestImage(testImagePath);
    
    console.log('');
    console.log('🎉 测试完成！');
    console.log('📋 测试结果:');
    console.log(`  ✅ R2 连接: 成功`);
    console.log(`  ✅ 图片创建: 成功`);
    console.log(`  ✅ 图片上传: 成功`);
    console.log(`  🔗 测试链接: ${cdnUrl}`);
    
    console.log('');
    console.log('💡 下一步:');
    console.log('  1. 在浏览器中打开测试链接，确认图片可以正常显示');
    console.log('  2. 配置 Obsidian 插件');
    console.log('  3. 开始使用 Obsidian 进行文章创作');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
