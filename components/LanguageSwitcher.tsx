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

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-gray-200/50">
        <span className="text-gray-600 text-sm">🌍</span>
        <div className="flex gap-1">
          <Link
            href="/en"
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              currentLocale === 'en'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            EN
          </Link>
          <Link
            href="/zh"
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              currentLocale === 'zh'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            中文
          </Link>
        </div>
      </div>
    </div>
  );
}
