'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type ChunkType = 'thinking' | 'content';

type PendingChunk = {
  type: ChunkType;
  text: string;
};

const FRAME_INTERVAL = 16; // ~60fps

export interface StreamingBufferState {
  thinking: string;
  content: string;
  isStreaming: boolean;
  appendChunk: (type: ChunkType, text: string) => void;
  startStreaming: () => void;
  finishStreaming: () => void;
  reset: () => void;
  snapshotContent: () => string;
}

export function useStreamingBuffer(): StreamingBufferState {
  const [thinking, setThinking] = useState('');
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const pendingChunksRef = useRef<PendingChunk[]>([]);
  const frameRef = useRef<number | null>(null);
  const lastFlushRef = useRef<number>(0);
  const thinkingStateRef = useRef('');
  const contentStateRef = useRef('');

  const drainPendingChunks = useCallback(() => {
    if (pendingChunksRef.current.length === 0) return;

    let thinkingBuffer = '';
    let contentBuffer = '';

    for (const chunk of pendingChunksRef.current) {
      if (!chunk.text) continue;
      if (chunk.type === 'thinking') {
        thinkingBuffer += chunk.text;
      } else {
        contentBuffer += chunk.text;
      }
    }

    pendingChunksRef.current = [];

    if (thinkingBuffer) {
      setThinking((prev) => {
        const next = prev + thinkingBuffer;
        thinkingStateRef.current = next;
        return next;
      });
    }
    if (contentBuffer) {
      setContent((prev) => {
        const next = prev + contentBuffer;
        contentStateRef.current = next;
        return next;
      });
    }
  }, []);

  const scheduleFlush = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      drainPendingChunks();
      lastFlushRef.current = performance.now();

      if (pendingChunksRef.current.length > 0) {
        scheduleFlush();
      }
    });
  }, [drainPendingChunks]);

  const appendChunk = useCallback(
    (type: ChunkType, text: string) => {
      if (!text) return;
      pendingChunksRef.current.push({ type, text });

      const now = performance.now();
      const timeSinceLastFlush = now - lastFlushRef.current;

      if (timeSinceLastFlush >= FRAME_INTERVAL) {
        scheduleFlush();
      }
    },
    [scheduleFlush]
  );

  const startStreaming = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    pendingChunksRef.current = [];
    setThinking('');
    setContent('');
    thinkingStateRef.current = '';
    contentStateRef.current = '';
    setIsStreaming(true);
    lastFlushRef.current = performance.now();
  }, []);

  const finishStreaming = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    drainPendingChunks();
    setIsStreaming(false);
  }, [drainPendingChunks]);

  const reset = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    pendingChunksRef.current = [];
    setThinking('');
    setContent('');
    thinkingStateRef.current = '';
    contentStateRef.current = '';
    setIsStreaming(false);
    lastFlushRef.current = 0;
  }, []);

  const snapshotContent = useCallback(() => {
    const pendingContent = pendingChunksRef.current
      .filter((chunk) => chunk.type === 'content')
      .map((chunk) => chunk.text)
      .join('');
    return contentStateRef.current + pendingContent;
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      pendingChunksRef.current = [];
    };
  }, []);

  return {
    thinking,
    content,
    isStreaming,
    appendChunk,
    startStreaming,
    finishStreaming,
    reset,
    snapshotContent,
  };
}

