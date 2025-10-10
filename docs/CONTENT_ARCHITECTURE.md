# DaysFromToday 内容架构设计

> 版本: v2.0  
> 更新: 2025-10-10  
> 作者: Leon  
> 目标: 定义5大内容分类体系，确保SEO友好和用户体验优秀

---

## 一、架构总览

### 1.1 内容分类体系

DaysFromToday 采用 **5大内容分类体系**，每个分类有明确的定位、目标用户和内容方向：

```
┌─────────────────────────────────────────────────────────────┐
│                    DaysFromToday 内容体系                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Philosophy (时间哲学)     深度思考，启发用户           │
│  2. Tools (实用工具)          实用技巧，解决问题           │
│  3. Stories (故事与人)        真实案例，情感连接           │
│  4. Guides (教程指南)         系统教程，功能说明           │
│  5. Updates (新闻更新)        产品动态，保持透明           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 设计原则

1. **清晰的边界** - 每个分类有独立的定位和内容范围
2. **SEO友好** - URL结构清晰，关键词布局合理
3. **用户导向** - 内容服务于用户需求，而非产品功能堆砌
4. **可扩展性** - 支持多级分类和灵活的内容组织
5. **多语言支持** - 中英文内容平行管理，独立优化

---

## 二、5大内容分类详解

### 2.1 Philosophy（时间哲学）

**定位**: 关于时间、人生、成长的深度思考

**目标用户**:
- 对时间管理有深度兴趣的用户
- 追求个人成长的职场人士
- 希望找到人生方向的迷茫者
- 喜欢阅读哲理性内容的读者

**内容方向**:
- 时间的价值观（如"时间是唯一公平的资源"）
- 成长心法（如"10,000小时法则是真的吗？"）
- 人生思考（如"如何对抗时间焦虑"）
- 心理学视角（如"拖延症的本质"）

**典型主题**:
- `time-value` - 时间价值
- `growth` - 成长思考
- `mindset` - 心态管理
- `psychology` - 心理学

**SEO关键词布局**:
- 主词: 时间管理、个人成长、时间价值、人生规划
- 长尾: 如何对抗时间焦虑、时间管理心理学、成长型思维

**内容示例**:
```
/zh/philosophy/time-value/time-is-fair
标题: 时间是唯一公平的资源：为什么你应该重新审视时间价值
描述: 探讨时间的公平性，以及如何通过重新审视时间价值来改变人生轨迹
```

**内容特点**:
- 深度 > 广度（2000-3000字）
- 哲理性强，引发思考
- 结合心理学、哲学理论
- 配图偏向抽象、启发性
- 适合社交媒体深度分享

---

### 2.2 Tools（实用工具）

**定位**: 日期计算、时间管理的实用技巧和工具使用方法

**目标用户**:
- 需要快速解决具体问题的用户（如"怎么算工作日"）
- 经常需要日期计算的职场人士
- 项目管理者、HR、财务人员
- 学生（考试倒计时、假期规划）

**内容方向**:
- 日期计算技巧（如"如何快速计算工作日"）
- 时区换算方法（如"跨时区会议时间怎么算"）
- 节假日查询（如"2025年中国法定节假日完整列表"）
- 时间规划方法（如"90天目标规划法"）

**典型主题**:
- `date-calculation` - 日期计算
- `timezone` - 时区换算
- `holidays` - 节假日
- `planning` - 时间规划

**SEO关键词布局**:
- 主词: 日期计算、工作日计算、时区换算、节假日查询
- 长尾: 如何计算两个日期之间的工作日、跨时区会议时间计算器

**内容示例**:
```
/zh/tools/date-calculation/business-days-guide
标题: 如何计算工作日：完整指南（含实用计算器）
描述: 学习如何准确计算工作日，排除周末和节假日，掌握实用的时间管理技巧
```

**内容特点**:
- 实用性强（800-1500字）
- 包含实际案例
- **必须植入功能组件**（如 EmbedCalculator）
- 配图偏向操作截图、流程图
- 适合搜索引擎流量获取

---

### 2.3 Stories（故事与人）

**定位**: 真实用户案例、创始人故事、成长故事

**目标用户**:
- 寻找灵感和动力的用户
- 对真实案例感兴趣的读者
- 想了解产品背后故事的用户
- 需要情感共鸣的人群

**内容方向**:
- 用户成功案例（如"100天倒计时改变了我的拖延症"）
- 创始人故事（如"Why I Built DaysFromToday"）
- 社区故事（如"我们的用户如何使用纪念日功能"）
- 成长故事（如"从0到10,000用户的旅程"）

**典型主题**:
- `user-stories` - 用户故事
- `founder` - 创始人故事
- `community` - 社区故事
- `journey` - 成长旅程

**SEO关键词布局**:
- 主词: 时间管理案例、倒计时故事、个人成长案例
- 长尾: 如何用100天改变人生、时间管理成功案例分享

**内容示例**:
```
/zh/stories/user-stories/100-day-transformation
标题: 100天倒计时如何改变了我的拖延症：一个真实的故事
描述: 一位用户分享如何通过100天倒计时克服拖延症，实现目标的真实经历
```

**内容特点**:
- 故事性强（1500-2500字）
- 真实、有共鸣
- 包含人物、冲突、转折、结局
- 配图偏向人物照片、真实场景
- 适合社交媒体情感营销

---

### 2.4 Guides（教程指南）

**定位**: 系统化的功能教程和使用指南

**目标用户**:
- 新用户（快速上手）
- 需要深度了解功能的用户
- 遇到使用问题的用户
- 想要优化使用方式的高级用户

**内容方向**:
- 新手入门（如"DaysFromToday 快速上手"）
- 功能详解（如"纪念日功能完整指南"）
- 最佳实践（如"如何高效使用日期计算器"）
- 问题解答（如"常见问题解答"）

**典型主题**:
- `getting-started` - 快速上手
- `features` - 功能详解
- `best-practices` - 最佳实践
- `troubleshooting` - 问题排查

**SEO关键词布局**:
- 主词: DaysFromToday教程、日期计算器使用方法、纪念日功能
- 长尾: 如何使用DaysFromToday计算工作日、纪念日功能怎么用

**内容示例**:
```
/zh/guides/features/anniversary-complete-guide
标题: DaysFromToday 纪念日功能完整指南
描述: 从添加到管理，全面掌握DaysFromToday的纪念日功能，永不错过重要日子
```

**内容特点**:
- 系统性强（1200-2000字）
- 步骤清晰，含截图
- **必须植入功能组件**（如 AddAnniversary、FeatureCard）
- 配图偏向操作截图、流程图
- 适合产品导流和用户留存

---

### 2.5 Updates（新闻更新）

**定位**: 产品更新、版本日志、路线图

**目标用户**:
- 现有用户（了解新功能）
- 关注产品发展的用户
- 潜在投资者/合作伙伴
- 媒体和博主

**内容方向**:
- 版本发布（如"v2.0 发布：支持15国节假日"）
- 功能更新（如"新增时区换算功能"）
- 路线图（如"2025 Q2 产品路线图"）
- 里程碑（如"庆祝10,000用户"）

**典型主题**:
- `releases` - 版本发布
- `features-update` - 功能更新
- `roadmap` - 产品路线图
- `milestones` - 里程碑

**SEO关键词布局**:
- 主词: DaysFromToday更新、新功能发布、产品路线图
- 长尾: DaysFromToday v2.0新功能、2025产品更新计划

**内容示例**:
```
/zh/updates/releases/v2-0-launch
标题: DaysFromToday v2.0 正式发布：支持15国节假日和多时区
描述: 全新版本带来15国节假日支持、多时区换算等重磅功能，提升全球用户体验
```

**内容特点**:
- 简洁明了（500-1000字）
- 重点突出（用列表）
- 包含更新日志
- 配图偏向功能截图、对比图
- 适合产品PR和用户沟通

---

## 三、URL 结构设计

### 3.1 URL 规范

**基本结构**:
```
/{locale}/{category}/{subcategory?}/{slug}
```

**示例**:
```
中文:
/zh/philosophy/time-value/time-is-fair
/zh/tools/date-calculation/business-days-guide
/zh/stories/user-stories/100-day-transformation
/zh/guides/features/anniversary-complete-guide
/zh/updates/releases/v2-0-launch

英文:
/en/philosophy/time-value/time-is-fair
/en/tools/date-calculation/business-days-guide
/en/stories/user-stories/100-day-transformation
/en/guides/features/anniversary-complete-guide
/en/updates/releases/v2-0-launch
```

### 3.2 分类页面 URL

**二级分类页**:
```
/zh/philosophy                    # 所有时间哲学内容
/zh/tools                         # 所有实用工具内容
/zh/stories                       # 所有故事内容
/zh/guides                        # 所有教程指南
/zh/updates                       # 所有新闻更新
```

**三级子分类页**:
```
/zh/philosophy/time-value         # 时间价值主题
/zh/tools/date-calculation        # 日期计算主题
/zh/stories/user-stories          # 用户故事主题
/zh/guides/features               # 功能详解主题
/zh/updates/releases              # 版本发布主题
```

### 3.3 URL 命名规则

1. **全部小写** - 使用小写字母
2. **用中划线** - 单词间用 `-` 连接
3. **语义化** - URL 能直接反映内容
4. **简洁** - 避免过长的 URL
5. **一致性** - 中英文 URL 结构保持一致

**❌ 错误示例**:
```
/zh/Philosophy/TimeValue/TimeIsFair     # 大写字母
/zh/philosophy/time_value/time_is_fair  # 下划线
/zh/philosophy/asdfgh123                # 无意义
```

**✅ 正确示例**:
```
/zh/philosophy/time-value/time-is-fair
/en/philosophy/time-value/time-is-fair
```

---

## 四、面包屑导航规则

### 4.1 面包屑结构

**标准格式**:
```
首页 > 分类 > 子分类 > 文章标题
```

**示例**:
```
首页 > 时间哲学 > 时间价值 > 时间是唯一公平的资源
Home > Philosophy > Time Value > Time is the Only Fair Resource
```

### 4.2 自动生成规则

基于 URL 自动生成面包屑：

```typescript
// URL: /zh/philosophy/time-value/time-is-fair
// 自动生成:
{
  breadcrumbs: [
    { label: "首页", url: "/zh" },
    { label: "时间哲学", url: "/zh/philosophy" },
    { label: "时间价值", url: "/zh/philosophy/time-value" },
    { label: "时间是唯一公平的资源", url: "/zh/philosophy/time-value/time-is-fair" }
  ]
}
```

### 4.3 面包屑 SEO

每个面包屑都包含结构化数据（BreadcrumbList Schema）：

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://www.daysfromtoday.ai/zh"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "时间哲学",
      "item": "https://www.daysfromtoday.ai/zh/philosophy"
    }
  ]
}
```

---

## 五、内容关联策略

### 5.1 相关内容推荐

**推荐逻辑**:
1. **同主题优先** - 同一 topic/tag 的内容
2. **同分类次之** - 同一 category 的内容
3. **阅读路径** - 根据用户旅程推荐（新手 → 进阶）

**示例**:
```yaml
# 文章: /zh/tools/date-calculation/business-days-guide
相关推荐:
  - /zh/tools/date-calculation/timezone-conversion    # 同子分类
  - /zh/guides/features/calculator-usage              # 功能教程
  - /zh/philosophy/time-value/time-management         # 深度思考
```

### 5.2 内容链接网络

构建内部链接网络，提升 SEO：

```
Philosophy（深度）
    ↓ 引用
Tools（实用）
    ↓ 植入
Guides（教程）
    ↓ 案例
Stories（故事）
    ↓ 证明
Updates（更新）
```

**链接规则**:
- 每篇文章至少链接到 2-3 篇相关内容
- Philosophy 文章链接到 Tools/Guides（引导用户行动）
- Tools 文章链接到 Guides（深度学习）
- Stories 文章链接到 Philosophy/Tools（情感+实用）
- Updates 文章链接到 Guides（新功能教程）

---

## 六、多语言策略

### 6.1 语言独立管理

**原则**: 中英文内容独立管理，独立优化

```
content/
├── philosophy/
│   ├── en/
│   │   └── time-value/
│   │       └── time-is-fair.mdx       # 英文版
│   └── zh/
│       └── time-value/
│           └── time-is-fair.mdx       # 中文版
```

### 6.2 URL 对照

中英文 URL 结构保持一致，便于 hreflang 标签：

```html
<link rel="alternate" hreflang="en" href="https://www.daysfromtoday.ai/en/philosophy/time-value/time-is-fair" />
<link rel="alternate" hreflang="zh" href="https://www.daysfromtoday.ai/zh/philosophy/time-value/time-is-fair" />
<link rel="alternate" hreflang="x-default" href="https://www.daysfromtoday.ai/en/philosophy/time-value/time-is-fair" />
```

### 6.3 内容本地化

不仅翻译，还需本地化：

**英文版**:
- 案例使用欧美场景
- 节假日参考美国/英国
- 时间格式: MM/DD/YYYY

**中文版**:
- 案例使用中国场景
- 节假日参考中国法定节假日
- 时间格式: YYYY-MM-DD

---

## 七、SEO 关键词布局

### 7.1 关键词分层

**核心关键词**（5个）:
- 日期计算
- 时间管理
- 工作日计算
- 倒计时
- 纪念日

**长尾关键词**（50+个）:
- 如何计算工作日
- 两个日期之间的天数
- 时间管理方法
- 100天倒计时
- 重要日子提醒
- ... （更多见关键词库）

### 7.2 关键词映射

每个分类对应特定关键词群：

| 分类 | 核心关键词 | 长尾关键词示例 |
|------|-----------|---------------|
| Philosophy | 时间管理、个人成长 | 如何对抗时间焦虑、时间管理心理学 |
| Tools | 日期计算、工作日计算 | 如何快速计算工作日、时区换算方法 |
| Stories | 时间管理案例、成长故事 | 100天改变人生、倒计时成功案例 |
| Guides | DaysFromToday教程 | 纪念日功能使用方法、快速上手指南 |
| Updates | DaysFromToday更新 | v2.0新功能、产品路线图 |

### 7.3 关键词密度

- **标题必含主关键词** - Title 包含 1 个核心关键词
- **描述必含长尾词** - Description 包含 1-2 个长尾关键词
- **正文自然分布** - 关键词密度 1-2%，自然出现
- **小标题包含关键词** - H2/H3 包含相关关键词
- **图片 Alt 包含关键词** - 图片描述包含关键词

---

## 八、内容生产流程

### 8.1 内容规划

**月度规划**:
- Philosophy: 1-2 篇（深度长文）
- Tools: 3-5 篇（高频次，SEO流量）
- Stories: 1-2 篇（情感共鸣）
- Guides: 2-3 篇（功能教程）
- Updates: 1-2 篇（产品动态）

**总计**: 8-14 篇/月

### 8.2 创作流程

```
1. 选题（选择分类和主题）
   ↓
2. 关键词研究（确定目标关键词）
   ↓
3. 大纲设计（结构化内容）
   ↓
4. 内容创作（使用 Obsidian）
   ↓
5. 富媒体添加（图片、视频、组件）
   ↓
6. SEO 优化（Frontmatter、关键词）
   ↓
7. 双语翻译（如需）
   ↓
8. 内部审核（质量检查）
   ↓
9. 发布上线（Git 同步）
   ↓
10. 数据监控（GSC、GA）
```

### 8.3 质量标准

**Philosophy**:
- 字数: 2000-3000 字
- 深度: 引用理论、数据、案例
- 配图: 3-5 张（抽象、启发性）

**Tools**:
- 字数: 800-1500 字
- 实用性: 必须包含实际操作步骤
- 功能植入: 至少 1 个组件（EmbedCalculator）
- 配图: 2-4 张（操作截图、流程图）

**Stories**:
- 字数: 1500-2500 字
- 故事性: 完整的故事结构
- 配图: 3-5 张（人物、场景）

**Guides**:
- 字数: 1200-2000 字
- 系统性: 完整的步骤说明
- 功能植入: 至少 1 个组件
- 配图: 5-8 张（操作截图）

**Updates**:
- 字数: 500-1000 字
- 简洁性: 重点突出
- 配图: 1-3 张（功能截图）

---

## 九、内容目录规划

### 9.1 初期内容规划（Phase 2-3）

**Philosophy（3-5 篇）**:
- 时间是唯一公平的资源
- 如何对抗时间焦虑
- 10,000 小时法则是真的吗？
- 拖延症的本质
- 时间管理的底层逻辑

**Tools（10-15 篇）**:
- 如何计算工作日
- 两个日期之间的天数计算
- 时区换算完全指南
- 2025-2028 中国法定节假日
- 100天目标规划法
- 如何快速计算倒计时
- 跨时区会议时间计算
- ... （更多实用工具文章）

**Stories（3-5 篇）**:
- Why I Built DaysFromToday（已有）
- 100天倒计时改变了我的拖延症
- 我如何用纪念日功能记住所有重要日子
- 从0到10,000用户的旅程
- 我们的用户故事精选

**Guides（5-8 篇）**:
- DaysFromToday 快速上手指南
- 纪念日功能完整教程
- 日期计算器使用方法
- 工作日计算功能详解
- 如何导出日历文件（ICS）
- 常见问题解答（FAQ）
- 最佳实践：高效使用 DaysFromToday

**Updates（2-3 篇）**:
- v2.0 发布：支持15国节假日
- 新增时区换算功能
- 2025 Q2 产品路线图

**总计**: 23-36 篇（初期内容基础）

### 9.2 长期内容规划（Phase 4-5）

**持续更新**:
- Tools: 每月 3-5 篇（主要SEO流量来源）
- Philosophy: 每月 1-2 篇（深度内容）
- Stories: 每月 1-2 篇（情感连接）
- Guides: 每月 2-3 篇（功能教程）
- Updates: 按产品节奏（版本发布时）

**年度目标**:
- 第一年: 100+ 篇优质内容
- 第二年: 200+ 篇优质内容
- 覆盖所有主要关键词

---

## 十、验收标准

### ✅ 架构完整性
- [ ] 5大分类定义清晰
- [ ] URL 结构规范一致
- [ ] 面包屑自动生成规则明确
- [ ] 多语言策略清晰

### ✅ SEO 友好性
- [ ] 关键词布局合理
- [ ] 内容关联策略明确
- [ ] 结构化数据完整
- [ ] Sitemap 自动生成

### ✅ 可执行性
- [ ] 内容生产流程清晰
- [ ] 质量标准明确
- [ ] 初期内容规划完整
- [ ] 可直接按此文档执行

---

## 附录：术语对照表

| 中文 | 英文 | URL Slug |
|------|------|----------|
| 时间哲学 | Philosophy | philosophy |
| 实用工具 | Tools | tools |
| 故事与人 | Stories | stories |
| 教程指南 | Guides | guides |
| 新闻更新 | Updates | updates |
| 时间价值 | Time Value | time-value |
| 成长思考 | Growth | growth |
| 心态管理 | Mindset | mindset |
| 日期计算 | Date Calculation | date-calculation |
| 时区换算 | Timezone | timezone |
| 节假日 | Holidays | holidays |
| 用户故事 | User Stories | user-stories |
| 创始人故事 | Founder | founder |
| 快速上手 | Getting Started | getting-started |
| 功能详解 | Features | features |
| 版本发布 | Releases | releases |
| 产品路线图 | Roadmap | roadmap |

---

**版本历史**:
- v2.0 (2025-10-10): 初始版本，定义5大分类体系

