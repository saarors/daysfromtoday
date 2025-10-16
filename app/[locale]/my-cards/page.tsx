/**
 * 我的卡片管理页面
 * 显示用户从 Supabase 读取的所有目标卡片
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'zh' ? '我的卡片 - DaysFromToday' : 'My Cards - DaysFromToday',
    description: locale === 'zh' ? '管理你的目标卡片' : 'Manage your goal cards',
  };
}

export default async function MyCardsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const supabase = createClient();

  // 检查用户是否登录
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // 未登录，重定向到登录页面
    redirect(`/${locale}/auth?redirect=/${locale}/my-cards`);
  }

  // 从 Supabase 读取用户的卡片
  const { data: cards, error } = await supabase
    .from('goal_cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('读取卡片失败:', error);
  }

  const text = {
    en: {
      title: 'My Goal Cards',
      noCards: 'No cards yet',
      createFirst: 'Create your first goal card',
      createButton: 'Create Card',
      cardsCount: 'cards',
    },
    zh: {
      title: '我的目标卡片',
      noCards: '还没有卡片',
      createFirst: '创建你的第一张目标卡片',
      createButton: '创建卡片',
      cardsCount: '张卡片',
    },
  };

  const t = text[locale as 'en' | 'zh'] || text.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 导航栏占位 */}
      <div className="h-20"></div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">
            {cards?.length || 0} {t.cardsCount}
          </p>
        </div>

        {/* 卡片列表 */}
        {!cards || cards.length === 0 ? (
          // 空状态
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t.noCards}</h2>
            <p className="text-gray-500 mb-6">{t.createFirst}</p>
            <a
              href={`/${locale}/v3-test`}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              {t.createButton}
            </a>
          </div>
        ) : (
          // 卡片网格
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <span className="text-sm text-gray-500">
                    {new Date(card.target_date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="text-5xl font-bold text-gradient-calendly mb-2">
                    {card.days_count}
                  </div>
                  <div className="text-sm text-gray-500">
                    {card.days_count === 1 ? 'day' : 'days'}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-800 font-medium line-clamp-3">
                    "{card.goal_text}"
                  </p>
                </div>

                <div className="text-xs text-gray-400">
                  {locale === 'zh' ? '创建于' : 'Created'} {new Date(card.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

