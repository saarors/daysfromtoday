/**
 * 日期计算核心库
 * 
 * 功能：
 * 1. 计算未来/过去的日期（自然日、工作日）
 * 2. 格式化日期（多语言支持）
 * 3. DST（夏令时）安全处理
 * 4. 时区感知
 * 
 * 依赖：
 * - date-fns: 现代化日期工具库
 * - date-fns-tz: 时区支持
 * 
 * 符合项目规范：
 * - TypeScript 严格模式
 * - 零副作用（纯函数）
 * - 完整类型定义
 */

import { add, format, formatDistanceToNow, isPast, isFuture, differenceInDays } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { zhCN, enUS } from 'date-fns/locale';

/**
 * 支持的语言类型
 */
export type SupportedLocale = 'en' | 'zh';

/**
 * 日期计算结果
 */
export interface DateCalculationResult {
  // 目标日期（ISO 8601 格式）
  targetDate: string;
  
  // 目标日期（本地化格式，如：2025-10-20）
  formattedDate: string;
  
  // 星期几（本地化，如：Monday / 星期一）
  dayOfWeek: string;
  
  // 距离今天的描述（本地化，如：14 days from now / 14天后）
  relativeTime: string;
  
  // 是否是过去的日期
  isPast: boolean;
  
  // 是否是未来的日期
  isFuture: boolean;
  
  // 距离今天的天数（正数=未来，负数=过去）
  daysFromToday: number;
  
  // 用于显示的完整标题（SEO 优化）
  title: string;
  
  // 用于显示的描述（SEO 优化）
  description: string;
}

/**
 * 获取 date-fns 语言对象
 */
function getDateFnsLocale(locale: SupportedLocale) {
  return locale === 'zh' ? zhCN : enUS;
}

/**
 * 计算 N 天后的日期
 * 
 * @param days - 天数（正数=未来，负数=过去）
 * @param locale - 语言代码
 * @param fromDate - 起始日期（默认为今天）
 * @param timezone - 时区（默认为用户本地时区）
 * @returns 日期计算结果
 */
export function calculateDaysFromToday(
  days: number,
  locale: SupportedLocale = 'en',
  fromDate: Date = new Date(),
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
): DateCalculationResult {
  const dateFnsLocale = getDateFnsLocale(locale);
  
  // 计算目标日期
  const targetDate = add(fromDate, { days });
  
  // 转换到指定时区
  const zonedDate = toZonedTime(targetDate, timezone);
  
  // 格式化日期（YYYY-MM-DD）
  const formattedDate = formatInTimeZone(targetDate, timezone, 'yyyy-MM-dd');
  
  // 星期几（本地化）
  const dayOfWeek = format(zonedDate, 'EEEE', { locale: dateFnsLocale });
  
  // 相对时间描述（本地化）
  const relativeTime = formatDistanceToNow(targetDate, { 
    addSuffix: true, 
    locale: dateFnsLocale 
  });
  
  // 判断时间方向
  const isPastDate = isPast(targetDate);
  const isFutureDate = isFuture(targetDate);
  
  // 精确天数差异
  const daysFromToday = differenceInDays(targetDate, fromDate);
  
  // 生成 SEO 友好的标题
  const title = locale === 'zh'
    ? `${Math.abs(days)} 天${days >= 0 ? '后' : '前'}是哪天？${formattedDate}`
    : `What date is ${Math.abs(days)} days ${days >= 0 ? 'from' : 'before'} today? ${formattedDate}`;
  
  // 生成 SEO 友好的描述
  const description = locale === 'zh'
    ? `从今天开始计算，${Math.abs(days)} 天${days >= 0 ? '后' : '前'}是 ${formattedDate}（${dayOfWeek}）。立即计算日期并下载到日历。`
    : `Calculate the date ${Math.abs(days)} days ${days >= 0 ? 'from' : 'before'} today. The result is ${formattedDate} (${dayOfWeek}). Add to your calendar instantly.`;
  
  return {
    targetDate: targetDate.toISOString(),
    formattedDate,
    dayOfWeek,
    relativeTime,
    isPast: isPastDate,
    isFuture: isFutureDate,
    daysFromToday,
    title,
    description
  };
}

/**
 * 计算工作日（跳过周末）
 * 
 * @param businessDays - 工作日天数
 * @param locale - 语言代码
 * @param fromDate - 起始日期（默认为今天）
 * @returns 日期计算结果
 * 
 * TODO: 未来集成节假日 API（Nager.Date）
 */
export function calculateBusinessDays(
  businessDays: number,
  locale: SupportedLocale = 'en',
  fromDate: Date = new Date()
): DateCalculationResult {
  let currentDate = new Date(fromDate);
  let daysToAdd = Math.abs(businessDays);
  const direction = businessDays >= 0 ? 1 : -1;
  
  // 累加工作日
  while (daysToAdd > 0) {
    currentDate = add(currentDate, { days: direction });
    const dayOfWeek = currentDate.getDay();
    
    // 跳过周末（0=Sunday, 6=Saturday）
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysToAdd--;
    }
  }
  
  // 使用标准计算函数获取详细信息
  const actualDays = differenceInDays(currentDate, fromDate);
  return calculateDaysFromToday(actualDays, locale, fromDate);
}

/**
 * 验证天数参数
 * 
 * @param days - 天数字符串
 * @returns 验证后的天数（number）或 null
 */
export function validateDays(days: string): number | null {
  const parsed = parseInt(days, 10);
  
  // 检查是否为有效数字
  if (isNaN(parsed)) {
    return null;
  }
  
  // 限制范围（-10000 到 10000）
  if (parsed < -10000 || parsed > 10000) {
    return null;
  }
  
  return parsed;
}

/**
 * 生成常用天数列表（用于相关推荐）
 * 
 * @param currentDays - 当前天数
 * @returns 相关天数列表
 */
export function getRelatedDays(currentDays: number): number[] {
  const related: number[] = [];
  
  // 常用天数
  const commonDays = [7, 14, 30, 60, 90, 180, 365];
  
  // 添加相近的天数
  commonDays.forEach(days => {
    if (Math.abs(days - currentDays) > 5) {
      related.push(days);
    }
  });
  
  // 限制返回数量
  return related.slice(0, 6);
}

