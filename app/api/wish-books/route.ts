/**
 * Wish Books API - 列表和创建
 * GET: 获取卡片列表（支持筛选、分页、搜索）
 * POST: 创建新卡片
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/wish-books - 获取卡片列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 解析查询参数
    const status = searchParams.get('status') || 'published';
    const timeDimension = searchParams.get('time_dimension');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const locale = searchParams.get('locale') || 'zh';
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'latest';
    
    const supabase = createClient();
    
    // 构建查询
    let query = supabase
      .from('wish_books')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .eq('locale', locale);
    
    // 筛选条件
    if (timeDimension) {
      query = query.eq('time_dimension', timeDimension);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    // 搜索
    if (search) {
      query = query.or(`title.ilike.%${search}%,subtitle.ilike.%${search}%`);
    }
    
    // 排序
    if (sort === 'latest') {
      query = query.order('published_at', { ascending: false });
    } else if (sort === 'popular') {
      query = query.order('view_count', { ascending: false });
    } else if (sort === 'quality') {
      query = query.order('quality_score', { ascending: false });
    }
    
    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    // 执行查询
    const { data, error, count } = await query;
    
    if (error) {
      console.error('❌ 获取卡片列表失败:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    console.log(`✅ 获取卡片列表成功: ${data?.length || 0} 张卡片`);
    
    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
    
  } catch (error: any) {
    console.error('❌ API 错误:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/wish-books - 创建新卡片
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // 验证用户权限
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }
    
    // 解析请求体
    const body = await request.json();
    
    // 验证必填字段
    if (!body.title || !body.slug || !body.time_dimension || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, time_dimension, category' },
        { status: 400 }
      );
    }
    
    // 插入数据库
    const { data, error } = await supabase
      .from('wish_books')
      .insert({
        ...body,
        author_id: user.id,
        status: 'draft',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ 创建卡片失败:', error);
      
      // 检查是否是 slug 重复错误
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Slug already exists. Please use a different slug.' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    console.log(`✅ 创建卡片成功: ${data.title} (${data.slug})`);
    
    return NextResponse.json(data, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ API 错误:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

