/**
 * 国家选择器组件
 * 独立于语言，仅控制节假日/工作日规则
 */

'use client';

import { useState, useEffect } from 'react';
import { useUserContext } from '@/store/user-context';
import { COUNTRIES } from '@/lib/country-config';
import type { Locale, CountryCode } from '@/types/user-context';

interface CountrySelectorProps {
  locale: Locale;
}

export default function CountrySelector({ locale }: CountrySelectorProps) {
  const { country, setCountry } = useUserContext();
  const [mounted, setMounted] = useState(false);

  // 防止 hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="country-selector-placeholder w-32 h-10 bg-gray-100 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="country-selector relative">
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value as CountryCode)}
        className="
          appearance-none
          px-4 py-2
          pr-8
          bg-white
          border border-gray-200
          rounded-lg
          text-sm
          font-medium
          text-gray-700
          hover:border-gray-300
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-transparent
          transition-all
          cursor-pointer
        "
      >
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name[locale]}
          </option>
        ))}
      </select>
      
      {/* 下拉箭头图标 */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

