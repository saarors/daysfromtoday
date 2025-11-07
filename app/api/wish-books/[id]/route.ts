/**
 * Wish Books API - 单个卡片操作
 * GET: 获取单个卡片详情
 * PATCH: 更新卡片
 * DELETE: 删除卡片（软删除）
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// GET /api/wish-books/[id] - 获取单个卡片
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    
    // 查询卡片
    const { data, error } = await supabase
      .from('wish_books')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`❌ 获取卡片失败 (${id}):`, error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Wish book not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    console.log(`✅ 获取卡片成功: ${data.title} (${data.slug})`);
    
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('❌ API 错误:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/wish-books/[id] - 更新卡片
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
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
    
    // 更新数据库
    const { data, error } = await supabase
      .from('wish_books')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`❌ 更新卡片失败 (${id}):`, error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Wish book not found' },
          { status: 404 }
        );
      }
      
      // 检查 slug 重复
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
    
    console.log(`✅ 更新卡片成功: ${data.title} (${data.slug})`);
    
    // 如果是已发布的卡片，触发重新验证
    if (data.status === 'published') {
      revalidatePath(`/wish-books/${data.slug}`);
      revalidatePath('/wish-books');
      console.log(`🔄 已触发页面重新验证: ${data.slug}`);
    }
    
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('❌ API 错误:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/wish-books/[id] - 删除卡片（软删除）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    
    // 验证用户权限
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }
    
    // 软删除：将状态改为 archived
    const { data, error } = await supabase
      .from('wish_books')
      .update({
        status: 'archived',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`❌ 删除卡片失败 (${id}):`, error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Wish book not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    console.log(`✅ 删除卡片成功: ${data.title} (${data.slug})`);
    
    // 触发页面重新验证
    revalidatePath(`/wish-books/${data.slug}`);
    revalidatePath('/wish-books');
    console.log(`🔄 已触发页面重新验证`);
    
    return NextResponse.json({
      success: true,
      message: 'Wish book archived successfully',
      data
    });
    
  } catch (error: any) {
    console.error('❌ API 错误:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

