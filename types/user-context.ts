/**
 * 用户上下文类型定义
 * 语言、国家、时区的完全解耦
 */

/**
 * 支持的语言
 */
export type Locale = 'en' | 'zh';

/**
 * ISO 3166-1 alpha-2 国家代码
 */
export type CountryCode = 
  | 'US'  // United States
  | 'CN'  // China
  | 'GB'  // United Kingdom
  | 'JP'  // Japan
  | 'DE'  // Germany
  | 'FR'  // France
  | 'CA'  // Canada
  | 'AU'  // Australia
  | 'IN'  // India
  | 'KR'  // South Korea
  | 'SG'  // Singapore
  | 'IT'  // Italy
  | 'ES'  // Spain
  | 'BR'  // Brazil
  | 'MX'  // Mexico
  | 'AE'; // UAE

/**
 * IANA 时区
 */
export type TimeZone = string; // 'America/New_York', 'Asia/Shanghai', etc.

/**
 * 用户上下文
 * 
 * 核心原则：
 * - locale: 仅控制 UI 文案
 * - country: 仅控制节假日/工作日规则
 * - timezone: 仅控制时间显示（暂不使用）
 */
export interface UserContext {
  /**
   * 语言：控制 UI 文案
   * 由路由 /[locale] 决定
   */
  locale: Locale;
  
  /**
   * 国家：控制节假日/工作日规则
   * 优先级：Cookie > Vercel Header > 默认 US
   */
  country: CountryCode;
  
  /**
   * 时区：控制本地时间显示/DST
   * 暂不使用，预留给未来
   */
  timezone?: TimeZone;
  
  /**
   * 来源标识
   * - auto: 自动识别（Vercel Headers）
   * - user: 用户手动选择
   */
  source: 'auto' | 'user';
  
  /**
   * 最后更新时间
   */
  lastUpdated: string;
}

/**
 * 国家信息
 */
export interface CountryInfo {
  code: CountryCode;
  name: {
    en: string;
    zh: string;
  };
  flag: string;
  timezone: TimeZone; // 默认时区
  weekend: number[]; // 周末（0=Sunday, 6=Saturday）
  tier: 1 | 2 | 3; // 优先级
}

