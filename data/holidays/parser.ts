/**
 * Markdown 节假日配置解析器
 * 
 * @description
 * 解析和生成 Markdown 格式的节假日配置文件
 */

import type { 
  CountryHolidaysData, 
  HolidayEntry, 
  ParsedMarkdown,
  CountryMetadata 
} from './types';
import type { CountryCode } from '@/types/user-context';

/**
 * 解析 Markdown 配置文件
 * 
 * @param markdown - Markdown 文件内容
 * @param country - 国家代码
 * @returns 解析后的节假日数据
 */
export function parseHolidayMarkdown(
  markdown: string,
  country: CountryCode
): ParsedMarkdown {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const lines = markdown.split('\n');
    let currentYear: string | null = null;
    let currentHoliday: Partial<HolidayEntry> | null = null;
    const years: { [year: string]: HolidayEntry[] } = {};
    
    // 提取元数据
    const metadata = extractMetadata(markdown);
    
    // 提取国家名称
    const countryName = extractCountryName(markdown);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 跳过空行和注释
      if (!line || line.startsWith('>') || line.startsWith('<!--')) {
        continue;
      }
      
      // 解析年份标题 (## 2025年 或 ## 2025)
      const yearMatch = line.match(/^##\s+(\d{4})年?/);
      if (yearMatch) {
        currentYear = yearMatch[1];
        if (!years[currentYear]) {
          years[currentYear] = [];
        }
        continue;
      }
      
      // 解析节假日标题 (### 元旦 | New Year's Day)
      const holidayMatch = line.match(/^###\s+(.+?)\s+\|\s+(.+)/);
      if (holidayMatch && currentYear) {
        // 保存上一个节假日
        if (currentHoliday && isValidHoliday(currentHoliday)) {
          years[currentYear].push(currentHoliday as HolidayEntry);
        }
        
        // 开始新节假日
        currentHoliday = {
          date: '',
          name: {
            zh: holidayMatch[1].trim(),
            en: holidayMatch[2].trim()
          },
          type: 'public',
          isNational: true
        };
        continue;
      }
      
      // 解析节假日属性
      if (currentHoliday && currentYear) {
        // 日期
        const dateMatch = line.match(/^-\s+\*\*日期\*\*:\s+(.+)/);
        if (dateMatch) {
          currentHoliday.date = dateMatch[1].trim();
          continue;
        }
        
        // 类型
        const typeMatch = line.match(/^-\s+\*\*类型\*\*:\s+(.+)/);
        if (typeMatch) {
          const typeStr = typeMatch[1].toLowerCase();
          if (typeStr.includes('public') || typeStr.includes('公共')) {
            currentHoliday.type = 'public';
          } else if (typeStr.includes('bank') || typeStr.includes('银行')) {
            currentHoliday.type = 'bank';
          } else if (typeStr.includes('regional') || typeStr.includes('地区')) {
            currentHoliday.type = 'regional';
          } else if (typeStr.includes('religious') || typeStr.includes('宗教')) {
            currentHoliday.type = 'religious';
          }
          continue;
        }
        
        // 全国性
        const nationalMatch = line.match(/^-\s+\*\*全国性\*\*:\s+(.+)/);
        if (nationalMatch) {
          const value = nationalMatch[1].trim().toLowerCase();
          currentHoliday.isNational = value === '是' || value === 'yes' || value === 'true';
          continue;
        }
        
        // 说明
        const descMatch = line.match(/^-\s+\*\*说明\*\*:\s+(.+)/);
        if (descMatch) {
          currentHoliday.description = descMatch[1].trim();
          continue;
        }
      }
    }
    
    // 保存最后一个节假日
    if (currentYear && currentHoliday && isValidHoliday(currentHoliday)) {
      years[currentYear].push(currentHoliday as HolidayEntry);
    }
    
    // 展开日期范围
    for (const year in years) {
      years[year] = expandDateRanges(years[year]);
    }
    
    const data: CountryHolidaysData = {
      country,
      countryName,
      metadata,
      years
    };
    
    return {
      data,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
    
  } catch (error) {
    errors.push(`解析错误: ${error}`);
    return {
      data: {
        country,
        countryName: { en: '', zh: '' },
        metadata: {
          source: 'unknown',
          lastUpdate: new Date().toISOString(),
          verified: false
        },
        years: {}
      },
      errors
    };
  }
}

/**
 * 提取元数据
 */
function extractMetadata(markdown: string): CountryMetadata {
  const metadata: CountryMetadata = {
    source: 'unknown',
    lastUpdate: new Date().toISOString(),
    verified: false
  };
  
  // 提取数据来源
  const sourceMatch = markdown.match(/>\s+\*\*数据来源\*\*:\s+(.+)/);
  if (sourceMatch) {
    metadata.source = sourceMatch[1].trim();
  }
  
  // 提取最后更新时间
  const updateMatch = markdown.match(/>\s+\*\*最后更新\*\*:\s+(\d{4}-\d{2}-\d{2})/);
  if (updateMatch) {
    metadata.lastUpdate = updateMatch[1];
  }
  
  // 提取验证状态
  const verifiedMatch = markdown.match(/>\s+\*\*维护状态\*\*:\s+(.+)/);
  if (verifiedMatch) {
    const status = verifiedMatch[1].toLowerCase();
    metadata.verified = status.includes('✅') || status.includes('已验证');
  }
  
  // 提取验证者
  const verifierMatch = markdown.match(/>\s+\*\*验证者\*\*:\s+(.+)/);
  if (verifierMatch) {
    metadata.verifiedBy = verifierMatch[1].trim();
  }
  
  return metadata;
}

/**
 * 提取国家名称
 */
function extractCountryName(markdown: string): { en: string; zh: string } {
  const titleMatch = markdown.match(/^#\s+🇨🇳?\s*(.+?)\s+\((.+?)\)/m);
  if (titleMatch) {
    return {
      zh: titleMatch[1].trim(),
      en: titleMatch[2].trim()
    };
  }
  return { en: 'Unknown', zh: '未知' };
}

/**
 * 验证节假日数据完整性
 */
function isValidHoliday(holiday: Partial<HolidayEntry>): boolean {
  return !!(
    holiday.date &&
    holiday.name &&
    holiday.name.en &&
    holiday.name.zh &&
    holiday.type
  );
}

/**
 * 展开日期范围
 * 例如: "2025-01-29 ~ 2025-02-04" => 7个独立的日期
 * 
 * @param holidays - 节假日数组
 * @returns 展开后的节假日数组
 */
function expandDateRanges(holidays: HolidayEntry[]): HolidayEntry[] {
  const expanded: HolidayEntry[] = [];
  
  for (const holiday of holidays) {
    const dateStr = holiday.date;
    
    // 检查是否是日期范围 (包含 ~ 或 -)
    if (dateStr.includes('~') || dateStr.includes(' - ')) {
      const parts = dateStr.split(/\s*[~\-]\s*/);
      if (parts.length === 2) {
        const startDate = new Date(parts[0].trim());
        const endDate = new Date(parts[1].trim());
        
        // 生成范围内的所有日期
        const current = new Date(startDate);
        while (current <= endDate) {
          expanded.push({
            ...holiday,
            date: current.toISOString().split('T')[0]
          });
          current.setDate(current.getDate() + 1);
        }
        continue;
      }
    }
    
    // 检查是否是多个日期 (逗号分隔)
    if (dateStr.includes(',')) {
      const dates = dateStr.split(',').map(d => d.trim());
      for (const date of dates) {
        expanded.push({
          ...holiday,
          date
        });
      }
      continue;
    }
    
    // 单个日期
    expanded.push(holiday);
  }
  
  // 按日期排序
  return expanded.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 将数据转换回 Markdown
 * 用于自动生成和更新配置文件
 * 
 * @param data - 节假日数据
 * @returns Markdown 字符串
 */
export function generateHolidayMarkdown(data: CountryHolidaysData): string {
  const lines: string[] = [];
  
  // 标题
  const flag = getFlagEmoji(data.country);
  lines.push(`# ${flag} ${data.countryName.zh} (${data.countryName.en})`);
  lines.push('');
  
  // 元数据
  lines.push(`> **数据来源**: ${data.metadata.source}`);
  lines.push(`> **最后更新**: ${data.metadata.lastUpdate}`);
  lines.push(`> **维护状态**: ${data.metadata.verified ? '✅ 已人工验证' : '⏳ 待验证'}`);
  if (data.metadata.verifiedBy) {
    lines.push(`> **验证者**: ${data.metadata.verifiedBy}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  
  // 按年份排序
  const sortedYears = Object.keys(data.years).sort();
  
  for (const year of sortedYears) {
    lines.push(`## ${year}年`);
    lines.push('');
    
    const holidays = data.years[year];
    // 合并连续日期为范围
    const grouped = groupConsecutiveDates(holidays);
    
    for (const holiday of grouped) {
      lines.push(`### ${holiday.name.zh} | ${holiday.name.en}`);
      lines.push(`- **日期**: ${holiday.date}`);
      
      const typeMap: Record<string, string> = {
        'public': '公共假期 (Public Holiday)',
        'bank': '银行假期 (Bank Holiday)',
        'regional': '地区假期 (Regional Holiday)',
        'religious': '宗教节日 (Religious Holiday)',
        'observance': '纪念日 (Observance)'
      };
      lines.push(`- **类型**: ${typeMap[holiday.type] || holiday.type}`);
      lines.push(`- **全国性**: ${holiday.isNational ? '是' : '否'}`);
      
      if (holiday.description) {
        lines.push(`- **说明**: ${holiday.description}`);
      }
      
      lines.push('');
    }
    
    lines.push('---');
    lines.push('');
  }
  
  // 维护日志占位符
  lines.push('## 维护日志');
  lines.push('');
  lines.push(`- **${new Date().toISOString().split('T')[0]}**: 初始化数据`);
  lines.push('');
  
  return lines.join('\n');
}

/**
 * 将连续日期合并为范围
 */
function groupConsecutiveDates(holidays: HolidayEntry[]): HolidayEntry[] {
  if (holidays.length === 0) return [];
  
  const grouped: HolidayEntry[] = [];
  const sorted = [...holidays].sort((a, b) => a.date.localeCompare(b.date));
  
  let current = { ...sorted[0] };
  let rangeStart = current.date;
  let rangeEnd = current.date;
  
  for (let i = 1; i < sorted.length; i++) {
    const holiday = sorted[i];
    
    // 检查是否与当前节假日相同（除了日期）
    const isSameHoliday = 
      holiday.name.en === current.name.en &&
      holiday.type === current.type &&
      holiday.isNational === current.isNational;
    
    if (isSameHoliday) {
      // 检查日期是否连续
      const prevDate = new Date(rangeEnd);
      const currDate = new Date(holiday.date);
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        // 连续日期,扩展范围
        rangeEnd = holiday.date;
        continue;
      }
    }
    
    // 保存当前范围
    if (rangeStart === rangeEnd) {
      current.date = rangeStart;
    } else {
      current.date = `${rangeStart} ~ ${rangeEnd}`;
    }
    grouped.push(current);
    
    // 开始新范围
    current = { ...holiday };
    rangeStart = holiday.date;
    rangeEnd = holiday.date;
  }
  
  // 保存最后一个范围
  if (rangeStart === rangeEnd) {
    current.date = rangeStart;
  } else {
    current.date = `${rangeStart} ~ ${rangeEnd}`;
  }
  grouped.push(current);
  
  return grouped;
}

/**
 * 获取国家旗帜 emoji
 */
function getFlagEmoji(country: CountryCode): string {
  const flags: Record<CountryCode, string> = {
    'CN': '🇨🇳', 'US': '🇺🇸', 'GB': '🇬🇧', 'JP': '🇯🇵', 'DE': '🇩🇪',
    'FR': '🇫🇷', 'CA': '🇨🇦', 'AU': '🇦🇺', 'IN': '🇮🇳', 'BR': '🇧🇷',
    'MX': '🇲🇽', 'IT': '🇮🇹', 'ES': '🇪🇸', 'SG': '🇸🇬', 'AE': '🇦🇪',
    'KR': '🇰🇷'
  };
  return flags[country] || '🏳️';
}

