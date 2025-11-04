# AI 流式输出快速参考卡

> **适用于**: 需要快速查阅关键代码的开发者  
> **详细文档**: `docs/AI_STREAMING_BEST_PRACTICES.md`

---

## 🎯 核心架构

```
API (SSE) → useStreamingBuffer (Hook) → UI (ReactMarkdown)
   ↓              ↓                           ↓
 实时转发      三级缓冲                    实时渲染
```

---

## 🔑 关键代码片段

### 1. 防止内容截断 (最关键!)

```typescript
// hooks/useStreamingBuffer.ts
const finishStreaming = useCallback(() => {
  // 🔥 手动flush所有pending chunks
  for (const chunk of pendingChunksRef.current) {
    if (chunk.type === 'thinking') {
      thinkingBufferRef.current += chunk.text;
    } else {
      contentBufferRef.current += chunk.text;
    }
  }
  
  // 🔥 强制同步累积到state
  const finalContent = contentStateRef.current + contentBufferRef.current;
  contentStateRef.current = finalContent;
  setContent(finalContent);
  
  // 🔥 清空所有缓冲
  pendingChunksRef.current = [];
  contentBufferRef.current = '';
  
  setIsStreaming(false);
}, []);
```

### 2. 防止重复调用 (React StrictMode)

```typescript
const generatingRef = useRef(false);

const generateAI = async () => {
  if (generatingRef.current) return; // 🔒 检查锁
  generatingRef.current = true;     // 🔒 上锁
  
  try {
    // ... AI生成逻辑 ...
  } finally {
    generatingRef.current = false;   // 🔓 解锁
  }
};
```

### 3. <think>标签解析 (状态机)

```typescript
let pendingText = '';
let insideThinking = false;

for (const delta of deltas) {
  pendingText += delta;
  
  if (pendingText.includes('<think>')) {
    const [before, after] = pendingText.split('<think>');
    streaming.appendChunk('content', before);
    insideThinking = true;
    pendingText = after;
  } else if (pendingText.includes('</think>')) {
    const [think, after] = pendingText.split('</think>');
    streaming.appendChunk('thinking', think);
    insideThinking = false;
    streaming.appendChunk('content', after);
    pendingText = '';
  } else if (pendingText.length > 10) {
    const toOutput = pendingText.slice(0, -10);
    streaming.appendChunk(insideThinking ? 'thinking' : 'content', toOutput);
    pendingText = pendingText.slice(-10);
  }
}

// 🔥 最后flush
if (pendingText) {
  streaming.appendChunk(insideThinking ? 'thinking' : 'content', pendingText);
}
```

### 4. Markdown表格渲染

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<div className="markdown-content">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {content}
  </ReactMarkdown>
</div>

<style jsx global>{`
  .markdown-content table {
    width: 100% !important;
    border-collapse: collapse !important;
    display: table !important; /* 🔥 防止flex破坏 */
  }
  .markdown-content th {
    background: #f3f4f6 !important;
    font-weight: 600 !important;
    padding: 12px !important;
  }
  .markdown-content td {
    padding: 10px 12px !important;
    border: 1px solid #e5e7eb !important;
  }
`}</style>
```

### 5. API路由 (SSE流式传输)

```typescript
// app/api/ai/chat/stream/route.ts
export async function POST(request: Request) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: [...],
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            const delta = data.choices[0]?.delta?.content || '';
            
            if (delta) {
              // 🔥 直接转发,不做处理
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`)
              );
            }
          }
        }
      }

      controller.enqueue(encoder.encode('data: {"type":"done"}\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

## 🚨 常见错误速查

| 错误症状 | 原因 | 解决方案 |
|---------|------|---------|
| **内容截断** | buffer未flush | finishStreaming强制flush |
| **重复输出** | StrictMode双render | useRef并发锁 |
| **表格不渲染** | remarkGfm缺失 | 添加remarkPlugins |
| **<think>显示错乱** | 标签跨chunk | 前端状态机解析 |
| **延迟高** | 后端收集完整响应 | 改为实时转发 |

---

## 📊 性能指标

- **首屏加载**: ≤ 2.5s
- **交互延迟**: ≤ 200ms
- **流式延迟**: ≤ 50ms/chunk
- **内容完整性**: 100%

---

## 🔗 相关文档

- **完整最佳实践**: `docs/AI_STREAMING_BEST_PRACTICES.md`
- **版本信息**: `docs/backups/v1.0-stable-streaming/VERSION.md`
- **恢复指南**: `docs/backups/v1.0-stable-streaming/RESTORE_GUIDE.md`

---

**保持这张卡片在手边,快速解决90%的流式输出问题!** ⚡

