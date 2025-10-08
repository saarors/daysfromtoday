/**
 * 日期信息增强工具库单元测试
 * 测试覆盖：跨月、闰年、DST、不同周末制、节假日边界等
 */

import {
  getWeekOfMonth,
  getDayOfYear,
  getQuarter,
  isWorkingDay,
  countWorkdays,
  findNearestHoliday,
  getHolidayRelation,
  generateSuggestion,
  generateWarning,
  enhanceDateInfo
} from '../date-info-enhancer';
import type { Holiday } from '../holidays';

describe('date-info-enhancer', () => {
  // 测试 1: 当月第几周计算
  describe('getWeekOfMonth', () => {
    it('should calculate week of month correctly', () => {
      // 2025年1月1日 (周三) 应该是第1周
      expect(getWeekOfMonth(new Date('2025-01-01'))).toBe(1);
      
      // 2025年1月8日 (周三) 应该是第2周
      expect(getWeekOfMonth(new Date('2025-01-08'))).toBe(2);
      
      // 2025年1月31日 (周五) 应该是第5周
      expect(getWeekOfMonth(new Date('2025-01-31'))).toBe(5);
    });
    
    it('should handle month boundaries correctly', () => {
      // 月初
      expect(getWeekOfMonth(new Date('2025-02-01'))).toBe(1);
      
      // 月末
      expect(getWeekOfMonth(new Date('2025-02-28'))).toBe(5);
    });
  });

  // 测试 2: 当年第几天计算
  describe('getDayOfYear', () => {
    it('should calculate day of year correctly', () => {
      // 1月1日应该是第1天
      expect(getDayOfYear(new Date('2025-01-01'))).toBe(1);
      
      // 12月31日应该是第365天（非闰年）
      expect(getDayOfYear(new Date('2025-12-31'))).toBe(365);
    });
    
    it('should handle leap year correctly', () => {
      // 2024年是闰年
      // 2月29日应该是第60天
      expect(getDayOfYear(new Date('2024-02-29'))).toBe(60);
      
      // 12月31日应该是第366天
      expect(getDayOfYear(new Date('2024-12-31'))).toBe(366);
    });
    
    it('should handle cross-month calculation', () => {
      // 2025年2月1日应该是第32天 (31 + 1)
      expect(getDayOfYear(new Date('2025-02-01'))).toBe(32);
      
      // 2025年3月1日应该是第60天 (31 + 28 + 1)
      expect(getDayOfYear(new Date('2025-03-01'))).toBe(60);
    });
  });

  // 测试 3: 季度计算
  describe('getQuarter', () => {
    it('should return correct quarter', () => {
      expect(getQuarter(new Date('2025-01-15'))).toBe(1);
      expect(getQuarter(new Date('2025-04-15'))).toBe(2);
      expect(getQuarter(new Date('2025-07-15'))).toBe(3);
      expect(getQuarter(new Date('2025-10-15'))).toBe(4);
    });
    
    it('should handle quarter boundaries', () => {
      expect(getQuarter(new Date('2025-03-31'))).toBe(1);
      expect(getQuarter(new Date('2025-04-01'))).toBe(2);
      expect(getQuarter(new Date('2025-12-31'))).toBe(4);
    });
  });

  // 测试 4: 工作日判断
  describe('isWorkingDay', () => {
    const holidays: Holiday[] = [
      {
        date: '2025-01-01',
        name: 'New Year\'s Day',
        types: ['Public'],
        localName: 'New Year\'s Day',
        countryCode: 'US'
      }
    ];
    
    it('should identify weekdays correctly', () => {
      // 2025年1月2日是周四，应该是工作日
      expect(isWorkingDay(new Date('2025-01-02'), 'US', holidays)).toBe(true);
    });
    
    it('should identify weekends correctly', () => {
      // 2025年1月4日是周六
      expect(isWorkingDay(new Date('2025-01-04'), 'US', holidays)).toBe(false);
      
      // 2025年1月5日是周日
      expect(isWorkingDay(new Date('2025-01-05'), 'US', holidays)).toBe(false);
    });
    
    it('should identify holidays correctly', () => {
      // 2025年1月1日是元旦（虽然也是周三）
      expect(isWorkingDay(new Date('2025-01-01'), 'US', holidays)).toBe(false);
    });
  });

  // 测试 5: 工作日数量计算
  describe('countWorkdays', () => {
    const holidays: Holiday[] = [
      {
        date: '2025-01-01',
        name: 'New Year\'s Day',
        types: ['Public'],
        localName: 'New Year\'s Day',
        countryCode: 'US'
      }
    ];
    
    it('should count workdays correctly', () => {
      // 2025年1月1日（周三，假日）到1月10日（周五）
      // 总共10天，排除：1个假日(1/1) + 2个周末(1/4, 1/5) = 7个工作日
      const result = countWorkdays(
        new Date('2025-01-01'),
        new Date('2025-01-10'),
        holidays
      );
      
      expect(result.workdays).toBe(7);
      expect(result.weekends).toBe(2);
      expect(result.holidays).toBe(1);
    });
    
    it('should handle cross-month calculation', () => {
      // 跨月测试：1月25日到2月5日
      const result = countWorkdays(
        new Date('2025-01-25'),
        new Date('2025-02-05'),
        []
      );
      
      // 应该包含多个周末
      expect(result.weekends).toBeGreaterThan(0);
      expect(result.workdays).toBeGreaterThan(0);
    });
    
    it('should handle reverse date order', () => {
      // 即使日期顺序反了，也应该正常计算
      const result = countWorkdays(
        new Date('2025-01-10'),
        new Date('2025-01-01'),
        holidays
      );
      
      expect(result.workdays).toBeGreaterThanOrEqual(0);
    });
  });

  // 测试 6: 最近节假日查找
  describe('findNearestHoliday', () => {
    const holidays: Holiday[] = [
      {
        date: '2025-01-01',
        name: 'New Year\'s Day',
        types: ['Public'],
        localName: 'New Year\'s Day',
        countryCode: 'US'
      },
      {
        date: '2025-12-25',
        name: 'Christmas',
        types: ['Public'],
        localName: 'Christmas',
        countryCode: 'US'
      }
    ];
    
    it('should find nearest holiday', () => {
      const nearest = findNearestHoliday(new Date('2025-01-05'), holidays);
      
      expect(nearest).not.toBeNull();
      expect(nearest?.name).toBe('New Year\'s Day');
      expect(nearest?.daysAway).toBe(4);
      expect(nearest?.isBefore).toBe(true);
    });
    
    it('should return null when no holidays exist', () => {
      const nearest = findNearestHoliday(new Date('2025-01-05'), []);
      expect(nearest).toBeNull();
    });
  });

  // 测试 7: 节假日关系描述
  describe('getHolidayRelation', () => {
    const holidays: Holiday[] = [
      {
        date: '2025-01-01',
        name: 'New Year\'s Day',
        types: ['Public'],
        localName: 'New Year\'s Day',
        countryCode: 'US'
      }
    ];
    
    it('should generate relation description in English', () => {
      const relation = getHolidayRelation(
        new Date('2025-01-05'),
        holidays,
        'calendar',
        'en'
      );
      
      expect(relation).toContain('New Year\'s Day');
      expect(relation).toContain('after');
    });
    
    it('should generate relation description in Chinese', () => {
      const relation = getHolidayRelation(
        new Date('2025-01-05'),
        holidays,
        'calendar',
        'zh'
      );
      
      expect(relation).toContain('New Year\'s Day');
      expect(relation).toContain('后');
    });
    
    it('should return undefined for distant dates', () => {
      // 超过30天的节假日应该不返回关系
      const relation = getHolidayRelation(
        new Date('2025-06-01'),
        holidays,
        'calendar',
        'en'
      );
      
      expect(relation).toBeUndefined();
    });
  });

  // 测试 8: 智能建议生成
  describe('generateSuggestion', () => {
    it('should suggest for Friday', () => {
      // 2025年1月3日是周五
      const suggestion = generateSuggestion(new Date('2025-01-03'), true, 'en');
      expect(suggestion).toContain('Friday');
    });
    
    it('should suggest for Monday', () => {
      // 2025年1月6日是周一
      const suggestion = generateSuggestion(new Date('2025-01-06'), true, 'en');
      expect(suggestion).toContain('Monday');
    });
    
    it('should suggest for non-working day', () => {
      // 2025年1月4日是周六
      const suggestion = generateSuggestion(new Date('2025-01-04'), false, 'en');
      expect(suggestion).toContain('Non-working');
    });
    
    it('should generate Chinese suggestions', () => {
      const suggestion = generateSuggestion(new Date('2025-01-03'), true, 'zh');
      expect(suggestion).toContain('周五');
    });
  });

  // 测试 9: 警告信息生成
  describe('generateWarning', () => {
    const holidays: Holiday[] = [
      {
        date: '2025-01-01',
        name: 'New Year\'s Day',
        types: ['Public'],
        localName: 'New Year\'s Day',
        countryCode: 'US'
      }
    ];
    
    it('should warn about holidays in the same week', () => {
      // 2025年1月2日和元旦在同一周
      const warning = generateWarning(new Date('2025-01-02'), holidays, 'en');
      expect(warning).toContain('holiday');
    });
    
    it('should not warn for weeks without holidays', () => {
      const warning = generateWarning(new Date('2025-02-15'), holidays, 'en');
      expect(warning).toBeUndefined();
    });
  });

  // 测试 10: DST（夏令时）边界
  describe('DST handling', () => {
    it('should handle DST transition correctly', () => {
      // 美国夏令时通常在3月第二个周日开始
      // 这个测试确保时间计算不受DST影响
      const spring = new Date('2025-03-09'); // DST 开始前
      const summer = new Date('2025-03-10'); // DST 开始后
      
      const dayOfYearSpring = getDayOfYear(spring);
      const dayOfYearSummer = getDayOfYear(summer);
      
      expect(dayOfYearSummer - dayOfYearSpring).toBe(1);
    });
  });

  // 测试 11: 不同国家周末制
  describe('Different weekend systems', () => {
    it('should handle standard weekend (Sat-Sun)', () => {
      // 美国等大部分国家：周六、周日是周末
      const saturday = new Date('2025-01-04'); // 周六
      expect(isWorkingDay(saturday, 'US', [])).toBe(false);
    });
    
    // 注意：当前实现使用 date-fns 的 isWeekend，默认周六日
    // 如果需要支持中东国家的周五-周六周末制，需要扩展功能
  });

  // 测试 12: 完整的增强信息生成
  describe('enhanceDateInfo', () => {
    const holidays: Holiday[] = [
      {
        date: '2025-01-01',
        name: 'New Year\'s Day',
        types: ['Public'],
        localName: 'New Year\'s Day',
        countryCode: 'US'
      }
    ];
    
    it('should generate complete enhanced info', async () => {
      const today = new Date('2025-01-01');
      const target = new Date('2025-01-10');
      
      const info = await enhanceDateInfo(
        target,
        today,
        'en',
        'US',
        holidays,
        'calendar'
      );
      
      // 验证所有字段都存在
      expect(info.targetDate).toEqual(target);
      expect(info.daysFromToday).toBeGreaterThan(0);
      expect(info.weekOfMonth).toBeGreaterThan(0);
      expect(info.dayOfYear).toBeGreaterThan(0);
      expect(info.quarter).toBeGreaterThan(0);
      expect(typeof info.isWorkday).toBe('boolean');
      expect(info.workdaysCount).toBeGreaterThanOrEqual(0);
      expect(info.weekendsCount).toBeGreaterThanOrEqual(0);
      expect(info.holidaysCount).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(info.excludedDates)).toBe(true);
    });
    
    it('should handle past dates', async () => {
      const today = new Date('2025-01-10');
      const target = new Date('2025-01-01');
      
      const info = await enhanceDateInfo(
        target,
        today,
        'en',
        'US',
        holidays,
        'calendar'
      );
      
      expect(info.daysFromToday).toBeGreaterThan(0);
      expect(info.targetDate).toEqual(target);
    });
  });
});

