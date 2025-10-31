'use client';

/**
 * 愿望清单页面
 * - 接收来自首页的 URL 参数
 * - 显示 AI 对话界面
 * - 保存愿望到本地/数据库
 * - 显示愿望卡片列表
 */

import { useState, useEffect, useRef, Suspense } from 'react';
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
    viewOnly?: boolean;  // 查看模式
    existingAnalysis?: string;  // 已有的 AI 分析
  } | null>(null);

  // 显示状态
  const [showChat, setShowChat] = useState(false);
  const [wishCards, setWishCards] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  // 添加加载状态
  const [isSaving, setIsSaving] = useState(false);  // 防止重复保存
  const savingRef = useRef(false);  // 使用 ref 立即锁定，避免状态更新延迟

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
    const viewOnly = searchParams.get('viewOnly');
    const cardId = searchParams.get('cardId');

    if (days && targetDate && goalText && assistant) {
      let existingAnalysis: string | undefined;
      
      // 如果是查看模式，从卡片中读取已有的 AI 分析
      if (viewOnly === 'true' && cardId) {
        const card = cards.find(c => c.id === cardId);
        if (card) {
          existingAnalysis = (card.content as any).aiAnalysis;
        }
      }
      
      setHasNewGoal(!viewOnly);
      setGoalData({
        days: parseInt(days),
        targetDate,
        goalText,
        assistant,
        viewOnly: viewOnly === 'true',
        existingAnalysis,
      });
      setShowChat(true);
    }

    // 加载现有卡片
    setWishCards(cards.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    
    // 数据加载完成
    setIsLoading(false);
  }, [searchParams, cards]);

  const handleChatComplete = async (aiAnalysis: string, aiSummary: string) => {
    // 使用 ref 立即检查，避免状态更新延迟
    if (!goalData || savingRef.current) {
      return;
    }
    
    // 检查是否已经存在相同的卡片（防止重复创建）
    const existingCard = cards.find(
      (card) =>
        card.content.goalText === goalData.goalText &&
        card.content.targetDate === goalData.targetDate &&
        card.content.daysCount === goalData.days
    );
    
    if (existingCard) {
      // 直接跳转到列表页面
      router.push(`/${locale}/wishlist`);
      setShowChat(false);
      return;
    }
    
    // 立即锁定
    savingRef.current = true;
    setIsSaving(true);

    // 创建新卡片（存储 AI 分析）
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
        // 存储 AI 相关数据（临时方案，后续迁移到专门字段）
        aiAnalysis: aiAnalysis,
        aiSummary: aiSummary,
        aiAssistant: goalData.assistant,
      } as any,
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

    // 先清除 URL 参数（这会触发重新渲染）
    router.push(`/${locale}/wishlist`);
    
    // 刷新卡片列表
    setWishCards([...cards].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    
    // 隐藏对话，显示卡片列表
    setShowChat(false);
    setHasNewGoal(false);
    
    // 延迟重置保存状态，确保所有渲染和路由跳转完成
    setTimeout(() => {
      savingRef.current = false;
      setIsSaving(false);
    }, 1000);
  };

  const handleDeleteCard = async (id: string) => {
    const { deleteCard, getAllCardsSortedByDate } = useGoalCards.getState();
    
    // 从本地移除
    deleteCard(id);
    
    // 如果登录，从数据库删除
    if (isLoggedIn) {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await supabase
            .from('goal_cards')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);
        }
      } catch (error) {
        console.error('从数据库删除失败:', error);
      }
    }
    
    // 刷新卡片列表（从 store 获取最新数据）
    setWishCards(getAllCardsSortedByDate());
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
            viewOnly={goalData.viewOnly}
            existingAnalysis={goalData.existingAnalysis}
            isSaving={isSaving}
          />
        )}

        {/* 愿望卡片列表 */}
        {!showChat && (
          <>
            {isLoading ? (
              // 加载骨架屏
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : wishCards.length === 0 ? (
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

                <div className="space-y-6">
                  {wishCards.map((card) => (
                  <WishCard
                    key={card.id}
                    id={card.id}
                    goalText={card.content.goalText}
                    targetDate={card.content.targetDate}
                    days={card.content.daysCount}
                    workingDays={card.content.workingDaysCount}
                    assistant={(card.content as any).aiAssistant || 'twinkle'}
                    aiAnalysis={(card.content as any).aiAnalysis || 'AI 分析内容'}
                    aiSummary={(card.content as any).aiSummary || 'AI 建议摘要'}
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

