# 🎯 Phase 3.5 优化计划

## ✅ 已完成 (2025-11-01)

### 1. AI 模型升级 ✅
- **升级**: `deepseek-chat` → `deepseek-reasoner`
- **新功能**: 支持 `<think>` 标签，展示 AI 推理过程
- **Prompt 优化**: 
  - 增加对话感和个性化
  - 用第一人称、自然流畅的语言
  - 根据目标类型调整语气
  - 避免教科书式语言
- **技术实现**:
  - 新增 `parseAIResponse()` 函数解析思考链
  - 优化 `extractSummary()` 提取逻辑
  - API 响应增加 `thinking` 字段

---

## 🔄 待完成任务

### 2. 数据存储重构 🟡
**目标**: 移除 localStorage，纯 Supabase 存储（登录用户）

**改动文件**:
- `app/[locale]/wishlist/page.tsx` - 加载用户数据从 Supabase
- `store/use-goal-cards.ts` - 移除 localStorage 持久化
- `hooks/use-auto-sync.ts` - 移除本地卡片同步逻辑

**实施步骤**:
1. 修改 `page.tsx` 的 `useEffect`，从 Supabase 加载数据
2. 移除 Zustand 的 `persist` middleware
3. 所有卡片操作直接调用 Supabase API
4. 添加加载状态（skeleton）
5. 错误处理和重试逻辑

**预期效果**:
- ✅ 跨浏览器/设备数据同步
- ✅ 实时数据更新
- ⚠️ 需要登录才能使用（未登录显示引导）

---

### 3. AI 对话界面重设计 🟡
**目标**: ChatGPT 风格的卡片对话，支持复杂内容（表格、图表）

**设计要点**:
```tsx
// 新的对话流程
<div className="chat-container">
  {/* 用户消息卡片 */}
  <div className="message-card user-message">
    <div className="card-header">
      <Avatar size="sm" />
      <span className="name">你</span>
    </div>
    <div className="card-body">
      <div className="goal-info">
        <div className="label">目标时间</div>
        <div className="value">{targetDate}</div>
        <div className="countdown">距今 {days} 天</div>
      </div>
      <div className="goal-content">
        {goalText}
      </div>
    </div>
  </div>

  {/* AI 分析消息卡片 */}
  <div className="message-card ai-message">
    <div className="card-header">
      <Avatar emoji={aiAssistant.emoji} />
      <span className="name">{aiAssistant.name}</span>
      <span className="role">{aiAssistant.role}</span>
    </div>
    
    {/* 思考过程（可展开/收起）*/}
    {thinking && (
      <div className="thinking-section">
        <button className="thinking-toggle">
          <Brain /> AI 的思考过程 {expanded ? '▼' : '▶'}
        </button>
        {expanded && (
          <div className="thinking-content">
            {thinking}
          </div>
        )}
      </div>
    )}
    
    {/* AI 分析内容 */}
    <div className="card-body">
      <div className="analysis-badges">
        <Badge type={goalType.code}>{goalType.name}</Badge>
        <Badge difficulty={difficulty.level}>
          难度: {difficulty.label}
        </Badge>
      </div>
      
      <div className="ai-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {analysis}
        </ReactMarkdown>
      </div>
    </div>
    
    <div className="card-footer">
      <button className="btn-secondary">重新生成</button>
      <button className="btn-primary">保存到愿望清单</button>
    </div>
  </div>
</div>
```

**关键特性**:
- ✨ 卡片式布局（而非气泡）
- 🧠 思考过程可展开/收起
- 🏷️ 目标类型和难度标签
- 📊 支持 Markdown 表格
- 🎨 清晰的视觉层次
- 🔄 支持重新生成

**CSS 风格**:
- 白色卡片 + 阴影
- 圆角 12px
- 间距适中（不拥挤）
- 响应式布局

---

### 4. 卡片折叠优化 🟡
**目标**: 内容自适应，最大高度 6-8 行（约 200px）

**实施方案**:
```tsx
// WishCard.tsx 优化
export function WishCard({ /* props */ }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsExpand, setNeedsExpand] = useState(false);
  
  useEffect(() => {
    // 检测内容是否超过最大高度
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setNeedsExpand(height > 200); // 200px 阈值
    }
  }, [aiAnalysis]);
  
  return (
    <div className="wish-card">
      {/* ... 头部信息 ... */}
      
      {/* AI 建议区域 */}
      <div className="ai-section">
        <div 
          ref={contentRef}
          className={`ai-content ${isExpanded ? 'expanded' : 'collapsed'}`}
          style={{
            maxHeight: isExpanded ? 'none' : '200px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
          
          {/* 渐变遮罩（仅在折叠时显示）*/}
          {needsExpand && !isExpanded && (
            <div className="gradient-overlay" />
          )}
        </div>
        
        {/* 展开按钮（仅在需要时显示）*/}
        {needsExpand && (
          <button 
            className="expand-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '收起 ↑' : '展开完整建议 ↓'}
          </button>
        )}
      </div>
    </div>
  );
}
```

**CSS**:
```css
.ai-content.collapsed {
  position: relative;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  pointer-events: none;
}

.expand-toggle {
  margin-top: 12px;
  padding: 8px 16px;
  color: #3b82f6;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: center;
  font-size: 14px;
  transition: all 0.2s;
}

.expand-toggle:hover {
  background: #eff6ff;
  border-radius: 6px;
}
```

**关键特性**:
- 🎯 自动检测内容高度
- 📏 最大高度 200px（约 6-8 行）
- 🌊 底部渐变遮罩
- 🔄 平滑展开/收起动画
- ✨ 不需要展开时不显示按钮

---

## 📊 优先级总结

| 任务 | 优先级 | 工作量 | 影响 | 状态 |
|------|--------|--------|------|------|
| AI 模型升级 | P0 | 中 | 高 | ✅ 完成 |
| AI Prompt 优化 | P0 | 小 | 高 | ✅ 完成 |
| 数据存储重构 | P1 | 大 | 高 | 🟡 待开始 |
| 对话界面重设计 | P1 | 大 | 中 | 🟡 待开始 |
| 卡片折叠优化 | P2 | 小 | 低 | 🟡 待开始 |

---

## 🎯 建议的执行顺序

### 阶段 1: 基础功能（必需）
1. ✅ **AI 模型升级** - 已完成
2. 🔄 **数据存储重构** - 解决跨浏览器同步问题

### 阶段 2: 体验优化（重要）
3. 🎨 **对话界面重设计** - 提升对话体验
4. 📏 **卡片折叠优化** - 改善卡片展示

### 阶段 3: 测试与调优
5. 🧪 完整流程测试
6. 🐛 Bug 修复
7. ⚡ 性能优化
8. 📖 文档更新

---

## ⚠️ 注意事项

### 数据存储重构的风险
1. **破坏性变更**: 移除 localStorage 后，未登录用户无法使用 AI 功能
2. **用户体验**: 需要强制登录，可能流失部分用户
3. **数据迁移**: 已有本地数据需要提示用户登录并同步

**建议**: 
- 显示友好的登录引导页
- 提供"体验模式"（只展示示例，不保存）
- 数据迁移助手

### 对话界面重设计的影响
1. **代码量**: 需要重写整个对话组件（~500 行）
2. **测试量**: 需要测试多种场景（有/无 thinking、不同内容长度）
3. **兼容性**: 需要考虑移动端适配

---

## 📝 下一步

用户需要确认：
1. 是否继续执行剩余 3 个任务？
2. 是否同意数据存储重构的方案（纯 Supabase，需要登录）？
3. 对话界面的设计是否符合预期？需要调整吗？
4. 是否有其他优先级更高的需求？

---

**文档创建时间**: 2025-11-01  
**作者**: Claude (AI Coding Assistant)  
**项目状态**: 🚧 优化进行中

