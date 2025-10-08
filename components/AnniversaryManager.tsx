'use client';

import { useState, useEffect } from 'react';
import { 
  Anniversary, 
  AnniversaryCountdown, 
  AnniversaryStorage, 
  AnniversaryCalculator,
  AnniversaryValidator,
  ANNIVERSARY_TYPES,
  formatAnniversaryDate,
  formatCountdown
} from '@/lib/anniversary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { calculateDateStatisticsSync } from '@/lib/date-statistics';

interface AnniversaryManagerProps {
  locale: string;
}

export default function AnniversaryManager({ locale }: AnniversaryManagerProps) {
  const [countdowns, setCountdowns] = useState<AnniversaryCountdown[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // 防止 hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // 加载纪念日数据
  useEffect(() => {
    if (!mounted) return;

    const loadAnniversaries = () => {
      setCountdowns(AnniversaryCalculator.getAllCountdowns());
    };

    loadAnniversaries();
    
    // 监听存储变化
    const handleStorageChange = () => loadAnniversaries();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [mounted]);

  // 添加纪念日
  const handleAddAnniversary = (formData: Partial<Anniversary>) => {
    const validation = AnniversaryValidator.validate(formData);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const newAnniversary: Anniversary = {
      id: AnniversaryValidator.generateId(),
      name: formData.name!,
      date: formData.date!,
      type: formData.type!,
      isRecurring: formData.isRecurring || false,
      description: formData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    AnniversaryStorage.save(newAnniversary);
    setCountdowns(AnniversaryCalculator.getAllCountdowns());
    setShowAddForm(false);
  };

  // 删除纪念日
  const handleDeleteAnniversary = (id: string) => {
    if (confirm(locale === 'zh' ? '确定要删除这个纪念日吗？' : 'Are you sure you want to delete this anniversary?')) {
    AnniversaryStorage.delete(id);
    setCountdowns(AnniversaryCalculator.getAllCountdowns());
    }
  };

  // 获取即将到来的纪念日
  const upcomingCountdowns = AnniversaryCalculator.getUpcoming(7);
  const todayCountdowns = AnniversaryCalculator.getToday();

  const text = {
    en: {
      title: 'My Anniversaries',
      addButton: 'Add Anniversary',
      upcoming: 'Upcoming (7 days)',
      today: 'Today',
      all: 'All Anniversaries',
      noAnniversaries: 'No anniversaries yet. Add your first one!',
      daysUntil: 'Days until',
      daysAgo: 'Days ago',
      recurring: 'Recurring',
      delete: 'Delete',
      edit: 'Edit'
    },
    zh: {
      title: '我的纪念日',
      addButton: '添加纪念日',
      upcoming: '即将到来 (7天内)',
      today: '今天',
      all: '所有纪念日',
      noAnniversaries: '还没有纪念日，添加第一个吧！',
      daysUntil: '还有',
      daysAgo: '天前',
      recurring: '每年重复',
      delete: '删除',
      edit: '编辑'
    }
  };

  const t = text[locale as keyof typeof text] || text.en;

  // 在客户端渲染完成前显示加载状态
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gradient-calendly">{t.title}</h1>
        <p className="text-xl text-gray-600">
          {locale === 'zh' ? '管理您的个人纪念日，设置倒计时提醒' : 'Manage your personal anniversaries with countdown reminders'}
        </p>
      </div>

      {/* 今天的纪念日 */}
      {todayCountdowns.length > 0 && (
        <Card className="card-glass border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              🎉 {t.today}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayCountdowns.map((countdown) => {
                const typeConfig = ANNIVERSARY_TYPES[countdown.anniversary.type];
                return (
                  <div key={countdown.anniversary.id} className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{typeConfig.icon}</span>
                      <div>
                        <h3 className="font-semibold text-green-900">{countdown.anniversary.name}</h3>
                        <p className="text-sm text-green-700">
                          {formatAnniversaryDate(countdown.anniversary.date, locale)}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-200 text-green-800">
                      {t.today}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 即将到来的纪念日 */}
      {upcomingCountdowns.length > 0 && (
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              ⏰ {t.upcoming}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingCountdowns.map((countdown) => {
                const typeConfig = ANNIVERSARY_TYPES[countdown.anniversary.type];
                
                // 计算统计信息
                const stats = countdown.daysUntil > 0 
                  ? calculateDateStatisticsSync(new Date(), new Date(countdown.nextOccurrence))
                  : null;
                
                return (
                  <div key={countdown.anniversary.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{typeConfig.icon}</span>
                        <div>
                          <h3 className="font-semibold text-blue-900">{countdown.anniversary.name}</h3>
                          <p className="text-sm text-blue-700">
                            {formatAnniversaryDate(countdown.anniversary.date, locale)}
                          </p>
                          {countdown.anniversary.isRecurring && (
                            <Badge className="text-xs bg-blue-100 text-blue-800 mt-1">
                              {t.recurring}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-900">
                          {countdown.daysUntil}
                        </div>
                        <div className="text-sm text-blue-700">
                          {formatCountdown(countdown.daysUntil, locale)}
                        </div>
                      </div>
                    </div>
                    
                    {/* 统计信息 */}
                    {stats && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <div className="text-xs text-gray-600">💼 {locale === 'zh' ? '工作日' : 'Work'}</div>
                            <div className="text-sm font-bold text-blue-600">{stats.businessDays}</div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <div className="text-xs text-gray-600">🏖️ {locale === 'zh' ? '周末' : 'Weekend'}</div>
                            <div className="text-sm font-bold text-purple-600">{stats.weekends}</div>
                          </div>
                          <div className="bg-pink-50 rounded-lg p-2">
                            <div className="text-xs text-gray-600">📅 {locale === 'zh' ? '自然日' : 'Days'}</div>
                            <div className="text-sm font-bold text-pink-600">{stats.totalDays}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 所有纪念日 */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            📅 {t.all}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {countdowns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📅</div>
              <p>{t.noAnniversaries}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {countdowns.map((countdown) => {
                const typeConfig = ANNIVERSARY_TYPES[countdown.anniversary.type];
                
                // 计算统计信息（仅针对未来日期）
                const stats = !countdown.isPast && countdown.nextOccurrence
                  ? calculateDateStatisticsSync(new Date(), new Date(countdown.nextOccurrence))
                  : null;
                
                return (
                  <div key={countdown.anniversary.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">{typeConfig.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{countdown.anniversary.name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatAnniversaryDate(countdown.anniversary.date, locale)}
                          </p>
                          {countdown.anniversary.isRecurring && (
                            <Badge className="text-xs bg-blue-100 text-blue-800 mt-1">
                              {t.recurring}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            countdown.isToday ? 'text-green-600' : 
                            countdown.isPast ? 'text-gray-500' : 'text-blue-600'
                          }`}>
                            {countdown.daysUntil}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatCountdown(countdown.daysUntil, locale)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => setEditingId(countdown.anniversary.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            {t.edit}
                          </button>
                          <button
                            onClick={() => handleDeleteAnniversary(countdown.anniversary.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            {t.delete}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* 统计信息 - 仅显示未来日期 */}
                    {stats && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <div className="text-xs text-gray-600">💼 {locale === 'zh' ? '工作日' : 'Work'}</div>
                            <div className="text-sm font-bold text-blue-600">{stats.businessDays}</div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <div className="text-xs text-gray-600">🏖️ {locale === 'zh' ? '周末' : 'Weekend'}</div>
                            <div className="text-sm font-bold text-purple-600">{stats.weekends}</div>
                          </div>
                          <div className="bg-pink-50 rounded-lg p-2">
                            <div className="text-xs text-gray-600">📅 {locale === 'zh' ? '自然日' : 'Days'}</div>
                            <div className="text-sm font-bold text-pink-600">{stats.totalDays}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 添加纪念日表单 */}
      {showAddForm && (
        <AnniversaryForm
          locale={locale}
          onSave={handleAddAnniversary}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* 编辑纪念日表单 */}
      {editingId && (
        <AnniversaryForm
          locale={locale}
          anniversary={AnniversaryStorage.getById(editingId)}
          onSave={(data) => {
            if (editingId) {
              const existing = AnniversaryStorage.getById(editingId);
              if (existing) {
                AnniversaryStorage.save({ ...existing, ...data });
                setCountdowns(AnniversaryCalculator.getAllCountdowns());
              }
            }
            setEditingId(null);
          }}
          onCancel={() => setEditingId(null)}
        />
      )}

      {/* 添加纪念日按钮 - 放在底部 */}
      {!showAddForm && !editingId && (
        <div className="text-center pt-8 pb-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary px-8 py-4 text-lg inline-flex items-center gap-2"
          >
            <span className="text-2xl">✨</span>
            {t.addButton}
          </button>
        </div>
      )}
    </div>
  );
}

// 纪念日表单组件
interface AnniversaryFormProps {
  locale: string;
  anniversary?: Anniversary | null;
  onSave: (data: Partial<Anniversary>) => void;
  onCancel: () => void;
}

function AnniversaryForm({ locale, anniversary, onSave, onCancel }: AnniversaryFormProps) {
  const [formData, setFormData] = useState<Partial<Anniversary>>({
    name: anniversary?.name || '',
    date: anniversary?.date || '',
    type: anniversary?.type || 'custom',
    isRecurring: anniversary?.isRecurring || false,
    description: anniversary?.description || ''
  });

  const text = {
    en: {
      title: anniversary ? 'Edit Anniversary' : 'Add New Anniversary',
      name: 'Name',
      date: 'Date',
      type: 'Type',
      recurring: 'Recurring annually',
      description: 'Description (optional)',
      save: 'Save',
      cancel: 'Cancel',
      namePlaceholder: 'Enter anniversary name',
      descriptionPlaceholder: 'Enter description'
    },
    zh: {
      title: anniversary ? '编辑纪念日' : '添加新纪念日',
      name: '名称',
      date: '日期',
      type: '类型',
      recurring: '每年重复',
      description: '描述（可选）',
      save: '保存',
      cancel: '取消',
      namePlaceholder: '输入纪念日名称',
      descriptionPlaceholder: '输入描述'
    }
  };

  const t = text[locale as keyof typeof text] || text.en;

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.name}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.namePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.date}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.type}
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Anniversary['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(ANNIVERSARY_TYPES).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {locale === 'zh' ? config.name : config.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="recurring" className="text-sm text-gray-700">
              {t.recurring}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.description}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t.descriptionPlaceholder}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {t.save}
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              {t.cancel}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
