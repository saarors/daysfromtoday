/**
 * 目标卡片 Store
 * 使用 Zustand + LocalStorage 实现本地持久化
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CardData } from '@/types/card-template';
import { nanoid } from 'nanoid';

interface GoalCardStore {
  /** 所有卡片 */
  cards: CardData[];
  
  /** 添加卡片 */
  addCard: (card: Omit<CardData, 'id' | 'createdAt' | 'updatedAt'>) => CardData;
  
  /** 更新卡片 */
  updateCard: (id: string, updates: Partial<CardData>) => void;
  
  /** 删除卡片 */
  deleteCard: (id: string) => void;
  
  /** 获取单个卡片 */
  getCard: (id: string) => CardData | undefined;
  
  /** 获取所有卡片 */
  getAllCards: () => CardData[];
  
  /** 清空所有卡片 */
  clearCards: () => void;
  
  /** 获取卡片总数 */
  getCardCount: () => number;
}

export const useGoalCards = create<GoalCardStore>()(
  persist(
    (set, get) => ({
      cards: [],
      
      addCard: (card) => {
        const newCard: CardData = {
          ...card,
          id: nanoid(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          cards: [...state.cards, newCard]
        }));
        
        return newCard;
      },
      
      updateCard: (id, updates) => {
        set((state) => ({
          cards: state.cards.map(c => 
            c.id === id 
              ? { 
                  ...c, 
                  ...updates, 
                  updatedAt: new Date().toISOString() 
                } 
              : c
          )
        }));
      },
      
      deleteCard: (id) => {
        set((state) => ({
          cards: state.cards.filter(c => c.id !== id)
        }));
      },
      
      getCard: (id) => {
        return get().cards.find(c => c.id === id);
      },
      
      getAllCards: () => {
        return get().cards;
      },
      
      clearCards: () => {
        set({ cards: [] });
      },
      
      getCardCount: () => {
        return get().cards.length;
      },
    }),
    {
      name: 'goal-cards-storage',
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
    }
  )
);

