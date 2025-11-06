-- ============================================================
-- V3.1 任务分解 Prompt 优化
-- 目标: 要求 AI 生成简短任务（每条不超过40字）
-- 创建日期: 2025-11-05
-- ============================================================

-- 更新所有任务分解阶段的 Prompt，添加"每条任务不超过40字"的约束

UPDATE ai_prompt_library
SET 
  system_prompt = REPLACE(
    system_prompt,
    '你需要将用户的目标分解为 3-5 个具体的、可执行的任务步骤。',
    '你需要将用户的目标分解为 3-5 个具体的、可执行的任务步骤。

⚠️ 重要约束：
- **每条任务不超过40个字**（含标点符号）
- 使用简洁、清晰的表达
- 去除冗余的修饰词和从句
- 直接说明要做什么，不要过度解释'
  ),
  user_prompt = CASE 
    WHEN user_prompt LIKE '%请生成%' 
    THEN user_prompt || '

⚠️ 每条任务不超过40字，要简洁清晰。'
    ELSE user_prompt
  END
WHERE stage = 'task-decomposition';

-- 如果 system_prompt 中没有这段文字（即 Prompt 格式不同），则直接追加约束
UPDATE ai_prompt_library
SET 
  system_prompt = system_prompt || '

⚠️ 重要约束：
- **每条任务不超过40个字**（含标点符号）
- 使用简洁、清晰的表达
- 去除冗余的修饰词和从句
- 直接说明要做什么，不要过度解释'
WHERE 
  stage = 'task-decomposition'
  AND system_prompt NOT LIKE '%每条任务不超过40个字%';

-- 验证更新
SELECT 
  goal_type, 
  difficulty, 
  language,
  CASE 
    WHEN system_prompt LIKE '%每条任务不超过40个字%' THEN '✅ 已添加40字约束'
    ELSE '❌ 未添加约束'
  END as status
FROM ai_prompt_library 
WHERE stage = 'task-decomposition'
ORDER BY goal_type, difficulty;

