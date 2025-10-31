/**
 * 卡片类型选择器（Phase 2.6）
 * 选择"未来"或"过去"
 */

'use client';

import type { CardType } from '@/types/card-template';

interface CardTypeSelectorProps {
  value: CardType;
  onChange: (value: CardType) => void;
  locale?: string;
}

export function CardTypeSelector({ value, onChange, locale = 'en' }: CardTypeSelectorProps) {
  const text = {
    en: {
      future: '🔮 Future',
      past: '⏮️ Past',
    },
    zh: {
      future: '🔮 未来',
      past: '⏮️ 过去',
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange('future')}
        className={`
          flex-1 px-6 py-3 rounded-lg font-medium transition-all
          ${
            value === 'future'
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        {t.future}
      </button>
      <button
        type="button"
        onClick={() => onChange('past')}
        className={`
          flex-1 px-6 py-3 rounded-lg font-medium transition-all
          ${
            value === 'past'
              ? 'bg-purple-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}
      >
        {t.past}
      </button>
    </div>
  );
}

