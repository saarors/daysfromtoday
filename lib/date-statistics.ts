/**
 * 日期统计工具
 * 
 * 功能：
 * - 计算两个日期之间的工作日数量
 * - 计算两个日期之间的周末数量
 * - 计算两个日期之间的节假日数量
 * - 用于纪念日倒计时的丰富展示
 */

import { eachDayOfInterval, isWeekend, isSameDay } from 'date-fns';
import { getHolidays } from './holidays';

export interface DateStatistics {
  totalDays: number;        // 总天数
  businessDays: number;     // 工作日数量
  weekends: number;         // 周末数量
  holidays: number;         // 节假日数量（不包括周末）
}

/**
 * 计算两个日期之间的统计信息
 */
export async function calculateDateStatistics(
  startDate: Date,
  endDate: Date,
  countryCode: string = 'US'
): Promise<DateStatistics> {
  // 确保 startDate < endDate
  const start = startDate < endDate ? startDate : endDate;
  const end = startDate < endDate ? endDate : startDate;
  
  // 获取所有日期
  const allDates = eachDayOfInterval({ start, end });
  const totalDays = allDates.length;
  
  // 计算周末数量
  const weekends = allDates.filter(date => isWeekend(date)).length;
  
  // 获取节假日（不包括周末的节假日）
  const year = startDate.getFullYear();
  const holidays = await getHolidays(countryCode, year);
  const holidayDates = holidays
    .filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return allDates.some(date => isSameDay(date, holidayDate)) && !isWeekend(holidayDate);
    })
    .length;
  
  // 计算工作日数量
  const businessDays = totalDays - weekends - holidayDates;
  
  return {
    totalDays,
    businessDays,
    weekends,
    holidays: holidayDates
  };
}

/**
 * 同步版本（不考虑节假日）
 */
export function calculateDateStatisticsSync(
  startDate: Date,
  endDate: Date
): Omit<DateStatistics, 'holidays'> {
  // 确保 startDate < endDate
  const start = startDate < endDate ? startDate : endDate;
  const end = startDate < endDate ? endDate : startDate;
  
  // 获取所有日期
  const allDates = eachDayOfInterval({ start, end });
  const totalDays = allDates.length;
  
  // 计算周末数量
  const weekends = allDates.filter(date => isWeekend(date)).length;
  
  // 计算工作日数量
  const businessDays = totalDays - weekends;
  
  return {
    totalDays,
    businessDays,
    weekends
  };
}

/**
 * 格式化统计信息为文本
 */
export function formatDateStatistics(
  stats: DateStatistics | Omit<DateStatistics, 'holidays'>,
  locale: string = 'en'
): {
  businessDays: string;
  weekends: string;
  holidays?: string;
} {
  const text = {
    en: {
      businessDays: (n: number) => `${n} business ${n === 1 ? 'day' : 'days'}`,
      weekends: (n: number) => `${n} ${n === 1 ? 'weekend' : 'weekends'}`,
      holidays: (n: number) => `${n} ${n === 1 ? 'holiday' : 'holidays'}`
    },
    zh: {
      businessDays: (n: number) => `${n} 个工作日`,
      weekends: (n: number) => `${n} 个周末`,
      holidays: (n: number) => `${n} 个节假日`
    }
  };
  
  const t = text[locale as keyof typeof text] || text.en;
  
  const result: {
    businessDays: string;
    weekends: string;
    holidays?: string;
  } = {
    businessDays: t.businessDays(stats.businessDays),
    weekends: t.weekends(stats.weekends)
  };
  
  if ('holidays' in stats && stats.holidays !== undefined) {
    result.holidays = t.holidays(stats.holidays);
  }
  
  return result;
}

