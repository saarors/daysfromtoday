-- Phase 2.6 数据库迁移脚本
-- 新增字段支持卡片类型、计算模式和工作日

-- 添加 card_type 字段（future/past）
ALTER TABLE goal_cards ADD COLUMN IF NOT EXISTS card_type TEXT DEFAULT 'future';

-- 添加 calculation_mode 字段（date-first/days-first）
ALTER TABLE goal_cards ADD COLUMN IF NOT EXISTS calculation_mode TEXT DEFAULT 'date-first';

-- 添加 days_type 字段（natural/working）
ALTER TABLE goal_cards ADD COLUMN IF NOT EXISTS days_type TEXT DEFAULT 'natural';

-- 添加 working_days_count 字段（工作日天数）
ALTER TABLE goal_cards ADD COLUMN IF NOT EXISTS working_days_count INTEGER;

-- 添加注释
COMMENT ON COLUMN goal_cards.card_type IS '卡片类型：future=未来，past=过去';
COMMENT ON COLUMN goal_cards.calculation_mode IS '计算模式：date-first=日期优先，days-first=天数优先';
COMMENT ON COLUMN goal_cards.days_type IS '天数类型：natural=自然日，working=工作日';
COMMENT ON COLUMN goal_cards.working_days_count IS '工作日天数（仅当 days_type=working 时有值）';

