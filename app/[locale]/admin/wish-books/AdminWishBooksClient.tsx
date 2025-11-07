'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface AdminWishBooksClientProps {
  initialFilters: {
    status?: string;
    category?: string;
    time_dimension?: string;
    search?: string;
  };
  categories: Record<string, { name: string; emoji: string }>;
  timeDimensions: Record<string, { label: string; emoji: string }>;
}

export default function AdminWishBooksClient({
  initialFilters,
  categories,
  timeDimensions
}: AdminWishBooksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState(initialFilters);
  
  // 更新 URL 参数
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* 状态筛选 */}
        <div>
          <label className="text-xs text-gray-600 mb-1 block">状态</label>
          <select 
            className="px-3 py-2 border rounded-lg text-sm"
            value={filters.status || ''}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            <option value="">全部</option>
            <option value="draft">📝 草稿</option>
            <option value="published">✅ 已发布</option>
            <option value="archived">🗃️ 已归档</option>
          </select>
        </div>
        
        {/* 类别筛选 */}
        <div>
          <label className="text-xs text-gray-600 mb-1 block">类别</label>
          <select 
            className="px-3 py-2 border rounded-lg text-sm"
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="">全部</option>
            {Object.entries(categories).map(([key, { name, emoji }]) => (
              <option key={key} value={key}>
                {emoji} {name}
              </option>
            ))}
          </select>
        </div>
        
        {/* 时间维度筛选 */}
        <div>
          <label className="text-xs text-gray-600 mb-1 block">时间维度</label>
          <select 
            className="px-3 py-2 border rounded-lg text-sm"
            value={filters.time_dimension || ''}
            onChange={(e) => updateFilter('time_dimension', e.target.value)}
          >
            <option value="">全部</option>
            {Object.entries(timeDimensions).map(([key, { label, emoji }]) => (
              <option key={key} value={key}>
                {emoji} {label}
              </option>
            ))}
          </select>
        </div>
        
        {/* 搜索 */}
        <div className="flex-1">
          <label className="text-xs text-gray-600 mb-1 block">搜索</label>
          <input
            type="text"
            placeholder="搜索标题或副标题..."
            className="w-full px-3 py-2 border rounded-lg text-sm"
            defaultValue={filters.search || ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateFilter('search', e.currentTarget.value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

