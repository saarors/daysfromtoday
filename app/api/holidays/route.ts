import { NextRequest, NextResponse } from 'next/server';
import { getLocalHolidays } from '@/data/holidays/index';
import type { CountryCode } from '@/types/user-context';

export const revalidate = 86400; // 24 小时 ISR 缓存

/**
 * 节假日 API
 * GET /api/holidays?country={countryCode}&year={year}
 * 
 * 数据源优先级：
 * 1. 本地 Markdown 配置（主源）
 * 2. Nager.Date API（降级）
 * 3. 空数组（兜底）
 * 
 * 缓存策略：24 小时 ISR
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get('country') || 'US') as CountryCode;
  const year = Number(searchParams.get('year') || new Date().getFullYear());
  
  // 1. 尝试本地配置
  try {
    const localResult = await getLocalHolidays(country, year);
    
    if (localResult.success && localResult.data.length > 0) {
      // 转换格式以保持兼容性
      const holidays = localResult.data.map(entry => ({
        date: entry.date,
        localName: entry.name.zh,
        name: entry.name.en,
        countryCode: country,
        fixed: false,
        global: entry.isNational,
        counties: null,
        launchYear: null,
        types: [entry.type]
      }));
      
      return NextResponse.json({
        success: true,
        data: holidays,
        meta: {
          country,
          year,
          count: holidays.length,
          source: 'Local Markdown',
          cached: true,
          updatedAt: localResult.lastUpdate
        }
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800'
        }
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Holidays API] Local config failed for ${country}/${year}:`, error);
    }
  }
  
  // 2. 降级到 Nager.Date API
  try {
    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`,
      {
        next: { revalidate: 86400 },
        headers: {
          'User-Agent': 'DaysFromToday/1.0 (https://www.daysfromtoday.ai)'
        }
      }
    );
    
    if (!response.ok) {
      // 静默降级
      return NextResponse.json({
        success: false,
        data: [],
        meta: {
          country,
          year,
          fallback: 'weekend-only',
          error: `API returned ${response.status}`
        }
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300'
        }
      });
    }
    
    const text = await response.text();
    if (!text) {
      // 空响应
      return NextResponse.json({
        success: false,
        data: [],
        meta: {
          country,
          year,
          fallback: 'weekend-only',
          error: 'Empty response from API'
        }
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300'
        }
      });
    }
    
    const holidays = JSON.parse(text);
    
    return NextResponse.json({
      success: true,
      data: holidays,
      meta: {
        country,
        year,
        count: holidays.length,
        source: 'Nager.Date API',
        cached: true,
        updatedAt: new Date().toISOString()
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800'
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Holidays API] Nager.Date failed for ${country}/${year}:`, error);
    }
    
    // 3. 完全降级
    return NextResponse.json({
      success: false,
      data: [],
      meta: {
        country,
        year,
        fallback: 'weekend-only',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300'
      }
    });
  }
}

