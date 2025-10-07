import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 86400; // 24 小时 ISR 缓存

/**
 * 节假日 API
 * GET /api/holidays?country={countryCode}&year={year}
 * 
 * 数据源：Nager.Date API
 * 缓存策略：24 小时 ISR
 * 降级策略：失败时返回空数组（调用方应回退到仅周末规则）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'US';
  const year = searchParams.get('year') || new Date().getFullYear().toString();
  
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
      throw new Error(`Nager.Date API error: ${response.status} ${response.statusText}`);
    }
    
    const holidays = await response.json();
    
    return NextResponse.json({
      success: true,
      data: holidays,
      meta: {
        country,
        year: Number(year),
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
    console.error('Holidays API error:', error);
    
    return NextResponse.json({
      success: false,
      data: [],
      meta: {
        country,
        year: Number(year),
        fallback: 'weekend-only',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'public, s-maxage=300' // 失败时缓存 5 分钟
      }
    });
  }
}

