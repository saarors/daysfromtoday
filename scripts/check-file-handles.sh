#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                   文件句柄状态检查                               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# 当前限制
SOFT_LIMIT=$(ulimit -n)
HARD_LIMIT=$(ulimit -Hn)

echo "📊 文件句柄限制:"
echo "   软限制 (soft): $SOFT_LIMIT"
echo "   硬限制 (hard): $HARD_LIMIT"
echo ""

# 推荐值
if [ "$SOFT_LIMIT" -lt 10240 ]; then
  echo "⚠️  警告: 当前限制较低,可能导致 EMFILE 错误"
  echo "   推荐值: ≥10240"
  echo "   临时修复: ulimit -n 10240"
  echo "   永久修复: 参考 docs/SYSTEM_TROUBLESHOOTING.md"
else
  echo "✅ 文件句柄限制正常"
fi

# 当前使用情况
PORT=3009
PID=$(lsof -ti:$PORT 2>/dev/null)
if [ -n "$PID" ]; then
  OPEN_FILES=$(lsof -p $PID 2>/dev/null | wc -l)
  echo ""
  echo "📁 当前服务器 (PID: $PID) 打开的文件数: $OPEN_FILES"
  USAGE_PERCENT=$((OPEN_FILES * 100 / SOFT_LIMIT))
  echo "   使用率: $USAGE_PERCENT%"
  
  if [ "$USAGE_PERCENT" -gt 80 ]; then
    echo "   ⚠️  警告: 使用率过高!"
  fi
fi













