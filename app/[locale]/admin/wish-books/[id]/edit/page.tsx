/**
 * 编辑 Wish Book 卡片
 */

import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import WishBookForm from '../../components/WishBookForm';

export const metadata: Metadata = {
  title: '编辑卡片 | 愿望宝典管理',
  robots: 'noindex, nofollow',
};

export default async function EditWishBookPage({ 
  params 
}: { 
  params: { locale: string; id: string } 
}) {
  const { locale, id } = await params;
  
  // 验证用户权限
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(`/${locale}/auth`);
  }
  
  // 获取卡片数据
  const { data: wishBook, error } = await supabase
    .from('wish_books')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !wishBook) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 头部 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ✏️ 编辑卡片
            </h1>
            <p className="text-gray-600 mt-2">
              {wishBook.title}
            </p>
          </div>
          
          {/* 表单 */}
          <WishBookForm 
            locale={locale} 
            initialData={wishBook}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
}

