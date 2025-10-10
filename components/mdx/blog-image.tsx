/**
 * BlogImage - 增强图片组件
 * 
 * 用途: 正文中的插图，支持灯箱放大、懒加载、响应式
 * 使用场景: 所有类型文章的正文插图
 */

'use client';

import Image from 'next/image';
import { useState } from 'react';

interface BlogImageProps {
  src: string;             // 图片 URL（必填）
  alt: string;             // 替代文字（必填，SEO）
  caption?: string;        // 图片说明（可选）
  lightbox?: boolean;      // 是否支持点击放大（默认 true）
  priority?: boolean;      // 是否优先加载（默认 false）
  width?: number;          // 宽度（可选，自动计算）
  height?: number;         // 高度（可选，自动计算）
}

export function BlogImage({
  src,
  alt,
  caption,
  lightbox = true,
  priority = false,
  width = 1200,
  height = 800,
}: BlogImageProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleImageClick = () => {
    if (lightbox) {
      setIsLightboxOpen(true);
    }
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <>
      {/* 图片容器 */}
      <figure className="my-8">
        <div
          className={`relative w-full overflow-hidden rounded-lg ${
            lightbox ? 'cursor-zoom-in' : ''
          }`}
          onClick={handleImageClick}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
        
        {/* 图片说明 */}
        {caption && (
          <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* 灯箱（全屏显示） */}
      {lightbox && isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={handleCloseLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl font-light hover:text-gray-300 transition-colors"
            onClick={handleCloseLightbox}
            aria-label="Close lightbox"
          >
            ×
          </button>
          
          <div className="relative max-w-7xl max-h-[90vh]">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
              priority
            />
            {caption && (
              <p className="text-center text-white mt-4">{caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

