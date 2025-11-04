# AI 流式输出功能模块

**版本**: V3.0  
**状态**: Stable  
**最后更新**: 2024-11-04

---

## 📖 模块概述

AI流式输出模块提供实时的AI对话体验,支持DeepSeek Reasoner模型的思维链展示和内容流式输出。

### 核心特性

- ✅ Server-Sent Events (SSE) 实时流式输出
- ✅ `<think>` 标签解析与思维链可视化
- ✅ 任务列表动态展示 (3-6步)
- ✅ Markdown实时渲染
- ✅ 错误处理与重试机制

---

## 🏗️ 架构设计

```
Client (React)
  ↓
useStreamingBuffer Hook
  ↓
fetch('/api/ai/chat/stream')
  ↓
API Route (Edge Runtime)
  ↓
DeepSeek API
  ↓
SSE Stream → Client
```

---

## 📦 核心文件

### 1. Hook: `hooks/useStreamingBuffer.ts`
流式数据管理Hook,分离thinking和content两个buffer。

**使用示例**:
```typescript
const streaming = useStreamingBuffer();

// 开始流式输出
await streaming.startStreaming('/api/ai/chat/stream', {
  prompt: '用户输入',
  model: 'deepseek-reasoner',
});

// 获取内容
const thinking = streaming.thinking; // 思维过程
const content = streaming.content;   // 实际内容
const isStreaming = streaming.isStreaming;
```

### 2. API: `app/api/ai/chat/stream/route.ts`
SSE流式输出API,调用DeepSeek API并转换为SSE格式。

**关键代码**:
```typescript
const stream = new ReadableStream({
  async start(controller) {
    for await (const chunk of response.body) {
      const text = decoder.decode(chunk);
      controller.enqueue(`data: ${JSON.stringify({chunk: text})}\n\n`);
    }
    controller.enqueue('data: [DONE]\n\n');
    controller.close();
  }
});
```

### 3. 组件: `components/v3/Wishlist/ThinkingTaskList.tsx`
思维链任务列表展示组件,解析thinking内容并动画展示。

---

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install react-markdown remark-gfm
```

### 2. 配置环境变量
```bash
DEEPSEEK_API_KEY=sk-xxx
```

### 3. 使用示例
```typescript
import { useStreamingBuffer } from '@/hooks/useStreamingBuffer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatComponent() {
  const streaming = useStreamingBuffer();
  
  const handleSubmit = async () => {
    await streaming.startStreaming('/api/ai/chat/stream', {
      prompt: userInput,
    });
  };
  
  return (
    <div>
      {/* 思维过程 */}
      {streaming.thinking && (
        <ThinkingTaskList content={streaming.thinking} />
      )}
      
      {/* AI回复 */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {streaming.content}
      </ReactMarkdown>
    </div>
  );
}
```

---

## 📚 相关文档

- [最佳实践](./AI_STREAMING_BEST_PRACTICES.md)
- [进化历史](./AI_STREAMING_EVOLUTION_HISTORY.md)
- [经验教训](../../../experience/LESSONS_LEARNED.md)

---

**维护者**: AI Coding Team




