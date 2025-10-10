/**
 * Cloudflare R2 客户端封装
 * 
 * 功能:
 * 1. 图片上传（自动优化）
 * 2. 多格式生成（WebP + JPEG）
 * 3. 智能压缩和裁剪
 * 4. CDN URL 生成
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

// ============================================================
// 配置
// ============================================================

const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID || '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.R2_BUCKET_NAME || 'daysfromtoday-content',
  publicUrl: process.env.R2_PUBLIC_URL || 'https://cdn.daysfromtoday.ai',
};

// 初始化 R2 客户端
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
});

// ============================================================
// 类型定义
// ============================================================

export interface UploadOptions {
  maxWidth?: number;           // 最大宽度（默认 1200）
  quality?: number;            // 图片质量（默认 85）
  format?: 'webp' | 'jpeg' | 'png';  // 格式（默认 'webp'）
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface UploadResult {
  url: string;
  metadata: ImageMetadata;
}

export interface MultiFormatResult {
  webp: UploadResult;
  jpeg: UploadResult;
}

// ============================================================
// 核心函数
// ============================================================

/**
 * 上传图片到 R2（自动优化）
 * 
 * @param buffer - 图片 Buffer
 * @param path - 存储路径（不含扩展名）
 * @param options - 上传选项
 * @returns CDN URL 和元数据
 */
export async function uploadImage(
  buffer: Buffer,
  path: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { maxWidth = 1200, quality = 85, format = 'webp' } = options;
  
  try {
    // 1. 获取原图信息
    const metadata = await sharp(buffer).metadata();
    
    // 2. 优化图片
    let optimized = sharp(buffer);
    
    // 如果宽度超过限制，等比例缩放
    if (metadata.width && metadata.width > maxWidth) {
      optimized = optimized.resize({ 
        width: maxWidth, 
        withoutEnlargement: true 
      });
    }
    
    // 转换格式和压缩
    const processedBuffer = await optimized
      .toFormat(format, { quality })
      .toBuffer();
    
    // 3. 获取处理后的元数据
    const processedMetadata = await sharp(processedBuffer).metadata();
    
    // 4. 上传到 R2
    const key = `${path}.${format}`;
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_CONFIG.bucketName,
        Key: key,
        Body: processedBuffer,
        ContentType: `image/${format}`,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );
    
    // 5. 返回 CDN URL 和元数据
    const url = `${R2_CONFIG.publicUrl}/${key}`;
    
    return {
      url,
      metadata: {
        width: processedMetadata.width || 0,
        height: processedMetadata.height || 0,
        format: processedMetadata.format || format,
        size: processedBuffer.length,
      },
    };
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error(`Failed to upload image to R2: ${error}`);
  }
}

/**
 * 上传多格式图片（WebP + JPEG）
 * 
 * @param buffer - 图片 Buffer
 * @param path - 存储路径（不含扩展名）
 * @returns WebP 和 JPEG 的 URL
 */
export async function uploadMultiFormatImage(
  buffer: Buffer,
  path: string
): Promise<MultiFormatResult> {
  try {
    const [webp, jpeg] = await Promise.all([
      uploadImage(buffer, path, { format: 'webp' }),
      uploadImage(buffer, path, { format: 'jpeg' }),
    ]);
    
    return { webp, jpeg };
  } catch (error) {
    console.error('Multi-format upload failed:', error);
    throw new Error(`Failed to upload multi-format image: ${error}`);
  }
}

/**
 * 智能压缩图片（自动调整质量）
 * 
 * 如果图片过大（>3MB），自动降低质量直到满足要求
 * 
 * @param buffer - 图片 Buffer
 * @param path - 存储路径
 * @param targetSize - 目标大小（字节，默认 3MB）
 * @returns 上传结果
 */
export async function uploadWithSmartCompression(
  buffer: Buffer,
  path: string,
  targetSize: number = 3 * 1024 * 1024
): Promise<UploadResult> {
  let quality = 85;
  let result: UploadResult | null = null;
  
  // 渐进式压缩，直到满足目标大小
  while (quality >= 60) {
    result = await uploadImage(buffer, path, { quality, format: 'webp' });
    
    if (result.metadata.size <= targetSize) {
      console.log(`Smart compression: ${quality}% quality, ${(result.metadata.size / 1024 / 1024).toFixed(2)}MB`);
      return result;
    }
    
    quality -= 5;
  }
  
  // 如果质量降到 60 还是太大，返回最后的结果
  console.warn(`Warning: Image size (${(result!.metadata.size / 1024 / 1024).toFixed(2)}MB) exceeds target (${(targetSize / 1024 / 1024).toFixed(2)}MB)`);
  return result!;
}

/**
 * 删除图片
 * 
 * @param key - R2 对象键（如 content/zh/philosophy/example.webp）
 */
export async function deleteImage(key: string): Promise<void> {
  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_CONFIG.bucketName,
        Key: key,
      })
    );
    console.log(`Deleted: ${key}`);
  } catch (error) {
    console.error('Delete failed:', error);
    throw new Error(`Failed to delete image from R2: ${error}`);
  }
}

/**
 * 获取公开 URL
 * 
 * @param key - R2 对象键
 * @returns CDN URL
 */
export function getPublicUrl(key: string): string {
  return `${R2_CONFIG.publicUrl}/${key}`;
}

/**
 * 检查 R2 配置是否完整
 * 
 * @returns 配置是否有效
 */
export function isR2Configured(): boolean {
  return !!(
    R2_CONFIG.accountId &&
    R2_CONFIG.accessKeyId &&
    R2_CONFIG.secretAccessKey &&
    R2_CONFIG.bucketName
  );
}

/**
 * 获取图片元数据（不上传）
 * 
 * @param buffer - 图片 Buffer
 * @returns 图片元数据
 */
export async function getImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
  try {
    const metadata = await sharp(buffer).metadata();
    
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: buffer.length,
    };
  } catch (error) {
    console.error('Failed to get metadata:', error);
    throw new Error(`Failed to get image metadata: ${error}`);
  }
}

// ============================================================
// 辅助函数（供 Obsidian 脚本使用）
// ============================================================

/**
 * 根据文件路径生成 R2 存储路径
 * 
 * @param vaultPath - Obsidian Vault 根路径
 * @param filePath - 图片文件路径
 * @returns R2 存储路径（不含扩展名）
 * 
 * @example
 * generateStoragePath(
 *   '/Users/xxx/daysfromtoday/content',
 *   '/Users/xxx/daysfromtoday/content/philosophy/zh/time-value/hero.jpg'
 * )
 * // => 'content/zh/philosophy/time-value/hero'
 */
export function generateStoragePath(vaultPath: string, filePath: string): string {
  // 获取相对路径
  const relativePath = filePath.replace(vaultPath, '').replace(/^\//, '');
  
  // 移除扩展名
  const pathWithoutExt = relativePath.replace(/\.[^.]+$/, '');
  
  return pathWithoutExt;
}

// ============================================================
// 导出配置（用于调试）
// ============================================================

export const R2_INFO = {
  configured: isR2Configured(),
  bucketName: R2_CONFIG.bucketName,
  publicUrl: R2_CONFIG.publicUrl,
  accountId: R2_CONFIG.accountId ? '***' : '(not set)',
};

