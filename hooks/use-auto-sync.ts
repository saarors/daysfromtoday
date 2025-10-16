/**
 * 自动同步 Hook
 * 监听用户登录状态，自动同步本地卡片到 Supabase
 */

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useGoalCards } from '@/store/goal-cards';
import { syncCardsToSupabase, clearLocalCards, checkLocalCards } from '@/lib/sync-cards';

export function useAutoSync() {
  const supabase = createClient();
  const { getAllCards } = useGoalCards();
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // 当用户登录时触发同步
      if (event === 'SIGNED_IN' && session?.user && !synced && !syncing) {
        const localCardCount = checkLocalCards();
        
        if (localCardCount === 0) {
          console.log('📦 没有本地卡片，跳过同步');
          setSynced(true);
          return;
        }

        console.log(`🔄 检测到用户登录，准备同步 ${localCardCount} 张本地卡片...`);
        setSyncing(true);

        try {
          const localCards = getAllCards();
          const result = await syncCardsToSupabase(localCards, session.user.id);

          if (result.success && result.synced > 0) {
            // 同步成功，清理本地数据
            clearLocalCards();
            console.log(`✅ 成功同步 ${result.synced} 张卡片，已清理本地数据`);
            
            // 显示成功提示（可选）
            if (typeof window !== 'undefined') {
              // 可以使用 toast 或其他通知方式
              console.log(`🎉 已同步 ${result.synced} 张卡片到你的账户！`);
            }
          } else if (result.skipped > 0 && result.synced === 0) {
            console.log(`⏭️  所有卡片已存在，跳过同步`);
          }

          if (result.errors.length > 0) {
            console.error('⚠️  部分卡片同步失败:', result.errors);
          }

          setSynced(true);
        } catch (error) {
          console.error('❌ 自动同步失败:', error);
        } finally {
          setSyncing(false);
        }
      }

      // 当用户登出时重置同步状态
      if (event === 'SIGNED_OUT') {
        setSynced(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [synced, syncing, getAllCards]);

  return { syncing, synced };
}

