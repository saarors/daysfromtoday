/**
 * ICS 文件下载 API
 * 
 * 路由：/api/ics
 * 方法：GET
 * 
 * 查询参数：
 * - days: 天数（必需）
 * - locale: 语言代码（可选，默认 'en'）
 * 
 * 功能：
 * 1. 生成 ICS 日历文件
 * 2. 返回下载响应
 * 3. 符合 RFC 5545 标准
 * 
 * 示例：
 * /api/ics?days=14&locale=en
 * /api/ics?days=30&locale=zh
 * 
 * 符合项目规范：
 * - Next.js 15 Route Handlers
 * - TypeScript 严格模式
 * - 错误处理
 */

import { NextRequest } from 'next/server';
import { validateDays, calculateDaysFromToday, type SupportedLocale } from '@/lib/date-calculator';
import { generateDateCalculationICS, createICSResponse } from '@/lib/ics-generator';

/**
 * GET 请求处理器
 */
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const daysParam = searchParams.get('days');
    const localeParam = searchParams.get('locale') || 'en';
    
    // 验证天数参数
    if (!daysParam) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: days' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const days = validateDays(daysParam);
    
    if (days === null) {
      return new Response(
        JSON.stringify({ error: 'Invalid days parameter' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // 验证语言参数
    const locale = ['en', 'zh'].includes(localeParam) 
      ? localeParam as SupportedLocale 
      : 'en';
    
    // 计算日期
    const result = calculateDaysFromToday(days, locale);
    const targetDate = new Date(result.targetDate);
    
    // 生成 ICS 文件
    const icsContent = generateDateCalculationICS(targetDate, days, locale);
    
    // 生成文件名
    const filename = `${days}-days-from-today-${result.formattedDate}`;
    
    // 返回下载响应
    return createICSResponse(icsContent, filename);
    
  } catch (error) {
    console.error('ICS generation error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * 配置 Edge Runtime（更快的响应）
 */
export const runtime = 'edge';

