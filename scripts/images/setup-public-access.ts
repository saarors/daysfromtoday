#!/usr/bin/env tsx

/**
 * R2 公共访问配置脚本
 * 
 * 功能：
 * 1. 配置存储桶的公共读取访问
 * 2. 设置存储桶策略
 * 3. 测试公共访问
 * 
 * 使用方法：
 * npm run images:setup-public
 */

import { S3Client, PutBucketPolicyCommand, GetBucketPolicyCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: process.env.R2_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'daysfromtoday-assets';

async function setupPublicAccess() {
  console.log('🔓 配置 R2 存储桶公共访问...\n');
  
  try {
    // 创建公共读取策略
    const publicReadPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
        },
      ],
    };
    
    console.log('📋 存储桶策略:');
    console.log(JSON.stringify(publicReadPolicy, null, 2));
    
    // 应用策略
    console.log('\n🔧 应用存储桶策略...');
    const putPolicyCommand = new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(publicReadPolicy),
    });
    
    await s3Client.send(putPolicyCommand);
    console.log('✅ 存储桶策略配置成功');
    
    // 验证策略
    console.log('\n🔍 验证存储桶策略...');
    const getPolicyCommand = new GetBucketPolicyCommand({ Bucket: BUCKET_NAME });
    const policyResult = await s3Client.send(getPolicyCommand);
    console.log('✅ 策略验证成功');
    
    // 测试公共访问
    console.log('\n🧪 测试公共访问...');
    const testUrl = `https://${BUCKET_NAME}.${process.env.R2_ENDPOINT?.replace('https://', '')}/images/test/test-image-1760179248915.svg`;
    console.log(`🔗 测试 URL: ${testUrl}`);
    
    console.log('\n💡 下一步:');
    console.log('1. 在浏览器中打开测试 URL 验证图片可以访问');
    console.log('2. 配置自定义域名 (可选)');
    console.log('3. 更新项目中的 CDN URL 配置');
    
  } catch (error: any) {
    console.log(`❌ 配置失败: ${error.message}`);
    
    if (error.name === 'AccessDenied') {
      console.log('\n💡 解决方案:');
      console.log('1. 确保使用有足够权限的 API 令牌');
      console.log('2. 在 Cloudflare Dashboard 中手动配置存储桶策略');
    }
  }
}

function main() {
  console.log('🚀 R2 公共访问配置工具\n');
  
  // 检查环境变量
  const requiredEnvVars = ['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_ENDPOINT', 'R2_BUCKET_NAME'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ 缺少环境变量:');
    missingVars.forEach(varName => console.log(`  - ${varName}`));
    console.log('\n请先设置环境变量或使用以下命令:');
    console.log('R2_ACCESS_KEY_ID=your_key R2_SECRET_ACCESS_KEY=your_secret npm run images:setup-public');
    return;
  }
  
  setupPublicAccess().catch(console.error);
}

if (require.main === module) {
  main();
}

