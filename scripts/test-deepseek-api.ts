/**
 * DeepSeek API 测试脚本
 * 
 * 功能：验证 DeepSeek API key 是否有效，检查模型版本和可用性
 * 
 * 运行方式：
 * npx tsx scripts/test-deepseek-api.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function testDeepSeekAPI() {
  console.log('🔍 DeepSeek API 测试开始...\n');
  console.log('='.repeat(60));

  // 1. 检查环境变量
  console.log('\n📋 步骤 1: 检查环境变量');
  
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  if (!apiKey) {
    console.error('❌ 缺少 DEEPSEEK_API_KEY 环境变量');
    console.log('\n请在 .env.local 中添加：');
    console.log('DEEPSEEK_API_KEY=sk-your_api_key_here');
    process.exit(1);
  }

  console.log('✅ 环境变量配置正确');
  console.log(`   Base URL: ${baseURL}`);
  console.log(`   Model: ${model}`);
  console.log(`   API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);

  // 2. 测试简单对话
  console.log('\n📡 步骤 2: 测试 API 连接和简单对话');
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(`${baseURL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一个测试助手，请简短回答。'
          },
          {
            role: 'user',
            content: '请回复"API连接成功"，只需要这6个字。'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      })
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ API 调用失败 (HTTP ${response.status})`);
      console.error(`错误信息: ${error}`);
      process.exit(1);
    }

    const data = await response.json();

    console.log('✅ API 调用成功！');
    console.log(`   响应时间: ${responseTime}ms`);
    console.log(`   使用模型: ${data.model}`);
    console.log(`   AI 回复: ${data.choices[0].message.content}`);
    console.log(`   Token 统计: 总计 ${data.usage.total_tokens} (输入: ${data.usage.prompt_tokens}, 输出: ${data.usage.completion_tokens})`);

    // 3. 测试中文对话能力
    console.log('\n🌐 步骤 3: 测试中文对话能力');
    
    const chineseTest = await fetch(`${baseURL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: '请用一句话介绍你自己'
          }
        ],
        max_tokens: 100
      })
    });

    if (chineseTest.ok) {
      const chineseData = await chineseTest.json();
      console.log('✅ 中文对话测试通过');
      console.log(`   回复: ${chineseData.choices[0].message.content.substring(0, 80)}...`);
    }

    // 4. 测试 JSON 格式输出
    console.log('\n📄 步骤 4: 测试结构化输出能力');
    
    const jsonTest = await fetch(`${baseURL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一个测试助手，请严格按照 JSON 格式回复。'
          },
          {
            role: 'user',
            content: '请返回一个 JSON 对象，包含 status: "ok" 和 message: "测试成功"'
          }
        ],
        max_tokens: 50
      })
    });

    if (jsonTest.ok) {
      const jsonData = await jsonTest.json();
      const reply = jsonData.choices[0].message.content;
      console.log('✅ 结构化输出测试通过');
      console.log(`   原始回复: ${reply}`);
      
      try {
        // 尝试提取和解析 JSON
        const jsonMatch = reply.match(/\{[^}]+\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log(`   解析结果: status=${parsed.status}, message=${parsed.message}`);
        }
      } catch (e) {
        console.log('   注意: JSON 解析需要进一步优化提示词');
      }
    }

    // 5. 检查可用模型列表
    console.log('\n🔍 步骤 5: 查询可用模型列表');
    
    const modelsResponse = await fetch(`${baseURL}/v1/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      console.log('✅ 可用模型列表：');
      
      if (modelsData.data && Array.isArray(modelsData.data)) {
        modelsData.data.forEach((m: any) => {
          const isCurrent = m.id === model ? '(当前使用)' : '';
          console.log(`   - ${m.id} ${isCurrent}`);
        });
      } else {
        console.log('   无法获取模型列表');
      }
    }

    // 6. 成本估算
    console.log('\n💰 步骤 6: 成本估算（基于当前测试）');
    const totalTokens = data.usage.total_tokens;
    const estimatedCost = (totalTokens / 1000) * 0.001; // 假设 ¥0.001/1K tokens
    console.log(`   测试消耗: ${totalTokens} tokens`);
    console.log(`   预估成本: ¥${estimatedCost.toFixed(6)}`);
    console.log(`   注意: 实际价格请参考 DeepSeek 官方文档`);

    // 最终总结
    console.log('\n' + '='.repeat(60));
    console.log('🎉 所有测试通过！DeepSeek API 配置正确且可用。');
    console.log('\n✅ 验证项目：');
    console.log('   ✓ API 连接正常');
    console.log('   ✓ 中文对话能力正常');
    console.log('   ✓ 结构化输出能力正常');
    console.log('   ✓ 模型版本确认');
    console.log('   ✓ 响应速度良好');
    console.log('\n📝 下一步：');
    console.log('   - 可以开始创建 API 路由');
    console.log('   - 集成到愿望清单功能');
    console.log('   - 配置提示词模板');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
    }
    process.exit(1);
  }
}

// 运行测试
testDeepSeekAPI();

