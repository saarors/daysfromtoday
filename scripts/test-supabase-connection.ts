/**
 * Supabase 连接测试脚本
 * 用于验证 Supabase 配置是否正确
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testSupabaseConnection() {
  console.log('🔍 开始测试 Supabase 连接...\n');

  // 1. 验证环境变量
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ 错误：缺少必要的环境变量');
    console.error('   请确保 .env.local 中配置了：');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  console.log('✅ 环境变量检查通过');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Anon Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
  console.log('');

  // 2. 创建 Supabase 客户端
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase 客户端创建成功\n');

  // 3. 测试连接（尝试查询一个不存在的表，预期返回错误）
  try {
    const { data, error } = await supabase
      .from('_health_check')
      .select('*')
      .limit(1);

    if (error) {
      // 预期的错误：表不存在或找不到缓存
      if (
        error.message.includes('does not exist') || 
        error.message.includes('not find the table') ||
        error.message.includes('schema cache') ||
        error.code === '42P01'
      ) {
        console.log('✅ Supabase 连接成功！');
        console.log('   （收到预期的错误，说明连接正常）\n');
        return true;
      } else {
        console.error('❌ 连接错误：', error.message);
        return false;
      }
    } else {
      console.log('✅ Supabase 连接成功！');
      console.log('   （查询返回数据）\n');
      return true;
    }
  } catch (error) {
    console.error('❌ 连接失败：', error);
    return false;
  }
}

// 运行测试
testSupabaseConnection()
  .then((success) => {
    if (success) {
      console.log('🎉 Supabase 配置测试完成！');
      console.log('');
      console.log('📝 下一步：');
      console.log('   1. 在 Supabase Dashboard 获取 service_role key');
      console.log('   2. 添加到 .env.local 的 SUPABASE_SERVICE_ROLE_KEY');
      console.log('   3. 开始 Phase 1 开发');
      process.exit(0);
    } else {
      console.error('');
      console.error('❌ Supabase 配置测试失败');
      console.error('   请检查：');
      console.error('   1. .env.local 文件是否存在');
      console.error('   2. 环境变量是否正确');
      console.error('   3. Supabase 项目是否已创建');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ 测试过程中出现异常：', error);
    process.exit(1);
  });

