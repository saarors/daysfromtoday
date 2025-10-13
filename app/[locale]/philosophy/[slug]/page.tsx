import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PhilosophyPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  // Philosophy pages are no longer supported - redirect to blog
  return [];
}

export async function generateMetadata({ params }: PhilosophyPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: 'Philosophy Not Found | DaysFromToday',
    description: 'This philosophy page is no longer available. Please visit our blog for similar content.',
  };
}

export default function PhilosophyPage({ params }: PhilosophyPageProps) {
  // Philosophy pages are no longer supported - return 404
  notFound();
}