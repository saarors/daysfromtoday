#!/usr/bin/env tsx

/**
 * Obsidian 到 Content 自动同步脚本
 * 
 * 功能：
 * 1. 监控 obsidian/content/ 目录变化
 * 2. 自动同步 .md 文件到 .mdx
 * 3. 处理图片和媒体文件
 * 4. 触发 Contentlayer 重新生成
 */

import { watch } from 'chokidar';
import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';

const OBSIDIAN_CONTENT_DIR = 'obsidian/content';
const CONTENT_DIR = 'content';

interface SyncOptions {
  watch: boolean;
  verbose: boolean;
}

class ObsidianContentSync {
  private options: SyncOptions;

  constructor(options: SyncOptions = { watch: false, verbose: false }) {
    this.options = options;
  }

  /**
   * 同步单个文件
   */
  private syncFile(sourcePath: string, targetPath: string): void {
    try {
      // 确保目标目录存在
      const targetDir = dirname(targetPath);
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      // 复制文件
      copyFileSync(sourcePath, targetPath);
      
      if (this.options.verbose) {
        console.log(`✅ 同步文件: ${relative(process.cwd(), sourcePath)} → ${relative(process.cwd(), targetPath)}`);
      }
    } catch (error) {
      console.error(`❌ 同步失败: ${sourcePath}`, error);
    }
  }

  /**
   * 同步目录
   */
  private syncDirectory(sourceDir: string, targetDir: string): void {
    if (!existsSync(sourceDir)) {
      console.warn(`⚠️  源目录不存在: ${sourceDir}`);
      return;
    }

    const items = readdirSync(sourceDir);
    
    for (const item of items) {
      const sourcePath = join(sourceDir, item);
      const targetPath = join(targetDir, item);
      const stat = statSync(sourcePath);

      if (stat.isDirectory()) {
        this.syncDirectory(sourcePath, targetPath);
      } else if (stat.isFile()) {
        // 处理 .md 文件转换为 .mdx
        if (item.endsWith('.md')) {
          const mdxPath = targetPath.replace(/\.md$/, '.mdx');
          this.syncFile(sourcePath, mdxPath);
        } else {
          // 其他文件直接复制
          this.syncFile(sourcePath, targetPath);
        }
      }
    }
  }

  /**
   * 触发 Contentlayer 重新生成
   */
  private triggerContentlayerRebuild(): void {
    try {
      console.log('🔄 触发 Contentlayer 重新生成...');
      execSync('npx contentlayer build', { stdio: 'inherit' });
      console.log('✅ Contentlayer 重新生成完成');
    } catch (error) {
      console.error('❌ Contentlayer 重新生成失败:', error);
    }
  }

  /**
   * 执行完整同步
   */
  public async sync(): Promise<void> {
    console.log('🚀 开始同步 Obsidian 内容...');
    
    // 确保目标目录存在
    if (!existsSync(CONTENT_DIR)) {
      mkdirSync(CONTENT_DIR, { recursive: true });
    }

    // 同步所有内容
    this.syncDirectory(OBSIDIAN_CONTENT_DIR, CONTENT_DIR);
    
    // 触发 Contentlayer 重新生成
    this.triggerContentlayerRebuild();
    
    console.log('✅ 同步完成');
  }

  /**
   * 启动文件监控
   */
  public startWatching(): void {
    console.log('👀 启动文件监控...');
    
    const watcher = watch(OBSIDIAN_CONTENT_DIR, {
      ignored: /(^|[\/\\])\../, // 忽略隐藏文件
      persistent: true,
      ignoreInitial: true
    });

    watcher
      .on('add', (path) => {
        console.log(`📄 新增文件: ${path}`);
        this.sync();
      })
      .on('change', (path) => {
        console.log(`📝 文件修改: ${path}`);
        this.sync();
      })
      .on('unlink', (path) => {
        console.log(`🗑️  文件删除: ${path}`);
        this.sync();
      })
      .on('error', (error) => {
        console.error('❌ 监控错误:', error);
      });

    console.log('✅ 文件监控已启动，按 Ctrl+C 停止');
  }
}

// 命令行接口
async function main() {
  const args = process.argv.slice(2);
  const options: SyncOptions = {
    watch: args.includes('--watch') || args.includes('-w'),
    verbose: args.includes('--verbose') || args.includes('-v')
  };

  const sync = new ObsidianContentSync(options);

  if (options.watch) {
    sync.startWatching();
  } else {
    await sync.sync();
  }
}

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n👋 同步服务已停止');
  process.exit(0);
});

if (require.main === module) {
  main().catch(console.error);
}

export { ObsidianContentSync };