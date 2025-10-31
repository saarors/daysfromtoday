/**
 * 卡片模板类型定义
 * DaysFromToday V3.0 - Phase 1
 */

/**
 * 卡片模板类型
 */
export type CardTemplateType = 
  | 'gradient'      // 渐变风格
  | 'minimalist'    // 极简风格
  | 'custom';       // 自定义

/**
 * 背景类型
 */
export type BackgroundType =
  | 'gradient'      // CSS 渐变
  | 'solid'         // 纯色
  | 'image'         // 图片（用户上传）
  | 'pattern';      // 图案（预设纹理）

/**
 * 文本对齐方式
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * 布局模式
 */
export type LayoutMode = 
  | 'vertical'      // 垂直布局
  | 'horizontal'    // 横向布局
  | 'split';        // 左右分栏

/**
 * 文本样式配置
 */
export interface TextStyle {
  /** 字号（px） */
  fontSize: number;
  /** 字重 */
  fontWeight: number;
  /** 颜色 */
  color: string;
  /** 对齐方式 */
  align: TextAlign;
  /** 行高 */
  lineHeight?: number;
  /** 字间距 */
  letterSpacing?: number;
  /** 字体 */
  fontFamily?: string;
  /** 文字阴影 */
  shadow?: boolean;
}

/**
 * 布局配置
 */
export interface LayoutConfig {
  /** 布局模式 */
  mode: LayoutMode;
  /** 宽高比 */
  aspectRatio: string;
  /** 内边距（px） */
  padding: number;
  /** 元素间距（px） */
  gap: number;
}

/**
 * 背景配置
 */
export interface BackgroundConfig {
  /** 背景类型 */
  type: BackgroundType;
  /** 背景值（CSS gradient / color / image URL） */
  value: string;
  /** 背景透明度（0-1） */
  opacity?: number;
  /** 背景模糊（仅图片） */
  blur?: number;
  /** 遮罩层颜色 */
  overlay?: string;
}

/**
 * 装饰元素配置
 */
export interface DecorationConfig {
  /** 顶部图标（emoji or 图片 URL） */
  icon?: string;
  /** 水印配置 */
  watermark?: {
    text: string;
    position: 'bottom-center' | 'bottom-right' | 'bottom-left';
    opacity: number;
  };
  /** 是否启用玻璃拟态 */
  glassmorphism?: boolean;
  /** 是否启用阴影 */
  shadows?: boolean;
}

/**
 * 卡片模板配置
 */
export interface CardTemplate {
  /** 模板 ID */
  id: string;
  /** 模板名称 */
  name: string;
  /** 模板类型 */
  type: CardTemplateType;
  /** 模板分类 */
  category: 'goal' | 'anniversary' | 'custom';
  
  /** 布局配置 */
  layout: LayoutConfig;
  
  /** 背景配置 */
  background: BackgroundConfig;
  
  /** 文本样式配置 */
  typography: {
    title: TextStyle;
    date: TextStyle;
    countdown: TextStyle;
    description: TextStyle;
    metadata: TextStyle;
  };
  
  /** 装饰元素配置 */
  decorations?: DecorationConfig;
  
  /** 预览图 */
  thumbnail: string;
  
  /** 是否为预设模板 */
  isPreset: boolean;
  
  /** 创建者（用户上传的模板） */
  createdBy?: string;
  /** 创建时间 */
  createdAt?: string;
}

/**
 * 卡片类型（Phase 2.6）
 */
export type CardType = 'future' | 'past';

/**
 * 计算模式（Phase 2.6）
 */
export type CalculationMode = 'date-first' | 'days-first';

/**
 * 天数类型（Phase 2.6）
 */
export type DaysType = 'natural' | 'working';

/**
 * 用户卡片内容数据
 */
export interface CardContent {
  /** 标题（如 "Leon's Goal"） */
  title?: string;
  /** 目标日期 */
  targetDate: string;
  /** 倒计时天数 */
  daysCount: number;
  /** 工作日天数（Phase 2.6） */
  workingDaysCount?: number;
  /** 用户短语（200字以内） */
  goalText: string;
  /** 开始日期 */
  startDate?: string;
  /** 自定义 emoji */
  emoji?: string;
}

/**
 * 自定义背景配置
 */
export interface CustomBackground {
  /** 图片 URL（Cloudflare R2） */
  imageUrl: string;
  /** 图片 ID（用于删除） */
  imageId: string;
  /** 上传时间 */
  uploadedAt: string;
}

/**
 * 用户卡片数据
 */
export interface CardData {
  /** 卡片 ID */
  id: string;
  /** 使用的模板 ID */
  templateId: string;
  
  /** 内容数据 */
  content: CardContent;
  
  /** 卡片类型（Phase 2.6） */
  cardType: CardType;
  /** 计算模式（Phase 2.6） */
  calculationMode: CalculationMode;
  /** 天数类型（Phase 2.6） */
  daysType: DaysType;
  
  /** 样式覆盖（可选，覆盖模板默认样式） */
  styleOverrides?: Partial<CardTemplate>;
  
  /** 自定义背景（用户上传） */
  customBackground?: CustomBackground;
  
  /** 元信息 */
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

/**
 * 卡片生成参数
 */
export interface CardGenerateParams {
  /** 模板 ID */
  templateId: string;
  /** 用户名 */
  userName?: string;
  /** 目标文字 */
  goalText: string;
  /** 目标日期 */
  targetDate: string;
  /** 倒计时天数 */
  daysCount: number;
  /** 自定义背景 URL */
  customBackground?: string;
}

/**
 * 模板过滤器
 */
export interface TemplateFilter {
  /** 按类型过滤 */
  type?: CardTemplateType;
  /** 按分类过滤 */
  category?: 'goal' | 'anniversary' | 'custom';
  /** 仅预设模板 */
  presetsOnly?: boolean;
}

/**
 * 日期计算结果（Phase 2.6）
 */
export interface DateCalculationResult {
  /** 目标日期 */
  targetDate: string;
  /** 自然日天数 */
  naturalDays: number;
  /** 工作日天数 */
  workingDays: number;
  /** 计算的国家代码 */
  countryCode: string;
}

