'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 时间维度配置
const TIME_DIMENSIONS = [
  { value: '7-days', label: '7天', emoji: '⚡', days: 7 },
  { value: '30-days', label: '30天', emoji: '🌱', days: 30 },
  { value: '90-days', label: '90天', emoji: '🎯', days: 90 },
  { value: '100-days', label: '100天', emoji: '💯', days: 100 },
  { value: '180-days', label: '180天', emoji: '📈', days: 180 },
  { value: '365-days', label: '365天', emoji: '🏆', days: 365 },
  { value: '3-years', label: '3年', emoji: '🌟', days: 1095 },
  { value: '5-years', label: '5年', emoji: '🚀', days: 1825 }
];

// 类别配置
const CATEGORIES = [
  { value: 'fitness', label: '健身', emoji: '💪' },
  { value: 'learning', label: '学习', emoji: '📚' },
  { value: 'career', label: '职业', emoji: '💼' },
  { value: 'personal_growth', label: '个人成长', emoji: '🌱' },
  { value: 'relationships', label: '人际关系', emoji: '❤️' },
  { value: 'creative', label: '创意', emoji: '🎨' },
  { value: 'lifestyle', label: '生活方式', emoji: '🏠' },
  { value: 'mental_health', label: '心理健康', emoji: '🧠' }
];

// 难度配置
const DIFFICULTY_LEVELS = [
  { value: 'easy', label: '简单', emoji: '😊' },
  { value: 'medium', label: '中等', emoji: '💪' },
  { value: 'hard', label: '困难', emoji: '🔥' },
  { value: 'expert', label: '专家', emoji: '🏆' }
];

interface WishBookFormProps {
  locale: string;
  initialData?: any;
  isEdit?: boolean;
}

export default function WishBookForm({ 
  locale, 
  initialData,
  isEdit = false 
}: WishBookFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // 表单数据
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    slug: initialData?.slug || '',
    time_dimension: initialData?.time_dimension || '30-days',
    duration_days: initialData?.duration_days || 30,
    category: initialData?.category || 'fitness',
    subcategory: initialData?.subcategory || '',
    difficulty: initialData?.difficulty || 'medium',
    status: initialData?.status || 'draft',
    locale: locale,
    story_intro: initialData?.story_intro || '',
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || ''
  });
  
  // 自动生成 slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-\u4e00-\u9fa5]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };
  
  // 处理标题变化
  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      // 如果 slug 为空或与之前的 slug 匹配，自动生成新 slug
      slug: !prev.slug || prev.slug === generateSlug(prev.title) 
        ? generateSlug(value) 
        : prev.slug,
      // 如果 meta_title 为空，自动生成
      meta_title: !prev.meta_title 
        ? `${value} | 愿望宝典` 
        : prev.meta_title
    }));
  };
  
  // 处理时间维度变化
  const handleTimeDimensionChange = (value: string) => {
    const dimension = TIME_DIMENSIONS.find(d => d.value === value);
    setFormData(prev => ({
      ...prev,
      time_dimension: value,
      duration_days: dimension?.days || 30
    }));
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const url = isEdit 
        ? `/api/wish-books/${initialData.id}`
        : '/api/wish-books';
      
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '保存失败');
      }
      
      console.log('✅ 保存成功:', data);
      
      // 跳转回列表页
      router.push(`/${locale}/admin/wish-books`);
      router.refresh();
      
    } catch (err: any) {
      console.error('❌ 保存失败:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">❌ {error}</p>
        </div>
      )}
      
      {/* 基础信息 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          📝 基础信息
        </h2>
        
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例如：100天跑马拉松"
          />
        </div>
        
        {/* 副标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            副标题
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例如：从零基础到完成半马的完整训练计划"
          />
        </div>
        
        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">/wish-books/</span>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100-days-marathon"
              pattern="[a-z0-9\-]+"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            只能包含小写字母、数字和连字符
          </p>
        </div>
      </div>
      
      {/* 分类信息 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          🏷️ 分类信息
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 时间维度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              时间维度 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.time_dimension}
              onChange={(e) => handleTimeDimensionChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TIME_DIMENSIONS.map(dim => (
                <option key={dim.value} value={dim.value}>
                  {dim.emoji} {dim.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* 类别 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              类别 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* 难度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              难度
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {DIFFICULTY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.emoji} {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* 状态 - 单独一行 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            状态 <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">📝 草稿</option>
            <option value="published">✅ 已发布</option>
            <option value="archived">📦 归档</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            只有"已发布"状态的卡片才会在前台显示
          </p>
        </div>
        
        {/* 子类别 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            子类别（可选）
          </label>
          <input
            type="text"
            value={formData.subcategory}
            onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例如：marathon, guitar, python"
          />
        </div>
      </div>
      
      {/* 内容 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          📄 内容
        </h2>
        
        {/* 故事引入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            故事引入
          </label>
          <textarea
            value={formData.story_intro}
            onChange={(e) => setFormData(prev => ({ ...prev, story_intro: e.target.value }))}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="用一段引人入胜的文字介绍这个目标..."
          />
          <p className="text-xs text-gray-500 mt-1">
            建议 500-800 字
          </p>
        </div>
      </div>
      
      {/* SEO */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          🔍 SEO 信息
        </h2>
        
        {/* Meta Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta 标题
          </label>
          <input
            type="text"
            value={formData.meta_title}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="自动生成或手动输入"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.meta_title.length}/60 字符
          </p>
        </div>
        
        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta 描述
          </label>
          <textarea
            value={formData.meta_description}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="页面描述，用于搜索引擎结果"
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.meta_description.length}/160 字符
          </p>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={isSubmitting}
        >
          取消
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '保存中...' : (isEdit ? '更新卡片' : '创建卡片')}
        </button>
      </div>
    </form>
  );
}

