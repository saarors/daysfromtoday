-- ========================================================================
-- V3.1 AI Intelligence Upgrade - Database Schema (Fixed)
-- ========================================================================
-- 创建日期: 2025-11-04
-- 修复日期: 2025-11-04
-- 修复内容: 调整表创建顺序，先创建 methodology_library，再创建引用它的表
-- 目的: 支持动态 Prompt 管理、方法论库、任务分解模板
-- 影响: 新增 4 个表，不影响现有表
-- ========================================================================

-- ========================================================================
-- 表 1: methodology_library (方法论库) - 必须先创建，因为其他表引用它
-- ========================================================================
-- 用途: 存储专业的目标达成方法论（如 SMART、费曼学习法等）
-- 核心功能: 根据 goal_type + difficulty 自动匹配最佳方法论
-- ========================================================================

CREATE TABLE IF NOT EXISTS methodology_library (
  -- ==================== 主键 ====================
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ==================== 方法论基本信息 ====================
  code VARCHAR(50) UNIQUE NOT NULL,         -- 唯一标识: 'progressive-overload', 'feynman-technique'
  name_zh VARCHAR(100) NOT NULL,            -- 中文名称
  name_en VARCHAR(100) NOT NULL,            -- 英文名称
  
  -- ==================== 方法论内容 ====================
  description_zh TEXT NOT NULL,             -- 中文描述
  description_en TEXT NOT NULL,             -- 英文描述
  principles JSONB NOT NULL,                -- 核心原则: ["原则1", "原则2", "原则3"]
  steps JSONB,                              -- 实施步骤 (可选)
  
  -- ==================== 适用场景 ====================
  applicable_goal_types TEXT[] NOT NULL,    -- 适用的目标类型数组: {'fitness', 'health'}
  min_difficulty_level INTEGER DEFAULT 1,   -- 最低难度等级 (1=easy, 2=medium, 3=hard, 4=expert)
  max_difficulty_level INTEGER DEFAULT 4,   -- 最高难度等级
  
  -- ==================== Prompt 注入内容 ====================
  -- 这部分内容会被注入到 AI 的 system_prompt 中
  prompt_injection_zh TEXT NOT NULL,        -- 中文 Prompt 片段
  prompt_injection_en TEXT NOT NULL,        -- 英文 Prompt 片段
  
  -- ==================== 优先级和状态 ====================
  priority INTEGER DEFAULT 0,               -- 优先级 (数值越高越优先)
  is_active BOOLEAN DEFAULT true,           -- 是否启用
  
  -- ==================== 效果数据 ====================
  usage_count INTEGER DEFAULT 0,            -- 使用次数
  avg_satisfaction DECIMAL(3,2),            -- 平均满意度 (1.0-5.0)
  success_rate DECIMAL(5,2),                -- 成功率 (0-100%)
  
  -- ==================== 元数据 ====================
  source VARCHAR(200),                      -- 来源/参考资料
  author VARCHAR(100),                      -- 作者
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  tags TEXT[],                              -- 标签: {'beginner-friendly', 'evidence-based'}
  
  -- ==================== 约束 ====================
  CONSTRAINT valid_difficulty_range CHECK (min_difficulty_level <= max_difficulty_level),
  CONSTRAINT valid_difficulty_values CHECK (
    min_difficulty_level BETWEEN 1 AND 4 AND 
    max_difficulty_level BETWEEN 1 AND 4
  )
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_methodology_goal_type 
  ON methodology_library USING GIN(applicable_goal_types);

CREATE INDEX IF NOT EXISTS idx_methodology_difficulty 
  ON methodology_library(min_difficulty_level, max_difficulty_level, priority DESC);

CREATE INDEX IF NOT EXISTS idx_methodology_code 
  ON methodology_library(code, is_active);

-- 添加注释
COMMENT ON TABLE methodology_library IS 'V3.1: 专业方法论库（如 SMART、费曼学习法等）';
COMMENT ON COLUMN methodology_library.code IS '唯一标识，用于代码中引用';
COMMENT ON COLUMN methodology_library.applicable_goal_types IS 'PostgreSQL 数组类型，支持多个目标类型';
COMMENT ON COLUMN methodology_library.prompt_injection_zh IS '注入到 AI Prompt 的方法论指导内容';

-- ========================================================================
-- 表 2: ai_prompt_library (Prompt 模板库)
-- ========================================================================
-- 用途: 存储所有 AI Prompt 模板，支持多维度查询和版本管理
-- 核心功能: 根据 goal_type + difficulty + language + stage 匹配 Prompt
-- ========================================================================

CREATE TABLE IF NOT EXISTS ai_prompt_library (
  -- ==================== 主键 ====================
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ==================== 分类维度 ====================
  goal_type VARCHAR(50) NOT NULL,           -- 目标类型: 'fitness', 'learning', 'habit', 'general'
  difficulty VARCHAR(20) NOT NULL,          -- 难度: 'easy', 'medium', 'hard', 'expert', 'any'
  language VARCHAR(10) NOT NULL DEFAULT 'zh', -- 语言: 'zh', 'en'
  stage VARCHAR(50) NOT NULL,               -- 阶段: 'intro', 'analysis', 'task-decomposition'
  
  -- ==================== Prompt 内容 ====================
  system_prompt TEXT NOT NULL,              -- 系统提示词（给 AI 的角色和规则）
  user_prompt TEXT,                         -- 用户提示词模板（可包含变量）
  
  -- ==================== 模板变量说明 ====================
  -- 支持的变量格式: {goalText}, {days}, {targetDate}, {methodology}
  -- 例如: "目标：{goalText}\n时间跨度：{days} 天"
  variables JSONB DEFAULT '{}',             -- 变量说明: {"goalText": "用户目标", "days": "天数"}
  
  -- ==================== AI 参数配置 ====================
  temperature DECIMAL(3,2) DEFAULT 0.7,     -- 推荐温度 (0.0-1.0)
  max_tokens INTEGER DEFAULT 2000,          -- 推荐 token 数
  
  -- ==================== 方法论关联 ====================
  methodology_id UUID REFERENCES methodology_library(id) ON DELETE SET NULL,
  
  -- ==================== 版本管理 ====================
  version VARCHAR(20) DEFAULT 'v1.0',       -- 版本号
  is_active BOOLEAN DEFAULT true,           -- 是否启用
  
  -- ==================== 效果追踪 ====================
  usage_count INTEGER DEFAULT 0,            -- 使用次数
  avg_quality_score DECIMAL(3,2),           -- 平均质量评分 (1.0-5.0)
  last_used_at TIMESTAMP,                   -- 最后使用时间
  
  -- ==================== 元数据 ====================
  created_by VARCHAR(100) DEFAULT 'system',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,                               -- 备注说明
  
  -- ==================== 唯一约束 ====================
  CONSTRAINT unique_prompt_key UNIQUE (goal_type, difficulty, language, stage, version)
);

-- 创建索引（优化查询性能）
CREATE INDEX IF NOT EXISTS idx_prompt_lookup 
  ON ai_prompt_library(goal_type, difficulty, language, stage, is_active);

CREATE INDEX IF NOT EXISTS idx_prompt_version 
  ON ai_prompt_library(version, is_active);

CREATE INDEX IF NOT EXISTS idx_prompt_usage 
  ON ai_prompt_library(usage_count DESC, avg_quality_score DESC);

-- 添加注释
COMMENT ON TABLE ai_prompt_library IS 'V3.1: AI Prompt 模板库，支持多维度匹配和版本管理';
COMMENT ON COLUMN ai_prompt_library.goal_type IS '目标类型: fitness, learning, habit, project, skill 等';
COMMENT ON COLUMN ai_prompt_library.stage IS '阶段: intro(介绍), analysis(分析), task-decomposition(任务分解)';
COMMENT ON COLUMN ai_prompt_library.variables IS 'JSON 格式的变量说明，用于替换 Prompt 中的占位符';

-- ========================================================================
-- 表 3: task_decomposition_templates (任务分解模板 - 可选加速)
-- ========================================================================
-- 用途: 存储预定义的任务分解模板，用于快速响应或 AI 失败时降级
-- 核心功能: 当 AI 生成失败时，提供可靠的备选任务列表
-- ========================================================================

CREATE TABLE IF NOT EXISTS task_decomposition_templates (
  -- ==================== 主键 ====================
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ==================== 分类维度 ====================
  goal_type VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'zh',
  
  -- ==================== 模板内容 ====================
  tasks JSONB NOT NULL,                     -- 任务列表: ["任务1", "任务2", "任务3"]
  
  -- ==================== 变量替换规则 (可选) ====================
  -- 用于根据用户输入动态调整任务描述
  variable_mappings JSONB,                  -- {"days": "替换规则", "goalText": "替换规则"}
  
  -- ==================== 方法论关联 ====================
  methodology_id UUID REFERENCES methodology_library(id) ON DELETE SET NULL,
  
  -- ==================== 使用统计 ====================
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- ==================== 元数据 ====================
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- ==================== 唯一约束 ====================
  CONSTRAINT unique_task_template UNIQUE (goal_type, difficulty, language)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_task_template_lookup 
  ON task_decomposition_templates(goal_type, difficulty, language, is_active);

-- 添加注释
COMMENT ON TABLE task_decomposition_templates IS 'V3.1: 任务分解模板，用于快速响应或降级';
COMMENT ON COLUMN task_decomposition_templates.tasks IS 'JSON 数组格式的任务列表';

-- ========================================================================
-- 表 4: prompt_usage_logs (Prompt 使用日志 - 可选，用于运营分析)
-- ========================================================================
-- 用途: 记录每次 Prompt 使用情况，支持 A/B 测试和效果分析
-- ========================================================================

CREATE TABLE IF NOT EXISTS prompt_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ==================== 关联信息 ====================
  prompt_id UUID REFERENCES ai_prompt_library(id) ON DELETE CASCADE,
  methodology_id UUID REFERENCES methodology_library(id) ON DELETE SET NULL,
  goal_card_id UUID,                        -- 关联的目标卡片（如有）
  
  -- ==================== 使用上下文 ====================
  goal_type VARCHAR(50),
  difficulty VARCHAR(20),
  language VARCHAR(10),
  stage VARCHAR(50),
  
  -- ==================== AI 响应信息 ====================
  response_time_ms INTEGER,                 -- 响应时间（毫秒）
  tokens_used INTEGER,                      -- 消耗的 token 数
  model_version VARCHAR(50),                -- AI 模型版本
  
  -- ==================== 质量评估 ====================
  quality_score DECIMAL(3,2),               -- 质量评分 (1.0-5.0)
  user_feedback TEXT,                       -- 用户反馈
  is_successful BOOLEAN,                    -- 是否成功生成
  
  -- ==================== 时间戳 ====================
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- ==================== 额外信息 ====================
  metadata JSONB                            -- 其他元数据
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_usage_logs_prompt 
  ON prompt_usage_logs(prompt_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_usage_logs_time 
  ON prompt_usage_logs(created_at DESC);

-- 添加注释
COMMENT ON TABLE prompt_usage_logs IS 'V3.1: Prompt 使用日志，用于效果分析和 A/B 测试';

-- ========================================================================
-- 触发器: 自动更新 updated_at 字段
-- ========================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为相关表添加触发器
CREATE TRIGGER update_ai_prompt_library_updated_at
  BEFORE UPDATE ON ai_prompt_library
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_methodology_library_updated_at
  BEFORE UPDATE ON methodology_library
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_decomposition_templates_updated_at
  BEFORE UPDATE ON task_decomposition_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================================================
-- RLS (Row Level Security) 策略 - 可选
-- ========================================================================
-- 如果需要后台管理功能，可以设置 RLS 策略控制访问权限
-- 当前阶段：所有表对认证用户可读，仅管理员可写

-- 启用 RLS（暂时注释，V3.2 再启用）
-- ALTER TABLE ai_prompt_library ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE methodology_library ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE task_decomposition_templates ENABLE ROW LEVEL SECURITY;

-- 创建读取策略（所有认证用户）
-- CREATE POLICY "Allow authenticated users to read prompts"
--   ON ai_prompt_library FOR SELECT
--   TO authenticated
--   USING (true);

-- ========================================================================
-- 完成
-- ========================================================================

-- 验证表是否创建成功
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'V3.1 数据库表创建完成！';
  RAISE NOTICE '========================================';
  RAISE NOTICE '已创建的表（按依赖顺序）:';
  RAISE NOTICE '  1. methodology_library (方法论库) - 基础表';
  RAISE NOTICE '  2. ai_prompt_library (Prompt 模板库)';
  RAISE NOTICE '  3. task_decomposition_templates (任务分解模板)';
  RAISE NOTICE '  4. prompt_usage_logs (使用日志)';
  RAISE NOTICE '';
  RAISE NOTICE '下一步: 填充种子数据';
  RAISE NOTICE '========================================';
END $$;

