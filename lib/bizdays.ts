import { addDays, subDays, format, isValid } from 'date-fns';
import { isWeekend } from './weekend-rules';
import { isHoliday, getHolidays, type Holiday } from './holidays';

export interface ExcludedDate {
  date: Date;
  dateStr: string;      // ISO 8601
  reason: 'weekend' | 'holiday';
  name?: string;        // 节假日名称（仅 holiday）
  dayName: string;      // "Saturday", "Sunday", etc.
}

export interface BusinessDaysResult {
  targetDate: Date;
  excludedDates: ExcludedDate[];
  totalCalendarDays: number;
  totalBusinessDays: number;
}

/**
 * 计算工作日（向未来）
 * @param startDate - 起始日期
 * @param businessDays - 工作日天数
 * @param countryCode - 国家代码
 * @param timezone - 时区（默认 UTC）
 * @returns 工作日计算结果
 */
export async function addBusinessDays(
  startDate: Date,
  businessDays: number,
  countryCode: string,
  timezone: string = 'UTC'
): Promise<BusinessDaysResult> {
  if (!isValid(startDate)) {
    throw new Error('Invalid start date');
  }
  
  if (businessDays < 0) {
    throw new Error('Business days must be positive. Use subBusinessDays for negative values.');
  }
  
  const excluded: ExcludedDate[] = [];
  let currentDate = new Date(startDate);
  let remainingDays = businessDays;
  let totalDays = 0;
  
  // 获取节假日数据（当前年和下一年）
  const currentYear = currentDate.getFullYear();
  const nextYear = currentYear + 1;
  const holidays = [
    ...(await getHolidays(countryCode, currentYear)),
    ...(await getHolidays(countryCode, nextYear))
  ];
  
  while (remainingDays > 0) {
    currentDate = addDays(currentDate, 1);
    totalDays++;
    
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayName = format(currentDate, 'EEEE');
    
    // 检查是否是周末
    if (isWeekend(currentDate, countryCode)) {
      excluded.push({
        date: new Date(currentDate),
        dateStr,
        reason: 'weekend',
        dayName
      });
      continue;
    }
    
    // 检查是否是节假日
    const holiday = isHoliday(currentDate, holidays);
    if (holiday) {
      excluded.push({
        date: new Date(currentDate),
        dateStr,
        reason: 'holiday',
        name: holiday.localName || holiday.name,
        dayName
      });
      continue;
    }
    
    // 是工作日，计数减一
    remainingDays--;
  }
  
  return {
    targetDate: currentDate,
    excludedDates: excluded,
    totalCalendarDays: totalDays,
    totalBusinessDays: businessDays
  };
}

/**
 * 计算工作日（向过去）
 * @param startDate - 起始日期
 * @param businessDays - 工作日天数
 * @param countryCode - 国家代码
 * @param timezone - 时区（默认 UTC）
 * @returns 工作日计算结果
 */
export async function subBusinessDays(
  startDate: Date,
  businessDays: number,
  countryCode: string,
  timezone: string = 'UTC'
): Promise<BusinessDaysResult> {
  if (!isValid(startDate)) {
    throw new Error('Invalid start date');
  }
  
  if (businessDays < 0) {
    throw new Error('Business days must be positive. Use addBusinessDays for negative values.');
  }
  
  const excluded: ExcludedDate[] = [];
  let currentDate = new Date(startDate);
  let remainingDays = businessDays;
  let totalDays = 0;
  
  // 获取节假日数据（当前年和上一年）
  const currentYear = currentDate.getFullYear();
  const prevYear = currentYear - 1;
  const holidays = [
    ...(await getHolidays(countryCode, currentYear)),
    ...(await getHolidays(countryCode, prevYear))
  ];
  
  while (remainingDays > 0) {
    currentDate = subDays(currentDate, 1);
    totalDays++;
    
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayName = format(currentDate, 'EEEE');
    
    // 检查是否是周末
    if (isWeekend(currentDate, countryCode)) {
      excluded.push({
        date: new Date(currentDate),
        dateStr,
        reason: 'weekend',
        dayName
      });
      continue;
    }
    
    // 检查是否是节假日
    const holiday = isHoliday(currentDate, holidays);
    if (holiday) {
      excluded.push({
        date: new Date(currentDate),
        dateStr,
        reason: 'holiday',
        name: holiday.localName || holiday.name,
        dayName
      });
      continue;
    }
    
    // 是工作日，计数减一
    remainingDays--;
  }
  
  return {
    targetDate: currentDate,
    excludedDates: excluded,
    totalCalendarDays: totalDays,
    totalBusinessDays: businessDays
  };
}

