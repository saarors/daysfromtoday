/**
 * Accordion - 可折叠区块组件
 * 
 * 用途: 折叠次要信息，节省空间
 * 使用场景: Guides（高级技巧）、Tools（常见问题）
 */

'use client';

import { ReactNode, useState } from 'react';

interface AccordionProps {
  title: string;               // 标题（必填）
  children: ReactNode;         // 内容（必填）
  defaultOpen?: boolean;       // 是否默认展开（默认 false）
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* 标题栏 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{title}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* 内容区域 */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}

