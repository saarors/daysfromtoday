/**
 * 创建新的 Wish Book 卡片
 */

import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WishBookForm from '../components/WishBookForm';

export const metadata: Metadata = {
  title: '创建新卡片 | 愿望宝典管理',
  robots: 'noindex, nofollow',
};

export default async function NewWishBookPage({ 
  params 
}: { 
  params: { locale: string } 
}) {
  const { locale } = await params;
  
  // 验证用户权限
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(`/${locale}/auth`);
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 头部 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ✨ 创建新卡片
            </h1>
            <p className="text-gray-600 mt-2">
              填写基础信息，创建你的第一张愿望卡片
            </p>
          </div>
          
          {/* 表单 */}
          <WishBookForm locale={locale} />
        </div>
      </div>
    </div>
  );
}

