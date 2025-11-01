/**
 * 流式文本渲染 Hook（rAF 合帧缓释）
 * 
 * 核心策略：
 * 1. 将新 token 缓存在 ref 队列
 * 2. 用 requestAnimationFrame 每帧取出固定数量
 * 3. 按词切分（更自然）
 * 4. 可控速度：slow / normal / fast
 */

import { useEffect, useRef, useState, useCallback } from 'react';

type Speed = 'slow' | 'normal' | 'fast';

const SPEED_TABLE = {
  slow: 6,     // 每帧 6 个字符
  normal: 12,  // 每帧 12 个字符
  fast: 24,    // 每帧 24 个字符
};

interface UseStreamedTextOptions {
  sourceText: string;
  isStreaming: boolean;
  speed?: Speed;
  onComplete?: () => void;
}

export function useStreamedText({
  sourceText,
  isStreaming,
  speed = 'normal',
  onComplete,
}: UseStreamedTextOptions) {
  const [displayText, setDisplayText] = useState('');
  
  const bufferRef = useRef<string[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastSourceLengthRef = useRef(0);
  const mountedRef = useRef(true);

  // rAF 刷新逻辑
  const flush = useCallback(() => {
    if (rafRef.current !== null) return; // 已有待处理帧
    
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!mountedRef.current) return;
      
      if (bufferRef.current.length === 0) return;
      
      // 每帧取出 N 个字符
      const N = SPEED_TABLE[speed];
      const frameOut = bufferRef.current.splice(0, N).join('');
      setDisplayText((prev) => prev + frameOut);
      
      // 如果还有剩余，继续排下一帧
      if (bufferRef.current.length > 0) {
        flush();
      }
    });
  }, [speed]);

  // 监听 sourceText 变化，将新内容加入队列
  useEffect(() => {
    if (!isStreaming || !sourceText) return;
    
    if (sourceText.length > lastSourceLengthRef.current) {
      const newChars = sourceText.slice(lastSourceLengthRef.current);
      
      // 按词切分（空格、标点），视觉上更自然
      const pieces = newChars.split(/([，。！？；：、\s]+)/);
      bufferRef.current.push(...pieces);
      
      lastSourceLengthRef.current = sourceText.length;
      flush();
    }
  }, [sourceText, isStreaming, flush]);

  // 流式结束时，刷完剩余内容
  useEffect(() => {
    if (!isStreaming && sourceText) {
      // 取消待处理帧
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      
      // 把剩余的全部显示（只清空队列，不直接替换显示文本）
      if (bufferRef.current.length > 0) {
        setDisplayText((prev) => prev + bufferRef.current.join(''));
        bufferRef.current = [];
      }
      
      // 如果 displayText 还没完整显示 sourceText，补全剩余部分
      // （这种情况极少发生，只在某些边界情况下需要）
      setDisplayText((prev) => {
        if (prev.length < sourceText.length) {
          return sourceText;
        }
        return prev;
      });
      
      lastSourceLengthRef.current = sourceText.length;
      onComplete?.();
    }
  }, [isStreaming, sourceText, onComplete]);

  // 清理
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      bufferRef.current = [];
    };
  }, []);

  return displayText;
}

