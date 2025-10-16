-- DaysFromToday V3.0 数据库初始化
-- Phase 2: 用户认证与卡片管理
-- 创建时间: 2025-10-16

-- ==================== 用户表 ====================
-- 说明: 扩展 Supabase Auth 的用户信息
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'zh')),
  
  -- 统计信息
  total_cards INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS 策略: 用户只能查看和修改自己的数据
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==================== 目标卡片表 ====================
-- 说明: 存储用户创建的目标卡片
CREATE TABLE IF NOT EXISTS public.goal_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- 卡片内容
  template_id TEXT NOT NULL,
  goal_text TEXT NOT NULL CHECK (char_length(goal_text) <= 200),
  target_date TIMESTAMPTZ NOT NULL,
  days_count INTEGER NOT NULL,
  user_name TEXT,
  custom_emoji TEXT,
  
  -- 自定义背景
  custom_background_url TEXT,
  custom_background_id TEXT,
  
  -- 样式覆盖 (JSON)
  style_overrides JSONB,
  
  -- 分享信息
  is_public BOOLEAN DEFAULT FALSE,
  short_url TEXT UNIQUE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.goal_cards ENABLE ROW LEVEL SECURITY;

-- RLS 策略: 用户可以查看自己的卡片和公开的卡片
CREATE POLICY "Users can view own cards" ON public.goal_cards
  FOR SELECT USING (
    auth.uid() = user_id OR is_public = TRUE
  );

CREATE POLICY "Users can insert own cards" ON public.goal_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards" ON public.goal_cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards" ON public.goal_cards
  FOR DELETE USING (auth.uid() = user_id);

-- 自动更新 updated_at
CREATE TRIGGER update_goal_cards_updated_at
  BEFORE UPDATE ON public.goal_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 索引优化
CREATE INDEX idx_goal_cards_user_id ON public.goal_cards(user_id);
CREATE INDEX idx_goal_cards_is_public ON public.goal_cards(is_public);
CREATE INDEX idx_goal_cards_short_url ON public.goal_cards(short_url);
CREATE INDEX idx_goal_cards_created_at ON public.goal_cards(created_at DESC);

-- ==================== 卡片点赞表 ====================
-- 说明: 记录用户对公开卡片的点赞
CREATE TABLE IF NOT EXISTS public.card_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES public.goal_cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 唯一约束: 同一用户只能点赞一次
  UNIQUE(card_id, user_id)
);

-- 启用 RLS
ALTER TABLE public.card_likes ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Anyone can view likes" ON public.card_likes
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert own likes" ON public.card_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON public.card_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 索引
CREATE INDEX idx_card_likes_card_id ON public.card_likes(card_id);
CREATE INDEX idx_card_likes_user_id ON public.card_likes(user_id);

-- ==================== 卡片评论表 (未来扩展) ====================
-- 说明: 预留评论功能的表结构
CREATE TABLE IF NOT EXISTS public.card_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES public.goal_cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.card_comments ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Anyone can view comments" ON public.card_comments
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert own comments" ON public.card_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.card_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.card_comments
  FOR DELETE USING (auth.uid() = user_id);

-- 自动更新 updated_at
CREATE TRIGGER update_card_comments_updated_at
  BEFORE UPDATE ON public.card_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 索引
CREATE INDEX idx_card_comments_card_id ON public.card_comments(card_id);
CREATE INDEX idx_card_comments_user_id ON public.card_comments(user_id);
CREATE INDEX idx_card_comments_created_at ON public.card_comments(created_at DESC);

-- ==================== 用户自定义模板表 (未来扩展) ====================
-- 说明: 允许用户创建和保存自己的卡片模板
CREATE TABLE IF NOT EXISTS public.custom_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  template_config JSONB NOT NULL,
  thumbnail_url TEXT,
  
  is_public BOOLEAN DEFAULT FALSE,
  use_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Users can view own templates and public templates" ON public.custom_templates
  FOR SELECT USING (
    auth.uid() = user_id OR is_public = TRUE
  );

CREATE POLICY "Users can insert own templates" ON public.custom_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON public.custom_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON public.custom_templates
  FOR DELETE USING (auth.uid() = user_id);

-- 自动更新 updated_at
CREATE TRIGGER update_custom_templates_updated_at
  BEFORE UPDATE ON public.custom_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 索引
CREATE INDEX idx_custom_templates_user_id ON public.custom_templates(user_id);
CREATE INDEX idx_custom_templates_is_public ON public.custom_templates(is_public);

-- ==================== 函数: 自动创建用户记录 ====================
-- 说明: 当新用户注册时，自动在 public.users 表中创建记录
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 触发器: 在 auth.users 插入新用户时触发
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==================== 函数: 更新卡片统计 ====================
-- 说明: 当用户创建/删除卡片时，自动更新 users.total_cards
CREATE OR REPLACE FUNCTION public.update_user_card_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.users
    SET total_cards = total_cards + 1
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.users
    SET total_cards = total_cards - 1
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_card_count_trigger
  AFTER INSERT OR DELETE ON public.goal_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_card_count();

-- ==================== 函数: 更新卡片点赞数 ====================
-- 说明: 当点赞时，自动更新 goal_cards.like_count
CREATE OR REPLACE FUNCTION public.update_card_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.goal_cards
    SET like_count = like_count + 1
    WHERE id = NEW.card_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.goal_cards
    SET like_count = like_count - 1
    WHERE id = OLD.card_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_card_like_count_trigger
  AFTER INSERT OR DELETE ON public.card_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_card_like_count();

-- ==================== 完成 ====================
-- 数据库初始化完成
-- 下一步: 在 Supabase Dashboard 中运行此 SQL

