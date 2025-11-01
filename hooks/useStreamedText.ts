/**
 * 流式文本渲染 Hook
 * 
 * 核心策略（参考 ChatGPT 方案）：
 * 1. 队列 + requestAnimationFrame 批量渲染
 * 2. 每帧最多渲染 N 个字符，模拟"缓释"效果
 * 3. 避免每个 chunk 都 setState
 */

import { useEffect, useRef, useState } from 'react';

interface UseStreamedTextOptions {
  charsPerFrame?: number;  // 每帧显示的字符数（默认 8-12）
  onComplete?: () => void;  // 流式完成回调
}

export function useStreamedText(
  sourceText: string,
  isStreaming: boolean,
  options: UseStreamedTextOptions = {}
) {
  const { charsPerFrame = 10, onComplete } = options;

  const [displayText, setDisplayText] = useState('');
  const bufferRef = useRef<string[]>([]);
  const frameRef = useRef<number | null>(null);
  const lastSourceLengthRef = useRef(0);

  // 调度渲染（每帧渲染一部分）
  const scheduleRender = () => {
    if (frameRef.current !== null) return; // 已有待处理帧

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;

      if (bufferRef.current.length > 0) {
        // 每帧最多取 N 个字符
        const chunk = bufferRef.current.splice(0, charsPerFrame).join('');
        setDisplayText((prev) => prev + chunk);

        // 如果还有内容，继续调度
        if (bufferRef.current.length > 0) {
          scheduleRender();
        }
      }
    });
  };

  // 监听 sourceText 变化，将新增部分加入队列
  useEffect(() => {
    if (isStreaming && sourceText.length > lastSourceLengthRef.current) {
      const newChars = sourceText.slice(lastSourceLengthRef.current);
      // 将新字符逐个加入队列
      bufferRef.current.push(...newChars.split(''));
      lastSourceLengthRef.current = sourceText.length;
      scheduleRender();
    }
  }, [sourceText, isStreaming]);

  // 流式结束时，立即显示所有剩余内容
  useEffect(() => {
    if (!isStreaming && sourceText) {
      // 取消待处理帧
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      // 清空队列，直接显示完整内容
      bufferRef.current = [];
      setDisplayText(sourceText);
      lastSourceLengthRef.current = sourceText.length;
      onComplete?.();
    }
  }, [isStreaming, sourceText, onComplete]);

  // 清理
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return displayText;
}

