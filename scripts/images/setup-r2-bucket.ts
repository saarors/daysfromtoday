#!/usr/bin/env tsx

/**
 * R2 存储桶设置脚本
 * 
 * 功能：
 * 1. 创建 R2 存储桶
 * 2. 配置存储桶权限
 * 3. 测试连接
 * 
 * 使用方法：
 * npm run images:setup-r2
 */

import { S3Client, CreateBucketCommand, PutBucketCorsCommand, ListBucketsCommand } from '@aws-sdk/client-s3';

// R2 配置
const R2_CONFIG = {
  endpoint: process.env.R2_ENDPOINT || 'https://44466a5b45e448959d15908ac94f0c38.r2.cloudflarestorage.com',
  region: process.env.R2_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
};

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'daysfromtoday-assets';

async function listBuckets() {
  console.log('🔍 列出现有存储桶...');
  
  try {
    const s3Client = new S3Client(R2_CONFIG);
    const command = new ListBucketsCommand({});
    const result = await s3Client.send(command);
    
    console.log('✅ 连接成功！');
    console.log('📦 现有存储桶:');
    
    if (result.Buckets && result.Buckets.length > 0) {
      result.Buckets.forEach(bucket => {
        console.log(`  - ${bucket.Name} (创建于: ${bucket.CreationDate})`);
      });
    } else {
      console.log('  (无存储桶)');
    }
    
    return result.Buckets || [];
  } catch (error) {
    console.error('❌ 连接失败:', error);
    throw error;
  }
}

async function createBucket() {
  console.log(`🆕 创建存储桶: ${BUCKET_NAME}...`);
  
  try {
    const s3Client = new S3Client(R2_CONFIG);
    const command = new CreateBucketCommand({
      Bucket: BUCKET_NAME,
    });
    
    await s3Client.send(command);
    console.log(`✅ 存储桶创建成功: ${BUCKET_NAME}`);
    
    return true;
  } catch (error: any) {
    if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log(`✅ 存储桶已存在: ${BUCKET_NAME}`);
      return true;
    } else if (error.name === 'BucketAlreadyExists') {
      console.log(`⚠️ 存储桶名称已被使用: ${BUCKET_NAME}`);
      return false;
    } else {
      console.error('❌ 创建存储桶失败:', error);
      throw error;
    }
  }
}

async function configureCORS() {
  console.log('🔧 配置 CORS 策略...');
  
  try {
    const s3Client = new S3Client(R2_CONFIG);
    const command = new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'HEAD'],
            AllowedOrigins: ['*'],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    });
    
    await s3Client.send(command);
    console.log('✅ CORS 策略配置成功');
    
    return true;
  } catch (error) {
    console.error('❌ CORS 配置失败:', error);
    throw error;
  }
}

async function testUpload() {
  console.log('🧪 测试图片上传...');
  
  try {
    const s3Client = new S3Client(R2_CONFIG);
    const testContent = 'test-image-content';
    const testKey = 'test/connection-test.txt';
    
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    });
    
    await s3Client.send(command);
    console.log('✅ 测试上传成功');
    
    return true;
  } catch (error) {
    console.error('❌ 测试上传失败:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 开始设置 R2 存储桶...\n');
  
  // 检查环境变量
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.error('❌ 请先配置 R2 环境变量:');
    console.error('  R2_ACCESS_KEY_ID');
    console.error('  R2_SECRET_ACCESS_KEY');
    console.error('  R2_ENDPOINT (可选)');
    console.error('  R2_BUCKET_NAME (可选)');
    process.exit(1);
  }
  
  try {
    // 列出现有存储桶
    const existingBuckets = await listBuckets();
    console.log('');
    
    // 检查存储桶是否已存在
    const bucketExists = existingBuckets.some(bucket => bucket.Name === BUCKET_NAME);
    
    if (!bucketExists) {
      // 创建存储桶
      const created = await createBucket();
      if (!created) {
        console.log('❌ 无法创建存储桶，请检查名称是否可用');
        process.exit(1);
      }
      console.log('');
    }
    
    // 配置 CORS
    await configureCORS();
    console.log('');
    
    // 测试上传
    await testUpload();
    console.log('');
    
    console.log('🎉 R2 存储桶设置完成！');
    console.log('📋 配置信息:');
    console.log(`  📦 存储桶名称: ${BUCKET_NAME}`);
    console.log(`  🌐 Endpoint: ${R2_CONFIG.endpoint}`);
    console.log(`  🔗 CDN URL: ${process.env.CDN_BASE_URL || 'https://cdn.daysfromtoday.ai'}`);
    
    console.log('');
    console.log('💡 下一步:');
    console.log('  1. 配置自定义域名（可选）');
    console.log('  2. 运行图片上传测试: npm run images:test');
    console.log('  3. 开始使用 Obsidian 工作流');
    
  } catch (error) {
    console.error('❌ 设置失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
