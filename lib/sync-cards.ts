/**
 * LocalStorage → Supabase 数据同步逻辑
 * 当用户登录后，自动同步本地卡片到 Supabase
 */

import { createClient } from '@/lib/supabase/client';
import type { CardContent } from '@/types/card-template';

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
  localCards: CardContent[],
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
      // 检查卡片是否已存在（基于 templateId + goalText + targetDate 去重）
      const { data: existing, error: checkError } = await supabase
        .from('goal_cards')
        .select('id')
        .eq('user_id', userId)
        .eq('template_id', card.templateId)
        .eq('goal_text', card.goalText)
        .eq('target_date', card.targetDate)
        .maybeSingle();

      if (checkError) {
        console.error('❌ 检查卡片重复失败:', checkError);
        result.errors.push(`检查重复失败: ${card.goalText}`);
        continue;
      }

      if (existing) {
        console.log(`⏭️  跳过重复卡片: ${card.goalText}`);
        result.skipped++;
        continue;
      }

      // 插入新卡片
      const { error: insertError } = await supabase
        .from('goal_cards')
        .insert({
          user_id: userId,
          template_id: card.templateId,
          goal_text: card.goalText,
          target_date: card.targetDate,
          days_count: card.daysCount,
          user_name: card.userName || '',
          is_public: false, // 默认私有
        });

      if (insertError) {
        console.error('❌ 插入卡片失败:', insertError);
        result.errors.push(`插入失败: ${card.goalText}`);
        result.success = false;
      } else {
        console.log(`✅ 同步成功: ${card.goalText}`);
        result.synced++;
      }
    } catch (error: any) {
      console.error('❌ 同步卡片异常:', error);
      result.errors.push(`异常: ${card.goalText} - ${error.message}`);
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

