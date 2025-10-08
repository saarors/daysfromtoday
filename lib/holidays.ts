import { format } from 'date-fns';
import type { CountryCode } from '@/types/user-context';
import { getLocalHolidays } from '@/data/holidays/index';
import type { HolidayEntry } from '@/data/holidays/types';

export interface Holiday {
  date: string;        // ISO 8601: "2025-01-01"
  localName: string;   // 本地语言名称
  name: string;        // 英文名称
  countryCode: string;
  global?: boolean;    // 是否全国性节假日
  types?: string[];    // ["Public", "Bank", "School", etc.]
}

/**
 * 节假日数据返回结果
 */
export interface HolidaysResult {
  data: Holiday[];
  source: 'local' | 'api' | 'fallback' | 'empty';
  lastUpdate: string;
}

/**
 * 转换本地配置格式到兼容格式
 */
function convertToHolidayFormat(entries: HolidayEntry[], country: CountryCode): Holiday[] {
  return entries.map(entry => ({
    date: entry.date,
    localName: entry.name.zh,
    name: entry.name.en,
    countryCode: country,
    global: entry.isNational,
    types: [entry.type]
  }));
}

/**
 * 从多层数据源获取节假日
 * 
 * 数据源优先级：
 * 1. 本地 Markdown 配置（主源）
 * 2. Nager.Date API（降级）
 * 3. 空数组（无数据）
 * 
 * @param country - 国家代码
 * @param year - 年份
 * @returns 节假日数据结果
 */
export async function getHolidays(
  country: CountryCode,
  year: number
): Promise<HolidaysResult> {
  // 1. 优先使用本地配置
  try {
    const localResult = await getLocalHolidays(country, year);
    
    if (localResult.success && localResult.data.length > 0) {
      return {
        data: convertToHolidayFormat(localResult.data, country),
        source: 'local',
        lastUpdate: localResult.lastUpdate
      };
    }
  } catch (error) {
    console.warn(`Local holidays failed for ${country} ${year}:`, error);
  }
  
  // 2. 降级到 API
  try {
    // 检查是否在浏览器环境
    const isBrowser = typeof window !== 'undefined';
    
    // 构建 API URL
    let url: string;
    if (isBrowser) {
      // 浏览器端使用相对路径
      url = `/api/holidays?country=${country}&year=${year}`;
    } else {
      // 服务端使用完整 URL
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      url = `${baseUrl}/api/holidays?country=${country}&year=${year}`;
    }
    
    // 构建 fetch 配置
    const fetchOptions: RequestInit = {};
    
    // 仅在服务端添加 Next.js 缓存配置
    if (!isBrowser) {
      fetchOptions.next = { revalidate: 86400 }; // 24h 缓存
      fetchOptions.cache = 'force-cache';
    }
    
    const response = await fetch(url, fetchOptions);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          data: data.data,
          source: 'api',
          lastUpdate: new Date().toISOString()
        };
      }
    }
  } catch (error) {
    console.error('API fallback failed:', error);
  }
  
  // 3. 无数据
  return {
    data: [],
    source: 'empty',
    lastUpdate: new Date().toISOString()
  };
}

/**
 * 检查日期是否是节假日
 * @param date - 日期
 * @param holidays - 节假日数组
 * @returns 如果是节假日返回节假日信息，否则返回 null
 */
export function isHoliday(
  date: Date,
  holidays: Holiday[]
): Holiday | null {
  const dateStr = format(date, 'yyyy-MM-dd');
  return holidays.find(h => h.date === dateStr) || null;
}

/**
 * 获取未来的节假日
 * @param holidays - 节假日数组
 * @param fromDate - 起始日期（默认今天）
 * @param limit - 限制数量
 * @returns 未来的节假日数组
 */
export function getUpcomingHolidays(
  holidays: Holiday[],
  fromDate: Date = new Date(),
  limit: number = 5
): Holiday[] {
  const fromDateStr = format(fromDate, 'yyyy-MM-dd');
  
  return holidays
    .filter(h => h.date >= fromDateStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

/**
 * 获取日期范围内的节假日
 * @param holidays - 节假日数组
 * @param startDate - 起始日期
 * @param endDate - 结束日期
 * @returns 范围内的节假日数组
 */
export function getHolidaysInRange(
  holidays: Holiday[],
  startDate: Date,
  endDate: Date
): Holiday[] {
  const startStr = format(startDate, 'yyyy-MM-dd');
  const endStr = format(endDate, 'yyyy-MM-dd');
  
  return holidays.filter(h => h.date >= startStr && h.date <= endStr);
}

