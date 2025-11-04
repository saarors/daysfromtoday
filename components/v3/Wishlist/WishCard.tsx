'use client';

/**
 * 愿望卡片组件 - 卡片式展示版本
 * 保持原有的卡片式布局,优化数据展现和视觉效果
 * 
 * 核心功能:
 * - 显示目标日期和设定时间
 * - 显示距今天数
 * - 显示用户原始输入
 * - 显示匹配的AI助手及其建议
 * - 支持查看详情(跳转chat页面)
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
  const router = useRouter();
  const currentAssistant = getAssistant(assistant);

  const text = {
    en: {
      targetDate: 'Target Date',
      createdDate: 'Created On',
      remaining: 'Remaining',
      elapsed: 'Elapsed',
      days: 'days',
      workingDays: 'working days',
      userGoal: 'Your Goal',
      aiSuggestion: '\'s Analysis & Suggestions',
      viewDetail: 'View Details',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this wish? This action cannot be undone.',
    },
    zh: {
      targetDate: '目标日期',
      createdDate: '设定时间',
      remaining: '距今',
      elapsed: '已过',
      days: '天',
      workingDays: '工作日',
      userGoal: '你的目标',
      aiSuggestion: '的分析与建议',
      viewDetail: '查看详情',
      delete: '删除',
      confirmDelete: '确定要删除这个愿望吗？此操作无法撤销。',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  // 计算已过天数
  const today = new Date();
  const created = new Date(createdAt);
  const elapsedDays = Math.floor((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  const safeDays = days || 0;
  const remainingDays = Math.max(0, safeDays - elapsedDays);
  
  // 格式化创建日期
  const formattedCreatedDate = created.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const handleViewDetail = () => {
    const params = new URLSearchParams({
      days: days.toString(),
      targetDate,
      goalText,
      assistant,
      viewOnly: 'true',
      cardId: id,
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
        <div className="border-b border-gray-100 pb-4 space-y-3">
          {/* 第一行：目标日期和倒计时 */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">{t.targetDate}</div>
              <div className="text-xl font-bold text-gray-900">{targetDate}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">{t.remaining}</div>
              <div className="text-2xl font-bold text-blue-600">{remainingDays} {t.days}</div>
            </div>
          </div>
          
          {/* 第二行：设定时间和已过天数 */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>{t.createdDate}:</span>
              <span className="text-gray-700 font-medium">{formattedCreatedDate}</span>
            </div>
            <div>
              <span>{t.elapsed} {elapsedDays} {t.days}</span>
            </div>
          </div>
        </div>

        {/* 用户目标 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            {t.userGoal}
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {goalText}
            </p>
          </div>
        </div>

        {/* AI 分析与建议 - 预览版本(不展开) */}
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
          <div className="bg-blue-50 rounded-lg border border-blue-100 overflow-hidden">
            {/* AI 建议内容区域 - 增加高度预览 */}
            <div className="p-4 max-h-[300px] overflow-hidden relative">
              <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({node, ...props}) => <h2 className="text-base font-bold text-gray-900 mt-2 mb-1" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-sm font-semibold text-gray-900 mt-2 mb-1" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 text-sm text-gray-800" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1 text-sm" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1 text-sm" {...props} />,
                  }}
                >
                  {aiAnalysis}
                </ReactMarkdown>
              </div>
              
              {/* 渐变遮罩 */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-50 to-transparent pointer-events-none"></div>
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

      {/* Markdown样式 - 简化版 */}
      <style jsx global>{`
        .prose h2 {
          font-size: 1rem !important;
          font-weight: 700 !important;
          color: #111827 !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.25rem !important;
        }

        .prose h3 {
          font-size: 0.875rem !important;
          font-weight: 600 !important;
          color: #374151 !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.25rem !important;
        }

        .prose p {
          margin-bottom: 0.5rem !important;
          line-height: 1.6 !important;
          color: #4b5563 !important;
          font-size: 0.875rem !important;
        }

        .prose ul, .prose ol {
          margin-bottom: 0.5rem !important;
          padding-left: 1.5rem !important;
        }

        .prose li {
          margin-bottom: 0.25rem !important;
          line-height: 1.6 !important;
          color: #4b5563 !important;
          font-size: 0.875rem !important;
        }

        .prose strong {
          font-weight: 700 !important;
          color: #111827 !important;
        }
      `}</style>
    </div>
  );
}
