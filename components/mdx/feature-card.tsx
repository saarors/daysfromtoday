/**
 * FeatureCard - 功能跳转卡片组件
 * 
 * 用途: 展示产品功能，引导用户跳转
 * 使用场景: 所有类型文章的结尾
 */

import Link from 'next/link';

interface FeatureCardProps {
  icon: string;                // 图标名称（必填）
  title: string;               // 标题（必填）
  description: string;         // 描述（必填）
  link: string;                // 跳转链接（必填）
  cta?: string;                // 按钮文字（默认 "了解更多"）
}

// 简单的图标映射（实际项目可使用 react-icons 或其他图标库）
const iconMap: Record<string, string> = {
  calendar: '📅',
  clock: '⏰',
  chart: '📊',
  calculator: '🧮',
  star: '⭐',
  heart: '❤️',
  bookmark: '🔖',
  bell: '🔔',
};

export function FeatureCard({
  icon,
  title,
  description,
  link,
  cta = '了解更多',
}: FeatureCardProps) {
  return (
    <Link
      href={link}
      className="block my-8 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
    >
      <div className="flex items-start gap-4">
        {/* 图标 */}
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg text-2xl group-hover:scale-110 transition-transform">
          {iconMap[icon] || iconMap.star}
        </div>

        {/* 内容 */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {description}
          </p>
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
            {cta} →
          </span>
        </div>
      </div>
    </Link>
  );
}

