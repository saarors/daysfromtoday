import React from 'react';

interface DataItem {
  label: string;
  value: string;
}

interface DataCardProps {
  title: string;
  items: DataItem[];
  className?: string;
}

export const DataCard: React.FC<DataCardProps> = ({ title, items, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="text-gray-600">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
