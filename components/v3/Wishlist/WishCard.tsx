'use client';

/**
 * 愿望卡片组件
 * 显示单个愿望的信息
 */

import { useState } from 'react';
import { getAssistant } from '@/lib/ai-assistants';
import type { AIAssistantType } from '@/types/ai-assistant';

interface WishCardProps {
  id: string;
  goalText: string;
  targetDate: string;
  days: number;
  workingDays?: number;
  assistant: AIAssistantType;
  aiSummary: string;
  aiGeneratedImageUrl?: string;
  createdAt: string;
  onDelete?: (id: string) => void;
  locale: string;
}

export function WishCard({
  id,
  goalText,
  targetDate,
  days,
  workingDays,
  assistant,
  aiSummary,
  aiGeneratedImageUrl,
  createdAt,
  onDelete,
  locale,
}: WishCardProps) {
  const [showFullGoal, setShowFullGoal] = useState(false);
  const currentAssistant = getAssistant(assistant);

  const text = {
    en: {
      targetDate: 'Target',
      daysRemaining: 'days remaining',
      workingDays: 'working days',
      aiSuggestion: '\'s Suggestion',
      readMore: 'Read More',
      readLess: 'Read Less',
      viewDetail: 'View Details',
      delete: 'Delete',
    },
    zh: {
      targetDate: '目标日期',
      daysRemaining: '天',
      workingDays: '工作日',
      aiSuggestion: '的建议',
      readMore: '展开',
      readLess: '收起',
      viewDetail: '查看详情',
      delete: '删除',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  // 截断长文本
  const truncatedGoal = goalText.length > 150 
    ? goalText.substring(0, 150) + '...' 
    : goalText;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* AI 生成图片（如果有） */}
      {aiGeneratedImageUrl && (
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 relative">
          <img 
            src={aiGeneratedImageUrl} 
            alt="Goal visualization"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 卡片内容 */}
      <div className="p-6 space-y-4">
        {/* 头部：日期和天数 */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">{t.targetDate}</div>
            <div className="text-lg font-semibold text-gray-900">{targetDate}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{days}</div>
            <div className="text-sm text-gray-500">{t.daysRemaining}</div>
            {workingDays && workingDays > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                ({workingDays} {t.workingDays})
              </div>
            )}
          </div>
        </div>

        {/* 目标描述 */}
        <div className="border-t border-gray-100 pt-4">
          <div className="text-gray-800 text-sm leading-relaxed">
            {showFullGoal ? goalText : truncatedGoal}
          </div>
          {goalText.length > 150 && (
            <button
              onClick={() => setShowFullGoal(!showFullGoal)}
              className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700"
            >
              {showFullGoal ? t.readLess : t.readMore}
            </button>
          )}
        </div>

        {/* AI 建议摘要 */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${currentAssistant.color}20` }}
            >
              {currentAssistant.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 mb-1">
                {currentAssistant.name}{t.aiSuggestion}
              </div>
              <div className="text-sm text-gray-600 line-clamp-3">
                {aiSummary}
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between pt-2">
          <button
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {t.viewDetail}
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              {t.delete}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

