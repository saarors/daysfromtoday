/**
 * HeroBanner - 头图/Banner 组件
 * 
 * 用途: 文章开头的大图横幅，营造视觉冲击力
 * 使用场景: Philosophy、Stories、Guides 的文章开头
 */

import Image from 'next/image';

interface HeroBannerProps {
  image: string;           // 图片 URL（必填）
  title: string;           // 标题（必填）
  subtitle?: string;       // 副标题（可选）
  overlay?: boolean;       // 是否添加深色遮罩（默认 false）
  height?: 'small' | 'medium' | 'large';  // 高度（默认 'medium'）
}

const heightClasses = {
  small: 'h-64 md:h-80',
  medium: 'h-80 md:h-96',
  large: 'h-96 md:h-[32rem]',
};

export function HeroBanner({
  image,
  title,
  subtitle,
  overlay = false,
  height = 'medium',
}: HeroBannerProps) {
  return (
    <div className={`relative w-full ${heightClasses[height]} overflow-hidden rounded-lg mb-8`}>
      {/* 背景图片 */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      
      {/* 深色遮罩（可选） */}
      {overlay && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      
      {/* 标题内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-center max-w-2xl drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

