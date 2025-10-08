/**
 * 日期信息增强工具库
 * 提供丰富的日期计算和分析功能
 */

import { 
  differenceInDays, 
  getDay, 
  startOfMonth,
  getYear,
  startOfYear,
  getQuarter as dateFnsGetQuarter,
  format,
  addDays,
  isSameDay,
  isWeekend as dateFnsIsWeekend
} from 'date-fns';
import { Holiday } from './holidays';

/**
 * 增强的日期信息接口
 */
export interface EnhancedDateInfo {
  // 基础信息
  targetDate: Date;
  daysFromToday: number;
  
  // 时间结构
  weekOfMonth: number;      // 当月第几周
  dayOfYear: number;        // 当年第几天
  quarter: number;          // 季度 (1-4)
  
  // 工作日信息
  isWorkday: boolean;       // 是否工作日
  workdaysCount: number;    // 工作日数量
  weekendsCount: number;    // 周末数量
  holidaysCount: number;    // 节假日数量
  excludedDates: Date[];    // 排除的日期列表
  
  // 节气/节日（可选）
  solarTerm?: string;       // 中国节气
  nearestHoliday?: {
    name: string;
    date: Date;
    daysAway: number;
    isBefore: boolean;
  };
  holidayRelation?: string; // 与节假日的关系
  
  // 智能提示
  suggestion?: string;
  warning?: string;
}

/**
 * 计算日期在当月是第几周
 */
export function getWeekOfMonth(date: Date): number {
  const firstDayOfMonth = startOfMonth(date);
  const daysSinceFirst = differenceInDays(date, firstDayOfMonth);
  const firstDayWeekday = getDay(firstDayOfMonth);
  
  // 计算周数 (第一周从第一天开始，即使不是周日)
  return Math.ceil((daysSinceFirst + firstDayWeekday + 1) / 7);
}

/**
 * 计算日期是当年第几天
 */
export function getDayOfYear(date: Date): number {
  const firstDayOfYear = startOfYear(date);
  return differenceInDays(date, firstDayOfYear) + 1;
}

/**
 * 获取季度 (1-4)
 */
export function getQuarter(date: Date): number {
  return dateFnsGetQuarter(date);
}

/**
 * 判断是否为工作日
 * 考虑周末和节假日
 */
export function isWorkingDay(
  date: Date,
  country: string,
  holidays: Holiday[]
): boolean {
  // 检查是否是周末
  if (dateFnsIsWeekend(date)) {
    return false;
  }
  
  // 检查是否是节假日
  const isHoliday = holidays.some(holiday => 
    isSameDay(new Date(holiday.date), date)
  );
  
  return !isHoliday;
}

/**
 * 计算两个日期之间的工作日数量
 */
export function countWorkdays(
  startDate: Date,
  endDate: Date,
  holidays: Holiday[]
): { workdays: number; weekends: number; holidays: number; excluded: Date[] } {
  let workdays = 0;
  let weekends = 0;
  let holidaysCount = 0;
  const excluded: Date[] = [];
  
  const start = startDate < endDate ? startDate : endDate;
  const end = startDate < endDate ? endDate : startDate;
  const totalDays = differenceInDays(end, start);
  
  for (let i = 0; i <= totalDays; i++) {
    const currentDate = addDays(start, i);
    
    // 跳过起始日期
    if (i === 0) continue;
    
    const isHoliday = holidays.some(holiday => 
      isSameDay(new Date(holiday.date), currentDate)
    );
    
    if (isHoliday) {
      holidaysCount++;
      excluded.push(currentDate);
    } else if (dateFnsIsWeekend(currentDate)) {
      weekends++;
      excluded.push(currentDate);
    } else {
      workdays++;
    }
  }
  
  return { workdays, weekends, holidays: holidaysCount, excluded };
}

/**
 * 查找最近的节假日
 */
export function findNearestHoliday(
  date: Date,
  holidays: Holiday[]
): { name: string; date: Date; daysAway: number; isBefore: boolean } | null {
  if (holidays.length === 0) return null;
  
  let nearest: { name: string; date: Date; daysAway: number; isBefore: boolean } | null = null;
  let minDistance = Infinity;
  
  for (const holiday of holidays) {
    const holidayDate = new Date(holiday.date);
    const distance = Math.abs(differenceInDays(holidayDate, date));
    
    if (distance < minDistance && distance > 0) {
      minDistance = distance;
      nearest = {
        name: holiday.name,
        date: holidayDate,
        daysAway: distance,
        isBefore: holidayDate < date
      };
    }
  }
  
  return nearest;
}

/**
 * 获取与节假日的关系描述
 */
export function getHolidayRelation(
  date: Date,
  holidays: Holiday[],
  mode: 'calendar' | 'business',
  locale: string
): string | undefined {
  const nearest = findNearestHoliday(date, holidays);
  if (!nearest || nearest.daysAway > 30) return undefined;
  
  const { name, daysAway, isBefore } = nearest;
  
  if (locale === 'zh') {
    if (isBefore) {
      return `${name}后第 ${daysAway} 天`;
    } else {
      return `距离${name}还有 ${daysAway} 天`;
    }
  } else {
    if (isBefore) {
      return `${daysAway} day${daysAway > 1 ? 's' : ''} after ${name}`;
    } else {
      return `${daysAway} day${daysAway > 1 ? 's' : ''} until ${name}`;
    }
  }
}

/**
 * 生成智能建议
 */
export function generateSuggestion(
  date: Date,
  isWorkday: boolean,
  locale: string
): string | undefined {
  const dayOfWeek = getDay(date);
  
  if (locale === 'zh') {
    if (dayOfWeek === 5) { // 周五
      return '该日为周五，适合安排总结会议或项目收尾';
    } else if (dayOfWeek === 1) { // 周一
      return '该日为周一，适合安排新项目启动或周例会';
    } else if (!isWorkday) {
      return '该日为休息日，适合个人活动安排';
    }
  } else {
    if (dayOfWeek === 5) { // Friday
      return 'Friday - Good for wrap-up meetings or project closure';
    } else if (dayOfWeek === 1) { // Monday
      return 'Monday - Good for new project kickoffs or weekly meetings';
    } else if (!isWorkday) {
      return 'Non-working day - Perfect for personal activities';
    }
  }
  
  return undefined;
}

/**
 * 生成警告信息
 */
export function generateWarning(
  targetDate: Date,
  holidays: Holiday[],
  locale: string
): string | undefined {
  // 检查目标日期所在周是否包含节假日
  const startOfWeek = addDays(targetDate, -getDay(targetDate));
  const endOfWeek = addDays(startOfWeek, 6);
  
  const holidaysInWeek = holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= startOfWeek && holidayDate <= endOfWeek;
  });
  
  if (holidaysInWeek.length > 0) {
    const names = holidaysInWeek.map(h => h.name).join(', ');
    
    if (locale === 'zh') {
      return `注意：该周包含节假日 (${names})`;
    } else {
      return `Note: This week includes holiday(s): ${names}`;
    }
  }
  
  return undefined;
}

/**
 * 主函数：生成增强的日期信息
 */
export async function enhanceDateInfo(
  targetDate: Date,
  today: Date,
  locale: string,
  country: string,
  holidays: Holiday[],
  mode: 'calendar' | 'business'
): Promise<EnhancedDateInfo> {
  const daysFromToday = differenceInDays(targetDate, today);
  
  // 时间结构
  const weekOfMonth = getWeekOfMonth(targetDate);
  const dayOfYear = getDayOfYear(targetDate);
  const quarter = getQuarter(targetDate);
  
  // 工作日信息
  const isWorkday = isWorkingDay(targetDate, country, holidays);
  const { workdays, weekends, holidays: holidaysCount, excluded } = 
    countWorkdays(today, targetDate, holidays);
  
  // 节假日相关
  const nearestHoliday = findNearestHoliday(targetDate, holidays);
  const holidayRelation = getHolidayRelation(targetDate, holidays, mode, locale);
  
  // 智能提示
  const suggestion = generateSuggestion(targetDate, isWorkday, locale);
  const warning = generateWarning(targetDate, holidays, locale);
  
  return {
    targetDate,
    daysFromToday: Math.abs(daysFromToday),
    weekOfMonth,
    dayOfYear,
    quarter,
    isWorkday,
    workdaysCount: workdays,
    weekendsCount: weekends,
    holidaysCount,
    excludedDates: excluded,
    nearestHoliday: nearestHoliday || undefined,
    holidayRelation,
    suggestion,
    warning
  };
}

