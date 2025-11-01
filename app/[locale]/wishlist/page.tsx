'use client';

/**
 * 愿望清单页面 V3 - 集成 AI 智能匹配系统
 * 
 * 新功能：
 * - 自动识别目标类型
 * - 显示难度评估
 * - AI 人格智能匹配
 * - 调用真实 DeepSeek API
 */

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import { EmptyWishlist } from '@/components/v3/Wishlist/EmptyWishlist';
import { WishCard } from '@/components/v3/Wishlist/WishCard';
import { useGoalCards } from '@/store/goal-cards';
import { createClient } from '@/lib/supabase/client';
import { matchGoalToAI } from '@/lib/ai-matching';
import type { CompleteAIMatchResult } from '@/lib/ai-matching';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    viewOnly?: boolean;
    existingAnalysis?: string;
  } | null>(null);

  // AI 匹配结果
  const [matchResult, setMatchResult] = useState<CompleteAIMatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  // AI 对话状态
  const [showChat, setShowChat] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiThinking, setAiThinking] = useState<string | null>(null); // 新增：AI 思考过程

  // 显示状态
  const [wishCards, setWishCards] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

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
    const viewOnly = searchParams.get('viewOnly');
    const cardId = searchParams.get('cardId');

    if (days && targetDate && goalText) {
      // 🔥 防止重复触发：如果已经有 goalData 且内容相同，跳过
      if (goalData && 
          goalData.goalText === goalText && 
          goalData.targetDate === targetDate && 
          goalData.days === parseInt(days)) {
        console.log('⚠️ 检测到相同的 goalData，跳过重复处理');
        return;
      }

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
        viewOnly: viewOnly === 'true',
        existingAnalysis,
      });

      // 如果不是查看模式，执行智能匹配
      if (viewOnly !== 'true') {
        performAIMatching(goalText, parseInt(days), targetDate);
      } else {
        setShowChat(true);
        setAiResponse(existingAnalysis || '');
      }
    } else if (!days && !targetDate && !goalText) {
      // 🔥 如果 URL 参数为空，确保清空所有状态
      if (goalData !== null) {
        console.log('✅ URL 参数为空，清空所有目标相关状态');
        setGoalData(null);
        setMatchResult(null);
        setIsMatching(false);
        setIsGenerating(false);
        setAiResponse(null);
        setShowChat(false);
      }
    }

    // 加载现有卡片
    setWishCards(cards.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    
    // 数据加载完成
    setIsLoading(false);
  }, [searchParams, cards]);

  /**
   * 执行 AI 智能匹配
   */
  const performAIMatching = async (
    goalText: string,
    daysCount: number,
    targetDate: string
  ) => {
    // 防止重复调用
    if (isMatching) {
      console.log('⚠️ AI 匹配正在进行中，跳过重复调用');
      return;
    }
    
    setIsMatching(true);
    console.log('🚀 开始 AI 匹配...', { goalText, daysCount });
    
    try {
      // 1. 调用匹配服务（设置超时）
      console.log('⏱️ 调用 matchGoalToAI...');
      const startTime = Date.now();
      
      // 添加超时保护（10秒）
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('匹配超时')), 10000)
      );
      
      const matchPromise = matchGoalToAI({
        goalText,
        daysCount
      });
      
      const result = await Promise.race([matchPromise, timeoutPromise]) as CompleteAIMatchResult;
      
      const duration = Date.now() - startTime;
      console.log(`✅ AI 匹配完成！耗时: ${duration}ms`);

      setMatchResult(result);
      console.log('🎯 AI 匹配结果:', result);

      // 2. 短暂延迟后显示对话界面
      setTimeout(() => {
        setIsMatching(false);
        setShowChat(true);
        // 3. 立即调用 AI API 生成建议
        generateAIResponse(goalText, daysCount, targetDate, result);
      }, 1000);

    } catch (error: any) {
      console.error('❌ AI 匹配失败:', error);
      console.error('错误详情:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setIsMatching(false);
      setShowChat(true);
      // 降级方案：使用默认配置
      generateAIResponse(goalText, daysCount, targetDate, null);
    }
  };

  /**
   * 调用 DeepSeek API 生成 AI 建议
   */
  const generateAIResponse = async (
    goalText: string,
    daysCount: number,
    targetDate: string,
    matchResult: CompleteAIMatchResult | null
  ) => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalText,
          daysCount,
          targetDate,
          personaCode: matchResult?.persona.code || 'companion',
          goalTypeCode: matchResult?.goalType.code || 'life',
          difficultyLevel: matchResult?.difficulty.level || 'medium',
          language: matchResult?.metadata.language || 'zh'
        })
      });

      if (!response.ok) {
        throw new Error('API 调用失败');
      }

      const data = await response.json();
      
      console.log('📦 API 响应数据:', {
        hasAnalysis: !!data.analysis,
        hasThinking: !!data.thinking,
        hasSummary: !!data.summary,
        thinking: data.thinking,
        thinkingLength: data.thinking?.length || 0,
        model: data.model
      });
      
      setAiResponse(data.analysis);
      setAiThinking(data.thinking); // 保存思考过程
      
      console.log('✅ AI 生成完成:', {
        tokensUsed: data.tokensUsed,
        model: data.model,
        hasThinking: !!data.thinking,
        thinkingLength: data.thinking?.length || 0
      });

    } catch (error) {
      console.error('❌ AI 生成失败:', error);
      // 显示错误信息
      setAiResponse('抱歉，AI 服务暂时不可用。请稍后再试。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChatComplete = async (aiAnalysis: string, aiSummary: string) => {
    if (savingRef.current || !goalData) {
      console.log('⚠️ 阻止重复保存');
      return;
    }

    console.log('🔔 handleChatComplete called', {
      isSaving,
      savingRef: savingRef.current,
      goalData: !!goalData
    });

    setIsSaving(true);
    savingRef.current = true;

    console.log('✅ Starting save process...');

    try {
      // 检查是否已存在相同的卡片
      const isDuplicate = cards.some(card => 
        card.content.goalText === goalData.goalText &&
        card.content.targetDate === goalData.targetDate &&
        card.content.daysCount === goalData.days
      );

      if (isDuplicate) {
        console.log('⚠️ 检测到重复卡片，跳过保存');
        return;
      }

      // 准备卡片数据
      const cardData = {
        cardType: 'future' as const,
        content: {
          goalText: goalData.goalText,
          targetDate: goalData.targetDate,
          daysCount: goalData.days,
          workingDaysCount: 0,
          aiAssistant: matchResult?.persona.code || 'companion',
          aiAnalysis,
          aiSummary,
        },
        // 新增 Phase 3 字段
        goalTypeCode: matchResult?.goalType.code,
        detectedDifficulty: matchResult?.difficulty.level,
        aiPersonaCode: matchResult?.persona.code,
        matchingMetadata: matchResult ? {
          detected_keywords: matchResult.goalType.matchedKeywords,
          confidence_score: matchResult.goalType.confidence,
          difficulty_score: matchResult.difficulty.score,
          persona_reasoning: matchResult.persona.reasoning,
          matched_at: matchResult.metadata.timestamp
        } : null
      };

      // 1. 添加到本地 store
      addCard(cardData);

      // 2. 如果已登录，同步到数据库
      if (isLoggedIn) {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { error: insertError } = await supabase
            .from('goal_cards')
            .insert({
              user_id: session.user.id,
              goal_text: cardData.content.goalText,
              target_date: cardData.content.targetDate,
              days_count: cardData.content.daysCount,
              card_type: cardData.cardType,
              // Phase 3 新字段
              goal_type_code: cardData.goalTypeCode,
              detected_difficulty: cardData.detectedDifficulty,
              ai_persona_code: cardData.aiPersonaCode,
              ai_analysis: aiAnalysis,
              ai_summary: aiSummary,
              ai_model_used: 'deepseek-chat',
              input_language: matchResult?.metadata.language || 'zh',
              matching_metadata: cardData.matchingMetadata
            });

          if (insertError) {
            console.error('❌ Supabase 插入失败:', insertError);
          } else {
            console.log('✅ 已同步到数据库');
          }
        }
      }

      console.log('✅ Save complete, resetting state...');
      console.log('📊 当前卡片数量:', cards.length);
      console.log('🔄 准备清空状态并刷新页面...');

      // 🔥 关键修复：立即清空所有匹配状态和 goalData
      setGoalData(null);
      setMatchResult(null);
      setIsMatching(false);
      setIsGenerating(false);
      setAiResponse(null);
      savingRef.current = false;
      setIsSaving(false);

      // 刷新卡片列表
      const latestCards = useGoalCards.getState().getAllCardsSortedByDate();
      console.log('📋 最新卡片数量:', latestCards.length);
      setWishCards(latestCards);

      // 🔥 使用 window.history.replaceState 强制清除 URL 参数
      console.log('🚀 强制清除 URL 参数并刷新...');
      window.history.replaceState({}, '', `/${locale}/wishlist`);
      
      // 短暂延迟后，再次确保状态已重置
      setTimeout(() => {
        console.log('✅ 状态重置完成，页面已就绪');
      }, 100);

    } catch (error) {
      console.error('❌ 保存失败:', error);
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('确定要删除这个愿望吗？')) {
      return;
    }

    const { deleteCard } = useGoalCards.getState();
    deleteCard(id);

    if (isLoggedIn) {
      const supabase = createClient();
      const { error } = await supabase
        .from('goal_cards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('删除失败:', error);
      }
    }

    const latestCards = useGoalCards.getState().getAllCardsSortedByDate();
    setWishCards(latestCards);
  };

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <TopNav locale={locale} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // AI 匹配中
  if (isMatching && goalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <TopNav locale={locale} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  🧠 AI 正在分析你的目标...
                </h3>
                <p className="text-gray-600">
                  识别目标类型 → 评估难度 → 匹配最佳 AI 助手
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI 对话界面
  if (showChat && goalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <TopNav locale={locale} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* AI 匹配信息（Phase 3 新增） */}
            {matchResult && !goalData.viewOnly && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">目标类型</div>
                    <div className="font-semibold text-gray-900">
                      {matchResult.goalType.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      置信度: {(matchResult.goalType.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">难度评估</div>
                    <div className="font-semibold text-gray-900">
                      {matchResult.difficulty.level.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      评分: {matchResult.difficulty.score}/100
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">AI 助手</div>
                    <div className="font-semibold text-gray-900">
                      {matchResult.persona.emoji} {matchResult.persona.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {matchResult.persona.type}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI 对话卡片 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* 用户输入 */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 mb-2">你的目标</h3>
                <p className="text-lg font-semibold text-gray-900 mb-4">
                  {goalData.goalText}
                </p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>📅 {goalData.targetDate}</span>
                  <span>⏰ 距今 {goalData.days} 天</span>
                </div>
              </div>

              {/* AI 响应 */}
              <div className="border-t pt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-4">
                  {matchResult?.persona.emoji} {matchResult?.persona.name || 'AI'} 的建议
                </h3>
                
                {isGenerating ? (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>正在生成建议...</span>
                  </div>
                ) : (
                  <>
                    {/* 思考过程（可展开/收起）*/}
                    {aiThinking && (
                      <details className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <summary className="cursor-pointer font-medium text-gray-700 flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <span>🧠</span>
                          <span>AI 的思考过程</span>
                          <span className="text-xs text-gray-400 ml-auto">（点击展开）</span>
                        </summary>
                        <div className="mt-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap border-t border-gray-200 pt-4">
                          {aiThinking}
                        </div>
                      </details>
                    )}
                    
                    {/* AI 建议内容 */}
                    <div className="prose prose-blue max-w-none markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {aiResponse}
                      </ReactMarkdown>
                    </div>
                    
                    {/* Markdown 表格样式 */}
                    <style jsx>{`
                      .markdown-content :global(table) {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 1.5rem 0;
                        font-size: 0.875rem;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                        overflow: hidden;
                      }
                      .markdown-content :global(thead) {
                        background-color: #f3f4f6;
                      }
                      .markdown-content :global(th) {
                        padding: 0.75rem 1rem;
                        text-align: left;
                        font-weight: 600;
                        color: #374151;
                        border-bottom: 2px solid #e5e7eb;
                      }
                      .markdown-content :global(td) {
                        padding: 0.75rem 1rem;
                        border-bottom: 1px solid #e5e7eb;
                        color: #6b7280;
                      }
                      .markdown-content :global(tbody tr:last-child td) {
                        border-bottom: none;
                      }
                      .markdown-content :global(tbody tr:hover) {
                        background-color: #f9fafb;
                      }
                      .markdown-content :global(h2) {
                        font-size: 1.5rem;
                        font-weight: 700;
                        margin-top: 2rem;
                        margin-bottom: 1rem;
                        color: #111827;
                      }
                      .markdown-content :global(h3) {
                        font-size: 1.25rem;
                        font-weight: 600;
                        margin-top: 1.5rem;
                        margin-bottom: 0.75rem;
                        color: #1f2937;
                      }
                      .markdown-content :global(p) {
                        margin-bottom: 1rem;
                        line-height: 1.75;
                        color: #374151;
                      }
                      .markdown-content :global(ul), .markdown-content :global(ol) {
                        margin: 1rem 0;
                        padding-left: 1.5rem;
                      }
                      .markdown-content :global(li) {
                        margin: 0.5rem 0;
                        line-height: 1.75;
                        color: #374151;
                      }
                      .markdown-content :global(strong) {
                        font-weight: 600;
                        color: #111827;
                      }
                      .markdown-content :global(code) {
                        background-color: #f3f4f6;
                        padding: 0.125rem 0.375rem;
                        border-radius: 0.25rem;
                        font-size: 0.875em;
                        color: #e11d48;
                      }
                      .markdown-content :global(blockquote) {
                        border-left: 4px solid #3b82f6;
                        padding-left: 1rem;
                        margin: 1rem 0;
                        color: #6b7280;
                        font-style: italic;
                      }
                    `}</style>
                  </>
                )}
              </div>

              {/* 完成按钮 */}
              {!goalData.viewOnly && aiResponse && !isGenerating && (
                <div className="mt-8 pt-8 border-t">
                  <button
                    onClick={() => handleChatComplete(aiResponse, aiResponse.substring(0, 200))}
                    disabled={isSaving}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>保存中...</span>
                      </>
                    ) : (
                      '完成'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 愿望清单
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <TopNav locale={locale} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          我的愿望清单
        </h1>

        {wishCards.length === 0 ? (
          <EmptyWishlist locale={locale} />
        ) : (
          <div className="space-y-6">
            {wishCards.map((card) => (
              <WishCard
                key={card.id}
                id={card.id}
                goalText={card.content.goalText}
                targetDate={card.content.targetDate}
                days={card.content.daysCount || 0}
                workingDays={card.content.workingDaysCount}
                assistant={(card.content as any).aiAssistant || 'companion'}
                aiAnalysis={(card.content as any).aiAnalysis || ''}
                aiSummary={(card.content as any).aiSummary || ''}
                aiGeneratedImageUrl={(card.content as any).aiGeneratedImageUrl}
                createdAt={card.createdAt}
                onDelete={handleDeleteCard}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WishlistPage({ params }: WishlistPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <WishlistContent locale={params.locale} />
    </Suspense>
  );
}

