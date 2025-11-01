/**
 * 修复缺失的 persona 名字
 * 为扩展和变体人格补充名字
 */

-- 探索型 (Explorer) - Mentor 的扩展人格
UPDATE ai_personas 
SET persona_name_zh = '探寻', persona_name_en = 'Quest'
WHERE code = 'explorer' AND persona_name_zh IS NULL;

-- 习惯养成型 (Habit Builder) - Coach 的扩展人格
UPDATE ai_personas 
SET persona_name_zh = '习达', persona_name_en = 'Hardy'
WHERE code = 'habit_builder' AND persona_name_zh IS NULL;

-- 哲学型 (Philosopher) - Mentor 的扩展人格
UPDATE ai_personas 
SET persona_name_zh = '哲思', persona_name_en = 'Sophia'
WHERE code = 'philosopher' AND persona_name_zh IS NULL;

-- 执行型 (Taskmaster) - Coach 的变体人格
UPDATE ai_personas 
SET persona_name_zh = '行者', persona_name_en = 'Doer'
WHERE code = 'taskmaster' AND persona_name_zh IS NULL;

-- 验证所有 persona 都有名字
SELECT 
    code, 
    name_zh, 
    persona_name_zh,
    name_en,
    persona_name_en,
    persona_type
FROM ai_personas
WHERE is_active = true
ORDER BY persona_type, code;

-- 检查是否还有 NULL
SELECT code, name_zh, persona_type
FROM ai_personas
WHERE is_active = true 
  AND (persona_name_zh IS NULL OR persona_name_en IS NULL);

