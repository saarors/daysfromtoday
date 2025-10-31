#!/bin/bash
# V3.0 开发进度一键备份脚本
# 使用方法：./scripts/v3-backup.sh

set -e

echo "🔄 开始备份 V3.0 开发进度..."

# 切换到项目根目录
cd "$(dirname "$0")/.."

# 检查是否在 v3.0-dev 分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "v3.0-dev" ]; then
  echo "⚠️  当前在 $CURRENT_BRANCH 分支，不是 v3.0-dev"
  echo "💡 提示：V3.0 开发请在 v3.0-dev 分支上进行"
  read -p "是否继续备份当前分支？(y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 已取消"
    exit 1
  fi
fi

# 检查是否有未提交的更改
if [[ -n $(git status -s) ]]; then
  echo ""
  echo "📝 检测到未提交的更改："
  echo "----------------------------------------"
  git status -s
  echo "----------------------------------------"
  echo ""
  
  # 询问提交信息
  read -p "请输入提交信息（回车使用默认）: " COMMIT_MSG
  if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="WIP: $(date '+%Y-%m-%d %H:%M') 进度保存"
  fi
  
  # 提交
  git add .
  git commit -m "$COMMIT_MSG"
  echo "✅ 已提交: $COMMIT_MSG"
else
  echo "📦 没有未提交的更改"
fi

# 创建时间戳备份分支
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_BRANCH="backup-$TIMESTAMP"
git branch $BACKUP_BRANCH
echo "✅ 已创建备份分支: $BACKUP_BRANCH"

# 显示最近的备份点
echo ""
echo "📋 最近的 5 个备份点："
git branch | grep "backup-" | sort -r | head -5

# 统计总备份数
TOTAL_BACKUPS=$(git branch | grep -c "backup-" || echo "0")
echo ""
echo "📊 总计 $TOTAL_BACKUPS 个备份点"

# 清理过期的备份（保留最近 30 天）
echo ""
echo "🧹 清理过期备份（30天前）..."
THIRTY_DAYS_AGO=$(date -v-30d +%Y%m%d 2>/dev/null || date -d "30 days ago" +%Y%m%d 2>/dev/null || echo "20000101")
DELETED_COUNT=0
for branch in $(git branch | grep "backup-" | tr -d ' '); do
  BRANCH_DATE=$(echo $branch | grep -oE "[0-9]{8}" | head -1)
  if [[ -n "$BRANCH_DATE" && "$BRANCH_DATE" -lt "$THIRTY_DAYS_AGO" ]]; then
    git branch -D $branch 2>/dev/null
    echo "🗑️  删除过期备份: $branch"
    DELETED_COUNT=$((DELETED_COUNT + 1))
  fi
done

if [ $DELETED_COUNT -eq 0 ]; then
  echo "✅ 没有过期备份需要清理"
else
  echo "✅ 已清理 $DELETED_COUNT 个过期备份"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 备份完成！"
echo "💡 如需恢复到此版本，执行："
echo "   git checkout $BACKUP_BRANCH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

