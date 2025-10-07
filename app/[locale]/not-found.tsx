import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface NotFoundProps {
  params: { locale: string };
}

export default async function NotFound({ params }: NotFoundProps) {
  const t = await getTranslations('NotFound');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('title')}</h2>
        <p className="text-gray-600 mb-8">
          {t('description')}
        </p>
        <Link
          href={`/${params.locale}`}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('goHome')}
        </Link>
      </div>
    </div>
  );
}

