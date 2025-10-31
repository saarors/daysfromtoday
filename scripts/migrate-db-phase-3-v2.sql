-- =========================================
-- Phase 3 数据库完全重建脚本 V2
-- 版本: V3.0-Phase3-AI-Matching
-- 日期: 2025-10-31
-- 说明: 支持 AI 助手自动匹配系统的全新数据库结构
-- 
-- ⚠️ 警告：此脚本会删除所有历史数据！
-- 理论依据: docs/AI_PERSONA_MATCHING_SYSTEM.md
-- =========================================

-- =========================================
-- 步骤 1: 删除所有旧表和函数（完全清空）
-- =========================================
DROP TABLE IF EXISTS goal_cards CASCADE;
DROP TABLE IF EXISTS ai_prompt_templates CASCADE;
DROP TABLE IF EXISTS ai_api_logs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS goal_types CASCADE;
DROP TABLE IF EXISTS ai_personas CASCADE;
DROP TABLE IF EXISTS user_emotion_logs CASCADE;
DROP TABLE IF EXISTS card_comments CASCADE;
DROP TABLE IF EXISTS card_likes CASCADE;
DROP TABLE IF EXISTS custom_templates CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 删除所有旧函数
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS increment_goal_cards_count(UUID) CASCADE;
DROP FUNCTION IF EXISTS decrement_goal_cards_count(UUID) CASCADE;
DROP FUNCTION IF EXISTS check_goal_cards_quota(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_user_quota(UUID) CASCADE;

-- =========================================
-- 步骤 2: 启用必要的扩展
-- =========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- 步骤 3: 创建 goal_types 表（目标类型库）
-- =========================================
CREATE TABLE goal_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 分类信息
  code VARCHAR(50) NOT NULL UNIQUE,
  name_zh VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  
  -- 识别规则（关键词）
  keywords_zh TEXT[] NOT NULL,
  keywords_en TEXT[] NOT NULL,
  
  -- 匹配规则（简单版）
  default_persona_code VARCHAR(50) NOT NULL,
  default_tone VARCHAR(50),
  default_frameworks TEXT[],
  
  -- 特征描述（用于 AI 理解）
  characteristics JSONB,
  
  -- 元数据
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_goal_types_code ON goal_types(code);
CREATE INDEX idx_goal_types_persona ON goal_types(default_persona_code);
CREATE INDEX idx_goal_types_active ON goal_types(is_active) WHERE is_active = true;

-- 注释
COMMENT ON TABLE goal_types IS 'V3.0 目标类型分类库（15种核心类型）';
COMMENT ON COLUMN goal_types.code IS '类型代码（如: health, work, learning）';
COMMENT ON COLUMN goal_types.keywords_zh IS '中文关键词数组（用于目标识别）';
COMMENT ON COLUMN goal_types.keywords_en IS '英文关键词数组';
COMMENT ON COLUMN goal_types.default_persona_code IS '默认匹配的 AI 人格代码';
COMMENT ON COLUMN goal_types.characteristics IS '目标特征描述（JSON格式）';

-- =========================================
-- 步骤 4: 创建 ai_personas 表（AI 人格库）
-- =========================================
CREATE TABLE ai_personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 基础信息
  code VARCHAR(50) NOT NULL UNIQUE,
  name_zh VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  
  -- 人格类型与继承关系
  persona_type VARCHAR(20) DEFAULT 'core' CHECK (persona_type IN ('core', 'extended', 'variant')),
  parent_persona_code VARCHAR(50),
  
  -- 视觉呈现
  avatar_emoji VARCHAR(10),
  color_theme VARCHAR(20),
  
  -- 核心特征
  core_trait_zh VARCHAR(200),
  core_trait_en VARCHAR(200),
  tone_description TEXT,
  
  -- 语气模板（不同阶段）
  tone_templates JSONB,
  /* 示例：
  {
    "start": "很好！我们一起制定一个清晰的计划。",
    "in_progress": "你已经完成了 {progress}%，继续保持。",
    "obstacle": "遇到困难很正常，我们来拆解一下。"
  }
  */
  
  -- 能力配置
  knowledge_domains TEXT[],
  suitable_goal_types TEXT[],
  suitable_difficulty_levels TEXT[],
  
  -- 干预逻辑
  intervention_rules JSONB,
  /* 示例：
  {
    "if_progress_stalled_for_3_days": {
      "action": "trigger_WOOP_reappraisal"
    }
  }
  */
  
  -- 元数据
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- 外键约束（自引用）
  CONSTRAINT fk_parent_persona FOREIGN KEY (parent_persona_code) 
    REFERENCES ai_personas(code) ON DELETE SET NULL
);

-- 索引
CREATE INDEX idx_personas_code ON ai_personas(code);
CREATE INDEX idx_personas_goal_types ON ai_personas USING GIN(suitable_goal_types);
CREATE INDEX idx_personas_active ON ai_personas(is_active) WHERE is_active = true;

-- 索引（人格类型和父子关系）
CREATE INDEX idx_personas_type ON ai_personas(persona_type);
CREATE INDEX idx_personas_parent ON ai_personas(parent_persona_code);

-- 注释
COMMENT ON TABLE ai_personas IS 'V3.0 AI 人格配置库（10核心+3扩展+1变体=14种人格）';
COMMENT ON COLUMN ai_personas.code IS '人格代码（如: coach, companion, analyst）';
COMMENT ON COLUMN ai_personas.persona_type IS '人格类型：core(核心10种)/extended(扩展3种)/variant(变体1种)';
COMMENT ON COLUMN ai_personas.parent_persona_code IS '父人格代码（扩展和变体人格的继承源）';
COMMENT ON COLUMN ai_personas.tone_templates IS '不同阶段的语气模板（JSON格式）';
COMMENT ON COLUMN ai_personas.suitable_goal_types IS '适合的目标类型数组';

-- =========================================
-- 步骤 5: 创建 goal_cards 表（用户目标卡片 - 增强版）
-- =========================================
CREATE TABLE goal_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- 目标内容
  goal_text TEXT NOT NULL,
  target_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  card_type VARCHAR(20) DEFAULT 'future',
  
  -- AI 匹配结果
  goal_type_code VARCHAR(50), -- 外键稍后添加
  detected_difficulty VARCHAR(20),
  ai_persona_code VARCHAR(50), -- 外键稍后添加
  ai_tone VARCHAR(50),
  
  -- AI 生成内容
  ai_analysis TEXT,
  ai_summary TEXT,
  ai_model_used VARCHAR(50) DEFAULT 'deepseek',
  input_language VARCHAR(10) NOT NULL,
  
  -- 匹配元数据
  matching_metadata JSONB,
  /* 示例：
  {
    "detected_keywords": ["减肥", "10斤"],
    "confidence_score": 0.95,
    "fallback_used": false,
    "matched_at": "2025-10-31T10:30:00Z"
  }
  */
  
  -- 人格切换历史（为未来功能预留）
  persona_switch_history JSONB,
  /* 示例：
  [
    {
      "from": "coach",
      "to": "therapist",
      "reason": "user_frustrated",
      "timestamp": "2025-11-05T14:20:00Z"
    }
  ]
  */
  
  -- 进度管理
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  
  -- 元数据
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 添加外键约束
ALTER TABLE goal_cards 
  ADD CONSTRAINT fk_goal_type 
  FOREIGN KEY (goal_type_code) REFERENCES goal_types(code) ON DELETE SET NULL;

ALTER TABLE goal_cards 
  ADD CONSTRAINT fk_ai_persona 
  FOREIGN KEY (ai_persona_code) REFERENCES ai_personas(code) ON DELETE SET NULL;

-- 索引
CREATE INDEX idx_goal_cards_type ON goal_cards(goal_type_code);
CREATE INDEX idx_goal_cards_persona ON goal_cards(ai_persona_code);
CREATE INDEX idx_goal_cards_user ON goal_cards(user_id, created_at DESC);
CREATE INDEX idx_goal_cards_difficulty ON goal_cards(detected_difficulty);
CREATE INDEX idx_goal_cards_public ON goal_cards(is_public, created_at DESC) WHERE is_public = true;

-- 注释
COMMENT ON TABLE goal_cards IS 'V3.0 用户目标卡片表（支持 AI 智能匹配）';
COMMENT ON COLUMN goal_cards.goal_type_code IS '关联目标类型（自动识别）';
COMMENT ON COLUMN goal_cards.detected_difficulty IS '检测到的目标难度: easy/medium/hard/extreme';
COMMENT ON COLUMN goal_cards.ai_persona_code IS '匹配的 AI 人格代码';
COMMENT ON COLUMN goal_cards.matching_metadata IS '匹配过程的元数据（JSON）';

-- =========================================
-- 步骤 6: 创建 ai_prompt_templates 表（提示词模板 - 重构版）
-- =========================================
CREATE TABLE ai_prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 多维度匹配键
  persona_code VARCHAR(50) NOT NULL,
  goal_type_code VARCHAR(50) NOT NULL,
  difficulty_level VARCHAR(20) NOT NULL,
  stage VARCHAR(30) NOT NULL,
  output_language VARCHAR(10) NOT NULL,
  
  -- 提示词内容
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  
  -- 方法论引用
  frameworks_applied TEXT[],
  
  -- 元数据
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (persona_code, goal_type_code, difficulty_level, stage, output_language, version)
);

-- 添加外键约束
ALTER TABLE ai_prompt_templates
  ADD CONSTRAINT fk_prompt_persona
  FOREIGN KEY (persona_code) REFERENCES ai_personas(code) ON DELETE CASCADE;

ALTER TABLE ai_prompt_templates
  ADD CONSTRAINT fk_prompt_goal_type
  FOREIGN KEY (goal_type_code) REFERENCES goal_types(code) ON DELETE CASCADE;

-- 索引
CREATE INDEX idx_prompt_match ON ai_prompt_templates(
  persona_code, goal_type_code, difficulty_level, stage, output_language
) WHERE is_active = true;

CREATE INDEX idx_prompt_persona ON ai_prompt_templates(persona_code);
CREATE INDEX idx_prompt_goal_type ON ai_prompt_templates(goal_type_code);

-- 注释
COMMENT ON TABLE ai_prompt_templates IS 'V3.0 AI 提示词模板库（支持多维度匹配）';
COMMENT ON COLUMN ai_prompt_templates.difficulty_level IS '难度级别: easy/medium/hard/extreme';
COMMENT ON COLUMN ai_prompt_templates.stage IS '目标阶段: start/in_progress/obstacle/near_end/reflection';
COMMENT ON COLUMN ai_prompt_templates.frameworks_applied IS '应用的方法论（如: WOOP, SMART）';

-- =========================================
-- 步骤 7: 创建 ai_api_logs 表（API 调用日志）
-- =========================================
CREATE TABLE ai_api_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES goal_cards(id) ON DELETE SET NULL,
  
  -- API 调用信息
  model VARCHAR(50) NOT NULL,
  persona_code VARCHAR(50),
  goal_type_code VARCHAR(50),
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_cost DECIMAL(10, 6),
  response_time_ms INTEGER,
  
  -- 状态
  status VARCHAR(20) DEFAULT 'success',
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_api_logs_user ON ai_api_logs(user_id, created_at DESC);
CREATE INDEX idx_api_logs_card ON ai_api_logs(card_id);
CREATE INDEX idx_api_logs_cost ON ai_api_logs(created_at DESC, total_cost);
CREATE INDEX idx_api_logs_persona ON ai_api_logs(persona_code, created_at DESC);

-- 注释
COMMENT ON TABLE ai_api_logs IS 'AI API 调用日志（成本追踪和性能监控）';
COMMENT ON COLUMN ai_api_logs.total_cost IS '单次调用成本（人民币元）';

-- =========================================
-- 步骤 8: 创建 profiles 表（用户配置和配额管理）
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 配额管理
  goal_cards_limit INTEGER DEFAULT 3 CHECK (goal_cards_limit >= 0),
  goal_cards_count INTEGER DEFAULT 0 CHECK (goal_cards_count >= 0),
  subscription_tier VARCHAR(20) DEFAULT 'free',
  
  -- 用户偏好（为未来功能预留）
  preferred_language VARCHAR(10) DEFAULT 'zh',
  preferred_persona_code VARCHAR(50),
  
  -- 订阅信息
  subscription_expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_profiles_subscription ON public.profiles(subscription_tier, subscription_expires_at);
CREATE INDEX idx_profiles_persona ON public.profiles(preferred_persona_code);

-- 注释
COMMENT ON TABLE public.profiles IS '用户配置和配额管理表';
COMMENT ON COLUMN public.profiles.goal_cards_limit IS '最大目标卡片数量（Free: 3, Pro: 无限）';
COMMENT ON COLUMN public.profiles.preferred_persona_code IS '用户偏好的 AI 人格（可覆盖自动匹配）';

-- =========================================
-- 步骤 9: 创建触发器函数
-- =========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 应用触发器
CREATE TRIGGER update_goal_types_updated_at
BEFORE UPDATE ON goal_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personas_updated_at
BEFORE UPDATE ON ai_personas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goal_cards_updated_at
BEFORE UPDATE ON goal_cards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at
BEFORE UPDATE ON ai_prompt_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 步骤 10: 创建 RPC 函数（配额管理）
-- =========================================

-- 增加配额
CREATE OR REPLACE FUNCTION increment_goal_cards_count(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (p_user_id)
  ON CONFLICT (id) DO NOTHING;
  
  UPDATE public.profiles
  SET 
    goal_cards_count = goal_cards_count + 1,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 减少配额
CREATE OR REPLACE FUNCTION decrement_goal_cards_count(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET 
    goal_cards_count = GREATEST(0, goal_cards_count - 1),
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 检查配额
CREATE OR REPLACE FUNCTION check_goal_cards_quota(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_limit INTEGER;
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (p_user_id)
  ON CONFLICT (id) DO NOTHING;
  
  SELECT goal_cards_count, goal_cards_limit
  INTO current_count, max_limit
  FROM public.profiles
  WHERE id = p_user_id;
  
  RETURN current_count < max_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户配额信息
CREATE OR REPLACE FUNCTION get_user_quota(p_user_id UUID)
RETURNS TABLE(
  current_count INTEGER,
  max_limit INTEGER,
  remaining INTEGER,
  subscription_tier VARCHAR
) AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (p_user_id)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN QUERY
  SELECT 
    p.goal_cards_count,
    p.goal_cards_limit,
    GREATEST(0, p.goal_cards_limit - p.goal_cards_count) AS remaining,
    p.subscription_tier
  FROM public.profiles p
  WHERE p.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================
-- 步骤 11: 启用 Row Level Security (RLS)
-- =========================================

ALTER TABLE goal_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompt_templates ENABLE ROW LEVEL SECURITY;

-- goal_cards 策略
CREATE POLICY "用户可以查看自己的卡片"
  ON goal_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的卡片"
  ON goal_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的卡片"
  ON goal_cards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的卡片"
  ON goal_cards FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "所有人可以查看公开卡片"
  ON goal_cards FOR SELECT
  USING (is_public = true);

-- profiles 策略
CREATE POLICY "用户可以查看自己的 profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的 profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ai_api_logs 策略
CREATE POLICY "用户可以查看自己的 API 日志"
  ON ai_api_logs FOR SELECT
  USING (auth.uid() = user_id);

-- goal_types, ai_personas, ai_prompt_templates 策略（所有人可读）
CREATE POLICY "所有人可以查看目标类型"
  ON goal_types FOR SELECT
  USING (is_active = true);

CREATE POLICY "所有人可以查看 AI 人格"
  ON ai_personas FOR SELECT
  USING (is_active = true);

CREATE POLICY "所有人可以查看提示词模板"
  ON ai_prompt_templates FOR SELECT
  USING (is_active = true);

-- =========================================
-- 完成提示
-- =========================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Phase 3 V2 数据库重建完成！';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 已创建表：';
  RAISE NOTICE '   • goal_types (目标类型库)';
  RAISE NOTICE '   • ai_personas (AI 人格库)';
  RAISE NOTICE '   • goal_cards (用户目标卡片 - 增强版)';
  RAISE NOTICE '   • ai_prompt_templates (提示词模板 - 重构版)';
  RAISE NOTICE '   • ai_api_logs (API 调用日志)';
  RAISE NOTICE '   • profiles (用户配置和配额)';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 已创建 RPC 函数：';
  RAISE NOTICE '   • increment_goal_cards_count';
  RAISE NOTICE '   • decrement_goal_cards_count';
  RAISE NOTICE '   • check_goal_cards_quota';
  RAISE NOTICE '   • get_user_quota';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 已启用 Row Level Security (RLS)';
  RAISE NOTICE '';
  RAISE NOTICE '📝 下一步：初始化目标类型和 AI 人格数据';
  RAISE NOTICE '   npx tsx scripts/seed-goal-types.ts';
  RAISE NOTICE '   npx tsx scripts/seed-ai-personas.ts';
  RAISE NOTICE '   npx tsx scripts/seed-prompts-v2.ts';
  RAISE NOTICE '';
  RAISE NOTICE '📚 理论指导文档：';
  RAISE NOTICE '   docs/AI_PERSONA_MATCHING_SYSTEM.md';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;

