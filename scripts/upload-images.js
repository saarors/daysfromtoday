#!/usr/bin/env node

/**
 * 图片上传脚本
 * 
 * 功能：
 * 1. 批量上传本地图片到 R2
 * 2. 自动优化和压缩
 * 3. 生成 CDN URL
 * 4. 更新 Markdown 文件中的图片链接
 */

const fs = require('fs');
const path = require('path');
const { uploadMultiFormatImage, generateStoragePath, isR2Configured } = require('../lib/r2-client.ts');

// 配置
const CONFIG = {
  // 支持的图片格式
  supportedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  
  // 最大文件大小（5MB）
  maxFileSize: 5 * 1024 * 1024,
  
  // 输出目录
  outputDir: 'obsidian/content',
};

/**
 * 检查 R2 配置
 */
function checkR2Config() {
  if (!isR2Configured()) {
    console.error('❌ R2 配置不完整，请检查环境变量：');
    console.error('   - R2_ACCOUNT_ID');
    console.error('   - R2_ACCESS_KEY_ID');
    console.error('   - R2_SECRET_ACCESS_KEY');
    console.error('   - R2_BUCKET_NAME');
    console.error('   - R2_PUBLIC_URL');
    process.exit(1);
  }
  console.log('✅ R2 配置检查通过');
}

/**
 * 获取目录中的所有图片文件
 */
function getImageFiles(dir) {
  const files = [];
  
  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (CONFIG.supportedFormats.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scanDir(dir);
  return files;
}

/**
 * 上传单个图片
 */
async function uploadImage(filePath) {
  try {
    console.log(`📤 上传: ${path.basename(filePath)}`);
    
    // 读取文件
    const buffer = fs.readFileSync(filePath);
    
    // 检查文件大小
    if (buffer.length > CONFIG.maxFileSize) {
      console.warn(`⚠️  文件过大 (${(buffer.length / 1024 / 1024).toFixed(2)}MB): ${path.basename(filePath)}`);
      return null;
    }
    
    // 生成存储路径
    const storagePath = generateStoragePath(process.cwd(), filePath);
    
    // 上传多格式图片
    const result = await uploadMultiFormatImage(buffer, storagePath);
    
    console.log(`✅ 上传成功: ${result.webp.url}`);
    console.log(`   WebP: ${(result.webp.metadata.size / 1024).toFixed(2)}KB`);
    console.log(`   JPEG: ${(result.jpeg.metadata.size / 1024).toFixed(2)}KB`);
    
    return {
      originalPath: filePath,
      webpUrl: result.webp.url,
      jpegUrl: result.jpeg.url,
      storagePath,
    };
    
  } catch (error) {
    console.error(`❌ 上传失败: ${path.basename(filePath)}`);
    console.error(`   错误: ${error.message}`);
    return null;
  }
}

/**
 * 更新 Markdown 文件中的图片链接
 */
function updateMarkdownFiles(uploadResults) {
  console.log('\n📝 更新 Markdown 文件...');
  
  // 获取所有 Markdown 文件
  const markdownFiles = [];
  
  function findMarkdownFiles(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findMarkdownFiles(fullPath);
      } else if (stat.isFile() && path.extname(item) === '.md') {
        markdownFiles.push(fullPath);
      }
    }
  }
  
  findMarkdownFiles(CONFIG.outputDir);
  
  let updatedFiles = 0;
  
  for (const filePath of markdownFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    for (const result of uploadResults) {
      if (!result) continue;
      
      const originalName = path.basename(result.originalPath);
      const originalNameWithoutExt = path.parse(originalName).name;
      
      // 替换图片链接
      const patterns = [
        // ![[image.png]]
        new RegExp(`!\\[\\[${originalNameWithoutExt}\\.[^\\]]+\\]\\]`, 'g'),
        // ![alt](path/to/image.png)
        new RegExp(`!\\[([^\\]]*)\\]\\([^)]*${originalNameWithoutExt}\\.[^)]+\\)`, 'g'),
      ];
      
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, `![$1](${result.webpUrl})`);
          hasChanges = true;
        }
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedFiles++;
      console.log(`✅ 更新: ${path.relative(process.cwd(), filePath)}`);
    }
  }
  
  console.log(`📝 共更新 ${updatedFiles} 个 Markdown 文件`);
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const inputDir = args[0] || 'obsidian/images';
  
  console.log('🚀 开始上传图片...');
  console.log(`📁 输入目录: ${inputDir}`);
  console.log(`📁 输出目录: ${CONFIG.outputDir}`);
  
  // 检查配置
  checkR2Config();
  
  // 检查输入目录
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ 输入目录不存在: ${inputDir}`);
    process.exit(1);
  }
  
  // 获取图片文件
  const imageFiles = getImageFiles(inputDir);
  console.log(`📸 找到 ${imageFiles.length} 个图片文件`);
  
  if (imageFiles.length === 0) {
    console.log('ℹ️  没有找到图片文件');
    return;
  }
  
  // 上传图片
  const uploadResults = [];
  for (const filePath of imageFiles) {
    const result = await uploadImage(filePath);
    uploadResults.push(result);
  }
  
  // 统计结果
  const successCount = uploadResults.filter(r => r !== null).length;
  const failCount = uploadResults.length - successCount;
  
  console.log(`\n📊 上传完成:`);
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ❌ 失败: ${failCount}`);
  
  // 更新 Markdown 文件
  if (successCount > 0) {
    updateMarkdownFiles(uploadResults);
  }
  
  console.log('\n🎉 图片上传完成！');
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { uploadImage, getImageFiles, updateMarkdownFiles };
