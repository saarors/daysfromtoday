/**
 * 语言切换器组件
 * 
 * 功能：
 * - 右上角固定位置
 * - 地球图标 + 语言选项
 * - 玻璃拟态效果
 * - 响应式设计
 */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [mounted, setMounted] = useState(false);

  // 防止 hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // 只返回语言链接，容器由 TopNav 提供
  if (!mounted) {
    return <div className="flex gap-1 w-24 h-8" />; // Placeholder
  }

  return (
    <div className="flex gap-1" suppressHydrationWarning>
      <Link
        href="/en"
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          currentLocale === 'en'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        EN
      </Link>
      <Link
        href="/zh"
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          currentLocale === 'zh'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        中文
      </Link>
    </div>
  );
}
