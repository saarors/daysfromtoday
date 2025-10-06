# Google Search Console 提交指南

## 📋 提交前检查清单

### ✅ 必须完成的准备工作

- [x] 域名已配置并指向 Vercel
- [x] 网站已成功部署到生产环境
- [x] Sitemap 已生成并可访问
- [x] Robots.txt 已配置
- [x] 所有页面的 metadata 已优化
- [x] Canonical URLs 使用绝对路径
- [x] Hreflang 标签已配置
- [ ] Vercel 环境变量已设置（见下文）

---

## 🔧 Step 1: 在 Vercel 设置环境变量

### 1.1 登录 Vercel Dashboard
访问：https://vercel.com/dashboard

### 1.2 进入项目设置
1. 选择 `daysfromtoday` 项目
2. 点击 **Settings** 标签
3. 点击左侧 **Environment Variables**

### 1.3 添加环境变量
添加以下变量（适用于所有环境）：

```
Variable Name: NEXT_PUBLIC_SITE_URL
Value: https://daysfromtoday.ai
Environments: ✅ Production ✅ Preview ✅ Development
```

### 1.4 重新部署
1. 回到 **Deployments** 标签
2. 点击最新部署右侧的 `...` 菜单
3. 选择 **Redeploy**
4. 确保选中 **Use existing Build Cache**
5. 点击 **Redeploy** 按钮

---

## 🔍 Step 2: 验证网站准备情况

### 2.1 检查 Sitemap
访问以下 URL，确保返回正确的 XML：
- https://daysfromtoday.ai/sitemap.xml

**预期结果：**
- 状态码：200
- 格式：XML
- 包含所有语言版本的 URL
- 包含首页、FAQ 和日期计算页面

### 2.2 检查 Robots.txt
访问：https://daysfromtoday.ai/robots.txt

**预期内容：**
```
User-agent: *
Allow: /

Sitemap: https://daysfromtoday.ai/sitemap.xml
```

### 2.3 检查关键页面
确保以下页面可访问且 SEO 元数据正确：
- https://daysfromtoday.ai/en
- https://daysfromtoday.ai/zh
- https://daysfromtoday.ai/en/faq
- https://daysfromtoday.ai/en/days/7

**检查项：**
- [ ] 页面正常加载
- [ ] Title 标签正确
- [ ] Meta Description 存在
- [ ] Canonical URL 使用绝对路径
- [ ] Open Graph 标签完整
- [ ] Twitter Card 标签存在

---

## 🚀 Step 3: 提交到 Google Search Console

### 3.1 创建 Search Console 账号
1. 访问：https://search.google.com/search-console
2. 使用 Google 账号登录
3. 点击 **添加资源**

### 3.2 选择资源类型
**推荐：网域资源**
- 选择 **网域**
- 输入：`daysfromtoday.ai`
- 点击 **继续**

**或选择：网址前缀**
- 选择 **网址前缀**
- 输入：`https://daysfromtoday.ai`
- 点击 **继续**

### 3.3 验证所有权

#### 方法 A：DNS 验证（推荐，适用于网域资源）

1. Google 会提供一个 TXT 记录
2. 登录您的域名注册商（如 Cloudflare、GoDaddy 等）
3. 添加 TXT 记录：
   ```
   类型：TXT
   名称：@ 或根域名
   值：[Google 提供的验证码]
   ```
4. 等待 DNS 传播（通常 5-30 分钟）
5. 回到 Search Console，点击 **验证**

#### 方法 B：HTML 标签验证（适用于网址前缀）

1. Google 会提供一个 HTML meta 标签
2. 在 Vercel 添加环境变量：
   ```
   NEXT_PUBLIC_GSC_VERIFICATION=your-verification-code
   ```
3. 更新 `app/[locale]/layout.tsx`，在 `<head>` 中添加：
   ```tsx
   {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
     <meta 
       name="google-site-verification" 
       content={process.env.NEXT_PUBLIC_GSC_VERIFICATION} 
     />
   )}
   ```
4. 重新部署
5. 回到 Search Console，点击 **验证**

#### 方法 C：HTML 文件验证

1. Google 会提供一个 HTML 文件
2. 下载该文件
3. 将文件放到 `public/` 目录
4. 推送到 GitHub，等待 Vercel 自动部署
5. 访问 `https://daysfromtoday.ai/[文件名].html` 确认可访问
6. 回到 Search Console，点击 **验证**

### 3.4 提交 Sitemap

验证成功后：
1. 在左侧菜单选择 **Sitemap**
2. 点击 **添加新的站点地图**
3. 输入：`sitemap.xml`
4. 点击 **提交**

**预期结果：**
- 状态：成功
- 已发现的网址数：46+（2 个首页 + 2 个 FAQ + 42 个日期页面）

---

## 🔄 Step 4: 提交第二个域名（可选）

如果您也想提交 `14daysfromtoday.com`：

### 选项 A：作为独立资源
重复 Step 3 的所有步骤，但使用 `14daysfromtoday.com`

### 选项 B：301 重定向到主域名
1. 在 Vercel 中配置 301 重定向
2. 在 `vercel.json` 中添加：
   ```json
   {
     "redirects": [
       {
         "source": "/:path*",
         "destination": "https://daysfromtoday.ai/:path*",
         "permanent": true,
         "statusCode": 301
       }
     ]
   }
   ```
3. 这样所有流量都会重定向到主域名

---

## 📊 Step 5: 监控和优化

### 5.1 等待索引
- Google 通常需要 1-7 天开始索引
- 索引速度取决于网站权重和更新频率

### 5.2 检查索引状态
1. 在 Search Console 左侧选择 **概览**
2. 查看 **覆盖范围** 报告
3. 确认 **有效** 页面数量增加

### 5.3 提交单个 URL（可选）
对于重要页面，可以手动请求索引：
1. 在顶部搜索框输入完整 URL
2. 点击 **请求编入索引**
3. 等待处理

### 5.4 修复问题
定期检查以下报告：
- **覆盖范围**：查找索引错误
- **移动设备易用性**：确保移动端友好
- **核心网页指标**：优化性能
- **安全问题**：确保无安全漏洞

---

## 🎯 预期时间线

| 时间点 | 预期结果 |
|--------|----------|
| 提交后 1 小时 | Sitemap 状态显示为"待处理" |
| 1-3 天 | Google 开始爬取网站 |
| 3-7 天 | 部分页面开始出现在索引中 |
| 1-2 周 | 大部分页面被索引 |
| 2-4 周 | 开始在搜索结果中显示 |
| 1-3 个月 | 搜索排名稳定并提升 |

---

## ✅ 成功标准

### 短期目标（1-2周）
- [ ] 所有页面（46+）被 Google 索引
- [ ] 无覆盖范围错误
- [ ] 移动设备易用性 100% 通过
- [ ] 核心网页指标为"良好"

### 中期目标（1-3个月）
- [ ] 品牌词搜索排名第一（"daysfromtoday"）
- [ ] 长尾关键词开始有排名
- [ ] 自然流量开始增长
- [ ] 点击率（CTR）> 2%

### 长期目标（3-6个月）
- [ ] 核心关键词进入前 10 名
- [ ] 月自然流量 > 1000
- [ ] 域名权重（DA）> 20
- [ ] 反向链接数量增长

---

## 🔧 常见问题

### Q: Sitemap 提交后显示"无法获取"？
**A:** 检查以下项：
1. URL 是否正确（应为 `https://daysfromtoday.ai/sitemap.xml`）
2. 网站是否可访问
3. Robots.txt 是否阻止了 Google 爬虫
4. Vercel 环境变量是否已设置

### Q: 页面被索引，但搜索不到？
**A:** 正常现象，索引和排名是两个阶段：
1. 先被索引（收录）
2. 后参与排名（可能需要 2-4 周）

### Q: 如何加快索引速度？
**A:** 
1. 提交高质量的反向链接
2. 在社交媒体分享链接
3. 更新内容并重新提交 Sitemap
4. 提高网站更新频率

### Q: 两个域名应该怎么处理？
**A:** 推荐方案：
1. 选择 `daysfromtoday.ai` 作为主域名
2. 将 `14daysfromtoday.com` 301 重定向到主域名
3. 只向 Google Search Console 提交主域名
4. 这样可以集中域名权重

---

## 📞 获取帮助

如果遇到问题：
1. 查看 Google Search Console 帮助中心
2. 访问 Google Search Central 社区
3. 查看 Next.js SEO 最佳实践文档

---

## 📝 备注

- 本指南基于 2025 年 Google Search Console 最新版本
- 定期检查 Google 的更新和最佳实践
- SEO 是持续优化的过程，需要耐心和坚持

**最后更新：2025-10-06**

