/**
 * ImageWithText - 图文混排组件
 * 
 * 用途: 图片和文字并排显示，适合介绍功能或流程
 * 使用场景: Tools、Guides、Features 的功能介绍
 */

import Image from 'next/image';
import { ReactNode } from 'react';

interface ImageWithTextProps {
  image: string;           // 图片 URL（必填）
  alt: string;             // 替代文字（必填）
  position?: 'left' | 'right';  // 图片位置（默认 'left'）
  imageWidth?: '1/3' | '1/2' | '2/3';  // 图片宽度占比（默认 '1/2'）
  children: ReactNode;     // 文字内容（必填）
}

const imageWidthClasses = {
  '1/3': 'md:w-1/3',
  '1/2': 'md:w-1/2',
  '2/3': 'md:w-2/3',
};

const textWidthClasses = {
  '1/3': 'md:w-2/3',
  '1/2': 'md:w-1/2',
  '2/3': 'md:w-1/3',
};

export function ImageWithText({
  image,
  alt,
  position = 'left',
  imageWidth = '1/2',
  children,
}: ImageWithTextProps) {
  return (
    <div className={`flex flex-col ${position === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 md:gap-8 my-8 items-center`}>
      {/* 图片 */}
      <div className={`w-full ${imageWidthClasses[imageWidth]} flex-shrink-0`}>
        <div className="relative w-full aspect-video overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      
      {/* 文字内容 */}
      <div className={`w-full ${textWidthClasses[imageWidth]} prose prose-gray dark:prose-invert`}>
        {children}
      </div>
    </div>
  );
}

