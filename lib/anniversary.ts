/**
 * 纪念日功能 - 数据结构和工具函数
 * 
 * 功能：
 * - 纪念日数据管理 (localStorage)
 * - 倒计时计算
 * - 多语言支持
 * - 数据验证和格式化
 */

export interface Anniversary {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD 格式
  type: 'birthday' | 'anniversary' | 'holiday' | 'custom';
  isRecurring: boolean; // 是否每年重复
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnniversaryCountdown {
  anniversary: Anniversary;
  daysUntil: number;
  isToday: boolean;
  isPast: boolean;
  nextOccurrence: string; // 下次发生日期
}

/**
 * 纪念日存储管理
 */
export class AnniversaryStorage {
  private static readonly STORAGE_KEY = 'daysfromtoday_anniversaries';

  /**
   * 获取所有纪念日
   */
  static getAll(): Anniversary[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load anniversaries:', error);
      return [];
    }
  }

  /**
   * 保存纪念日
   */
  static save(anniversary: Anniversary): void {
    if (typeof window === 'undefined') return;
    
    try {
      const all = this.getAll();
      const existingIndex = all.findIndex(a => a.id === anniversary.id);
      
      if (existingIndex >= 0) {
        all[existingIndex] = { ...anniversary, updatedAt: new Date().toISOString() };
      } else {
        all.push(anniversary);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    } catch (error) {
      console.error('Failed to save anniversary:', error);
    }
  }

  /**
   * 删除纪念日
   */
  static delete(id: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const all = this.getAll();
      const filtered = all.filter(a => a.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete anniversary:', error);
    }
  }

  /**
   * 根据ID获取纪念日
   */
  static getById(id: string): Anniversary | null {
    const all = this.getAll();
    return all.find(a => a.id === id) || null;
  }
}

/**
 * 纪念日计算工具
 */
export class AnniversaryCalculator {
  /**
   * 计算纪念日倒计时
   */
  static calculateCountdown(anniversary: Anniversary): AnniversaryCountdown {
    const today = new Date();
    const targetDate = new Date(anniversary.date);
    
    // 如果是每年重复的纪念日，计算今年的日期
    if (anniversary.isRecurring) {
      const currentYear = today.getFullYear();
      targetDate.setFullYear(currentYear);
      
      // 如果今年的日期已经过了，计算明年的日期
      if (targetDate < today) {
        targetDate.setFullYear(currentYear + 1);
      }
    }

    const timeDiff = targetDate.getTime() - today.getTime();
    const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return {
      anniversary,
      daysUntil,
      isToday: daysUntil === 0,
      isPast: daysUntil < 0,
      nextOccurrence: targetDate.toISOString().split('T')[0]
    };
  }

  /**
   * 获取所有纪念日的倒计时
   */
  static getAllCountdowns(): AnniversaryCountdown[] {
    const anniversaries = AnniversaryStorage.getAll();
    return anniversaries
      .map(anniversary => this.calculateCountdown(anniversary))
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }

  /**
   * 获取即将到来的纪念日（7天内）
   */
  static getUpcoming(days: number = 7): AnniversaryCountdown[] {
    return this.getAllCountdowns().filter(countdown => 
      countdown.daysUntil >= 0 && countdown.daysUntil <= days
    );
  }

  /**
   * 获取今天的纪念日
   */
  static getToday(): AnniversaryCountdown[] {
    return this.getAllCountdowns().filter(countdown => countdown.isToday);
  }
}

/**
 * 纪念日验证工具
 */
export class AnniversaryValidator {
  /**
   * 验证纪念日数据
   */
  static validate(anniversary: Partial<Anniversary>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!anniversary.name || anniversary.name.trim().length === 0) {
      errors.push('纪念日名称不能为空');
    }

    if (!anniversary.date) {
      errors.push('纪念日日期不能为空');
    } else {
      const date = new Date(anniversary.date);
      if (isNaN(date.getTime())) {
        errors.push('纪念日日期格式不正确');
      }
    }

    if (!anniversary.type) {
      errors.push('纪念日类型不能为空');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 生成唯一ID
   */
  static generateId(): string {
    return `anniversary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * 纪念日类型配置
 */
export const ANNIVERSARY_TYPES = {
  birthday: {
    name: '生日',
    nameEn: 'Birthday',
    icon: '🎂',
    color: 'bg-pink-100 text-pink-800'
  },
  anniversary: {
    name: '纪念日',
    nameEn: 'Anniversary',
    icon: '💕',
    color: 'bg-red-100 text-red-800'
  },
  holiday: {
    name: '节日',
    nameEn: 'Holiday',
    icon: '🎉',
    color: 'bg-green-100 text-green-800'
  },
  custom: {
    name: '自定义',
    nameEn: 'Custom',
    icon: '⭐',
    color: 'bg-blue-100 text-blue-800'
  }
} as const;

/**
 * 格式化日期显示
 */
export function formatAnniversaryDate(date: string, locale: string = 'en'): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', options);
}

/**
 * 格式化倒计时显示
 */
export function formatCountdown(daysUntil: number, locale: string = 'en'): string {
  if (daysUntil === 0) {
    return locale === 'zh' ? '今天' : 'Today';
  } else if (daysUntil === 1) {
    return locale === 'zh' ? '明天' : 'Tomorrow';
  } else if (daysUntil > 0) {
    return locale === 'zh' ? `${daysUntil} 天后` : `In ${daysUntil} days`;
  } else {
    const daysAgo = Math.abs(daysUntil);
    return locale === 'zh' ? `${daysAgo} 天前` : `${daysAgo} days ago`;
  }
}
