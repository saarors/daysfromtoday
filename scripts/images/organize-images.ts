#!/usr/bin/env tsx

/**
 * 图片组织脚本
 * 用于将根目录的图片移动到合适的内容文件夹
 */

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

interface ImageFile {
  name: string;
  path: string;
  size: number;
  modified: Date;
}

interface OrganizeOptions {
  sourceDir: string;
  targetDir: string;
  dryRun?: boolean;
  verbose?: boolean;
}

class ImageOrganizer {
  private options: OrganizeOptions;

  constructor(options: OrganizeOptions) {
    this.options = options;
  }

  /**
   * 扫描源目录中的图片文件
   */
  async scanImages(): Promise<ImageFile[]> {
    const imageExtensions = ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.webp', '*.svg'];
    const patterns = imageExtensions.map(ext => path.join(this.options.sourceDir, ext));
    
    const files: ImageFile[] = [];
    
    for (const pattern of patterns) {
      const matches = await glob(pattern);
      for (const filePath of matches) {
        const stats = await fs.stat(filePath);
        files.push({
          name: path.basename(filePath),
          path: filePath,
          size: stats.size,
          modified: stats.mtime
        });
      }
    }

    return files.sort((a, b) => b.modified.getTime() - a.modified.getTime());
  }

  /**
   * 根据文件名和修改时间推断目标位置
   */
  inferTargetLocation(image: ImageFile): string {
    const { name } = image;
    
    // 检查是否已经在新结构中
    if (image.path.includes('/content/')) {
      return image.path;
    }

    // 根据修改时间推断年份和月份
    const year = image.modified.getFullYear();
    const month = String(image.modified.getMonth() + 1).padStart(2, '0');
    
    // 默认放到中文博客图片目录
    const targetDir = path.join(
      this.options.targetDir,
      'blog',
      'zh',
      'images',
      `${year}-${month}`
    );

    return path.join(targetDir, name);
  }

  /**
   * 移动图片文件
   */
  async moveImage(sourcePath: string, targetPath: string): Promise<void> {
    if (this.options.dryRun) {
      console.log(`[DRY RUN] Would move: ${sourcePath} -> ${targetPath}`);
      return;
    }

    // 确保目标目录存在
    await fs.ensureDir(path.dirname(targetPath));
    
    // 移动文件
    await fs.move(sourcePath, targetPath);
    
    if (this.options.verbose) {
      console.log(`Moved: ${sourcePath} -> ${targetPath}`);
    }
  }

  /**
   * 更新 Markdown 文件中的图片引用
   */
  async updateImageReferences(oldPath: string, newPath: string): Promise<void> {
    const contentDir = path.join(this.options.targetDir, 'blog');
    const mdFiles = await glob(path.join(contentDir, '**/*.md'));
    
    for (const mdFile of mdFiles) {
      let content = await fs.readFile(mdFile, 'utf-8');
      const oldImagePath = path.basename(oldPath);
      const newImagePath = path.relative(path.dirname(mdFile), newPath);
      
      // 更新图片引用
      const updatedContent = content.replace(
        new RegExp(`!\\[([^\\]]*)\\]\\([^)]*${oldImagePath}[^)]*\\)`, 'g'),
        `![$1](${newImagePath})`
      );
      
      if (content !== updatedContent) {
        await fs.writeFile(mdFile, updatedContent);
        if (this.options.verbose) {
          console.log(`Updated references in: ${mdFile}`);
        }
      }
    }
  }

  /**
   * 执行图片组织
   */
  async organize(): Promise<void> {
    console.log('🔍 Scanning for images...');
    const images = await this.scanImages();
    
    if (images.length === 0) {
      console.log('No images found.');
      return;
    }

    console.log(`Found ${images.length} images:`);
    
    for (const image of images) {
      const targetPath = this.inferTargetLocation(image);
      console.log(`📸 ${image.name} (${this.formatFileSize(image.size)})`);
      console.log(`   Source: ${image.path}`);
      console.log(`   Target: ${targetPath}`);
      
      await this.moveImage(image.path, targetPath);
      await this.updateImageReferences(image.path, targetPath);
      console.log('');
    }

    console.log('✅ Image organization complete!');
  }

  /**
   * 格式化文件大小
   */
  private formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');
  
  const options: OrganizeOptions = {
    sourceDir: 'obsidian',
    targetDir: 'obsidian/content',
    dryRun,
    verbose
  };

  console.log('📸 Image Organizer');
  console.log('==================');
  console.log(`Source: ${options.sourceDir}`);
  console.log(`Target: ${options.targetDir}`);
  console.log(`Dry Run: ${dryRun}`);
  console.log('');

  const organizer = new ImageOrganizer(options);
  await organizer.organize();
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

export { ImageOrganizer };
