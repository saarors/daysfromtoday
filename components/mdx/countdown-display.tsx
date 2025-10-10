/**
 * CountdownDisplay - 倒计时展示组件
 * 
 * 用途: 实时显示距离某个日期的倒计时
 * 使用场景: Stories（故事中的时间节点）、Updates（产品发布倒计时）
 */

'use client';

import { useEffect, useState } from 'react';

interface CountdownDisplayProps {
  targetDate: string;          // 目标日期（YYYY-MM-DD，必填）
  title?: string;              // 标题（可选）
  showDays?: boolean;          // 是否显示自然日（默认 true）
  showBusinessDays?: boolean;  // 是否显示工作日（默认 false）
}

export function CountdownDisplay({
  targetDate,
  title,
  showDays = true,
  showBusinessDays = false,
}: CountdownDisplayProps) {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [businessDaysRemaining, setBusinessDaysRemaining] = useState(0);

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      
      setDaysRemaining(days);

      // 简单的工作日计算（实际应排除周末和节假日）
      if (showBusinessDays) {
        // 这里简化为 days * 5/7
        setBusinessDaysRemaining(Math.ceil(days * 5 / 7));
      }
    };

    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60); // 每小时更新一次

    return () => clearInterval(interval);
  }, [targetDate, showBusinessDays]);

  return (
    <div className="my-8 p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-center">
      {title && (
        <h3 className="text-xl font-bold mb-4">{title}</h3>
      )}

      {/* 倒计时显示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {showDays && (
          <div>
            <div className="text-6xl font-bold mb-2">{daysRemaining}</div>
            <div className="text-lg opacity-90">天</div>
          </div>
        )}

        {showBusinessDays && (
          <div>
            <div className="text-6xl font-bold mb-2">{businessDaysRemaining}</div>
            <div className="text-lg opacity-90">工作日</div>
          </div>
        )}
      </div>

      {/* 目标日期 */}
      <div className="mt-6 text-sm opacity-75">
        目标日期: {new Date(targetDate).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </div>
  );
}

