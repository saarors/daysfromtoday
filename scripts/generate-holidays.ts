/**
 * 节假日数据生成脚本
 * 
 * @description
 * 从 Nager.Date API 抓取节假日数据并生成 Markdown 配置文件
 * 
 * 使用方法:
 * - npm run holidays:init        # 初始化所有国家数据
 * - npm run holidays:update CN   # 更新单个国家
 * - npm run holidays:validate    # 验证数据格式
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { CountryCode } from '../types/user-context';
import type { HolidayEntry, CountryHolidaysData } from '../data/holidays/types';
import { generateHolidayMarkdown } from '../data/holidays/parser';

// Nager.Date API 基础 URL
const NAGER_API_BASE = 'https://date.nager.at/api/v3';

// 国家配置
const COUNTRIES: Array<{ code: CountryCode; name: { en: string; zh: string } }> = [
  { code: 'CN', name: { en: 'China', zh: '中国' } },
  { code: 'US', name: { en: 'United States', zh: '美国' } },
  { code: 'GB', name: { en: 'United Kingdom', zh: '英国' } },
  { code: 'JP', name: { en: 'Japan', zh: '日本' } },
  { code: 'DE', name: { en: 'Germany', zh: '德国' } },
  { code: 'FR', name: { en: 'France', zh: '法国' } },
  { code: 'CA', name: { en: 'Canada', zh: '加拿大' } },
  { code: 'AU', name: { en: 'Australia', zh: '澳大利亚' } },
  { code: 'IN', name: { en: 'India', zh: '印度' } },
  { code: 'BR', name: { en: 'Brazil', zh: '巴西' } },
  { code: 'MX', name: { en: 'Mexico', zh: '墨西哥' } },
  { code: 'IT', name: { en: 'Italy', zh: '意大利' } },
  { code: 'ES', name: { en: 'Spain', zh: '西班牙' } },
  { code: 'SG', name: { en: 'Singapore', zh: '新加坡' } },
  { code: 'AE', name: { en: 'United Arab Emirates', zh: '阿联酋' } }
];

// 年份范围
const YEARS = [2025, 2026, 2027, 2028];

/**
 * 从 Nager.Date API 获取节假日数据
 */
async function fetchHolidaysFromAPI(
  country: CountryCode,
  year: number
): Promise<HolidayEntry[]> {
  const url = `${NAGER_API_BASE}/PublicHolidays/${year}/${country}`;
  
  try {
    console.log(`  📡 Fetching ${country} ${year}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 转换为我们的格式
    const holidays: HolidayEntry[] = data.map((item: any) => ({
      date: item.date,
      name: {
        en: item.name,
        zh: autoTranslate(item.name) // 自动翻译
      },
      type: item.types?.includes('Public') ? 'public' :
            item.types?.includes('Bank') ? 'bank' :
            item.types?.includes('Observance') ? 'observance' : 'public',
      isNational: item.global !== false,
      description: item.localName !== item.name ? `本地名称: ${item.localName}` : undefined
    }));
    
    console.log(`  ✅ Fetched ${holidays.length} holidays for ${country} ${year}`);
    return holidays;
    
  } catch (error) {
    console.error(`  ❌ Failed to fetch ${country} ${year}:`, error);
    return [];
  }
}

/**
 * 简单的自动翻译（基于词典）
 */
function autoTranslate(englishName: string): string {
  const dictionary: Record<string, string> = {
    // 通用节日
    "New Year's Day": '元旦',
    'New Year': '新年',
    'Christmas Day': '圣诞节',
    'Christmas': '圣诞节',
    'Good Friday': '耶稣受难日',
    'Easter': '复活节',
    'Easter Monday': '复活节星期一',
    'Labour Day': '劳动节',
    'Labor Day': '劳动节',
    "International Workers' Day": '国际劳动节',
    
    // 中国节日
    'Spring Festival': '春节',
    'Chinese New Year': '春节',
    'Tomb Sweeping Day': '清明节',
    'Qingming Festival': '清明节',
    'Dragon Boat Festival': '端午节',
    'Mid-Autumn Festival': '中秋节',
    'National Day': '国庆节',
    
    // 美国节日
    'Independence Day': '独立日',
    'Thanksgiving': '感恩节',
    'Memorial Day': '阵亡将士纪念日',
    'Veterans Day': '退伍军人节',
    "Martin Luther King Jr. Day": '马丁·路德·金纪念日',
    "Presidents' Day": '总统日',
    "Washington's Birthday": '华盛顿诞辰日',
    'Columbus Day': '哥伦布日',
    
    // 英国节日
    'Boxing Day': '节礼日',
    'Early May Bank Holiday': '五月初银行假日',
    'Spring Bank Holiday': '春季银行假日',
    'Summer Bank Holiday': '夏季银行假日',
    
    // 日本节日
    'Coming of Age Day': '成人节',
    "National Foundation Day": '建国纪念日',
    "Emperor's Birthday": '天皇诞辰',
    'Vernal Equinox': '春分日',
    'Showa Day': '昭和日',
    'Constitution Day': '宪法纪念日',
    'Greenery Day': '绿之日',
    "Children's Day": '儿童节',
    'Marine Day': '海之日',
    'Mountain Day': '山之日',
    'Respect for the Aged Day': '敬老日',
    'Autumnal Equinox': '秋分日',
    'Health and Sports Day': '体育日',
    'Culture Day': '文化日',
    
    // 其他常见节日
    'Epiphany': '主显节',
    'Ascension Day': '耶稣升天节',
    'Whit Monday': '圣灵降临节星期一',
    'Corpus Christi': '圣体节',
    'Assumption of Mary': '圣母升天节',
    'All Saints Day': '万圣节',
    'Immaculate Conception': '圣母无染原罪节',
    'Victory Day': '胜利日',
    "Mother's Day": '母亲节',
    "Father's Day": '父亲节',
    "Valentine's Day": '情人节'
  };
  
  // 精确匹配
  if (dictionary[englishName]) {
    return dictionary[englishName];
  }
  
  // 部分匹配
  for (const [en, zh] of Object.entries(dictionary)) {
    if (englishName.includes(en)) {
      return englishName.replace(en, zh);
    }
  }
  
  // 无法翻译，返回原文
  return englishName;
}

/**
 * 生成单个国家的 Markdown 文件
 */
async function generateCountryMarkdown(country: CountryCode): Promise<void> {
  console.log(`\n🌍 Processing ${country}...`);
  
  // 查找国家信息
  const countryInfo = COUNTRIES.find(c => c.code === country);
  if (!countryInfo) {
    console.error(`  ❌ Unknown country code: ${country}`);
    return;
  }
  
  // 收集所有年份的数据
  const years: { [year: string]: HolidayEntry[] } = {};
  
  for (const year of YEARS) {
    const holidays = await fetchHolidaysFromAPI(country, year);
    if (holidays.length > 0) {
      years[year.toString()] = holidays;
    }
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 构造数据结构
  const data: CountryHolidaysData = {
    country,
    countryName: countryInfo.name,
    metadata: {
      source: 'Nager.Date API (https://date.nager.at)',
      lastUpdate: new Date().toISOString().split('T')[0],
      verified: false,
      notes: '⚠️ 数据来自第三方 API，待人工验证'
    },
    years
  };
  
  // 生成 Markdown
  const markdown = generateHolidayMarkdown(data);
  
  // 保存文件
  const outputDir = join(process.cwd(), 'data', 'holidays');
  await mkdir(outputDir, { recursive: true });
  
  const outputFile = join(outputDir, `${country}.md`);
  await writeFile(outputFile, markdown, 'utf-8');
  
  console.log(`  ✅ Generated ${country}.md`);
  console.log(`  📊 Total holidays: ${Object.values(years).flat().length}`);
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 节假日数据生成器');
  console.log('='.repeat(50));
  console.log(`📅 年份范围: ${YEARS.join(', ')}`);
  console.log(`🌍 国家数量: ${COUNTRIES.length}`);
  console.log('='.repeat(50));
  
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'init') {
    // 初始化所有国家
    console.log('\n📦 初始化所有国家数据...\n');
    
    for (const country of COUNTRIES) {
      await generateCountryMarkdown(country.code);
    }
    
    console.log('\n✅ 所有国家数据已生成！');
    console.log('\n📝 下一步:');
    console.log('  1. 查看 data/holidays/ 目录中的 Markdown 文件');
    console.log('  2. 人工验证 Tier 1 国家数据 (CN, US, GB, JP, DE)');
    console.log('  3. 修改元数据中的 "维护状态" 为 "✅ 已人工验证"');
    
  } else if (args[0] === 'update') {
    // 更新单个国家
    const country = args[1]?.toUpperCase() as CountryCode;
    
    if (!country) {
      console.error('❌ 请指定国家代码，例如: npm run holidays:update CN');
      process.exit(1);
    }
    
    await generateCountryMarkdown(country);
    console.log('\n✅ 数据更新完成！');
    
  } else {
    console.error('❌ 未知命令');
    console.log('\n用法:');
    console.log('  npm run holidays:init          # 初始化所有国家');
    console.log('  npm run holidays:update CN     # 更新单个国家');
    process.exit(1);
  }
}

// 运行
main().catch(console.error);

