import React from 'react';

interface StatItem {
  label: string;
  value: string;
  trend?: string;
  color?: string;
}

interface StatCardProps {
  title: string;
  items: StatItem[];
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, items, className = "" }) => {
  return (
    <div className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm opacity-90">{item.label}</div>
            {item.trend && <div className="text-xs mt-1 opacity-75">{item.trend}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
