'use client';

/**
 * AI 助手选择器组件
 * V3.0 - 选择三个不同人设的 AI 助手
 */

import { useState } from 'react';
import { getAllAssistants, DEFAULT_ASSISTANT } from '@/lib/ai-assistants';
import type { AIAssistantType } from '@/types/ai-assistant';

interface AIAssistantSelectorProps {
  selected: AIAssistantType;
  onSelect: (assistantId: AIAssistantType) => void;
  locale?: string;
}

export function AIAssistantSelector({
  selected,
  onSelect,
  locale = 'en',
}: AIAssistantSelectorProps) {
  const assistants = getAllAssistants();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {locale === 'zh' ? '选择 AI 助手' : 'Choose AI Assistant'}
      </label>
      
      <div className="grid grid-cols-3 gap-3">
        {assistants.map((assistant) => (
          <button
            key={assistant.id}
            type="button"
            onClick={() => onSelect(assistant.id)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200
              hover:shadow-md hover:-translate-y-0.5
              ${
                selected === assistant.id
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }
            `}
            aria-label={`Select ${assistant.name}`}
          >
            {/* 选中指示器 */}
            {selected === assistant.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* 头像（暂时用 emoji，后续替换 PNG） */}
            <div className="text-center mb-2">
              <span 
                className="text-4xl inline-block mb-1"
                role="img"
                aria-label={assistant.name}
              >
                {assistant.emoji}
              </span>
              <div className="text-sm font-semibold text-gray-900">
                {assistant.name}
              </div>
            </div>

            {/* 人设描述 */}
            <div className="text-xs text-gray-600 leading-tight">
              {assistant.description[locale as 'en' | 'zh']}
            </div>
          </button>
        ))}
      </div>

      {/* 选中助手的详细介绍 */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="text-sm text-gray-700">
          {(() => {
            const selectedAssistant = assistants.find((a) => a.id === selected);
            if (!selectedAssistant) return null;
            
            return (
              <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label={selectedAssistant.name}>
                  {selectedAssistant.emoji}
                </span>
                <div>
                  <div className="font-medium text-gray-900 mb-1">
                    {selectedAssistant.name}{' '}
                    <span className="text-gray-500 font-normal">
                      {locale === 'zh' ? '的特点：' : '\'s Style:'}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {selectedAssistant.personality.tone}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

