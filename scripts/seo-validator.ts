#!/usr/bin/env tsx

/**
 * SEO 验证脚本
 * 
 * 功能：
 * 1. 检查所有页面的 SEO 元数据
 * 2. 验证结构化数据
 * 3. 检查页面性能指标
 * 4. 验证多语言配置
 * 5. 检查内部链接
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// 加载环境变量
config({ path: '.env.local' });

interface SEOReport {
  page: string;
  issues: string[];
  warnings: string[];
  score: number;
}

interface ValidationResult {
  totalPages: number;
  passedPages: number;
  failedPages: number;
  averageScore: number;
  reports: SEOReport[];
}

class SEOValidator {
  private baseUrl: string;
  private reports: SEOReport[] = [];

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.daysfromtoday.ai';
  }

  /**
   * 验证单个页面的 SEO
   */
  async validatePage(pagePath: string): Promise<SEOReport> {
    const report: SEOReport = {
      page: pagePath,
      issues: [],
      warnings: [],
      score: 100
    };

    try {
      // 检查页面文件是否存在
      if (!this.pageExists(pagePath)) {
        report.issues.push('页面文件不存在');
        report.score -= 50;
        return report;
      }

      // 检查 Meta 标签
      await this.checkMetaTags(pagePath, report);

      // 检查结构化数据
      await this.checkStructuredData(pagePath, report);

      // 检查多语言配置
      await this.checkMultilingualConfig(pagePath, report);

      // 检查内部链接
      await this.checkInternalLinks(pagePath, report);

    } catch (error) {
      report.issues.push(`验证错误: ${error instanceof Error ? error.message : String(error)}`);
      report.score -= 30;
    }

    this.reports.push(report);
    return report;
  }

  /**
   * 检查页面是否存在
   */
  private pageExists(pagePath: string): boolean {
    const fullPath = join(process.cwd(), 'app', pagePath);
    return statSync(fullPath, { throwIfNoEntry: false })?.isFile() || false;
  }

  /**
   * 检查 Meta 标签
   */
  private async checkMetaTags(pagePath: string, report: SEOReport): Promise<void> {
    const requiredMetaTags = [
      'title',
      'description',
      'openGraph',
      'twitter'
    ];

    // 这里应该解析页面文件检查 Meta 标签
    // 简化版本：检查文件内容
    try {
      const fullPath = join(process.cwd(), 'app', pagePath);
      const content = readFileSync(fullPath, 'utf-8');

      if (!content.includes('generateMetadata')) {
        report.warnings.push('缺少 generateMetadata 函数');
        report.score -= 10;
      }

      if (!content.includes('title')) {
        report.issues.push('缺少 title 标签');
        report.score -= 20;
      }

      if (!content.includes('description')) {
        report.issues.push('缺少 description 标签');
        report.score -= 15;
      }

      if (!content.includes('openGraph')) {
        report.warnings.push('缺少 Open Graph 标签');
        report.score -= 5;
      }

    } catch (error) {
      report.issues.push(`Meta 标签检查失败: ${error.message}`);
      report.score -= 10;
    }
  }

  /**
   * 检查结构化数据
   */
  private async checkStructuredData(pagePath: string, report: SEOReport): Promise<void> {
    try {
      const fullPath = join(process.cwd(), 'app', pagePath);
      const content = readFileSync(fullPath, 'utf-8');

      if (pagePath.includes('blog') && !content.includes('application/ld+json')) {
        report.warnings.push('博客页面缺少 Article 结构化数据');
        report.score -= 5;
      }

      if (!content.includes('schema.org')) {
        report.warnings.push('缺少结构化数据');
        report.score -= 5;
      }

    } catch (error) {
      report.issues.push(`结构化数据检查失败: ${error.message}`);
      report.score -= 5;
    }
  }

  /**
   * 检查多语言配置
   */
  private async checkMultilingualConfig(pagePath: string, report: SEOReport): Promise<void> {
    try {
      const fullPath = join(process.cwd(), 'app', pagePath);
      const content = readFileSync(fullPath, 'utf-8');

      if (!content.includes('alternates')) {
        report.warnings.push('缺少多语言 alternate 标签');
        report.score -= 5;
      }

      if (!content.includes('canonical')) {
        report.warnings.push('缺少 canonical URL');
        report.score -= 5;
      }

    } catch (error) {
      report.issues.push(`多语言配置检查失败: ${error.message}`);
      report.score -= 5;
    }
  }

  /**
   * 检查内部链接
   */
  private async checkInternalLinks(pagePath: string, report: SEOReport): Promise<void> {
    try {
      const fullPath = join(process.cwd(), 'app', pagePath);
      const content = readFileSync(fullPath, 'utf-8');

      if (!content.includes('Breadcrumb')) {
        report.warnings.push('缺少面包屑导航');
        report.score -= 5;
      }

    } catch (error) {
      report.issues.push(`内部链接检查失败: ${error.message}`);
      report.score -= 5;
    }
  }

  /**
   * 获取所有页面路径
   */
  private getAllPages(): string[] {
    const pages: string[] = [];
    
    // 添加主要页面
    const mainPages = [
      '[locale]/page.tsx',
      '[locale]/blog/page.tsx',
      '[locale]/blog/[slug]/page.tsx',
      '[locale]/anniversaries/page.tsx',
      '[locale]/holidays/page.tsx',
      '[locale]/days/[n]/page.tsx',
      '[locale]/days/ago/[n]/page.tsx',
      '[locale]/business-days/[n]/page.tsx',
      '[locale]/business-days/ago/[n]/page.tsx',
    ];

    pages.push(...mainPages);
    return pages;
  }

  /**
   * 运行完整验证
   */
  async runValidation(): Promise<ValidationResult> {
    console.log('🔍 开始 SEO 验证...\n');

    const pages = this.getAllPages();
    
    for (const page of pages) {
      console.log(`📄 验证页面: ${page}`);
      await this.validatePage(page);
    }

    const totalPages = this.reports.length;
    const passedPages = this.reports.filter(r => r.issues.length === 0).length;
    const failedPages = totalPages - passedPages;
    const averageScore = this.reports.reduce((sum, r) => sum + r.score, 0) / totalPages;

    return {
      totalPages,
      passedPages,
      failedPages,
      averageScore,
      reports: this.reports
    };
  }

  /**
   * 生成报告
   */
  generateReport(result: ValidationResult): void {
    console.log('\n📊 SEO 验证报告');
    console.log('='.repeat(50));
    
    console.log(`\n📈 总体统计:`);
    console.log(`   总页面数: ${result.totalPages}`);
    console.log(`   通过页面: ${result.passedPages}`);
    console.log(`   失败页面: ${result.failedPages}`);
    console.log(`   平均分数: ${result.averageScore.toFixed(1)}/100`);
    
    console.log(`\n📋 详细报告:`);
    
    result.reports.forEach(report => {
      console.log(`\n📄 ${report.page}`);
      console.log(`   分数: ${report.score}/100`);
      
      if (report.issues.length > 0) {
        console.log(`   ❌ 问题:`);
        report.issues.forEach(issue => {
          console.log(`      - ${issue}`);
        });
      }
      
      if (report.warnings.length > 0) {
        console.log(`   ⚠️  警告:`);
        report.warnings.forEach(warning => {
          console.log(`      - ${warning}`);
        });
      }
      
      if (report.issues.length === 0 && report.warnings.length === 0) {
        console.log(`   ✅ 无问题`);
      }
    });

    console.log('\n🎯 建议:');
    if (result.averageScore < 80) {
      console.log('   - 需要修复关键 SEO 问题');
    } else if (result.averageScore < 90) {
      console.log('   - 建议优化警告项');
    } else {
      console.log('   - SEO 配置良好，继续保持');
    }
  }
}

async function main() {
  const validator = new SEOValidator();
  const result = await validator.runValidation();
  validator.generateReport(result);
}

main().catch(console.error);

