/**
 * MDX Components Registry
 * 
 * 集中导出所有 MDX 组件，供 MDX 渲染器使用
 */

// 1️⃣ 基础展示组件（7个）
export { ImageWithCaption } from './image-with-caption';
export { VideoEmbed } from './video-embed';
export { Quote } from './quote';
export { CodeBlock } from './code-block';
export { Highlight } from './highlight';
export { InlineLink } from './inline-link';
export { StatCard } from './stat-card';

// 2️⃣ 功能植入组件（4个）
export { EmbedCalculator } from './embed-calculator';
export { AddAnniversary } from './add-anniversary';
export { FeatureCard } from './feature-card';
export { CountdownDisplay } from './countdown-display';

// 3️⃣ 交互增强组件（6个）
export { Accordion } from './accordion';
export { Tabs, Tab } from './tabs';
export { Callout } from './callout';
export { StepGuide, Step } from './step-guide';
export { ComparisonTable } from './comparison-table';
export { ToggleContent } from './toggle-content';

