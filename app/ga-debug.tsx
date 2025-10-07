/**
 * Google Analytics 调试组件
 * 
 * 功能：在浏览器 Console 中打印 GA ID 状态
 * 用途：验证环境变量是否正确注入到客户端
 * 
 * 使用后可以删除此文件
 */
'use client';

import { useEffect } from 'react';

export default function GADebug() {
  useEffect(() => {
    console.log('🔍 GA Debug Info:');
    console.log('  - GA_ID from env:', process.env.NEXT_PUBLIC_GA_ID);
    console.log('  - typeof gtag:', typeof window.gtag);
    console.log('  - dataLayer:', window.dataLayer);
  }, []);

  return null;
}

