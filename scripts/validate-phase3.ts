/**
 * Phase 3 验收测试脚本
 * 
 * 功能：
 * 1. 检查数据库表是否存在
 * 2. 验证提示词库完整性（6 条）
 * 3. 测试提示词匹配逻辑
 * 4. 检查 RPC 函数
 * 
 * 使用方法：
 * npx tsx scripts/validate-phase3.ts
 */

import { createClient } from '@supabase/supabase-js';
import { detectLanguage, calculateStage } from '../lib/ai-prompt-matcher';
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
// 测试工具函数
// =========================================
async function testTableExists(tableName: string): Promise<boolean> {
  const { error } = await supabase
    .from(tableName)
    .select('id')
    .limit(1);
  
  return !error;
}

async function testRpcFunction(functionName: string): Promise<boolean> {
  try {
    // 尝试调用函数（使用测试 UUID）
    const testUuid = '00000000-0000-0000-0000-000000000000';
    await supabase.rpc(functionName, { p_user_id: testUuid });
    return true;
  } catch (error) {
    return false;
  }
}

// =========================================
// 主测试流程
// =========================================
async function runValidation() {
  console.log('🧪 Phase 3 验收测试\n');
  console.log('='.repeat(60));
  
  let passedTests = 0;
  let totalTests = 0;
  
  // =========================================
  // 测试 1: 数据库表检查
  // =========================================
  console.log('\n📊 测试 1: 数据库表检查');
  console.log('-'.repeat(60));
  
  const tables = [
    'goal_cards',
    'ai_prompt_templates',
    'ai_api_logs',
    'profiles',
  ];
  
  for (const table of tables) {
    totalTests++;
    const exists = await testTableExists(table);
    if (exists) {
      console.log(`✅ ${table.padEnd(25)} → 存在`);
      passedTests++;
    } else {
      console.log(`❌ ${table.padEnd(25)} → 不存在`);
    }
  }
  
  // =========================================
  // 测试 2: 提示词库完整性
  // =========================================
  console.log('\n📝 测试 2: 提示词库完整性');
  console.log('-'.repeat(60));
  
  const { data: prompts, error: promptError } = await supabase
    .from('ai_prompt_templates')
    .select('*')
    .eq('is_active', true);
  
  totalTests++;
  if (promptError) {
    console.log('❌ 无法查询提示词表:', promptError.message);
  } else {
    const requiredPrompts = [
      { assistant: 'twinkle', lang: 'zh' },
      { assistant: 'twinkle', lang: 'en' },
      { assistant: 'labubu', lang: 'zh' },
      { assistant: 'labubu', lang: 'en' },
      { assistant: 'jobs', lang: 'zh' },
      { assistant: 'jobs', lang: 'en' },
    ];
    
    let allFound = true;
    
    for (const req of requiredPrompts) {
      const found = prompts?.find(
        p => p.assistant_type === req.assistant && p.output_language === req.lang
      );
      
      totalTests++;
      if (found) {
        console.log(`✅ ${req.assistant.padEnd(10)} × ${req.lang.padEnd(5)} → 存在`);
        passedTests++;
      } else {
        console.log(`❌ ${req.assistant.padEnd(10)} × ${req.lang.padEnd(5)} → 缺失`);
        allFound = false;
      }
    }
    
    if (allFound) {
      console.log(`\n✅ 提示词库完整：共 ${prompts?.length} 条`);
      passedTests++;
    } else {
      console.log(`\n❌ 提示词库不完整`);
    }
  }
  
  // =========================================
  // 测试 3: 提示词匹配逻辑
  // =========================================
  console.log('\n🔍 测试 3: 提示词匹配逻辑');
  console.log('-'.repeat(60));
  
  const testCases = [
    { input: '我想学习 TypeScript', expected: 'zh' },
    { input: 'I want to learn TypeScript', expected: 'en' },
    { input: '30天后我要完成项目', expected: 'zh' },
    { input: 'Complete project in 30 days', expected: 'en' },
  ];
  
  for (const testCase of testCases) {
    totalTests++;
    const detected = detectLanguage(testCase.input);
    if (detected === testCase.expected) {
      console.log(`✅ "${testCase.input.substring(0, 30)}..." → ${detected}`);
      passedTests++;
    } else {
      console.log(`❌ "${testCase.input.substring(0, 30)}..." → ${detected} (期望: ${testCase.expected})`);
    }
  }
  
  // =========================================
  // 测试 4: RPC 函数检查
  // =========================================
  console.log('\n🔧 测试 4: RPC 函数检查');
  console.log('-'.repeat(60));
  
  const rpcFunctions = [
    'increment_goal_cards_count',
    'decrement_goal_cards_count',
    'check_goal_cards_quota',
    'get_user_quota',
  ];
  
  for (const func of rpcFunctions) {
    totalTests++;
    const exists = await testRpcFunction(func);
    if (exists) {
      console.log(`✅ ${func.padEnd(30)} → 可调用`);
      passedTests++;
    } else {
      console.log(`❌ ${func.padEnd(30)} → 不存在或不可调用`);
    }
  }
  
  // =========================================
  // 测试 5: 阶段计算逻辑
  // =========================================
  console.log('\n📅 测试 5: 阶段计算逻辑（Phase 3 简化版）');
  console.log('-'.repeat(60));
  
  const stageCases = [7, 30, 90, 365];
  
  for (const days of stageCases) {
    totalTests++;
    const stage = calculateStage(days);
    if (stage === 'start') {
      console.log(`✅ ${days} 天 → ${stage}`);
      passedTests++;
    } else {
      console.log(`❌ ${days} 天 → ${stage} (期望: start)`);
    }
  }
  
  // =========================================
  // 测试总结
  // =========================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果总结');
  console.log('='.repeat(60));
  console.log(`通过测试: ${passedTests} / ${totalTests}`);
  
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  console.log(`通过率: ${passRate}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 所有测试通过！Phase 3.1 & 3.2 验收成功！');
    console.log('\n下一步：开发 Phase 3.3 - DeepSeek API 接入');
    process.exit(0);
  } else {
    console.log('\n⚠️  部分测试失败，请检查上述错误');
    console.log('参考文档: docs/PHASE3_SETUP_GUIDE.md');
    process.exit(1);
  }
}

// 运行验证
runValidation();

