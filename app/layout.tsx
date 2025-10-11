/**
 * 根布局组件（Next.js 15 要求）
 * 
 * 这个文件是 Next.js 15 的强制要求，必须包含 <html> 和 <body> 标签。
 * 实际的布局逻辑在 app/[locale]/layout.tsx 中处理。
 */
import type { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "DaysFromToday - Calculate Dates from Today",
  description: "Calculate dates from today with ease. Support for business days, weekdays, and holidays.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Next.js 14: 根布局必须包含 <html> 和 <body> 标签
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google Search Console 验证 */}
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
          <meta 
            name="google-site-verification" 
            content={process.env.NEXT_PUBLIC_GSC_VERIFICATION} 
          />
        )}
        
        {/* Theme Color */}
        <meta name="theme-color" content="#0069FF" />
        <meta name="color-scheme" content="light" />

        {/* Organization 结构化数据（JSON-LD）*/}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              'name': 'DaysFromToday',
              'alternateName': 'Days From Today',
              'url': 'https://www.daysfromtoday.ai',
              'logo': 'https://www.daysfromtoday.ai/logo.png',
              'sameAs': [
                'https://github.com/leeleon/daysfromtoday'
              ],
              'description': 'Calculate dates from today with ease',
              'founder': {
                '@type': 'Person',
                'name': 'Leon',
                'url': 'https://www.daysfromtoday.ai/en/faq'
              },
              'contactPoint': {
                '@type': 'ContactPoint',
                'contactType': 'Customer Support',
                'email': 'feedback@daysfromtoday.com',
                'availableLanguage': ['en', 'zh']
              }
            })
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
