#!/usr/bin/env tsx

/**
 * 全面的 SEO 和 GA 检查脚本
 * 
 * 功能：
 * 1. 检查所有关键页面的 SEO 配置
 * 2. 验证 GA 数据收集
 * 3. 测试页面可访问性
 * 4. 验证结构化数据
 * 5. 检查多语言支持
 */

import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// 加载环境变量
config({ path: '.env.local' });

interface PageCheckResult {
  url: string;
  status: number;
  seoScore: number;
  gaPresent: boolean;
  structuredData: boolean;
  hreflang: boolean;
  canonical: boolean;
  issues: string[];
  warnings: string[];
}

interface ComprehensiveReport {
  totalPages: number;
  successfulPages: number;
  failedPages: number;
  averageSeoScore: number;
  gaWorking: boolean;
  overallScore: number;
  pageResults: PageCheckResult[];
  recommendations: string[];
}

class ComprehensiveSEOGAValidator {
  private baseUrl = 'http://localhost:3000';
  private pages = [
    { path: '/en', name: 'Home (EN)' },
    { path: '/zh', name: 'Home (ZH)' },
    { path: '/en/blog', name: 'Blog (EN)' },
    { path: '/zh/blog', name: 'Blog (ZH)' },
    { path: '/en/blog/why-i-built-daysfromtoday', name: 'Blog Post (EN)' },
    { path: '/en/anniversaries', name: 'Anniversaries (EN)' },
    { path: '/en/holidays', name: 'Holidays (EN)' },
    { path: '/en/days/7', name: 'Days Calculator (EN)' },
    { path: '/en/business-days/5', name: 'Business Days (EN)' },
  ];

  /**
   * 检查单个页面
   */
  async checkPage(page: { path: string; name: string }): Promise<PageCheckResult> {
    const url = `${this.baseUrl}${page.path}`;
    const result: PageCheckResult = {
      url,
      status: 0,
      seoScore: 0,
      gaPresent: false,
      structuredData: false,
      hreflang: false,
      canonical: false,
      issues: [],
      warnings: []
    };

    try {
      // 获取页面内容
      const response = await fetch(url);
      result.status = response.status;

      if (!response.ok) {
        result.issues.push(`HTTP ${response.status}: ${response.statusText}`);
        return result;
      }

      const html = await response.text();
      
      // 检查 GA
      result.gaPresent = this.checkGA(html);
      
      // 检查 SEO 元素
      const seoChecks = this.checkSEO(html, page.path);
      result.seoScore = seoChecks.score;
      result.structuredData = seoChecks.structuredData;
      result.hreflang = seoChecks.hreflang;
      result.canonical = seoChecks.canonical;
      result.issues.push(...seoChecks.issues);
      result.warnings.push(...seoChecks.warnings);

    } catch (error) {
      result.issues.push(`Network error: ${error.message}`);
    }

    return result;
  }

  /**
   * 检查 Google Analytics
   */
  private checkGA(html: string): boolean {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return false;

    return html.includes(`gtag/js?id=${gaId}`) || 
           html.includes('GoogleAnalytics') ||
           html.includes('gtag(');
  }

  /**
   * 检查 SEO 元素
   */
  private checkSEO(html: string, path: string): {
    score: number;
    structuredData: boolean;
    hreflang: boolean;
    canonical: boolean;
    issues: string[];
    warnings: string[];
  } {
    const issues: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // 检查基本 SEO 元素
    if (!html.includes('<title>')) {
      issues.push('缺少页面标题');
      score -= 20;
    }

    if (!html.includes('name="description"')) {
      issues.push('缺少页面描述');
      score -= 15;
    }

    if (!html.includes('name="viewport"')) {
      issues.push('缺少视口设置');
      score -= 10;
    }

    // 检查结构化数据
    const structuredData = html.includes('application/ld+json');
    if (!structuredData) {
      warnings.push('缺少结构化数据');
      score -= 5;
    }

    // 检查 hreflang
    const hreflang = html.includes('hreflang=');
    if (!hreflang) {
      warnings.push('缺少 hreflang 标签');
      score -= 5;
    }

    // 检查 canonical
    const canonical = html.includes('rel="canonical"');
    if (!canonical) {
      warnings.push('缺少 canonical 链接');
      score -= 5;
    }

    // 检查 Open Graph
    if (!html.includes('property="og:')) {
      warnings.push('缺少 Open Graph 标签');
      score -= 5;
    }

    // 检查 Twitter Card
    if (!html.includes('name="twitter:')) {
      warnings.push('缺少 Twitter Card 标签');
      score -= 5;
    }

    // 检查 robots 标签
    if (!html.includes('name="robots"')) {
      warnings.push('缺少 robots 标签');
      score -= 5;
    }

    // 检查图片优化
    if (html.includes('<img') && !html.includes('alt=')) {
      warnings.push('图片缺少 alt 属性');
      score -= 5;
    }

    // 检查语义化 HTML
    if (!html.includes('<main') && !html.includes('<article')) {
      warnings.push('缺少语义化 HTML 标签');
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      structuredData,
      hreflang,
      canonical,
      issues,
      warnings
    };
  }

  /**
   * 生成综合报告
   */
  generateReport(results: PageCheckResult[]): ComprehensiveReport {
    const totalPages = results.length;
    const successfulPages = results.filter(r => r.status === 200).length;
    const failedPages = totalPages - successfulPages;
    const averageSeoScore = results.reduce((sum, r) => sum + r.seoScore, 0) / totalPages;
    const gaWorking = results.every(r => r.gaPresent);
    
    const overallScore = Math.round(
      (averageSeoScore * 0.7) + 
      (gaWorking ? 30 : 0) + 
      (successfulPages / totalPages * 20)
    );

    const recommendations: string[] = [];
    
    if (averageSeoScore < 90) {
      recommendations.push('优化 SEO 配置，提高页面评分');
    }
    
    if (!gaWorking) {
      recommendations.push('检查 Google Analytics 配置');
    }
    
    if (failedPages > 0) {
      recommendations.push('修复页面访问问题');
    }

    const structuredDataPages = results.filter(r => r.structuredData).length;
    if (structuredDataPages < totalPages * 0.8) {
      recommendations.push('为更多页面添加结构化数据');
    }

    return {
      totalPages,
      successfulPages,
      failedPages,
      averageSeoScore: Math.round(averageSeoScore),
      gaWorking,
      overallScore,
      pageResults: results,
      recommendations
    };
  }

  /**
   * 运行全面检查
   */
  async runComprehensiveCheck(): Promise<void> {
    console.log('🚀 开始全面的 SEO 和 GA 检查...\n');

    const results: PageCheckResult[] = [];
    
    for (const page of this.pages) {
      console.log(`🔍 检查页面: ${page.name} (${page.path})`);
      const result = await this.checkPage(page);
      results.push(result);
      
      const status = result.status === 200 ? '✅' : '❌';
      console.log(`   ${status} 状态: ${result.status}, SEO: ${result.seoScore}/100, GA: ${result.gaPresent ? '✅' : '❌'}`);
      
      if (result.issues.length > 0) {
        console.log(`   ❌ 问题: ${result.issues.join(', ')}`);
      }
      
      if (result.warnings.length > 0) {
        console.log(`   ⚠️  警告: ${result.warnings.join(', ')}`);
      }
      
      console.log('');
    }

    const report = this.generateReport(results);
    this.printReport(report);
  }

  /**
   * 打印报告
   */
  private printReport(report: ComprehensiveReport): void {
    console.log('📊 全面 SEO 和 GA 检查报告');
    console.log('='.repeat(60));
    
    console.log(`\n📈 总体统计:`);
    console.log(`   总页面数: ${report.totalPages}`);
    console.log(`   成功页面: ${report.successfulPages}`);
    console.log(`   失败页面: ${report.failedPages}`);
    console.log(`   平均 SEO 分数: ${report.averageSeoScore}/100`);
    console.log(`   GA 工作状态: ${report.gaWorking ? '✅ 正常' : '❌ 异常'}`);
    console.log(`   综合评分: ${report.overallScore}/100`);

    console.log(`\n📋 详细结果:`);
    report.pageResults.forEach(result => {
      const status = result.status === 200 ? '✅' : '❌';
      console.log(`   ${status} ${result.url}`);
      console.log(`      SEO: ${result.seoScore}/100, GA: ${result.gaPresent ? '✅' : '❌'}`);
      if (result.issues.length > 0) {
        console.log(`      问题: ${result.issues.join(', ')}`);
      }
    });

    if (report.recommendations.length > 0) {
      console.log(`\n🎯 建议:`);
      report.recommendations.forEach(rec => {
        console.log(`   - ${rec}`);
      });
    }

    console.log(`\n🏆 总体评价:`);
    if (report.overallScore >= 95) {
      console.log('   🎉 优秀！SEO 和 GA 配置完美');
    } else if (report.overallScore >= 85) {
      console.log('   ✅ 良好！建议优化部分配置');
    } else if (report.overallScore >= 70) {
      console.log('   ⚠️  一般，需要改进 SEO 和 GA 配置');
    } else {
      console.log('   ❌ 需要重大改进');
    }

    console.log(`\n🚀 下一步操作:`);
    console.log('   1. 访问 Google Analytics 查看实时数据');
    console.log('   2. 使用 Google Search Console 监控 SEO 表现');
    console.log('   3. 定期运行此检查脚本');
    console.log('   4. 根据建议优化配置');
  }
}

async function main() {
  const validator = new ComprehensiveSEOGAValidator();
  await validator.runComprehensiveCheck();
}

main().catch(console.error);

