/**
 * Callout - 提示框组件
 * 
 * 用途: 突出显示重要信息或提示
 * 使用场景: 所有类型文章的关键提示
 */

import { ReactNode } from 'react';

interface CalloutProps {
  type: 'info' | 'warning' | 'success' | 'error';  // 类型（必填）
  children: ReactNode;   // 内容（必填）
}

const typeStyles = {
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'ℹ️',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    textColor: 'text-blue-900 dark:text-blue-100',
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: '⚠️',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
    textColor: 'text-yellow-900 dark:text-yellow-100',
  },
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: '✅',
    iconBg: 'bg-green-100 dark:bg-green-900/40',
    textColor: 'text-green-900 dark:text-green-100',
  },
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: '❌',
    iconBg: 'bg-red-100 dark:bg-red-900/40',
    textColor: 'text-red-900 dark:text-red-100',
  },
};

export function Callout({ type, children }: CalloutProps) {
  const styles = typeStyles[type];

  return (
    <div className={`my-4 p-4 border rounded-lg ${styles.container}`}>
      <div className="flex items-start gap-3">
        {/* 图标 */}
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded ${styles.iconBg}`}>
          <span className="text-lg">{styles.icon}</span>
        </div>

        {/* 内容 */}
        <div className={`flex-1 ${styles.textColor} prose prose-sm dark:prose-invert max-w-none`}>
          {children}
        </div>
      </div>
    </div>
  );
}

