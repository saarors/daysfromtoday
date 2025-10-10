# Obsidian 编辑工作流完整指南

> 版本: v2.0  
> 更新: 2025-10-10  
> 作者: Leon  
> 目标: 建立完整的 Obsidian 编辑工作流，从创作到发布全自动化

---

## 一、工作流概览

### 1.1 完整流程图

```
┌─────────────────────────────────────────────────────────────┐
│  1. 创建内容                                                  │
│     - 使用 Obsidian 打开 Vault                               │
│     - 选择内容模板（5种）                                      │
│     - 自动填充 Frontmatter                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  2. 编辑内容                                                  │
│     - Markdown + MDX 语法                                    │
│     - 实时预览                                                │
│     - 使用 MDX 组件（17+）                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  3. 添加富媒体                                                │
│     - 拖拽图片 → 自动上传到 R2                               │
│     - 插入视频链接                                            │
│     - 嵌入功能组件                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  4. SEO 优化                                                  │
│     - 完善 Frontmatter（关键词、描述）                        │
│     - 检查标题层级                                            │
│     - 添加相关内容链接                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  5. 双语翻译（可选）                                          │
│     - 复制到对应语言目录                                      │
│     - 翻译内容                                                │
│     - 保持 slug 和结构一致                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  6. 本地预览                                                  │
│     - Obsidian 实时预览                                       │
│     - 或 npm run dev 查看实际效果                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  7. Git 同步                                                  │
│     - Obsidian Git 自动 commit                               │
│     - 自动 push 到远程                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  8. 自动部署                                                  │
│     - Vercel 自动检测到新提交                                │
│     - 自动构建和部署                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  9. 验证上线                                                  │
│     - 访问网站查看效果                                        │
│     - 检查 SEO 元数据                                         │
│     - GSC 提交新 URL                                          │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 时间估算

| 步骤 | 预计时间 | 说明 |
|------|---------|------|
| 1. 创建内容 | 2 分钟 | 选择模板，自动填充 |
| 2-3. 编辑+富媒体 | 30-120 分钟 | 取决于内容长度 |
| 4. SEO 优化 | 5-10 分钟 | Frontmatter + 关键词 |
| 5. 双语翻译 | 20-60 分钟 | 如需双语 |
| 6. 本地预览 | 5 分钟 | 快速检查 |
| 7-8. Git+部署 | 自动 | 无需人工介入 |
| 9. 验证上线 | 5 分钟 | 最终检查 |

**总计**: 单语版本约 45-150 分钟，双语版本约 65-210 分钟

---

## 二、Obsidian 环境配置

### 2.1 安装 Obsidian

1. **下载安装**:
   - 访问 https://obsidian.md/
   - 下载 macOS / Windows / Linux 版本
   - 安装并启动

2. **创建 Vault**:
   - 选择 "Open folder as vault"
   - 选择项目的 `content/` 目录
   - 路径: `/Users/leonmini/quantum-era/daysfromtoday/content`

### 2.2 必装插件列表

#### 插件 1: Templater（自动模板）

**用途**: 自动生成 Frontmatter 模板，加快创作速度

**安装步骤**:
1. Settings → Community plugins → Browse
2. 搜索 "Templater"
3. Install → Enable

**配置**:
```yaml
Settings → Templater:
  - Template folder location: .obsidian/templates
  - Trigger Templater on new file creation: ✓
  - Enable folder templates: ✓
```

**Folder Templates 配置**:
```
philosophy/zh/ → philosophy-template.md
philosophy/en/ → philosophy-template.md
tools/zh/ → tools-template.md
tools/en/ → tools-template.md
stories/zh/ → stories-template.md
stories/en/ → stories-template.md
guides/zh/ → guides-template.md
guides/en/ → guides-template.md
updates/zh/ → updates-template.md
updates/en/ → updates-template.md
```

#### 插件 2: Local Images Plus（图片自动上传）

**用途**: 拖拽图片时自动上传到 R2，返回 CDN URL

**安装步骤**:
1. Settings → Community plugins → Browse
2. 搜索 "Local Images Plus"
3. Install → Enable

**配置**:
```yaml
Settings → Local Images Plus:
  - Upload script: /Users/leonmini/quantum-era/daysfromtoday/scripts/obsidian-upload-image.ts
  - Script arguments: --path={{filepath}} --vault={{vaultpath}}
  - URL pattern: {{output}}
```

**测试**:
- 拖拽一张图片到编辑器
- 应自动上传并插入 CDN URL

#### 插件 3: Obsidian Git（自动同步）

**用途**: 自动 commit 和 push 到远程仓库

**安装步骤**:
1. Settings → Community plugins → Browse
2. 搜索 "Obsidian Git"
3. Install → Enable

**配置**:
```yaml
Settings → Obsidian Git:
  - Vault backup interval (minutes): 10
  - Auto pull interval (minutes): 5
  - Commit message: "docs: {{date}} auto backup"
  - Auto push: ✓
  - Pull updates on startup: ✓
  - Disable push on mobile: ✓
```

#### 插件 4: Linter（格式化）

**用途**: 自动格式化 Markdown，确保一致性

**安装步骤**:
1. Settings → Community plugins → Browse
2. 搜索 "Linter"
3. Install → Enable

**配置**:
```yaml
Settings → Linter:
  - Lint on save: ✓
  - Display message on lint: ✗
  
  规则:
  - Heading blank lines: ✓
  - Paragraph blank lines: ✓
  - Trailing spaces: ✓ (remove)
  - Empty line around blockquotes: ✓
  - Compact YAML: ✓
```

#### 插件 5: Dataview（可选，内容关联）

**用途**: 查询和关联内容

**安装步骤**:
1. Settings → Community plugins → Browse
2. 搜索 "Dataview"
3. Install → Enable

**用例**:
```dataview
// 查询所有 Philosophy 内容
LIST
FROM "philosophy"
WHERE published = true
SORT date DESC
```

---

## 三、内容模板库

### 3.1 模板目录结构

```
.obsidian/templates/
├── philosophy-template.md      # 时间哲学模板
├── tools-template.md           # 实用工具模板
├── stories-template.md         # 故事模板
├── guides-template.md          # 教程指南模板
└── updates-template.md         # 新闻更新模板
```

### 3.2 Philosophy 模板

**文件**: `.obsidian/templates/philosophy-template.md`

```mdx
---
title: "<% tp.file.title %>"
description: ""
date: "<% tp.date.now('YYYY-MM-DD') %>"
lastModified: "<% tp.date.now('YYYY-MM-DD') %>"
author: "Leon"
published: false

# 分类
category: "time-value"  # time-value | growth | mindset | psychology
level: "beginner"  # beginner | intermediate | advanced

# SEO
topics: []
keywords: []
ogImage: ""
readingTime: 0
---

# <% tp.file.title %>

<TableOfContents />

## 引言

<!-- 写一段引人入胜的开头，提出问题或观点 -->

## 核心观点

### 观点一

<!-- 详细阐述第一个核心观点 -->

<BlogImage 
  src="" 
  alt="" 
  caption=""
/>

### 观点二

<!-- 详细阐述第二个核心观点 -->

### 观点三

<!-- 详细阐述第三个核心观点 -->

## 实践建议

<!-- 给出可操作的建议 -->

<Callout type="info">
💡 小提示：在这里写一些关键提示
</Callout>

## 深度思考

<!-- 更深层次的思考和讨论 -->

## 总结

<!-- 总结全文，呼应开头 -->

---

## 相关阅读

<RelatedContent topics={[""]} limit={3} />
```

### 3.3 Tools 模板

**文件**: `.obsidian/templates/tools-template.md`

```mdx
---
title: "<% tp.file.title %>"
description: ""
date: "<% tp.date.now('YYYY-MM-DD') %>"
lastModified: "<% tp.date.now('YYYY-MM-DD') %>"
author: "Leon"
published: false

# 分类
category: "date-calculation"  # date-calculation | timezone | holidays | planning

# 功能植入
embeds:
  - type: "calculator"
    id: "business-days-calc"

# SEO
topics: []
keywords: []
ogImage: ""
readingTime: 0
---

# <% tp.file.title %>

<TableOfContents />

## 问题场景

<!-- 描述用户遇到的具体问题 -->

## 快速解决方案

<!-- 直接给出解决方案，满足快速查阅需求 -->

<EmbedCalculator 
  type="business-days"
  defaultDays={30}
  title="试试计算工作日"
  description="输入天数，自动排除周末和节假日"
/>

## 详细说明

### 什么是工作日？

<!-- 基础概念解释 -->

### 如何计算？

<!-- 详细计算方法 -->

<StepGuide>
  <Step number={1} title="第一步">
    详细说明第一步
  </Step>
  <Step number={2} title="第二步">
    详细说明第二步
  </Step>
  <Step number={3} title="第三步">
    详细说明第三步
  </Step>
</StepGuide>

## 实际案例

<!-- 给出2-3个实际案例 -->

### 案例 1: 项目deadline计算

<!-- 具体案例 -->

### 案例 2: 假期规划

<!-- 具体案例 -->

## 常见问题

<Accordion title="Q1: 节假日怎么算？">
  A: 详细回答...
</Accordion>

<Accordion title="Q2: 周末是否包含？">
  A: 详细回答...
</Accordion>

## 相关工具

<FeatureCard 
  icon="calendar"
  title="添加纪念日"
  description="永远不会忘记重要的日子"
  link="/anniversaries"
  cta="立即使用"
/>

---

## 相关阅读

<RelatedContent topics={[""]} limit={3} />
```

### 3.4 Stories 模板

**文件**: `.obsidian/templates/stories-template.md`

```mdx
---
title: "<% tp.file.title %>"
description: ""
date: "<% tp.date.now('YYYY-MM-DD') %>"
lastModified: "<% tp.date.now('YYYY-MM-DD') %>"
author: "Leon"
published: false

# 分类
category: "user-stories"  # user-stories | founder | community | journey
storyType: "user"  # user | founder | community

# SEO
topics: []
keywords: []
ogImage: ""
readingTime: 0
---

# <% tp.file.title %>

<HeroBanner 
  image="" 
  title="<% tp.file.title %>"
  subtitle=""
  overlay={true}
/>

<TableOfContents />

## 故事背景

<!-- 介绍人物和背景 -->

## 遇到的问题

<!-- 描述主人公遇到的挑战 -->

<ImageWithText 
  image="" 
  alt=""
  position="left"
>
  这里是文字内容...
</ImageWithText>

## 转折点

<!-- 故事的转折点 -->

## 解决过程

<!-- 详细描述如何解决问题 -->

<BlogImage 
  src="" 
  alt="" 
  caption=""
/>

## 结果和收获

<!-- 故事的结局和主人公的收获 -->

## 我的感想

<!-- 作者的感想和评论 -->

<Callout type="success">
✅ 关键启发：在这里写关键的启发和学习点
</Callout>

## 你也可以试试

<!-- 引导读者行动 -->

<EmbedCalculator 
  type="countdown"
  defaultDays={100}
  title="开始你的100天挑战"
/>

---

## 相关故事

<RelatedContent topics={[""]} limit={3} />
```

### 3.5 Guides 模板

**文件**: `.obsidian/templates/guides-template.md`

```mdx
---
title: "<% tp.file.title %>"
description: ""
date: "<% tp.date.now('YYYY-MM-DD') %>"
lastModified: "<% tp.date.now('YYYY-MM-DD') %>"
author: "Leon"
published: false

# 分类
category: "features"  # getting-started | features | best-practices | troubleshooting

# 功能植入
embeds:
  - type: "feature"
    id: "anniversary"

# 前置要求
prerequisites: []

# SEO
topics: []
keywords: []
ogImage: ""
readingTime: 0
---

# <% tp.file.title %>

<TableOfContents />

## 概述

<!-- 简要介绍这个教程的内容 -->

## 前置要求

<!-- 列出需要的前置知识或准备 -->

- 要求 1
- 要求 2
- 要求 3

## 第一步：xxx

<!-- 详细说明第一步 -->

<BlogImage 
  src="" 
  alt="" 
  caption="步骤1截图"
/>

<Callout type="info">
💡 小提示：在这里写关键提示
</Callout>

## 第二步：xxx

<!-- 详细说明第二步 -->

## 第三步：xxx

<!-- 详细说明第三步 -->

## 实践练习

<!-- 让用户实际操作 -->

<AddAnniversary 
  presetDate="2025-12-25"
  presetName="圣诞节"
  title="试试添加纪念日"
/>

## 高级技巧

<Accordion title="技巧1: xxx">
  详细说明...
</Accordion>

<Accordion title="技巧2: xxx">
  详细说明...
</Accordion>

## 常见问题

### Q1: xxx

A: ...

### Q2: xxx

A: ...

## 总结

<!-- 总结关键点 -->

---

## 相关教程

<RelatedContent topics={[""]} limit={3} />
```

### 3.6 Updates 模板

**文件**: `.obsidian/templates/updates-template.md`

```mdx
---
title: "<% tp.file.title %>"
description: ""
date: "<% tp.date.now('YYYY-MM-DD') %>"
lastModified: "<% tp.date.now('YYYY-MM-DD') %>"
author: "Leon"
published: false

# 分类
category: "releases"  # releases | roadmap | changelog | milestones

# 版本信息
version: "v2.0"
releaseDate: "<% tp.date.now('YYYY-MM-DD') %>"

# SEO
topics: []
keywords: []
ogImage: ""
readingTime: 0
---

# <% tp.file.title %>

<TableOfContents />

## 概述

<!-- 简要介绍本次更新 -->

## 新功能

### 功能 1: xxx

<!-- 详细说明新功能 -->

<BlogImage 
  src="" 
  alt="" 
  caption="功能截图"
/>

**主要特点**:
- 特点 1
- 特点 2
- 特点 3

### 功能 2: xxx

<!-- 详细说明新功能 -->

## 改进

- 改进 1
- 改进 2
- 改进 3

## 修复

- 修复 1
- 修复 2

## 如何使用

<!-- 链接到相关教程 -->

<FeatureCard 
  icon="book"
  title="查看完整教程"
  description="了解如何使用新功能"
  link="/guides/features/xxx"
  cta="查看教程"
/>

## 下一步计划

<!-- 预告下一个版本 -->

---

## 相关更新

<RelatedContent type="updates" limit={3} />
```

---

## 四、图片上传工作流

### 4.1 拖拽上传流程

```
1. 在 Obsidian 编辑器中拖拽图片
   ↓
2. Local Images Plus 插件拦截
   ↓
3. 调用 scripts/obsidian-upload-image.ts
   ↓
4. 脚本读取图片并优化
   - 智能压缩（如果 >3MB）
   - 智能裁剪（如果比例不符）
   - 生成 WebP + JPEG
   ↓
5. 上传到 Cloudflare R2
   ↓
6. 返回 CDN URL
   ↓
7. Obsidian 自动插入 Markdown 引用
   <BlogImage src="https://cdn.daysfromtoday.ai/..." alt="" />
```

### 4.2 手动上传（批量）

如果需要批量上传图片：

```bash
# 进入项目目录
cd /Users/leonmini/quantum-era/daysfromtoday

# 上传单张图片
node scripts/obsidian-upload-image.ts --path=./temp/image.jpg --vault=./content

# 批量上传（使用 find）
find ./temp -name "*.jpg" -exec node scripts/obsidian-upload-image.ts --path={} --vault=./content \;
```

### 4.3 图片命名规范

- **Hero 图**: `hero.jpg` 或 `{slug}-hero.jpg`
- **正文图**: `{description}.jpg` 或 `{number}.jpg`
- **截图**: `screenshot-{feature}.jpg`
- **图表**: `chart-{name}.jpg`

**示例**:
```
content/philosophy/zh/time-value/time-is-fair/
├── hero.jpg                     # 头图
├── thinking.jpg                 # 思考场景
├── clock.jpg                    # 时钟插图
└── chart-time-allocation.jpg    # 时间分配图表
```

---

## 五、MDX 组件使用

### 5.1 快速插入代码片段

**Obsidian 快捷键设置**:

1. Settings → Hotkeys
2. 搜索 "Insert template"
3. 设置快捷键（如 `Cmd+T`）

**代码片段库** (`.obsidian/snippets/mdx-components.md`):

````markdown
## Hero Banner
```mdx
<HeroBanner 
  image="" 
  title=""
  subtitle=""
/>
```

## Blog Image
```mdx
<BlogImage 
  src="" 
  alt="" 
  caption=""
/>
```

## Image With Text
```mdx
<ImageWithText 
  image="" 
  alt=""
  position="left"
>
  文字内容...
</ImageWithText>
```

## Embed Calculator
```mdx
<EmbedCalculator 
  type="business-days"
  defaultDays={30}
  title=""
  description=""
/>
```

## Callout
```mdx
<Callout type="info">
💡 提示内容
</Callout>
```

## Accordion
```mdx
<Accordion title="标题">
  内容...
</Accordion>
```

## Step Guide
```mdx
<StepGuide>
  <Step number={1} title="第一步">
    内容...
  </Step>
  <Step number={2} title="第二步">
    内容...
  </Step>
</StepGuide>
```
````

### 5.2 组件使用最佳实践

1. **Hero Banner**: 仅在文章开头使用一次
2. **Blog Image**: 每 500-800 字至少一张图
3. **TableOfContents**: 所有长文章（>1000字）都应包含
4. **Callout**: 突出关键信息，每篇 2-4 个
5. **功能植入**: Tools 和 Guides 类文章必须包含
6. **Accordion**: 适合 FAQ 或次要信息
7. **Related Content**: 所有文章结尾都应包含

---

## 六、Git 同步配置

### 6.1 自动同步设置

Obsidian Git 插件已配置为:
- 每 10 分钟自动 commit
- 每 5 分钟自动 pull
- 启动时自动 pull
- Commit 后自动 push

### 6.2 Commit 消息规范

**自动 commit** (Obsidian Git):
```
docs: 2025-10-10 auto backup
```

**手动 commit** (如需):
```bash
git commit -m "docs: 添加 Philosophy 文章 - 时间是唯一公平的资源"
git commit -m "docs: 更新 Tools 文章 - 工作日计算指南"
git commit -m "docs: 新增 Story - 100天倒计时改变人生"
```

### 6.3 冲突处理

如果遇到 Git 冲突:

1. **自动处理** (Obsidian Git 默认):
   - 插件会尝试自动合并
   - 如果失败，会显示错误提示

2. **手动处理**:
   ```bash
   cd /Users/leonmini/quantum-era/daysfromtoday
   git status
   git pull --rebase
   # 解决冲突
   git add .
   git rebase --continue
   git push
   ```

---

## 七、本地预览

### 7.1 Obsidian 实时预览

Obsidian 内置的实时预览：
- 快捷键: `Cmd+E` (切换编辑/预览模式)
- 或点击右上角的 👁️ 图标

**限制**:
- 无法预览 MDX 组件（显示为代码块）
- 无法预览样式（Tailwind CSS）

### 7.2 Next.js 开发服务器

完整预览（包含 MDX 组件和样式）:

```bash
# 在项目根目录
cd /Users/leonmini/quantum-era/daysfromtoday

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

**热更新**:
- Contentlayer 会自动监听 `content/` 目录
- 修改 MDX 文件时，自动重新生成
- 浏览器自动刷新

---

## 八、双语翻译流程

### 8.1 标准流程

```
1. 完成中文版内容
   content/philosophy/zh/time-value/time-is-fair.mdx
   ↓
2. 复制文件到英文目录
   content/philosophy/en/time-value/time-is-fair.mdx
   ↓
3. 翻译内容
   - Frontmatter（title, description, topics, keywords）
   - 正文
   - 图片 caption
   - 组件内的文字
   ↓
4. 保持不变
   - slug（保持一致）
   - 文件名（保持一致）
   - 目录结构（保持一致）
   - 图片 URL（共用）
   ↓
5. 验证
   - URL 结构一致
   - hreflang 标签正确
```

### 8.2 翻译辅助工具

**推荐工具**:
1. **DeepL** (https://www.deepl.com/) - 翻译质量最高
2. **ChatGPT** - 保持语境和语气
3. **Grammarly** - 英文校对

**翻译检查清单**:
- [ ] Title 翻译
- [ ] Description 翻译
- [ ] Topics 翻译
- [ ] Keywords 翻译
- [ ] 正文翻译
- [ ] 图片 caption 翻译
- [ ] 组件内文字翻译
- [ ] 保持 slug 一致
- [ ] 保持目录结构一致
- [ ] URL 测试

---

## 九、发布前检查清单

### 9.1 内容质量检查

- [ ] **标题**: 吸引人，包含关键词
- [ ] **描述**: 简洁明了，包含长尾关键词
- [ ] **正文**: 无语法错误，逻辑清晰
- [ ] **图片**: 清晰，有 alt 和 caption
- [ ] **链接**: 所有链接可访问
- [ ] **组件**: MDX 组件语法正确

### 9.2 SEO 检查

- [ ] **Frontmatter 完整**:
  - title ✓
  - description ✓
  - date ✓
  - topics ✓
  - keywords ✓
  - ogImage ✓
  
- [ ] **标题层级正确**:
  - 只有一个 H1
  - H2-H3 层级清晰
  - 标题包含关键词
  
- [ ] **内部链接**:
  - 至少 2-3 个相关内容链接
  - 功能跳转链接（Tools/Guides）
  
- [ ] **图片优化**:
  - 所有图片都有 alt
  - 图片大小 <500KB
  - 使用 WebP 格式

### 9.3 双语检查（如适用）

- [ ] 中英文 URL 结构一致
- [ ] 中英文 slug 一致
- [ ] 中英文内容对照完整
- [ ] hreflang 标签正确

### 9.4 本地预览

- [ ] Obsidian 预览正常
- [ ] `npm run dev` 预览正常
- [ ] 移动端预览正常
- [ ] 所有组件渲染正常

---

## 十、常见问题排查

### 10.1 图片上传失败

**问题**: 拖拽图片后没有自动上传

**排查步骤**:
1. 检查 Local Images Plus 插件是否启用
2. 检查上传脚本路径是否正确
3. 检查 R2 环境变量是否配置
4. 手动运行上传脚本测试:
   ```bash
   node scripts/obsidian-upload-image.ts --path=./test.jpg --vault=./content
   ```

### 10.2 Git 同步失败

**问题**: Obsidian Git 提示同步失败

**排查步骤**:
1. 检查是否有未解决的冲突
2. 检查网络连接
3. 手动执行 `git status` 查看状态
4. 如有冲突，手动解决后重试

### 10.3 MDX 组件不显示

**问题**: 本地预览时组件显示为代码块

**原因**: Obsidian 不支持 MDX 组件预览

**解决**: 使用 `npm run dev` 在浏览器中预览

### 10.4 Contentlayer 构建失败

**问题**: `npm run dev` 时报错

**排查步骤**:
1. 检查 MDX 文件语法是否正确
2. 检查 Frontmatter 是否完整
3. 查看错误日志定位具体文件
4. 删除 `.contentlayer/` 目录重新生成:
   ```bash
   rm -rf .contentlayer
   npm run dev
   ```

---

## 十一、快捷键速查

| 操作 | Obsidian 快捷键 | 说明 |
|------|----------------|------|
| 新建笔记 | `Cmd+N` | 新建 MDX 文件 |
| 切换预览 | `Cmd+E` | 编辑/预览模式切换 |
| 插入链接 | `Cmd+K` | 插入内部链接 |
| 插入图片 | 拖拽 | 自动上传到 R2 |
| 搜索 | `Cmd+O` | 快速打开文件 |
| 全局搜索 | `Cmd+Shift+F` | 搜索所有内容 |
| Git 同步 | `Cmd+P` → "Git: Commit & Push" | 手动同步 |

---

## 十二、验收标准

### ✅ 环境配置完成
- [ ] Obsidian 安装并打开 Vault
- [ ] 5 个必装插件全部安装并配置
- [ ] 5 个内容模板全部创建
- [ ] 图片上传脚本测试通过
- [ ] Git 自动同步测试通过

### ✅ 创作流程测试
- [ ] 可使用模板创建新内容
- [ ] 可拖拽上传图片
- [ ] 可插入 MDX 组件
- [ ] 可本地预览（Obsidian + Next.js）
- [ ] 可自动 Git 同步
- [ ] 可自动部署到 Vercel

### ✅ 双语流程测试
- [ ] 可复制内容到另一语言目录
- [ ] 可保持 URL 结构一致
- [ ] 可正确生成 hreflang 标签

---

**版本历史**:
- v2.0 (2025-10-10): 初始版本，完整 Obsidian 工作流指南

