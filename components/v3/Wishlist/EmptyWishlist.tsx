'use client';

/**
 * 愿望清单空状态组件
 * 当用户还没有创建任何愿望时显示
 */

import Link from 'next/link';

interface EmptyWishlistProps {
  locale: string;
}

export function EmptyWishlist({ locale }: EmptyWishlistProps) {
  const text = {
    en: {
      title: 'Your wishlist is empty',
      subtitle: 'Do you really have no thoughts about the future?',
      button: 'Back to Homepage',
      emoji: '🌠',
    },
    zh: {
      title: '你的愿望空空如也',
      subtitle: '你真的没有对未来的想法吗？',
      button: '返回首页',
      emoji: '🌠',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 空状态插图 */}
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-pulse">
            {t.emoji}
          </div>
        </div>

        {/* 文字 */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {t.title}
        </h2>
        <p className="text-base text-gray-600 mb-8">
          {t.subtitle}
        </p>

        {/* 返回按钮 */}
        <Link
          href={`/${locale}`}
          className="
            inline-block px-8 py-3 
            bg-blue-600 text-white rounded-lg font-semibold
            hover:bg-blue-700 hover:shadow-lg
            transition-all duration-200
            active:scale-95
          "
        >
          {t.button}
        </Link>
      </div>
    </div>
  );
}

