// app/[locale]/ga-test/page.tsx
import Script from 'next/script';

export default function GATest() {
  return (
    <>
      {/* 直接在页面中硬编码 GA - 绕过布局 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-9D2SZK734G"
        strategy="afterInteractive"
      />
      <Script id="ga-inline" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9D2SZK734G', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        {/* 页面内探针 - 确认这个页面组件被渲染了 */}
        <div style={{ display: 'none' }} id="PAGE_PROBE_GATEST">PAGE_PROBE_GATEST</div>
        
        <h1>🔬 GA Test Page (Direct Script Injection)</h1>
        <p style={{ background: '#fff3cd', padding: '1em', border: '1px solid #ffc107', borderRadius: 4 }}>
          ⚠️ This page has GA script <strong>directly embedded</strong> in the page component, 
          bypassing all layouts. If GA still doesn't work here, it's a Vercel deployment issue.
        </p>
        
        <hr />
        <h2>Verification Steps:</h2>
        <ol>
          <li>Right-click → View Page Source</li>
          <li>Search for: <code>PAGE_PROBE_GATEST</code> (confirms this page rendered)</li>
          <li>Search for: <code>gtag/js?id=G-9D2SZK734G</code> (GA script)</li>
          <li>Open DevTools → Network → Search for: <code>gtag</code></li>
          <li>Open Console → Type: <code>typeof gtag</code> (should return "function")</li>
          <li>Check GA Realtime for active users</li>
        </ol>
        
        <hr />
        <h2>Current Deployment Info:</h2>
        <p>Latest Git commit: <code>9b6e066</code></p>
        <p>If you can see this page but NOT the PAGE_PROBE_GATEST in source, Vercel is serving old build.</p>
      </main>
    </>
  );
}

