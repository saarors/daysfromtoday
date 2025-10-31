'use client';

/**
 * 愿望卡片组件 - 单行大卡片版本
 * 显示完整的用户输入和 AI 分析
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAssistant } from '@/lib/ai-assistants';
import type { AIAssistantType } from '@/types/ai-assistant';

interface WishCardProps {
  id: string;
  goalText: string;
  targetDate: string;
  days: number;
  workingDays?: number;
  assistant: AIAssistantType;
  aiAnalysis: string;  // 完整 AI 分析
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
  aiAnalysis,
  aiSummary,
  aiGeneratedImageUrl,
  createdAt,
  onDelete,
  locale,
}: WishCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const router = useRouter();
  const currentAssistant = getAssistant(assistant);

  const text = {
    en: {
      targetDate: 'Target',
      remaining: 'Remaining',
      elapsed: 'Elapsed',
      days: 'days',
      workingDays: 'working days',
      aiSuggestion: '\'s Analysis & Suggestions',
      viewDetail: 'View Details',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this wish? This action cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
    zh: {
      targetDate: '目标日期',
      remaining: '距今',
      elapsed: '已过',
      days: '天',
      workingDays: '工作日',
      aiSuggestion: '的分析与建议',
      viewDetail: '查看详情',
      delete: '删除',
      confirmDelete: '确定要删除这个愿望吗？此操作无法撤销。',
      cancel: '取消',
      confirm: '删除',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  // 计算已过天数
  const today = new Date();
  const target = new Date(targetDate);
  const created = new Date(createdAt);
  const elapsedDays = Math.floor((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, days - elapsedDays);

  const handleViewDetail = () => {
    // 跳转回对话页面，传递完整数据
    const params = new URLSearchParams({
      days: days.toString(),
      targetDate,
      goalText,
      assistant,
      viewOnly: 'true',  // 标记为查看模式
      cardId: id,  // 传递卡片 ID
    });
    router.push(`/${locale}/wishlist?${params.toString()}`);
  };

  const handleDelete = () => {
    if (window.confirm(t.confirmDelete)) {
      onDelete?.(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6 space-y-4">
        {/* 头部：日期信息 */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">{t.targetDate}</div>
            <div className="text-xl font-bold text-gray-900">{targetDate}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {t.remaining} <span className="text-2xl font-bold text-blue-600">{remainingDays}</span> {t.days}
              <span className="text-gray-400 ml-2">·</span>
              <span className="text-gray-400 ml-2">{t.elapsed} {elapsedDays} {t.days}</span>
            </div>
          </div>
        </div>

        {/* 用户目标 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            {locale === 'zh' ? '你的目标' : 'Your Goal'}
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {goalText}
            </p>
          </div>
        </div>

        {/* AI 分析与建议 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span 
              className="w-6 h-6 rounded-full flex items-center justify-center text-base"
              style={{ backgroundColor: `${currentAssistant.color}20` }}
            >
              {currentAssistant.emoji}
            </span>
            {currentAssistant.name}{t.aiSuggestion}
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h3: ({node, ...props}) => <h3 className="text-base font-bold text-gray-900 mt-3 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2 text-gray-800" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-3">
                      <table className="min-w-full border-collapse border border-gray-300 text-sm" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => <thead className="bg-gray-100" {...props} />,
                  th: ({node, ...props}) => <th className="border border-gray-300 px-3 py-2 text-left font-semibold" {...props} />,
                  td: ({node, ...props}) => <td className="border border-gray-300 px-3 py-2" {...props} />,
                }}
              >
                {aiAnalysis}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end gap-4 pt-2 border-t border-gray-100">
          <button
            onClick={handleViewDetail}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {t.viewDetail}
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              {t.delete}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
