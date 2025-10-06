# 🌍 SEO 与广告合规标准

## 一、SEO 要求

- 页面结构严格符合SEO规则，确保不要漏项、重项，结构简单清晰，搜索引擎友好。
- 所有页面生成 Metadata：`title`、`description`、`openGraph`、`alternate/hreflang`。
- 动态 sitemap 与 robots。
- 添加 FAQPage JSON-LD（用于富结果展示）。
- 多语言结构：`/{locale}/days/{n}-days-from-today`。
- URL 可读、层级清晰。

## 二、性能要求（Core Web Vitals）

| 指标 | 含义         | 目标值      |
| ---- | ------------ | ----------- |
| LCP  | 最大内容绘制 | ≤ 2.5 秒   |
| INP  | 交互响应     | ≤ 200 毫秒 |
| CLS  | 布局偏移     | ≤ 0.1      |

## 三、AdSense 合规

- 根目录发布 `/ads.txt`：

google.com, pub-xxxxxxxxxxxxxx, DIRECT, f08c47fec0942fa0

- 页面布局不得误导点击；
- 欧洲地区使用认证 CMP；
- 实现 Consent Mode v2（含 ad_user_data, ad_personalization）。

## 四、内容生成规范

- 不输出重复页面（canonical + hreflang）；
- 自动生成 OG 图；
- FAQ 与说明段落保持 100–150 字自然语言。
