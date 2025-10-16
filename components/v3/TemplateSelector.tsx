/**
 * 模板选择器组件
 * 用户可以在渐变风格和极简风格之间切换
 */

'use client';

import { useState } from 'react';
import type { CardTemplate } from '@/types/card-template';
import { allPresetTemplates } from '@/lib/preset-templates';

interface TemplateSelectorProps {
  onSelect: (template: CardTemplate) => void;
  selectedId?: string;
}

export function TemplateSelector({ onSelect, selectedId }: TemplateSelectorProps) {
  const [activeTab, setActiveTab] = useState<'gradient' | 'minimalist'>('gradient');
  
  const filteredTemplates = allPresetTemplates.filter(t => {
    if (activeTab === 'gradient') return t.type === 'gradient';
    if (activeTab === 'minimalist') return t.type === 'minimalist';
    return false;
  });
  
  return (
    <div className="space-y-6">
      {/* 标签切换 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('gradient')}
          className={`px-6 py-3 font-medium transition-all duration-200 ${
            activeTab === 'gradient'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          渐变风格
          <span className="ml-2 text-xs opacity-60">(5)</span>
        </button>
        <button
          onClick={() => setActiveTab('minimalist')}
          className={`px-6 py-3 font-medium transition-all duration-200 ${
            activeTab === 'minimalist'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          极简风格
          <span className="ml-2 text-xs opacity-60">(3)</span>
        </button>
      </div>
      
      {/* 模板网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              selectedId === template.id
                ? 'border-blue-600 ring-4 ring-blue-200 scale-[1.02]'
                : 'border-gray-200 hover:border-blue-300 hover:scale-[1.01]'
            }`}
          >
            {/* 模板预览 */}
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold"
              style={{ background: template.background.value }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{template.decorations?.icon}</div>
                <div className="text-sm font-semibold" style={{ 
                  textShadow: template.type === 'gradient' 
                    ? '0 2px 4px rgba(0,0,0,0.2)' 
                    : 'none',
                  color: template.type === 'minimalist' && template.id === 'minimalist-white'
                    ? '#111827'
                    : 'inherit'
                }}>
                  {template.name}
                </div>
              </div>
            </div>
            
            {/* 选中标记 */}
            {selectedId === template.id && (
              <div className="absolute top-3 right-3 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* 提示文本 */}
      <p className="text-sm text-gray-500 text-center">
        选择一个模板作为你的目标卡片背景
      </p>
    </div>
  );
}

