/**
 * 发布按钮 - 客户端组件
 * 用于快速切换卡片的发布状态
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PublishButtonProps {
  bookId: string;
  currentStatus: string;
  locale: string;
}

export default function PublishButton({ 
  bookId, 
  currentStatus, 
  locale 
}: PublishButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleTogglePublish = async () => {
    if (isLoading) return;
    
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const confirmMessage = currentStatus === 'published' 
      ? '确定要取消发布这张卡片吗？' 
      : '确定要发布这张卡片吗？';
    
    if (!confirm(confirmMessage)) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/wish-books/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === 'published' && { published_at: new Date().toISOString() })
        }),
      });
      
      if (!response.ok) {
        throw new Error('更新状态失败');
      }
      
      // 刷新页面
      router.refresh();
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleTogglePublish}
      disabled={isLoading}
      className={`px-3 py-1 text-xs rounded transition-colors ${
        currentStatus === 'published'
          ? 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          : 'bg-green-50 text-green-600 hover:bg-green-100'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? '...' : currentStatus === 'published' ? '📝 取消发布' : '✅ 发布'}
    </button>
  );
}

