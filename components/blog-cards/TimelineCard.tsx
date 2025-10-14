import React from 'react';

interface TimelineItem {
  day: string;
  time: string;
  status: string;
  pages: string;
  note: string;
}

interface TimelineCardProps {
  title: string;
  items: TimelineItem[];
  className?: string;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ title, items, className = "" }) => {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 mb-4 border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-16 text-sm font-bold text-blue-600">{item.day}</div>
            <div className="w-20 text-sm text-gray-600">{item.time}</div>
            <div className="w-8 text-center text-lg">{item.status}</div>
            <div className="w-16 text-sm text-gray-600">{item.pages}</div>
            <div className="flex-1 text-sm text-gray-600">{item.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
