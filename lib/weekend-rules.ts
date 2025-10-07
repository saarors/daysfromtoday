import weekendRules from '@/data/weekend-rules.json';

export interface WeekendRule {
  days: number[];      // [0, 6] = Sunday, Saturday
  names: string[];
}

/**
 * 获取指定国家的周末天数
 * @param countryCode - 国家代码（ISO 3166-1 alpha-2）
 * @returns 周末天数数组（0=Sunday, 6=Saturday）
 */
export function getWeekendDays(countryCode: string): number[] {
  const rule = weekendRules[countryCode as keyof typeof weekendRules];
  return rule?.days || [0, 6]; // 默认周六日
}

/**
 * 获取指定国家的周末名称
 * @param countryCode - 国家代码
 * @returns 周末名称数组
 */
export function getWeekendNames(countryCode: string): string[] {
  const rule = weekendRules[countryCode as keyof typeof weekendRules];
  return rule?.names || ['Sunday', 'Saturday'];
}

/**
 * 检查日期是否是周末
 * @param date - 日期
 * @param countryCode - 国家代码
 * @returns 是否是周末
 */
export function isWeekend(date: Date, countryCode: string): boolean {
  const weekendDays = getWeekendDays(countryCode);
  return weekendDays.includes(date.getDay());
}

/**
 * 获取所有支持的国家代码
 * @returns 国家代码数组
 */
export function getSupportedCountries(): string[] {
  return Object.keys(weekendRules);
}

/**
 * 检查国家是否支持
 * @param countryCode - 国家代码
 * @returns 是否支持
 */
export function isCountrySupported(countryCode: string): boolean {
  return countryCode in weekendRules;
}

