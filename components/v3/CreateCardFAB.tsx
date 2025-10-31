/**
 * 创建卡片浮动按钮（Phase 2.6）
 * 固定在页面右下角的快捷创建按钮
 */

'use client';

import Link from 'next/link';

interface CreateCardFABProps {
  locale?: string;
}

export function CreateCardFAB({ locale = 'en' }: CreateCardFABProps) {
  const text = {
    en: {
      create: 'Create Card',
    },
    zh: {
      create: '创建卡片',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <Link
      href={`/${locale}/create-card`}
      className="fixed bottom-8 right-8 z-50 group"
      aria-label={t.create}
    >
      <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 group-hover:pr-8">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="font-semibold hidden group-hover:inline-block">
          {t.create}
        </span>
      </div>
    </Link>
  );
}

