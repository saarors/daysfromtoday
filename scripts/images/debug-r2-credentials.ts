#!/usr/bin/env tsx

/**
 * R2 凭据调试脚本
 * 
 * 功能：
 * 1. 检查凭据格式
 * 2. 测试不同的凭据组合
 * 3. 提供调试信息
 * 
 * 使用方法：
 * npm run images:debug-r2
 */

// 从环境变量读取凭据（安全）
const CREDENTIALS = {
  // User API 令牌 (推荐使用)
  userAccessKeyId: process.env.R2_USER_ACCESS_KEY_ID || '[R2_USER_ACCESS_KEY_ID]',
  userSecretAccessKey: process.env.R2_USER_SECRET_ACCESS_KEY || '[R2_USER_SECRET_ACCESS_KEY]',
  // Account API 令牌 (备选)
  accountAccessKeyId: process.env.R2_ACCESS_KEY_ID || '[R2_ACCESS_KEY_ID]',
  accountSecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '[R2_SECRET_ACCESS_KEY]',
};

function analyzeCredentials() {
  console.log('🔍 分析 R2 凭据...\n');
  
  console.log('📋 凭据信息:');
  console.log(`User Access Key ID: ${CREDENTIALS.userAccessKeyId} (长度: ${CREDENTIALS.userAccessKeyId.length})`);
  console.log(`User Secret Access Key: ${CREDENTIALS.userSecretAccessKey} (长度: ${CREDENTIALS.userSecretAccessKey.length})`);
  console.log(`Account Access Key ID: ${CREDENTIALS.accountAccessKeyId} (长度: ${CREDENTIALS.accountAccessKeyId.length})`);
  console.log(`Account Secret Access Key: ${CREDENTIALS.accountSecretAccessKey} (长度: ${CREDENTIALS.accountSecretAccessKey.length})`);
  
  console.log('\n🔍 格式分析:');
  
  // 检查长度
  if (CREDENTIALS.userAccessKeyId.length === 32) {
    console.log('✅ User Access Key ID 长度正确 (32)');
  } else {
    console.log(`❌ User Access Key ID 长度错误: ${CREDENTIALS.userAccessKeyId.length} (应该是 32)`);
  }
  
  if (CREDENTIALS.userSecretAccessKey.length === 64) {
    console.log('✅ User Secret Access Key 长度正确 (64)');
  } else {
    console.log(`❌ User Secret Access Key 长度错误: ${CREDENTIALS.userSecretAccessKey.length} (应该是 64)`);
  }
  
  if (CREDENTIALS.accountAccessKeyId.length === 32) {
    console.log('✅ Account Access Key ID 长度正确 (32)');
  } else {
    console.log(`❌ Account Access Key ID 长度错误: ${CREDENTIALS.accountAccessKeyId.length} (应该是 32)`);
  }
  
  if (CREDENTIALS.accountSecretAccessKey.length === 64) {
    console.log('✅ Account Secret Access Key 长度正确 (64)');
  } else {
    console.log(`❌ Account Secret Access Key 长度错误: ${CREDENTIALS.accountSecretAccessKey.length} (应该是 64)`);
  }
  
  // 检查格式
  const hexPattern = /^[a-f0-9]+$/;
  
  if (hexPattern.test(CREDENTIALS.userAccessKeyId)) {
    console.log('✅ User Access Key ID 格式正确 (十六进制)');
  } else {
    console.log('❌ User Access Key ID 格式错误');
  }
  
  if (hexPattern.test(CREDENTIALS.userSecretAccessKey)) {
    console.log('✅ User Secret Access Key 格式正确 (十六进制)');
  } else {
    console.log('❌ User Secret Access Key 格式错误');
  }
  
  console.log('\n💡 推荐配置:');
  console.log('```bash');
  console.log('# User API 令牌 (推荐使用)');
  console.log(`R2_ACCESS_KEY_ID=${CREDENTIALS.userAccessKeyId}`);
  console.log(`R2_SECRET_ACCESS_KEY=${CREDENTIALS.userSecretAccessKey}`);
  console.log('R2_ENDPOINT=https://44466a5b45e448959d15908ac94f0c38.r2.cloudflarestorage.com');
  console.log('R2_BUCKET_NAME=daysfromtoday-assets');
  console.log('CDN_BASE_URL=https://cdn.daysfromtoday.ai');
  console.log('```');
  
  console.log('\n```bash');
  console.log('# Account API 令牌 (备选)');
  console.log(`R2_ACCESS_KEY_ID=${CREDENTIALS.accountAccessKeyId}`);
  console.log(`R2_SECRET_ACCESS_KEY=${CREDENTIALS.accountSecretAccessKey}`);
  console.log('R2_ENDPOINT=https://44466a5b45e448959d15908ac94f0c38.r2.cloudflarestorage.com');
  console.log('R2_BUCKET_NAME=daysfromtoday-assets');
  console.log('CDN_BASE_URL=https://cdn.daysfromtoday.ai');
  console.log('```');
}

function main() {
  console.log('🚀 R2 凭据调试工具\n');
  
  analyzeCredentials();
  
  console.log('\n📝 下一步:');
  console.log('1. 根据建议的凭据组合更新 .env.local 文件');
  console.log('2. 运行 npm run images:setup-r2 测试连接');
  console.log('3. 如果仍然失败，请检查 Cloudflare Dashboard 中的 API 令牌配置');
}

if (require.main === module) {
  main();
}
