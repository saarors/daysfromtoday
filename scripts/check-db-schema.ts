/**
 * 检查数据库表结构
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchema() {
  console.log('🔍 检查数据库表结构...\n');

  // 获取 ai_personas 表的一条记录，看看实际有哪些字段
  const { data, error } = await supabase
    .from('ai_personas')
    .select('*')
    .limit(1);

  if (error) {
    console.log('❌ 查询失败:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('⚠️  表中没有数据');
    return;
  }

  console.log('📊 ai_personas 表实际字段:');
  const fields = Object.keys(data[0]);
  fields.forEach((field, index) => {
    console.log(`  ${index + 1}. ${field}: ${typeof data[0][field]}`);
  });

  console.log('\n📝 示例数据:');
  console.log(JSON.stringify(data[0], null, 2));
}

checkSchema().catch(console.error);

