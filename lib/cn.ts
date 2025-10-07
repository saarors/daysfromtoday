import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 className（支持 Tailwind CSS）
 * @param inputs - className 数组
 * @returns 合并后的 className
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

