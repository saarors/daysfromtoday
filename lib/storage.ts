/**
 * LocalStorage 封装（类型安全）
 */
export const storage = {
  /**
   * 从 localStorage 读取数据
   * @param key - 键名
   * @param defaultValue - 默认值
   * @returns 数据或默认值
   */
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },
  
  /**
   * 写入数据到 localStorage
   * @param key - 键名
   * @param value - 数据
   */
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },
  
  /**
   * 从 localStorage 删除数据
   * @param key - 键名
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
  
  /**
   * 清空 localStorage
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }
};

// 用户偏好接口
export interface UserPreferences {
  country: string;
  timezone: string;
  locale: string;
}

/**
 * 用户偏好管理
 */
export const preferences = {
  /**
   * 获取用户偏好
   * @returns 用户偏好
   */
  get(): UserPreferences {
    return storage.get<UserPreferences>('user_preferences', {
      country: 'US',
      timezone: 'America/New_York',
      locale: 'en'
    });
  },
  
  /**
   * 设置用户偏好
   * @param prefs - 部分偏好（会与现有偏好合并）
   */
  set(prefs: Partial<UserPreferences>): void {
    const current = this.get();
    storage.set('user_preferences', { ...current, ...prefs });
  },
  
  /**
   * 重置用户偏好
   */
  reset(): void {
    storage.remove('user_preferences');
  }
};

// 纪念日接口
export interface Anniversary {
  id: string;
  title: string;
  date: string;         // ISO 8601
  type: 'birthday' | 'wedding' | 'dating' | 'work' | 'custom';
  recurring: boolean;   // 是否每年重复
  emoji: string;
  createdAt: string;    // ISO 8601
}

/**
 * 纪念日管理
 */
export const anniversaries = {
  /**
   * 获取所有纪念日
   * @returns 纪念日数组
   */
  getAll(): Anniversary[] {
    return storage.get<Anniversary[]>('anniversaries', []);
  },
  
  /**
   * 添加纪念日
   * @param anniversary - 纪念日（不含 id 和 createdAt）
   * @returns 新增的纪念日
   */
  add(anniversary: Omit<Anniversary, 'id' | 'createdAt'>): Anniversary {
    const newAnniversary: Anniversary = {
      ...anniversary,
      id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    const all = this.getAll();
    all.push(newAnniversary);
    storage.set('anniversaries', all);
    
    return newAnniversary;
  },
  
  /**
   * 删除纪念日
   * @param id - 纪念日 ID
   */
  delete(id: string): void {
    const all = this.getAll();
    const filtered = all.filter(a => a.id !== id);
    storage.set('anniversaries', filtered);
  },
  
  /**
   * 更新纪念日
   * @param id - 纪念日 ID
   * @param updates - 更新的字段
   */
  update(id: string, updates: Partial<Omit<Anniversary, 'id' | 'createdAt'>>): void {
    const all = this.getAll();
    const index = all.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error(`Anniversary not found: ${id}`);
    }
    
    all[index] = { ...all[index], ...updates };
    storage.set('anniversaries', all);
  },
  
  /**
   * 清空所有纪念日
   */
  clear(): void {
    storage.remove('anniversaries');
  }
};

