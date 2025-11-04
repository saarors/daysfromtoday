/**
 * 流式输出渐显配置
 * 
 * 可通过调整这些参数来控制类似 ChatGPT 的打字机效果
 * 
 * 🎨 渐显效果包括:
 * 1. 逐字符出现 (通过 CHARS_PER_BATCH 和 CHAR_INTERVAL 控制)
 * 2. CSS 淡入动画 (透明度从 0 → 1,持续 0.4s)
 * 3. 可选的模糊效果 (blur 从 1px → 0)
 */

export const STREAMING_CONFIG = {
  /**
   * 每批显示的字符数
   * - 1: 最流畅,逐字显示 (类似 ChatGPT)
   * - 2-3: 平衡流畅度和性能 (推荐)
   * - 5+: 更快,但会有"跳跃"感
   * 
   * 💡 配合 CSS 动画,即使批量显示,每个字符也会有淡入效果
   */
  CHARS_PER_BATCH: 2,

  /**
   * 每批字符之间的间隔 (毫秒)
   * - 20-30ms: 类似 ChatGPT 的速度 (推荐)
   * - 10-20ms: 更快,适合长文本
   * - 50+ms: 慢速,适合演示
   * 
   * 💡 CSS 动画时长固定为 0.4s,与此参数独立
   */
  CHAR_INTERVAL: 30,
  
  /**
   * CSS 动画配置 (在各组件的 <style jsx> 中定义)
   * 
   * 主内容区 (.fade-in-char):
   * - duration: 0.4s
   * - effect: opacity 0→1, blur 1px→0
   * 
   * 思考区 (.fade-in-char-thinking):
   * - duration: 0.5s
   * - effect: opacity 0→1, color 浅灰→深灰
   */

  /**
   * 预设配置
   */
  PRESETS: {
    // 最流畅 (类似 ChatGPT)
    SMOOTH: {
      CHARS_PER_BATCH: 1,
      CHAR_INTERVAL: 25,
    },
    // 平衡 (推荐)
    BALANCED: {
      CHARS_PER_BATCH: 2,
      CHAR_INTERVAL: 30,
    },
    // 快速
    FAST: {
      CHARS_PER_BATCH: 3,
      CHAR_INTERVAL: 20,
    },
    // 演示模式
    DEMO: {
      CHARS_PER_BATCH: 1,
      CHAR_INTERVAL: 50,
    },
  },
} as const;

/**
 * 应用预设配置
 */
export function applyPreset(preset: keyof typeof STREAMING_CONFIG.PRESETS) {
  const config = STREAMING_CONFIG.PRESETS[preset];
  return {
    CHARS_PER_BATCH: config.CHARS_PER_BATCH,
    CHAR_INTERVAL: config.CHAR_INTERVAL,
  };
}

