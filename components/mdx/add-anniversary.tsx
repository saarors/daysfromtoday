/**
 * AddAnniversary - 内嵌纪念日添加组件
 * 
 * 用途: 在文章中植入纪念日添加功能
 * 使用场景: Stories（用户故事）、Guides（纪念日功能教程）
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AddAnniversaryProps {
  presetDate?: string;         // 预设日期（YYYY-MM-DD）
  presetName?: string;         // 预设名称
  title?: string;              // 标题（可选）
}

export function AddAnniversary({
  presetDate,
  presetName,
  title = '添加纪念日',
}: AddAnniversaryProps) {
  const [name, setName] = useState(presetName || '');
  const [date, setDate] = useState(presetDate || '');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (name && date) {
      // 实际应调用产品功能添加到本地存储
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    }
  };

  return (
    <div className="my-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
      <h3 className="text-lg font-bold mb-4">{title}</h3>

      {/* 表单 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">纪念日名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：生日、结婚纪念日"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">日期</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={!name || !date}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {added ? '✓ 已添加' : '添加纪念日'}
        </button>

        {/* 成功提示 */}
        {added && (
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-sm text-center">
            ✓ 纪念日已添加到您的列表！
          </div>
        )}

        {/* 查看所有纪念日链接 */}
        <Link
          href="/anniversaries"
          className="block text-center text-sm text-purple-600 dark:text-purple-400 hover:underline"
        >
          查看所有纪念日 →
        </Link>
      </div>
    </div>
  );
}

