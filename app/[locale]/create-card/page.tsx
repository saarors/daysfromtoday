/**
 * 创建卡片页面（Phase 2.6）
 * 独立的卡片创建流程
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardTypeSelector } from '@/components/v3/CardTypeSelector';
import { CalculationModeToggle } from '@/components/v3/CalculationModeToggle';
import { DateCalculator } from '@/components/v3/DateCalculator';
import { GoalInput } from '@/components/v3/GoalInput';
import { TemplateSelector } from '@/components/v3/TemplateSelector';
import { CardPreview } from '@/components/v3/CardPreview';
import { useGoalCards } from '@/store/goal-cards';
import { allPresetTemplates } from '@/lib/preset-templates';
import { calculateDaysFromDate, calculateDateFromDays } from '@/lib/date-calculator';
import type { 
  CardType, 
  CalculationMode, 
  DaysType, 
  CardTemplate, 
  DateCalculationResult 
} from '@/types/card-template';
import { createClient } from '@/lib/supabase/client';

interface CreateCardPageProps {
  params: {
    locale: string;
  };
}

export default function CreateCardPage({ params }: CreateCardPageProps) {
  const { locale } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addCard } = useGoalCards();
  
  // URL参数（用于预填充）
  const urlType = searchParams.get('type') as CardType | null;
  const urlDays = searchParams.get('days');
  
  // 状态管理
  const [mounted, setMounted] = useState(false);
  const [cardType, setCardType] = useState<CardType>(urlType || 'future');
  const [calculationMode, setCalculationMode] = useState<CalculationMode>(
    urlDays ? 'days-first' : 'date-first'
  );
  const [daysType, setDaysType] = useState<DaysType>('natural');
  const [targetDate, setTargetDate] = useState('');
  const [days, setDays] = useState(urlDays ? parseInt(urlDays) : 30);
  const [goalText, setGoalText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(allPresetTemplates[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 计算相关状态
  const [calculationResult, setCalculationResult] = useState<DateCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 检查登录状态并监听变化
  useEffect(() => {
    setMounted(true);
    
    const supabase = createClient();
    
    // 初始检查
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 create-card 页面检查登录状态:', session ? '已登录' : '未登录', session?.user?.email);
      setIsLoggedIn(!!session);
    };
    
    checkAuth();
    
    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 create-card 页面检测到登录状态变化:', event, session?.user?.email);
      setIsLoggedIn(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 自动计算
  useEffect(() => {
    if (!mounted) return;

    const calculate = async () => {
      setIsCalculating(true);
      try {
        if (calculationMode === 'date-first' && targetDate) {
          const fullDate = targetDate.includes('T') ? targetDate : `${targetDate}T00:00:00.000Z`;
          const result = await calculateDaysFromDate(fullDate, 'US');
          setCalculationResult(result);
        } else if (calculationMode === 'days-first' && days > 0) {
          const adjustedDays = cardType === 'past' ? -days : days;
          const result = await calculateDateFromDays(adjustedDays, daysType, 'US');
          setCalculationResult(result);
        }
      } catch (error) {
        console.error('Calculation error:', error);
        setCalculationResult(null);
      } finally {
        setIsCalculating(false);
      }
    };

    calculate();
  }, [mounted, calculationMode, targetDate, days, daysType, cardType]);

  // 保存卡片
  const handleSave = async () => {
    if (!goalText.trim()) {
      alert(locale === 'zh' ? '请输入目标文字' : 'Please enter goal text');
      return;
    }

    setIsSaving(true);

    try {
      let finalResult = calculationResult;

      // 如果没有计算结果，立即计算
      if (!finalResult) {
        if (calculationMode === 'date-first' && targetDate) {
          const fullDate = targetDate.includes('T') ? targetDate : `${targetDate}T00:00:00.000Z`;
          finalResult = await calculateDaysFromDate(fullDate, 'US');
        } else if (calculationMode === 'days-first' && days > 0) {
          const adjustedDays = cardType === 'past' ? -days : days;
          finalResult = await calculateDateFromDays(adjustedDays, daysType, 'US');
        }
      }

      if (!finalResult) {
        alert(locale === 'zh' ? '日期计算失败，请重试' : 'Date calculation failed, please try again');
        setIsSaving(false);
        return;
      }

      // 创建卡片数据
      const newCard = addCard({
        templateId: selectedTemplate.id,
        cardType,
        calculationMode,
        daysType,
        content: {
          targetDate: finalResult.targetDate,
          daysCount: finalResult.naturalDays,
          workingDaysCount: finalResult.workingDays,
          goalText: goalText.trim(),
        },
      });

      // 如果已登录，同步到数据库
      if (isLoggedIn) {
        try {
          console.log('🔍 检测到用户已登录，准备同步到数据库...');
          const supabase = createClient();
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error('❌ 获取 session 失败:', sessionError);
            throw sessionError;
          }

          if (!session) {
            console.warn('⚠️ 没有有效的 session，跳过数据库同步');
            return;
          }

          console.log('📝 准备插入数据到 goal_cards 表:', {
            id: newCard.id,
            user_id: session.user.id,
            template_id: newCard.templateId,
            card_type: newCard.cardType,
            calculation_mode: newCard.calculationMode,
            days_type: newCard.daysType,
            goal_text: newCard.content.goalText,
            target_date: newCard.content.targetDate,
            days_count: newCard.content.daysCount,
            working_days_count: newCard.content.workingDaysCount,
          });

          const { data: insertedData, error: insertError } = await supabase
            .from('goal_cards')
            .insert({
              id: newCard.id,
              user_id: session.user.id,
              template_id: newCard.templateId,
              card_type: newCard.cardType,
              calculation_mode: newCard.calculationMode,
              days_type: newCard.daysType,
              target_date: newCard.content.targetDate,
              days_count: newCard.content.daysCount,
              working_days_count: newCard.content.workingDaysCount,
              goal_text: newCard.content.goalText,
              created_at: newCard.createdAt,
              updated_at: newCard.updatedAt,
            })
            .select();

          if (insertError) {
            console.error('❌ 数据库插入失败:', insertError);
            console.error('❌ 错误详情:', {
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint,
              code: insertError.code,
            });
            throw insertError;
          }

          console.log('✅ 数据库同步成功!', insertedData);
        } catch (error: any) {
          console.error('❌ 同步到数据库时发生异常:', error);
          console.error('❌ 异常详情:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
          // 不阻断流程，让用户至少能看到本地卡片
        }
      } else {
        console.log('📦 用户未登录，卡片仅保存到本地');
      }

      // 跳转到首页
      router.push(`/${locale}`);
    } catch (error) {
      console.error('Error saving card:', error);
      alert(locale === 'zh' ? '保存失败，请重试' : 'Save failed, please try again');
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) {
    return null;
  }

  const text = {
    en: {
      title: 'Create New Card',
      subtitle: 'Design your goal card in 3 simple steps',
      step1: 'Step 1: Choose Card Type',
      step2: 'Step 2: Set Date or Days',
      step3: 'Step 3: Write Your Goal',
      step4: 'Step 4: Choose Template',
      preview: 'Preview',
      save: 'Save Card',
      saving: 'Saving...',
      cancel: 'Cancel',
    },
    zh: {
      title: '创建新卡片',
      subtitle: '3个简单步骤设计你的目标卡片',
      step1: '步骤 1：选择卡片类型',
      step2: '步骤 2：设置日期或天数',
      step3: '步骤 3：写下你的目标',
      step4: '步骤 4：选择模板',
      preview: '预览',
      save: '保存卡片',
      saving: '保存中...',
      cancel: '取消',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  // 预览卡片数据
  const previewCard = calculationResult ? {
    id: 'preview',
    templateId: selectedTemplate.id,
    cardType,
    calculationMode,
    daysType,
    content: {
      targetDate: calculationResult.targetDate,
      daysCount: calculationResult.naturalDays,
      workingDaysCount: calculationResult.workingDays,
      goalText: goalText || (locale === 'zh' ? '在此输入你的目标...' : 'Enter your goal here...'),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：表单 */}
          <div className="space-y-6">
            {/* Step 1: 卡片类型 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4">{t.step1}</h3>
              <CardTypeSelector value={cardType} onChange={setCardType} locale={locale} />
            </div>

            {/* Step 2: 日期/天数 */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">{t.step2}</h3>
              <CalculationModeToggle
                value={calculationMode}
                onChange={setCalculationMode}
                locale={locale}
              />
              <DateCalculator
                calculationMode={calculationMode}
                daysType={daysType}
                onDaysTypeChange={setDaysType}
                targetDate={targetDate}
                onTargetDateChange={setTargetDate}
                days={days}
                onDaysChange={setDays}
                calculationResult={calculationResult}
                isCalculating={isCalculating}
                locale={locale}
              />
            </div>

            {/* Step 3: 目标文字 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4">{t.step3}</h3>
              <GoalInput value={goalText} onChange={setGoalText} locale={locale} />
            </div>

            {/* Step 4: 模板选择 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4">{t.step4}</h3>
              <TemplateSelector
                templates={allPresetTemplates}
                selectedId={selectedTemplate.id}
                onSelect={setSelectedTemplate}
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || isCalculating || !calculationResult}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? t.saving : t.save}
              </button>
            </div>
          </div>

          {/* 右侧：预览 */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4">{t.preview}</h3>
              {previewCard ? (
                <CardPreview card={previewCard} locale={locale} />
              ) : (
                <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  {locale === 'zh' ? '预览将在这里显示' : 'Preview will appear here'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

