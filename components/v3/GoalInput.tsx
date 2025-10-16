/**
 * 目标输入组件
 * 包含字数限制和实时提示
 */

'use client';

interface GoalInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function GoalInput({ value, onChange, maxLength = 200 }: GoalInputProps) {
  const remaining = maxLength - value.length;
  const isOverLimit = remaining < 0;
  const isWarning = remaining <= 20 && remaining > 0;
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">
        你的目标
        <span className="text-gray-500 font-normal ml-2">（必填）</span>
      </label>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例如：完成马拉松训练、减重 5kg、学会弹吉他、读完 12 本书..."
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200 ${
          isOverLimit 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
            : isWarning
            ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20'
            : 'border-gray-300'
        }`}
        rows={3}
        maxLength={maxLength + 50} // 允许超出一点，但会显示警告
      />
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          💡 简短有力的目标更容易坚持
        </span>
        <span className={`font-medium ${
          isOverLimit 
            ? 'text-red-600' 
            : isWarning 
            ? 'text-yellow-600' 
            : 'text-gray-500'
        }`}>
          {isOverLimit ? '超出 ' : '剩余 '}
          {Math.abs(remaining)} 字
        </span>
      </div>
      
      {isOverLimit && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-red-800 text-sm font-medium">目标文字超出限制</p>
            <p className="text-red-700 text-xs mt-1">
              请精简内容，保持在 {maxLength} 字以内
            </p>
          </div>
        </div>
      )}
      
      {isWarning && !isOverLimit && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-yellow-800 text-sm">
            即将达到字数上限，建议精简
          </p>
        </div>
      )}
    </div>
  );
}

