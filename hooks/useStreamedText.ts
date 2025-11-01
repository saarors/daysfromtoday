/**
 * 流式文本渲染 Hook（简化版 + 节流防闪烁）
 * 
 * 策略：
 * - 流式阶段：节流更新（每 50ms 或累积 30 字符）
 * - 完成阶段：立即显示完整内容
 */

import { useEffect, useState, useRef } from 'react';

interface UseStreamedTextOptions {
  sourceText: string;
  isStreaming: boolean;
  onComplete?: () => void;
}

export function useStreamedText({
  sourceText,
  isStreaming,
  onComplete,
}: UseStreamedTextOptions) {
  const [displayText, setDisplayText] = useState('');
  const lastUpdateRef = useRef(0);
  const lastLengthRef = useRef(0);
  const pendingUpdateRef = useRef<NodeJS.Timeout | null>(null);

  // 流式阶段：节流更新（防止频闪）
  useEffect(() => {
    if (!isStreaming) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;
    const lengthDiff = sourceText.length - lastLengthRef.current;

    // 策略：时间超过 50ms 或累积超过 30 字符时更新
    const shouldUpdate = timeSinceLastUpdate >= 50 || lengthDiff >= 30;

    if (shouldUpdate) {
      // 立即更新
      setDisplayText(sourceText);
      lastUpdateRef.current = now;
      lastLengthRef.current = sourceText.length;
      
      // 清除待处理的延迟更新
      if (pendingUpdateRef.current) {
        clearTimeout(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }
    } else {
      // 延迟更新（确保最后的内容也能显示）
      if (pendingUpdateRef.current) {
        clearTimeout(pendingUpdateRef.current);
      }
      pendingUpdateRef.current = setTimeout(() => {
        setDisplayText(sourceText);
        lastUpdateRef.current = Date.now();
        lastLengthRef.current = sourceText.length;
        pendingUpdateRef.current = null;
      }, 50);
    }

    return () => {
      if (pendingUpdateRef.current) {
        clearTimeout(pendingUpdateRef.current);
      }
    };
  }, [sourceText, isStreaming]);

  // 流式结束：立即显示完整内容
  useEffect(() => {
    if (!isStreaming && sourceText) {
      // 清除待处理的更新
      if (pendingUpdateRef.current) {
        clearTimeout(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }
      
      setDisplayText(sourceText);
      lastLengthRef.current = sourceText.length;
      onComplete?.();
    }
  }, [isStreaming, sourceText, onComplete]);

  return displayText;
}

