/**
 * 预设模板库
 * DaysFromToday V3.0 - Phase 1
 * 
 * 包含 8 个预设模板：
 * - 方案一：渐变风格（5 种配色）
 * - 方案二：极简风格（3 种配色）
 */

import type { CardTemplate } from '@/types/card-template';

/**
 * 方案一：渐变风格模板（5 种配色）
 */
export const gradientTemplates: CardTemplate[] = [
  {
    id: 'gradient-professional',
    name: '专业蓝紫',
    type: 'gradient',
    category: 'goal',
    layout: {
      mode: 'vertical',
      aspectRatio: '16:9',
      padding: 48,
      gap: 24
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      opacity: 1
    },
    typography: {
      title: {
        fontSize: 24,
        fontWeight: 600,
        color: '#FFFFFF',
        align: 'left',
        shadow: true
      },
      date: {
        fontSize: 32,
        fontWeight: 500,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 1
      },
      countdown: {
        fontSize: 96,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'center',
        shadow: true
      },
      description: {
        fontSize: 20,
        fontWeight: 400,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 0.5,
        lineHeight: 1.6
      },
      metadata: {
        fontSize: 14,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.8)',
        align: 'center'
      }
    },
    decorations: {
      icon: '🎯',
      watermark: {
        text: 'DaysFromToday.ai',
        position: 'bottom-center',
        opacity: 0.6
      },
      glassmorphism: true,
      shadows: true
    },
    thumbnail: '/templates/gradient-professional.png',
    isPreset: true
  },
  {
    id: 'gradient-romantic',
    name: '浪漫粉红',
    type: 'gradient',
    category: 'anniversary',
    layout: {
      mode: 'vertical',
      aspectRatio: '16:9',
      padding: 48,
      gap: 24
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
      opacity: 1
    },
    typography: {
      title: {
        fontSize: 24,
        fontWeight: 600,
        color: '#FFFFFF',
        align: 'left',
        shadow: true
      },
      date: {
        fontSize: 32,
        fontWeight: 500,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 1
      },
      countdown: {
        fontSize: 96,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'center',
        shadow: true
      },
      description: {
        fontSize: 20,
        fontWeight: 400,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 0.5,
        lineHeight: 1.6
      },
      metadata: {
        fontSize: 14,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.9)',
        align: 'center'
      }
    },
    decorations: {
      icon: '💖',
      watermark: {
        text: 'DaysFromToday.ai',
        position: 'bottom-center',
        opacity: 0.5
      },
      glassmorphism: true,
      shadows: true
    },
    thumbnail: '/templates/gradient-romantic.png',
    isPreset: true
  },
  {
    id: 'gradient-fresh',
    name: '清新青蓝',
    type: 'gradient',
    category: 'goal',
    layout: {
      mode: 'vertical',
      aspectRatio: '16:9',
      padding: 48,
      gap: 24
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
      opacity: 1
    },
    typography: {
      title: {
        fontSize: 24,
        fontWeight: 600,
        color: '#FFFFFF',
        align: 'left',
        shadow: true
      },
      date: {
        fontSize: 32,
        fontWeight: 500,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 1
      },
      countdown: {
        fontSize: 96,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'center',
        shadow: true
      },
      description: {
        fontSize: 20,
        fontWeight: 400,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 0.5,
        lineHeight: 1.6
      },
      metadata: {
        fontSize: 14,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.85)',
        align: 'center'
      }
    },
    decorations: {
      icon: '🌊',
      watermark: {
        text: 'DaysFromToday.ai',
        position: 'bottom-center',
        opacity: 0.6
      },
      glassmorphism: true,
      shadows: true
    },
    thumbnail: '/templates/gradient-fresh.png',
    isPreset: true
  },
  {
    id: 'gradient-growth',
    name: '成长绿青',
    type: 'gradient',
    category: 'goal',
    layout: {
      mode: 'vertical',
      aspectRatio: '16:9',
      padding: 48,
      gap: 24
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
      opacity: 1
    },
    typography: {
      title: {
        fontSize: 24,
        fontWeight: 600,
        color: '#FFFFFF',
        align: 'left',
        shadow: true
      },
      date: {
        fontSize: 32,
        fontWeight: 500,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 1
      },
      countdown: {
        fontSize: 96,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'center',
        shadow: true
      },
      description: {
        fontSize: 20,
        fontWeight: 400,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 0.5,
        lineHeight: 1.6
      },
      metadata: {
        fontSize: 14,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.9)',
        align: 'center'
      }
    },
    decorations: {
      icon: '🌱',
      watermark: {
        text: 'DaysFromToday.ai',
        position: 'bottom-center',
        opacity: 0.5
      },
      glassmorphism: true,
      shadows: true
    },
    thumbnail: '/templates/gradient-growth.png',
    isPreset: true
  },
  {
    id: 'gradient-sunset',
    name: '日落橙黄',
    type: 'gradient',
    category: 'goal',
    layout: {
      mode: 'vertical',
      aspectRatio: '16:9',
      padding: 48,
      gap: 24
    },
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
      opacity: 1
    },
    typography: {
      title: {
        fontSize: 24,
        fontWeight: 600,
        color: '#FFFFFF',
        align: 'left',
        shadow: true
      },
      date: {
        fontSize: 32,
        fontWeight: 500,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 1
      },
      countdown: {
        fontSize: 96,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'center',
        shadow: true
      },
      description: {
        fontSize: 20,
        fontWeight: 400,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 0.5,
        lineHeight: 1.6
      },
      metadata: {
        fontSize: 14,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.9)',
        align: 'center'
      }
    },
    decorations: {
      icon: '🌅',
      watermark: {
        text: 'DaysFromToday.ai',
        position: 'bottom-center',
        opacity: 0.5
      },
      glassmorphism: true,
      shadows: true
    },
    thumbnail: '/templates/gradient-sunset.png',
    isPreset: true
  },
];

/**
 * 方案二：极简风格模板（3 种配色）
 */
export const minimalistTemplates: CardTemplate[] = [
  {
    id: 'minimalist-white',
    name: '极简白色',
    type: 'minimalist',
    category: 'goal',
    layout: {
      mode: 'vertical',
      aspectRatio: '16:9',
      padding: 56,
      gap: 32
    },
    background: {
      type: 'solid',
      value: '#FFFFFF',
      opacity: 1
    },
    typography: {
      title: {
        fontSize: 22,
        fontWeight: 600,
        color: '#111827',
        align: 'left'
      },
      date: {
        fontSize: 28,
        fontWeight: 500,
        color: '#374151',
        align: 'center',
        letterSpacing: 0.5
      },
      countdown: {
        fontSize: 88,
        fontWeight: 700,
        color: '#0069FF',
        align: 'center'
      },
      description: {
        fontSize: 18,
        fontWeight: 400,
        color: '#6B7280',
        align: 'center',
        lineHeight: 1.6
      },
      metadata: {
        fontSize: 13,
        fontWeight: 400,
        color: '#9CA3AF',
        align: 'center'
      }
    },
    decorations: {
      icon: '🎯',
      watermark: {
        text: 'DaysFromToday',
        position: 'bottom-right',
        opacity: 0.3
      },
      glassmorphism: false,
      shadows: true
    },
    thumbnail: '/templates/minimalist-white.png',
    isPreset: true
  },
  {
    id: 'minimalist-dark',
    name: '极简深色',
    type: 'minimalist',
    category: 'goal',
    layout: {
      mode: 'vertical',
      aspectRatio: '16:9',
      padding: 56,
      gap: 32
    },
    background: {
      type: 'solid',
      value: '#0F172A',
      opacity: 1
    },
    typography: {
      title: {
        fontSize: 22,
        fontWeight: 600,
        color: '#F8FAFC',
        align: 'left'
      },
      date: {
        fontSize: 28,
        fontWeight: 500,
        color: '#CBD5E1',
        align: 'center',
        letterSpacing: 0.5
      },
      countdown: {
        fontSize: 88,
        fontWeight: 700,
        color: '#60A5FA',
        align: 'center'
      },
      description: {
        fontSize: 18,
        fontWeight: 400,
        color: '#94A3B8',
        align: 'center',
        lineHeight: 1.6
      },
      metadata: {
        fontSize: 13,
        fontWeight: 400,
        color: '#64748B',
        align: 'center'
      }
    },
    decorations: {
      icon: '⭐',
      watermark: {
        text: 'DaysFromToday',
        position: 'bottom-right',
        opacity: 0.3
      },
      glassmorphism: false,
      shadows: true
    },
    thumbnail: '/templates/minimalist-dark.png',
    isPreset: true
  },
  {
    id: 'minimalist-beige',
    name: '极简米色',
    type: 'minimalist',
    category: 'goal',
    layout: {
      mode: 'vertical',
      aspectRatio: '16:9',
      padding: 56,
      gap: 32
    },
    background: {
      type: 'solid',
      value: '#FAF8F3',
      opacity: 1
    },
    typography: {
      title: {
        fontSize: 22,
        fontWeight: 600,
        color: '#292524',
        align: 'left'
      },
      date: {
        fontSize: 28,
        fontWeight: 500,
        color: '#57534E',
        align: 'center',
        letterSpacing: 0.5
      },
      countdown: {
        fontSize: 88,
        fontWeight: 700,
        color: '#EA580C',
        align: 'center'
      },
      description: {
        fontSize: 18,
        fontWeight: 400,
        color: '#78716C',
        align: 'center',
        lineHeight: 1.6
      },
      metadata: {
        fontSize: 13,
        fontWeight: 400,
        color: '#A8A29E',
        align: 'center'
      }
    },
    decorations: {
      icon: '📝',
      watermark: {
        text: 'DaysFromToday',
        position: 'bottom-right',
        opacity: 0.3
      },
      glassmorphism: false,
      shadows: true
    },
    thumbnail: '/templates/minimalist-beige.png',
    isPreset: true
  },
];

/**
 * 导出所有预设模板
 */
export const allPresetTemplates: CardTemplate[] = [
  ...gradientTemplates,
  ...minimalistTemplates
];

/**
 * 根据 ID 获取模板
 */
export function getTemplateById(id: string): CardTemplate | undefined {
  return allPresetTemplates.find(t => t.id === id);
}

/**
 * 根据类型获取模板列表
 */
export function getTemplatesByType(type: 'gradient' | 'minimalist'): CardTemplate[] {
  return allPresetTemplates.filter(t => t.type === type);
}

/**
 * 根据分类获取模板列表
 */
export function getTemplatesByCategory(category: 'goal' | 'anniversary' | 'custom'): CardTemplate[] {
  return allPresetTemplates.filter(t => t.category === category);
}

/**
 * 获取所有渐变模板
 */
export function getGradientTemplates(): CardTemplate[] {
  return gradientTemplates;
}

/**
 * 获取所有极简模板
 */
export function getMinimalistTemplates(): CardTemplate[] {
  return minimalistTemplates;
}

