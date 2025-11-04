#!/bin/bash

if [ -z "$1" ]; then
  echo "❌ 错误: 请指定端口号"
  echo "用法: ./scripts/stop-port.sh <端口号>"
  exit 1
fi

PORT=$1
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ -n "$PID" ]; then
  PROCESS=$(ps -p $PID -o comm= 2>/dev/null)
  echo "🔍 发现端口 $PORT 被占用"
  echo "   PID: $PID"
  echo "   进程: $PROCESS"
  echo ""
  read -p "确认要停止该进程吗? (y/n): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    kill -9 $PID
    echo "✅ 已停止端口 $PORT 的进程 (PID: $PID)"
  else
    echo "⚪ 已取消操作"
  fi
else
  echo "⚪ 端口 $PORT 当前空闲,无需停止"
fi




