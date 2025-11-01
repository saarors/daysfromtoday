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

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import { EmptyWishlist } from '@/components/v3/Wishlist/EmptyWishlist';
import { WishCard } from '@/components/v3/Wishlist/WishCard';
// Phase 3.5: 不再使用 localStorage，纯 Supabase
// import { useGoalCards } from '@/store/goal-cards';
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
  const [aiThinking, setAiThinking] = useState<string | null>(null); // AI 思考过程
  const [aiIntroText, setAiIntroText] = useState<string>(''); // AI 介绍文案

  // 显示状态
  const [wishCards, setWishCards] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  // Phase 3.5: 从 Supabase 加载卡片数据（替代 localStorage）
  useEffect(() => {
    const loadCardsFromSupabase = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      setIsLoggedIn(!!session);
      
      if (session) {
        // 用户已登录，从 Supabase 加载数据
        console.log('📊 从 Supabase 加载愿望卡片...');
        const { data: dbCards, error } = await supabase
          .from('goal_cards')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('❌ 加载卡片失败:', error.message);
        } else {
          console.log(`✅ 加载了 ${dbCards?.length || 0} 张卡片`);
          // 转换 Supabase 数据格式到前端格式
          const formattedCards = (dbCards || []).map(card => ({
            id: card.id,
            templateId: card.template_id,
            targetDate: card.target_date,
            cardType: card.card_type as 'future' | 'past',
            calculationMode: 'date-first' as const,
            daysType: 'natural' as const,
            // 构建 content 对象（从平铺的字段）
            content: {
              goalText: card.goal_text,
              targetDate: card.target_date,
              daysCount: card.days_count,
              workingDaysCount: 0, // Phase 3 暂时不支持工作日计算
              aiAnalysis: card.ai_analysis,
              aiPersona: card.ai_persona_code,
              aiPersonaName: '', // 从 matching_metadata 或 ai_personas 表获取
              matchedGoalType: card.goal_type_code,
              detectedDifficulty: card.detected_difficulty,
            },
            // Phase 3 新字段
            goalTypeCode: card.goal_type_code,
            detectedDifficulty: card.detected_difficulty,
            aiPersonaCode: card.ai_persona_code,
            matchingMetadata: card.matching_metadata,
            createdAt: card.created_at,
            updatedAt: card.updated_at,
          }));
          setWishCards(formattedCards);
        }
      } else {
        // 用户未登录，显示空列表（不再使用 localStorage）
        console.log('⚠️ 用户未登录，显示空列表');
        setWishCards([]);
      }
      
      setIsLoading(false);
    };
    
    loadCardsFromSupabase();
  }, []); // 只在组件挂载时执行一次

  useEffect(() => {
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
        const card = wishCards.find(c => c.id === cardId);
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
        setAiResponse('');
        setAiThinking(null);
        setShowChat(false);
      }
    }
  }, [searchParams]);

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
      
      // 增加超时保护到 20 秒（考虑 Supabase 查询 10 秒 + AI 匹配逻辑 + 网络延迟）
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('匹配超时（20秒）')), 20000)
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

      // 2. 生成 AI 介绍文案
      await generateAIIntro(goalText, result);

      // 3. 短暂延迟后显示对话界面
      setTimeout(() => {
        setIsMatching(false);
        setShowChat(true);
        // 4. 立即调用 AI API 生成建议
        generateAIResponse(goalText, daysCount, targetDate, result);
      }, 1000);

    } catch (error: any) {
      // 降级处理：如果超时，使用默认配置继续
      console.warn('⚠️ AI 匹配超时，使用默认配置:', error.message);
      
      // 使用默认的匹配结果（通用型 + 教练型）
      const fallbackResult: CompleteAIMatchResult = {
        goalType: { 
          code: 'general', 
          name: '通用型',
          confidence: 0.5,
          matchedKeywords: []
        },
        difficulty: {
          score: 50,
          level: 'medium',
          factors: {
            timeSpan: 50,
            complexity: 50,
            ambiguity: 50,
            challenge: 50
          }
        },
        persona: {
          code: 'coach',
          name: '教练型',
          type: 'core',
          emoji: '🎓',
          confidence: 0.5,
          reasoning: '默认配置（Supabase 超时）'
        },
        metadata: {
          language: 'zh',
          timestamp: new Date().toISOString(),
          fallbackUsed: true
        }
      };
      
      setMatchResult(fallbackResult);
      console.log('🔄 使用 fallback 配置:', fallbackResult);
      
      // 继续执行，不中断用户流程
      setTimeout(() => {
        setIsMatching(false);
        setShowChat(true);
        // 降级方案：使用默认配置
        generateAIResponse(goalText, daysCount, targetDate, fallbackResult);
      }, 1000);
    }
  };

  /**
   * 生成 AI 助手介绍文案
   */
  const generateAIIntro = async (
    goalText: string,
    matchResult: CompleteAIMatchResult
  ) => {
    try {
      const response = await fetch('/api/ai/intro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalText,
          personaCode: matchResult.persona.code,
          personaName: matchResult.persona.characterName,
          personaType: matchResult.persona.name,
          language: locale
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI intro');
      }

      const data = await response.json();
      setAiIntroText(data.intro);
      console.log('✅ AI 介绍文案生成完成:', data.intro);
    } catch (error) {
      console.error('❌ AI 介绍文案生成失败:', error);
      // 使用默认文案
      const defaultIntro = `我为你匹配了一位【${matchResult.persona.name}】的助手，他的名字叫${matchResult.persona.characterName}。`;
      setAiIntroText(defaultIntro);
    }
  };

  /**
   * 调用 DeepSeek API 生成 AI 建议（流式输出，优化版：自然流式渐进）
   */
  const generateAIResponse = async (
    goalText: string,
    daysCount: number,
    targetDate: string,
    matchResult: CompleteAIMatchResult | null
  ) => {
    setIsGenerating(true);
    setAiThinking(''); // 清空思考过程
    setAiResponse(''); // 清空回复内容

    try {
      const response = await fetch('/api/ai/chat/stream', {
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

      // 读取流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let buffer = '';
      let thinkingBuffer = '';
      let contentBuffer = '';
      
      // 优化：使用更大的缓冲区，减少更新频率
      let thinkingChunkBuffer = '';
      let contentChunkBuffer = '';
      const CHUNK_SIZE = 50; // 每 50 个字符更新一次（约 2-3 个词）
      const UPDATE_INTERVAL = 80; // 最小更新间隔 80ms（约 12 次/秒）
      let lastUpdateTime = 0;

      const flushUpdate = (force = false) => {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateTime;
        
        // 只有满足以下条件之一才更新：
        // 1. 强制更新（流结束）
        // 2. 缓冲区足够大
        // 3. 距离上次更新已经超过最小间隔
        const shouldUpdate = force || 
                            thinkingChunkBuffer.length >= CHUNK_SIZE ||
                            contentChunkBuffer.length >= CHUNK_SIZE ||
                            timeSinceLastUpdate >= UPDATE_INTERVAL;
        
        if (shouldUpdate && (thinkingChunkBuffer || contentChunkBuffer)) {
          if (thinkingChunkBuffer) {
            thinkingBuffer += thinkingChunkBuffer;
            setAiThinking(thinkingBuffer);
            thinkingChunkBuffer = '';
          }
          if (contentChunkBuffer) {
            contentBuffer += contentChunkBuffer;
            setAiResponse(contentBuffer);
            contentChunkBuffer = '';
          }
          lastUpdateTime = now;
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // 确保最后的内容被更新
          flushUpdate(true);
          console.log('✅ 流读取完成');
          break;
        }

        // 解码数据块
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            try {
              const data = JSON.parse(dataStr);
              
              if (data.type === 'thinking') {
                // 思考过程 - 累加到缓冲区
                thinkingChunkBuffer += data.delta;
                flushUpdate();
              } else if (data.type === 'content') {
                // 主要内容 - 累加到缓冲区
                contentChunkBuffer += data.delta;
                flushUpdate();
              } else if (data.type === 'done') {
                console.log('✅ 收到完成信号');
              }
            } catch (e) {
              console.error('解析 SSE 数据失败:', e, dataStr);
            }
          }
        }
      }

      // 流读取完成，关闭加载状态
      setIsGenerating(false);
      
      console.log('✅ AI 生成完成:', {
        thinkingLength: thinkingBuffer.length,
        contentLength: contentBuffer.length
      });

    } catch (error) {
      console.error('❌ AI 生成失败:', error);
      setAiResponse('抱歉，AI 服务暂时不可用。请稍后再试。');
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
      // 检查是否已存在相同的卡片（避免双重提交）
      const isDuplicate = wishCards.some(card => 
        card.content.goalText === goalData.goalText &&
        card.content.targetDate === goalData.targetDate &&
        card.content.daysCount === goalData.days
      );

      if (isDuplicate) {
        console.log('⚠️ 检测到重复卡片，跳过保存');
        savingRef.current = false;
        setIsSaving(false);
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

      // Phase 3.5: 直接保存到 Supabase（不再使用 localStorage）
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('❌ 用户未登录，无法保存');
        alert('请先登录后再保存愿望卡片');
        savingRef.current = false;
        setIsSaving(false);
        return;
      }

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
        alert('保存失败，请重试');
        savingRef.current = false;
        setIsSaving(false);
        return;
      }
      
      console.log('✅ 已同步到数据库');

      console.log('✅ Save complete, resetting state...');
      console.log('🔄 准备清空状态并刷新页面...');

      // 🔥 关键修复：立即清空所有匹配状态和 goalData
      setGoalData(null);
      setMatchResult(null);
      setIsMatching(false);
      setIsGenerating(false);
      setAiResponse('');
      setAiThinking(null);
      savingRef.current = false;
      setIsSaving(false);

      // Phase 3.5: 从 Supabase 重新加载卡片列表
      const { data: dbCards } = await supabase
        .from('goal_cards')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (dbCards) {
        const formattedCards = dbCards.map(card => ({
          id: card.id,
          templateId: card.template_id,
          targetDate: card.target_date,
          cardType: card.card_type as 'future' | 'past',
          calculationMode: 'date-first' as const,
          daysType: 'natural' as const,
          // 构建 content 对象（从平铺的字段）
          content: {
            goalText: card.goal_text,
            targetDate: card.target_date,
            daysCount: card.days_count,
            workingDaysCount: 0,
            aiAnalysis: card.ai_analysis,
            aiPersona: card.ai_persona_code,
            aiPersonaName: '',
            matchedGoalType: card.goal_type_code,
            detectedDifficulty: card.detected_difficulty,
          },
          goalTypeCode: card.goal_type_code,
          detectedDifficulty: card.detected_difficulty,
          aiPersonaCode: card.ai_persona_code,
          matchingMetadata: card.matching_metadata,
          createdAt: card.created_at,
          updatedAt: card.updated_at,
        }));
        setWishCards(formattedCards);
        console.log('📋 已刷新卡片列表，当前数量:', formattedCards.length);
      }

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

    // Phase 3.5: 直接从 Supabase 删除（不再使用 localStorage）
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert('请先登录');
      return;
    }

    const { error } = await supabase
      .from('goal_cards')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('❌ 删除失败:', error);
      alert('删除失败，请重试');
      return;
    }

    // 从 UI 中移除
    setWishCards(prev => prev.filter(card => card.id !== id));
    console.log('✅ 卡片已删除');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <TopNav locale={locale} />
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-blue-100">
              <div className="text-center space-y-6">
                {/* 科技感 AI 动画 */}
                <div className="relative w-24 h-24 mx-auto">
                  {/* 外圈旋转 */}
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                  {/* 中圈反向旋转 */}
                  <div className="absolute inset-2 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin-reverse"></div>
                  {/* 内圈脉动 */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse flex items-center justify-center">
                    <span className="text-2xl">🧠</span>
                  </div>
                  {/* 扫描线效果 */}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20"></div>
                </div>

                {/* 标题 */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI 正在分析你的目标
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>深度学习中</span>
                  </div>
                </div>

                {/* 分析步骤 */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-left bg-blue-50/50 rounded-xl p-3 transform transition-all duration-500 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <span className="text-gray-700">识别目标类型</span>
                    <div className="ml-auto flex gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left bg-purple-50/50 rounded-xl p-3 transform transition-all duration-500 animate-fade-in" style={{animationDelay: '200ms'}}>
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <span className="text-gray-700">评估难度等级</span>
                    <div className="ml-auto flex gap-1">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '100ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '250ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left bg-indigo-50/50 rounded-xl p-3 transform transition-all duration-500 animate-fade-in" style={{animationDelay: '400ms'}}>
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <span className="text-gray-700">匹配最佳 AI 助手</span>
                    <div className="ml-auto flex gap-1">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '350ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '500ms'}}></div>
                    </div>
                  </div>
                </div>

                {/* 底部提示 */}
                <p className="text-xs text-gray-400 pt-4">
                  基于 DeepSeek-R1 驱动 · 预计 2-5 秒
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overscroll-none">
        <TopNav locale={locale} />
        {/* 添加顶部间距，避免被固定导航遮挡 */}
        <div className="pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* AI 对话界面 - ChatGPT 风格 */}
            <div className="space-y-6">
              {/* 用户消息气泡 */}
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-blue-50 border border-blue-200 rounded-2xl rounded-tr-sm p-4 shadow-sm">
                  <div className="mb-3">
                    <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap text-gray-900">
                      {goalData.goalText}
                    </p>
                  </div>
                  {/* 标签式日期 */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      距今 {goalData.days} 天
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      达成日期 {goalData.targetDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI 助手介绍环节 */}
              {matchResult && !goalData.viewOnly && !isMatching && aiIntroText && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-5 border border-purple-200 shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                      <span className="inline-block mr-2">✨</span>
                      {aiIntroText}
                      <span className="inline-block ml-1">🎯</span>
                    </p>
                  </div>
                </div>
              )}

              {/* AI 响应气泡 */}
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  {/* AI 头像和名称 */}
                  <div className="flex items-center gap-3 mb-3 ml-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl shadow-md border-2 border-white">
                      {matchResult?.persona.emoji || '🤖'}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      {/* 显示人物名字（如：艾力）*/}
                      <span className="text-lg font-bold text-gray-900">
                        {matchResult?.persona.characterName || matchResult?.persona.name || 'AI 助手'}
                      </span>
                      {/* 显示类型（如：教练型）*/}
                      <span className="text-xs text-gray-500">
                        （{matchResult?.persona.name || '助手'}）
                      </span>
                    </div>
                  </div>
                  
                  {/* AI 消息内容 */}
                  <div className="bg-white rounded-2xl rounded-tl-sm p-5 shadow-md border border-gray-100 will-change-contents">
                    {/* 思考过程（可展开/收起）*/}
                    {aiThinking && (
                      <details className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <summary className="cursor-pointer font-medium text-gray-700 flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <span>🧠</span>
                          <span>思考过程</span>
                          {isGenerating && (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 ml-2"></div>
                          )}
                          <span className="text-xs text-gray-400 ml-auto">（点击展开）</span>
                        </summary>
                        <div className="mt-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap border-t border-gray-200 pt-4">
                          {aiThinking}
                        </div>
                      </details>
                    )}
                    
                    {/* AI 建议内容 */}
                    {aiResponse ? (
                      <div className="prose prose-blue max-w-none markdown-content min-h-[100px]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {aiResponse}
                        </ReactMarkdown>
                        {/* 生成中的光标效果 */}
                        {isGenerating && (
                          <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>
                        )}
                      </div>
                    ) : isGenerating ? (
                      <div className="flex items-center gap-3 text-gray-600 min-h-[100px]">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span>正在思考和生成建议...</span>
                      </div>
                    ) : null}
                  </div>
                </div>
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
            </div>

            {/* 完成按钮 - 独立在对话框外 */}
            {!goalData.viewOnly && aiResponse && !isGenerating && (
              <div className="mt-6">
                <button
                  onClick={() => handleChatComplete(aiResponse, aiResponse.substring(0, 200))}
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>保存中...</span>
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>完成并保存到愿望清单</span>
                    </>
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
        <div className="max-w-4xl mx-auto">
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

