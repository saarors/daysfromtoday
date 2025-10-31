/**
 * 卡片墙组件（Phase 2.6）
 * 展示所有创建的卡片
 */

'use client';

import type { CardData } from '@/types/card-template';
import { CardPreview } from './CardPreview';

interface CardGalleryProps {
  cards: CardData[];
  locale?: string;
}

export function CardGallery({ cards, locale = 'en' }: CardGalleryProps) {
  const text = {
    en: {
      title: 'My Cards',
      subtitle: `${cards.length} card${cards.length !== 1 ? 's' : ''}`,
    },
    zh: {
      title: '我的卡片',
      subtitle: `共 ${cards.length} 张卡片`,
    },
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">{t.title}</h2>
        <p className="text-gray-600 mt-2">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <CardPreview key={card.id} card={card} locale={locale} />
        ))}
      </div>
    </div>
  );
}

