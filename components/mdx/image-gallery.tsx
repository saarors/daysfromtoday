/**
 * ImageGallery - 图片画廊组件
 * 
 * 用途: 展示多张相关图片，支持网格布局或轮播
 * 使用场景: Guides（多步骤截图）、Stories（故事场景展示）
 */

'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  layout?: 'grid' | 'carousel';  // 布局方式（默认 'grid'）
  columns?: 2 | 3 | 4;           // 列数（仅 grid，默认 3）
  gap?: 'small' | 'medium' | 'large';  // 间距（默认 'medium'）
}

const gapClasses = {
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-6',
};

const columnClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export function ImageGallery({
  images,
  layout = 'grid',
  columns = 3,
  gap = 'medium',
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleLightboxPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (layout === 'carousel') {
    return (
      <div className="relative my-8">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className="object-cover cursor-zoom-in"
            onClick={() => openLightbox(currentIndex)}
            sizes="100vw"
          />
        </div>

        {/* 轮播控制 */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}

        {/* 图片说明 */}
        {images[currentIndex].caption && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            {images[currentIndex].caption}
          </p>
        )}

        {/* 指示器 */}
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Grid 布局
  return (
    <>
      <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} my-8`}>
        {images.map((image, index) => (
          <figure key={index} className="group">
            <div
              className="relative aspect-video overflow-hidden rounded-lg cursor-zoom-in"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {image.caption && (
              <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* 灯箱 */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl font-light hover:text-gray-300 transition-colors"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          <div className="relative max-w-7xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              width={1200}
              height={800}
              className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
              priority
            />
            {images[lightboxIndex].caption && (
              <p className="text-center text-white mt-4">{images[lightboxIndex].caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

