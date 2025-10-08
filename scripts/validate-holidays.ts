/**
 * 节假日数据验证脚本
 * 
 * @description
 * 验证 Markdown 配置文件的格式和数据完整性
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { CountryCode } from '../types/user-context';
import { parseHolidayMarkdown } from '../data/holidays/parser';

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * 验证单个国家的配置文件
 */
async function validateCountry(country: CountryCode): Promise<{
  country: CountryCode;
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalHolidays: number;
    yearsCovered: number;
    verified: boolean;
  };
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const filePath = join(process.cwd(), 'data', 'holidays', `${country}.md`);
    const markdown = await readFile(filePath, 'utf-8');
    
    // 解析 Markdown
    const parsed = parseHolidayMarkdown(markdown, country);
    
    // 收集解析错误
    if (parsed.errors) {
      errors.push(...parsed.errors);
    }
    
    if (parsed.warnings) {
      warnings.push(...parsed.warnings);
    }
    
    // 数据完整性检查
    const { data } = parsed;
    
    // 检查元数据
    if (!data.metadata.source || data.metadata.source === 'unknown') {
      warnings.push('缺少数据来源信息');
    }
    
    // 检查年份数据
    const years = Object.keys(data.years);
    if (years.length === 0) {
      errors.push('没有任何年份数据');
    }
    
    // 检查每个年份的数据
    for (const year of years) {
      const holidays = data.years[year];
      
      if (holidays.length === 0) {
        warnings.push(`${year} 年没有节假日数据`);
      }
      
      // 检查每个节假日
      for (const holiday of holidays) {
        // 验证日期格式
        if (!/^\d{4}-\d{2}-\d{2}$/.test(holiday.date)) {
          errors.push(`${year} 年节假日日期格式错误: ${holiday.date}`);
        }
        
        // 验证名称
        if (!holiday.name.en || !holiday.name.zh) {
          errors.push(`${year} 年节假日缺少英文或中文名称: ${holiday.date}`);
        }
        
        // 检查中文翻译质量
        if (holiday.name.zh === holiday.name.en) {
          warnings.push(`${year} 年节假日未翻译: ${holiday.name.en}`);
        }
      }
    }
    
    // 统计信息
    const totalHolidays = Object.values(data.years).flat().length;
    
    return {
      country,
      valid: errors.length === 0,
      errors,
      warnings,
      stats: {
        totalHolidays,
        yearsCovered: years.length,
        verified: data.metadata.verified
      }
    };
    
  } catch (error) {
    errors.push(`无法读取文件: ${error}`);
    return {
      country,
      valid: false,
      errors,
      warnings,
      stats: {
        totalHolidays: 0,
        yearsCovered: 0,
        verified: false
      }
    };
  }
}

/**
 * 主函数
 */
async function main() {
  console.log(`${colors.cyan}🔍 节假日数据验证器${colors.reset}`);
  console.log('='.repeat(50));
  
  // 获取所有 .md 文件
  const holidaysDir = join(process.cwd(), 'data', 'holidays');
  let files: string[];
  
  try {
    files = await readdir(holidaysDir);
  } catch (error) {
    console.error(`${colors.red}❌ 无法读取 data/holidays 目录${colors.reset}`);
    console.error(`请先运行: npm run holidays:init`);
    process.exit(1);
  }
  
  const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md');
  
  if (mdFiles.length === 0) {
    console.error(`${colors.red}❌ 没有找到配置文件${colors.reset}`);
    console.error(`请先运行: npm run holidays:init`);
    process.exit(1);
  }
  
  console.log(`📁 找到 ${mdFiles.length} 个配置文件\n`);
  
  // 验证每个文件
  const results = [];
  
  for (const file of mdFiles) {
    const country = file.replace('.md', '') as CountryCode;
    console.log(`${colors.blue}📄 验证 ${country}.md...${colors.reset}`);
    
    const result = await validateCountry(country);
    results.push(result);
    
    if (result.valid) {
      console.log(`${colors.green}  ✅ 通过${colors.reset}`);
    } else {
      console.log(`${colors.red}  ❌ 失败${colors.reset}`);
    }
    
    console.log(`  📊 统计: ${result.stats.totalHolidays} 个节假日, ${result.stats.yearsCovered} 年`);
    console.log(`  🔍 验证状态: ${result.stats.verified ? '✅ 已验证' : '⏳ 待验证'}`);
    
    if (result.errors.length > 0) {
      console.log(`${colors.red}  ❌ 错误:${colors.reset}`);
      result.errors.forEach(err => console.log(`     - ${err}`));
    }
    
    if (result.warnings.length > 0) {
      console.log(`${colors.yellow}  ⚠️  警告:${colors.reset}`);
      result.warnings.forEach(warn => console.log(`     - ${warn}`));
    }
    
    console.log('');
  }
  
  // 总结
  console.log('='.repeat(50));
  console.log(`${colors.cyan}📊 验证总结${colors.reset}\n`);
  
  const totalFiles = results.length;
  const validFiles = results.filter(r => r.valid).length;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const totalHolidays = results.reduce((sum, r) => sum + r.stats.totalHolidays, 0);
  const verifiedFiles = results.filter(r => r.stats.verified).length;
  
  console.log(`总文件数: ${totalFiles}`);
  console.log(`${colors.green}✅ 通过: ${validFiles}${colors.reset}`);
  console.log(`${colors.red}❌ 失败: ${totalFiles - validFiles}${colors.reset}`);
  console.log(`${colors.red}❌ 总错误: ${totalErrors}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  总警告: ${totalWarnings}${colors.reset}`);
  console.log(`📅 总节假日: ${totalHolidays}`);
  console.log(`🔍 已验证文件: ${verifiedFiles}/${totalFiles}`);
  
  // Tier 1 国家验证状态
  console.log(`\n${colors.cyan}🏆 Tier 1 国家验证状态:${colors.reset}`);
  const tier1Countries: CountryCode[] = ['CN', 'US', 'GB', 'JP', 'DE'];
  
  for (const country of tier1Countries) {
    const result = results.find(r => r.country === country);
    if (result) {
      const status = result.stats.verified ? '✅' : '⏳';
      const valid = result.valid ? '通过' : '失败';
      console.log(`  ${status} ${country}: ${valid} (${result.stats.totalHolidays} 个节假日)`);
    } else {
      console.log(`  ❌ ${country}: 文件不存在`);
    }
  }
  
  console.log('');
  
  // 退出码
  if (totalErrors > 0) {
    console.log(`${colors.red}❌ 验证失败，请修复上述错误${colors.reset}`);
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log(`${colors.yellow}⚠️  验证通过，但有警告${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ 所有验证通过！${colors.reset}`);
  }
}

// 运行
main().catch(console.error);

