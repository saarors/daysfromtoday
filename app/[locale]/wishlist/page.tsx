'use client';

/**
 * 愿望清单页面
 * - 接收来自首页的 URL 参数
 * - 显示 AI 对话界面
 * - 保存愿望到本地/数据库
 * - 显示愿望卡片列表
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import { EmptyWishlist } from '@/components/v3/Wishlist/EmptyWishlist';
import { AIChatDialog } from '@/components/v3/Wishlist/AIChatDialog';
import { WishCard } from '@/components/v3/Wishlist/WishCard';
import { useGoalCards } from '@/store/goal-cards';
import { createClient } from '@/lib/supabase/client';
import type { AIAssistantType } from '@/types/ai-assistant';

interface WishlistPageProps {
  params: {
    locale: string;
  };
}

function WishlistContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cards, addCard } = useGoalCards();

  // 从 URL 获取参数
  const [hasNewGoal, setHasNewGoal] = useState(false);
  const [goalData, setGoalData] = useState<{
    days: number;
    targetDate: string;
    goalText: string;
    assistant: AIAssistantType;
  } | null>(null);

  // 显示状态
  const [showChat, setShowChat] = useState(false);
  const [wishCards, setWishCards] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 检查登录状态
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();

    // 解析 URL 参数
    const days = searchParams.get('days');
    const targetDate = searchParams.get('targetDate');
    const goalText = searchParams.get('goalText');
    const assistant = searchParams.get('assistant') as AIAssistantType;

    if (days && targetDate && goalText && assistant) {
      setHasNewGoal(true);
      setGoalData({
        days: parseInt(days),
        targetDate,
        goalText,
        assistant,
      });
      setShowChat(true);
    }

    // 加载现有卡片
    setWishCards(cards.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, [searchParams, cards]);

  const handleChatComplete = async (aiAnalysis: string, aiSummary: string) => {
    if (!goalData) return;

    // 创建新卡片
    const newCard = addCard({
      templateId: 'gradient-growth', // 默认模板
      cardType: 'future',
      calculationMode: 'days-first',
      daysType: 'natural',
      content: {
        goalText: goalData.goalText,
        targetDate: goalData.targetDate,
        daysCount: goalData.days,
        workingDaysCount: 0, // 后续计算
        title: '',
      },
    });

    // 如果登录，同步到数据库
    if (isLoggedIn) {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await supabase.from('goal_cards').insert({
            id: newCard.id,
            user_id: session.user.id,
            template_id: newCard.templateId,
            card_type: newCard.cardType,
            calculation_mode: newCard.calculationMode,
            days_type: newCard.daysType,
            goal_text: goalData.goalText,
            target_date: goalData.targetDate,
            days_count: goalData.days,
            working_days_count: 0,
            user_name: '',
            is_public: false,
            created_at: newCard.createdAt,
            updated_at: newCard.updatedAt,
          });
        }
      } catch (error) {
        console.error('保存到数据库失败:', error);
      }
    }

    // 隐藏对话，显示卡片列表
    setShowChat(false);
    setHasNewGoal(false);
    
    // 清除 URL 参数
    router.push(`/${locale}/wishlist`);
    
    // 刷新卡片列表
    setWishCards([...cards].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const handleDeleteCard = (id: string) => {
    // TODO: 实现删除功能
    console.log('Delete card:', id);
  };

  const text = {
    en: {
      title: 'My Wishlist',
      createNew: '+ Create New Wish',
    },
    zh: {
      title: '我的愿望清单',
      createNew: '+ 创建新愿望',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景底纹 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.06),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(147,197,253,0.06),transparent_50%)] bg-white" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <TopNav locale={locale} />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* AI 对话界面 */}
        {showChat && goalData && (
          <AIChatDialog
            goalText={goalData.goalText}
            targetDate={goalData.targetDate}
            days={goalData.days}
            workingDays={0}
            assistant={goalData.assistant}
            onComplete={handleChatComplete}
            locale={locale}
          />
        )}

        {/* 愿望卡片列表 */}
        {!showChat && (
          <>
            {wishCards.length === 0 ? (
              <EmptyWishlist locale={locale} />
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
                  <button
                    onClick={() => router.push(`/${locale}`)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {t.createNew}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishCards.map((card) => (
                    <WishCard
                      key={card.id}
                      id={card.id}
                      goalText={card.content.goalText}
                      targetDate={card.content.targetDate}
                      days={card.content.daysCount}
                      workingDays={card.content.workingDaysCount}
                      assistant="twinkle" // 默认，后续从卡片数据读取
                      aiSummary="AI 建议摘要（待实现）"
                      createdAt={card.createdAt}
                      onDelete={handleDeleteCard}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function WishlistPage({ params }: WishlistPageProps) {
  const { locale } = params;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <WishlistContent locale={locale} />
    </Suspense>
  );
}

