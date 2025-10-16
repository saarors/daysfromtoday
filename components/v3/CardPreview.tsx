/**
 * 卡片预览组件
 * 实时显示用户输入的卡片效果
 */

'use client';

import { useEffect, useState } from 'react';
import type { CardTemplate, CardContent } from '@/types/card-template';

interface CardPreviewProps {
  template: CardTemplate;
  content: Partial<CardContent>;
  customBackground?: string;
}

export function CardPreview({ template, content, customBackground }: CardPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    generatePreview();
  }, [template, content, customBackground]);
  
  async function generatePreview() {
    setLoading(true);
    
    const params = new URLSearchParams({
      template: template.id,
      text: content.goalText || 'Your goal here...',
      date: content.targetDate || new Date().toISOString(),
      days: String(content.daysCount || 0),
      name: content.title || '',
    });
    
    const url = `/api/og/goal-card?${params}`;
    setImageUrl(url);
    
    // 模拟加载延迟
    setTimeout(() => setLoading(false), 500);
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">预览</h3>
        {loading && (
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            生成中...
          </span>
        )}
      </div>
      
      <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Card Preview"
              className="w-full h-full object-cover"
              onLoad={() => setLoading(false)}
            />
            {loading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">选择模板并输入内容后预览</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        📐 尺寸：1200x630 • 适合社交媒体分享
      </div>
    </div>
  );
}

