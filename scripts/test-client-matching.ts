/**
 * 测试客户端 AI 匹配功能
 * 模拟浏览器环境调用 matchGoalToAI
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// 加载环境变量
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// 动态导入（客户端代码）
async function testClientMatching() {
  console.log('🧪 测试客户端 AI 匹配功能\n');
  
  // 检查环境变量
  console.log('📋 环境变量检查:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌');
  console.log('');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ 缺少 Supabase 环境变量');
    process.exit(1);
  }
  
  try {
    // 测试简单的 Supabase 查询
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    
    console.log('🔍 测试 1: 查询 goal_types 表');
    const { data: goalTypes, error: error1 } = await supabase
      .from('goal_types')
      .select('code, name_zh')
      .limit(3);
    
    if (error1) {
      console.error('❌ 查询失败:', error1.message);
    } else {
      console.log(`✅ 成功查询到 ${goalTypes?.length || 0} 条数据`);
      console.log('  示例:', goalTypes?.map(g => g.code).join(', '));
    }
    console.log('');
    
    console.log('🔍 测试 2: 查询 ai_personas 表');
    const { data: personas, error: error2 } = await supabase
      .from('ai_personas')
      .select('code, name_zh')
      .limit(3);
    
    if (error2) {
      console.error('❌ 查询失败:', error2.message);
    } else {
      console.log(`✅ 成功查询到 ${personas?.length || 0} 条数据`);
      console.log('  示例:', personas?.map(p => p.code).join(', '));
    }
    console.log('');
    
    // 测试完整匹配流程
    console.log('🎯 测试 3: 完整 AI 匹配流程');
    const { matchGoalToAI } = await import('@/lib/ai-matching');
    
    const startTime = Date.now();
    const result = await matchGoalToAI({
      goalText: '我要三个月减肥10斤',
      daysCount: 90
    });
    const duration = Date.now() - startTime;
    
    console.log(`✅ 匹配成功！耗时: ${duration}ms`);
    console.log('  目标类型:', result.goalType.code, '-', result.goalType.name);
    console.log('  难度级别:', result.difficulty.level);
    console.log('  AI 助手:', result.persona.code, result.persona.emoji, result.persona.name);
    console.log('  语言:', result.metadata.language);
    console.log('');
    
    console.log('✅ 所有测试通过！');
    
  } catch (error: any) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

testClientMatching();

