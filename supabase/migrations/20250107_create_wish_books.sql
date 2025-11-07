-- =====================================================
-- V3.4 Wish Books 数据库迁移
-- 创建日期: 2025-01-07
-- 描述: 创建愿望宝典（Wish Books）相关表结构
-- =====================================================

-- 启用 UUID 扩展（如果尚未启用）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 主表: wish_books
-- =====================================================
CREATE TABLE IF NOT EXISTS wish_books (
  -- 基础信息
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 标题与 URL
  title TEXT NOT NULL,
  subtitle TEXT,
  slug VARCHAR(200) UNIQUE NOT NULL,
  
  -- 核心维度
  time_dimension VARCHAR(20) NOT NULL,        -- '7-days', '30-days', '90-days', '100-days', '180-days', '365-days', '3-years', '5-years'
  duration_days INTEGER NOT NULL,             -- 实际天数
  category VARCHAR(50) NOT NULL,              -- 'fitness', 'learning', 'career', 'personal_growth', 'relationships', 'creative', 'lifestyle', 'mental_health'
  subcategory VARCHAR(100),                   -- 子类别，如 'marathon', 'guitar'
  
  -- 目标元数据
  goal_type VARCHAR(30),                      -- 'challenge', 'habit', 'project', 'milestone'
  difficulty VARCHAR(20),                     -- 'easy', 'medium', 'hard', 'expert'
  target_audience TEXT[],                     -- 目标受众数组
  
  -- 内容（富文本）
  story_intro TEXT,                           -- 故事引入（HTML 或 Markdown）
  content_html TEXT,                          -- 主要内容（HTML）
  content_json JSONB,                         -- Tiptap JSON 格式（原始数据）
  
  -- 结构化内容
  roadmap JSONB,                              -- 路线图
  /*
    示例结构：
    {
      "phases": [
        {
          "phase": 1,
          "name": "基础训练",
          "duration": "第1-4周",
          "goals": ["建立跑步习惯", "提升基础耐力"],
          "milestones": ["连续跑步30分钟", "周跑量达到20公里"]
        }
      ]
    }
  */
  
  real_cases JSONB,                           -- 真实案例
  /*
    示例结构：
    [
      {
        "title": "从沙发到5公里",
        "source": "内部案例",
        "summary": "...",
        "link": "https://..."
      }
    ]
  */
  
  ai_suggestions JSONB,                       -- AI 建议（V3.2 助手集成）
  resources JSONB,                            -- 资源清单
  faqs JSONB,                                 -- FAQ
  related_goals TEXT[],                       -- 相关目标（slug 数组）
  
  -- 图片与媒体
  cover_image_url TEXT,                       -- 封面图
  hero_image_url TEXT,                        -- 详情页头图
  og_image_url TEXT,                          -- OG 分享图
  media_urls JSONB,                           -- 其他图片/视频 URL
  
  -- SEO 元数据
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  
  -- 统计数据
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  -- 状态管理
  status VARCHAR(20) DEFAULT 'draft',         -- 'draft', 'published', 'archived'
  content_source VARCHAR(20) DEFAULT 'manual', -- 'manual', 'ai_generated', 'ugc'
  quality_score FLOAT DEFAULT 0,              -- 0-100
  
  -- 多语言
  locale VARCHAR(10) DEFAULT 'zh',
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  
  -- 作者
  author_id UUID REFERENCES auth.users(id),
  
  -- 约束
  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  CONSTRAINT valid_time_dimension CHECK (time_dimension IN ('7-days', '30-days', '90-days', '100-days', '180-days', '365-days', '3-years', '5-years'))
);

-- =====================================================
-- 索引优化
-- =====================================================

-- 基础索引
CREATE INDEX IF NOT EXISTS idx_wish_books_slug ON wish_books(slug);
CREATE INDEX IF NOT EXISTS idx_wish_books_status ON wish_books(status);
CREATE INDEX IF NOT EXISTS idx_wish_books_locale ON wish_books(locale);

-- 维度索引
CREATE INDEX IF NOT EXISTS idx_wish_books_time_dimension ON wish_books(time_dimension);
CREATE INDEX IF NOT EXISTS idx_wish_books_category ON wish_books(category);
CREATE INDEX IF NOT EXISTS idx_wish_books_difficulty ON wish_books(difficulty);

-- 组合索引（常用查询）
CREATE INDEX IF NOT EXISTS idx_wish_books_status_locale ON wish_books(status, locale);
CREATE INDEX IF NOT EXISTS idx_wish_books_category_time ON wish_books(category, time_dimension);

-- 发布时间索引（用于排序）
CREATE INDEX IF NOT EXISTS idx_wish_books_published 
  ON wish_books(published_at DESC) 
  WHERE status = 'published';

-- 质量分数索引（用于排序）
CREATE INDEX IF NOT EXISTS idx_wish_books_quality 
  ON wish_books(quality_score DESC) 
  WHERE status = 'published';

-- 全文搜索索引
CREATE INDEX IF NOT EXISTS idx_wish_books_search 
  ON wish_books 
  USING GIN(to_tsvector('english', title || ' ' || COALESCE(subtitle, '')));

-- =====================================================
-- 辅助表: wish_tags
-- =====================================================
CREATE TABLE IF NOT EXISTS wish_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wish_book_id UUID REFERENCES wish_books(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(wish_book_id, tag)
);

-- 标签索引
CREATE INDEX IF NOT EXISTS idx_wish_tags_book_id ON wish_tags(wish_book_id);
CREATE INDEX IF NOT EXISTS idx_wish_tags_tag ON wish_tags(tag);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- 启用 RLS
ALTER TABLE wish_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_tags ENABLE ROW LEVEL SECURITY;

-- RLS 策略 - wish_books

-- 公开读取已发布的内容
CREATE POLICY "Public can read published wish books"
  ON wish_books FOR SELECT
  USING (status = 'published');

-- 认证用户可以读取所有内容（用于管理后台）
CREATE POLICY "Authenticated users can read all wish books"
  ON wish_books FOR SELECT
  USING (auth.role() = 'authenticated');

-- 认证用户可以创建
CREATE POLICY "Authenticated users can insert wish books"
  ON wish_books FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 认证用户可以更新自己创建的或所有内容（根据需要调整）
CREATE POLICY "Authenticated users can update wish books"
  ON wish_books FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 认证用户可以删除自己创建的或所有内容（根据需要调整）
CREATE POLICY "Authenticated users can delete wish books"
  ON wish_books FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS 策略 - wish_tags

-- 公开读取标签
CREATE POLICY "Public can read tags"
  ON wish_tags FOR SELECT
  USING (true);

-- 认证用户可以管理标签
CREATE POLICY "Authenticated users can manage tags"
  ON wish_tags FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 触发器：自动更新 updated_at
-- =====================================================

-- 创建更新时间戳函数（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS update_wish_books_updated_at ON wish_books;
CREATE TRIGGER update_wish_books_updated_at
  BEFORE UPDATE ON wish_books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 注释说明
-- =====================================================

COMMENT ON TABLE wish_books IS 'V3.4 愿望宝典主表 - 存储目标百科的所有内容';
COMMENT ON COLUMN wish_books.time_dimension IS '时间维度：7-days, 30-days, 90-days, 100-days, 180-days, 365-days, 3-years, 5-years';
COMMENT ON COLUMN wish_books.category IS '类别：fitness, learning, career, personal_growth, relationships, creative, lifestyle, mental_health';
COMMENT ON COLUMN wish_books.difficulty IS '难度：easy, medium, hard, expert';
COMMENT ON COLUMN wish_books.status IS '状态：draft(草稿), published(已发布), archived(已归档)';
COMMENT ON COLUMN wish_books.content_source IS '内容来源：manual(手动), ai_generated(AI生成), ugc(用户投稿)';
COMMENT ON COLUMN wish_books.quality_score IS '质量分数：0-100，用于排序和推荐';

-- =====================================================
-- 完成
-- =====================================================

-- 输出成功信息
DO $$
BEGIN
  RAISE NOTICE '✅ V3.4 Wish Books 数据库迁移完成！';
  RAISE NOTICE '📊 已创建表：wish_books, wish_tags';
  RAISE NOTICE '🔒 已启用 Row Level Security';
  RAISE NOTICE '📈 已创建索引和触发器';
END $$;

