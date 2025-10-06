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
  /* config options here */
};

// 导出包装后的配置
export default withNextIntl(nextConfig);
