'use client';

/**
 * 愿望清单页面 V3 - 集成 AI 智能匹配系统
 * 
 * 新功能：
 * - 自动识别目标类型
 * - 显示难度评估
 * - AI 人格智能匹配
 * - 调用真实 AI API
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import TopNav from '@/components/TopNav';
import { EmptyWishlist } from '@/components/v3/Wishlist/EmptyWishlist';
import { WishCard } from '@/components/v3/Wishlist/WishCard';
import { useStreamingBuffer } from '@/hooks/useStreamingBuffer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Phase 3.5: 不再使用 localStorage，纯 Supabase
// import { useGoalCards } from '@/store/goal-cards';
import { createClient } from '@/lib/supabase/client';
import { matchGoalToAI } from '@/lib/ai-matching';
import type { CompleteAIMatchResult } from '@/lib/ai-matching';
import { getAssistant } from '@/lib/ai-assistants';
import type { AIAssistantType } from '@/types/ai-assistant';

// WishlistPageProps no longer needed (using client-side locale detection)

function WishlistContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();

  // 从 URL 获取参数
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
  const [aiIntroText, setAiIntroText] = useState<string>(''); // AI 介绍文案
  
  // V3.1 新增: 动态任务列表
  const [dynamicTasks, setDynamicTasks] = useState<string[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  
  // 渐次显示状态控制
  const [showUserGoal, setShowUserGoal] = useState(false); // 用户目标卡
  const [showMatchingIntro, setShowMatchingIntro] = useState(false); // AI匹配介绍
  
  // 使用流式输出 hook
  const streaming = useStreamingBuffer();
  
  // viewOnly 模式的静态内容(不使用流式缓冲区)
  const [viewOnlyContent, setViewOnlyContent] = useState<string>('');

  // 显示状态
  const [wishCards, setWishCards] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const generatingRef = useRef(false); // 防止并发生成

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
      
      // 🔥 防止重复匹配：如果正在匹配中，跳过
      if (isMatching) {
        console.log('⚠️ AI 匹配正在进行中，跳过重复调用');
        return;
      }

      let existingAnalysis: string | undefined;
      
      // 如果是查看模式，从卡片中读取已有的 AI 分析
      if (viewOnly === 'true' && cardId && wishCards.length > 0) {
        const card = wishCards.find(c => c.id === cardId);
        if (card) {
          existingAnalysis = (card.content as any).aiAnalysis;
          console.log('🔍 从数据库读取的 aiAnalysis 长度:', existingAnalysis?.length);
          console.log('🔍 aiAnalysis 最后100个字符:', existingAnalysis?.slice(-100));
        }
      }
      
      // hasNewGoal state was removed (not used)
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
        // 查看模式:从卡片中恢复匹配结果
        if (cardId && wishCards.length > 0) {
          const card = wishCards.find(c => c.id === cardId);
          if (card) {
            // 从卡片数据恢复matchResult
            const personaCode = card.aiPersonaCode || 'companion';
            const persona = getAssistant(personaCode as AIAssistantType);
            
            // 构建matchResult对象
            const restoredMatchResult: CompleteAIMatchResult = {
              goalType: {
                code: card.goalTypeCode || 'general',
                name: card.goalTypeCode || '通用目标',
                description: '',
                matchedKeywords: [],
                confidence: 0.8,
              },
              difficulty: {
                level: card.detectedDifficulty || 'medium',
                score: 0.5,
                reasoning: '',
              },
              persona: {
                code: personaCode,
                name: persona.name,
                characterName: persona.name,
                emoji: persona.emoji,
                color: persona.color,
                description: persona.description,
                reasoning: '',
              },
              metadata: {
                timestamp: card.createdAt,
                language: 'zh',
                processingTimeMs: 0,
              },
            };
            
            setMatchResult(restoredMatchResult);
            
            // V3.1.1: 恢复动态任务列表
            if (card.matchingMetadata?.task_list && Array.isArray(card.matchingMetadata.task_list)) {
              console.log('📋 viewOnly模式: 恢复任务列表', card.matchingMetadata.task_list);
              setDynamicTasks(card.matchingMetadata.task_list);
            }
          }
        }
        
        // 查看模式:直接显示对话界面(不使用流式输出)
        setShowChat(true);
        setShowUserGoal(true); // 立即显示用户目标卡
        setShowMatchingIntro(true); // 立即显示AI响应区域
        // 使用已有的分析内容 - 直接设置到viewOnlyContent,不走流式缓冲区
        if (existingAnalysis) {
          console.log('📄 viewOnly模式: 设置静态内容', {
            length: existingAnalysis.length,
            end: existingAnalysis.slice(-50),
            hasThinkTag: existingAnalysis.includes('<think>'),
            thinkContent: existingAnalysis.match(/<think>([\s\S]*?)<\/think>/)?.[1]?.slice(0, 100)
          });
          setViewOnlyContent(existingAnalysis);
        }
      }
    } else if (!days && !targetDate && !goalText) {
      // 🔥 如果 URL 参数为空，确保清空所有状态
      if (goalData !== null) {
        console.log('✅ URL 参数为空，清空所有目标相关状态');
        setGoalData(null);
        setMatchResult(null);
        setIsMatching(false);
        streaming.reset();
        setShowChat(false);
        setShowUserGoal(false);
        setShowMatchingIntro(false);
      }
    }
  }, [searchParams]);

  // 专门处理 viewOnly 模式下需要等待 wishCards 加载的情况
  useEffect(() => {
    const viewOnly = searchParams.get('viewOnly');
    const cardId = searchParams.get('cardId');
    
    // 只在 viewOnly 模式 且 wishCards 刚加载完成 且 还没有 matchResult 时执行
    if (viewOnly === 'true' && cardId && wishCards.length > 0 && !matchResult && !isLoading) {
      const card = wishCards.find(c => c.id === cardId);
      if (card) {
        console.log('🔄 viewOnly模式: 从卡片恢复matchResult', { cardId, personaCode: card.aiPersonaCode });
        
        const personaCode = card.aiPersonaCode || 'companion';
        const persona = getAssistant(personaCode as AIAssistantType);
        
        const restoredMatchResult: CompleteAIMatchResult = {
          goalType: {
            code: card.goalTypeCode || 'general',
            name: card.goalTypeCode || '通用目标',
            description: '',
            matchedKeywords: [],
            confidence: 0.8,
          },
          difficulty: {
            level: card.detectedDifficulty || 'medium',
            score: 0.5,
            reasoning: '',
          },
          persona: {
            code: personaCode,
            name: persona.name,
            characterName: persona.name,
            emoji: persona.emoji,
            color: persona.color,
            description: persona.description,
            reasoning: '',
          },
          metadata: {
            timestamp: card.createdAt,
            language: 'zh',
            processingTimeMs: 0,
          },
        };
        
        setMatchResult(restoredMatchResult);
        
        // 🔥 同时设置 viewOnlyContent
        const aiAnalysis = (card.content as any).aiAnalysis;
        if (aiAnalysis) {
          console.log('📄 viewOnly模式(useEffect): 设置静态内容', {
            length: aiAnalysis.length,
            end: aiAnalysis.slice(-50)
          });
          setViewOnlyContent(aiAnalysis);
        }
      }
    }
  }, [wishCards, searchParams, matchResult, isLoading, viewOnlyContent]);

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

      // 3. V3.1 新增: 生成动态任务列表
      await generateTaskList(goalText, daysCount, result);

      // 4. 直接显示对话界面,不再跳转独立页面
      setIsMatching(false);
      setShowChat(true);
      
      // 5. 渐次显示效果
      setTimeout(() => setShowUserGoal(true), 100); // 先显示用户目标卡
      setTimeout(() => {
        setShowMatchingIntro(true); // 再显示AI匹配介绍
        // 6. 立即调用 AI API 生成建议
        generateAIResponse(goalText, daysCount, targetDate, result);
      }, 800);

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
          characterName: '默认助手',
          type: 'core' as const,
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
      setIsMatching(false);
      setShowChat(true);
      
      // 渐次显示效果（降级方案）
      setTimeout(() => setShowUserGoal(true), 100);
      setTimeout(() => {
        setShowMatchingIntro(true);
        // 降级方案：使用默认配置
        generateAIResponse(goalText, daysCount, targetDate, fallbackResult);
      }, 800);
    }
  };

  /**
   * V3.1 新增: 生成动态任务列表
   */
  const generateTaskList = async (
    goalText: string,
    daysCount: number,
    matchResult: CompleteAIMatchResult
  ) => {
    if (tasksLoading) {
      console.log('⚠️ 任务列表正在生成中，跳过重复调用');
      return;
    }
    
    setTasksLoading(true);
    console.log('🎯 开始生成动态任务列表...');
    
    try {
      const response = await fetch('/api/ai/task-decomposition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalText,
          goalType: matchResult.goalType.code || 'general',
          difficulty: matchResult.difficulty.level || 'medium',
          days: daysCount,
          language: locale
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.data.tasks && data.data.tasks.length > 0) {
        console.log('✅ 动态任务列表生成成功:', data.data.tasks);
        setDynamicTasks(data.data.tasks);
        
        // 可选：显示方法论信息
        if (data.data.methodology) {
          console.log('📚 匹配方法论:', data.data.methodology.name);
        }
      } else {
        // 降级：使用通用任务
        console.warn('⚠️ 任务生成失败，使用默认任务');
        setDynamicTasks(getDefaultTasks());
      }
      
    } catch (error) {
      console.error('❌ 任务生成错误:', error);
      // 降级到默认任务
      setDynamicTasks(getDefaultTasks());
    } finally {
      setTasksLoading(false);
    }
  };

  /**
   * 获取默认任务列表（降级方案）
   */
  const getDefaultTasks = (): string[] => {
    return [
      '理解目标背景与动机',
      '评估时间与资源约束',
      '构建推理链与策略',
      '生成个性化建议',
      '提炼实战技巧'
    ];
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
   * 调用 AI API 生成建议（简化版 - 直接流式输出）
   */
  const generateAIResponse = async (
    goalText: string,
    daysCount: number,
    targetDate: string,
    matchResult: CompleteAIMatchResult | null
  ) => {
    // 使用 ref 防止并发调用（比 state 更可靠）
    if (generatingRef.current) {
      console.log('⚠️ AI 正在生成中，跳过重复调用');
      return;
    }
    
    generatingRef.current = true;
    console.log('🚀 开始 AI 生成，锁定状态');
    
    // 重置流式缓冲区
    streaming.reset();
    streaming.startStreaming();

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
      let fullText = ''; // 累积完整文本用于解析<think>标签
      let insideThinking = false;
      let pendingText = '';

      while (true) {
        const { done, value} = await reader.read();
        if (done) {
          console.log('✅ 流读取完成');
          
          // 🔥 关键修复: 确保所有剩余内容都被输出
          if (pendingText) {
            console.log('📤 输出剩余缓冲内容:', pendingText.length, '字符');
            if (insideThinking) {
              streaming.appendChunk('thinking', pendingText);
            } else {
              streaming.appendChunk('content', pendingText);
            }
            pendingText = ''; // 清空缓冲
          }
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
              
              if (data.type === 'done') {
                console.log('✅ 收到完成信号');
              } else if (data.delta) {
                // 累积文本用于解析<think>标签
                fullText += data.delta;
                pendingText += data.delta;

                // 检查是否包含<think>或</think>标签
                if (pendingText.includes('<think>')) {
                  const parts = pendingText.split('<think>');
                  console.log('🔍 检测到 <think> 标签');
                  // 输出<think>之前的内容
                  if (parts[0]) {
                    streaming.appendChunk('content', parts[0]);
                  }
                  insideThinking = true;
                  pendingText = parts[1] || '';
                  console.log('🧠 进入 thinking 模式');
                } else if (pendingText.includes('</think>')) {
                  const parts = pendingText.split('</think>');
                  console.log('🔍 检测到 </think> 标签');
                  // 输出</think>之前的内容(thinking部分)
                  if (parts[0]) {
                    streaming.appendChunk('thinking', parts[0]);
                    console.log('📝 输出 thinking 内容:', parts[0].length, '字符');
                  }
                  insideThinking = false;
                  pendingText = parts[1] || '';
                  console.log('📝 退出 thinking 模式');
                  // 输出</think>之后的内容
                  if (pendingText) {
                    streaming.appendChunk('content', pendingText);
                    pendingText = '';
                  }
                } else {
                  // 🔥 最激进策略: 不设任何缓冲限制,直接实时输出所有内容
                  // 只在标签可能出现的位置保留最少字符
                  const minKeep = 10; // 仅保留10个字符用于标签检测
                  
                  // 立即输出,不等待累积
                  if (pendingText.length > minKeep) {
                    const toOutput = pendingText.slice(0, -minKeep);
                    if (toOutput.length > 0) {
                      if (insideThinking) {
                        streaming.appendChunk('thinking', toOutput);
                      } else {
                        streaming.appendChunk('content', toOutput);
                      }
                    }
                    pendingText = pendingText.slice(-minKeep);
                  }
                }
              }
            } catch (e) {
              console.error('解析 SSE 数据失败:', e, dataStr);
            }
          }
        }
      }

      // 🔥 二次检查: 确保buffer中没有残留数据
      if (buffer.trim()) {
        console.log('⚠️ 检测到残留buffer数据:', buffer.length, '字符');
        try {
          const remainingLines = buffer.split('\n');
          for (const line of remainingLines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              const data = JSON.parse(dataStr);
              if (data.delta) {
                console.log('📤 输出残留数据:', data.delta.length, '字符');
                if (insideThinking) {
                  streaming.appendChunk('thinking', data.delta);
                } else {
                  streaming.appendChunk('content', data.delta);
                }
              }
            }
          }
        } catch (e) {
          console.error('❌ 处理残留数据失败:', e);
        }
      }
      
      // 流读取完成
      streaming.finishStreaming();
      
      // 使用 snapshot 获取最新内容
      const finalThinking = streaming.snapshotThinking();
      const finalContent = streaming.snapshotContent();
      
      console.log('✅ AI 生成完成:', {
        thinkingLength: finalThinking.length,
        contentLength: finalContent.length,
      });
      
      // 输出AI原始内容用于调试
      const timestamp = new Date().toISOString();
      console.log(`\n========== 🧠 AI 思维链 (${timestamp}) ==========`);
      console.log(finalThinking);
      console.log(`========== 🧠 AI 思维链 END ==========\n`);
      console.log(`\n========== 📝 AI 完整输出 (${timestamp}) ==========`);
      console.log(finalContent);
      console.log(`========== 📝 AI 完整输出 END (${timestamp}) ==========\n`);
      
      // 🔥 额外验证: 检查是否有内容丢失
      if (fullText.length > (finalThinking.length + finalContent.length + 50)) {
        console.warn('⚠️ 检测到可能的内容丢失!');
        console.warn('fullText总长度:', fullText.length);
        console.warn('thinking长度:', finalThinking.length);
        console.warn('content长度:', finalContent.length);
        console.warn('差异:', fullText.length - (finalThinking.length + finalContent.length));
      }

    } catch (error) {
      console.error('❌ AI 生成失败:', error);
      streaming.appendChunk('content', '抱歉，AI 服务暂时不可用。请稍后再试。');
      streaming.finishStreaming();
    } finally {
      // 解锁状态
      generatingRef.current = false;
      console.log('🔓 AI 生成结束，解锁状态');
    }
  };

  const handleChatComplete = async () => {
    if (savingRef.current || !goalData) {
      console.log('⚠️ 阻止重复保存');
      return;
    }

    // 🔥 直接从流式缓冲区获取内容(不再调用finishStreaming,因为AI生成完成时已经调用过了)
    // V3.1.1: 合并 thinking 和 content，保留 <think> 标签
    const thinkingContent = streaming.thinking || streaming.snapshotThinking();
    const mainContent = streaming.content || streaming.snapshotContent();
    
    // 如果有推理过程，用 <think> 标签包裹并合并
    const aiAnalysis = thinkingContent 
      ? `<think>\n${thinkingContent}\n</think>\n\n${mainContent}`
      : mainContent;
    
    const aiSummary = ''; // TODO: 从 AI 响应中提取摘要

    console.log('🔔 handleChatComplete called', {
      isSaving,
      savingRef: savingRef.current,
      goalData: !!goalData,
      streamingContentLength: streaming.content?.length || 0,
      snapshotContentLength: streaming.snapshotContent().length,
      aiAnalysisLength: aiAnalysis.length,
      aiAnalysisEnd: aiAnalysis.slice(-50) // 显示最后50个字符
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
          matching_metadata: {
            ...cardData.matchingMetadata,
            // V3.1.1: 添加动态任务列表
            task_list: dynamicTasks.length > 0 ? dynamicTasks : null,
          }
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
      setShowChat(false); // 关闭chat界面
      setShowUserGoal(false); // 重置用户目标显示
      setShowMatchingIntro(false); // 重置AI介绍显示
      streaming.reset();
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

  // 加载中或有目标数据时,不显示空愿望列表
  // 直接跳转到对话界面,避免闪现
  const shouldShowEmptyOrCards = !isLoading && !showChat && !goalData;

  // AI 对话界面
  if (showChat && goalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overscroll-none">
        <TopNav locale={locale} />
        {/* 添加顶部间距，避免被固定导航遮挡 */}
        <div className="pt-24">
        <div className="container mx-auto px-4 py-8 pb-32">
          <div className="max-w-4xl mx-auto">
            {/* AI 对话界面 - ChatGPT 风格 */}
            <div className="space-y-6">
              {/* 用户消息气泡 - 渐次显示 */}
              {showUserGoal && (
                <div className="flex justify-end animate-[slideUp_0.5s_ease-out]">
                  <div className="max-w-[85%] w-full bg-blue-50 border border-blue-200 rounded-2xl rounded-tr-sm p-4 shadow-sm">
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
              )}

              {/* AI 助手介绍环节 - 渐次显示 */}
              {showMatchingIntro && matchResult && !goalData.viewOnly && aiIntroText && (
                <div className="flex justify-start animate-[slideUp_0.5s_ease-out]">
                  <div className="max-w-[85%] w-full bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-5 border border-purple-200 shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                      <span className="inline-block mr-2">✨</span>
                      {aiIntroText}
                      <span className="inline-block ml-1">🎯</span>
                    </p>
                  </div>
                </div>
              )}

              {/* AI 响应气泡 - 合并思考和建议 */}
              {showMatchingIntro && (
                <div className="flex justify-start animate-[slideUp_0.5s_ease-out]">
                  <div className="max-w-[85%] w-full">
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
                          （{getAssistant(matchResult?.persona.code as AIAssistantType).type || '助手'}）
                        </span>
                      </div>
                    </div>
                    
                    {/* AI 消息内容 - 高度自适应 */}
                    <div className="bg-white rounded-2xl rounded-tl-sm shadow-md border border-gray-100">
                      <div className="p-5">
                        {/* 任务列表 - viewOnly 和非 viewOnly 模式都显示 */}
                        {((goalData?.viewOnly && dynamicTasks.length > 0) || (!goalData?.viewOnly && (streaming.isStreaming || streaming.thinking || streaming.snapshotThinking() || streaming.content || streaming.snapshotContent()))) && (
                          <ThinkingTaskList 
                            hasContent={!!(streaming.thinking || streaming.content || goalData?.viewOnly)}
                            dynamicTasks={dynamicTasks}
                            isLoading={tasksLoading}
                          />
                        )}
                        
                        {/* AI 思考过程（折叠显示在任务列表下方）- viewOnly 和非 viewOnly 模式都显示 */}
                        {((goalData?.viewOnly && viewOnlyContent) || (!goalData?.viewOnly && (streaming.thinking || streaming.snapshotThinking()))) && (
                          <div className="bg-purple-50/30 rounded-xl p-4 mb-3 border border-purple-200/50">
                            <div className="flex items-center gap-2 mb-1.5">
                              {/* V3.1 优化: 灯泡图标（建议思路） */}
                              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              <span className="text-sm font-medium text-purple-900">
                                AI 的建议思路
                              </span>
                            </div>
                            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                              {goalData?.viewOnly 
                                ? viewOnlyContent.match(/<think>([\s\S]*?)<\/think>/)?.[1]?.trim() || '暂无推理过程'
                                : (streaming.thinking || streaming.snapshotThinking())
                              }
                            </div>
                          </div>
                        )}
                        
                        {/* AI 建议内容 */}
                        {/* viewOnly模式: 直接显示完整内容,不走流式缓冲区 */}
                        {goalData?.viewOnly && viewOnlyContent && (
                          <div className="pt-2">
                            <StreamingPanel
                              title=""
                              description=""
                              isStreaming={false}
                              content={viewOnlyContent.replace(/<think>[\s\S]*?<\/think>\s*/g, '')}
                            />
                          </div>
                        )}
                        
                        {/* 非viewOnly模式: 使用流式输出 */}
                        {!goalData?.viewOnly && (streaming.content || streaming.snapshotContent()) && (
                          <div className="pt-2">
                            <StreamingPanel
                              title=""
                              description=""
                              isStreaming={streaming.isStreaming}
                              content={streaming.content || streaming.snapshotContent()}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CSS 动画与样式 */}
              <style jsx global>{`
                      /* 渐次显示动画 */
                      @keyframes slideUp {
                        from {
                          opacity: 0;
                          transform: translateY(20px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                      
                      /* Markdown表格样式 */
                      .markdown-content table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        margin: 1.5rem 0 !important;
                        font-size: 0.875rem !important;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
                        border-radius: 8px !important;
                        overflow: hidden !important;
                        display: table !important;
                      }
                      .markdown-content thead {
                        background-color: #f3f4f6 !important;
                      }
                      .markdown-content th {
                        padding: 0.75rem 1rem !important;
                        text-align: left !important;
                        font-weight: 600 !important;
                        color: #374151 !important;
                        border-bottom: 2px solid #e5e7eb !important;
                      }
                      .markdown-content td {
                        padding: 0.75rem 1rem !important;
                        border-bottom: 1px solid #e5e7eb !important;
                        color: #6b7280 !important;
                      }
                      .markdown-content tbody tr:last-child td {
                        border-bottom: none !important;
                      }
                      .markdown-content tbody tr:hover {
                        background-color: #f9fafb !important;
                        transition: background-color 0.15s ease !important;
                      }
                      .markdown-content h2 {
                        font-size: 1.5rem !important;
                        font-weight: 700 !important;
                        margin-top: 2rem !important;
                        margin-bottom: 1rem !important;
                        color: #111827 !important;
                      }
                      .markdown-content h3 {
                        font-size: 1.25rem !important;
                        font-weight: 600 !important;
                        margin-top: 1.5rem !important;
                        margin-bottom: 0.75rem !important;
                        color: #1f2937 !important;
                      }
                      .markdown-content p {
                        margin-bottom: 1rem !important;
                        line-height: 1.75 !important;
                        color: #374151 !important;
                      }
                      .markdown-content ul, .markdown-content ol {
                        margin: 1rem 0 !important;
                        padding-left: 1.5rem !important;
                      }
                      .markdown-content li {
                        margin: 0.5rem 0 !important;
                        line-height: 1.75 !important;
                        color: #374151 !important;
                      }
                      .markdown-content strong {
                        font-weight: 600 !important;
                        color: #111827 !important;
                      }
                      .markdown-content code {
                        background-color: #f3f4f6 !important;
                        padding: 0.125rem 0.375rem !important;
                        border-radius: 0.25rem !important;
                        font-size: 0.875em !important;
                        color: #e11d48 !important;
                      }
                      .markdown-content blockquote {
                        border-left: 4px solid #3b82f6 !important;
                        padding-left: 1rem !important;
                        margin: 1rem 0 !important;
                        color: #6b7280 !important;
                        font-style: italic !important;
                      }
              `}</style>
            </div>

            {/* 完成按钮 - 独立在对话框外 */}
            {!goalData.viewOnly && (streaming.content || streaming.snapshotContent()) && !streaming.isStreaming && (
              <div className="mt-6">
                <button
                  onClick={() => handleChatComplete()}
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

  // 愿望清单 - 仅在没有对话界面时显示
  if (!shouldShowEmptyOrCards) {
    // 正在加载或正在对话中,不显示空愿望列表
    return null;
  }

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
                assistant={card.aiPersonaCode || 'companion'}
                aiAnalysis={card.content.aiAnalysis || ''}
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

// ============================================
// 前端不再对AI输出做任何修复处理
// 只负责准确渲染AI返回的Markdown内容
// ============================================

/**
 * 任务列表式推理进度组件 - 常驻显示版
 * @param hasContent - 是否有AI内容输出(用于加速任务完成)
 * @param dynamicTasks - V3.1 新增: 动态任务列表
 * @param isLoading - V3.1 新增: 任务是否正在加载
 */
function ThinkingTaskList({ 
  hasContent = false,
  dynamicTasks,
  isLoading = false
}: { 
  hasContent?: boolean;
  dynamicTasks?: string[];
  isLoading?: boolean;
}) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const hasCompletedRef = React.useRef(false); // 防止重复完成

  // 一旦AI内容出现,立即完成所有任务
  React.useEffect(() => {
    if (hasContent && !hasCompletedRef.current && currentStep < 5) {
      console.log('✨ AI内容出现,加速完成所有任务');
      setCurrentStep(5);
      hasCompletedRef.current = true;
    }
  }, [hasContent, currentStep]);

  // 正常的任务推进(仅在初始化时执行一次)
  React.useEffect(() => {
    if (hasCompletedRef.current) return; // 已加速完成,不再推进

    // 模拟任务逐步完成 - 快速推进
    const timers = [
      setTimeout(() => {
        if (!hasCompletedRef.current) setCurrentStep(1);
      }, 500),
      setTimeout(() => {
        if (!hasCompletedRef.current) setCurrentStep(2);
      }, 1500),
      setTimeout(() => {
        if (!hasCompletedRef.current) setCurrentStep(3);
      }, 3000),
      setTimeout(() => {
        if (!hasCompletedRef.current) setCurrentStep(4);
      }, 5000),
      setTimeout(() => {
        if (!hasCompletedRef.current) setCurrentStep(5);
      }, 8000),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []); // 🔥 仅初始化时执行一次

  // V3.1: 使用动态任务或默认任务
  const defaultTasks = [
    { id: 1, label: '理解目标背景与动机', desc: '分析目标类型、难度、用户意图' },
    { id: 2, label: '评估时间与资源约束', desc: '计算可用天数、识别关键挑战点' },
    { id: 3, label: '构建推理链与策略', desc: '设计分阶段计划、优先级排序' },
    { id: 4, label: '生成个性化建议', desc: '结合目标特点输出可行方案' },
    { id: 5, label: '提炼实战技巧', desc: '总结关键行动点与注意事项' },
  ];

  // 如果有动态任务，使用动态任务；否则使用默认任务
  const tasks = (dynamicTasks && dynamicTasks.length > 0)
    ? dynamicTasks.map((task, index) => ({
        id: index + 1,
        label: task,
        desc: '' // 动态任务不需要描述
      }))
    : defaultTasks;

  return (
    <div className="bg-gradient-to-r from-purple-50/30 via-blue-50/30 to-indigo-50/30 rounded-xl p-4 mb-4 border border-purple-100/50">
      {/* 标题 - V3.1 优化 */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-200/30">
        <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
        <span className="text-sm font-semibold text-purple-900">
          {isLoading 
            ? 'AI 助手正在规划你的任务…'
            : dynamicTasks && dynamicTasks.length > 0
            ? `你的任务可以分为 ${dynamicTasks.length} 个步骤`
            : currentStep >= 5 && !hasContent 
            ? 'AI 正在深度推理中' 
            : 'AI 深度思考'}
        </span>
        {(isLoading || currentStep < 5) && (
          <div className="ml-auto flex gap-1">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        )}
        {currentStep >= 5 && !hasContent && !isLoading && (
          <div className="ml-auto text-xs text-gray-500">
            AI 深度推理中,预计 30-60 秒
          </div>
        )}
      </div>

      {/* 任务列表 */}
      <div className="space-y-2">
        {tasks.map((task) => {
          const isCompleted = currentStep >= task.id;
          const isInProgress = currentStep + 1 === task.id;
          const isPending = currentStep + 1 < task.id;

          return (
            <div
              key={task.id}
              className="flex items-start gap-3 transition-all duration-500"
              style={{
                opacity: isPending ? 0.5 : 1,
              }}
            >
              {/* 状态图标 - 更规范的符号 */}
              <div className="flex-shrink-0 pt-0.5">
                {isCompleted ? (
                  // 已完成 - ✓ 绿色勾选
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shadow-sm">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isInProgress ? (
                  // 进行中 - ◉ 橙色脉动
                  <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center animate-pulse shadow-sm">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                ) : (
                  // 待处理 - ○ 灰色空心圆
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></div>
                )}
              </div>

              {/* 任务内容 - V3.1 优化 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <span className={`text-sm font-normal flex-1 ${
                    isCompleted ? 'text-gray-900' : 
                    isInProgress ? 'text-orange-700' : 
                    'text-gray-500'
                  }`}>
                    {/* V3.1: 显示完整任务文本（Prompt已限制40字） */}
                    {task.label}
                  </span>
                  {isInProgress && (
                    <span className="text-orange-600 text-xs px-2 py-0.5 bg-orange-50 rounded whitespace-nowrap flex-shrink-0 min-w-[52px] text-center">进行中</span>
                  )}
                  {isCompleted && (
                    <span className="text-teal-700 text-xs px-2 py-0.5 bg-teal-50 rounded whitespace-nowrap flex-shrink-0 min-w-[52px] text-center">已完成</span>
                  )}
                </div>
                {task.desc && (
                  <p className={`text-xs mt-0.5 ${
                    isCompleted ? 'text-gray-600' : 
                    isInProgress ? 'text-orange-600/80' : 
                    'text-gray-400'
                  }`}>
                    {task.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 当所有任务完成但还没有内容时,显示等待提示 - V3.1 优化 */}
      {currentStep >= 5 && !hasContent && (
        <div className="mt-3 pt-3 border-t border-purple-200/30 animate-pulse">
          <div className="flex items-start gap-2.5">
            {/* 转圈动画图标 */}
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            {/* 文字内容 - 增加行间距 */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-orange-700">AI 的建议思路</p>
              <p className="text-xs text-gray-600 leading-loose">
                AI 正在进行深度思考和多层推理,生成高质量建议通常需要 30-60 秒。请稍候,内容即将呈现...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 流式输出面板组件 - 简洁版
 * 专注于Markdown渲染,不做任何内容处理
 */
function StreamingPanel({
  title,
  description,
  isStreaming,
  content,
}: {
  title: string;
  description: string;
  isStreaming: boolean;
  content: string;
}) {
  return (
    <div className="markdown-content">
      {/* 直接渲染AI返回的原始Markdown */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

// 主页面组件 - 客户端组件
export default function WishlistPage() {
  // 从 pathname 获取 locale
  const pathname = usePathname();
  const locale = pathname ? pathname.split('/')[1] : 'zh';
  
  return <WishlistContent locale={locale} />;
}

