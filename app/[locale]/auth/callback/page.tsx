'use client';

/**
 * Supabase Auth 回调页面
 * 
 * 功能：
 * 1. 处理 Supabase 登录后的回调
 * 2. 交换 code 为 session
 * 3. 重定向到目标页面
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AuthCallbackProps {
  params: {
    locale: string;
  };
}

export default function AuthCallback({ params }: AuthCallbackProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { locale } = params;

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const redirect = searchParams.get('redirect') || `/${locale}`;

        if (!code) {
          throw new Error('Missing auth code');
        }

        console.log('🔐 处理 Auth 回调...');
        console.log('📍 Code:', code.slice(0, 10) + '...');
        console.log('📍 Redirect:', redirect);

        const supabase = createClient();

        // 交换 code 为 session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('❌ 交换 session 失败:', exchangeError);
          throw exchangeError;
        }

        console.log('✅ 登录成功!');
        console.log('👤 用户:', data.user?.email);

        // 短暂延迟，确保 session 已设置
        await new Promise(resolve => setTimeout(resolve, 500));

        // 重定向到目标页面
        console.log('🚀 重定向到:', redirect);
        router.push(redirect);
        
      } catch (err) {
        console.error('❌ Auth 回调错误:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [searchParams, router, locale]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">登录失败</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">正在登录...</h2>
        <p className="text-gray-600">请稍候，即将跳转</p>
      </div>
    </div>
  );
}

