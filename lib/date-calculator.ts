/**
 * 日期计算核心模块（Phase 2.6）
 * 
 * 功能：
 * - 从日期计算天数（date → days）
 * - 从天数计算日期（days → date）
 * - 支持自然日和工作日两种模式
 */

import { differenceInDays, addDays, parseISO, format } from 'date-fns';
import { calculateWorkingDays, addWorkingDays } from './working-days';
import type { DateCalculationResult } from '@/types/card-template';

/**
 * 从目标日期计算天数
 * 
 * @param targetDate 目标日期（ISO格式）
 * @param countryCode 国家代码（用于节假日计算）
 * @returns 计算结果（包含自然日和工作日）
 */
export async function calculateDaysFromDate(
  targetDate: string,
  countryCode: string = 'US'
): Promise<DateCalculationResult> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = parseISO(targetDate);
  target.setHours(0, 0, 0, 0);
  
  // 计算自然日
  const naturalDays = differenceInDays(target, today);
  
  // 计算工作日
  const workingDays = await calculateWorkingDays(today, target, countryCode);
  
  return {
    targetDate: format(target, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    naturalDays: Math.abs(naturalDays),
    workingDays: Math.abs(workingDays),
    countryCode
  };
}

/**
 * 从天数计算目标日期
 * 
 * @param days 天数（正数=未来，负数=过去）
 * @param daysType 天数类型（natural/working）
 * @param countryCode 国家代码
 * @returns 计算结果
 */
export async function calculateDateFromDays(
  days: number,
  daysType: 'natural' | 'working',
  countryCode: string = 'US'
): Promise<DateCalculationResult> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let targetDate: Date;
  
  if (daysType === 'natural') {
    // 自然日计算
    targetDate = addDays(today, days);
    
    // 计算工作日
    const workingDays = await calculateWorkingDays(today, targetDate, countryCode);
    
    return {
      targetDate: format(targetDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      naturalDays: Math.abs(days),
      workingDays: Math.abs(workingDays),
      countryCode
    };
  } else {
    // 工作日计算
    targetDate = await addWorkingDays(today, days, countryCode);
    
    // 计算自然日
    const naturalDays = differenceInDays(targetDate, today);
    
    return {
      targetDate: format(targetDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      naturalDays: Math.abs(naturalDays),
      workingDays: Math.abs(days),
      countryCode
    };
  }
}
