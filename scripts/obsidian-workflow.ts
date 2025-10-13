#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// 执行命令并显示输出
function runCommand(command: string, description: string) {
  console.log(`\n🔄 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    console.log(`✅ ${description}完成`);
    if (output.trim()) {
      console.log(output);
    }
  } catch (error: any) {
    console.error(`❌ ${description}失败:`, error.message);
    throw error;
  }
}

// 检查是否有新的 Obsidian 内容
function hasNewContent(): boolean {
  try {
    const obsidianDir = join(process.cwd(), 'obsidian', 'content');
    const contentDir = join(process.cwd(), 'content');
    
    // 简单检查：比较目录修改时间
    const obsidianStat = statSync(obsidianDir);
    const contentStat = statSync(contentDir);
    
    return obsidianStat.mtime > contentStat.mtime;
  } catch {
    return true; // 如果无法比较，假设有新内容
  }
}

// 主工作流
async function main() {
  console.log('🚀 启动 Obsidian 一键工作流...');
  
  try {
    // 步骤 1: 自动上传图片
    console.log('\n📸 步骤 1: 自动上传图片');
    runCommand('npm run images:auto-upload', '自动上传 Obsidian 图片');
    
    // 步骤 2: 同步内容
    console.log('\n📝 步骤 2: 同步内容');
    runCommand('npm run content:sync', '同步 Obsidian 内容');
    
    // 步骤 3: 转换文件格式
    console.log('\n🔄 步骤 3: 转换文件格式');
    runCommand('npm run content:convert', '转换 .md 为 .mdx');
    
    // 步骤 4: 启动开发服务器（如果未运行）
    console.log('\n🌐 步骤 4: 检查开发服务器');
    try {
      execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'pipe' });
      console.log('✅ 开发服务器已在运行');
    } catch {
      console.log('🚀 启动开发服务器...');
      runCommand('npm run dev', '启动开发服务器');
    }
    
    console.log('\n🎉 工作流完成！');
    console.log('📖 访问 http://localhost:3000 查看效果');
    
  } catch (error) {
    console.error('\n❌ 工作流执行失败:', error);
    process.exit(1);
  }
}

// 运行工作流
if (require.main === module) {
  main();
}

