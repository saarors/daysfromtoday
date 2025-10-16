/**
 * Supabase 配置验证脚本
 * 检查数据库表、RLS 策略、Google OAuth 配置
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface VerificationResult {
  category: string;
  item: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

const results: VerificationResult[] = [];

function logResult(category: string, item: string, status: 'success' | 'warning' | 'error', message: string) {
  results.push({ category, item, status, message });
  
  const icon = status === 'success' ? '✅' : status === 'warning' ? '⚠️' : '❌';
  const color = status === 'success' ? '\x1b[32m' : status === 'warning' ? '\x1b[33m' : '\x1b[31m';
  const reset = '\x1b[0m';
  
  console.log(`${color}${icon} [${category}] ${item}: ${message}${reset}`);
}

async function verifyEnvironmentVariables() {
  console.log('\n🔍 检查环境变量...\n');
  
  if (!SUPABASE_URL) {
    logResult('环境变量', 'NEXT_PUBLIC_SUPABASE_URL', 'error', '未配置');
    return false;
  }
  logResult('环境变量', 'NEXT_PUBLIC_SUPABASE_URL', 'success', SUPABASE_URL);
  
  if (!SUPABASE_ANON_KEY) {
    logResult('环境变量', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'error', '未配置');
    return false;
  }
  logResult('环境变量', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'success', `${SUPABASE_ANON_KEY.substring(0, 20)}...`);
  
  if (!SUPABASE_SERVICE_KEY) {
    logResult('环境变量', 'SUPABASE_SERVICE_ROLE_KEY', 'warning', '未配置（可选，但建议配置）');
  } else {
    logResult('环境变量', 'SUPABASE_SERVICE_ROLE_KEY', 'success', `${SUPABASE_SERVICE_KEY.substring(0, 20)}...`);
  }
  
  return true;
}

async function verifyDatabaseTables() {
  console.log('\n🗄️ 检查数据库表...\n');
  
  const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  
  const expectedTables = [
    { name: 'users', description: '用户信息表' },
    { name: 'goal_cards', description: '目标卡片表' },
    { name: 'card_likes', description: '点赞记录表' },
    { name: 'card_comments', description: '评论表' },
    { name: 'custom_templates', description: '自定义模板表' },
  ];
  
  for (const table of expectedTables) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          logResult('数据库表', table.name, 'error', `表不存在（${table.description}）`);
        } else if (error.message.includes('JWT')) {
          logResult('数据库表', table.name, 'warning', `无法验证（RLS 已启用，这是正常的）`);
        } else {
          logResult('数据库表', table.name, 'warning', `访问受限（${error.message}）`);
        }
      } else {
        logResult('数据库表', table.name, 'success', `${table.description} - 创建成功`);
      }
    } catch (err) {
      logResult('数据库表', table.name, 'error', `检查失败: ${err}`);
    }
  }
}

async function verifyRLSPolicies() {
  console.log('\n🔒 检查 RLS 策略...\n');
  
  if (!SUPABASE_SERVICE_KEY) {
    logResult('RLS 策略', '验证', 'warning', '需要 service_role key 才能验证，跳过此检查');
    return;
  }
  
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY);
  
  try {
    // 查询 pg_policies 表检查 RLS 策略
    const { data, error } = await supabase
      .from('pg_policies')
      .select('*')
      .in('tablename', ['users', 'goal_cards', 'card_likes', 'card_comments', 'custom_templates']);
    
    if (error) {
      logResult('RLS 策略', '查询', 'warning', `无法查询策略（这是正常的）: ${error.message}`);
    } else if (data && data.length > 0) {
      logResult('RLS 策略', '总数', 'success', `找到 ${data.length} 个 RLS 策略`);
    } else {
      logResult('RLS 策略', '总数', 'warning', '未找到 RLS 策略');
    }
  } catch (err) {
    logResult('RLS 策略', '验证', 'warning', '无法验证 RLS 策略（使用 Supabase Dashboard 手动检查）');
  }
}

async function verifyAuthProviders() {
  console.log('\n🔐 检查认证提供商配置...\n');
  
  // 注意：无法直接通过 API 查询认证提供商配置
  // 需要手动在 Dashboard 中验证
  
  logResult('认证提供商', 'Google OAuth', 'warning', '请在 Supabase Dashboard → Authentication → Providers 中手动验证');
  logResult('认证提供商', 'Email (Magic Link)', 'warning', '请在 Supabase Dashboard → Authentication → Providers 中手动验证');
  
  // 测试认证功能
  const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  
  try {
    // 尝试获取会话（未登录时应该返回 null）
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logResult('认证功能', '会话管理', 'error', `错误: ${error.message}`);
    } else {
      logResult('认证功能', '会话管理', 'success', session ? '已登录' : '认证系统正常（未登录状态）');
    }
  } catch (err) {
    logResult('认证功能', '会话管理', 'error', `检查失败: ${err}`);
  }
}

async function verifyDatabaseFunctions() {
  console.log('\n⚙️ 检查数据库函数和触发器...\n');
  
  const expectedFunctions = [
    'handle_new_user',
    'update_user_card_count',
    'update_card_like_count',
    'update_updated_at_column',
  ];
  
  for (const func of expectedFunctions) {
    logResult('数据库函数', func, 'warning', '请在 Supabase Dashboard → Database → Functions 中手动验证');
  }
}

async function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 验证总结\n');
  
  const successCount = results.filter(r => r.status === 'success').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  
  console.log(`✅ 成功: ${successCount}`);
  console.log(`⚠️  警告: ${warningCount}`);
  console.log(`❌ 错误: ${errorCount}`);
  
  console.log('\n' + '='.repeat(80));
  
  if (errorCount > 0) {
    console.log('\n❌ 发现错误，请检查以下问题：\n');
    results
      .filter(r => r.status === 'error')
      .forEach(r => {
        console.log(`   • [${r.category}] ${r.item}: ${r.message}`);
      });
  }
  
  if (errorCount === 0 && warningCount <= 5) {
    console.log('\n🎉 Supabase 配置基本完成！');
    console.log('\n建议手动验证以下项目：');
    console.log('   1. Supabase Dashboard → Table Editor: 确认 5 个表存在');
    console.log('   2. Supabase Dashboard → Authentication → Providers: 确认 Google 已启用');
    console.log('   3. Supabase Dashboard → Database → Functions: 确认触发器已创建');
  } else if (errorCount === 0) {
    console.log('\n⚠️  配置部分完成，请检查警告项');
  } else {
    console.log('\n❌ 配置未完成，请修复错误后重新运行');
  }
  
  console.log('\n');
}

async function main() {
  console.log('🚀 开始验证 Supabase 配置...\n');
  console.log('='.repeat(80));
  
  const hasEnvVars = await verifyEnvironmentVariables();
  
  if (!hasEnvVars) {
    console.log('\n❌ 环境变量配置不完整，无法继续验证');
    process.exit(1);
  }
  
  await verifyDatabaseTables();
  await verifyRLSPolicies();
  await verifyAuthProviders();
  await verifyDatabaseFunctions();
  
  await printSummary();
}

main().catch(console.error);

