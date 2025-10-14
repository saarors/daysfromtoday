import React from 'react';

interface ComparisonItem {
  solution: string;
  difficulty: string;
  rendering: string;
  obsidianCompatible: string;
  useCase: string;
}

interface ComparisonCardProps {
  title: string;
  items: ComparisonItem[];
  className?: string;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ title, items, className = "" }) => {
  return (
    <div className={`bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6 mb-4 border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-5 gap-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100 font-semibold text-gray-700">
            <div className="text-sm">方案</div>
            <div className="text-sm">难度</div>
            <div className="text-sm">渲染效果</div>
            <div className="text-sm">与 Obsidian 兼容</div>
            <div className="text-sm">推荐使用场景</div>
          </div>
          
          {/* Items */}
          <div className="space-y-2 mt-2">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-gray-800">{item.solution}</div>
                <div className="text-sm text-gray-600">{item.difficulty}</div>
                <div className="text-sm text-gray-600">{item.rendering}</div>
                <div className="text-sm text-gray-600">{item.obsidianCompatible}</div>
                <div className="text-sm text-gray-600">{item.useCase}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
