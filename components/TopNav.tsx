/**
 * 顶部导航栏组件
 * 
 * 功能：
 * - 左侧: 主导航（首页、纪念日、博客）
 * - 右侧: 语言切换器 + 国家选择器
 * - 固定在页面顶部
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import CountrySelector from './CountrySelector';
import { UserMenu } from './v3/UserMenu';

interface TopNavProps {
  locale: string;
}

export default function TopNav({ locale }: TopNavProps) {
  const pathname = usePathname();
  
  const text = {
    en: {
      home: 'Home',
      wishlist: 'Wishlist',
      calculator: 'Date Calculator',
      holidays: 'Holidays',
      blog: 'Blog'
    },
    zh: {
      home: '首页',
      wishlist: '愿望清单',
      calculator: '日期计算',
      holidays: '节假日',
      blog: '博客'
    }
  };

  const t = text[locale as keyof typeof text] || text.en;

  // 判断当前激活的导航项
  const isActive = (path: string) => {
    if (path === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname?.startsWith(path);
  };


  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm" suppressHydrationWarning>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：Logo + 主导航 */}
          <div className="flex items-center gap-8">
            {/* Logo 区域 */}
            <Link 
              href={`/${locale}`} 
              className="flex items-center hover:opacity-80 transition-opacity group"
            >
              <Image 
                src="/image/daysfromtoday-logo.png" 
                alt="DaysFromToday"
                width={135}
                height={45}
                className="h-12 w-auto group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            
            {/* 主导航 - 桌面端 */}
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href={`/${locale}`}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(`/${locale}`)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {t.home}
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                href={`/${locale}/wishlist`}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(`/${locale}/wishlist`)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {t.wishlist}
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                href={`/${locale}/calculator`}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(`/${locale}/calculator`)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {t.calculator}
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                href={`/${locale}/holidays`}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(`/${locale}/holidays`)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {t.holidays}
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                href={`/${locale}/blog`}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(`/${locale}/blog`)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {t.blog}
              </Link>
            </nav>
          </div>
          
          {/* 右侧：用户菜单 + 语言切换器 + 国家选择器 */}
          <div className="flex items-center gap-3">
            {/* 用户菜单 */}
            <UserMenu locale={locale} />
            
            {/* 语言切换器 */}
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md border border-gray-200/50">
              <span className="text-gray-600 text-sm">🌍</span>
              <LanguageSwitcher currentLocale={locale} />
            </div>
            
            {/* 国家选择器 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50">
              <CountrySelector locale={locale as 'en' | 'zh'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

