# DaysFromToday 功能增强计划

**文档版本：** v1.0  
**创建日期：** 2025-01-07  
**设计参考：** [Calendly UI 设计](https://calendly.com/)  
**目标：** 从简单工具 → 专业日期计算平台

---

## 📋 目录

1. [功能概览](#功能概览)
2. [UI/UX 设计方案](#uiux-设计方案)
3. [详细实施计划](#详细实施计划)
4. [技术架构](#技术架构)
5. [国家/地区支持](#国家地区支持)
6. [博客系统](#博客系统)
7. [实施时间表](#实施时间表)

---

## 🎯 功能概览

### **当前状态 vs 目标状态**

| 功能模块 | 当前 | 目标 |
|---------|------|------|
| **日期计算方向** | 仅未来（+N 天） | 未来 + 过去（±N 天）分离 |
| **日期类型** | 仅自然日 | 自然日 + 工作日 |
| **节假日感知** | 无 | 多国节假日支持 |
| **个性化功能** | 无 | 纪念日/倒计时 |
| **国家/地区** | 无区分 | 自动识别 + 手动选择 |
| **内容模块** | 简单 FAQ | 完整博客系统 |

---

## 🎨 UI/UX 设计方案

### **参考 Calendly 的设计理念**

基于 [Calendly 的模块化设计](https://calendly.com/)，我们采用：

**核心设计元素：**
1. **卡片化布局** - 每个功能模块独立卡片
2. **渐变背景** - 柔和的蓝紫色渐变
3. **大字体标题** - 清晰的层级结构
4. **丰富的视觉元素** - 插图、图标、数据展示
5. **响应式网格** - 适配各种屏幕尺寸

### **新版首页布局**

```
┌─────────────────────────────────────────┐
│  Header (固定导航)                       │
├─────────────────────────────────────────┤
│                                          │
│  Hero Section                            │
│  "Easy Date Calculation Ahead"           │
│  快速计算表单                             │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  功能模块展示区（4 个主要模块）            │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐│
│  │未来  │  │过去  │  │工作日│  │纪念日││
│  │计算  │  │计算  │  │计算  │  │计算  ││
│  └──────┘  └──────┘  └──────┘  └──────┘│
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  使用场景展示（Why Choose Us）            │
│  ┌────────────┐  ┌────────────┐         │
│  │项目管理    │  │个人规划    │         │
│  └────────────┘  └────────────┘         │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  国家/地区选择器                          │
│  支持的国家展示                           │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  博客/资源中心                            │
│  最新文章预览                             │
│                                          │
└─────────────────────────────────────────┘
```

---

## 📐 详细实施计划

### **功能 1：未来/过去日期计算（分离模块）**

#### **设计方案**

```tsx
// app/[locale]/page.tsx - 首页改版

<section className="hero-section">
  <div className="container">
    <h1>Easy Date Calculation Ahead</h1>
    <p>Calculate future or past dates with precision</p>
    
    {/* 双选项卡 */}
    <Tabs defaultValue="future">
      <TabsList>
        <TabsTrigger value="future">
          <CalendarPlus className="icon" />
          Future Dates
        </TabsTrigger>
        <TabsTrigger value="past">
          <CalendarMinus className="icon" />
          Past Dates
        </TabsTrigger>
      </TabsList>
      
      {/* 未来日期计算 */}
      <TabsContent value="future">
        <CalculatorCard>
          <Label>How many days from today?</Label>
          <Input 
            type="number" 
            placeholder="14" 
            min="1"
          />
          <Button>Calculate Future Date</Button>
        </CalculatorCard>
      </TabsContent>
      
      {/* 过去日期计算 */}
      <TabsContent value="past">
        <CalculatorCard>
          <Label>How many days ago?</Label>
          <Input 
            type="number" 
            placeholder="14" 
            min="1"
          />
          <Button>Calculate Past Date</Button>
        </CalculatorCard>
      </TabsContent>
    </Tabs>
  </div>
</section>
```

#### **路由结构**

```typescript
// 新的路由设计
/en/days/future/14    // 14 天后
/en/days/past/14      // 14 天前
/en/days/14           // 向后兼容（默认未来）

// app/[locale]/days/[direction]/[days]/page.tsx
export async function generateStaticParams() {
  const days = [1, 2, 3, 5, 7, 10, 14, 15, 20, 21, 28, 30, 45, 60, 90, 180, 365];
  const directions = ['future', 'past'];
  
  return directions.flatMap(direction => 
    days.map(day => ({
      direction,
      days: day.toString()
    }))
  );
}

export default function DateCalculationPage({ params }) {
  const { direction, days } = params;
  const isFuture = direction === 'future';
  
  const targetDate = isFuture 
    ? addDays(new Date(), Number(days))
    : subDays(new Date(), Number(days));
    
  return (
    <ResultPage
      title={`${days} Days ${isFuture ? 'from' : 'before'} Today`}
      targetDate={targetDate}
      direction={direction}
      days={Number(days)}
    />
  );
}
```

#### **结果页面设计**

```tsx
// components/ResultPage.tsx
export function ResultPage({ title, targetDate, direction, days }) {
  return (
    <div className="result-container">
      {/* Hero 答案卡片 */}
      <div className="answer-card">
        <div className="icon-badge">
          {direction === 'future' ? <CalendarPlus /> : <CalendarMinus />}
        </div>
        <h1>{title}</h1>
        <div className="result-date">
          <span className="date">{format(targetDate, 'MMMM d, yyyy')}</span>
          <span className="day">{format(targetDate, 'EEEE')}</span>
        </div>
      </div>
      
      {/* 详细信息 */}
      <div className="details-grid">
        <InfoCard title="Start Date" value={format(new Date(), 'MMM d, yyyy')} />
        <InfoCard title="Days" value={days} />
        <InfoCard title="Direction" value={direction === 'future' ? 'Forward' : 'Backward'} />
        <InfoCard title="Result Date" value={format(targetDate, 'MMM d, yyyy')} />
      </div>
      
      {/* 时间线可视化 */}
      <Timeline
        startDate={new Date()}
        endDate={targetDate}
        direction={direction}
      />
    </div>
  );
}
```

---

### **功能 2：自然日 vs 工作日计算**

#### **设计方案**

```tsx
// components/BusinessDaysCalculator.tsx
export function BusinessDaysCalculator() {
  const [days, setDays] = useState(14);
  const [calculationType, setCalculationType] = useState<'calendar' | 'business'>('calendar');
  const [country, setCountry] = useState('US');
  
  const result = useMemo(() => {
    if (calculationType === 'calendar') {
      return {
        targetDate: addDays(new Date(), days),
        type: 'Calendar Days',
        excludedDates: []
      };
    } else {
      // 计算工作日（排除周末和节假日）
      const result = addBusinessDays(new Date(), days, country);
      return {
        targetDate: result.date,
        type: 'Business Days',
        excludedDates: result.excluded // 被排除的日期
      };
    }
  }, [days, calculationType, country]);
  
  return (
    <div className="calculator-card">
      {/* 计算类型选择 */}
      <div className="type-selector">
        <RadioGroup value={calculationType} onValueChange={setCalculationType}>
          <RadioOption value="calendar">
            <Calendar className="icon" />
            <div>
              <Label>Calendar Days</Label>
              <Description>Including weekends and holidays</Description>
            </div>
          </RadioOption>
          
          <RadioOption value="business">
            <Briefcase className="icon" />
            <div>
              <Label>Business Days</Label>
              <Description>Excluding weekends and holidays</Description>
            </div>
          </RadioOption>
        </RadioGroup>
      </div>
      
      {/* 国家选择（仅工作日模式显示）*/}
      {calculationType === 'business' && (
        <CountrySelector value={country} onChange={setCountry} />
      )}
      
      {/* 天数输入 */}
      <Input 
        type="number" 
        value={days} 
        onChange={(e) => setDays(Number(e.target.value))}
        label={`Number of ${calculationType === 'business' ? 'Business' : 'Calendar'} Days`}
      />
      
      {/* 结果展示 */}
      <ResultCard>
        <div className="result-header">
          <h3>{result.type} Calculation</h3>
          <Badge>{format(result.targetDate, 'MMM d, yyyy')}</Badge>
        </div>
        
        {/* 排除的日期展示（工作日模式）*/}
        {calculationType === 'business' && result.excludedDates.length > 0 && (
          <ExcludedDatesList dates={result.excludedDates} />
        )}
      </ResultCard>
    </div>
  );
}
```

#### **工作日计算逻辑**

```typescript
// utils/business-days.ts
import { addDays, isWeekend, format } from 'date-fns';
import { getHolidays } from './holidays';

export interface BusinessDayResult {
  date: Date;
  excluded: Array<{
    date: Date;
    reason: 'weekend' | 'holiday';
    name?: string; // 节假日名称
  }>;
  totalCalendarDays: number;
  totalBusinessDays: number;
}

export function addBusinessDays(
  startDate: Date,
  businessDays: number,
  country: string
): BusinessDayResult {
  const excluded = [];
  let currentDate = new Date(startDate);
  let remainingDays = businessDays;
  let totalDays = 0;
  
  // 获取该国家的节假日
  const holidays = getHolidays(country, startDate.getFullYear());
  const holidayDates = new Set(holidays.map(h => format(h.date, 'yyyy-MM-dd')));
  
  while (remainingDays > 0) {
    currentDate = addDays(currentDate, 1);
    totalDays++;
    
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    
    // 检查是否是周末
    if (isWeekend(currentDate)) {
      excluded.push({
        date: new Date(currentDate),
        reason: 'weekend'
      });
      continue;
    }
    
    // 检查是否是节假日
    if (holidayDates.has(dateKey)) {
      const holiday = holidays.find(h => format(h.date, 'yyyy-MM-dd') === dateKey);
      excluded.push({
        date: new Date(currentDate),
        reason: 'holiday',
        name: holiday?.name
      });
      continue;
    }
    
    // 是工作日，计数减一
    remainingDays--;
  }
  
  return {
    date: currentDate,
    excluded,
    totalCalendarDays: totalDays,
    totalBusinessDays: businessDays
  };
}
```

#### **排除日期展示组件**

```tsx
// components/ExcludedDatesList.tsx
export function ExcludedDatesList({ dates }) {
  const weekends = dates.filter(d => d.reason === 'weekend');
  const holidays = dates.filter(d => d.reason === 'holiday');
  
  return (
    <div className="excluded-dates">
      <h4>Excluded Dates</h4>
      
      <div className="summary">
        <Badge variant="secondary">
          {weekends.length} Weekends
        </Badge>
        <Badge variant="primary">
          {holidays.length} Holidays
        </Badge>
      </div>
      
      {/* 节假日详细列表 */}
      {holidays.length > 0 && (
        <div className="holidays-list">
          <h5>Holidays Excluded:</h5>
          <ul>
            {holidays.map((holiday, index) => (
              <li key={index}>
                <Calendar className="icon" />
                <div>
                  <strong>{holiday.name}</strong>
                  <span>{format(holiday.date, 'MMM d, yyyy')}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* 完整日历视图（可选）*/}
      <CalendarView
        highlightedDates={dates.map(d => ({
          date: d.date,
          color: d.reason === 'weekend' ? 'gray' : 'red',
          label: d.name || 'Weekend'
        }))}
      />
    </div>
  );
}
```

---

### **功能 3：节假日计算器**

#### **设计方案**

```tsx
// app/[locale]/holidays/page.tsx
export default function HolidayCalculatorPage() {
  const [country, setCountry] = useState('US');
  const upcomingHolidays = getUpcomingHolidays(country, 5); // 下 5 个节假日
  
  return (
    <div className="holiday-page">
      <h1>Holiday Countdown Calculator</h1>
      <p>Find out how many days until your next holiday</p>
      
      {/* 国家选择 */}
      <CountrySelector value={country} onChange={setCountry} />
      
      {/* 即将到来的节假日 */}
      <div className="holidays-grid">
        {upcomingHolidays.map((holiday, index) => (
          <HolidayCard key={index} holiday={holiday} />
        ))}
      </div>
      
      {/* 全年节假日日历 */}
      <YearlyHolidayCalendar country={country} />
    </div>
  );
}
```

#### **节假日卡片组件**

```tsx
// components/HolidayCard.tsx
export function HolidayCard({ holiday }) {
  const daysUntil = differenceInDays(holiday.date, new Date());
  const percentage = (daysUntil / 365) * 100;
  
  return (
    <div className="holiday-card">
      {/* 节假日图标/emoji */}
      <div className="holiday-icon">
        {getHolidayEmoji(holiday.name)}
      </div>
      
      {/* 节假日信息 */}
      <div className="holiday-info">
        <h3>{holiday.name}</h3>
        <p className="date">{format(holiday.date, 'MMMM d, yyyy')}</p>
        <p className="day">{format(holiday.date, 'EEEE')}</p>
      </div>
      
      {/* 倒计时 */}
      <div className="countdown">
        <div className="days-number">{daysUntil}</div>
        <div className="days-label">days until</div>
      </div>
      
      {/* 进度条 */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${100 - percentage}%` }}
        />
      </div>
      
      {/* 操作按钮 */}
      <div className="actions">
        <Button variant="outline" size="sm">
          <Download className="icon" />
          Add to Calendar
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="icon" />
          Share
        </Button>
      </div>
    </div>
  );
}
```

#### **节假日数据管理**

```typescript
// utils/holidays.ts
export interface Holiday {
  name: string;
  date: Date;
  type: 'public' | 'observance' | 'religious';
  country: string;
}

// 使用 API 或本地数据
export function getHolidays(country: string, year: number): Holiday[] {
  // 方案 1: 使用 Nager.Date API（免费）
  // https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}
  
  // 方案 2: 本地数据文件
  const holidayData = {
    US: [
      { name: "New Year's Day", date: new Date(year, 0, 1), type: 'public' },
      { name: "Independence Day", date: new Date(year, 6, 4), type: 'public' },
      { name: "Thanksgiving", date: getThanksgiving(year), type: 'public' },
      { name: "Christmas", date: new Date(year, 11, 25), type: 'public' },
      // ...
    ],
    CN: [
      { name: "春节", date: getChineseNewYear(year), type: 'public' },
      { name: "国庆节", date: new Date(year, 9, 1), type: 'public' },
      { name: "中秋节", date: getMidAutumnFestival(year), type: 'public' },
      // ...
    ],
    // 更多国家...
  };
  
  return holidayData[country] || [];
}

export function getUpcomingHolidays(country: string, count: number = 5): Holiday[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // 获取今年和明年的节假日
  const allHolidays = [
    ...getHolidays(country, currentYear),
    ...getHolidays(country, currentYear + 1)
  ];
  
  // 筛选未来的节假日并排序
  return allHolidays
    .filter(h => h.date > today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, count);
}
```

---

### **功能 4：纪念日/倒计时计算器**

#### **设计方案**

```tsx
// app/[locale]/anniversary/page.tsx
export default function AnniversaryCalculatorPage() {
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  return (
    <div className="anniversary-page">
      <div className="header">
        <h1>Anniversary & Countdown Calculator</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="icon" />
          Add Anniversary
        </Button>
      </div>
      
      {/* 添加纪念日表单 */}
      {showAddForm && (
        <AddAnniversaryForm
          onAdd={(anniversary) => {
            setAnniversaries([...anniversaries, anniversary]);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      
      {/* 纪念日列表 */}
      <div className="anniversaries-grid">
        {anniversaries.map((anniversary, index) => (
          <AnniversaryCard
            key={index}
            anniversary={anniversary}
            onDelete={() => {
              setAnniversaries(anniversaries.filter((_, i) => i !== index));
            }}
          />
        ))}
      </div>
      
      {/* 空状态 */}
      {anniversaries.length === 0 && !showAddForm && (
        <EmptyState
          icon={<Heart />}
          title="No Anniversaries Yet"
          description="Add your first anniversary or special date to start tracking"
          action={<Button onClick={() => setShowAddForm(true)}>Add Anniversary</Button>}
        />
      )}
    </div>
  );
}
```

#### **添加纪念日表单**

```tsx
// components/AddAnniversaryForm.tsx
export function AddAnniversaryForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'birthday', // birthday | wedding | custom
    recurring: true,  // 是否每年重复
    emoji: '🎂'
  });
  
  const anniversaryTypes = [
    { value: 'birthday', label: 'Birthday', emoji: '🎂' },
    { value: 'wedding', label: 'Wedding Anniversary', emoji: '💍' },
    { value: 'dating', label: 'Dating Anniversary', emoji: '❤️' },
    { value: 'work', label: 'Work Anniversary', emoji: '💼' },
    { value: 'custom', label: 'Custom Event', emoji: '📅' },
  ];
  
  return (
    <form className="add-anniversary-form" onSubmit={handleSubmit}>
      {/* 类型选择 */}
      <div className="type-selector">
        {anniversaryTypes.map(type => (
          <TypeCard
            key={type.value}
            selected={formData.type === type.value}
            onClick={() => setFormData({ ...formData, type: type.value, emoji: type.emoji })}
          >
            <span className="emoji">{type.emoji}</span>
            <span className="label">{type.label}</span>
          </TypeCard>
        ))}
      </div>
      
      {/* 标题 */}
      <Input
        label="Title"
        placeholder="e.g., Mom's Birthday"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      
      {/* 日期 */}
      <DatePicker
        label="Date"
        value={formData.date}
        onChange={(date) => setFormData({ ...formData, date })}
        required
      />
      
      {/* 是否每年重复 */}
      <Checkbox
        label="Repeat annually"
        checked={formData.recurring}
        onChange={(checked) => setFormData({ ...formData, recurring: checked })}
      />
      
      {/* Emoji 选择器（可选）*/}
      <EmojiPicker
        value={formData.emoji}
        onChange={(emoji) => setFormData({ ...formData, emoji })}
      />
      
      {/* 操作按钮 */}
      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Anniversary
        </Button>
      </div>
    </form>
  );
}
```

#### **纪念日卡片**

```tsx
// components/AnniversaryCard.tsx
export function AnniversaryCard({ anniversary, onDelete }) {
  const targetDate = anniversary.recurring
    ? getNextAnniversary(anniversary.date)
    : new Date(anniversary.date);
    
  const daysUntil = differenceInDays(targetDate, new Date());
  const isPast = daysUntil < 0;
  
  // 计算年数（如果是重复的）
  const yearsSince = anniversary.recurring
    ? differenceInYears(new Date(), new Date(anniversary.date))
    : 0;
  
  return (
    <div className="anniversary-card">
      <div className="card-header">
        <div className="emoji-badge">{anniversary.emoji}</div>
        <DropdownMenu>
          <DropdownMenuItem onClick={onDelete}>
            <Trash className="icon" />
            Delete
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
      
      <div className="card-content">
        <h3>{anniversary.title}</h3>
        <p className="date">{format(targetDate, 'MMMM d, yyyy')}</p>
        
        {anniversary.recurring && yearsSince > 0 && (
          <Badge variant="secondary">
            {yearsSince + 1} years
          </Badge>
        )}
      </div>
      
      <div className="countdown-section">
        {isPast ? (
          <div className="past-event">
            <Calendar className="icon" />
            <span>This event has passed</span>
          </div>
        ) : (
          <>
            <div className="days-count">
              <span className="number">{daysUntil}</span>
              <span className="label">days to go</span>
            </div>
            
            <CircularProgress 
              value={(daysUntil / 365) * 100}
              max={100}
            />
          </>
        )}
      </div>
      
      <div className="card-actions">
        <Button variant="outline" size="sm">
          <Download className="icon" />
          Add to Calendar
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="icon" />
          Share
        </Button>
      </div>
    </div>
  );
}
```

#### **数据持久化**

```typescript
// utils/storage.ts
export interface Anniversary {
  id: string;
  title: string;
  date: string; // ISO string
  type: string;
  recurring: boolean;
  emoji: string;
  createdAt: string;
}

// 使用 localStorage 存储
export const anniversaryStorage = {
  getAll(): Anniversary[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('anniversaries');
    return data ? JSON.parse(data) : [];
  },
  
  add(anniversary: Omit<Anniversary, 'id' | 'createdAt'>): Anniversary {
    const newAnniversary = {
      ...anniversary,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    const all = this.getAll();
    all.push(newAnniversary);
    localStorage.setItem('anniversaries', JSON.stringify(all));
    
    return newAnniversary;
  },
  
  delete(id: string): void {
    const all = this.getAll();
    const filtered = all.filter(a => a.id !== id);
    localStorage.setItem('anniversaries', JSON.stringify(filtered));
  }
};
```

---

### **功能 5：国家/地区自动识别**

#### **设计方案**

```tsx
// components/CountryDetector.tsx
'use client';

import { useEffect, useState } from 'react';

export function CountryDetector({ onDetect }) {
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function detectCountry() {
      try {
        // 方案 1: 使用 Vercel Geo IP（推荐）
        // Next.js middleware 中已经提供
        const response = await fetch('/api/geo');
        const data = await response.json();
        setCountry(data.country);
        
        // 方案 2: 使用第三方 API（备选）
        // const response = await fetch('https://ipapi.co/json/');
        // const data = await response.json();
        // setCountry(data.country_code);
        
        onDetect(data.country);
      } catch (error) {
        console.error('Failed to detect country:', error);
        // 默认使用 US
        setCountry('US');
        onDetect('US');
      } finally {
        setLoading(false);
      }
    }
    
    detectCountry();
  }, [onDetect]);
  
  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }
  
  return null;
}
```

#### **Geo API 端点**

```typescript
// app/api/geo/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Vercel 自动提供地理位置信息
  const country = request.geo?.country || 'US';
  const city = request.geo?.city;
  const region = request.geo?.region;
  
  return NextResponse.json({
    country,
    city,
    region,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
}
```

#### **国家选择器组件**

```tsx
// components/CountrySelector.tsx
export function CountrySelector({ value, onChange }) {
  const [detected, setDetected] = useState<string | null>(null);
  
  const supportedCountries = [
    { code: 'US', name: 'United States', flag: '🇺🇸', holidays: 11 },
    { code: 'CN', name: 'China', flag: '🇨🇳', holidays: 7 },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', holidays: 8 },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', holidays: 16 },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', holidays: 9 },
    { code: 'FR', name: 'France', flag: '🇫🇷', holidays: 11 },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', holidays: 10 },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', holidays: 9 },
    // 更多国家...
  ];
  
  return (
    <div className="country-selector">
      <CountryDetector onDetect={setDetected} />
      
      <div className="selector-header">
        <Label>Select Country/Region</Label>
        {detected && detected !== value && (
          <Badge variant="info">
            <MapPin className="icon" />
            Detected: {detected}
            <Button 
              size="sm" 
              variant="link"
              onClick={() => onChange(detected)}
            >
              Use
            </Button>
          </Badge>
        )}
      </div>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue>
            {supportedCountries.find(c => c.code === value)?.flag}{' '}
            {supportedCountries.find(c => c.code === value)?.name}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent>
          {supportedCountries.map(country => (
            <SelectItem key={country.code} value={country.code}>
              <div className="country-option">
                <span className="flag">{country.flag}</span>
                <span className="name">{country.name}</span>
                <span className="holidays-count">
                  {country.holidays} holidays
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

---

### **功能 6：博客系统**

#### **将 FAQ 升级为博客**

```typescript
// app/[locale]/blog/page.tsx
export default function BlogPage() {
  const posts = getBlogPosts();
  
  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1>Date Calculation Insights & Guides</h1>
        <p>Learn everything about date calculations, planning, and productivity</p>
      </div>
      
      {/* Featured Post（第一篇：从 FAQ 迁移）*/}
      <FeaturedPost post={posts[0]} />
      
      {/* Blog Grid */}
      <div className="blog-grid">
        {posts.slice(1).map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      
      {/* Categories */}
      <BlogCategories />
    </div>
  );
}
```

#### **博客文章结构**

```typescript
// content/blog/frequently-asked-questions.mdx
---
title: "DaysFromToday: Frequently Asked Questions"
description: "Everything you need to know about date calculations, from basics to advanced features"
author: "Leon"
publishDate: "2025-01-07"
category: "Getting Started"
tags: ["FAQ", "Guide", "Tutorial"]
featured: true
image: "/blog/faq-cover.jpg"
---

## What is DaysFromToday?

DaysFromToday is a professional date calculation platform...

## How do I calculate future dates?

[从现有 FAQ 迁移内容...]

## What's the difference between calendar days and business days?

[新增内容...]

## Which countries are supported for holiday calculations?

[新增内容...]
```

#### **博客文章模板（后续文章）**

```markdown
---
title: "14 Days from Today: Planning Guide"
slug: "14-days-from-today-planning-guide"
description: "Complete guide to planning your next 14 days effectively"
publishDate: "2025-01-10"
category: "Planning"
readTime: "5 min"
---

## Why 14 Days Matters

14天是一个神奇的时间跨度...

## 使用场景

### 1. 项目管理
- Sprint 规划
- 里程碑设置

### 2. 个人规划
- 习惯养成
- 目标设定

## 工具推荐

使用我们的 [14天计算器](/en/days/14) 可以...

## 实际案例

[案例分享...]

## 下一步

[行动建议 + CTA]
```

#### **博客卡片组件**

```tsx
// components/BlogCard.tsx
export function BlogCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      {/* 封面图 */}
      <div className="blog-image">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="category-badge">{post.category}</div>
      </div>
      
      {/* 内容 */}
      <div className="blog-content">
        <h3>{post.title}</h3>
        <p className="excerpt">{post.description}</p>
        
        <div className="blog-meta">
          <div className="author">
            <Avatar src="/leon-avatar.jpg" alt="Leon" size="sm" />
            <span>{post.author}</span>
          </div>
          
          <div className="meta-info">
            <span className="date">{format(new Date(post.publishDate), 'MMM d, yyyy')}</span>
            <span className="separator">·</span>
            <span className="read-time">{post.readTime} read</span>
          </div>
        </div>
      </div>
      
      {/* Hover 效果 */}
      <div className="blog-hover-overlay">
        <ArrowRight className="icon" />
        <span>Read Article</span>
      </div>
    </Link>
  );
}
```

---

## 🏗 技术架构

### **技术选型**

```typescript
// 新增依赖
{
  "dependencies": {
    // 日期处理
    "date-fns": "^3.0.0",
    "date-fns-tz": "^2.0.0",
    
    // UI 组件
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    
    // MDX（博客）
    "@next/mdx": "^15.0.0",
    "gray-matter": "^4.0.3",
    
    // 图表/可视化
    "recharts": "^2.10.0",
    
    // 节假日 API
    "@nager/date": "^1.0.0" // 或使用 API
  }
}
```

### **文件结构**

```
app/
├── [locale]/
│   ├── page.tsx                    # 首页（改版）
│   ├── days/
│   │   ├── [direction]/           # future | past
│   │   │   └── [days]/
│   │   │       └── page.tsx
│   │   └── [days]/                # 向后兼容
│   │       └── page.tsx
│   ├── business-days/
│   │   └── page.tsx               # 工作日计算器
│   ├── holidays/
│   │   ├── page.tsx               # 节假日列表
│   │   └── [country]/
│   │       └── page.tsx           # 国家节假日
│   ├── anniversary/
│   │   └── page.tsx               # 纪念日计算器
│   ├── blog/
│   │   ├── page.tsx               # 博客列表
│   │   ├── [slug]/
│   │   │   └── page.tsx           # 博客文章
│   │   └── category/
│   │       └── [category]/
│   │           └── page.tsx       # 分类页
│   └── faq/
│       └── page.tsx               # 重定向到第一篇博客
├── api/
│   ├── geo/
│   │   └── route.ts               # 地理位置检测
│   └── holidays/
│       └── [country]/
│           └── route.ts           # 节假日 API
│
components/
├── calculators/
│   ├── BusinessDaysCalculator.tsx
│   ├── HolidayCountdown.tsx
│   └── AnniversaryTracker.tsx
├── ui/
│   ├── CountrySelector.tsx
│   ├── DatePicker.tsx
│   ├── Timeline.tsx
│   └── CircularProgress.tsx
└── blog/
    ├── BlogCard.tsx
    ├── FeaturedPost.tsx
    └── MDXComponents.tsx

utils/
├── business-days.ts               # 工作日计算逻辑
├── holidays.ts                    # 节假日数据/API
├── storage.ts                     # LocalStorage 管理
└── geo.ts                         # 地理位置工具

content/
└── blog/
    ├── faq.mdx                    # 从 FAQ 迁移
    ├── 14-days-planning.mdx
    ├── business-days-guide.mdx
    └── ...
```

---

## 🌍 国家/地区支持

### **第一阶段（MVP）**

支持 8 个主要国家：

| 国家 | 代码 | 节假日数 | 优先级 |
|------|------|---------|--------|
| 美国 | US | 11 | 🔴 高 |
| 中国 | CN | 7 | 🔴 高 |
| 英国 | UK | 8 | 🟡 中 |
| 日本 | JP | 16 | 🟡 中 |
| 德国 | DE | 9 | 🟡 中 |
| 法国 | FR | 11 | 🟡 中 |
| 加拿大 | CA | 10 | 🟢 低 |
| 澳大利亚 | AU | 9 | 🟢 低 |

### **节假日数据源**

```typescript
// utils/holidays-api.ts

// 方案 1: Nager.Date API（免费，推荐）
export async function getHolidaysFromAPI(country: string, year: number) {
  const response = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`
  );
  return response.json();
}

// 方案 2: 本地数据文件（备选）
import usHolidays from '@/data/holidays/us.json';
import cnHolidays from '@/data/holidays/cn.json';

export function getHolidaysLocal(country: string, year: number) {
  const data = {
    US: usHolidays,
    CN: cnHolidays,
    // ...
  };
  
  return data[country]?.filter(h => h.year === year) || [];
}
```

---

## 📅 实施时间表

### **Week 1-2: 核心功能开发**

```
✅ Day 1-2: 未来/过去分离
   - 创建新路由结构
   - 更新首页 UI
   - 添加选项卡切换

✅ Day 3-4: 工作日计算器
   - 实现工作日计算逻辑
   - 集成节假日数据
   - 排除日期展示

✅ Day 5-7: 国家选择
   - Geo IP 检测
   - 国家选择器组件
   - 多国节假日支持
```

### **Week 3: 高级功能**

```
✅ Day 8-10: 节假日计算器
   - 节假日列表页
   - 倒计时展示
   - 日历视图

✅ Day 11-12: 纪念日功能
   - 添加/管理纪念日
   - LocalStorage 持久化
   - 分享功能
```

### **Week 4: 博客系统**

```
✅ Day 13-14: 博客基础
   - MDX 配置
   - 博客列表页
   - 文章模板

✅ Day 15: FAQ 迁移
   - 将现有 FAQ 转为第一篇博客
   - 添加目录和导航
   - SEO 优化
```

---

## ✅ 验收标准

### **功能完整性**

- [ ] 用户可以选择计算未来或过去的日期
- [ ] 用户可以切换自然日和工作日模式
- [ ] 工作日模式会自动排除周末和节假日
- [ ] 明确显示所有被排除的日期及原因
- [ ] 系统自动检测用户所在国家
- [ ] 用户可以手动选择其他国家
- [ ] 显示即将到来的节假日列表
- [ ] 用户可以添加和管理个人纪念日
- [ ] 博客系统正常运行，FAQ 已迁移

### **UI/UX 质量**

- [ ] 设计风格与 Calendly 一致（模块化、卡片化）
- [ ] 响应式设计，移动端体验良好
- [ ] 加载状态和错误处理完善
- [ ] 动画和过渡流畅自然
- [ ] 可访问性（WCAG AA 标准）

### **性能指标**

- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] 所有页面 Lighthouse 分数 > 90

### **SEO 优化**

- [ ] 所有新页面有完整的 metadata
- [ ] 博客文章有 JSON-LD Schema
- [ ] 内部链接结构优化
- [ ] Sitemap 包含所有新页面

---

## 🎯 下一步行动

**我建议按以下顺序执行：**

1. ✅ **Week 1: 核心功能（未来/过去 + 工作日）**
   - 这是最重要的功能增强
   - 直接提升用户价值

2. ✅ **Week 2: 国家支持**
   - 工作日计算的基础
   - 全球化准备

3. ✅ **Week 3: 节假日 + 纪念日**
   - 差异化竞争优势
   - 提升用户粘性

4. ✅ **Week 4: 博客系统**
   - SEO 长期投资
   - 内容营销基础

---

**您想从哪个功能开始？我可以立即帮您实现！** 🚀

