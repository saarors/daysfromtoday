// app/ga-test/page.tsx
export default function GATest() {
  return (
    <main style={{ padding: 24 }}>
      <h1>GA Test Page</h1>
      <p>If you can see GA scripts in view-source on this page, injection works.</p>
      <hr />
      <h2>Verification Steps:</h2>
      <ol>
        <li>Right-click → View Page Source</li>
        <li>Search for: <code>GA_PROBE_ROOT</code></li>
        <li>Search for: <code>gtag/js?id=G-9D2SZK734G</code></li>
        <li>Open DevTools → Network → Search for: <code>gtag</code></li>
        <li>Check GA Realtime for active users</li>
      </ol>
    </main>
  );
}

