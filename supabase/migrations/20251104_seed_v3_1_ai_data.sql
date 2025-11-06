-- ========================================================================
-- V3.1 AI Intelligence Upgrade - Seed Data
-- ========================================================================
-- 创建日期: 2025-11-04
-- 目的: 填充初始方法论库和 Prompt 模板
-- 数据规模: 8 种方法论 + 50+ 条 Prompt 模板
-- ========================================================================

-- ========================================================================
-- 第一部分: 方法论库 (8 种专业方法论)
-- ========================================================================

-- 1. 渐进式超负荷 (Progressive Overload) - 健身专用
INSERT INTO methodology_library (
  code, name_zh, name_en,
  description_zh, description_en,
  principles,
  applicable_goal_types,
  min_difficulty_level, max_difficulty_level,
  prompt_injection_zh, prompt_injection_en,
  priority, source, tags
) VALUES (
  'progressive-overload',
  '渐进式超负荷',
  'Progressive Overload',
  
  '通过逐步增加训练强度（重量、次数、频率或难度），持续刺激肌肉适应和生长，是健身训练的核心原则',
  'Gradually increase training intensity to continuously stimulate muscle adaptation and growth',
  
  '["从当前能力基线出发，设定略高于现状的目标", "每周增加5-10%的训练量（重量×次数×组数）", "优先增加次数，再增加重量或难度", "确保充足恢复，避免过度训练", "定期测试进步，调整计划"]',
  
  '{"fitness", "health", "sport"}',
  
  2, 4,  -- 适用于 medium 到 expert 难度
  
  '请严格遵循**渐进式超负荷**方法论来制定训练计划：

**第1周: 基线测试**
- 测试当前最大能力（如最大俯卧撑数量、最大深蹲重量）
- 确定起始训练量为最大能力的 60-70%

**第2-3周: 适应期**
- 保持训练量稳定，专注于动作标准
- 建立训练习惯和肌肉记忆

**第4周起: 渐进增长**
- 每周增加 5-10% 的训练量
- 优先顺序: 次数 → 组数 → 重量/难度
- 示例: 10次×3组 → 12次×3组 → 12次×4组 → 10次×4组(增加难度)

**关键原则**:
1. 小步快跑，避免大幅跳跃
2. 关注恢复信号（疲劳、酸痛、睡眠）
3. 每4周安排一次减量周（恢复周）
4. 记录每次训练数据，量化进步

**训练计划格式**:
- 周1-2: [基线] 当前能力×70%
- 周3-4: [适应] +0% (巩固动作)
- 周5-6: [增长] +10%
- 周7-8: [增长] +10%
- 周9: [减量] -20% (恢复周)',

  'Follow the **Progressive Overload** methodology strictly:

**Week 1: Baseline Testing**
- Test current maximum capacity
- Set starting volume at 60-70% of maximum

**Week 2-3: Adaptation Phase**
- Maintain stable volume, focus on form
- Build training habit and muscle memory

**Week 4+: Progressive Growth**
- Increase training volume by 5-10% weekly
- Priority: Reps → Sets → Weight/Difficulty

**Key Principles**:
1. Small incremental steps
2. Monitor recovery signals
3. Deload week every 4 weeks
4. Track all training data',
  
  10,  -- 最高优先级
  '《运动生理学》- 肌肉适应理论',
  '{"evidence-based", "beginner-friendly", "fitness", "progressive"}'
);

-- 2. 费曼学习法 (Feynman Technique) - 学习专用
INSERT INTO methodology_library (
  code, name_zh, name_en,
  description_zh, description_en,
  principles,
  applicable_goal_types,
  min_difficulty_level, max_difficulty_level,
  prompt_injection_zh, prompt_injection_en,
  priority, source, tags
) VALUES (
  'feynman-technique',
  '费曼学习法',
  'Feynman Technique',
  
  '以"能够用简单语言向外行人讲清楚"为标准，通过教学输出来检验和深化理解，揭示知识盲区',
  'Learn by teaching: explain concepts in simple terms to identify knowledge gaps',
  
  '["选择要学习的概念", "用最简单的语言解释给''小学生''听", "识别卡壳的地方（知识盲区）", "回到原材料重新学习盲区", "简化语言，用类比和例子", "重复直到能流畅讲解"]',
  
  '{"learning", "skill", "knowledge"}',
  
  1, 4,  -- 所有难度适用
  
  '请使用**费曼学习法**来指导学习过程：

**步骤1: 选择概念 (5分钟)**
- 明确要学习的具体概念或技能
- 写下这个概念的名字作为标题

**步骤2: 简单解释 (15分钟)**
- 用自己的话解释这个概念
- 想象你在向一个12岁的孩子讲解
- 避免使用专业术语，多用类比和例子
- 写下你的解释

**步骤3: 识别盲区 (10分钟)**
- 回顾你的解释，找出：
  * 说不清楚的地方
  * 需要查资料的地方
  * 无法举例的地方
- 这些就是你的知识盲区

**步骤4: 重新学习 (20分钟)**
- 针对盲区，回到教材/资料
- 深入理解这些难点
- 寻找更多例子和类比

**步骤5: 简化和类比 (15分钟)**
- 重新组织语言，更简单
- 创造生动的类比
- 举具体的生活例子

**步骤6: 教学输出 (可选)**
- 真实地讲给别人听
- 或者写成博客文章
- 或者录制讲解视频

**学习计划格式**:
- Day 1-2: 第一轮学习+简单解释
- Day 3-4: 识别盲区+重新学习
- Day 5-6: 简化语言+创造类比
- Day 7: 教学输出+总结',

  'Use the **Feynman Technique** for learning:

**Step 1: Choose Concept**
- Identify the specific concept to learn

**Step 2: Explain Simply**
- Explain as if teaching a 12-year-old
- Avoid jargon, use analogies

**Step 3: Identify Gaps**
- Find areas where explanation breaks down

**Step 4: Review and Learn**
- Go back to source material for gaps

**Step 5: Simplify**
- Reorganize with simpler language
- Create vivid analogies

**Step 6: Teach**
- Actually teach someone else',
  
  10,
  'Richard Feynman - Nobel Prize Winner',
  '{"learning", "proven", "beginner-friendly", "deep-understanding"}'
);

-- 3. 原子习惯 (Atomic Habits) - 习惯养成专用
INSERT INTO methodology_library (
  code, name_zh, name_en,
  description_zh, description_en,
  principles,
  applicable_goal_types,
  min_difficulty_level, max_difficulty_level,
  prompt_injection_zh, prompt_injection_en,
  priority, source, tags
) VALUES (
  'atomic-habits',
  '原子习惯',
  'Atomic Habits',
  
  '通过微小的习惯改变实现复利效应，每天进步1%，一年后就是37倍的提升',
  'Build tiny habits that compound over time: 1% better every day = 37x better in a year',
  
  '["让习惯显而易见（提示）", "让习惯有吸引力（渴望）", "让习惯简便易行（反应）", "让习惯令人愉悦（奖励）", "从2分钟版本开始", "永远不要错过两次", "关注身份认同而非结果"]',
  
  '{"habit", "lifestyle", "health", "productivity"}',
  
  1, 3,  -- 适用于 easy 到 hard 难度
  
  '请使用**原子习惯（四大定律）**来设计习惯养成计划：

**定律1: 让习惯显而易见**
- 设计"实施意图": "我会在[时间]，在[地点]，做[行为]"
- 例如: "我会在早上7点，在卧室，做10个俯卧撑"
- 习惯堆叠: "在[现有习惯]之后，我会[新习惯]"
- 例如: "刷完牙后，我会做俯卧撑"
- 环境设计: 把提示物放在显眼位置
- 例如: 把瑜伽垫铺在床边

**定律2: 让习惯有吸引力**
- 捆绑诱惑: "在[习惯]之后，我会[享受]"
- 例如: "做完俯卧撑后，喝我最爱的咖啡"
- 加入团体: 找到已经在做这件事的群体
- 重构认知: 把"必须做"改为"可以做"

**定律3: 让习惯简便易行**
- **2分钟法则**: 习惯的启动版本不超过2分钟
  * "每天阅读30分钟" → "打开书读1页"
  * "每天50个俯卧撑" → "换上运动服做1个"
- 降低阻力: 提前准备好所需物品
- 自动化: 使用科技工具（提醒、打卡App）

**定律4: 让习惯令人愉悦**
- 即时奖励: 完成后给自己小奖励
- 打卡机制: 用日历或App打卡，维持连续性
- **永远不要错过两次**: 偶尔一次没做没关系，但绝不能连续两次放弃
- 习惯追踪: 可视化进度

**习惯养成计划格式**:
- Week 1: [2分钟版本] 换运动服+做1个俯卧撑
- Week 2: [小幅增加] 做5个俯卧撑
- Week 3-4: [建立连续性] 每天打卡，维持连续21天
- Week 5+: [逐步增加] 每周+5个，直到目标

**关键指标**:
- 连续天数（比数量更重要）
- 最长连续记录
- 完成率（目标>80%）',

  'Use **Atomic Habits (4 Laws)** for habit formation:

**Law 1: Make it Obvious**
- Implementation intention: "I will [behavior] at [time] in [location]"
- Habit stacking: "After [current habit], I will [new habit]"
- Environment design: Visual cues

**Law 2: Make it Attractive**
- Temptation bundling
- Join a group
- Reframe mindset

**Law 3: Make it Easy**
- **2-Minute Rule**: Start with 2-min version
- Reduce friction
- Automate

**Law 4: Make it Satisfying**
- Immediate rewards
- Habit tracking
- **Never miss twice**: One miss is OK, two is a new habit',
  
  9,
  'James Clear - Atomic Habits',
  '{"habit", "proven", "beginner-friendly", "practical"}'
);

-- 4. SMART 目标法 (SMART Goals) - 项目和职业目标专用
INSERT INTO methodology_library (
  code, name_zh, name_en,
  description_zh, description_en,
  principles,
  applicable_goal_types,
  min_difficulty_level, max_difficulty_level,
  prompt_injection_zh, prompt_injection_en,
  priority, source, tags
) VALUES (
  'smart-goals',
  'SMART 目标法',
  'SMART Goals',
  
  '设定具体、可衡量、可实现、相关性强、有时限的目标，确保目标清晰可执行',
  'Set Specific, Measurable, Achievable, Relevant, Time-bound goals',
  
  '["Specific (具体的): 明确要做什么", "Measurable (可衡量的): 如何判断完成", "Achievable (可实现的): 在能力范围内", "Relevant (相关的): 与长期目标一致", "Time-bound (有时限的): 明确截止日期"]',
  
  '{"project", "career", "business", "financial", "general"}',
  
  2, 4,  -- medium 到 expert
  
  '请使用 **SMART 目标框架**来优化和分解目标：

**S - Specific (具体性检查)**
- ❌ 模糊: "我要变得更健康"
- ✅ 具体: "我要每天做50个俯卧撑，持续30天"
- 检查清单:
  * 明确了具体行为？
  * 明确了数量/标准？
  * 没有模糊词汇？

**M - Measurable (可衡量性检查)**
- 量化指标: 
  * 数量: 50个俯卧撑
  * 频率: 每天
  * 时长: 30天
- 进度追踪方式:
  * 打卡日历
  * 计数器App
  * 日记记录
- 完成标准: 
  * 30天内累计完成25天以上视为成功（允许20%容错）

**A - Achievable (可实现性评估)**
- 当前能力: 
  * 测试基线（如当前能做多少个）
  * 评估体能状况
- 资源检查:
  * 时间: 每天10分钟
  * 空间: 需要2平米空间
  * 装备: 瑜伽垫（可选）
- 风险识别:
  * 可能的障碍: 加班、出差、天气
  * 应对方案: 简化版本（如减少到30个）

**R - Relevant (相关性确认)**
- 与长期目标对齐:
  * 长期目标: 提升体能/减脂/增肌
  * 当前目标如何支持长期目标
- 动机确认:
  * 为什么要做这件事？
  * 完成后会带来什么价值？

**T - Time-bound (时限性设定)**
- 明确截止日期: 2025年XX月XX日
- 里程碑设置:
  * Week 1: 适应期（每天20个）
  * Week 2-3: 增长期（每天35个）
  * Week 4: 目标期（每天50个）
- 每日/每周检查点

**SMART 优化后的目标陈述**:
"我将在接下来的30天内（Time-bound），每天早上7点（Specific），完成50个标准俯卧撑（Specific + Measurable），以提升上肢力量和核心稳定性（Relevant），允许5天容错（Achievable）"

**执行计划格式**:
- Week 1: [测试+适应] 测试基线，每天20个
- Week 2: [进阶] 每天35个
- Week 3-4: [目标] 每天50个
- 每周日: 回顾进度，调整计划',

  'Use **SMART Goals Framework**:

**S - Specific**
- Define exact behavior and standards
- No vague terms

**M - Measurable**
- Quantify (numbers, frequency, duration)
- Define tracking method
- Set completion criteria

**A - Achievable**
- Assess current ability
- Check resources (time, space, equipment)
- Identify risks and solutions

**R - Relevant**
- Align with long-term goals
- Clarify motivation and value

**T - Time-bound**
- Set deadline
- Define milestones
- Weekly checkpoints',
  
  8,
  'George T. Doran (1981)',
  '{"project", "proven", "structured", "goal-setting"}'
);

-- 5. 刻意练习 (Deliberate Practice) - 技能提升专用
INSERT INTO methodology_library (
  code, name_zh, name_en,
  description_zh, description_en,
  principles,
  applicable_goal_types,
  min_difficulty_level, max_difficulty_level,
  prompt_injection_zh, prompt_injection_en,
  priority, source, tags
) VALUES (
  'deliberate-practice',
  '刻意练习',
  'Deliberate Practice',
  
  '通过有目的、专注、反馈驱动的练习来突破舒适区，持续提升技能水平',
  'Purposeful, focused, feedback-driven practice to push beyond comfort zone',
  
  '["明确定义的目标", "走出舒适区", "持续专注", "即时反馈", "不断重复和改进", "拆解复杂技能为子技能", "心理表征的建立"]',
  
  '{"skill", "learning", "sport", "art", "music"}',
  
  3, 4,  -- hard 到 expert，刻意练习适合有一定基础的人
  
  '请使用**刻意练习**方法论来设计技能提升计划：

**核心原则**: 刻意练习 ≠ 普通练习
- 普通练习: 重复做熟悉的事
- 刻意练习: 专注于弱点，持续突破舒适区

**步骤1: 技能拆解 (10%时间)**
- 将目标技能拆解为具体的子技能
- 示例（Python编程）:
  * 语法基础
  * 数据结构（列表、字典）
  * 函数和模块
  * 面向对象
  * 调试技巧
  * 算法思维
- 识别最薄弱的子技能（这是突破口）

**步骤2: 设计练习任务 (20%时间)**
- 针对弱点设计专项练习
- 特点:
  * 难度略高于当前水平（拉伸区）
  * 可重复性强
  * 有明确的成功标准
- 示例:
  * 弱点: 列表推导式
  * 练习: 每天写10个不同的列表推导式题目

**步骤3: 专注练习 (60%时间)**
- 全神贯注，避免分心
- 每次练习时长: 25-50分钟（番茄钟）
- 关键: 
  * 100%注意力
  * 慢速+精准（不追求速度）
  * 感知错误的瞬间

**步骤4: 即时反馈 (10%时间)**
- 理想情况: 导师/教练的实时反馈
- 替代方案:
  * 对比标准答案
  * 代码运行结果
  * 录制自己的表现并回看
  * 使用AI工具评估
- 关键: 立即知道哪里错了

**步骤5: 反思和调整 (每周)**
- 记录练习日志:
  * 练习了什么
  * 发现了什么问题
  * 有什么进步
- 调整练习计划:
  * 如果太简单 → 增加难度
  * 如果太难 → 降低难度或拆解更细

**练习计划格式**:
- Week 1: [诊断] 全面测试，识别最弱3个子技能
- Week 2-3: [专项1] 攻克子技能1（如列表推导式）
  * Day 1-2: 学习原理+基础练习
  * Day 3-5: 刻意练习（走出舒适区）
  * Day 6-7: 综合应用+反馈
- Week 4-5: [专项2] 攻克子技能2
- Week 6: [整合] 综合练习，整合所有子技能

**关键指标**:
- 练习强度（是否在拉伸区）
- 专注时长（有效练习时间）
- 错误率变化（量化进步）
- 反馈频率（每次练习是否有反馈）',

  'Use **Deliberate Practice** for skill mastery:

**Principle**: Deliberate Practice ≠ Regular Practice
- Regular: Repeat familiar tasks
- Deliberate: Focus on weaknesses, push comfort zone

**Step 1: Skill Decomposition (10%)**
- Break down skill into sub-skills
- Identify weakest sub-skill

**Step 2: Design Practice Tasks (20%)**
- Target weaknesses
- Slightly above current level (stretch zone)
- Repeatable with clear success criteria

**Step 3: Focused Practice (60%)**
- Full concentration, no distractions
- 25-50 minute sessions
- Slow + precise (not fast)

**Step 4: Immediate Feedback (10%)**
- Ideal: Coach/mentor feedback
- Alternative: Compare with correct answer, AI evaluation

**Step 5: Reflect and Adjust (Weekly)**
- Practice log
- Adjust difficulty',
  
  7,
  'Anders Ericsson - Peak',
  '{"skill", "expert-level", "intensive", "proven"}'
);

-- 6. 间隔重复 (Spaced Repetition) - 记忆和学习专用
INSERT INTO methodology_library (
  code, name_zh, name_en,
  description_zh, description_en,
  principles,
  applicable_goal_types,
  min_difficulty_level, max_difficulty_level,
  prompt_injection_zh, prompt_injection_en,
  priority, source, tags
) VALUES (
  'spaced-repetition',
  '间隔重复',
  'Spaced Repetition',
  
  '利用记忆遗忘曲线，在即将遗忘时复习，最大化长期记忆效果',
  'Review material at increasing intervals to maximize long-term retention',
  
  '["首次学习后1天复习", "然后3天后复习", "然后7天后", "然后14天后", "间隔逐渐拉长", "困难的内容缩短间隔", "简单的内容拉长间隔"]',
  
  '{"learning", "language", "exam", "knowledge"}',
  
  1, 4,  -- 所有难度
  
  '请使用**间隔重复（艾宾浩斯遗忘曲线）**来设计复习计划：

**原理**: 记忆会遗忘，但在即将遗忘时复习，能显著延长记忆保持时间

**标准间隔序列**（基于认知科学研究）:
1. 首次学习: Day 0
2. 第1次复习: Day 1（24小时后）
3. 第2次复习: Day 3（3天后）
4. 第3次复习: Day 7（1周后）
5. 第4次复习: Day 14（2周后）
6. 第5次复习: Day 30（1个月后）
7. 第6次复习: Day 60（2个月后）
8. ...间隔继续拉长

**动态调整**（基于回忆难度）:
- 😊 轻松回忆 → 拉长间隔（×2）
- 😐 有点困难 → 保持间隔
- 😰 完全忘记 → 缩短间隔（÷2）

**实施方案**:

**方案A: 使用工具**
- Anki（最强大的间隔重复软件）
- Quizlet
- RemNote
- Notion（手动设置）

**方案B: 手动计划**（如果不使用App）
- 准备复习日历
- 每天标注要复习的内容
- 示例:
  * Day 1: 学习A、B、C
  * Day 2: 学习D、E，复习A
  * Day 3: 学习F，复习B
  * Day 4: 学习G，复习C、A
  * ...

**学习计划格式**（以30天学习周期为例）:
- Week 1: [学习周] 每天学习新内容 + 复习Day-1内容
  * Day 1: 学习内容1
  * Day 2: 学习内容2 + 复习内容1
  * Day 3: 学习内容3 + 复习内容2
  * ...
- Week 2: [复习周] 复习Week 1的所有内容（Day 7间隔）
- Week 3-4: [巩固周] 复习Week 1-2的内容（Day 14间隔）

**关键实践**:
1. **主动回忆**: 不看答案，先尝试回忆
2. **测试效应**: 用测试/闪卡，不只是重读
3. **交叉练习**: 混合不同主题的复习
4. **睡前复习**: 利用睡眠巩固记忆

**时间分配**（每天）:
- 学习新内容: 60%
- 复习旧内容: 40%

**效果评估**:
- 目标: 3次成功回忆后，内容进入长期记忆
- 追踪指标: 每个知识点的复习次数和成功率',

  'Use **Spaced Repetition (Ebbinghaus Curve)** for learning:

**Principle**: Review at increasing intervals to combat forgetting curve

**Standard Intervals**:
1. Day 0: Learn
2. Day 1: 1st review (24h later)
3. Day 3: 2nd review (3d later)
4. Day 7: 3rd review (1w later)
5. Day 14: 4th review (2w later)
6. Day 30: 5th review (1m later)

**Dynamic Adjustment**:
- Easy recall → Double interval
- Difficult → Maintain interval
- Forgot → Half interval

**Tools**: Anki, Quizlet, RemNote

**Key Practice**:
- Active recall (test yourself)
- Don''t just re-read
- Review before sleep',
  
  8,
  'Hermann Ebbinghaus - Forgetting Curve Research',
  '{"learning", "memory", "proven", "evidence-based"}'
);

-- 7. GTD (Getting Things Done) - 生产力和项目管理专用
INSERT INTO methodology_library (
  code, name_zh, name_en,
  description_zh, description_en,
  principles,
  applicable_goal_types,
  min_difficulty_level, max_difficulty_level,
  prompt_injection_zh, prompt_injection_en,
  priority, source, tags
) VALUES (
  'gtd',
  'GTD (搞定一切)',
  'Getting Things Done (GTD)',
  
  '通过捕获、理清、组织、回顾、执行五步法，清空大脑，专注执行',
  'Capture, Clarify, Organize, Reflect, Engage - clear your mind and focus on execution',
  
  '["捕获: 所有事项写下来", "理清: 判断是否可行动", "组织: 分类到清单", "回顾: 定期检视", "执行: 根据情境选择行动", "2分钟法则: 2分钟能做完就立即做", "下一步行动: 永远问''下一步具体做什么''"]',
  
  '{"productivity", "project", "business", "general"}',
  
  2, 4,
  
  '请使用 **GTD (Getting Things Done)** 方法论来组织和执行目标：

**GTD 五步流程**:

**步骤1: 捕获 (Capture)** 
- 目的: 清空大脑，避免遗漏
- 行动:
  * 把所有相关的任务、想法、待办写下来
  * 使用收集箱（笔记本、App、录音）
  * 不判断、不组织，只记录
- 示例（学习Python目标）:
  * "学习变量和数据类型"
  * "练习列表操作"
  * "安装VS Code"
  * "找Python教程"
  * "买《Python编程：从入门到实践》"

**步骤2: 理清 (Clarify)**
- 目的: 判断每项是否可执行
- 判断标准:
  * 这是什么？
  * 是否需要行动？
  * 如果需要，下一步具体行动是什么？
- 分类:
  * ✅ 可行动 → 进入步骤3
  * 📚 参考资料 → 归档
  * 🗑️ 无用信息 → 删除
  * 🤔 未来可能 → Someday/Maybe 清单

**步骤3: 组织 (Organize)**
- 将可行动事项分类:
  * **下一步行动**: 明确的单个行动（最重要！）
  * **项目**: 需要多个步骤的目标
  * **等待**: 依赖他人的事项
  * **日历**: 有明确时间的事项
  * **参考**: 可能需要的资料
- 示例:
  * 下一步行动: "在官网下载Python 3.11"
  * 项目: "学习Python基础语法"
  * 日历: "周六上午10点: 参加Python线上课"

**步骤4: 回顾 (Reflect)**
- **每日回顾** (5分钟):
  * 查看今天的日历
  * 查看下一步行动清单
  * 完成的事项打勾
- **每周回顾** (30-60分钟):
  * 清空收集箱
  * 检查项目清单
  * 查看等待清单
  * 浏览Someday/Maybe

**步骤5: 执行 (Engage)**
- 根据"情境、时间、精力、优先级"选择行动
- **情境**: 在哪里（电脑前、外出、家里）
- **时间**: 有多少时间（5分钟、1小时、半天）
- **精力**: 现在状态（高精力、低精力）
- **优先级**: 什么最重要

**关键实践**:

**2分钟法则**:
- 如果某事2分钟内能做完，立即做
- 例如: 回复一封邮件、发送一条信息

**下一步行动**:
- 永远定义清晰的下一步
- ❌ 错误: "学习Python"（太模糊）
- ✅ 正确: "打开Python官网，下载安装包"

**项目分解**:
- 任何需要2步以上的都是"项目"
- 为每个项目定义"期望结果"和"下一步行动"

**GTD 清单示例**（学习Python目标）:

**项目清单**:
- [ ] 学习Python基础语法（期望: 能独立写简单程序）
- [ ] 完成100道练习题（期望: 巩固语法）

**下一步行动清单**:
- [ ] @电脑: 在Python官网下载安装包
- [ ] @电脑: 安装VS Code并配置Python插件
- [ ] @电脑: 完成第1章练习题
- [ ] @任何地方: 阅读《Python编程》第1章（电子书）

**等待清单**:
- [ ] 等待: 朋友推荐Python学习资源

**日历**:
- 2025-11-10 10:00: Python线上直播课

**执行计划格式**:
- Week 1: [设置] 捕获所有任务 → 理清 → 组织到清单
- Week 2-4: [执行] 每日: 查看下一步行动清单并执行
           每周: 回顾所有清单，更新项目进度',

  'Use **GTD (Getting Things Done)** methodology:

**5 Steps**:

**1. Capture**
- Write down everything
- Don''t judge, just record

**2. Clarify**
- Is it actionable?
- What''s the next action?

**3. Organize**
- Next Actions list
- Projects list
- Waiting For list
- Calendar

**4. Reflect**
- Daily review (5 min)
- Weekly review (30-60 min)

**5. Engage**
- Choose by Context, Time, Energy, Priority

**Key Practices**:
- 2-minute rule: Do it now if <2min
- Next action: Always define specific next step
- Projects: Anything requiring 2+ steps',
  
  6,
  'David Allen - Getting Things Done',
  '{"productivity", "project", "proven", "comprehensive"}'
);

-- 8. FITT 原则 (FITT Principle) - 健身和运动专用
INSERT INTO methodology_library (
  code, name_zh, name_en,
  description_zh, description_en,
  principles,
  applicable_goal_types,
  min_difficulty_level, max_difficulty_level,
  prompt_injection_zh, prompt_injection_en,
  priority, source, tags
) VALUES (
  'fitt-principle',
  'FITT 运动原则',
  'FITT Principle',
  
  '通过调节频率(Frequency)、强度(Intensity)、时间(Time)、类型(Type)四个维度来优化运动效果',
  'Optimize exercise by adjusting Frequency, Intensity, Time, and Type',
  
  '["Frequency: 每周训练几次", "Intensity: 训练强度多大", "Time: 每次训练多久", "Type: 选择什么运动类型", "根据目标调整FITT", "渐进式增加FITT参数", "关注恢复和休息"]',
  
  '{"fitness", "health", "sport"}',
  
  1, 3,
  
  '请使用 **FITT 运动原则**来设计科学的训练计划：

**FITT 四大维度**:

**F - Frequency (频率)**: 每周训练几次？
- 初学者: 2-3次/周（需要更多恢复时间）
- 中级: 3-5次/周
- 高级: 5-6次/周
- 关键: 至少隔天1次，让肌肉恢复

**I - Intensity (强度)**: 训练有多努力？
- 测量方式:
  * 心率: 目标心率区间（最大心率的60-85%）
  * 重量: 最大重量的60-80%
  * 自感强度: 1-10分，目标6-8分
- 示例（俯卧撑）:
  * 低强度: 能轻松完成，还有余力
  * 中强度: 有点吃力，最后2-3个需要努力
  * 高强度: 非常吃力，最后1个几乎做不动

**T - Time (时间)**: 每次训练多久？
- 有氧运动: 20-60分钟
- 力量训练: 30-60分钟
- 柔韧性训练: 10-30分钟
- 初学者建议: 从短时长开始（20-30分钟）

**T - Type (类型)**: 选择什么运动？
- 根据目标选择:
  * 减脂: 有氧运动（跑步、游泳、骑行）
  * 增肌: 力量训练（自重、器械、哑铃）
  * 提升耐力: 有氧运动
  * 提升力量: 力量训练
  * 改善柔韧性: 瑜伽、拉伸
- 综合训练: 结合多种类型

**FITT 训练计划示例**（俯卧撑目标）:

**Phase 1: 基础期 (Week 1-2)**
- F: 3次/周（周一、周三、周五）
- I: 低-中强度（能完成目标次数的60%）
- T: 10-15分钟/次
- T: 俯卧撑 + 平板支撑（辅助核心）

**Phase 2: 增长期 (Week 3-4)**
- F: 4次/周（周一、周二、周四、周六）
- I: 中强度（目标次数的80%）
- T: 15-20分钟/次
- T: 标准俯卧撑 + 窄距俯卧撑（多样化）

**Phase 3: 强化期 (Week 5-6)**
- F: 5次/周
- I: 中-高强度（目标次数的90-100%）
- T: 20-25分钟/次
- T: 标准俯卧撑 + 钻石俯卧撑（进阶）

**渐进式调整策略**:
1. 先增加 Frequency（次数）
2. 再增加 Time（时长）
3. 最后增加 Intensity（强度）
4. 定期改变 Type（避免平台期）

**示例（4周计划）**:
- Week 1: F=3次, I=60%, T=10分钟, Type=标准俯卧撑
- Week 2: F=4次, I=60%, T=10分钟, Type=标准俯卧撑（增加频率）
- Week 3: F=4次, I=70%, T=15分钟, Type=标准俯卧撑（增加强度和时长）
- Week 4: F=5次, I=80%, T=20分钟, Type=标准+窄距（增加频率和类型）

**关键监控指标**:
- 静息心率（每周测1次，应逐渐降低）
- 恢复时间（肌肉酸痛持续时间）
- 训练质量（能否保持标准动作）
- 主观感受（疲劳程度）',

  'Use **FITT Principle** for exercise planning:

**F - Frequency**: How often?
- Beginner: 2-3x/week
- Intermediate: 3-5x/week
- Advanced: 5-6x/week

**I - Intensity**: How hard?
- Measure by heart rate, weight %, or perceived exertion (1-10 scale)
- Target: 6-8/10

**T - Time**: How long?
- Cardio: 20-60 min
- Strength: 30-60 min
- Start short (20-30 min)

**T - Type**: What exercise?
- Fat loss: Cardio
- Muscle gain: Strength training
- Endurance: Cardio
- Flexibility: Yoga/stretching

**Progressive Adjustment**:
1. First increase Frequency
2. Then increase Time
3. Finally increase Intensity
4. Vary Type regularly',
  
  6,
  'American College of Sports Medicine (ACSM)',
  '{"fitness", "evidence-based", "beginner-friendly", "structured"}'
);

-- ========================================================================
-- 第二部分: Prompt 模板库 (按目标类型 × 难度 × 阶段填充)
-- ========================================================================

-- 为了控制篇幅，这里先提供几个关键 Prompt 模板示例
-- 完整的 50+ 条模板会在后续批量插入脚本中提供

-- ========================================================================
-- Prompt 模板: fitness + medium + task-decomposition
-- ========================================================================
INSERT INTO ai_prompt_library (
  goal_type, difficulty, language, stage,
  system_prompt, user_prompt,
  variables, temperature, max_tokens,
  methodology_id
) VALUES (
  'fitness', 'medium', 'zh', 'task-decomposition',
  
  '你是一位专业的健身教练和运动科学专家。用户设定了一个健身目标，你需要使用**渐进式超负荷**方法论，将目标分解为 3-5 个具体的、可执行的、循序渐进的任务步骤。

请严格遵循以下要求：

1. **任务数量**: 精确 3-5 个任务（不能多也不能少）
2. **任务顺序**: 必须有清晰的先后逻辑
  - 第1步: 评估基线或准备工作
  - 第2-3步: 核心训练阶段
  - 最后1步: 监控或巩固
3. **任务描述**: 每个任务必须包含：
  - 具体的行为动作
  - 明确的数量/时间标准
  - 为什么要做这一步（简短说明）
4. **渐进式原则**: 体现从易到难、从少到多的渐进过程
5. **可执行性**: 避免模糊词汇，使用可验证的描述

**输出格式**（严格遵守）:
1. [阶段标签] 具体任务描述（包含数字和标准）
2. [阶段标签] 具体任务描述（包含数字和标准）
...

**示例**:
1. [基线评估] 测试当前最大俯卧撑数量，记录为基线值
2. [第1-2周] 每天完成基线值×60%的俯卧撑，建立训练习惯
3. [第3-4周] 每天完成基线值×80%的俯卧撑，逐步增加强度
4. [监控进度] 每周日重新测试最大值，对比基线值评估进步

现在请为用户的健身目标生成任务列表。',

  '用户的健身目标：{goalText}
时间跨度：{days} 天
目标日期：{targetDate}

请生成任务列表：',

  '{"goalText": "用户输入的目标描述", "days": "目标天数", "targetDate": "目标日期"}',
  
  0.6,  -- 较低温度，确保输出稳定
  600,  -- 任务分解不需要太长
  
  (SELECT id FROM methodology_library WHERE code = 'progressive-overload')
);

-- ========================================================================
-- Prompt 模板: learning + medium + task-decomposition
-- ========================================================================
INSERT INTO ai_prompt_library (
  goal_type, difficulty, language, stage,
  system_prompt, user_prompt,
  variables, temperature, max_tokens,
  methodology_id
) VALUES (
  'learning', 'medium', 'zh', 'task-decomposition',
  
  '你是一位教育心理学专家和学习策略顾问。用户设定了一个学习目标，你需要使用**费曼学习法**，将目标分解为 3-5 个具体的、可执行的任务步骤。

请严格遵循以下要求：

1. **任务数量**: 精确 3-5 个任务
2. **费曼学习法核心**: 
  - 学习 → 简单解释 → 识别盲区 → 重新学习 → 输出教学
3. **任务描述**: 每个任务必须包含：
  - 具体的学习/实践活动
  - 明确的完成标准或产出物
  - 预计耗时
4. **主动学习**: 强调输出（讲解、写作、实践），而非被动阅读
5. **可验证性**: 每个任务有明确的完成标志

**输出格式**:
1. [阶段] 具体任务描述（含标准和耗时）
2. [阶段] 具体任务描述（含标准和耗时）
...

**示例**（学习Python列表推导式）:
1. [学习] 阅读教材第X章，理解列表推导式的语法和使用场景（预计1小时）
2. [解释] 用自己的话写一篇300字的解释文章，向"小学生"讲清楚列表推导式（预计30分钟）
3. [识别盲区] 尝试写5个不同场景的列表推导式，找出卡壳的地方（预计1小时）
4. [实践] 完成10道列表推导式练习题，确保正确率>90%（预计2小时）
5. [输出] 录制一个5分钟的讲解视频，或写一篇技术博客（预计1小时）

现在请为用户的学习目标生成任务列表。',

  '用户的学习目标：{goalText}
时间跨度：{days} 天
目标日期：{targetDate}

请生成任务列表：',

  '{"goalText": "用户输入的目标描述", "days": "目标天数", "targetDate": "目标日期"}',
  
  0.6,
  600,
  
  (SELECT id FROM methodology_library WHERE code = 'feynman-technique')
);

-- ========================================================================
-- Prompt 模板: habit + easy + task-decomposition
-- ========================================================================
INSERT INTO ai_prompt_library (
  goal_type, difficulty, language, stage,
  system_prompt, user_prompt,
  variables, temperature, max_tokens,
  methodology_id
) VALUES (
  'habit', 'easy', 'zh', 'task-decomposition',
  
  '你是一位习惯养成教练，深谙行为心理学。用户设定了一个习惯养成目标，你需要使用**原子习惯（四大定律）**，将目标分解为 3-5 个具体的、可执行的任务步骤。

请严格遵循以下要求：

1. **任务数量**: 精确 3-5 个任务
2. **原子习惯四大定律**: 
  - 让习惯显而易见（提示设计）
  - 让习惯有吸引力（动机绑定）
  - 让习惯简便易行（2分钟法则）
  - 让习惯令人愉悦（奖励机制）
3. **2分钟法则**: 第一个任务必须是"2分钟版本"（极简版）
4. **关注连续性**: 强调"不要连续错过两次"
5. **环境设计**: 至少1个任务涉及环境或提示设计

**输出格式**:
1. [阶段] 具体任务描述
2. [阶段] 具体任务描述
...

**示例**（每天阅读30分钟）:
1. [2分钟版本] 每天睡前打开书，读1页（建立最小习惯）
2. [环境设计] 把书放在床头柜最显眼的位置，设置晚上9点的手机提醒
3. [渐进增加] 第1周读1页，第2周读5页，第3周读10页，第4周达到30分钟
4. [奖励机制] 每完成1天，在日历上打勾；连续7天奖励自己喜欢的饮料
5. [防断连] 如果某天错过，第二天必须完成，绝不连续错过两次

现在请为用户的习惯养成目标生成任务列表。',

  '用户的习惯目标：{goalText}
时间跨度：{days} 天
目标日期：{targetDate}

请生成任务列表：',

  '{"goalText": "用户输入的目标描述", "days": "目标天数", "targetDate": "目标日期"}',
  
  0.6,
  600,
  
  (SELECT id FROM methodology_library WHERE code = 'atomic-habits')
);

-- ========================================================================
-- 通用降级 Prompt: general + any + task-decomposition
-- ========================================================================
INSERT INTO ai_prompt_library (
  goal_type, difficulty, language, stage,
  system_prompt, user_prompt,
  variables, temperature, max_tokens
) VALUES (
  'general', 'any', 'zh', 'task-decomposition',
  
  '你是一位专业的目标管理顾问。用户设定了一个目标，你需要将其分解为 3-5 个具体的、可执行的任务步骤。

请遵循以下要求：

1. **任务数量**: 3-5 个任务
2. **任务顺序**: 有清晰的先后逻辑
3. **任务描述**: 具体、可执行、可验证
4. **SMART 原则**: 每个任务都应该是具体的、可衡量的

**输出格式**:
1. 具体任务描述
2. 具体任务描述
...

现在请为用户的目标生成任务列表。',

  '用户的目标：{goalText}
时间跨度：{days} 天
目标日期：{targetDate}

请生成任务列表：',

  '{"goalText": "用户输入的目标描述", "days": "目标天数", "targetDate": "目标日期"}',
  
  0.7,
  600
);

-- ========================================================================
-- 验证数据插入
-- ========================================================================
DO $$
DECLARE
  methodology_count INTEGER;
  prompt_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO methodology_count FROM methodology_library;
  SELECT COUNT(*) INTO prompt_count FROM ai_prompt_library;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'V3.1 种子数据插入完成！';
  RAISE NOTICE '========================================';
  RAISE NOTICE '方法论库: % 条记录', methodology_count;
  RAISE NOTICE 'Prompt 模板: % 条记录', prompt_count;
  RAISE NOTICE '';
  RAISE NOTICE '方法论列表:';
  RAISE NOTICE '  1. 渐进式超负荷 (Progressive Overload)';
  RAISE NOTICE '  2. 费曼学习法 (Feynman Technique)';
  RAISE NOTICE '  3. 原子习惯 (Atomic Habits)';
  RAISE NOTICE '  4. SMART 目标法';
  RAISE NOTICE '  5. 刻意练习 (Deliberate Practice)';
  RAISE NOTICE '  6. 间隔重复 (Spaced Repetition)';
  RAISE NOTICE '  7. GTD (Getting Things Done)';
  RAISE NOTICE '  8. FITT 运动原则';
  RAISE NOTICE '';
  RAISE NOTICE '下一步: 在 Supabase 中执行这些脚本';
  RAISE NOTICE '========================================';
END $$;


