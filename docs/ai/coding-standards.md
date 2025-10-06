# 💻 代码规范与协作规则

## 一、基础规范

- **语言**：TypeScript（严格模式）。
- **风格**：Prettier 自动格式化；ESLint 强制校验。
- **文件命名**：小写 + 中划线（如 `answer-card.tsx`）。
- **函数命名**：驼峰式（如 `getHolidays()`）。
- **提交信息**：

feat: 新增功能

fix: 修复问题

chore: 构建/依赖修改

docs: 文档更新

- **目录清晰**：禁止临时文件或无用途脚本。

## 二、AI 编程规则

1. 每次修改前必须输出：

- **变更清单**（哪些文件、做什么改动）
- **风险说明**（SEO / 性能 / 安全影响）

2. 修改后输出：

- **Diff 预览**
- **测试说明**
- **Definition of Done**（达成标准）

3. 禁止：

- 未经说明新增依赖
- 修改 Cloudflare 或 DNS 配置
- 上传含密钥的配置文件

## 三、测试标准

- 覆盖场景：
- DST 跨越
- 周末差异（Fri–Sat / Sat–Sun）
- 公共假期（Nager.Date API）
- 单测命名：`*.test.ts`
- 工具：Jest + ts-jest
