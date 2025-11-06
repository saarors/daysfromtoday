#!/bin/bash

# 配置
PROJECT_PORT=3009
MAX_FILE_HANDLES=10240

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                   启动开发服务器                                 ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# 1. 检查端口是否被占用
PID=$(lsof -ti:$PROJECT_PORT 2>/dev/null)
if [ -n "$PID" ]; then
  echo "⚠️  端口 $PROJECT_PORT 已被占用 (PID: $PID)"
  read -p "是否停止旧进程? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    kill -9 $PID
    echo "✅ 已停止旧进程"
    sleep 2
  else
    echo "❌ 请手动停止旧进程或更换端口"
    exit 1
  fi
fi

# 2. 增加文件句柄限制
echo "🔧 设置文件句柄限制: $MAX_FILE_HANDLES"
ulimit -n $MAX_FILE_HANDLES

# 3. 检查当前限制
CURRENT_LIMIT=$(ulimit -n)
echo "📊 当前文件句柄限制: $CURRENT_LIMIT"

# 4. 启动服务器
echo ""
echo "🚀 启动开发服务器 (端口: $PROJECT_PORT)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PORT=$PROJECT_PORT npm run dev













