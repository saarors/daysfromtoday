# Google Analytics 4 集成说明

## 📊 配置信息

**GA4 Measurement ID：** `G-9D2SZK734G`  
**配置日期：** 2025-10-06  
**集成位置：** `app/[locale]/layout.tsx`

---

## ✅ 已完成的配置

### 1. 环境变量设置

**Vercel Dashboard：**
```
Name: NEXT_PUBLIC_GA_ID
Value: G-9D2SZK734G
Environments: Production + Preview + Development
```

**本地开发：**
```bash
# .env.local
NEXT_PUBLIC_GA_ID=G-9D2SZK734G
```

---

### 2. 代码集成

**位置：** `app/[locale]/layout.tsx`

Google Analytics 脚本已集成在全局 layout 中，自动在所有页面加载。

**功能：**
- ✅ 自动页面浏览跟踪
- ✅ 用户会话跟踪
- ✅ 页面路径跟踪
- ✅ 异步加载（不影响性能）

---

## 🔍 验证方法

### 1. 实时报告验证

1. 访问 Google Analytics：https://analytics.google.com/
2. 选择属性：DaysFromToday
3. 点击左侧 **报告** → **实时**
4. 访问网站：https://www.daysfromtoday.ai
5. 在实时报告中应该能看到您的访问

---

### 2. 浏览器验证

**Chrome DevTools 方法：**

1. 访问：https://www.daysfromtoday.ai/en
2. 打开 DevTools (F12)
3. 切换到 **Network** 标签
4. 刷新页面
5. 搜索：`gtag` 或 `google-analytics`
6. 应该看到请求：
   ```
   gtag/js?id=G-9D2SZK734G
   collect?v=2&...
   ```

**Console 验证：**

在浏览器 Console 中输入：
```javascript
// 检查 GA 是否加载
console.log(typeof gtag);  // 应该输出 "function"
console.log(window.dataLayer);  // 应该看到数据数组
```

---

### 3. 通过 GA Debugger 验证

**安装扩展：**
- Chrome: [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)

**使用方法：**
1. 安装扩展
2. 点击扩展图标启用
3. 访问网站
4. 打开 Console，查看 GA 调试信息

---

## 📈 可跟踪的指标

### 自动跟踪（无需额外配置）

- ✅ **页面浏览量** (Page Views)
- ✅ **用户数** (Users)
- ✅ **会话数** (Sessions)
- ✅ **平均会话时长** (Avg. Session Duration)
- ✅ **跳出率** (Bounce Rate)
- ✅ **页面路径** (Page Path)
- ✅ **流量来源** (Traffic Source)
- ✅ **设备类型** (Device Category)
- ✅ **地理位置** (Location)

---

## 🎯 推荐的自定义事件（未来）

### 日期计算事件
```javascript
gtag('event', 'calculate_date', {
  'days': 7,
  'locale': 'en',
  'result_date': '2025-10-13'
});
```

### 下载日历事件
```javascript
gtag('event', 'download_calendar', {
  'days': 7,
  'locale': 'en',
  'method': 'ics'
});
```

### 语言切换事件
```javascript
gtag('event', 'language_switch', {
  'from_language': 'en',
  'to_language': 'zh'
});
```

---

## 📊 关键报告位置

### 1. 实时报告
**路径：** 报告 → 实时 → 概览

**用途：** 查看当前在线用户数和活动

---

### 2. 流量获取
**路径：** 报告 → 生命周期 → 流量获取

**用途：** 了解用户来源（搜索、直接、社交媒体等）

---

### 3. 互动度
**路径：** 报告 → 生命周期 → 互动度 → 页面和屏幕

**用途：** 查看最受欢迎的页面

---

### 4. 受众特征
**路径：** 报告 → 用户 → 用户属性 → 概览

**用途：** 了解用户地理位置、语言、设备

---

## 🔧 故障排查

### 问题 1：实时报告没有数据

**可能原因：**
1. 环境变量未正确设置
2. 部署未完成
3. 浏览器启用了广告拦截

**解决方法：**
1. 检查 Vercel 环境变量
2. 等待部署完成（2-3 分钟）
3. 关闭广告拦截扩展
4. 使用无痕模式测试

---

### 问题 2：Network 中看不到 GA 请求

**可能原因：**
1. GA 脚本未加载
2. 环境变量拼写错误

**解决方法：**
1. 查看页面源代码，搜索 `gtag`
2. 确认 Measurement ID 正确
3. 检查 Console 是否有错误

---

### 问题 3：数据延迟

**正常现象：**
- 实时报告：几乎即时（5-10 秒延迟）
- 标准报告：24-48 小时延迟

---

## 📝 注意事项

### 隐私和合规

1. **Cookie 同意：** 
   - 当前实现：直接加载 GA（适用于大多数地区）
   - 欧盟/英国/瑞士：需要添加 Cookie 同意横幅
   - 推荐工具：Google Consent Mode v2

2. **数据保留：**
   - 默认：14 个月
   - 可在 GA 设置中调整

3. **IP 匿名化：**
   - GA4 默认启用

---

## 🎉 集成完成标志

当您看到以下情况，说明集成成功：

- ✅ Vercel 部署完成
- ✅ 访问网站后，实时报告显示活跃用户
- ✅ Network 标签中看到 GA 请求
- ✅ Console 中无 GA 相关错误

---

## 📚 相关资源

- [GA4 官方文档](https://support.google.com/analytics/answer/9304153)
- [Next.js Analytics 指南](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [GA4 事件参考](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters)

---

**配置完成时间：** 2025-10-06  
**下次检查：** 2025-11-06（30 天后验证数据收集情况）

