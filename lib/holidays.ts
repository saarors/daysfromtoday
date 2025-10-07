import { format } from 'date-fns';

export interface Holiday {
  date: string;        // ISO 8601: "2025-01-01"
  localName: string;   // 本地语言名称
  name: string;        // 英文名称
  countryCode: string;
  global: boolean;     // 是否全国性节假日
  types: string[];     // ["Public", "Bank", "School", etc.]
}

/**
 * 从 API 获取节假日（带缓存）
 * @param country - 国家代码
 * @param year - 年份
 * @returns 节假日数组
 */
export async function getHolidays(
  country: string,
  year: number
): Promise<Holiday[]> {
  try {
    // 在 Server Component 中需要使用完整 URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
    const url = `${baseUrl}/api/holidays?country=${country}&year=${year}`;
    
    const response = await fetch(url, { 
      next: { revalidate: 86400 }, // 24h 缓存
      cache: 'force-cache'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch holidays: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('Holidays API error:', data.meta?.error);
      return [];
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
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

