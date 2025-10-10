# MDX 组件库完整文档

> 版本: v2.0  
> 更新: 2025-10-10  
> 作者: Leon  
> 目标: 提供17+富媒体组件的完整使用文档

---

## 一、组件库概览

### 1.1 组件分类

DaysFromToday 内容管理系统提供 **17+ 个 MDX 组件**，分为三大类：

```
┌─────────────────────────────────────────────────────────────┐
│                    MDX 组件库 (17+)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 基础展示组件 (7个)      展示内容，提升视觉效果          │
│  2. 功能植入组件 (4个)      植入产品功能，引导用户行动       │
│  3. 交互增强组件 (6个)      增强交互，提升阅读体验          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 设计原则

1. **易用性** - 简单的 Props，清晰的语法
2. **一致性** - 统一的设计风格和交互模式
3. **响应式** - 自动适配桌面端和移动端
4. **性能** - 优化加载和渲染性能
5. **可访问性** - 支持键盘导航和屏幕阅读器

---

## 二、基础展示组件（7个）

### 2.1 HeroBanner - 头图/Banner

**用途**: 文章开头的大图横幅，营造视觉冲击力

**Props**:
```typescript
interface HeroBannerProps {
  image: string;           // 图片 URL（必填）
  title: string;           // 标题（必填）
  subtitle?: string;       // 副标题（可选）
  overlay?: boolean;       // 是否添加深色遮罩（默认 false）
  height?: 'small' | 'medium' | 'large';  // 高度（默认 'medium')
}
```

**使用示例**:
```mdx
<HeroBanner 
  image="https://cdn.daysfromtoday.ai/content/hero.jpg"
  title="如何计算工作日"
  subtitle="完整指南，从基础到进阶"
  overlay={true}
  height="large"
/>
```

**渲染效果**:
- 全宽大图，自动适配屏幕尺寸
- 标题居中显示，白色文字
- 如开启 overlay，图片添加 50% 深色遮罩，提升文字可读性

**最佳实践**:
- ✅ **仅在文章开头使用一次**
- ✅ 图片尺寸推荐 1920×1080 或 1200×630
- ✅ overlay 适合图片较亮的情况
- ❌ 不要在正文中多次使用

**使用场景**:
- Philosophy：深度长文的开头
- Stories：故事类文章的开头
- Guides：系统教程的开头

---

### 2.2 BlogImage - 增强图片

**用途**: 正文中的插图，支持灯箱放大、懒加载、响应式

**Props**:
```typescript
interface BlogImageProps {
  src: string;             // 图片 URL（必填）
  alt: string;             // 替代文字（必填，SEO）
  caption?: string;        // 图片说明（可选）
  lightbox?: boolean;      // 是否支持点击放大（默认 true）
  priority?: boolean;      // 是否优先加载（默认 false）
  width?: number;          // 宽度（可选，自动计算）
  height?: number;         // 高度（可选，自动计算）
}
```

**使用示例**:
```mdx
<BlogImage 
  src="https://cdn.daysfromtoday.ai/content/example.jpg"
  alt="工作日计算示例"
  caption="这是工作日计算的示意图"
  lightbox={true}
  priority={false}
/>
```

**渲染效果**:
- 图片自动适配容器宽度
- 点击后全屏灯箱显示（如开启 lightbox）
- caption 显示在图片下方，居中灰色文字
- 懒加载（首屏外的图片）

**最佳实践**:
- ✅ **所有图片必须有 alt 文字**（SEO 必需）
- ✅ 首屏图片设置 `priority={true}`
- ✅ 每 500-800 字至少一张图
- ❌ 不要上传过大的图片（>3MB）

**使用场景**:
- 所有类型文章的正文插图

---

### 2.3 ImageWithText - 图文混排

**用途**: 图片和文字并排显示，适合介绍功能或流程

**Props**:
```typescript
interface ImageWithTextProps {
  image: string;           // 图片 URL（必填）
  alt: string;             // 替代文字（必填）
  position?: 'left' | 'right';  // 图片位置（默认 'left'）
  imageWidth?: '1/3' | '1/2' | '2/3';  // 图片宽度占比（默认 '1/2'）
  children: React.ReactNode;  // 文字内容（必填）
}
```

**使用示例**:
```mdx
<ImageWithText 
  image="https://cdn.daysfromtoday.ai/content/feature.jpg"
  alt="功能展示"
  position="left"
  imageWidth="1/3"
>
  这里是文字内容，图片在左侧显示。你可以写多段文字，支持 **Markdown** 格式。
  
  - 列表项 1
  - 列表项 2
</ImageWithText>
```

**渲染效果**:
- 桌面端：图片和文字并排显示
- 移动端：图片在上，文字在下（自动堆叠）
- 图片自动适配高度

**最佳实践**:
- ✅ 适合介绍功能或流程
- ✅ 文字控制在 100-300 字内
- ✅ 图片位置交替使用（left → right → left）
- ❌ 不要放置过长的文字

**使用场景**:
- Tools：功能介绍
- Guides：步骤说明
- Features：功能展示

---

### 2.4 ImageGallery - 图片画廊

**用途**: 展示多张相关图片，支持网格布局或轮播

**Props**:
```typescript
interface ImageGalleryProps {
  images: Array<{
    src: string;           // 图片 URL（必填）
    alt: string;           // 替代文字（必填）
    caption?: string;      // 图片说明（可选）
  }>;
  layout?: 'grid' | 'carousel';  // 布局方式（默认 'grid'）
  columns?: 2 | 3 | 4;           // 列数（仅 grid，默认 3）
  gap?: 'small' | 'medium' | 'large';  // 间距（默认 'medium'）
}
```

**使用示例**:
```mdx
<ImageGallery 
  layout="grid"
  columns={3}
  gap="medium"
  images={[
    { 
      src: "https://cdn.daysfromtoday.ai/content/img1.jpg", 
      alt: "图片1", 
      caption: "说明1" 
    },
    { 
      src: "https://cdn.daysfromtoday.ai/content/img2.jpg", 
      alt: "图片2", 
      caption: "说明2" 
    },
    { 
      src: "https://cdn.daysfromtoday.ai/content/img3.jpg", 
      alt: "图片3", 
      caption: "说明3" 
    }
  ]}
/>
```

**渲染效果**:
- **Grid 布局**: 网格排列，自动换行
- **Carousel 布局**: 轮播图，左右切换按钮
- 点击任意图片打开灯箱，可左右切换

**最佳实践**:
- ✅ 适合展示多张相关图片（3-9张）
- ✅ Grid 适合展示并列内容
- ✅ Carousel 适合展示步骤或流程
- ❌ 不要放置过多图片（>12张）

**使用场景**:
- Guides：多步骤截图
- Stories：故事场景展示
- Tools：多个案例对比

---

### 2.5 VideoPlayer - 视频播放器

**用途**: 嵌入视频，支持 MP4/WebM 格式

**Props**:
```typescript
interface VideoPlayerProps {
  src: string;             // 视频 URL（必填）
  poster?: string;         // 封面图 URL（可选）
  caption?: string;        // 视频说明（可选）
  controls?: boolean;      // 是否显示控制栏（默认 true）
  autoplay?: boolean;      // 是否自动播放（默认 false）
  loop?: boolean;          // 是否循环播放（默认 false）
  muted?: boolean;         // 是否静音（默认 false）
}
```

**使用示例**:
```mdx
<VideoPlayer 
  src="https://cdn.daysfromtoday.ai/content/demo.mp4"
  poster="https://cdn.daysfromtoday.ai/content/poster.jpg"
  caption="功能演示视频"
  controls={true}
  autoplay={false}
  loop={false}
/>
```

**渲染效果**:
- 响应式视频播放器
- 显示播放/暂停、进度条、音量等控制
- poster 作为视频加载前的占位图

**最佳实践**:
- ✅ 视频控制在 1-3 分钟内
- ✅ 必须提供 poster（避免空白）
- ✅ 避免自动播放（用户体验差）
- ❌ 不要上传过大的视频（建议 <50MB）

**使用场景**:
- Guides：功能演示
- Tools：操作教程
- Features：功能介绍

---

### 2.6 ChartContainer - 图表容器

**用途**: 展示数据图表（统计图、流程图等）

**Props**:
```typescript
interface ChartContainerProps {
  src: string;             // 图表图片 URL（必填）
  alt: string;             // 替代文字（必填）
  caption?: string;        // 图表说明（可选）
  source?: string;         // 数据来源（可选）
  interactive?: boolean;   // 是否支持交互（默认 false）
}
```

**使用示例**:
```mdx
<ChartContainer 
  src="https://cdn.daysfromtoday.ai/content/chart.png"
  alt="流量增长趋势"
  caption="流量增长趋势（2025 Q1-Q4）"
  source="Google Analytics"
/>
```

**渲染效果**:
- 图表居中显示
- caption 和 source 显示在图表下方
- 保持图表清晰度（PNG 格式优先）

**最佳实践**:
- ✅ 使用高清图表（PNG 格式，质量 90+）
- ✅ 必须提供 source（数据来源）
- ✅ 图表简洁清晰，标注完整
- ❌ 不要使用过于复杂的图表

**使用场景**:
- Philosophy：数据支撑观点
- Tools：计算结果展示
- Updates：数据报告

---

### 2.7 TableOfContents - 目录导航

**用途**: 自动生成文章目录，支持锚点跳转

**Props**:
```typescript
interface TableOfContentsProps {
  maxDepth?: 2 | 3 | 4;    // 最大标题层级（默认 3）
  sticky?: boolean;        // 是否固定在侧边（默认 false）
  title?: string;          // 目录标题（默认 "目录"）
}
```

**使用示例**:
```mdx
<TableOfContents 
  maxDepth={3}
  sticky={false}
  title="本文目录"
/>
```

**渲染效果**:
- 自动提取 H2/H3/H4 标题
- 点击标题平滑滚动到对应位置
- 当前阅读位置高亮显示
- 桌面端：sticky 模式固定在侧边；移动端：默认在顶部

**最佳实践**:
- ✅ **所有长文（>1000字）都应包含**
- ✅ 放在文章开头（引言之后）
- ✅ maxDepth=3 最合适（H2-H3-H4）
- ❌ 不要在短文中使用（<500字）

**使用场景**:
- 所有类型的长文章

---

## 三、功能植入组件（4个）

### 3.1 EmbedCalculator - 内嵌计算器

**用途**: 在文章中植入日期计算器，引导用户使用产品功能

**Props**:
```typescript
interface EmbedCalculatorProps {
  type: 'business-days' | 'countdown' | 'date-diff';  // 计算器类型（必填）
  defaultDays?: number;         // 默认天数（可选）
  title?: string;               // 标题（可选）
  description?: string;         // 描述（可选）
}
```

**使用示例**:
```mdx
<EmbedCalculator 
  type="business-days"
  defaultDays={30}
  title="试试计算工作日"
  description="输入天数，自动排除周末和节假日"
/>
```

**渲染效果**:
- 卡片式计算器，包含输入框和结果显示
- 用户输入天数，实时计算并显示结果
- 底部显示 "查看完整功能" 链接，跳转到产品页

**最佳实践**:
- ✅ **Tools 和 Guides 类文章必须包含**
- ✅ 放在文章中部或结尾
- ✅ 预设 defaultDays 与文章主题相关
- ❌ 不要在一篇文章中放置多个计算器

**使用场景**:
- Tools：日期计算教程
- Guides：功能使用指南

---

### 3.2 AddAnniversary - 内嵌纪念日添加

**用途**: 在文章中植入纪念日添加功能

**Props**:
```typescript
interface AddAnniversaryProps {
  presetDate?: string;         // 预设日期（YYYY-MM-DD）
  presetName?: string;         // 预设名称
  title?: string;              // 标题（可选）
}
```

**使用示例**:
```mdx
<AddAnniversary 
  presetDate="2025-12-25"
  presetName="圣诞节"
  title="添加纪念日"
/>
```

**渲染效果**:
- 卡片式表单，包含日期选择器和名称输入框
- 用户填写后点击"添加"，直接跳转到纪念日页面
- 预设值自动填充

**最佳实践**:
- ✅ Stories 和 Guides 类文章适用
- ✅ 预设值与文章主题相关
- ❌ 不要在一篇文章中放置多个

**使用场景**:
- Stories：用户故事中引导行动
- Guides：纪念日功能教程

---

### 3.3 FeatureCard - 功能跳转卡片

**用途**: 展示产品功能，引导用户跳转

**Props**:
```typescript
interface FeatureCardProps {
  icon: string;                // 图标名称（必填）
  title: string;               // 标题（必填）
  description: string;         // 描述（必填）
  link: string;                // 跳转链接（必填）
  cta?: string;                // 按钮文字（默认 "了解更多"）
}
```

**使用示例**:
```mdx
<FeatureCard 
  icon="calendar"
  title="添加纪念日"
  description="永远不会忘记重要的日子"
  link="/anniversaries"
  cta="立即使用"
/>
```

**渲染效果**:
- 卡片式布局，左侧图标，右侧文字
- 底部显示 CTA 按钮
- 鼠标悬停时卡片轻微上浮（交互效果）

**最佳实践**:
- ✅ 适合在文章结尾引导用户
- ✅ 每篇文章可放置 1-3 个
- ✅ CTA 文字要具体明确
- ❌ 不要过度使用

**使用场景**:
- 所有类型文章的结尾

---

### 3.4 CountdownDisplay - 倒计时展示

**用途**: 实时显示距离某个日期的倒计时

**Props**:
```typescript
interface CountdownDisplayProps {
  targetDate: string;          // 目标日期（YYYY-MM-DD，必填）
  title?: string;              // 标题（可选）
  showDays?: boolean;          // 是否显示自然日（默认 true）
  showBusinessDays?: boolean;  // 是否显示工作日（默认 false）
}
```

**使用示例**:
```mdx
<CountdownDisplay 
  targetDate="2025-12-31"
  title="距离 2026 年还有"
  showDays={true}
  showBusinessDays={true}
/>
```

**渲染效果**:
- 大号数字显示剩余天数
- 实时更新（每秒刷新）
- 可同时显示自然日和工作日

**最佳实践**:
- ✅ 适合重要日期或里程碑
- ✅ 标题简洁明了
- ❌ 不要在一篇文章中放置多个

**使用场景**:
- Stories：故事中的时间节点
- Updates：产品发布倒计时

---

## 四、交互增强组件（6个）

### 4.1 Accordion - 可折叠区块

**用途**: 折叠次要信息，节省空间

**Props**:
```typescript
interface AccordionProps {
  title: string;               // 标题（必填）
  children: React.ReactNode;   // 内容（必填）
  defaultOpen?: boolean;       // 是否默认展开（默认 false）
}
```

**使用示例**:
```mdx
<Accordion title="高级技巧" defaultOpen={false}>
  这里是可折叠的内容，点击标题展开/收起。
  
  支持 **Markdown** 格式。
</Accordion>
```

**渲染效果**:
- 标题栏显示箭头图标
- 点击标题展开/收起内容
- 展开时平滑动画

**最佳实践**:
- ✅ 适合 FAQ 或次要信息
- ✅ 每个 Accordion 内容控制在 200 字内
- ✅ 多个 Accordion 可连续使用
- ❌ 不要嵌套使用

**使用场景**:
- Guides：高级技巧
- Tools：常见问题

---

### 4.2 Tabs - 标签页

**用途**: 多个内容并列展示，切换查看

**Props**:
```typescript
interface TabsProps {
  children: React.ReactNode;   // Tab 子组件（必填）
}

interface TabProps {
  label: string;               // 标签标题（必填）
  children: React.ReactNode;   // 内容（必填）
}
```

**使用示例**:
```mdx
<Tabs>
  <Tab label="方法一">
    这是方法一的内容...
  </Tab>
  <Tab label="方法二">
    这是方法二的内容...
  </Tab>
  <Tab label="方法三">
    这是方法三的内容...
  </Tab>
</Tabs>
```

**渲染效果**:
- 顶部显示标签导航
- 点击标签切换内容
- 当前标签高亮显示

**最佳实践**:
- ✅ 适合展示多种方法或选项
- ✅ Tab 数量控制在 2-5 个
- ✅ 每个 Tab 内容长度相近
- ❌ 不要放置过长的内容（>500字）

**使用场景**:
- Tools：多种计算方法
- Guides：不同操作系统的教程

---

### 4.3 Callout - 提示框

**用途**: 突出显示重要信息或提示

**Props**:
```typescript
interface CalloutProps {
  type: 'info' | 'warning' | 'success' | 'error';  // 类型（必填）
  children: React.ReactNode;   // 内容（必填）
}
```

**使用示例**:
```mdx
<Callout type="info">
💡 小提示：工作日计算会自动排除周末和节假日
</Callout>

<Callout type="warning">
⚠️ 注意：不同国家的节假日不同，请选择正确的国家
</Callout>

<Callout type="success">
✅ 成功：你的纪念日已添加！
</Callout>

<Callout type="error">
❌ 错误：日期格式不正确
</Callout>
```

**渲染效果**:
- 彩色背景卡片（蓝/黄/绿/红）
- 左侧显示图标
- 文字自动换行

**最佳实践**:
- ✅ 每篇文章 2-4 个
- ✅ 用 Emoji 增强视觉效果
- ✅ 文字简洁明了（<100字）
- ❌ 不要滥用

**使用场景**:
- 所有类型文章的关键提示

---

### 4.4 StepGuide - 步骤指引

**用途**: 展示多步骤流程

**Props**:
```typescript
interface StepGuideProps {
  children: React.ReactNode;   // Step 子组件（必填）
}

interface StepProps {
  number: number;              // 步骤序号（必填）
  title: string;               // 步骤标题（必填）
  children: React.ReactNode;   // 内容（必填）
}
```

**使用示例**:
```mdx
<StepGuide>
  <Step number={1} title="选择开始日期">
    在日历中选择你的开始日期
  </Step>
  <Step number={2} title="输入天数">
    输入需要计算的天数
  </Step>
  <Step number={3} title="查看结果">
    系统自动计算并显示结果
  </Step>
</StepGuide>
```

**渲染效果**:
- 纵向排列，左侧显示序号
- 序号之间有连接线
- 标题加粗显示

**最佳实践**:
- ✅ 适合操作流程或教程
- ✅ 步骤数控制在 3-8 步
- ✅ 每步内容控制在 100 字内
- ❌ 不要在一篇文章中多次使用

**使用场景**:
- Guides：功能使用步骤
- Tools：计算步骤说明

---

### 4.5 CodeBlock - 代码块

**用途**: 展示代码示例（如 API 调用）

**Props**:
```typescript
interface CodeBlockProps {
  language: string;            // 语言（必填，如 javascript, bash）
  children: string;            // 代码内容（必填）
  showLineNumbers?: boolean;   // 是否显示行号（默认 false）
  highlightLines?: number[];   // 高亮行号（可选）
}
```

**使用示例**:
````mdx
<CodeBlock language="javascript" showLineNumbers={true} highlightLines={[2, 3]}>
const result = calculateBusinessDays(30);
console.log(result);
</CodeBlock>
````

**渲染效果**:
- 代码语法高亮
- 可选显示行号
- 可选高亮特定行
- 右上角显示"复制"按钮

**最佳实践**:
- ✅ 代码控制在 20 行内
- ✅ 添加注释说明关键部分
- ❌ 不要在 Philosophy/Stories 中使用

**使用场景**:
- Guides：API 使用示例
- Tools：脚本示例（如需）

---

### 4.6 RelatedContent - 相关内容推荐

**用途**: 推荐相关文章，提升内部链接

**Props**:
```typescript
interface RelatedContentProps {
  topics?: string[];           // 主题标签（可选）
  type?: 'philosophy' | 'tools' | 'stories' | 'guides' | 'updates';  // 类型（可选）
  currentSlug?: string;        // 当前文章 slug（自动排除）
  limit?: number;              // 推荐数量（默认 3）
}
```

**使用示例**:
```mdx
<RelatedContent 
  topics={["time-management", "date-calculation"]}
  limit={3}
/>
```

**渲染效果**:
- 卡片式布局，显示文章标题、描述、日期
- 自动从相同 topic 的文章中推荐
- 点击跳转到文章

**最佳实践**:
- ✅ **所有文章结尾都应包含**
- ✅ topics 与当前文章相关
- ✅ limit 控制在 3-5 个
- ❌ 不要在文章中部使用

**使用场景**:
- 所有类型文章的结尾

---

## 五、组件组合使用案例

### 5.1 完整的 Philosophy 文章

```mdx
---
title: "时间是唯一公平的资源"
description: "探讨时间的公平性，以及如何通过重新审视时间价值来改变人生轨迹"
date: "2025-10-10"
category: "time-value"
level: "beginner"
topics: ["时间管理", "个人成长", "时间价值"]
---

<HeroBanner 
  image="https://cdn.daysfromtoday.ai/content/time-hero.jpg"
  title="时间是唯一公平的资源"
  subtitle="每个人每天都有 24 小时"
  overlay={true}
/>

<TableOfContents maxDepth={3} />

## 引言

时间是唯一对所有人公平的资源...

<BlogImage 
  src="https://cdn.daysfromtoday.ai/content/clock.jpg"
  alt="时钟"
  caption="时间对每个人都是公平的"
/>

## 核心观点

### 观点一：时间的稀缺性

时间是有限的，不可再生...

<Callout type="info">
💡 小提示：珍惜当下，每一天都是不可逆的
</Callout>

### 观点二：时间的价值

不同的时间投入产生不同的价值...

<ImageWithText 
  image="https://cdn.daysfromtoday.ai/content/value.jpg"
  alt="价值创造"
  position="left"
>
  高价值的时间投入包括：学习、思考、创造...
</ImageWithText>

## 实践建议

<StepGuide>
  <Step number={1} title="审视你的时间分配">
    记录一周的时间使用...
  </Step>
  <Step number={2} title="识别低价值活动">
    找出浪费时间的活动...
  </Step>
  <Step number={3} title="重新分配时间">
    增加高价值活动的时间...
  </Step>
</StepGuide>

## 总结

时间是唯一公平的资源，关键在于如何使用...

<RelatedContent topics={["时间管理", "个人成长"]} limit={3} />
```

### 5.2 完整的 Tools 文章

```mdx
---
title: "如何计算工作日"
description: "学习如何准确计算工作日，排除周末和节假日"
date: "2025-10-10"
category: "date-calculation"
topics: ["工作日计算", "日期计算", "时间管理"]
embeds:
  - type: "calculator"
    id: "business-days-calc"
---

# 如何计算工作日

<TableOfContents />

## 问题场景

你是否遇到过这样的场景：老板说"30天后交付项目"，但你不知道实际有多少工作日？

## 快速解决方案

使用我们的工作日计算器，自动排除周末和节假日：

<EmbedCalculator 
  type="business-days"
  defaultDays={30}
  title="试试计算工作日"
  description="输入天数，自动排除周末和节假日"
/>

## 详细说明

### 什么是工作日？

工作日（Business Days）是指...

<Callout type="info">
💡 小提示：不同国家的工作日定义可能不同
</Callout>

### 如何计算？

<StepGuide>
  <Step number={1} title="选择开始日期">
    确定计算的起点
  </Step>
  <Step number={2} title="输入天数">
    输入需要计算的自然日天数
  </Step>
  <Step number={3} title="排除周末和节假日">
    系统自动排除非工作日
  </Step>
</StepGuide>

<BlogImage 
  src="https://cdn.daysfromtoday.ai/content/calendar.jpg"
  alt="工作日计算示例"
  caption="工作日计算示意图"
/>

## 常见问题

<Accordion title="Q1: 节假日怎么算？">
  A: 我们支持15个国家的节假日数据，自动排除法定节假日
</Accordion>

<Accordion title="Q2: 周末是否包含？">
  A: 工作日计算默认排除周六和周日
</Accordion>

## 相关工具

<FeatureCard 
  icon="calendar"
  title="添加纪念日"
  description="永远不会忘记重要的日子"
  link="/anniversaries"
  cta="立即使用"
/>

<RelatedContent topics={["日期计算"]} limit={3} />
```

---

## 六、性能优化建议

### 6.1 图片优化

- ✅ 使用 WebP 格式（自动fallback到JPEG）
- ✅ 首屏图片设置 `priority={true}`
- ✅ 非首屏图片自动懒加载
- ✅ 响应式图片（自动生成多种尺寸）

### 6.2 代码分割

- ✅ 富媒体组件按需加载
- ✅ 使用 `dynamic` 动态导入大型组件
- ✅ 视频组件仅在可见区域加载

### 6.3 交互优化

- ✅ 所有组件支持键盘导航
- ✅ 所有组件支持屏幕阅读器
- ✅ 适配移动端触摸交互

---

## 七、可访问性（A11y）

### 7.1 图片

- ✅ 所有图片必须有 `alt` 属性
- ✅ 装饰性图片使用 `alt=""`
- ✅ 图片尺寸不会导致布局跳动

### 7.2 交互

- ✅ 所有可点击元素支持键盘（Tab键）
- ✅ 焦点状态清晰可见
- ✅ ARIA 属性正确使用

### 7.3 颜色对比

- ✅ 文字与背景对比度 ≥ 4.5:1
- ✅ 链接与正文有明显区分
- ✅ 按钮状态有视觉反馈

---

## 八、验收标准

### ✅ 组件功能完整
- [ ] 17个组件全部开发完成
- [ ] 所有组件在 MDX 中可用
- [ ] 所有组件支持 Props
- [ ] 所有组件渲染正常

### ✅ 响应式设计
- [ ] 桌面端显示正常
- [ ] 移动端显示正常
- [ ] 平板端显示正常
- [ ] 断点切换平滑

### ✅ 性能优化
- [ ] 图片懒加载
- [ ] 代码分割
- [ ] 首屏加载 <2.5s

### ✅ 可访问性
- [ ] 所有图片有 alt
- [ ] 键盘导航正常
- [ ] 屏幕阅读器兼容
- [ ] 颜色对比度达标

---

## 九、快速参考表

| 组件 | 用途 | 必填Props | 适用场景 |
|------|------|----------|---------|
| HeroBanner | 头图 | image, title | 文章开头 |
| BlogImage | 插图 | src, alt | 正文插图 |
| ImageWithText | 图文混排 | image, alt, children | 功能介绍 |
| ImageGallery | 图片画廊 | images | 多图展示 |
| VideoPlayer | 视频 | src | 演示视频 |
| ChartContainer | 图表 | src, alt | 数据展示 |
| TableOfContents | 目录 | - | 长文章 |
| EmbedCalculator | 计算器 | type | Tools/Guides |
| AddAnniversary | 纪念日 | - | Stories/Guides |
| FeatureCard | 功能卡片 | icon, title, description, link | 文章结尾 |
| CountdownDisplay | 倒计时 | targetDate | Stories/Updates |
| Accordion | 折叠内容 | title, children | FAQ |
| Tabs | 标签页 | children | 多方法展示 |
| Callout | 提示框 | type, children | 关键提示 |
| StepGuide | 步骤 | children | 操作流程 |
| CodeBlock | 代码 | language, children | API示例 |
| RelatedContent | 相关推荐 | - | 文章结尾 |

---

**版本历史**:
- v2.0 (2025-10-10): 初始版本，17+组件完整文档

