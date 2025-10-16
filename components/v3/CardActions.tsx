/**
 * 卡片操作按钮组件
 * 包含下载、分享、保存功能
 */

'use client';

interface CardActionsProps {
  onDownload: () => void;
  onShare?: () => void;
  onSave: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function CardActions({ 
  onDownload, 
  onShare, 
  onSave, 
  disabled = false,
  loading = false 
}: CardActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* 下载图片 */}
      <button
        onClick={onDownload}
        disabled={disabled || loading}
        className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        下载图片
      </button>
      
      {/* 保存草稿 */}
      <button
        onClick={onSave}
        disabled={disabled || loading}
        className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        保存草稿
      </button>
      
      {/* 公开分享（如果提供了 onShare） */}
      {onShare && (
        <button
          onClick={onShare}
          disabled={disabled || loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          公开分享
        </button>
      )}
      
      {/* 加载状态 */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}

