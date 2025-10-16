# Phase 2 Day 5-7 数据同步测试指南

## 📋 测试目标

验证 LocalStorage → Supabase 自动同步功能是否正常工作。

---

## 🧪 测试步骤

### 准备工作

1. **确保未登录状态**
   ```
   http://localhost:3000/en
   ```
   - 导航栏显示 "Sign In" 按钮
   - 打开浏览器 Console（F12）

2. **清理之前的数据**（可选）
   ```javascript
   // 在 Console 中执行
   localStorage.clear();
   location.reload();
   ```

---

### 测试 1: 创建本地卡片

**目标**: 在未登录状态下创建本地卡片

**步骤**:
1. 访问 V3 测试页面: `http://localhost:3000/en/v3-test`
2. 选择一个模板（如 "专业蓝紫"）
3. 输入目标文本（如 "Complete Marathon Training"）
4. 点击 "💾 保存卡片" 按钮

**预期结果**:
- ✅ 弹出提示 "✅ 卡片已保存！"
- ✅ Console 显示: `已保存: 1 张卡片`
- ✅ 右上角显示: `已保存: 1 张卡片`

**重复操作**: 再创建 2-3 张不同的卡片

---

### 测试 2: 验证本地存储

**目标**: 确认卡片已保存到 LocalStorage

**步骤**:
在 Console 中执行:
```javascript
const storage = localStorage.getItem('goal-cards-storage');
const data = JSON.parse(storage);
console.log('本地卡片:', data.state.cards);
```

**预期结果**:
- ✅ 显示卡片数组
- ✅ 每张卡片包含: `templateId`, `goalText`, `targetDate`, `daysCount`

---

### 测试 3: 登录触发同步

**目标**: 验证登录后自动同步

**步骤**:
1. 点击导航栏 "Sign In" 按钮
2. 使用 Google 账户登录
3. **立即查看 Console 输出**

**预期结果（Console 日志）**:
```
🔄 检测到用户登录，准备同步 3 张本地卡片...
🔄 开始同步 3 张本地卡片到 Supabase...
✅ 同步成功: Complete Marathon Training
✅ 同步成功: Learn React
✅ 同步成功: Read 50 Books

📊 同步完成: {成功: 3, 跳过: 0, 错误: 0}
✅ 成功同步 3 张卡片，已清理本地数据
🧹 本地卡片已清理
✅ 卡片同步完成！
🎉 已同步 3 张卡片到你的账户！
```

---

### 测试 4: 验证数据库同步

**目标**: 确认卡片已同步到 Supabase

**步骤**:
1. 访问 Supabase Dashboard
2. 进入 Table Editor → `goal_cards` 表
3. 查看数据

**预期结果**:
- ✅ 看到 3 条新记录
- ✅ `user_id` 字段与登录用户 ID 一致
- ✅ `template_id` 字段正确
- ✅ `goal_text` 字段正确
- ✅ `is_public` = `false`（默认私有）
- ✅ `created_at` 和 `updated_at` 已填充

---

### 测试 5: 验证本地数据已清理

**目标**: 确认 LocalStorage 已清理

**步骤**:
在 Console 中执行:
```javascript
const storage = localStorage.getItem('goal-cards-storage');
const data = JSON.parse(storage);
console.log('本地卡片数量:', data.state.cards.length);
```

**预期结果**:
- ✅ 输出: `本地卡片数量: 0`

---

### 测试 6: 重复同步（去重测试）

**目标**: 验证去重逻辑

**步骤**:
1. 登出账户
2. 再次创建相同的卡片（相同模板 + 相同文本 + 相同日期）
3. 重新登录

**预期结果（Console 日志）**:
```
⏭️  跳过重复卡片: Complete Marathon Training
⏭️  跳过重复卡片: Learn React
⏭️  跳过重复卡片: Read 50 Books

📊 同步完成: {成功: 0, 跳过: 3, 错误: 0}
⏭️  所有卡片已存在，跳过同步
```

---

### 测试 7: 部分重复测试

**目标**: 验证部分卡片重复的情况

**步骤**:
1. 登出账户
2. 创建 2 张新卡片 + 1 张重复卡片
3. 重新登录

**预期结果**:
- ✅ 新卡片同步成功
- ✅ 重复卡片被跳过
- ✅ Console 显示:
  ```
  ✅ 同步成功: New Goal 1
  ✅ 同步成功: New Goal 2
  ⏭️  跳过重复卡片: Complete Marathon Training
  
  📊 同步完成: {成功: 2, 跳过: 1, 错误: 0}
  ```

---

### 测试 8: 空卡片测试

**目标**: 验证没有本地卡片时的行为

**步骤**:
1. 登出账户
2. 清理 LocalStorage: `localStorage.clear()`
3. 重新登录

**预期结果**:
- ✅ Console 显示: `📦 没有本地卡片，跳过同步`
- ✅ 不执行同步操作

---

### 测试 9: 刷新页面保持同步状态

**目标**: 验证同步状态持久化

**步骤**:
1. 登录并同步后
2. 刷新页面（F5）

**预期结果**:
- ✅ 不会重复同步
- ✅ Console 不显示同步日志
- ✅ 用户保持登录状态

---

### 测试 10: 多次登出登入

**目标**: 验证登出后重置同步状态

**步骤**:
1. 登出
2. 创建新卡片
3. 登录
4. 验证同步
5. 再次登出
6. 再次创建新卡片
7. 再次登录

**预期结果**:
- ✅ 每次登录都会触发同步
- ✅ 每次同步都正常工作

---

## 🐛 常见问题排查

### 问题 1: 同步未触发
**症状**: 登录后 Console 没有同步日志

**检查**:
1. 确认是否有本地卡片
   ```javascript
   localStorage.getItem('goal-cards-storage')
   ```
2. 确认 AutoSync 组件是否加载
3. 查看 Console 是否有错误

---

### 问题 2: 同步失败
**症状**: Console 显示错误信息

**检查**:
1. 确认 Supabase 连接正常
2. 确认 `goal_cards` 表存在
3. 确认 RLS 策略正确
4. 查看详细错误信息

---

### 问题 3: 卡片重复
**症状**: 数据库中出现重复卡片

**检查**:
1. 确认去重逻辑是否正确
2. 检查卡片的 `templateId`, `goalText`, `targetDate` 是否完全相同
3. 查看 Supabase Dashboard 数据

---

### 问题 4: 本地数据未清理
**症状**: 同步后 LocalStorage 仍有数据

**检查**:
1. 确认 `clearLocalCards()` 是否被调用
2. 检查 Console 是否显示 "🧹 本地卡片已清理"
3. 手动检查 LocalStorage

---

## ✅ 验收标准

### Phase 2 Day 5-7 完成条件:
- [x] 登录后自动触发同步
- [x] 正确上传本地卡片到 Supabase
- [x] 智能去重（跳过重复卡片）
- [x] 同步成功后清理本地数据
- [x] 完整的错误处理
- [x] Console 日志清晰可读
- [x] 刷新页面不重复同步
- [x] 空卡片时跳过同步

---

## 📊 测试记录表

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 1. 创建本地卡片 | ⏳ | |
| 2. 验证本地存储 | ⏳ | |
| 3. 登录触发同步 | ⏳ | |
| 4. 数据库同步 | ⏳ | |
| 5. 本地数据清理 | ⏳ | |
| 6. 重复同步去重 | ⏳ | |
| 7. 部分重复测试 | ⏳ | |
| 8. 空卡片测试 | ⏳ | |
| 9. 刷新保持状态 | ⏳ | |
| 10. 多次登出登入 | ⏳ | |

---

## 🚀 下一步

测试通过后，继续：
- **Phase 2 Day 8-10**: 创建用户卡片管理页面

