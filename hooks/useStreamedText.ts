/**
 * 流式文本渲染 Hook（简化版 - 直接显示）
 * 
 * 问题诊断：
 * - rAF 队列缓释在实际使用中不工作
 * - sourceText 更新但 displayText 不更新
 * 
 * 新策略：
 * - 流式阶段：直接显示 sourceText（让浏览器原生渲染处理）
 * - 完成阶段：切换到 Markdown 渲染
 */

import { useEffect, useState } from 'react';

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

  // 流式阶段：直接同步 sourceText
  useEffect(() => {
    if (isStreaming) {
      setDisplayText(sourceText);
    }
  }, [sourceText, isStreaming]);

  // 流式结束：确保显示完整内容并触发回调
  useEffect(() => {
    if (!isStreaming && sourceText) {
      setDisplayText(sourceText);
      onComplete?.();
    }
  }, [isStreaming, sourceText, onComplete]);

  return displayText;
}

