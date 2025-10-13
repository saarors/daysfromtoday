# Contentlayer 支持的组件和格式

**版本**: v1.0  
**创建时间**: 2025年10月13日  
**适用范围**: DaysFromToday 项目  

## 🎯 概述

本文档详细说明当前Contentlayer配置支持的所有Markdown/MDX组件和格式，以及表格处理问题的解决方案。

## 📋 当前支持的组件

### ✅ **完全支持的组件**

#### **1. 基础Markdown组件**
- **标题**: `# H1`, `## H2`, `### H3`, `#### H4`, `##### H5`, `###### H6`
- **段落**: 普通文本段落
- **换行**: 双空格 + 回车 或 双回车
- **强调**: `**粗体**`, `*斜体*`, `~~删除线~~`
- **代码**: `` `行内代码` ``, ````代码块````
- **引用**: `> 引用内容`
- **列表**: 
  - 无序列表: `- 项目`, `* 项目`, `+ 项目`
  - 有序列表: `1. 项目`, `2. 项目`
- **链接**: `[文本](URL)`, `[文本](URL "标题")`
- **图片**: `![alt文本](图片URL)`, `![alt文本](图片URL "标题")`

#### **2. GitHub Flavored Markdown (GFM)**
- **任务列表**: `- [ ] 未完成`, `- [x] 已完成`
- **删除线**: `~~删除的文本~~`
- **自动链接**: `https://example.com`
- **表格**: `| 列1 | 列2 | 列3 |` (⚠️ 有解析问题)
- **围栏代码块**: ```语言名称

#### **3. 代码高亮**
- **语法高亮**: 支持所有主流编程语言
- **代码块标题**: 通过 `rehype-code-titles` 支持
- **行号**: 通过 `rehype-prism-plus` 支持

#### **4. 标题增强**
- **自动ID**: 通过 `rehype-slug` 为标题添加ID
- **自动链接**: 通过 `rehype-autolink-headings` 为标题添加链接

#### **5. MDX组件**
- **React组件**: 可以在Markdown中使用React组件
- **JSX语法**: 支持JSX表达式
- **导入**: 可以导入和使用自定义组件

### ⚠️ **部分支持的组件**

#### **1. 表格 (Tables)**
- **状态**: 部分支持，存在解析问题
- **问题**: `TypeError: Cannot set properties of undefined (setting 'inTable')`
- **原因**: `mdast-util-gfm-table` 插件与Contentlayer的兼容性问题
- **解决方案**: 
  - 使用列表格式替代表格
  - 或者使用HTML表格
  - 或者使用自定义React组件

#### **2. 脚注 (Footnotes)**
- **状态**: 理论上支持，但可能不稳定
- **语法**: `[^1]` 和 `[^1]: 脚注内容`

### ❌ **不支持的组件**

#### **1. 数学公式**
- **LaTeX**: 不支持 `$公式$` 或 `$$公式$$`
- **MathJax**: 需要额外配置
- **KaTeX**: 需要额外配置

#### **2. 图表**
- **Mermaid**: 不支持 ````mermaid` 代码块
- **PlantUML**: 不支持
- **其他图表**: 需要自定义组件

#### **3. 高级表格功能**
- **表格对齐**: 不支持 `:---:`, `:---`, `---:`
- **表格合并**: 不支持跨行跨列
- **表格样式**: 不支持自定义样式

## 🔧 当前配置分析

### **Contentlayer配置**
```typescript
// contentlayer.config.ts
export default makeSource({
  contentDirPath: 'obsidian/content',
  documentTypes: [Blog],
  mdx: {
    remarkPlugins: [
      remarkGfm, // GitHub Flavored Markdown
    ],
    rehypePlugins: [
      rehypeSlug, // 为标题添加 ID
      rehypeAutolinkHeadings, // 为标题添加链接
      rehypeCodeTitles, // 代码块标题
      rehypePrism, // 语法高亮
    ],
  },
})
```

### **依赖包分析**
```json
{
  "remark-gfm": "^4.0.1",           // GitHub Flavored Markdown
  "rehype-slug": "^6.0.0",          // 标题ID生成
  "rehype-autolink-headings": "^7.1.0", // 标题链接
  "rehype-code-titles": "^1.2.0",   // 代码块标题
  "rehype-prism-plus": "^2.0.1",    // 语法高亮
  "rehype-highlight": "^7.0.2"      // 备用高亮
}
```

## 🚨 表格问题详解

### **问题描述**
```
TypeError: Cannot set properties of undefined (setting 'inTable')
at Object.enterTable (mdast-util-gfm-table/lib/index.js:78:21)
```

### **根本原因**
1. **版本兼容性**: `remark-gfm` 与 `mdast-util-gfm-table` 版本不匹配
2. **解析器冲突**: Contentlayer的MDX解析器与表格解析器冲突
3. **AST处理**: 表格AST节点处理时出现undefined错误

### **解决方案**

#### **方案1: 使用列表格式 (推荐)**
```markdown
**自动化评分（0-10）：**
- 第7天: 3.1
- 第14天: 5.6
- 第21天: **7.8**
- 第66天: 9.5

**情绪疲劳度（0-10）：**
- 第7天: 8.9
- 第14天: 6.1
- 第21天: **3.4**
- 第66天: 1.2
```

#### **方案2: 使用HTML表格**
```html
<table>
  <thead>
    <tr>
      <th>阶段</th>
      <th>评分</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>第7天</td>
      <td>3.1</td>
    </tr>
  </tbody>
</table>
```

#### **方案3: 使用React组件**
```jsx
import { Table } from '@/components/Table'

<Table
  data={[
    { stage: '第7天', score: '3.1' },
    { stage: '第14天', score: '5.6' }
  ]}
/>
```

## 📊 支持组件总结

| 组件类型 | 支持状态 | 备注 |
|---------|---------|------|
| 基础Markdown | ✅ 完全支持 | 所有标准语法 |
| GFM扩展 | ✅ 完全支持 | 除表格外 |
| 代码高亮 | ✅ 完全支持 | 多语言支持 |
| 标题增强 | ✅ 完全支持 | 自动ID和链接 |
| 表格 | ⚠️ 部分支持 | 存在解析问题 |
| 脚注 | ⚠️ 部分支持 | 可能不稳定 |
| 数学公式 | ❌ 不支持 | 需要额外配置 |
| 图表 | ❌ 不支持 | 需要自定义组件 |

## 🚀 优化建议

### **短期优化**
1. **表格处理**: 统一使用列表格式替代表格
2. **代码质量**: 确保所有Markdown文件符合标准
3. **组件测试**: 验证所有支持组件的稳定性

### **中期优化**
1. **表格支持**: 考虑升级或替换表格解析器
2. **数学公式**: 添加KaTeX或MathJax支持
3. **图表支持**: 集成Mermaid或其他图表库

### **长期优化**
1. **自定义组件**: 开发项目特定的MDX组件
2. **性能优化**: 优化大型文档的解析性能
3. **扩展性**: 支持更多第三方插件

## 🔍 故障排除

### **常见问题**
1. **表格解析错误**: 使用列表格式替代
2. **代码高亮不工作**: 检查语言名称是否正确
3. **链接不生效**: 检查URL格式和路径
4. **图片不显示**: 检查图片路径和权限

### **调试方法**
1. **检查Contentlayer日志**: 查看解析错误信息
2. **验证Markdown语法**: 使用在线工具验证
3. **测试组件**: 在简单文档中测试组件
4. **版本兼容性**: 检查插件版本兼容性

---

**维护者**: AI Assistant  
**最后更新**: 2025年10月13日  
**下次审查**: 2025年11月13日
