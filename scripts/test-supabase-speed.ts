/**
 * 测试 Supabase 查询速度
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testQuery() {
  console.log('🧪 测试 Supabase 查询速度...\n');
  console.log('📍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('');

  // 测试 1: 简单查询
  console.log('📊 测试 1: 查询 goal_types 表（无条件）');
  const start1 = Date.now();
  const { data: data1, error: error1 } = await supabase
    .from('goal_types')
    .select('code, name_zh, name_en')
    .limit(5);
  const time1 = Date.now() - start1;
  console.log(`⏱️  耗时: ${time1}ms`);
  console.log(`📦 结果: ${error1 ? '❌ ' + error1.message : `✅ ${data1?.length} 条记录`}`);
  console.log('');

  // 测试 2: 带条件查询
  console.log('📊 测试 2: 查询 goal_types 表（is_active=true + 排序）');
  const start2 = Date.now();
  const { data: data2, error: error2 } = await supabase
    .from('goal_types')
    .select('code, name_zh, name_en, keywords_zh, keywords_en, default_persona_code, characteristics')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  const time2 = Date.now() - start2;
  console.log(`⏱️  耗时: ${time2}ms`);
  console.log(`📦 结果: ${error2 ? '❌ ' + error2.message : `✅ ${data2?.length} 条记录`}`);
  console.log('');

  // 测试 3: 查询 ai_personas
  console.log('📊 测试 3: 查询 ai_personas 表');
  const start3 = Date.now();
  const { data: data3, error: error3 } = await supabase
    .from('ai_personas')
    .select('code, name_zh, name_en, avatar_emoji, persona_type')
    .eq('is_active', true);
  const time3 = Date.now() - start3;
  console.log(`⏱️  耗时: ${time3}ms`);
  console.log(`📦 结果: ${error3 ? '❌ ' + error3.message : `✅ ${data3?.length} 条记录`}`);
  console.log('');

  // 测试 4: 连续查询 5 次（测试缓存）
  console.log('📊 测试 4: 连续查询 5 次（测试 Supabase 端缓存）');
  const times: number[] = [];
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    await supabase
      .from('goal_types')
      .select('code, name_zh')
      .eq('is_active', true)
      .limit(1);
    const time = Date.now() - start;
    times.push(time);
    console.log(`  第 ${i + 1} 次: ${time}ms`);
  }
  const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  console.log(`  平均: ${avgTime}ms`);
  console.log('');

  // 总结
  console.log('============================================================');
  console.log('📈 性能总结:');
  console.log(`  - 简单查询: ${time1}ms`);
  console.log(`  - 复杂查询: ${time2}ms`);
  console.log(`  - AI 人格查询: ${time3}ms`);
  console.log(`  - 平均响应时间: ${avgTime}ms`);
  console.log('');
  
  if (avgTime > 1000) {
    console.log('⚠️  警告: 响应时间 > 1 秒，可能原因:');
    console.log('  1. Supabase 免费套餐数据库休眠（首次访问需要唤醒）');
    console.log('  2. 网络延迟（ISP 问题或 Supabase 区域距离）');
    console.log('  3. 数据库索引缺失');
    console.log('  4. Row Level Security (RLS) 策略复杂');
  } else if (avgTime > 500) {
    console.log('⚠️  响应时间偏高（> 500ms），但可接受');
  } else {
    console.log('✅ 响应时间正常（< 500ms）');
  }
  console.log('============================================================');
}

testQuery().catch(console.error);

