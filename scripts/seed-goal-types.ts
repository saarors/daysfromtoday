/**
 * Phase 3 V2 - 目标类型初始化脚本
 * 
 * 功能：向数据库导入 15 种核心目标类型
 * 理论依据：docs/AI_PERSONA_MATCHING_SYSTEM.md
 * 
 * 使用方法：
 * npx tsx scripts/seed-goal-types.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// 加载环境变量
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少环境变量：NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =========================================
// 15 种核心目标类型数据
// =========================================
const GOAL_TYPES = [
  {
    code: 'life',
    name_zh: '生活型',
    name_en: 'Life Events',
    category: '生活类',
    keywords_zh: ['生日', '纪念日', '聚会', '旅行', '节日', '度假', '探亲', '访友'],
    keywords_en: ['birthday', 'anniversary', 'party', 'travel', 'holiday', 'vacation', 'visit'],
    default_persona_code: 'companion',
    default_tone: 'warm_casual',
    default_frameworks: ['Anticipatory Joy', 'Temporal Framing'],
    characteristics: {
      '期待感': '高',
      '情绪导向': true,
      '周期': '短',
      '可量化': false
    },
    sort_order: 1
  },
  {
    code: 'health',
    name_zh: '健康型',
    name_en: 'Health & Fitness',
    category: '健康类',
    keywords_zh: ['减肥', '健身', '跑步', '锻炼', '康复', '治疗', '减脂', '增肌', '运动', '手术', '作息'],
    keywords_en: ['fitness', 'workout', 'lose weight', 'exercise', 'recovery', 'gym', 'diet', 'health', 'surgery'],
    default_persona_code: 'coach',
    default_tone: 'calm_motivational',
    default_frameworks: ['WOOP', 'Implementation Intention', 'CBT'],
    characteristics: {
      '目标明确': true,
      '波动性': '高',
      '需长期坚持': true
    },
    sort_order: 2
  },
  {
    code: 'work',
    name_zh: '工作型',
    name_en: 'Work & Productivity',
    category: '工作类',
    keywords_zh: ['项目', '汇报', '会议', '创业', '路演', '上线', '市场', '出差', '销售', '招聘'],
    keywords_en: ['project', 'meeting', 'startup', 'launch', 'presentation', 'business', 'sales', 'hiring'],
    default_persona_code: 'analyst',
    default_tone: 'clear_concise',
    default_frameworks: ['SMART', 'OKR', 'PDCA'],
    characteristics: {
      '多任务': true,
      '压力': '高',
      '结构复杂': true
    },
    sort_order: 3
  },
  {
    code: 'finance',
    name_zh: '财务型',
    name_en: 'Finance & Wealth',
    category: '财务类',
    keywords_zh: ['收入', '支出', '投资', '还款', '储蓄', '工资', '收款', '套现'],
    keywords_en: ['income', 'expense', 'investment', 'payment', 'savings', 'salary', 'cashout'],
    default_persona_code: 'advisor',
    default_tone: 'calm_strategic',
    default_frameworks: ['Expected Utility Theory', 'Prospect Theory'],
    characteristics: {
      '数据导向': true,
      '周期': '长',
      '理性': true
    },
    sort_order: 4
  },
  {
    code: 'consumption',
    name_zh: '消费型',
    name_en: 'Consumption & Desire',
    category: '消费类',
    keywords_zh: ['买礼物', '购物', '买车', '买房', '买东西'],
    keywords_en: ['buy', 'shopping', 'purchase', 'gift', 'car', 'house'],
    default_persona_code: 'reflector',
    default_tone: 'calm_reflective',
    default_frameworks: ['Temporal Discounting', 'Value Alignment'],
    characteristics: {
      '欲望强': true,
      '冲动决策': true,
      '短期满足': true
    },
    sort_order: 5
  },
  {
    code: 'task',
    name_zh: '任务型',
    name_en: 'Academic/Execution',
    category: '任务类',
    keywords_zh: ['作业', '考试', '论文', '答辩', '毕业', '升学', '上学'],
    keywords_en: ['homework', 'exam', 'thesis', 'defense', 'graduation', 'education', 'school'],
    default_persona_code: 'coach', // Taskmaster 是 Coach 的变体
    default_tone: 'direct_structured',
    default_frameworks: ['Implementation Intention', 'Pomodoro'],
    characteristics: {
      '目标明确': true,
      '外部约束': true,
      '拖延率': '高',
      '人格变体': 'taskmaster'
    },
    sort_order: 6
  },
  {
    code: 'learning',
    name_zh: '学习型',
    name_en: 'Learning & Growth',
    category: '学习类',
    keywords_zh: ['学习', '读书', '写作', '技能', '语言', '知识'],
    keywords_en: ['learning', 'study', 'reading', 'writing', 'skill', 'language', 'knowledge'],
    default_persona_code: 'mentor',
    default_tone: 'warm_inspiring',
    default_frameworks: ['Self-Determination Theory', 'Spaced Repetition'],
    characteristics: {
      '周期': '长',
      '内在动机': true,
      '易放弃': true
    },
    sort_order: 7
  },
  {
    code: 'relationship',
    name_zh: '人际型',
    name_en: 'Relationship & Social',
    category: '人际类',
    keywords_zh: ['家人', '关系', '沟通', '团队', '协作', '朋友'],
    keywords_en: ['family', 'relationship', 'communication', 'team', 'collaboration', 'friends'],
    default_persona_code: 'empath',
    default_tone: 'gentle_supportive',
    default_frameworks: ['NVC', 'Emotional Regulation'],
    characteristics: {
      '情绪主导': true,
      '反馈敏感': true
    },
    sort_order: 8
  },
  {
    code: 'meaning',
    name_zh: '精神型',
    name_en: 'Meaning & Life Purpose',
    category: '精神类',
    keywords_zh: ['人生', '信念', '使命', '方向', '意义', '目标'],
    keywords_en: ['life purpose', 'belief', 'mission', 'direction', 'meaning', 'philosophy'],
    default_persona_code: 'mentor', // Philosopher 是 Mentor 的扩展
    default_tone: 'deep_reflective',
    default_frameworks: ['Logotherapy', 'Existential Psychology'],
    characteristics: {
      '抽象': true,
      '可量化': false,
      '人格扩展': 'philosopher'
    },
    sort_order: 9
  },
  {
    code: 'habit',
    name_zh: '习惯型',
    name_en: 'Habits & Routines',
    category: '习惯类',
    keywords_zh: ['早睡', '日记', '锻炼', '习惯', '每日', '坚持'],
    keywords_en: ['sleep', 'diary', 'habit', 'daily', 'routine', 'persist'],
    default_persona_code: 'coach', // Habit Builder 是 Coach 的扩展
    default_tone: 'gentle_reinforcing',
    default_frameworks: ['Atomic Habits', 'Kaizen', 'BJ Fogg Model'],
    characteristics: {
      '重复性': true,
      '即时奖励': false,
      '人格扩展': 'habit_builder'
    },
    sort_order: 10
  },
  {
    code: 'planning',
    name_zh: '长期规划型',
    name_en: 'Life Planning',
    category: '规划类',
    keywords_zh: ['未来', '职业', '规划', '计划', '三年', '五年'],
    keywords_en: ['future', 'career', 'planning', 'plan', 'years', 'long-term'],
    default_persona_code: 'strategist',
    default_tone: 'calm_predictive',
    default_frameworks: ['Backcasting', 'Goal Hierarchy Theory'],
    characteristics: {
      '不确定性': '高',
      '分阶段': true
    },
    sort_order: 11
  },
  {
    code: 'recovery',
    name_zh: '康复型',
    name_en: 'Recovery',
    category: '康复类',
    keywords_zh: ['康复', '恢复', '失眠', '调整', '手术后'],
    keywords_en: ['recovery', 'healing', 'insomnia', 'adjustment', 'post-surgery'],
    default_persona_code: 'therapist',
    default_tone: 'gentle_supportive',
    default_frameworks: ['CBT', 'Mindfulness', 'Self-Compassion'],
    characteristics: {
      '身心波动': true,
      '需共情': true
    },
    sort_order: 12
  },
  {
    code: 'challenge',
    name_zh: '挑战型',
    name_en: 'Breakthrough Goals',
    category: '挑战类',
    keywords_zh: ['转型', '出版', '马拉松', '突破', '改变'],
    keywords_en: ['transformation', 'publish', 'marathon', 'breakthrough', 'change'],
    default_persona_code: 'challenger',
    default_tone: 'energetic_strategic',
    default_frameworks: ['Flow Theory', 'Challenge-Stress Model'],
    characteristics: {
      '风险': '高',
      '回报': '高',
      '跨舒适区': true
    },
    sort_order: 13
  },
  {
    code: 'exploration',
    name_zh: '探索型',
    name_en: 'Exploratory Goals',
    category: '探索类',
    keywords_zh: ['新领域', '副业', '尝试', '创作', '艺术'],
    keywords_en: ['new field', 'side project', 'try', 'creation', 'art', 'explore'],
    default_persona_code: 'mentor', // Explorer 是 Mentor 的扩展
    default_tone: 'open_encouraging',
    default_frameworks: ['Design Thinking', 'Lean Startup'],
    characteristics: {
      '模糊': true,
      '试错': true,
      '人格扩展': 'explorer'
    },
    sort_order: 14
  },
  {
    code: 'self_discipline',
    name_zh: '自我管理型',
    name_en: 'Self-Discipline',
    category: '自我管理类',
    keywords_zh: ['拖延', '时间管理', '专注', '自律', '控制'],
    keywords_en: ['procrastination', 'time management', 'focus', 'discipline', 'control'],
    default_persona_code: 'guardian',
    default_tone: 'firm_rational',
    default_frameworks: ['Time Blocking', 'CBT for Procrastination'],
    characteristics: {
      '内耗': '高',
      '波动': '大'
    },
    sort_order: 15
  }
];

async function seedGoalTypes() {
  console.log('🚀 开始初始化目标类型数据...\n');

  try {
    // 1. 检查表是否存在
    const { error: tableError } = await supabase
      .from('goal_types')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ 表 goal_types 不存在，请先运行数据库迁移脚本：');
      console.error('   在 Supabase Dashboard 执行 scripts/migrate-db-phase-3-v2.sql');
      process.exit(1);
    }

    // 2. 清空现有数据
    console.log('🗑️  清空现有目标类型...');
    const { error: deleteError } = await supabase
      .from('goal_types')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.warn('⚠️  清空失败（可能表为空）:', deleteError.message);
    }

    // 3. 插入 15 种目标类型
    console.log('📝 插入 15 种核心目标类型...\n');

    for (const goalType of GOAL_TYPES) {
      const { data, error } = await supabase
        .from('goal_types')
        .insert(goalType)
        .select()
        .single();

      if (error) {
        console.error(`❌ 插入失败: ${goalType.name_zh} (${goalType.code})`);
        console.error('   错误:', error.message);
        continue;
      }

      console.log(`✅ ${goalType.code.padEnd(18)} | ${goalType.name_zh.padEnd(10)} → ${goalType.default_persona_code}`);
    }

    // 4. 验证结果
    console.log('\n🔍 验证插入结果...');
    const { data: allTypes, error: verifyError } = await supabase
      .from('goal_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (verifyError) {
      console.error('❌ 验证失败:', verifyError.message);
      process.exit(1);
    }

    console.log(`✅ 数据库中共有 ${allTypes?.length} 种目标类型`);

    // 5. 显示统计信息
    console.log('\n📊 目标类型统计：');
    const categories = new Set(allTypes?.map(t => t.category));
    categories.forEach(cat => {
      const count = allTypes?.filter(t => t.category === cat).length || 0;
      console.log(`   ${cat}: ${count} 种`);
    });

    console.log('\n🎉 目标类型初始化完成！');
    console.log('下一步：初始化 AI 人格数据');
    console.log('   npx tsx scripts/seed-ai-personas.ts');

  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

// 运行脚本
seedGoalTypes();

