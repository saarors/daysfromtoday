/**
 * Tabs - 标签页组件
 * 
 * 用途: 多个内容并列展示，切换查看
 * 使用场景: Tools（多种计算方法）、Guides（不同操作系统的教程）
 */

'use client';

import { ReactNode, useState, Children } from 'react';

interface TabsProps {
  children: ReactNode;   // Tab 子组件（必填）
}

interface TabProps {
  label: string;         // 标签标题（必填）
  children: ReactNode;   // 内容（必填）
}

export function Tabs({ children }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const tabs = Children.toArray(children);

  return (
    <div className="my-8">
      {/* 标签导航 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab: any, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeIndex === index
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="mt-4">
        {tabs.map((tab: any, index) => (
          <div
            key={index}
            className={`${activeIndex === index ? 'block' : 'hidden'}`}
          >
            <div className="prose dark:prose-invert max-w-none">
              {tab.props.children}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Tab({ children }: TabProps) {
  // 这个组件只是作为 Tabs 的子组件，实际渲染由 Tabs 处理
  return <>{children}</>;
}

