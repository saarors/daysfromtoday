/**
 * 卡片预览组件
 * 实时显示用户输入的卡片效果
 */

'use client';

import { useEffect, useState } from 'react';
import type { CardTemplate, CardContent, CardData } from '@/types/card-template';

interface CardPreviewProps {
  // 方式1：传递完整的 card 对象（Phase 2.6）
  card?: CardData;
  // 方式2：分别传递 template 和 content（原有方式）
  template?: CardTemplate;
  content?: Partial<CardContent>;
  customBackground?: string;
  locale?: string;
}

export function CardPreview({ card, template, content, customBackground, locale = 'en' }: CardPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // 从 card 或单独参数中提取数据
  const templateId = card ? card.templateId : template?.id;
  const cardContent = card ? card.content : content;
  
  useEffect(() => {
    if (templateId && cardContent) {
      generatePreview();
    }
  }, [templateId, cardContent, customBackground]);
  
  async function generatePreview() {
    if (!templateId || !cardContent) return;
    
    setLoading(true);
    
    const params = new URLSearchParams({
      template: templateId,
      text: cardContent.goalText || 'Your goal here...',
      date: cardContent.targetDate || new Date().toISOString(),
      days: String(cardContent.daysCount || 0),
      name: cardContent.title || '',
    });
    
    const url = `/api/og/goal-card?${params}`;
    setImageUrl(url);
    
    // 模拟加载延迟
    setTimeout(() => setLoading(false), 500);
  }
  
  const text = {
    en: {
      preview: 'Preview',
      generating: 'Generating...',
      selectTemplate: 'Select template and enter content to preview',
      dimensions: '📐 Size: 1200x630 • Perfect for social media sharing',
    },
    zh: {
      preview: '预览',
      generating: '生成中...',
      selectTemplate: '选择模板并输入内容后预览',
      dimensions: '📐 尺寸：1200x630 • 适合社交媒体分享',
    },
  };
  
  const t = text[locale as keyof typeof text] || text.en;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t.preview}</h3>
        {loading && (
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {t.generating}
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
              <p className="text-sm">{t.selectTemplate}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        {t.dimensions}
      </div>
    </div>
  );
}

