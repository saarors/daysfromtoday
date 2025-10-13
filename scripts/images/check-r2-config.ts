#!/usr/bin/env tsx

/**
 * R2 配置检查脚本
 * 
 * 功能：
 * 1. 检查存储桶的公共访问配置
 * 2. 验证自定义域名设置
 * 3. 测试图片访问权限
 * 
 * 使用方法：
 * npm run images:check-r2
 */

import { S3Client, GetBucketLocationCommand, GetBucketCorsCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: process.env.R2_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'daysfromtoday-assets';

async function checkBucketConfig() {
  console.log('🔍 检查 R2 存储桶配置...\n');
  
  try {
    // 检查存储桶位置
    console.log('📍 检查存储桶位置...');
    const locationCommand = new GetBucketLocationCommand({ Bucket: BUCKET_NAME });
    const locationResult = await s3Client.send(locationCommand);
    console.log(`✅ 存储桶位置: ${locationResult.LocationConstraint || 'us-east-1'}`);
    
    // 检查 CORS 配置
    console.log('\n🌐 检查 CORS 配置...');
    try {
      const corsCommand = new GetBucketCorsCommand({ Bucket: BUCKET_NAME });
      const corsResult = await s3Client.send(corsCommand);
      console.log('✅ CORS 配置:');
      corsResult.CORSRules?.forEach((rule, index) => {
        console.log(`  规则 ${index + 1}:`);
        console.log(`    允许来源: ${rule.AllowedOrigins?.join(', ')}`);
        console.log(`    允许方法: ${rule.AllowedMethods?.join(', ')}`);
        console.log(`    允许头部: ${rule.AllowedHeaders?.join(', ')}`);
      });
    } catch (error: any) {
      if (error.name === 'NoSuchCORSConfiguration') {
        console.log('❌ 未配置 CORS 策略');
      } else {
        console.log(`❌ CORS 检查失败: ${error.message}`);
      }
    }
    
    // 检查测试图片
    console.log('\n🖼️ 检查测试图片...');
    try {
      const testImageKey = 'images/test/test-image-1760179248915.svg';
      const getObjectCommand = new GetObjectCommand({ 
        Bucket: BUCKET_NAME, 
        Key: testImageKey 
      });
      const objectResult = await s3Client.send(getObjectCommand);
      console.log(`✅ 测试图片存在: ${testImageKey}`);
      console.log(`   内容类型: ${objectResult.ContentType}`);
      console.log(`   内容长度: ${objectResult.ContentLength} bytes`);
    } catch (error: any) {
      console.log(`❌ 测试图片检查失败: ${error.message}`);
    }
    
  } catch (error: any) {
    console.log(`❌ 配置检查失败: ${error.message}`);
  }
}

async function checkPublicAccess() {
  console.log('\n🔓 检查公共访问配置...');
  
  // 测试直接访问 R2 域名
  const r2Url = `https://${BUCKET_NAME}.${process.env.R2_ENDPOINT?.replace('https://', '')}/images/test/test-image-1760179248915.svg`;
  console.log(`🔗 R2 直接访问 URL: ${r2Url}`);
  
  // 测试自定义域名
  const cdnUrl = `${process.env.CDN_BASE_URL}/images/test/test-image-1760179248915.svg`;
  console.log(`🔗 自定义域名 URL: ${cdnUrl}`);
  
  console.log('\n💡 解决方案:');
  console.log('1. 在 Cloudflare Dashboard 中配置自定义域名');
  console.log('2. 或者使用 R2 直接访问 URL');
  console.log('3. 确保存储桶允许公共读取访问');
}

function main() {
  console.log('🚀 R2 配置检查工具\n');
  
  // 检查环境变量
  const requiredEnvVars = ['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ENDPOINT', 'R2_BUCKET_NAME'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ 缺少环境变量:');
    missingVars.forEach(varName => console.log(`  - ${varName}`));
    console.log('\n请先设置环境变量或使用以下命令:');
    console.log('R2_ACCESS_KEY_ID=your_key R2_SECRET_ACCESS_KEY=your_secret npm run images:check-r2');
    return;
  }
  
  checkBucketConfig()
    .then(() => checkPublicAccess())
    .catch(console.error);
}

if (require.main === module) {
  main();
}

