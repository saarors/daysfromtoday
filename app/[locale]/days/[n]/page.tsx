import { addDaysSafe } from '@/lib/date-utils';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface PageProps {
  params: Promise<{
    locale: string;
    n: string;
  }>;
}

// 预生成热门页面
export async function generateStaticParams() {
  const popularDays = [
    1, 2, 3, 5, 7, 10, 14, 15, 20, 21, 28, 30, 
    45, 60, 90, 100, 180, 365
  ];
  
  return popularDays.map(n => ({ n: n.toString() }));
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, n } = await params;
  const days = Number(n);
  const targetDate = addDaysSafe(new Date(), days);
  
  const title = `${days} Days from Today - ${format(targetDate, 'MMMM d, yyyy')}`;
  const description = `Calculate ${days} days from today. The date will be ${format(targetDate, 'EEEE, MMMM d, yyyy')}.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/days/${n}`,
      languages: {
        'en': `https://www.daysfromtoday.ai/en/days/${n}`,
        'zh': `https://www.daysfromtoday.ai/zh/days/${n}`,
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/days/${n}`,
      type: 'website',
      siteName: 'DaysFromToday',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function DaysFromTodayPage({ params }: PageProps) {
  const { n } = await params;
  const days = Number(n);
  
  // 计算目标日期
  const today = new Date();
  const targetDate = addDaysSafe(today, days);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {days} {days === 1 ? 'Day' : 'Days'} from Today
        </h1>
        <p className="text-xl text-gray-600">
          Calculate dates in the future with precision
        </p>
      </div>
      
      {/* Answer Card */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Target Date</CardTitle>
            <Badge variant="primary">Future</Badge>
          </div>
          <CardDescription>
            {days} {days === 1 ? 'day' : 'days'} from {format(today, 'MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {format(targetDate, 'MMM d, yyyy')}
            </div>
            <div className="text-2xl text-gray-600">
              {format(targetDate, 'EEEE')}
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Start Date</div>
              <div className="font-semibold text-gray-900">
                {format(today, 'MMM d, yyyy')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Days</div>
              <div className="font-semibold text-gray-900">
                {days} {days === 1 ? 'day' : 'days'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Result Date</div>
              <div className="font-semibold text-gray-900">
                {format(targetDate, 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': `What date is ${days} days from today?`,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': `${days} days from today is ${format(targetDate, 'EEEE, MMMM d, yyyy')}.`
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
