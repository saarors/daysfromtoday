/**
 * 用户上下文状态管理（Zustand）
 * 管理国家选择和持久化
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CountryCode, UserContext } from '@/types/user-context';
import { DEFAULT_COUNTRY } from '@/lib/country-config';

interface UserContextStore extends Omit<UserContext, 'locale'> {
  // Actions
  setCountry: (country: CountryCode) => void;
  initializeFromServer: (country: CountryCode, source: 'auto' | 'user') => void;
}

/**
 * 用户上下文 Store
 * 
 * 特点：
 * - 持久化到 localStorage
 * - 自动同步到 Cookie
 * - SSR 友好
 */
export const useUserContext = create<UserContextStore>()(
  persist(
    (set) => ({
      // 初始状态
      country: DEFAULT_COUNTRY,
      source: 'auto',
      lastUpdated: new Date().toISOString(),
      
      // 设置国家
      setCountry: (country: CountryCode) => {
        set({ 
          country, 
          source: 'user', 
          lastUpdated: new Date().toISOString() 
        });
        
        // 同步到 Cookie（180 天有效期）
        if (typeof document !== 'undefined') {
          const maxAge = 180 * 24 * 60 * 60; // 180 days in seconds
          document.cookie = `cc=${country}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
      },
      
      // 从服务端初始化（首次加载时）
      initializeFromServer: (country: CountryCode, source: 'auto' | 'user') => {
        set({ 
          country, 
          source, 
          lastUpdated: new Date().toISOString() 
        });
      }
    }),
    {
      name: 'user-context-storage',
      storage: createJSONStorage(() => {
        // SSR 安全的 storage
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
          };
        }
        return localStorage;
      }),
      // 仅持久化这些字段
      partialize: (state) => ({ 
        country: state.country,
        source: state.source
      })
    }
  )
);

/**
 * 从 Cookie 读取国家代码
 */
export function getCountryFromCookie(): CountryCode | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'cc') {
      return value as CountryCode;
    }
  }
  return null;
}

/**
 * 服务端：从 Cookie 字符串读取国家代码
 */
export function getCountryFromCookieString(cookieString: string): CountryCode | null {
  const cookies = cookieString.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'cc') {
      return value as CountryCode;
    }
  }
  return null;
}

