/**
 * Next.js 配置文件
 * 
 * 集成：
 * 1. next-intl 国际化插件
 * 2. 保持其他默认配置
 * 
 * 符合项目规范：
 * - 使用 next-intl 路由（不使用 Next.js 内置 i18n）
 * - TypeScript 严格模式
 * - Edge Runtime 兼容
 */
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// 创建 next-intl 插件，指向 i18n 配置文件
const withNextIntl = createNextIntlPlugin('./i18n/config.ts');

const nextConfig: NextConfig = {
  // SEO 优化配置
  compress: true, // 启用 gzip 压缩
  
  // 生产环境优化
  reactStrictMode: true,
  
  // 图片优化配置
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // 国际化配置（由 next-intl 处理，这里保持默认）
  // i18n 配置已由 next-intl 中间件处理
};

// 导出包装后的配置
export default withNextIntl(nextConfig);
