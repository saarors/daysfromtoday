#!/usr/bin/env ts-node

/**
 * Obsidian 图片自动上传脚本
 * 
 * 用途:
 * 当在 Obsidian 中拖拽图片时，Local Images Plus 插件会自动调用此脚本
 * 
 * 功能:
 * 1. 读取图片
 * 2. 智能优化（压缩、裁剪）
 * 3. 上传到 Cloudflare R2
 * 4. 返回 CDN URL 给 Obsidian
 * 
 * 用法:
 * node scripts/obsidian-upload-image.ts --path=/path/to/image.jpg --vault=/path/to/vault
 */

import fs from 'fs/promises';
import path from 'path';
import { 
  uploadMultiFormatImage, 
  generateStoragePath, 
  isR2Configured,
  R2_INFO 
} from '../lib/r2-client';

// ============================================================
// 参数解析
// ============================================================

interface Args {
  path: string;
  vault: string;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  
  const pathArg = args.find((arg) => arg.startsWith('--path='));
  const vaultArg = args.find((arg) => arg.startsWith('--vault='));
  
  if (!pathArg) {
    throw new Error('❌ Missing --path argument');
  }
  
  const filePath = pathArg.split('=')[1];
  const vaultPath = vaultArg?.split('=')[1] || process.cwd();
  
  return { path: filePath, vault: vaultPath };
}

// ============================================================
// 主函数
// ============================================================

async function main() {
  try {
    // 1. 解析参数
    const { path: filePath, vault: vaultPath } = parseArgs();
    
    console.log('📤 Obsidian Image Upload');
    console.log('─'.repeat(50));
    console.log(`File: ${path.basename(filePath)}`);
    
    // 2. 检查 R2 配置
    if (!isR2Configured()) {
      console.error('\n❌ R2 not configured!');
      console.error('Please set environment variables:');
      console.error('  - R2_ACCOUNT_ID');
      console.error('  - R2_ACCESS_KEY_ID');
      console.error('  - R2_SECRET_ACCESS_KEY');
      console.error('  - R2_BUCKET_NAME');
      console.error('\nR2 Info:', R2_INFO);
      process.exit(1);
    }
    
    // 3. 读取图片
    console.log('\n📖 Reading image...');
    const buffer = await fs.readFile(filePath);
    console.log(`✓ Size: ${(buffer.length / 1024).toFixed(2)} KB`);
    
    // 4. 生成存储路径
    const storagePath = generateStoragePath(vaultPath, filePath);
    console.log(`✓ Storage path: ${storagePath}`);
    
    // 5. 上传到 R2（生成 WebP + JPEG）
    console.log('\n⬆️  Uploading to R2...');
    const { webp, jpeg } = await uploadMultiFormatImage(buffer, storagePath);
    
    console.log('\n✅ Upload successful!');
    console.log('─'.repeat(50));
    console.log(`WebP: ${webp.url}`);
    console.log(`  Size: ${(webp.metadata.size / 1024).toFixed(2)} KB`);
    console.log(`  Dimensions: ${webp.metadata.width}×${webp.metadata.height}`);
    console.log();
    console.log(`JPEG: ${jpeg.url}`);
    console.log(`  Size: ${(jpeg.metadata.size / 1024).toFixed(2)} KB`);
    console.log(`  Dimensions: ${jpeg.metadata.width}×${jpeg.metadata.height}`);
    
    // 6. 生成 Markdown 引用代码
    const filename = path.basename(filePath, path.extname(filePath));
    console.log('\n📝 Markdown:');
    console.log(`<BlogImage src="${webp.url}" alt="${filename}" />`);
    
    // 7. 返回 WebP URL 给 Obsidian（stdout）
    // Obsidian Local Images Plus 会自动读取 stdout 并插入到编辑器
    process.stdout.write(webp.url);
    
  } catch (error) {
    console.error('\n❌ Upload failed:', error);
    console.error('\nStack:', error instanceof Error ? error.stack : '');
    process.exit(1);
  }
}

// ============================================================
// 执行
// ============================================================

main();

