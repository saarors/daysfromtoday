import { addDays, format, isValid, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * 时区安全的日期加法
 * @param date - 起始日期
 * @param days - 要添加的天数
 * @param timezone - 时区（默认 UTC）
 * @returns 结果日期
 */
export function addDaysSafe(
  date: Date | string,
  days: number,
  timezone: string = 'UTC'
): Date {
  const baseDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(baseDate)) {
    throw new Error('Invalid date');
  }
  
  // 在目标时区进行计算（避免 DST 问题）
  const zonedDate = toZonedTime(baseDate, timezone);
  const result = addDays(zonedDate, days);
  
  return result;
}

/**
 * 时区安全的日期减法
 * @param date - 起始日期
 * @param days - 要减去的天数
 * @param timezone - 时区（默认 UTC）
 * @returns 结果日期
 */
export function subDaysSafe(
  date: Date | string,
  days: number,
  timezone: string = 'UTC'
): Date {
  return addDaysSafe(date, -days, timezone);
}

/**
 * 格式化日期（考虑时区）
 * @param date - 日期
 * @param formatStr - 格式字符串
 * @param timezone - 时区
 * @returns 格式化后的字符串
 */
export function formatInTimezone(
  date: Date,
  formatStr: string,
  timezone: string
): string {
  const zonedDate = toZonedTime(date, timezone);
  return format(zonedDate, formatStr);
}

/**
 * 验证日期字符串
 * @param dateStr - 日期字符串
 * @returns 是否有效
 */
export function isValidDateString(dateStr: string): boolean {
  const date = parseISO(dateStr);
  return isValid(date);
}

/**
 * 获取今天的开始时间（00:00:00）
 * @param timezone - 时区
 * @returns 今天的开始时间
 */
export function getStartOfToday(timezone: string = 'UTC'): Date {
  const now = new Date();
  const zonedNow = toZonedTime(now, timezone);
  zonedNow.setHours(0, 0, 0, 0);
  return zonedNow;
}

