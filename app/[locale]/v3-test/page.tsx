/**
 * V3.0 功能测试页面
 * 用于测试卡片模板系统的所有功能
 */

'use client';

import { useState, useEffect } from 'react';
import { TemplateSelector } from '@/components/v3/TemplateSelector';
import { CardPreview } from '@/components/v3/CardPreview';
import { GoalInput } from '@/components/v3/GoalInput';
import { CardActions } from '@/components/v3/CardActions';
import { useGoalCards } from '@/store/goal-cards';
import type { CardTemplate, CardContent } from '@/types/card-template';
import { allPresetTemplates } from '@/lib/preset-templates';
import { addDays } from 'date-fns';

export default function V3TestPage() {
  const { addCard, getAllCards } = useGoalCards();
  
  // 状态管理
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(allPresetTemplates[0]);
  const [goalText, setGoalText] = useState('');
  const [targetDate] = useState(addDays(new Date(), 30).toISOString());
  const [daysCount] = useState(30);
  const [mounted, setMounted] = useState(false);
  
  // 解决 SSR hydration 问题
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 卡片内容
  const cardContent: Partial<CardContent> = {
    goalText: goalText || '输入你的目标...',
    targetDate,
    daysCount,
    title: 'My',
  };
  
  // 下载功能
  const handleDownload = async () => {
    const params = new URLSearchParams({
      template: selectedTemplate.id,
      text: goalText || 'My Goal',
      date: targetDate,
      days: String(daysCount),
    });
    
    const imageUrl = `/api/og/goal-card?${params}`;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `goal-card-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('✅ 图片下载成功！');
    } catch (error) {
      alert('❌ 下载失败，请重试');
    }
  };
  
  // 保存功能
  const handleSave = () => {
    if (!goalText) {
      alert('⚠️ 请先输入目标');
      return;
    }
    
    const card = addCard({
      templateId: selectedTemplate.id,
      content: {
        goalText,
        targetDate,
        daysCount,
        title: 'My Goal',
      },
    });
    
    alert(`✅ 卡片已保存！\nID: ${card.id}\n总卡片数: ${getAllCards().length}`);
  };
  
  const isDisabled = !goalText || goalText.length > 200;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">V3.0 卡片模板测试</h1>
              <p className="text-sm text-gray-600 mt-1">Phase 1 功能验证</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                已保存: {mounted ? getAllCards().length : 0} 张卡片
              </span>
              <a 
                href="/"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                返回首页
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：配置区 */}
          <div className="space-y-8">
            {/* 模板选择 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                1️⃣ 选择模板
              </h2>
              <TemplateSelector
                onSelect={setSelectedTemplate}
                selectedId={selectedTemplate.id}
              />
            </div>
            
            {/* 目标输入 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                2️⃣ 输入目标
              </h2>
              <GoalInput
                value={goalText}
                onChange={setGoalText}
                maxLength={200}
              />
            </div>
            
            {/* 操作按钮 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                3️⃣ 操作
              </h2>
              <CardActions
                onDownload={handleDownload}
                onSave={handleSave}
                disabled={isDisabled}
              />
              
              {isDisabled && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  {!goalText ? '⚠️ 请先输入目标' : '⚠️ 目标文字超出限制'}
                </p>
              )}
            </div>
            
            {/* 信息面板 */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4">📊 当前配置</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-blue-700">模板:</dt>
                  <dd className="text-blue-900 font-medium">{selectedTemplate.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-blue-700">类型:</dt>
                  <dd className="text-blue-900 font-medium">
                    {selectedTemplate.type === 'gradient' ? '渐变风格' : '极简风格'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-blue-700">目标日期:</dt>
                  <dd className="text-blue-900 font-medium">
                    {new Date(targetDate).toLocaleDateString('zh-CN')}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-blue-700">倒计时:</dt>
                  <dd className="text-blue-900 font-medium">{daysCount} 天</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-blue-700">字数:</dt>
                  <dd className={`font-medium ${goalText.length > 200 ? 'text-red-600' : 'text-blue-900'}`}>
                    {goalText.length} / 200
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* 右侧：预览区 */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <CardPreview
                template={selectedTemplate}
                content={cardContent}
              />
            </div>
          </div>
        </div>
        
        {/* 底部提示 */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">🎉 Phase 1 测试说明</h3>
          <ul className="space-y-2 text-white/90">
            <li>✅ 8 个预设模板（5 渐变 + 3 极简）</li>
            <li>✅ 实时卡片预览</li>
            <li>✅ 字数限制和智能提示</li>
            <li>✅ LocalStorage 持久化存储</li>
            <li>✅ 图片下载功能</li>
            <li>✅ Edge Runtime 图片生成（@vercel/og）</li>
          </ul>
          <p className="mt-6 text-sm text-white/80">
            💡 提示：所有保存的卡片都存储在浏览器 LocalStorage 中，刷新页面后仍然保留
          </p>
        </div>
      </div>
    </div>
  );
}

