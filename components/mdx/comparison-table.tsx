/**
 * ComparisonTable - 对比表格组件
 * 
 * 用途: 展示多个项目的特性对比
 * 使用场景: Philosophy（日期计算方法对比）、Tools（功能对比）
 */

import { ReactNode } from 'react';

interface ComparisonTableProps {
  columns: string[];               // 列标题（必填，如 ['特性', '方案A', '方案B']）
  rows: ComparisonRow[];           // 数据行（必填）
}

interface ComparisonRow {
  feature: string;                 // 特性名称
  values: (string | ReactNode)[];  // 各列的值
}

export function ComparisonTable({ columns, rows }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
        {/* 表头 */}
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-left font-semibold border border-gray-300 dark:border-gray-600 ${
                  index === 0 ? 'w-1/3' : ''
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        {/* 表体 */}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-850'}
            >
              {/* 特性列 */}
              <td className="px-4 py-3 font-medium border border-gray-300 dark:border-gray-600">
                {row.feature}
              </td>

              {/* 值列 */}
              {row.values.map((value, valueIndex) => (
                <td
                  key={valueIndex}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

