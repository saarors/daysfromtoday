-- =========================================
-- Phase 3 数据库完全重建脚本
-- 版本: V3.0-Phase3
-- 日期: 2025-10-31
-- 说明: 清空所有旧表，重建全新数据库结构
-- 
-- ⚠️ 警告：此脚本会删除所有历史数据！
-- 适用场景：Phase 3 全新开始，不保留任何历史数据
-- =========================================

-- =========================================
-- 步骤 1: 删除所有旧表和函数
-- =========================================
DROP TABLE IF EXISTS goal_cards CASCADE;
DROP TABLE IF EXISTS ai_prompt_templates CASCADE;
DROP TABLE IF EXISTS ai_api_logs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 删除旧的触发器函数（如果存在）
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
-- 步骤 3: 创建 goal_cards 表
-- =========================================
CREATE TABLE goal_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- 目标内容
  goal_text TEXT NOT NULL,
  goal_type VARCHAR(50) NOT NULL DEFAULT 'general',
  target_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  card_type VARCHAR(20) DEFAULT 'future',
  
  -- AI 信息
  ai_assistant VARCHAR(20) NOT NULL,
  ai_analysis TEXT,
  ai_summary TEXT,
  ai_model_used VARCHAR(50) DEFAULT 'deepseek',
  input_language VARCHAR(10) NOT NULL,
  
  -- 进度管理
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  
  -- 元数据
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- goal_cards 索引
CREATE INDEX idx_user_cards ON goal_cards(user_id, created_at DESC);
CREATE INDEX idx_goal_type ON goal_cards(goal_type, created_at DESC);
CREATE INDEX idx_public_cards ON goal_cards(is_public, created_at DESC) WHERE is_public = true;
CREATE INDEX idx_card_type ON goal_cards(card_type, created_at DESC);

-- goal_cards 注释
COMMENT ON TABLE goal_cards IS 'V3.0 用户目标卡片表';
COMMENT ON COLUMN goal_cards.goal_type IS '目标类型，Phase 3 暂时只用 general';
COMMENT ON COLUMN goal_cards.ai_analysis IS 'AI 完整分析（Markdown 格式）';
COMMENT ON COLUMN goal_cards.ai_summary IS 'AI 简短建议（显示在卡片上）';
COMMENT ON COLUMN goal_cards.is_public IS '是否在首页"故事发现"展示';

-- =========================================
-- 步骤 4: 创建 ai_prompt_templates 表
-- =========================================
CREATE TABLE ai_prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 提示词分类
  assistant_type VARCHAR(20) NOT NULL,
  goal_type VARCHAR(50) NOT NULL DEFAULT 'general',
  stage VARCHAR(30) NOT NULL,
  output_language VARCHAR(10) NOT NULL,
  
  -- 提示词内容
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  
  -- 元数据
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (assistant_type, goal_type, stage, output_language, version)
);

-- ai_prompt_templates 索引
CREATE INDEX idx_prompt_lookup ON ai_prompt_templates(
  assistant_type, goal_type, stage, output_language
) WHERE is_active = true;

-- ai_prompt_templates 注释
COMMENT ON TABLE ai_prompt_templates IS 'AI 提示词模板库';
COMMENT ON COLUMN ai_prompt_templates.stage IS '目标阶段：start(刚开始), in_progress(进行中), near_end(即将完成)';
COMMENT ON COLUMN ai_prompt_templates.system_prompt IS 'System Prompt（定义 AI 角色）';
COMMENT ON COLUMN ai_prompt_templates.user_prompt_template IS 'User Prompt 模板（支持变量替换）';

-- =========================================
-- 步骤 5: 创建 ai_api_logs 表
-- =========================================
CREATE TABLE ai_api_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES goal_cards(id) ON DELETE SET NULL,
  
  -- API 调用信息
  model VARCHAR(50) NOT NULL,
  assistant_type VARCHAR(20),
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_cost DECIMAL(10, 6),
  response_time_ms INTEGER,
  
  -- 状态
  status VARCHAR(20) DEFAULT 'success',
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ai_api_logs 索引
CREATE INDEX idx_user_logs ON ai_api_logs(user_id, created_at DESC);
CREATE INDEX idx_cost_analysis ON ai_api_logs(created_at DESC, total_cost);
CREATE INDEX idx_model_stats ON ai_api_logs(model, status, created_at DESC);

-- ai_api_logs 注释
COMMENT ON TABLE ai_api_logs IS 'AI API 调用日志（用于成本分析和监控）';
COMMENT ON COLUMN ai_api_logs.total_cost IS '单次调用成本（人民币元）';

-- =========================================
-- 步骤 6: 创建 profiles 表
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 配额管理
  goal_cards_limit INTEGER DEFAULT 3 CHECK (goal_cards_limit >= 0),
  goal_cards_count INTEGER DEFAULT 0 CHECK (goal_cards_count >= 0),
  subscription_tier VARCHAR(20) DEFAULT 'free',
  
  -- 用户偏好
  preferred_language VARCHAR(10) DEFAULT 'zh',
  preferred_assistant VARCHAR(20) DEFAULT 'twinkle',
  
  -- 订阅信息
  subscription_expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- profiles 索引
CREATE INDEX idx_subscription ON public.profiles(subscription_tier, subscription_expires_at);

-- profiles 注释
COMMENT ON TABLE public.profiles IS '用户配置和配额管理表';
COMMENT ON COLUMN public.profiles.goal_cards_limit IS '最大目标卡片数量（Free: 3, Pro: 9999）';
COMMENT ON COLUMN public.profiles.goal_cards_count IS '当前已创建卡片数量';

-- =========================================
-- 步骤 7: 创建触发器函数
-- =========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- goal_cards 触发器
CREATE TRIGGER update_goal_cards_updated_at
BEFORE UPDATE ON goal_cards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- profiles 触发器
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ai_prompt_templates 触发器
CREATE TRIGGER update_prompts_updated_at
BEFORE UPDATE ON ai_prompt_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 步骤 8: 创建 RPC 函数（配额管理）
-- =========================================

-- 8.1 增加配额
CREATE OR REPLACE FUNCTION increment_goal_cards_count(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- 如果用户 profile 不存在，先创建
  INSERT INTO public.profiles (id)
  VALUES (p_user_id)
  ON CONFLICT (id) DO NOTHING;
  
  -- 增加计数
  UPDATE public.profiles
  SET 
    goal_cards_count = goal_cards_count + 1,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8.2 减少配额
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

-- 8.3 检查配额
CREATE OR REPLACE FUNCTION check_goal_cards_quota(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_limit INTEGER;
BEGIN
  -- 如果用户 profile 不存在，先创建
  INSERT INTO public.profiles (id)
  VALUES (p_user_id)
  ON CONFLICT (id) DO NOTHING;
  
  -- 查询配额
  SELECT goal_cards_count, goal_cards_limit
  INTO current_count, max_limit
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- 返回是否还有配额
  RETURN current_count < max_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8.4 获取用户配额信息
CREATE OR REPLACE FUNCTION get_user_quota(p_user_id UUID)
RETURNS TABLE(
  current_count INTEGER,
  max_limit INTEGER,
  remaining INTEGER,
  subscription_tier VARCHAR
) AS $$
BEGIN
  -- 如果用户 profile 不存在，先创建
  INSERT INTO public.profiles (id)
  VALUES (p_user_id)
  ON CONFLICT (id) DO NOTHING;
  
  -- 返回配额信息
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
-- 步骤 9: 启用 Row Level Security (RLS)
-- =========================================

-- 启用 RLS
ALTER TABLE goal_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_api_logs ENABLE ROW LEVEL SECURITY;
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

-- ai_prompt_templates 策略（所有人可读）
CREATE POLICY "所有人可以查看活跃的提示词"
  ON ai_prompt_templates FOR SELECT
  USING (is_active = true);

-- =========================================
-- 完成提示
-- =========================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Phase 3 数据库重建完成！';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 已创建表：';
  RAISE NOTICE '   • goal_cards (用户目标卡片)';
  RAISE NOTICE '   • ai_prompt_templates (AI 提示词库)';
  RAISE NOTICE '   • ai_api_logs (API 调用日志)';
  RAISE NOTICE '   • profiles (用户配置和配额)';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 已创建 RPC 函数：';
  RAISE NOTICE '   • increment_goal_cards_count (增加配额)';
  RAISE NOTICE '   • decrement_goal_cards_count (减少配额)';
  RAISE NOTICE '   • check_goal_cards_quota (检查配额)';
  RAISE NOTICE '   • get_user_quota (获取配额信息)';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 已启用 Row Level Security (RLS)';
  RAISE NOTICE '';
  RAISE NOTICE '📝 下一步：运行提示词初始化脚本';
  RAISE NOTICE '   npx tsx scripts/seed-prompts.ts';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;

