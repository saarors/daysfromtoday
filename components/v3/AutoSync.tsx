/**
 * 自动同步组件
 * 在应用中自动监听用户登录并同步本地卡片
 */

'use client';

import { useAutoSync } from '@/hooks/use-auto-sync';
import { useEffect } from 'react';

export function AutoSync() {
  const { syncing, synced } = useAutoSync();

  useEffect(() => {
    if (syncing) {
      console.log('🔄 正在同步本地卡片...');
    }
    if (synced) {
      console.log('✅ 卡片同步完成！');
    }
  }, [syncing, synced]);

  // 这个组件不渲染任何内容，只负责后台同步
  return null;
}

