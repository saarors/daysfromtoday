/**
 * Phase 3 V2 数据验证脚本
 * 验证 15 目标类型 × 14 AI 人格架构的完整性
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 期望的架构
const EXPECTED = {
  goal_types: 15,
  personas: {
    total: 14,
    core: 10,
    extended: 3,
    variant: 1
  },
  inheritance: {
    philosopher: 'mentor',
    explorer: 'mentor',
    habit_builder: 'coach',
    taskmaster: 'coach'
  },
  goal_mapping: {
    task: 'coach',
    meaning: 'mentor',
    habit: 'coach',
    exploration: 'mentor'
  }
};

async function validate() {
  console.log('🔍 Phase 3 V2 数据验证开始...\n');

  let allPass = true;

  // 1. 验证目标类型数量
  console.log('📊 检查 1: 目标类型数量');
  const { data: goalTypes, error: gtError } = await supabase
    .from('goal_types')
    .select('code, name_zh, default_persona_code')
    .eq('is_active', true);

  if (gtError || !goalTypes) {
    console.error('❌ 无法读取 goal_types 表');
    allPass = false;
  } else {
    const count = goalTypes.length;
    if (count === EXPECTED.goal_types) {
      console.log(`✅ 目标类型数量正确: ${count} 种\n`);
    } else {
      console.error(`❌ 目标类型数量错误: 期望 ${EXPECTED.goal_types}，实际 ${count}\n`);
      allPass = false;
    }
  }

  // 2. 验证 AI 人格数量和类型分布
  console.log('📊 检查 2: AI 人格数量和类型分布');
  const { data: personas, error: pError } = await supabase
    .from('ai_personas')
    .select('code, name_zh, persona_type, parent_persona_code')
    .eq('is_active', true);

  if (pError || !personas) {
    console.error('❌ 无法读取 ai_personas 表');
    allPass = false;
  } else {
    const stats = {
      total: personas.length,
      core: personas.filter(p => p.persona_type === 'core').length,
      extended: personas.filter(p => p.persona_type === 'extended').length,
      variant: personas.filter(p => p.persona_type === 'variant').length
    };

    console.log(`总计: ${stats.total} 种（期望 ${EXPECTED.personas.total}）`);
    console.log(`  - 核心: ${stats.core} 种（期望 ${EXPECTED.personas.core}）`);
    console.log(`  - 扩展: ${stats.extended} 种（期望 ${EXPECTED.personas.extended}）`);
    console.log(`  - 变体: ${stats.variant} 种（期望 ${EXPECTED.personas.variant}）`);

    if (
      stats.total === EXPECTED.personas.total &&
      stats.core === EXPECTED.personas.core &&
      stats.extended === EXPECTED.personas.extended &&
      stats.variant === EXPECTED.personas.variant
    ) {
      console.log('✅ AI 人格数量和类型分布正确\n');
    } else {
      console.error('❌ AI 人格数量或类型分布错误\n');
      allPass = false;
    }
  }

  // 3. 验证人格继承关系
  console.log('📊 检查 3: 人格继承关系');
  if (personas) {
    let inheritancePass = true;

    for (const [child, parent] of Object.entries(EXPECTED.inheritance)) {
      const persona = personas.find(p => p.code === child);
      if (!persona) {
        console.error(`❌ 缺少人格: ${child}`);
        inheritancePass = false;
      } else if (persona.parent_persona_code !== parent) {
        console.error(`❌ ${child} 的父人格错误: 期望 ${parent}，实际 ${persona.parent_persona_code}`);
        inheritancePass = false;
      } else {
        console.log(`✅ ${child.padEnd(15)} ← ${parent}`);
      }
    }

    if (inheritancePass) {
      console.log('✅ 所有人格继承关系正确\n');
    } else {
      allPass = false;
      console.log('');
    }
  }

  // 4. 验证核心人格的 parent_persona_code 为 NULL
  console.log('📊 检查 4: 核心人格的父人格字段');
  if (personas) {
    const corePersonas = personas.filter(p => p.persona_type === 'core');
    const invalidCores = corePersonas.filter(p => p.parent_persona_code !== null);

    if (invalidCores.length === 0) {
      console.log(`✅ 所有 ${corePersonas.length} 个核心人格的 parent_persona_code 为 NULL\n`);
    } else {
      console.error('❌ 以下核心人格的 parent_persona_code 不为 NULL:');
      invalidCores.forEach(p => {
        console.error(`   ${p.code} (${p.name_zh}) → ${p.parent_persona_code}`);
      });
      allPass = false;
      console.log('');
    }
  }

  // 5. 验证目标类型的人格映射
  console.log('📊 检查 5: 关键目标类型的人格映射');
  if (goalTypes) {
    let mappingPass = true;

    for (const [goalCode, expectedPersona] of Object.entries(EXPECTED.goal_mapping)) {
      const goal = goalTypes.find(g => g.code === goalCode);
      if (!goal) {
        console.error(`❌ 缺少目标类型: ${goalCode}`);
        mappingPass = false;
      } else if (goal.default_persona_code !== expectedPersona) {
        console.error(`❌ ${goalCode.padEnd(15)} → 期望 ${expectedPersona}，实际 ${goal.default_persona_code}`);
        mappingPass = false;
      } else {
        console.log(`✅ ${goalCode.padEnd(15)} → ${expectedPersona}`);
      }
    }

    if (mappingPass) {
      console.log('✅ 所有关键目标类型的人格映射正确\n');
    } else {
      allPass = false;
      console.log('');
    }
  }

  // 6. 详细列表（可选）
  console.log('📋 完整人格列表：\n');
  if (personas) {
    const corePersonas = personas.filter(p => p.persona_type === 'core').sort((a, b) => a.code.localeCompare(b.code));
    const extendedPersonas = personas.filter(p => p.persona_type === 'extended').sort((a, b) => a.code.localeCompare(b.code));
    const variantPersonas = personas.filter(p => p.persona_type === 'variant').sort((a, b) => a.code.localeCompare(b.code));

    console.log('🎯 核心人格 (Core):');
    corePersonas.forEach((p, i) => {
      console.log(`  ${(i + 1).toString().padStart(2)}. ${p.code.padEnd(15)} ${p.name_zh}`);
    });

    console.log('\n🎨 扩展人格 (Extended):');
    extendedPersonas.forEach((p, i) => {
      console.log(`  ${(i + 11).toString().padStart(2)}. ${p.code.padEnd(15)} ${p.name_zh.padEnd(12)} ← ${p.parent_persona_code}`);
    });

    console.log('\n📋 变体人格 (Variant):');
    variantPersonas.forEach((p, i) => {
      console.log(`  ${(i + 14).toString().padStart(2)}. ${p.code.padEnd(15)} ${p.name_zh.padEnd(12)} ← ${p.parent_persona_code}`);
    });
  }

  // 最终结果
  console.log('\n' + '='.repeat(60));
  if (allPass) {
    console.log('🎉 所有验证通过！Phase 3 V2 架构正确。');
  } else {
    console.log('❌ 部分验证失败，请检查上述错误。');
    process.exit(1);
  }
  console.log('='.repeat(60));
}

validate();

