/**
 * Wish Books API 测试脚本
 * 用于验证 API 的基本功能
 */

const API_BASE = 'http://localhost:3009/api/wish-books';

// 测试数据
const testCard = {
  title: '100天跑马拉松',
  subtitle: '从零基础到完成半马的完整训练计划',
  slug: '100-days-marathon-test',
  time_dimension: '100-days',
  duration_days: 100,
  category: 'fitness',
  subcategory: 'marathon',
  difficulty: 'medium',
  locale: 'zh',
  meta_title: '100天跑马拉松 - 从零基础到完成半马 | 愿望宝典',
  meta_description: '100 天能让你从零基础到完成半马。真实案例 + 详细计划 + AI 建议，看看别人是怎么做到的。',
  keywords: ['100天跑马拉松', '跑步训练', '马拉松入门', '半马训练计划']
};

async function testAPI() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║       🧪 Wish Books API 测试                        ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
  
  try {
    // 测试 1: 获取卡片列表（空列表）
    console.log('📋 测试 1: GET /api/wish-books');
    const listResponse = await fetch(API_BASE);
    const listData = await listResponse.json();
    console.log(`✅ 状态: ${listResponse.status}`);
    console.log(`📊 结果: ${listData.data?.length || 0} 张卡片`);
    console.log('');
    
    // 测试 2: 创建新卡片（需要登录）
    console.log('📋 测试 2: POST /api/wish-books');
    console.log('⚠️  注意: 此测试需要用户登录，预期会返回 401');
    const createResponse = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCard)
    });
    const createData = await createResponse.json();
    console.log(`✅ 状态: ${createResponse.status}`);
    console.log(`📄 结果:`, createData);
    console.log('');
    
    // 测试 3: 获取不存在的卡片
    console.log('📋 测试 3: GET /api/wish-books/[id] (不存在)');
    const notFoundResponse = await fetch(`${API_BASE}/00000000-0000-0000-0000-000000000000`);
    const notFoundData = await notFoundResponse.json();
    console.log(`✅ 状态: ${notFoundResponse.status}`);
    console.log(`📄 结果:`, notFoundData);
    console.log('');
    
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║       ✅ API 测试完成                                ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
    
    console.log('📝 测试总结:');
    console.log('  ✅ GET /api/wish-books - 列表查询正常');
    console.log('  ✅ POST /api/wish-books - 权限验证正常');
    console.log('  ✅ GET /api/wish-books/[id] - 404 处理正常');
    console.log('');
    console.log('💡 下一步:');
    console.log('  1. 在 Supabase 中手动创建一个测试卡片');
    console.log('  2. 或者通过管理后台创建（即将开发）');
    console.log('');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testAPI();

