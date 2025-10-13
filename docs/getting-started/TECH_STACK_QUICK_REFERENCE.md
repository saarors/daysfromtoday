# 🚀 DaysFromToday 技术栈快速参考

## 📋 核心栈概览

| 分类 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **框架** | Next.js | 15.5.4 | React 全栈框架 |
| **语言** | TypeScript | 5.x | 类型安全开发 |
| **样式** | Tailwind CSS | 4.x | 原子化 CSS |
| **国际化** | next-intl | 3.x | 多语言支持 |
| **日期** | date-fns | 3.x | 日期计算库 |
| **部署** | Vercel | Edge | 全球部署平台 |
| **监控** | GA4 | 最新 | 用户行为分析 |

---

## 🛠️ 开发环境设置

### **系统要求**
```bash
Node.js >= 18.x
npm >= 9.x
Git >= 2.x
```

### **快速启动**
```bash
# 克隆项目
git clone <repository-url>
cd daysfromtoday

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 部署到 Vercel
vercel --prod
```

---

## 📦 关键依赖

### **核心框架**
```json
{
  "next": "15.5.4",
  "react": "^18.0.0",
  "typescript": "^5.0.0"
}
```

### **样式系统**
```json
{
  "tailwindcss": "^4.0.0",
  "@tailwindcss/typography": "^0.5.0"
}
```

### **功能库**
```json
{
  "next-intl": "^3.0.0",
  "date-fns": "^3.0.0",
  "date-fns-tz": "^2.0.0",
  "@next/third-parties": "^0.0.0"
}
```

---

## 🎨 设计系统

### **颜色系统**
```css
/* 主色调 */
--color-primary: #0069FF;
--color-gradient-start: #D946EF;
--color-gradient-mid: #8B5CF6;
--color-gradient-end: #0069FF;
```

### **组件模式**
- **玻璃拟态**: `.card-glass`
- **渐变文字**: `.text-gradient-calendly`
- **按钮样式**: `.btn-primary`, `.btn-secondary`
- **装饰元素**: `.decoration-blob`

---

## 🌐 部署配置

### **Vercel 环境变量**
```bash
NEXT_PUBLIC_SITE_URL=https://www.daysfromtoday.ai
NEXT_PUBLIC_GA_ID=[GA_ID]
```

### **域名配置**
- **主域名**: daysfromtoday.ai
- **备用域名**: 14daysfromtoday.com
- **DNS**: Cloudflare (灰云模式)

---

## 📊 性能指标

### **Core Web Vitals 目标**
- **LCP**: < 2.5s
- **INP**: < 200ms  
- **CLS**: < 0.1

### **实际表现**
- **页面加载**: ~180ms
- **首字节时间**: ~173ms
- **DNS 解析**: ~3ms

---

## 🔍 SEO 配置

### **元数据模板**
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: "页面标题",
    description: "页面描述",
    alternates: {
      canonical: "https://www.daysfromtoday.ai/zh",
      languages: {
        'en': 'https://www.daysfromtoday.ai/en',
        'zh': 'https://www.daysfromtoday.ai/zh'
      }
    }
  };
}
```

### **结构化数据**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DaysFromToday",
  "url": "https://www.daysfromtoday.ai"
}
```

---

## 🚀 最佳实践

### **组件设计**
- **Server Components**: 默认使用
- **Client Components**: 仅在需要交互时使用
- **类型安全**: 完整的 TypeScript 类型定义

### **性能优化**
- **代码分割**: 路由级自动分割
- **图片优化**: next/image 组件
- **字体优化**: next/font 自动优化

### **SEO 优化**
- **语义化 HTML**: 正确的标签结构
- **可访问性**: ARIA 标签支持
- **移动优先**: 响应式设计

---

## 📚 学习路径

### **新手入门**
1. **Next.js 基础**: App Router, Server Components
2. **TypeScript**: 类型定义, 接口设计
3. **Tailwind CSS**: 原子化 CSS, 响应式设计
4. **国际化**: next-intl 多语言实现

### **进阶学习**
1. **性能优化**: Core Web Vitals, 代码分割
2. **SEO 优化**: 元数据, 结构化数据
3. **部署运维**: Vercel, 监控分析
4. **设计系统**: 组件库, 设计规范

---

## 🔧 常用命令

### **开发命令**
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run type-check   # 类型检查
```

### **部署命令**
```bash
vercel               # 部署到预览环境
vercel --prod       # 部署到生产环境
vercel logs          # 查看部署日志
```

### **Git 命令**
```bash
git add -A
git commit -m "feat: 新功能描述"
git push origin main
```

---

## 🎯 项目特色

### **技术亮点**
- ✅ **现代化技术栈**: Next.js 15 + TypeScript
- ✅ **性能优化**: Edge Runtime + 全球 CDN
- ✅ **SEO 友好**: 完整的元数据和结构化数据
- ✅ **多语言支持**: 中英文完整支持
- ✅ **设计系统**: Calendly 风格现代化设计

### **业务价值**
- 🚀 **快速加载**: 180ms 页面加载时间
- 🔍 **SEO 优化**: 95% SEO 评分
- 📱 **移动友好**: 完全响应式设计
- 🌍 **国际化**: 多语言用户支持

---

**📝 快速参考**: 此文档提供项目技术栈的快速概览  
**🔄 更新频率**: 随项目发展持续更新  
**📖 详细文档**: 参考 `TECH_STACK.md` 获取完整信息  

---

*此快速参考适用于项目维护、新人入门和类似项目开发。*
