#!/usr/bin/env tsx

/**
 * Google Analytics 配置验证脚本
 * 
 * 功能：
 * 1. 检查环境变量中的 GA ID
 * 2. 验证 GA 组件是否正确加载
 * 3. 测试页面是否包含 GA 脚本
 */

import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// 加载环境变量
config({ path: '.env.local' });

interface GAConfigReport {
  envVar: boolean;
  gaId: string | null;
  layoutFile: boolean;
  gaComponent: boolean;
  gtagScript: boolean;
  issues: string[];
  warnings: string[];
}

class GAConfigValidator {
  private report: GAConfigReport = {
    envVar: false,
    gaId: null,
    layoutFile: false,
    gaComponent: false,
    gtagScript: false,
    issues: [],
    warnings: []
  };

  /**
   * 验证环境变量配置
   */
  validateEnvironmentVariables(): void {
    console.log('🔍 检查环境变量配置...');
    
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    
    if (!gaId) {
      this.report.issues.push('NEXT_PUBLIC_GA_ID 环境变量未设置');
      return;
    }
    
    this.report.envVar = true;
    this.report.gaId = gaId;
    
    // 验证 GA ID 格式
    if (!gaId.startsWith('G-')) {
      this.report.issues.push(`GA ID 格式不正确: ${gaId} (应该以 G- 开头)`);
    } else if (gaId.length !== 12) {
      this.report.warnings.push(`GA ID 长度异常: ${gaId} (通常为 12 个字符)`);
    }
    
    console.log(`✅ GA ID: ${gaId}`);
  }

  /**
   * 验证布局文件配置
   */
  validateLayoutFiles(): void {
    console.log('\n🔍 检查布局文件配置...');
    
    try {
      // 检查根布局文件
      const rootLayoutPath = join(process.cwd(), 'app', 'layout.tsx');
      const rootLayoutContent = readFileSync(rootLayoutPath, 'utf-8');
      
      if (rootLayoutContent.includes('GoogleAnalytics')) {
        this.report.layoutFile = true;
        console.log('✅ 根布局文件包含 GoogleAnalytics 组件');
      } else {
        this.report.issues.push('根布局文件缺少 GoogleAnalytics 组件');
      }
      
      // 检查多语言布局文件
      const localeLayoutPath = join(process.cwd(), 'app', '[locale]', 'layout.tsx');
      const localeLayoutContent = readFileSync(localeLayoutPath, 'utf-8');
      
      if (localeLayoutContent.includes('GoogleAnalytics')) {
        this.report.gaComponent = true;
        console.log('✅ 多语言布局文件包含 GoogleAnalytics 组件');
      } else {
        this.report.issues.push('多语言布局文件缺少 GoogleAnalytics 组件');
      }
      
      // 检查 GA 追踪器组件
      if (localeLayoutContent.includes('GATracker')) {
        console.log('✅ 包含 GA 路由追踪器');
      } else {
        this.report.warnings.push('缺少 GA 路由追踪器组件');
      }
      
    } catch (error) {
      this.report.issues.push(`布局文件检查失败: ${error.message}`);
    }
  }

  /**
   * 验证 GA 脚本注入
   */
  validateGAScriptInjection(): void {
    console.log('\n🔍 检查 GA 脚本注入...');
    
    try {
      const localeLayoutPath = join(process.cwd(), 'app', '[locale]', 'layout.tsx');
      const localeLayoutContent = readFileSync(localeLayoutPath, 'utf-8');
      
      // 检查是否使用了 @next/third-parties
      if (localeLayoutContent.includes('@next/third-parties/google')) {
        this.report.gtagScript = true;
        console.log('✅ 使用 @next/third-parties 官方 GA 组件');
      } else {
        this.report.issues.push('未使用 @next/third-parties 官方 GA 组件');
      }
      
      // 检查环境变量使用
      if (localeLayoutContent.includes('process.env.NEXT_PUBLIC_GA_ID')) {
        console.log('✅ 正确使用环境变量中的 GA ID');
      } else {
        this.report.issues.push('未正确使用环境变量中的 GA ID');
      }
      
    } catch (error) {
      this.report.issues.push(`GA 脚本检查失败: ${error.message}`);
    }
  }

  /**
   * 生成验证报告
   */
  generateReport(): void {
    console.log('\n📊 Google Analytics 配置验证报告');
    console.log('='.repeat(50));
    
    // 总体状态
    const totalChecks = 5;
    const passedChecks = [
      this.report.envVar,
      this.report.gaId !== null,
      this.report.layoutFile,
      this.report.gaComponent,
      this.report.gtagScript
    ].filter(Boolean).length;
    
    const score = Math.round((passedChecks / totalChecks) * 100);
    
    console.log(`\n📈 总体评分: ${score}/100`);
    console.log(`   通过检查: ${passedChecks}/${totalChecks}`);
    
    // 详细状态
    console.log(`\n📋 详细状态:`);
    console.log(`   环境变量: ${this.report.envVar ? '✅' : '❌'} ${this.report.gaId || '未设置'}`);
    console.log(`   根布局文件: ${this.report.layoutFile ? '✅' : '❌'}`);
    console.log(`   多语言布局: ${this.report.gaComponent ? '✅' : '❌'}`);
    console.log(`   GA 脚本注入: ${this.report.gtagScript ? '✅' : '❌'}`);
    
    // 问题和警告
    if (this.report.issues.length > 0) {
      console.log(`\n❌ 问题:`);
      this.report.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }
    
    if (this.report.warnings.length > 0) {
      console.log(`\n⚠️  警告:`);
      this.report.warnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
    }
    
    // 建议
    console.log(`\n🎯 建议:`);
    if (score === 100) {
      console.log('   🎉 GA 配置完美！可以开始收集数据了。');
    } else if (score >= 80) {
      console.log('   ✅ GA 配置良好，建议修复警告项。');
    } else if (score >= 60) {
      console.log('   ⚠️  GA 配置需要改进，请修复问题项。');
    } else {
      console.log('   ❌ GA 配置有严重问题，需要立即修复。');
    }
    
    // 下一步操作
    console.log(`\n🚀 下一步操作:`);
    console.log('   1. 访问网站页面触发 GA 事件');
    console.log('   2. 在 GA4 实时报告中查看数据');
    console.log('   3. 等待 24-48 小时查看完整数据');
  }

  /**
   * 运行完整验证
   */
  async runValidation(): Promise<void> {
    console.log('🚀 开始 Google Analytics 配置验证...\n');
    
    this.validateEnvironmentVariables();
    this.validateLayoutFiles();
    this.validateGAScriptInjection();
    this.generateReport();
  }
}

async function main() {
  const validator = new GAConfigValidator();
  await validator.runValidation();
}

main().catch(console.error);

