/**
 * Wish Books 管理后台 - 卡片列表页
 * 功能：
 * - 显示所有卡片（表格形式）
 * - 筛选（status, category, time_dimension）
 * - 搜索（title）
 * - 操作（编辑、删除、发布）
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminWishBooksClient from './AdminWishBooksClient';
import PublishButton from './PublishButton';

export const metadata: Metadata = {
  title: '愿望宝典管理 | DaysFromToday Admin',
  robots: 'noindex, nofollow', // 不索引管理页面
};

// 时间维度配置
const TIME_DIMENSIONS = {
  '7-days': { label: '7天', emoji: '⚡' },
  '30-days': { label: '30天', emoji: '🌱' },
  '90-days': { label: '90天', emoji: '🎯' },
  '100-days': { label: '100天', emoji: '💯' },
  '180-days': { label: '180天', emoji: '📈' },
  '365-days': { label: '365天', emoji: '🏆' },
  '3-years': { label: '3年', emoji: '🌟' },
  '5-years': { label: '5年', emoji: '🚀' }
};

// 类别配置
const CATEGORIES = {
  fitness: { name: '健身', emoji: '💪' },
  learning: { name: '学习', emoji: '📚' },
  career: { name: '职业', emoji: '💼' },
  personal_growth: { name: '成长', emoji: '🌱' },
  relationships: { name: '关系', emoji: '❤️' },
  creative: { name: '创意', emoji: '🎨' },
  lifestyle: { name: '生活', emoji: '🏠' },
  mental_health: { name: '心理', emoji: '🧠' }
};

// 状态配置
const STATUS_CONFIG = {
  draft: { label: '草稿', color: 'gray', emoji: '📝' },
  published: { label: '已发布', color: 'green', emoji: '✅' },
  archived: { label: '已归档', color: 'red', emoji: '🗃️' }
};

export default async function AdminWishBooksPage({ 
  params,
  searchParams 
}: { 
  params: { locale: string };
  searchParams: { 
    status?: string;
    category?: string;
    time_dimension?: string;
    search?: string;
  };
}) {
  const { locale } = await params;
  const filters = await searchParams;
  
  // 验证用户权限
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(`/${locale}/auth`);
  }
  
  // 构建查询
  let query = supabase
    .from('wish_books')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });
  
  // 应用筛选
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.time_dimension) {
    query = query.eq('time_dimension', filters.time_dimension);
  }
  
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,subtitle.ilike.%${filters.search}%`);
  }
  
  // 执行查询
  const { data: wishBooks, error, count } = await query;
  
  if (error) {
    console.error('获取卡片列表失败:', error);
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📚 愿望宝典管理
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                共 {count || 0} 张卡片
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/wish-books`}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                👁️ 查看前台
              </Link>
              <Link
                href={`/${locale}/admin/wish-books/new`}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ➕ 创建新卡片
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* 客户端筛选组件 */}
        <AdminWishBooksClient 
          initialFilters={filters}
          categories={CATEGORIES}
          timeDimensions={TIME_DIMENSIONS}
        />
        
        {/* 卡片列表 */}
        {wishBooks && wishBooks.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    标题
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    时间维度
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    类别
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    状态
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    统计
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    创建时间
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {wishBooks.map((book) => {
                  const timeDim = TIME_DIMENSIONS[book.time_dimension as keyof typeof TIME_DIMENSIONS];
                  const category = CATEGORIES[book.category as keyof typeof CATEGORIES];
                  const status = STATUS_CONFIG[book.status as keyof typeof STATUS_CONFIG];
                  
                  return (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {book.title}
                          </div>
                          {book.subtitle && (
                            <div className="text-sm text-gray-500 mt-1">
                              {book.subtitle}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            /{book.slug}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">
                          {timeDim?.emoji} {timeDim?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">
                          {category?.emoji} {category?.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${status?.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                          ${status?.color === 'gray' ? 'bg-gray-100 text-gray-700' : ''}
                          ${status?.color === 'red' ? 'bg-red-100 text-red-700' : ''}
                        `}>
                          {status?.emoji} {status?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>👁️ {book.view_count || 0}</div>
                          <div>❤️ {book.save_count || 0}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(book.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <PublishButton
                            bookId={book.id}
                            currentStatus={book.status}
                            locale={locale}
                          />
                          <Link
                            href={`/${locale}/admin/wish-books/${book.id}/edit`}
                            className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                          >
                            编辑
                          </Link>
                          {book.status === 'published' && (
                            <Link
                              href={`/${locale}/wish-books/${book.slug}`}
                              target="_blank"
                              className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                            >
                              查看
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              还没有卡片
            </h3>
            <p className="text-gray-600 mb-6">
              创建第一张愿望卡片，开始你的内容之旅！
            </p>
            <Link
              href={`/${locale}/admin/wish-books/new`}
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ➕ 创建第一张卡片
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

