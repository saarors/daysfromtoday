/**
 * ChartContainer - 图表容器组件
 * 
 * 用途: 展示数据图表（统计图、流程图等）
 * 使用场景: Philosophy（数据支撑）、Tools（计算结果）、Updates（数据报告）
 */

import Image from 'next/image';

interface ChartContainerProps {
  src: string;             // 图表图片 URL（必填）
  alt: string;             // 替代文字（必填）
  caption?: string;        // 图表说明（可选）
  source?: string;         // 数据来源（可选）
  interactive?: boolean;   // 是否支持交互（默认 false，未来扩展）
}

export function ChartContainer({
  src,
  alt,
  caption,
  source,
  interactive = false,
}: ChartContainerProps) {
  return (
    <figure className="my-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* 图表 */}
      <div className="relative w-full aspect-video">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      </div>
      
      {/* 说明和来源 */}
      <figcaption className="text-center mt-4">
        {caption && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            {caption}
          </p>
        )}
        {source && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            数据来源: {source}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

