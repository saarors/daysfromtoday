/**
 * 用户菜单组件
 * 显示用户信息、菜单选项和登出功能
 */

'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import { useState } from 'react';

interface UserMenuProps {
  locale: string;
}

export function UserMenu({ locale }: UserMenuProps) {
  console.log('🎨 UserMenu component rendered');
  
  const router = useRouter();
  const supabase = createClient();
  
  // 使用全局认证状态
  const { user, loading, setUser, setLoading } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log('🔄 UserMenu useEffect triggered');

    let mounted = true;
    
    // 异步验证 session
    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!mounted) return;
      
      console.log('📦 Session:', session?.user?.email || 'No session');
      setUser(session?.user ?? null);
    };
    
    // 立即执行验证
    initializeAuth();
    
    // 监听后续的状态变化
    console.log('📞 Setting up auth listener...');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('🔔 Auth state changed:', event, session?.user?.email || 'No session');
      
      setUser(session?.user ?? null);
      setAvatarError(false); // 重置头像错误状态
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // 空依赖数组，只在组件挂载时执行一次
  
  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSignOut = async () => {
    console.log('🚪 handleSignOut started');
    
    try {
      // 1. 立即更新本地状态 - 让用户感觉立即退出
      setUser(null);
      setMenuOpen(false);
      console.log('👤 User state cleared immediately');
      
      // 2. 尝试 Supabase signOut（不阻塞用户体验）
      const supabase = createClient();
      console.log('📱 Supabase client created');
      
      // 异步执行 signOut，不等待结果
      supabase.auth.signOut().then(({ error }) => {
        if (error) {
          console.error('❌ Supabase signOut error:', error);
        } else {
          console.log('✅ Supabase signOut completed');
        }
      }).catch((error) => {
        console.error('❌ Supabase signOut failed:', error);
      });
      
      // 3. 立即跳转并刷新页面
      console.log(`🔀 Redirecting to /${locale}`);
      router.push(`/${locale}`);
      router.refresh();
      console.log('🔄 Router refresh called');
      
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };
  
  const text = {
    en: {
      signIn: 'Sign In',
      myCards: 'My Cards',
      settings: 'Settings',
      signOut: 'Sign Out',
    },
    zh: {
      signIn: '登录',
      myCards: '我的卡片',
      settings: '设置',
      signOut: '退出登录',
    },
  };
  
  const t = text[locale as 'en' | 'zh'] || text.en;
  
  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }
  
  if (!user) {
    return (
      <button
        onClick={() => router.push(`/${locale}/auth`)}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
      >
        {t.signIn}
      </button>
    );
  }
  
  // 获取用户头像和名称
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  
  // 智能生成首字母缩写
  const getInitials = (name: string | undefined): string => {
    if (!name) return '?';
    
    // 如果是邮箱，取邮箱用户名的前两个字母
    if (name.includes('@')) {
      const username = name.split('@')[0];
      return username.slice(0, 2).toUpperCase();
    }
    
    // 如果是名称，取每个单词的首字母
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    
    // 单个单词，取前两个字母
    return name.slice(0, 2).toUpperCase();
  };
  
  const initials = getInitials(displayName);
  
  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => {
          console.log('🔘 UserMenu clicked, current state:', menuOpen);
          setMenuOpen(!menuOpen);
        }}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        aria-label="User menu"
      >
        {avatarUrl && !avatarError ? (
          <img
            src={avatarUrl}
            alt={displayName || 'User'}
            className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
            onError={() => {
              console.warn('❌ Avatar failed to load:', avatarUrl);
              setAvatarError(true);
            }}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-gray-200">
            {initials}
          </div>
        )}
      </button>
      
      {/* Dropdown Menu */}
      {menuOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
          onClick={(e) => {
            console.log('📋 Menu container clicked');
            e.stopPropagation();
          }}
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
          
          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/${locale}/my-cards`);
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t.myCards}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/${locale}/settings`);
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t.settings}
            </button>
          </div>
          
          {/* Sign Out */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡到 Menu container
                console.log('🚪 Sign Out button clicked!');
                handleSignOut();
              }}
              type="button"
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t.signOut}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

