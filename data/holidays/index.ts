/**
 * 节假日数据查询接口
 * 
 * @description
 * 提供统一的节假日数据查询接口
 * 优先使用本地 Markdown 配置，降级到 API
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import type { CountryCode } from '@/types/user-context';
import type { HolidayEntry, HolidayQueryResult, CountryHolidaysData } from './types';
import { parseHolidayMarkdown } from './parser';

// 缓存解析结果，避免重复读取和解析
const PARSED_CACHE = new Map<CountryCode, CountryHolidaysData>();

/**
 * 获取本地节假日数据（主查询接口）
 * 
 * @param country - 国家代码
 * @param year - 年份
 * @returns 节假日查询结果
 */
export async function getLocalHolidays(
  country: CountryCode,
  year: number
): Promise<HolidayQueryResult> {
  try {
    // 1. 检查缓存
    let countryData = PARSED_CACHE.get(country);
    
    // 2. 如果缓存中没有，读取和解析 Markdown 文件
    if (!countryData) {
      const filePath = join(process.cwd(), 'data', 'holidays', `${country}.md`);
      
      try {
        const markdown = await readFile(filePath, 'utf-8');
        const parsed = parseHolidayMarkdown(markdown, country);
        
        if (parsed.errors && parsed.errors.length > 0) {
          console.error(`解析 ${country}.md 时出错:`, parsed.errors);
        }
        
        countryData = parsed.data;
        PARSED_CACHE.set(country, countryData);
      } catch (fileError) {
        // 文件不存在或无法读取
        console.warn(`无法读取 ${country}.md:`, fileError);
        return {
          success: false,
          data: [],
          source: 'empty',
          lastUpdate: new Date().toISOString(),
          error: `本地配置文件不存在: ${country}.md`
        };
      }
    }
    
    // 3. 获取指定年份的数据
    const yearData = countryData.years[year.toString()];
    
    if (!yearData || yearData.length === 0) {
      return {
        success: false,
        data: [],
        source: 'empty',
        lastUpdate: countryData.metadata.lastUpdate,
        error: `没有 ${year} 年的数据`
      };
    }
    
    // 4. 返回成功结果
    return {
      success: true,
      data: yearData,
      source: 'local',
      lastUpdate: countryData.metadata.lastUpdate
    };
    
  } catch (error) {
    console.error(`查询本地节假日失败 (${country}, ${year}):`, error);
    return {
      success: false,
      data: [],
      source: 'empty',
      lastUpdate: new Date().toISOString(),
      error: String(error)
    };
  }
}

/**
 * 批量查询多个国家的节假日
 * 
 * @param countries - 国家代码数组
 * @param year - 年份
 * @returns 国家代码到节假日数据的映射
 */
export async function getMultipleCountryHolidays(
  countries: CountryCode[],
  year: number
): Promise<Map<CountryCode, HolidayEntry[]>> {
  const results = new Map<CountryCode, HolidayEntry[]>();
  
  await Promise.all(
    countries.map(async (country) => {
      const result = await getLocalHolidays(country, year);
      if (result.success) {
        results.set(country, result.data);
      }
    })
  );
  
  return results;
}

/**
 * 查询单个节假日
 * 
 * @param country - 国家代码
 * @param date - 日期 (YYYY-MM-DD)
 * @returns 节假日信息，如果不是节假日则返回 null
 */
export async function findHoliday(
  country: CountryCode,
  date: string
): Promise<HolidayEntry | null> {
  const year = new Date(date).getFullYear();
  const result = await getLocalHolidays(country, year);
  
  if (!result.success) {
    return null;
  }
  
  return result.data.find(h => h.date === date) || null;
}

/**
 * 检查指定日期是否为节假日
 * 
 * @param country - 国家代码
 * @param date - 日期
 * @returns 是否为节假日
 */
export async function isHoliday(
  country: CountryCode,
  date: Date
): Promise<boolean> {
  const dateStr = date.toISOString().split('T')[0];
  const holiday = await findHoliday(country, dateStr);
  return holiday !== null;
}

/**
 * 获取指定日期范围内的所有节假日
 * 
 * @param country - 国家代码
 * @param startDate - 起始日期
 * @param endDate - 结束日期
 * @returns 节假日数组
 */
export async function getHolidaysInRange(
  country: CountryCode,
  startDate: Date,
  endDate: Date
): Promise<HolidayEntry[]> {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];
  
  const allHolidays: HolidayEntry[] = [];
  
  // 查询涉及的所有年份
  for (let year = startYear; year <= endYear; year++) {
    const result = await getLocalHolidays(country, year);
    if (result.success) {
      allHolidays.push(...result.data);
    }
  }
  
  // 筛选日期范围
  return allHolidays.filter(
    h => h.date >= startStr && h.date <= endStr
  );
}

/**
 * 获取即将到来的节假日
 * 
 * @param country - 国家代码
 * @param fromDate - 起始日期（默认今天）
 * @param limit - 限制数量
 * @returns 节假日数组
 */
export async function getUpcomingHolidays(
  country: CountryCode,
  fromDate: Date = new Date(),
  limit: number = 5
): Promise<HolidayEntry[]> {
  const year = fromDate.getFullYear();
  const nextYear = year + 1;
  const fromStr = fromDate.toISOString().split('T')[0];
  
  const allHolidays: HolidayEntry[] = [];
  
  // 查询当前年份和下一年
  for (const y of [year, nextYear]) {
    const result = await getLocalHolidays(country, y);
    if (result.success) {
      allHolidays.push(...result.data);
    }
  }
  
  // 筛选未来的节假日
  return allHolidays
    .filter(h => h.date >= fromStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

/**
 * 清除缓存（用于热更新配置文件后刷新）
 */
export function clearCache(country?: CountryCode): void {
  if (country) {
    PARSED_CACHE.delete(country);
  } else {
    PARSED_CACHE.clear();
  }
}

/**
 * 获取所有已配置的国家列表
 */
export function getSupportedCountries(): CountryCode[] {
  return [
    'CN', 'US', 'GB', 'JP', 'DE',
    'FR', 'CA', 'AU', 'IN', 'BR',
    'MX', 'IT', 'ES', 'SG', 'AE'
  ];
}

