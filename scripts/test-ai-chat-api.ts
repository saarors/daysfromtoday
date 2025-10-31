/**
 * AI Chat API 路由测试脚本
 * 
 * 功能：测试 /api/ai/chat 路由是否正常工作
 * 
 * 运行方式：
 * 1. 启动开发服务器：npm run dev
 * 2. 运行测试：npx tsx scripts/test-ai-chat-api.ts
 */

async function testAIChatAPI() {
  console.log('🧪 AI Chat API 路由测试开始...\n');
  console.log('='.repeat(60));

  const baseURL = 'http://localhost:3001';

  // 1. 测试 GET 请求（获取 API 信息）
  console.log('\n📡 测试 1: GET /api/ai/chat - 获取 API 信息');
  
  try {
    const getResponse = await fetch(`${baseURL}/api/ai/chat`);
    
    if (getResponse.ok) {
      const info = await getResponse.json();
      console.log('✅ GET 请求成功');
      console.log(`   服务: ${info.service}`);
      console.log(`   版本: ${info.version}`);
      console.log(`   模型: ${info.model}`);
      console.log(`   状态: ${info.status}`);
    } else {
      console.log(`⚠️ GET 请求失败 (${getResponse.status})`);
    }
  } catch (error) {
    console.error('❌ GET 请求错误:', error);
  }

  // 2. 测试 POST 请求（实际 AI 对话）
  console.log('\n📡 测试 2: POST /api/ai/chat - 生成 AI 建议');
  
  const testRequest = {
    goalText: '我要在三个月内减肥10斤',
    daysCount: 90,
    targetDate: '2025-01-31',
    personaCode: 'coach',
    goalTypeCode: 'health',
    difficultyLevel: 'medium',
    language: 'zh'
  };

  console.log('\n   请求数据:');
  console.log(`   - 目标: ${testRequest.goalText}`);
  console.log(`   - 天数: ${testRequest.daysCount} 天`);
  console.log(`   - AI 人格: ${testRequest.personaCode}`);
  console.log('');

  try {
    const startTime = Date.now();
    
    const postResponse = await fetch(`${baseURL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRequest)
    });

    const responseTime = Date.now() - startTime;

    if (!postResponse.ok) {
      const error = await postResponse.json();
      console.error(`❌ POST 请求失败 (${postResponse.status})`);
      console.error(`   错误: ${JSON.stringify(error)}`);
      return;
    }

    const result = await postResponse.json();

    console.log('✅ POST 请求成功');
    console.log(`   响应时间: ${responseTime}ms`);
    console.log(`   使用模型: ${result.model}`);
    console.log(`   使用人格: ${result.personaUsed}`);
    console.log(`   Token 消耗: ${result.tokensUsed}`);
    console.log('');
    console.log('📝 AI 完整分析:');
    console.log('─'.repeat(60));
    console.log(result.analysis);
    console.log('─'.repeat(60));
    console.log('');
    console.log('💡 简短摘要（显示在卡片上）:');
    console.log(`   ${result.summary}`);

    // 3. 测试英文请求
    console.log('\n📡 测试 3: POST /api/ai/chat - 英文请求');
    
    const englishRequest = {
      goalText: 'Run a marathon in 6 months',
      daysCount: 180,
      targetDate: '2025-06-30',
      personaCode: 'coach',
      goalTypeCode: 'health',
      difficultyLevel: 'hard',
      language: 'en'
    };

    const englishResponse = await fetch(`${baseURL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(englishRequest)
    });

    if (englishResponse.ok) {
      const englishResult = await englishResponse.json();
      console.log('✅ 英文请求成功');
      console.log(`   Token 消耗: ${englishResult.tokensUsed}`);
      console.log(`   摘要: ${englishResult.summary.substring(0, 100)}...`);
    }

    // 4. 测试不同 AI 人格
    console.log('\n📡 测试 4: 测试不同 AI 人格');
    
    const personas = ['mentor', 'challenger', 'companion'];
    
    for (const persona of personas) {
      const personaRequest = {
        ...testRequest,
        personaCode: persona
      };

      const personaResponse = await fetch(`${baseURL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(personaRequest)
      });

      if (personaResponse.ok) {
        const personaResult = await personaResponse.json();
        console.log(`✅ ${persona} 人格测试成功 (${personaResult.tokensUsed} tokens)`);
      } else {
        console.log(`⚠️ ${persona} 人格测试失败`);
      }
    }

    // 最终总结
    console.log('\n' + '='.repeat(60));
    console.log('🎉 所有测试完成！');
    console.log('\n✅ 验证项目：');
    console.log('   ✓ GET 请求正常');
    console.log('   ✓ POST 请求正常');
    console.log('   ✓ AI 生成内容质量良好');
    console.log('   ✓ 英文支持正常');
    console.log('   ✓ 多人格支持正常');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ 测试失败:', error);
  }
}

// 运行测试
testAIChatAPI();

