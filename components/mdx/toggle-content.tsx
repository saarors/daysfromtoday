/**
 * ToggleContent - 可切换内容组件
 * 
 * 用途: 展示前后对比、隐藏/显示剧透内容
 * 使用场景: Stories（剧透内容）、Tools（计算结果展示）
 */

'use client';

import { ReactNode, useState } from 'react';

interface ToggleContentProps {
  showLabel?: string;           // "显示"按钮文案（默认 "Show More"）
  hideLabel?: string;           // "隐藏"按钮文案（默认 "Hide"）
  children: ReactNode;          // 内容（必填）
  defaultVisible?: boolean;     // 是否默认可见（默认 false）
}

export function ToggleContent({
  showLabel = 'Show More',
  hideLabel = 'Hide',
  children,
  defaultVisible = false,
}: ToggleContentProps) {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  return (
    <div className="my-6">
      {/* 按钮 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
      >
        <span>{isVisible ? hideLabel : showLabel}</span>
        <span className={`transform transition-transform ${isVisible ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* 内容 */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isVisible ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="prose dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

