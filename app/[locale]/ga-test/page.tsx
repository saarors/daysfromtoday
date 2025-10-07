// app/[locale]/ga-test/page.tsx
export default function GATest() {
  return (
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>GA Test Page (Locale Route)</h1>
      <p>If you can see GA scripts in view-source on this page, injection works.</p>
      <hr />
      <h2>Verification Steps:</h2>
      <ol>
        <li>Right-click → View Page Source</li>
        <li>Search for: <code>GA_PROBE_ROOT</code> (from app/layout.tsx)</li>
        <li>Search for: <code>GA_PROBE_LOCALE</code> (from app/[locale]/layout.tsx)</li>
        <li>Search for: <code>gtag/js?id=G-9D2SZK734G</code></li>
        <li>Open DevTools → Network → Search for: <code>gtag</code></li>
        <li>Check GA Realtime for active users</li>
      </ol>
      
      <hr />
      <h2>Expected Results:</h2>
      <ul>
        <li>✅ Should see GA_PROBE_ROOT if root layout is active</li>
        <li>✅ Should see GA_PROBE_LOCALE if locale layout is active</li>
        <li>✅ Should see gtag script if GA is working</li>
      </ul>
    </main>
  );
}

