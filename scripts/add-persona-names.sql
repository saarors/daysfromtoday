/**
 * 为 ai_personas 表添加具体人物名字字段
 * 执行时间：2025-11-01
 */

-- 添加人物名字字段
ALTER TABLE ai_personas
ADD COLUMN IF NOT EXISTS persona_name_zh VARCHAR(50),
ADD COLUMN IF NOT EXISTS persona_name_en VARCHAR(50);

-- 为现有的 AI persona 配置具体人名
-- 陪伴型 (Companion)
UPDATE ai_personas 
SET persona_name_zh = '小星', persona_name_en = 'Stella'
WHERE code = 'companion';

-- 教练型 (Coach)
UPDATE ai_personas 
SET persona_name_zh = '艾力', persona_name_en = 'Alex'
WHERE code = 'coach';

-- 分析型 (Analyst)
UPDATE ai_personas 
SET persona_name_zh = '思远', persona_name_en = 'Sage'
WHERE code = 'analyst';

-- 理财顾问型 (Advisor)
UPDATE ai_personas 
SET persona_name_zh = '明智', persona_name_en = 'Warren'
WHERE code = 'advisor';

-- 成长型 (Mentor)
UPDATE ai_personas 
SET persona_name_zh = '启明', persona_name_en = 'Mentor'
WHERE code = 'mentor';

-- 反思型 (Reflector)
UPDATE ai_personas 
SET persona_name_zh = '静思', persona_name_en = 'Iris'
WHERE code = 'reflector';

-- 疗愈型 (Therapist)
UPDATE ai_personas 
SET persona_name_zh = '心宁', persona_name_en = 'Luna'
WHERE code = 'therapist';

-- 突破型 (Challenger)
UPDATE ai_personas 
SET persona_name_zh = '破军', persona_name_en = 'Victor'
WHERE code = 'challenger';

-- 规划型 (Strategist)
UPDATE ai_personas 
SET persona_name_zh = '谋略', persona_name_en = 'Strategy'
WHERE code = 'strategist';

-- 纪律型 (Guardian)
UPDATE ai_personas 
SET persona_name_zh = '守则', persona_name_en = 'Guardian'
WHERE code = 'guardian';

-- 添加注释
COMMENT ON COLUMN ai_personas.persona_name_zh IS '中文人物名字（如：艾力、小星）';
COMMENT ON COLUMN ai_personas.persona_name_en IS '英文人物名字（如：Alex、Stella）';

-- 验证更新
SELECT code, name_zh, persona_name_zh, name_en, persona_name_en
FROM ai_personas
WHERE is_active = true
ORDER BY code;

