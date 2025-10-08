/**
 * 国家配置与周末规则
 */

import type { CountryCode, CountryInfo } from '@/types/user-context';

/**
 * 周末规则映射
 * key: 国家代码
 * value: 周末日期数组 (0=Sunday, 1=Monday, ..., 6=Saturday)
 */
export const WEEKEND_BY_COUNTRY: Record<CountryCode, number[]> = {
  // Tier 1: 核心市场（周六日周末）
  'US': [0, 6],  // Sunday, Saturday
  'CN': [0, 6],  // Sunday, Saturday
  'GB': [0, 6],  // Sunday, Saturday
  'JP': [0, 6],  // Sunday, Saturday
  'DE': [0, 6],  // Sunday, Saturday
  
  // Tier 2: 重要市场（周六日周末）
  'FR': [0, 6],
  'CA': [0, 6],
  'AU': [0, 6],
  'IN': [0, 6],
  'KR': [0, 6],
  
  // Tier 3: 扩展市场
  'SG': [0, 6],
  'IT': [0, 6],
  'ES': [0, 6],
  'BR': [0, 6],
  'MX': [0, 6],
  'AE': [5, 6],  // Friday, Saturday (中东特殊)
};

/**
 * 获取国家的周末日期
 */
export function getWeekendDays(country: CountryCode): number[] {
  return WEEKEND_BY_COUNTRY[country] || [0, 6]; // 默认周六日
}

/**
 * 判断日期是否是周末
 */
export function isWeekend(date: Date, country: CountryCode): boolean {
  const dayOfWeek = date.getDay();
  const weekendDays = getWeekendDays(country);
  return weekendDays.includes(dayOfWeek);
}

/**
 * 支持的国家列表
 */
export const COUNTRIES: CountryInfo[] = [
  // Tier 1: 核心市场（必须本地兜底）
  {
    code: 'US',
    name: { en: 'United States', zh: '美国' },
    flag: '🇺🇸',
    timezone: 'America/New_York',
    weekend: [0, 6],
    tier: 1
  },
  {
    code: 'CN',
    name: { en: 'China', zh: '中国' },
    flag: '🇨🇳',
    timezone: 'Asia/Shanghai',
    weekend: [0, 6],
    tier: 1
  },
  {
    code: 'GB',
    name: { en: 'United Kingdom', zh: '英国' },
    flag: '🇬🇧',
    timezone: 'Europe/London',
    weekend: [0, 6],
    tier: 1
  },
  {
    code: 'JP',
    name: { en: 'Japan', zh: '日本' },
    flag: '🇯🇵',
    timezone: 'Asia/Tokyo',
    weekend: [0, 6],
    tier: 1
  },
  {
    code: 'DE',
    name: { en: 'Germany', zh: '德国' },
    flag: '🇩🇪',
    timezone: 'Europe/Berlin',
    weekend: [0, 6],
    tier: 1
  },
  
  // Tier 2: 重要市场
  {
    code: 'FR',
    name: { en: 'France', zh: '法国' },
    flag: '🇫🇷',
    timezone: 'Europe/Paris',
    weekend: [0, 6],
    tier: 2
  },
  {
    code: 'CA',
    name: { en: 'Canada', zh: '加拿大' },
    flag: '🇨🇦',
    timezone: 'America/Toronto',
    weekend: [0, 6],
    tier: 2
  },
  {
    code: 'AU',
    name: { en: 'Australia', zh: '澳大利亚' },
    flag: '🇦🇺',
    timezone: 'Australia/Sydney',
    weekend: [0, 6],
    tier: 2
  },
  {
    code: 'IN',
    name: { en: 'India', zh: '印度' },
    flag: '🇮🇳',
    timezone: 'Asia/Kolkata',
    weekend: [0, 6],
    tier: 2
  },
  {
    code: 'KR',
    name: { en: 'South Korea', zh: '韩国' },
    flag: '🇰🇷',
    timezone: 'Asia/Seoul',
    weekend: [0, 6],
    tier: 2
  },
  
  // Tier 3: 扩展市场
  {
    code: 'SG',
    name: { en: 'Singapore', zh: '新加坡' },
    flag: '🇸🇬',
    timezone: 'Asia/Singapore',
    weekend: [0, 6],
    tier: 3
  },
  {
    code: 'IT',
    name: { en: 'Italy', zh: '意大利' },
    flag: '🇮🇹',
    timezone: 'Europe/Rome',
    weekend: [0, 6],
    tier: 3
  },
  {
    code: 'ES',
    name: { en: 'Spain', zh: '西班牙' },
    flag: '🇪🇸',
    timezone: 'Europe/Madrid',
    weekend: [0, 6],
    tier: 3
  },
  {
    code: 'BR',
    name: { en: 'Brazil', zh: '巴西' },
    flag: '🇧🇷',
    timezone: 'America/Sao_Paulo',
    weekend: [0, 6],
    tier: 3
  },
  {
    code: 'MX',
    name: { en: 'Mexico', zh: '墨西哥' },
    flag: '🇲🇽',
    timezone: 'America/Mexico_City',
    weekend: [0, 6],
    tier: 3
  },
  {
    code: 'AE',
    name: { en: 'United Arab Emirates', zh: '阿联酋' },
    flag: '🇦🇪',
    timezone: 'Asia/Dubai',
    weekend: [5, 6],  // Friday, Saturday
    tier: 3
  }
];

/**
 * 根据国家代码获取国家信息
 */
export function getCountryInfo(code: CountryCode): CountryInfo | undefined {
  return COUNTRIES.find(c => c.code === code);
}

/**
 * 获取默认国家（用于回退）
 */
export const DEFAULT_COUNTRY: CountryCode = 'US';

/**
 * 国家层级分组
 */
export const COUNTRY_TIERS = {
  tier1: ['US', 'CN', 'GB', 'JP', 'DE'] as CountryCode[],
  tier2: ['CA', 'AU', 'FR', 'ES', 'IT', 'BR', 'IN', 'MX', 'SG', 'AE'] as CountryCode[]
};

