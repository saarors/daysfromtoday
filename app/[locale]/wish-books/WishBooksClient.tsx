/**
 * Wish Books 筛选器 - 客户端组件
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface WishBooksClientProps {
  locale: string;
  initialFilters: {
    category?: string;
    time_dimension?: string;
    search?: string;
  };
  categories: Record<string, { name: string; emoji: string }>;
  timeDimensions: Record<string, { label: string; emoji: string }>;
  translations: {
    search: string;
    allCategories: string;
    allDurations: string;
  };
}

export default function WishBooksClient({
  locale,
  initialFilters,
  categories,
  timeDimensions,
  translations: t
}: WishBooksClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [category, setCategory] = useState(initialFilters.category || '');
  const [timeDimension, setTimeDimension] = useState(initialFilters.time_dimension || '');
  const [search, setSearch] = useState(initialFilters.search || '');
  
  // 更新 URL 参数
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (category) params.set('category', category);
    if (timeDimension) params.set('time_dimension', timeDimension);
    if (search) params.set('search', search);
    
    const queryString = params.toString();
    const newUrl = queryString ? `/${locale}/wish-books?${queryString}` : `/${locale}/wish-books`;
    
    router.push(newUrl);
  }, [category, timeDimension, search, locale, router]);
  
  return (
    <section className="mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 搜索框 */}
          <input
            type="text"
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          {/* 类别筛选 */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">{t.allCategories}</option>
            {Object.entries(categories).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
          
          {/* 时间维度筛选 */}
          <select
            value={timeDimension}
            onChange={(e) => setTimeDimension(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">{t.allDurations}</option>
            {Object.entries(timeDimensions).map(([key, dim]) => (
              <option key={key} value={key}>
                {dim.emoji} {dim.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* 清除筛选按钮 */}
        {(category || timeDimension || search) && (
          <button
            onClick={() => {
              setCategory('');
              setTimeDimension('');
              setSearch('');
            }}
            className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
          >
            清除筛选
          </button>
        )}
      </div>
    </section>
  );
}

