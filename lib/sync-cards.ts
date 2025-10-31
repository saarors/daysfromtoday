/**
 * LocalStorage → Supabase 数据同步逻辑
 * 当用户登录后，自动同步本地卡片到 Supabase
 */

import { createClient } from '@/lib/supabase/client';
import type { CardData } from '@/types/card-template';

interface SyncResult {
  success: boolean;
  synced: number;
  skipped: number;
  errors: string[];
}

/**
 * 同步本地卡片到 Supabase
 * @param localCards 本地卡片数组
 * @param userId 用户 ID
 * @returns 同步结果
 */
export async function syncCardsToSupabase(
  localCards: CardData[],
  userId: string
): Promise<SyncResult> {
  const supabase = createClient();
  const result: SyncResult = {
    success: true,
    synced: 0,
    skipped: 0,
    errors: [],
  };

  if (!localCards || localCards.length === 0) {
    console.log('📦 没有本地卡片需要同步');
    return result;
  }

  console.log(`🔄 开始同步 ${localCards.length} 张本地卡片到 Supabase...`);

  for (const card of localCards) {
    try {
      console.log(`🔍 检查卡片: ${card.content.goalText}`, {
        id: card.id,
        templateId: card.templateId,
        targetDate: card.content.targetDate,
        daysCount: card.content.daysCount,
        cardType: card.cardType,
        calculationMode: card.calculationMode,
        daysType: card.daysType,
      });
      
      // 检查卡片是否已存在（基于 ID 或 templateId + goalText + targetDate 去重）
      const { data: existing, error: checkError } = await supabase
        .from('goal_cards')
        .select('id')
        .eq('user_id', userId)
        .or(`id.eq.${card.id},and(template_id.eq.${card.templateId},goal_text.eq.${card.content.goalText},target_date.eq.${card.content.targetDate})`)
        .maybeSingle();
      
      console.log(`🔎 检查结果:`, { existing, checkError });

      if (checkError) {
        console.error('❌ 检查卡片重复失败:', checkError);
        result.errors.push(`检查重复失败: ${card.content.goalText}`);
        continue;
      }

      if (existing) {
        console.log(`⏭️  跳过重复卡片: ${card.content.goalText}`);
        result.skipped++;
        continue;
      }

      // 插入新卡片（包含 Phase 2.6 新字段）
      console.log(`📝 准备插入卡片:`, {
        id: card.id,
        user_id: userId,
        template_id: card.templateId,
        card_type: card.cardType,
        calculation_mode: card.calculationMode,
        days_type: card.daysType,
        goal_text: card.content.goalText,
        target_date: card.content.targetDate,
        days_count: card.content.daysCount,
        working_days_count: card.content.workingDaysCount,
      });
      
      const { data: insertData, error: insertError } = await supabase
        .from('goal_cards')
        .insert({
          id: card.id,
          user_id: userId,
          template_id: card.templateId,
          // Phase 2.6 新增字段
          card_type: card.cardType || 'future',
          calculation_mode: card.calculationMode || 'date-first',
          days_type: card.daysType || 'natural',
          working_days_count: card.content.workingDaysCount || null,
          // 原有字段
          goal_text: card.content.goalText,
          target_date: card.content.targetDate,
          days_count: card.content.daysCount,
          user_name: card.content.title || '',
          is_public: false, // 默认私有
          created_at: card.createdAt,
          updated_at: card.updatedAt,
        })
        .select();

      console.log(`📥 插入结果:`, { insertData, insertError });

      if (insertError) {
        console.error('❌ 插入卡片失败:', insertError);
        result.errors.push(`插入失败: ${card.content.goalText}`);
        result.success = false;
      } else {
        console.log(`✅ 同步成功: ${card.content.goalText}`);
        result.synced++;
      }
    } catch (error: any) {
      console.error('❌ 同步卡片异常:', error);
      result.errors.push(`异常: ${card.content.goalText} - ${error.message}`);
      result.success = false;
    }
  }

  console.log(`\n📊 同步完成:`, {
    成功: result.synced,
    跳过: result.skipped,
    错误: result.errors.length,
  });

  return result;
}

/**
 * 清理本地存储的卡片数据
 */
export function clearLocalCards(): void {
  try {
    // 从 Zustand store 的 LocalStorage 中清理
    const storageKey = 'goal-cards-storage';
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const data = JSON.parse(stored);
      // 保留 Zustand 的 state 结构，只清空 cards 数组
      data.state = { ...data.state, cards: [] };
      localStorage.setItem(storageKey, JSON.stringify(data));
      console.log('🧹 本地卡片已清理');
    }
  } catch (error) {
    console.error('❌ 清理本地卡片失败:', error);
  }
}

/**
 * 检查是否需要同步
 * @returns 本地卡片数量
 */
export function checkLocalCards(): number {
  try {
    const storageKey = 'goal-cards-storage';
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) return 0;
    
    const data = JSON.parse(stored);
    const cards = data?.state?.cards || [];
    return cards.length;
  } catch (error) {
    console.error('❌ 检查本地卡片失败:', error);
    return 0;
  }
}


