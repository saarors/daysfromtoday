#!/bin/bash

# 开发服务器标准重启脚本
# 用于修改 API 或路由文件后的安全重启

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           🔄 DaysFromToday 开发服务器重启脚本 🔄               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

PORT=3009

# Step 1: 停止旧进程
echo "━━━ Step 1: 停止旧进程 ━━━"
PID=$(lsof -ti:$PORT 2>/dev/null)
if [ -n "$PID" ]; then
  echo "🔴 发现旧进程 (PID: $PID)"
  lsof -ti:$PORT | xargs kill -9 2>/dev/null
  sleep 1
  echo "✅ 旧进程已停止"
else
  echo "✅ 端口 $PORT 空闲"
fi
echo ""

# Step 2: 清理编译缓存
echo "━━━ Step 2: 清理编译缓存 ━━━"
if [ -d ".next" ]; then
  CACHE_SIZE=$(du -sh .next | cut -f1)
  echo "🗑️  删除编译缓存 ($CACHE_SIZE)"
  rm -rf .next
  echo "✅ 编译缓存已清理"
else
  echo "✅ 无需清理缓存"
fi
echo ""

# Step 3: 设置文件句柄限制
echo "━━━ Step 3: 设置文件句柄限制 ━━━"
ulimit -n 10240
ULIMIT=$(ulimit -n)
echo "✅ 文件句柄限制: $ULIMIT"
echo ""

# Step 4: 启动开发服务器
echo "━━━ Step 4: 启动开发服务器 ━━━"
echo "🚀 启动服务器于端口 $PORT..."
echo "⏳ 请等待编译完成..."
echo ""

PORT=$PORT npm run dev






