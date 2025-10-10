/**
 * StepGuide - 步骤指引组件
 * 
 * 用途: 展示多步骤流程
 * 使用场景: Guides（功能使用步骤）、Tools（计算步骤说明）
 */

import { ReactNode, Children } from 'react';

interface StepGuideProps {
  children: ReactNode;   // Step 子组件（必填）
}

interface StepProps {
  number: number;        // 步骤序号（必填）
  title: string;         // 步骤标题（必填）
  children: ReactNode;   // 内容（必填）
}

export function StepGuide({ children }: StepGuideProps) {
  const steps = Children.toArray(children);

  return (
    <div className="my-8 space-y-6">
      {steps.map((step, index) => (
        <div key={index}>
          {step}
          {/* 连接线（最后一步不显示） */}
          {index < steps.length - 1 && (
            <div className="ml-6 h-8 border-l-2 border-gray-300 dark:border-gray-600" />
          )}
        </div>
      ))}
    </div>
  );
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-4">
      {/* 序号 */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-lg">
          {number}
        </div>
      </div>

      {/* 内容 */}
      <div className="flex-1 pt-1">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
          {children}
        </div>
      </div>
    </div>
  );
}

