# 快速同步测试指南

## 🎯 目标
验证 LocalStorage → Supabase 自动同步功能

---

## ⚡ 快速测试步骤（5分钟）

### 步骤 1: 准备工作
```
1. 确保未登录状态
2. 打开浏览器 Console（F12）
3. 访问: http://localhost:3000/en
```

---

### 步骤 2: 创建本地卡片
```
1. 访问: http://localhost:3000/en/v3-test
2. 选择模板 "专业蓝紫" (gradient-professional)
3. 输入目标: "Test Goal 1"
4. 点击 "💾 保存卡片"
5. 重复 2-3 次，创建多张卡片
```

**预期效果**:
- ✅ 右上角显示: "已保存: 3 张卡片"
- ✅ 弹出提示: "✅ 卡片已保存！"

---

### 步骤 3: 验证本地存储
在 Console 中执行:
```javascript
const storage = localStorage.getItem('goal-cards-storage');
const data = JSON.parse(storage);
console.log('本地卡片数量:', data.state.cards.length);
console.log('本地卡片:', data.state.cards);
```

**预期输出**:
```
本地卡片数量: 3
本地卡片: [Array with 3 cards]
```

---

### 步骤 4: 登录触发同步
```
1. 点击导航栏 "Sign In" 按钮
2. 使用 Google 账户登录
3. 立即查看 Console 输出
```

**预期 Console 日志**:
```
🔄 检测到用户登录，准备同步 3 张本地卡片...
🔄 开始同步 3 张本地卡片到 Supabase...
✅ 同步成功: Test Goal 1
✅ 同步成功: Test Goal 2
✅ 同步成功: Test Goal 3

📊 同步完成: {成功: 3, 跳过: 0, 错误: 0}
✅ 成功同步 3 张卡片，已清理本地数据
🧹 本地卡片已清理
✅ 卡片同步完成！
```

---

### 步骤 5: 验证数据库同步
**方法 1: 访问我的卡片页面**
```
1. 访问: http://localhost:3000/en/my-cards
2. 确认显示 3 张卡片
```

**方法 2: 查看 Supabase Dashboard**
```
1. 访问: https://supabase.com/dashboard/project/cdnyyakhsyzoummmfkuf
2. Table Editor → goal_cards
3. 确认有 3 条新记录
```

---

### 步骤 6: 验证本地数据已清理
在 Console 中执行:
```javascript
const storage = localStorage.getItem('goal-cards-storage');
const data = JSON.parse(storage);
console.log('本地卡片数量:', data.state.cards.length);
```

**预期输出**:
```
本地卡片数量: 0
```

---

## 🐛 故障排查

### 问题 1: 同步未触发
**症状**: 登录后 Console 没有同步日志

**解决方案**:
1. 刷新页面 (Ctrl+Shift+R / Cmd+Shift+R)
2. 清理缓存重新测试
3. 检查 Console 是否有报错

---

### 问题 2: 头像不显示
**症状**: 导航栏用户菜单显示 "坏图"

**解决方案**:
1. 这是正常的 - Google 头像需要时间加载
2. 会自动降级显示用户名首字母
3. 如果一直显示坏图，检查网络连接

---

### 问题 3: `/my-cards` 页面 404
**症状**: 访问 `/my-cards` 显示 "This page could not be found"

**解决方案**:
1. ✅ 已修复 - 页面已创建
2. 刷新页面即可访问
3. 确保已登录状态

---

### 问题 4: `goal_cards` 表无数据
**症状**: Supabase 中 `goal_cards` 表为空

**原因**:
- 同步功能刚开发完，还没有测试数据
- 需要按上述步骤创建本地卡片并登录触发同步

**解决方案**:
1. 按照测试步骤执行一次完整流程
2. 登录后会自动同步
3. 检查 Supabase 是否有新数据

---

## ✅ 成功标志

同步功能正常工作的标志:
- ✅ 创建本地卡片成功
- ✅ Console 显示同步日志
- ✅ `/my-cards` 页面显示卡片
- ✅ Supabase 表有数据
- ✅ LocalStorage 已清空

---

## 🚀 下一步

测试通过后:
1. 测试重复同步（登出再登入）
2. 测试空卡片（登录前不创建卡片）
3. 继续开发 Phase 2 Day 8-10 剩余功能

---

## 📝 测试记录

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 创建本地卡片 | ⏳ | |
| 登录触发同步 | ⏳ | |
| `/my-cards` 显示 | ⏳ | |
| Supabase 有数据 | ⏳ | |
| 本地数据清理 | ⏳ | |

---

## 💡 提示

1. **首次测试**: 建议使用无痕模式，避免缓存干扰
2. **Console 很重要**: 所有同步日志都在 Console 中
3. **刷新页面**: 如果页面显示异常，先尝试刷新
4. **清理数据**: 测试前可以清空 Supabase 表数据重新测试

