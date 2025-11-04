# V1.0-Stable-Streaming 恢复指南

## 📦 备份文件清单

本目录包含 **V1.0 稳定版本** 的核心文件备份:

```
docs/backups/v1.0-stable-streaming/
├── VERSION.md                      # 版本信息与功能清单
├── RESTORE_GUIDE.md               # 本文档 - 恢复指南
├── wishlist-page.tsx.backup       # 愿望清单主页面
├── useStreamingBuffer.ts.backup   # 流式缓冲Hook
└── api-stream-route.ts.backup     # AI流式API路由
```

---

## 🔄 如何恢复到此版本

### 方法1: 手动恢复单个文件

如果某个文件出现问题,可以单独恢复:

```bash
# 恢复愿望清单页面
cp docs/backups/v1.0-stable-streaming/wishlist-page.tsx.backup \
   app/[locale]/wishlist/page.tsx

# 恢复流式缓冲Hook
cp docs/backups/v1.0-stable-streaming/useStreamingBuffer.ts.backup \
   hooks/useStreamingBuffer.ts

# 恢复API路由
cp docs/backups/v1.0-stable-streaming/api-stream-route.ts.backup \
   app/api/ai/chat/stream/route.ts
```

### 方法2: 完整恢复所有文件

```bash
cd /Users/leonmini/quantum-era/daysfromtoday

# 备份当前版本(以防万一)
mkdir -p docs/backups/current-backup
cp app/[locale]/wishlist/page.tsx docs/backups/current-backup/
cp hooks/useStreamingBuffer.ts docs/backups/current-backup/
cp app/api/ai/chat/stream/route.ts docs/backups/current-backup/

# 恢复V1.0稳定版本
cp docs/backups/v1.0-stable-streaming/wishlist-page.tsx.backup \
   app/[locale]/wishlist/page.tsx
cp docs/backups/v1.0-stable-streaming/useStreamingBuffer.ts.backup \
   hooks/useStreamingBuffer.ts
cp docs/backups/v1.0-stable-streaming/api-stream-route.ts.backup \
   app/api/ai/chat/stream/route.ts

# 重启开发服务器
npm run dev
```

---

## 🔍 验证恢复是否成功

恢复后,请按以下步骤验证:

### 1. 检查服务器启动

```bash
npm run dev
```

应该看到:
```
✓ Ready in 2.5s
○ Local:    http://localhost:3000
```

### 2. 访问测试页面

打开浏览器: `http://localhost:3000/zh/wishlist?days=30&date=2025-12-03&goal=30天读完《原则》`

### 3. 功能验证清单

- [ ] 用户目标卡渐次显示
- [ ] AI助手匹配提示显示
- [ ] 任务列表(5个阶段)动态推进
- [ ] "AI助手深度推理中"等待提示
- [ ] AI思维链展示(可折叠)
- [ ] AI建议内容流式输出
- [ ] Markdown表格正确渲染
- [ ] 内容完整,无截断
- [ ] 完成按钮出现,可保存

### 4. Console验证

打开浏览器DevTools,检查Console输出:

```
🚀 开始 AI 生成
✅ 匹配到AI人格: rational
📡 调用API: /api/ai/chat/stream
📥 收到delta: ##
📥 收到delta:  💬
...
✅ AI 生成完成: { thinkingLength: 150, contentLength: 823 }
========== 🧠 AI 思维链 ==========
...
========== 📝 AI 完整输出 ==========
...
```

---

## ⚠️ 常见问题

### Q1: 恢复后出现 TypeScript 错误

**原因**: 可能缺少依赖或类型定义

**解决**:
```bash
npm install
npm run build
```

### Q2: 恢复后AI不响应

**原因**: 环境变量未配置

**解决**:
检查 `.env.local`:
```env
DEEPSEEK_API_KEY=sk-xxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
```

### Q3: Markdown表格不显示

**原因**: CSS未加载或被覆盖

**解决**:
检查 `app/[locale]/wishlist/page.tsx` 文件末尾是否有 `<style jsx global>` 块:
```tsx
<style jsx global>{`
  .markdown-content table {
    width: 100% !important;
    border-collapse: collapse !important;
    /* ... */
  }
`}</style>
```

### Q4: 内容有截断

**原因**: `useStreamingBuffer` 的 `finishStreaming` 未正确flush

**解决**:
确认 `hooks/useStreamingBuffer.ts` 的 `finishStreaming` 方法包含强制flush逻辑:
```typescript
const finishStreaming = useCallback(() => {
  // 手动处理所有pending chunks
  for (const chunk of pendingChunksRef.current) {
    // ...
  }
  // 强制flush所有buffer到state
  const finalContent = contentStateRef.current + contentBufferRef.current;
  // ...
}, []);
```

---

## 📊 版本对比

### V1.0-Stable-Streaming 的特点

| 功能 | V1.0 | 说明 |
|------|------|------|
| AI流式输出 | ✅ | SSE实时传输 |
| <think>标签解析 | ✅ | 前端状态机解析 |
| Markdown渲染 | ✅ | ReactMarkdown + remarkGfm |
| 任务列表可视化 | ✅ | 5阶段动态推进 |
| 内容完整性 | ✅ | 四重保障,无截断 |
| 并发控制 | ✅ | useRef防重复 |
| 品牌一致性 | ✅ | 隐藏模型名称 |
| 移动端适配 | ✅ | 响应式布局 |

---

## 🚀 升级建议

如果你想在V1.0基础上进行升级,建议按以下顺序:

1. **先备份当前工作版本** (防止丢失)
2. **在新分支测试新功能**
3. **逐步合并到主分支**
4. **每次重大变更都创建备份**

---

## 📞 支持

如有问题,请参考:
- 核心设计文档: `docs/AI_STREAMING_BEST_PRACTICES.md`
- 版本信息: `docs/backups/v1.0-stable-streaming/VERSION.md`
- 项目主规则: `.cursorrules`

---

**祝恢复顺利!** 🎉

