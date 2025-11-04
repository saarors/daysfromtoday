# V3.0 变更日志 (CHANGELOG)

**版本号**: 3.0.0  
**发布日期**: 2024-11-04  
**代号**: AI Companion

---

## 🎉 V3.0.0 (2024-11-04) - 首次正式发布

### 🆕 新增功能

#### AI 智能助手系统
- ✅ 新增 **10种核心AI助手人格**
  - 🌟 Twinkle (陪伴型)
  - 🏋️ 艾力 (教练型)
  - 👔 林墨 (导师型)
  - 🧠 罗琪 (分析型)
  - 🧮 宋安 (顾问型)
  - 🪞 苏瑾 (反思者)
  - 🫶 温语 (疗愈型)
  - 🔥 焰锋 (挑战者)
  - ♟️ 沈策 (战略家)
  - 🛡️ 卫宁 (守护者)
- ✅ 保留 **3种经典助手** (向后兼容)
  - Twinkle (原版)
  - Labubu
  - Jobs
- ✅ 智能匹配系统
  - 目标类型识别 (8种类型)
  - 难度评估 (4个等级)
  - 自动匹配最合适的AI助手
  - 处理时间 < 1秒

#### AI 流式输出
- ✅ 实时流式对话 (Server-Sent Events)
- ✅ DeepSeek Reasoner 模型集成
- ✅ `<think>` 标签解析与思维链展示
- ✅ 任务列表动态展示 (3-6步)
- ✅ 可折叠/展开思维过程
- ✅ 清晰的视觉分隔

#### Markdown 实时渲染
- ✅ `react-markdown` + `remark-gfm` 集成
- ✅ 支持 GitHub 风格 Markdown
- ✅ 表格、列表、粗体、斜体、代码块
- ✅ 边流式输出边实时渲染
- ✅ 自定义 Tailwind CSS 样式

#### 愿望清单管理
- ✅ Supabase 数据库集成
- ✅ 创建/查看/删除目标卡片
- ✅ 保存AI分析结果
- ✅ 关联匹配的AI助手
- ✅ ViewOnly 模式 (查看详情)
- ✅ 数据持久化

#### 用户认证
- ✅ Supabase Auth 集成
- ✅ Email + Magic Link 登录
- ✅ 会话自动刷新 (中间件)
- ✅ 保护路由 (`/wishlist` 需要登录)

#### 系统级问题管理
- ✅ 端口管理脚本 (`check-ports.sh`, `stop-port.sh`)
- ✅ 文件句柄检查 (`check-file-handles.sh`)
- ✅ 标准化启动脚本 (`start-dev.sh`)
- ✅ NPM 快捷命令 (`dev:safe`, `dev:clean`, `dev:reset`, `health`)
- ✅ 完整故障排查文档

### ⚡ 性能优化

- ✅ 优化首屏加载 (LCP < 2.5s)
- ✅ 优化交互响应 (INP < 200ms)
- ✅ 优化布局稳定性 (CLS < 0.1)
- ✅ API响应时间优化 (AI匹配 < 1s, 数据库查询 < 200ms)
- ✅ 文件句柄限制管理 (ulimit -n 10240)

### 🐛 Bug修复

#### 关键Bug修复
- ✅ 修复 **500 Internal Server Error** (AI助手配置不匹配)
  - 原因: 代码使用新助手,但配置文件只有旧助手
  - 修复: 更新 `lib/ai-assistants.ts` 添加10种核心助手
- ✅ 修复 **404 Not Found** (所有页面)
  - 原因: EMFILE文件句柄不足 + .next缓存损坏
  - 修复: 增加文件句柄限制 + 清理缓存 + 标准化脚本
- ✅ 修复 **ViewOnly模式助手信息丢失**
  - 原因: `matchResult` 未在ViewOnly模式下恢复
  - 修复: 从 `wishCards` 重建 `matchResult`
- ✅ 修复 **保存后空白页**
  - 原因: 状态未正确重置 (`showChat`/`showUserGoal`)
  - 修复: 在 `handleChatComplete` 中重置所有UI状态
- ✅ 修复 **Markdown表格渲染错乱**
  - 原因: 流式输出中断表格结构
  - 修复: 实时Markdown解析 + `remark-gfm` 表格支持
- ✅ 修复 **重复AI调用**
  - 原因: React StrictMode 双重渲染
  - 修复: 使用 `useRef` 防止并发调用

#### 其他Bug修复
- ✅ 修复 AI助手卡片显示错误 (显示为"Twinkle"而非匹配助手)
- ✅ 修复 端口占用导致启动失败
- ✅ 修复 CSS样式丢失 (首次访问)
- ✅ 修复 Hydration 错误 (服务端与客户端不匹配)
- ✅ 修复 `<think>` 标签内容重复显示

### 🔧 技术改进

#### 架构优化
- ✅ 重构 AI助手配置系统 (从3个扩展到13个)
- ✅ 重构 流式输出 Hook (`useStreamingBuffer`)
- ✅ 重构 Markdown渲染逻辑 (实时解析)
- ✅ 重构 数据库Schema (新增助手/类型/难度字段)
- ✅ 重构 愿望清单页面 (集成AI对话)

#### 代码质量
- ✅ 删除 5个冗余备份文件
- ✅ 统一 TypeScript 类型定义
- ✅ 优化 console.log (保留关键调试信息)
- ✅ 改进 错误处理 (防御性编程)
- ✅ 改进 代码注释 (中文说明 + 英文代码)

#### 文档完善
- ✅ 创建 系统故障排查文档
- ✅ 创建 AI流式输出最佳实践文档
- ✅ 创建 AI流式输出进化历史文档
- ✅ 创建 版本说明文档
- ✅ 创建 变更日志
- ✅ 重组 文档目录结构

### 📦 依赖更新

#### 新增依赖
```json
{
  "react-markdown": "^10.1.0",
  "remark-gfm": "^4.0.1",
  "@supabase/supabase-js": "^2.75.0",
  "@supabase/ssr": "^0.7.0",
  "zustand": "^5.0.8"
}
```

#### 核心依赖版本
```json
{
  "next": "^14.2.15",
  "react": "^18.3.1",
  "typescript": "^5",
  "tailwindcss": "^4",
  "next-intl": "^4.3.9"
}
```

### 🗑️ 移除内容

#### 删除的文件
- ❌ `app/[locale]/wishlist/page-backup.tsx`
- ❌ `app/[locale]/wishlist/page-full.tsx.bak`
- ❌ `app/[locale]/wishlist/page-v2-backup.tsx`
- ❌ `app/[locale]/wishlist/page-latest-broken.tsx`
- ❌ `app/[locale]/wishlist/page-broken.tsx`

#### 废弃的功能
- ❌ 旧版AI助手配置 (已迁移到新系统,保留向后兼容)

### ⚠️ Breaking Changes (破坏性变更)

#### 1. AI助手类型定义
**之前**:
```typescript
type AIAssistant = 'twinkle' | 'labubu' | 'jobs';
```

**现在**:
```typescript
type AIAssistantType = 
  | 'companion' | 'coach' | 'mentor' | 'analyst' | 'advisor'
  | 'reflector' | 'therapist' | 'challenger' | 'strategist' | 'guardian'
  | 'twinkle' | 'labubu' | 'jobs'; // 向后兼容
```

**迁移**: 旧代码仍然兼容,但建议逐步迁移到新的助手类型。

#### 2. 数据库Schema
**新增字段** (`goal_cards` 表):
- `ai_persona_code` (varchar)
- `goal_type_code` (varchar)
- `detected_difficulty` (varchar)

**迁移**: 自动添加默认值,无需手动迁移。

#### 3. 环境变量
**必需的新环境变量**:
```bash
DEEPSEEK_API_KEY=sk-xxx  # 必需
```

**迁移**: 需要在 `.env.local` 和 Vercel 中配置。

### 📝 已知问题

#### 待解决
1. **测试页面未清理** (6个测试页面保留)
   - `test-fetch-stream`
   - `test-stream`
   - `test-wishlist-simple`
   - `probe-stream`
   - `streaming-demo`
   - `v3-test`
   
2. **Lint警告** (~15个warning, ~30个error)
   - 未使用的变量
   - `any` 类型
   - 转义字符

3. **AI响应延迟** (Reasoner模型思考时间5-15秒)
   - 可优化用户等待体验

4. **Markdown渲染限制**
   - 复杂表格可能不完美
   - 代码高亮未实现

### 🎯 下一步计划

#### V3.1 (计划中)
- [ ] 清理所有测试页面
- [ ] 修复所有Lint警告和错误
- [ ] 优化AI响应时间
- [ ] 添加代码高亮支持
- [ ] 添加更多语言支持

---

## 📊 版本对比

| 功能 | V2.x | V3.0 |
|------|------|------|
| AI助手 | ❌ 无 | ✅ 13种人格 |
| 智能匹配 | ❌ 无 | ✅ 自动匹配 |
| 流式输出 | ❌ 无 | ✅ SSE流式 |
| 思维链 | ❌ 无 | ✅ 可视化 |
| Markdown | ❌ 无 | ✅ 实时渲染 |
| 数据持久化 | ❌ 本地 | ✅ Supabase |
| 用户认证 | ❌ 无 | ✅ Supabase Auth |
| 系统管理 | ❌ 手动 | ✅ 标准化脚本 |

---

## 🙏 致谢

感谢所有在V3.0开发过程中提供帮助和反馈的人!

特别感谢:
- **DeepSeek** - 提供强大的AI模型
- **Supabase** - 提供稳定的数据库和认证服务
- **Vercel** - 提供优质的托管平台
- **开源社区** - react-markdown, remark-gfm等优秀工具

---

## 📚 参考文档

- [版本说明 (VERSION.md)](./VERSION.md)
- [产品需求文档 (PRD)](../product/V3.0_PRD.md)
- [系统故障排查](../technical/troubleshooting/SYSTEM_TROUBLESHOOTING.md)
- [AI流式输出最佳实践](../technical/features/ai-streaming/AI_STREAMING_BEST_PRACTICES.md)

---

**文档维护**: AI Coding Team  
**最后更新**: 2024-11-04




