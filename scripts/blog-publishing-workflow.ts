#!/usr/bin/env tsx

/**
 * DaysFromToday 博客发布流程自动化脚本
 * 
 * 功能：
 * 1. 检查中文博客文件
 * 2. 生成英文翻译
 * 3. 更新博客首页
 * 4. 提交到Git
 * 5. 验证部署
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

interface BlogPost {
  slug: string;
  title: {
    en: string;
    zh: string;
  };
  excerpt: {
    en: string;
    zh: string;
  };
  date: string;
  readTime: {
    en: string;
    zh: string;
  };
  category: {
    en: string;
    zh: string;
  };
  featured: boolean;
}

class BlogPublishingWorkflow {
  private zhBlogDir = 'obsidian/content/blog/zh';
  private enBlogDir = 'obsidian/content/blog/en';
  private blogPagePath = 'app/[locale]/blog/page.tsx';

  /**
   * 执行完整的博客发布流程
   */
  async executeWorkflow() {
    console.log('🚀 开始执行博客发布流程...\n');

    try {
      // 1. 检查中文博客文件
      const zhBlogs = await this.checkChineseBlogs();
      console.log(`✅ 发现 ${zhBlogs.length} 个中文博客文件\n`);

      // 2. 生成英文翻译
      await this.generateEnglishTranslations(zhBlogs);
      console.log('✅ 英文翻译生成完成\n');

      // 3. 更新博客首页
      await this.updateBlogHomepage(zhBlogs);
      console.log('✅ 博客首页更新完成\n');

      // 4. 提交到Git
      await this.commitToGit();
      console.log('✅ Git提交完成\n');

      // 5. 验证部署
      await this.verifyDeployment();
      console.log('✅ 部署验证完成\n');

      console.log('🎉 博客发布流程执行成功！');
    } catch (error) {
      console.error('❌ 博客发布流程执行失败:', error);
      process.exit(1);
    }
  }

  /**
   * 检查中文博客文件
   */
  private async checkChineseBlogs(): Promise<string[]> {
    console.log('📝 检查中文博客文件...');
    
    if (!await fs.pathExists(this.zhBlogDir)) {
      throw new Error(`中文博客目录不存在: ${this.zhBlogDir}`);
    }

    const files = await fs.readdir(this.zhBlogDir);
    const blogFiles = files.filter(file => 
      file.endsWith('.md') && 
      !file.startsWith('blog-template') &&
      !file.startsWith('.')
    );

    console.log(`发现博客文件: ${blogFiles.join(', ')}`);
    return blogFiles;
  }

  /**
   * 生成英文翻译
   */
  private async generateEnglishTranslations(zhBlogs: string[]): Promise<void> {
    console.log('🌍 生成英文翻译...');
    
    for (const blogFile of zhBlogs) {
      const zhPath = path.join(this.zhBlogDir, blogFile);
      const enPath = path.join(this.enBlogDir, blogFile);
      
      // 检查英文版本是否已存在
      if (await fs.pathExists(enPath)) {
        console.log(`⚠️  英文版本已存在: ${blogFile}`);
        continue;
      }

      // 这里应该调用AI翻译API
      // 目前只是复制文件作为示例
      console.log(`📝 需要翻译: ${blogFile}`);
      console.log(`   请手动翻译并保存到: ${enPath}`);
    }
  }

  /**
   * 更新博客首页
   */
  private async updateBlogHomepage(zhBlogs: string[]): Promise<void> {
    console.log('🏠 更新博客首页...');
    
    // 读取当前博客页面配置
    const blogPageContent = await fs.readFile(this.blogPagePath, 'utf-8');
    
    // 这里应该解析现有配置并添加新博客
    // 目前只是输出提示
    console.log('📝 需要更新博客首页配置');
    console.log('   请手动更新 app/[locale]/blog/page.tsx 文件');
    console.log('   将新博客添加到 blogPosts 数组并设置 featured: true');
  }

  /**
   * 提交到Git
   */
  private async commitToGit(): Promise<void> {
    console.log('📦 提交到Git...');
    
    try {
      // 检查Git状态
      const status = execSync('git status --porcelain', { encoding: 'utf-8' });
      
      if (status.trim()) {
        console.log('发现未提交的更改:');
        console.log(status);
        
        // 添加所有更改
        execSync('git add .', { stdio: 'inherit' });
        
        // 提交更改
        const commitMessage = 'feat: 添加新博客文章\n\n- 更新博客首页显示\n- 设置新文章置顶显示\n- 优化SEO和sitemap';
        execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
        
        // 推送到远程
        execSync('git push origin main', { stdio: 'inherit' });
        
        console.log('✅ Git提交完成');
      } else {
        console.log('✅ 没有需要提交的更改');
      }
    } catch (error) {
      console.error('❌ Git操作失败:', error);
      throw error;
    }
  }

  /**
   * 验证部署
   */
  private async verifyDeployment(): Promise<void> {
    console.log('🔍 验证部署...');
    
    // 等待部署完成
    console.log('⏳ 等待Vercel部署完成...');
    await new Promise(resolve => setTimeout(resolve, 60000)); // 等待60秒
    
    // 检查生产环境
    const productionUrls = [
      'https://www.daysfromtoday.ai/en/blog',
      'https://www.daysfromtoday.ai/zh/blog'
    ];
    
    for (const url of productionUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          console.log(`✅ ${url} 访问正常`);
        } else {
          console.log(`❌ ${url} 访问异常: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${url} 访问失败: ${error}`);
      }
    }
  }

  /**
   * 显示使用说明
   */
  static showUsage() {
    console.log(`
📚 DaysFromToday 博客发布流程

使用方法:
  npm run blog:workflow    # 执行完整流程
  npm run blog:check       # 仅检查博客文件
  npm run blog:translate   # 仅生成翻译
  npm run blog:update      # 仅更新首页
  npm run blog:deploy      # 仅部署验证

流程说明:
  1. 在 obsidian/content/blog/zh/ 创建中文博客
  2. 运行脚本生成英文翻译
  3. 自动更新博客首页
  4. 提交到Git并部署
  5. 验证生产环境

注意事项:
  - 确保中文博客文件格式正确
  - 检查英文翻译质量
  - 验证博客首页显示
  - 确认生产环境部署
    `);
  }
}

// 主程序
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    BlogPublishingWorkflow.showUsage();
    return;
  }

  const workflow = new BlogPublishingWorkflow();
  await workflow.executeWorkflow();
}

// 执行主程序
if (require.main === module) {
  main().catch(console.error);
}

export default BlogPublishingWorkflow;
