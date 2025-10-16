/**
 * 认证页面 - 登录/注册
 * 支持 Google OAuth 和 Magic Link
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || `/${params.locale}`;
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const supabase = createClient();
  
  // Google 登录
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Google 登录失败' });
      setLoading(false);
    }
  };
  
  // Magic Link 登录
  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: '请输入邮箱地址' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });
      
      if (error) throw error;
      
      setMessage({
        type: 'success',
        text: '已发送登录链接到您的邮箱，请查收！',
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Magic Link 发送失败' });
    } finally {
      setLoading(false);
    }
  };
  
  const text = {
    en: {
      signin: 'Sign In',
      signup: 'Sign Up',
      signinTitle: 'Welcome Back',
      signupTitle: 'Create Account',
      signinSubtitle: 'Sign in to access your goal cards',
      signupSubtitle: 'Start tracking your goals today',
      googleButton: 'Continue with Google',
      orDivider: 'OR',
      emailPlaceholder: 'Enter your email',
      magicLinkButton: 'Send Magic Link',
      switchToSignup: "Don't have an account?",
      switchToSignin: 'Already have an account?',
      backToHome: 'Back to Home',
    },
    zh: {
      signin: '登录',
      signup: '注册',
      signinTitle: '欢迎回来',
      signupTitle: '创建账户',
      signinSubtitle: '登录以访问你的目标卡片',
      signupSubtitle: '开始追踪你的目标',
      googleButton: '使用 Google 继续',
      orDivider: '或',
      emailPlaceholder: '输入你的邮箱',
      magicLinkButton: '发送登录链接',
      switchToSignup: '还没有账户？',
      switchToSignin: '已有账户？',
      backToHome: '返回首页',
    },
  };
  
  const t = text[params.locale as 'en' | 'zh'] || text.en;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link href={`/${params.locale}`} className="block mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient-calendly">DaysFromToday</h1>
            <p className="text-gray-600 mt-2 text-sm">{t.backToHome}</p>
          </div>
        </Link>
        
        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'signin' ? t.signinTitle : t.signupTitle}
            </h2>
            <p className="text-gray-600 mt-2">
              {mode === 'signin' ? t.signinSubtitle : t.signupSubtitle}
            </p>
          </div>
          
          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}
          
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t.googleButton}
          </button>
          
          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">{t.orDivider}</span>
            </div>
          </div>
          
          {/* Magic Link Form */}
          <form onSubmit={handleMagicLinkSignIn}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            />
            
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? '发送中...' : t.magicLinkButton}
            </button>
          </form>
          
          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {mode === 'signin' ? t.switchToSignup : t.switchToSignin}{' '}
              <span className="text-blue-600 font-medium">
                {mode === 'signin' ? t.signup : t.signin}
              </span>
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

