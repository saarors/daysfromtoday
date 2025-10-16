/**
 * 目标卡片 OG Image 生成 API
 * 使用 @vercel/og 在 Edge Runtime 生成卡片图片
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getTemplateById } from '@/lib/preset-templates';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取参数
    const templateId = searchParams.get('template') || 'gradient-professional';
    const goalText = searchParams.get('text') || 'My Goal';
    const targetDate = searchParams.get('date') || new Date().toISOString();
    const daysCount = parseInt(searchParams.get('days') || '0');
    const userName = searchParams.get('name') || '';
    
    // 读取模板
    const template = getTemplateById(templateId);
    
    if (!template) {
      return new Response('Template not found', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // 格式化日期
    const date = new Date(targetDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    // 计算宽高
    const [widthRatio, heightRatio] = template.layout.aspectRatio.split(':').map(Number);
    const width = 1200;
    const height = Math.round(width * (heightRatio / widthRatio));
    
    // 渲染卡片
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: `${template.layout.padding}px`,
            background: template.background.value,
            position: 'relative',
          }}
        >
          {/* 顶部标题栏 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px'
          }}>
            {template.decorations?.icon && (
              <span style={{ fontSize: '40px' }}>
                {template.decorations.icon}
              </span>
            )}
            <span
              style={{
                fontSize: `${template.typography.title.fontSize}px`,
                fontWeight: template.typography.title.fontWeight,
                color: template.typography.title.color,
                textShadow: template.typography.title.shadow 
                  ? '0 2px 8px rgba(0,0,0,0.15)' 
                  : 'none',
              }}
            >
              {userName ? `${userName}'s Goal` : 'My Goal'}
            </span>
          </div>
          
          {/* 中心内容区 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: `${template.layout.gap}px`,
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {/* 目标日期 */}
            <div
              style={{
                display: 'flex',
                fontSize: `${template.typography.date.fontSize}px`,
                fontWeight: template.typography.date.fontWeight,
                color: template.typography.date.color,
                letterSpacing: template.typography.date.letterSpacing 
                  ? `${template.typography.date.letterSpacing}px` 
                  : 'normal',
              }}
            >
              {formattedDate}
            </div>
            
            {/* 倒计时 */}
            <div
              style={{
                display: 'flex',
                fontSize: `${template.typography.countdown.fontSize}px`,
                fontWeight: template.typography.countdown.fontWeight,
                color: template.typography.countdown.color,
                textShadow: template.typography.countdown.shadow 
                  ? '0 4px 12px rgba(0,0,0,0.2)' 
                  : 'none',
                lineHeight: 1,
              }}
            >
              {daysCount}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: `${template.typography.date.fontSize}px`,
                color: template.typography.metadata.color,
                marginTop: '-12px',
              }}
            >
              {daysCount === 1 ? 'day' : 'days'}
            </div>
            
            {/* 用户短语 */}
            {template.decorations?.glassmorphism ? (
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '28px 40px',
                  maxWidth: '85%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  marginTop: '20px',
                }}
              >
                <p
                  style={{
                    fontSize: `${template.typography.description.fontSize}px`,
                    color: template.typography.description.color,
                    fontWeight: template.typography.description.fontWeight,
                    textAlign: 'center',
                    fontStyle: 'italic',
                    margin: 0,
                    lineHeight: template.typography.description.lineHeight || 1.6,
                    letterSpacing: template.typography.description.letterSpacing 
                      ? `${template.typography.description.letterSpacing}px` 
                      : 'normal',
                  }}
                >
                  "{goalText}"
                </p>
              </div>
            ) : (
              <p
                style={{
                  fontSize: `${template.typography.description.fontSize}px`,
                  color: template.typography.description.color,
                  fontWeight: template.typography.description.fontWeight,
                  textAlign: 'center',
                  margin: 0,
                  marginTop: '20px',
                  maxWidth: '85%',
                  lineHeight: template.typography.description.lineHeight || 1.6,
                }}
              >
                "{goalText}"
              </p>
            )}
          </div>
          
          {/* 底部元信息 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: `${template.typography.metadata.fontSize}px`,
              color: template.typography.metadata.color,
            }}
          >
            <span>📅 Started: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>⏱️ {daysCount} {daysCount === 1 ? 'day' : 'days'} to go</span>
          </div>
          
          {/* 水印 */}
          {template.decorations?.watermark && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '13px',
                color: `rgba(255,255,255,${template.decorations.watermark.opacity})`,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              🌐 {template.decorations.watermark.text}
            </div>
          )}
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (error) {
    console.error('Card rendering error:', error);
    return new Response('Failed to generate card', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

