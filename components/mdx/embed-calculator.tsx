/**
 * EmbedCalculator - 内嵌计算器组件
 * 
 * 用途: 在文章中植入日期计算器，引导用户使用产品功能
 * 使用场景: Tools（日期计算教程）、Guides（功能使用指南）
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface EmbedCalculatorProps {
  type: 'business-days' | 'countdown' | 'date-diff';  // 计算器类型（必填）
  defaultDays?: number;         // 默认天数（可选）
  title?: string;               // 标题（可选）
  description?: string;         // 描述（可选）
}

export function EmbedCalculator({
  type,
  defaultDays = 30,
  title = '试试计算',
  description,
}: EmbedCalculatorProps) {
  const [days, setDays] = useState(defaultDays);
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    // 简单的日期计算（实际应调用产品功能）
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    setResult(targetDate.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  };

  const typeLabels = {
    'business-days': '工作日',
    'countdown': '倒计时',
    'date-diff': '日期差',
  };

  const typePaths = {
    'business-days': '/business-days',
    'countdown': '/natural-days',
    'date-diff': '/natural-days',
  };

  return (
    <div className="my-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      )}

      {/* 计算器表单 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            天数（{typeLabels[type]}）
          </label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            min="1"
            max="3650"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          计算
        </button>

        {/* 结果显示 */}
        {result && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">结果：</span>
              <br />
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {result}
              </span>
            </p>
          </div>
        )}

        {/* 查看完整功能链接 */}
        <Link
          href={typePaths[type]}
          className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          查看完整功能 →
        </Link>
      </div>
    </div>
  );
}

