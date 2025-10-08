import { NextRequest, NextResponse } from 'next/server';
import { addBusinessDays, subBusinessDays } from '@/lib/bizdays';
import type { CountryCode } from '@/types/user-context';
import { parseISO, isValid } from 'date-fns';

export const runtime = 'edge';

/**
 * 工作日计算 API
 * GET /api/bizdays?from={date}&days={n}&country={code}&timezone={tz}&direction={future|past}
 * 
 * 参数：
 * - from: 起始日期（ISO 8601），默认今天
 * - days: 工作日天数，必须 > 0
 * - country: 国家代码，默认 US
 * - timezone: 时区，默认 UTC
 * - direction: 方向（future|past），默认 future
 * 
 * 返回：
 * - targetDate: 目标日期
 * - excludedDates: 被排除的日期列表
 * - calendarDays: 日历天数
 * - businessDays: 工作日天数
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    const fromParam = searchParams.get('from');
    const daysParam = searchParams.get('days');
    const country = (searchParams.get('country') || 'US') as CountryCode;
    const timezone = searchParams.get('timezone') || 'UTC';
    const direction = searchParams.get('direction') || 'future';
    
    // 验证参数
    if (!daysParam) {
      return NextResponse.json({
        success: false,
        error: 'Parameter "days" is required'
      }, { status: 400 });
    }
    
    const days = Number(daysParam);
    if (isNaN(days) || days < 0) {
      return NextResponse.json({
        success: false,
        error: 'Parameter "days" must be a positive number'
      }, { status: 400 });
    }
    
    // 解析起始日期
    const from = fromParam ? parseISO(fromParam) : new Date();
    if (!isValid(from)) {
      return NextResponse.json({
        success: false,
        error: 'Parameter "from" must be a valid ISO 8601 date'
      }, { status: 400 });
    }
    
    // 计算工作日
    const result = direction === 'past'
      ? await subBusinessDays(from, days, country, timezone)
      : await addBusinessDays(from, days, country, timezone);
    
    return NextResponse.json({
      success: true,
      data: {
        startDate: from.toISOString(),
        targetDate: result.targetDate.toISOString(),
        businessDays: days,
        calendarDays: result.totalCalendarDays,
        direction,
        excludedDates: result.excludedDates.map(d => ({
          date: d.dateStr,
          reason: d.reason,
          name: d.name,
          dayName: d.dayName
        }))
      },
      meta: {
        country,
        timezone,
        calculatedAt: new Date().toISOString()
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('Business days API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

