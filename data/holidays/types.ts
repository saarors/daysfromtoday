/**
 * 节假日配置类型定义
 * 
 * @description
 * 本文件定义了节假日数据的 TypeScript 类型结构
 * 用于统一管理 15 个国家的节假日数据
 */

import type { CountryCode } from '@/types/user-context';

/**
 * 单个节假日条目
 */
export interface HolidayEntry {
  /** 日期 ISO 8601 格式 "YYYY-MM-DD" */
  date: string;
  
  /** 节假日名称（多语言） */
  name: {
    /** 英文名称 */
    en: string;
    /** 中文名称 */
    zh: string;
  };
  
  /** 节假日类型 */
  type: 'public' | 'bank' | 'regional' | 'religious' | 'observance';
  
  /** 是否为全国性节假日 */
  isNational: boolean;
  
  /** 可选：节假日说明 */
  description?: string;
  
  /** 可选：适用区域（如果是地区性节假日） */
  regions?: string[];
}

/**
 * 国家节假日元数据
 */
export interface CountryMetadata {
  /** 数据来源 */
  source: string;
  
  /** 最后更新时间 ISO 8601 */
  lastUpdate: string;
  
  /** 是否已人工验证 */
  verified: boolean;
  
  /** 验证者 */
  verifiedBy?: string;
  
  /** 备注 */
  notes?: string;
}

/**
 * 国家节假日完整数据
 */
export interface CountryHolidaysData {
  /** 国家代码 */
  country: CountryCode;
  
  /** 国家名称（多语言） */
  countryName: {
    en: string;
    zh: string;
  };
  
  /** 元数据 */
  metadata: CountryMetadata;
  
  /** 按年份组织的节假日数据 */
  years: {
    [year: string]: HolidayEntry[];
  };
}

/**
 * Markdown 解析结果
 */
export interface ParsedMarkdown {
  /** 解析后的国家数据 */
  data: CountryHolidaysData;
  
  /** 解析错误（如有） */
  errors?: string[];
  
  /** 警告信息（如有） */
  warnings?: string[];
}

/**
 * 节假日查询结果
 */
export interface HolidayQueryResult {
  /** 是否成功 */
  success: boolean;
  
  /** 节假日数据 */
  data: HolidayEntry[];
  
  /** 数据来源 */
  source: 'local' | 'api' | 'cache' | 'empty';
  
  /** 最后更新时间 */
  lastUpdate: string;
  
  /** 错误信息（如有） */
  error?: string;
}

