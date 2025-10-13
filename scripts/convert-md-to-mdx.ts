#!/usr/bin/env tsx

import { readdirSync, statSync, renameSync } from 'fs';
import { join, extname } from 'path';

// 递归转换目录中的 .md 文件为 .mdx
function convertDirectory(dirPath: string): number {
  let convertedCount = 0;
  
  try {
    const items = readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        convertedCount += convertDirectory(fullPath);
      } else if (item.endsWith('.md')) {
        const newPath = fullPath.replace('.md', '.mdx');
        renameSync(fullPath, newPath);
        console.log(`✅ 转换: ${item} → ${item.replace('.md', '.mdx')}`);
        convertedCount++;
      }
    }
  } catch (error) {
    console.error(`❌ 处理目录失败 ${dirPath}:`, error);
  }
  
  return convertedCount;
}

// 主函数
function main() {
  console.log('🔄 开始转换 .md 文件为 .mdx...');
  
  const contentDir = join(process.cwd(), 'content');
  
  if (!statSync(contentDir).isDirectory()) {
    console.error('❌ Content 目录不存在');
    process.exit(1);
  }

  const convertedCount = convertDirectory(contentDir);
  
  console.log(`\n✅ 转换完成！共转换了 ${convertedCount} 个文件`);
}

// 运行脚本
if (require.main === module) {
  main();
}

