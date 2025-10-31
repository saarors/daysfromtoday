/**
 * 工作日计算模块（Phase 2.6）
 * 
 * 功能：
 * - 计算两个日期之间的工作日天数（排除周末和节假日）
 * - 计算从某日期开始 N 个工作日后的日期
 * - 集成 Nager.Date API 获取节假日数据
 */

import { addDays, differenceInDays, format, parseISO, isWeekend as isFnsWeekend } from 'date-fns';

/**
 * 节假日数据接口
 */
interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

/**
 * 节假日缓存（24小时）
 */
const holidayCache: Record<string, { data: Holiday[]; expiry: number }> = {};

/**
 * 获取节假日数据（带缓存）
 */
export async function fetchHolidays(countryCode: string, year: number): Promise<Holiday[]> {
  const cacheKey = `${countryCode}-${year}`;
  const now = Date.now();
  
  // 检查缓存
  if (holidayCache[cacheKey] && holidayCache[cacheKey].expiry > now) {
    return holidayCache[cacheKey].data;
  }
  
  try {
    // 调用内部 API 路由
    const response = await fetch(`/api/holidays?countryCode=${countryCode}&year=${year}`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch holidays for ${countryCode} ${year}`);
      return [];
    }
    
    const json = await response.json();
    const data = json.data || [];
    
    // 缓存 24 小时
    holidayCache[cacheKey] = {
      data,
      expiry: now + 24 * 60 * 60 * 1000
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}

/**
 * 判断是否为周末
 */
export function isWeekend(date: Date): boolean {
  return isFnsWeekend(date);
}

/**
 * 判断是否为节假日
 */
export function isHoliday(date: Date, holidays: Holiday[]): boolean {
  const dateStr = format(date, 'yyyy-MM-dd');
  return holidays.some(h => h.date === dateStr);
}

/**
 * 判断是否为工作日
 */
export function isWorkingDay(date: Date, holidays: Holiday[]): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays);
}

/**
 * 计算两个日期之间的工作日天数
 * 
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param countryCode 国家代码（用于获取节假日）
 * @returns 工作日天数
 */
export async function calculateWorkingDays(
  startDate: Date,
  endDate: Date,
  countryCode: string = 'US'
): Promise<number> {
  const start = startDate < endDate ? startDate : endDate;
  const end = startDate < endDate ? endDate : startDate;
  
  // 获取涉及的年份
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  
  // 获取所有年份的节假日数据
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  
  const holidaysArrays = await Promise.all(
    years.map(year => fetchHolidays(countryCode, year))
  );
  const holidays = holidaysArrays.flat();
  
  // 计算工作日天数
  let workingDays = 0;
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    if (isWorkingDay(currentDate, holidays)) {
      workingDays++;
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return workingDays;
}

/**
 * 计算从某日期开始 N 个工作日后的日期
 * 
 * @param startDate 开始日期
 * @param workingDays 工作日天数
 * @param countryCode 国家代码
 * @returns 目标日期
 */
export async function addWorkingDays(
  startDate: Date,
  workingDays: number,
  countryCode: string = 'US'
): Promise<Date> {
  const direction = workingDays >= 0 ? 1 : -1;
  const absWorkingDays = Math.abs(workingDays);
  
  // 获取涉及的年份（预估范围）
  const startYear = startDate.getFullYear();
  const estimatedEndDate = addDays(startDate, workingDays * 1.5); // 预估（考虑周末和节假日）
  const endYear = estimatedEndDate.getFullYear();
  
  const years = [];
  for (let year = Math.min(startYear, endYear); year <= Math.max(startYear, endYear); year++) {
    years.push(year);
  }
  
  const holidaysArrays = await Promise.all(
    years.map(year => fetchHolidays(countryCode, year))
  );
  const holidays = holidaysArrays.flat();
  
  // 计算目标日期
  let currentDate = new Date(startDate);
  let remainingDays = absWorkingDays;
  
  while (remainingDays > 0) {
    currentDate = addDays(currentDate, direction);
    
    if (isWorkingDay(currentDate, holidays)) {
      remainingDays--;
    }
    
    // 如果超出预估范围，需要加载更多节假日数据
    const currentYear = currentDate.getFullYear();
    if (!years.includes(currentYear)) {
      const newHolidays = await fetchHolidays(countryCode, currentYear);
      holidays.push(...newHolidays);
      years.push(currentYear);
    }
  }
  
  return currentDate;
}

