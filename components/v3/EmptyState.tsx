/**
 * 空状态组件（Phase 2.6）
 * 当用户没有创建卡片时显示
 */

'use client';

import Link from 'next/link';

interface EmptyStateProps {
  locale?: string;
}

export function EmptyState({ locale = 'en' }: EmptyStateProps) {
  const text = {
    en: {
      title: 'No Cards Yet',
      subtitle: 'Create your first goal card to start your journey',
      createButton: '✨ Create Your First Card',
    },
    zh: {
      title: '还没有卡片',
      subtitle: '创建你的第一张目标卡片，开始你的旅程',
      createButton: '✨ 创建第一张卡片',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl mb-6">📭</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{t.title}</h2>
        <p className="text-gray-600 mb-8">{t.subtitle}</p>
        <Link
          href={`/${locale}/create-card`}
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
        >
          {t.createButton}
        </Link>
      </div>
    </div>
  );
}

