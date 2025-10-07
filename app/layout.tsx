// app/layout.tsx - 根布局
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* PROBE: 这行用于在 view-source 搜索定位根布局是否生效 */}
        <div id="GA_PROBE_ROOT" style={{ display: 'none' }}>GA_PROBE_ROOT</div>

        {children}

        {/* 先硬编码 GA ID，验证插入路径（定位用，通过后会改回 env） */}
        <GoogleAnalytics gaId="G-9D2SZK734G" />
      </body>
    </html>
  );
}

