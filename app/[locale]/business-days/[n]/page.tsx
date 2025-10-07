import { addBusinessDays } from '@/lib/bizdays';
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
    45, 60, 90
  ];
  
  return popularDays.map(n => ({ n: n.toString() }));
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, n } = await params;
  const days = Number(n);
  
  const title = `${days} Business Days from Today - Date Calculator`;
  const description = `Calculate ${days} business days from today, excluding weekends and holidays. Get the exact date for project planning and deadline management.`;
  
  return {
    title,
    description,
    keywords: ['business days calculator', 'working days', 'weekday calculator', 'project deadline'],
    alternates: {
      canonical: `https://www.daysfromtoday.ai/${locale}/business-days/${n}`,
      languages: {
        'en': `https://www.daysfromtoday.ai/en/business-days/${n}`,
        'zh': `https://www.daysfromtoday.ai/zh/business-days/${n}`,
      }
    },
    openGraph: {
      title,
      description,
      url: `https://www.daysfromtoday.ai/${locale}/business-days/${n}`,
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

export default async function BusinessDaysPage({ params }: PageProps) {
  const { n } = await params;
  const days = Number(n);
  
  // 计算工作日（默认 US）
  const today = new Date();
  const country = 'US'; // TODO: 从用户偏好获取
  const result = await addBusinessDays(today, days, country);
  
  const weekends = result.excludedDates.filter(d => d.reason === 'weekend');
  const holidays = result.excludedDates.filter(d => d.reason === 'holiday');
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {days} Business {days === 1 ? 'Day' : 'Days'} from Today
        </h1>
        <p className="text-xl text-gray-600">
          Excluding weekends and holidays
        </p>
      </div>
      
      {/* Answer Card */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Target Date</CardTitle>
            <Badge variant="success">Business Days</Badge>
          </div>
          <CardDescription>
            {days} business {days === 1 ? 'day' : 'days'} from {format(today, 'MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-cyan-600 mb-4">
              {format(result.targetDate, 'MMM d, yyyy')}
            </div>
            <div className="text-2xl text-gray-600">
              {format(result.targetDate, 'EEEE')}
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Start Date</div>
              <div className="font-semibold text-gray-900">
                {format(today, 'MMM d, yyyy')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Business Days</div>
              <div className="font-semibold text-gray-900">
                {days}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Calendar Days</div>
              <div className="font-semibold text-gray-900">
                {result.totalCalendarDays}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Excluded</div>
              <div className="font-semibold text-gray-900">
                {result.excludedDates.length}
              </div>
            </div>
          </div>
          
          {/* Excluded Dates Summary */}
          {result.excludedDates.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" size="sm">
                  {weekends.length} Weekends
                </Badge>
                {holidays.length > 0 && (
                  <Badge variant="warning" size="sm">
                    {holidays.length} Holidays
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                This calculation excludes {weekends.length} weekend days
                {holidays.length > 0 && ` and ${holidays.length} ${holidays.length === 1 ? 'holiday' : 'holidays'}`}.
              </p>
            </div>
          )}
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
                'name': `What date is ${days} business days from today?`,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': `${days} business days from today is ${format(result.targetDate, 'EEEE, MMMM d, yyyy')} (excluding weekends and holidays).`
                }
              },
              {
                '@type': 'Question',
                'name': 'What are business days?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Business days are weekdays (Monday through Friday) excluding public holidays. They are commonly used for project deadlines, shipping estimates, and financial transactions.'
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}

