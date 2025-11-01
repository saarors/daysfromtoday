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

        console.log('🔐 开始处理 Auth 回调...');
        console.log('📍 Code:', code?.slice(0, 10) + '...');
        console.log('📍 Redirect:', redirect);
        console.log('📍 当前 URL:', window.location.href);

        if (!code) {
          throw new Error('Missing auth code');
        }

        const supabase = createClient();

        // 方案 1: 使用 exchangeCodeForSession (PKCE 流程)
        console.log('🔄 尝试交换 code 为 session...');
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('❌ exchangeCodeForSession 失败:', exchangeError);
          console.error('错误详情:', JSON.stringify(exchangeError, null, 2));
          
          // 如果 exchangeCodeForSession 失败，尝试直接检查 session
          console.log('🔄 尝试直接获取 session...');
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !sessionData.session) {
            console.error('❌ 获取 session 也失败了:', sessionError);
            throw exchangeError; // 抛出原始错误
          }
          
          console.log('✅ 直接获取 session 成功（可能 session 已经存在）');
          console.log('👤 用户:', sessionData.session.user?.email);
        } else {
          console.log('✅ exchangeCodeForSession 成功!');
          console.log('👤 用户:', data.user?.email);
          console.log('🔑 Session:', data.session ? '已创建' : '未创建');
        }

        // 短暂延迟，确保 cookie 已设置
        console.log('⏳ 等待 cookie 设置...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 验证 session 是否真的存在
        const { data: finalSession } = await supabase.auth.getSession();
        console.log('🔍 最终 session 检查:', finalSession.session ? '✅ 存在' : '❌ 不存在');

        // 重定向到目标页面
        console.log('🚀 准备重定向到:', redirect);
        router.push(redirect);
        
      } catch (err) {
        console.error('❌ Auth 回调错误:', err);
        console.error('错误堆栈:', err instanceof Error ? err.stack : 'N/A');
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

