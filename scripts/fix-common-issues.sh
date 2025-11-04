#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║              🔧 一键修复常见问题 🔧                             ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# 1. 停止端口
echo "1️⃣ 停止旧进程..."
lsof -ti:3009 | xargs kill -9 2>/dev/null || true
sleep 1
echo "   ✅ 完成"
echo ""

# 2. 清理缓存
echo "2️⃣ 清理编译缓存..."
rm -rf .next
echo "   ✅ 完成"
echo ""

# 3. 设置文件句柄
echo "3️⃣ 设置文件句柄限制..."
ulimit -n 10240 2>/dev/null || true
CURRENT_LIMIT=$(ulimit -n)
echo "   ✅ 完成 (当前: $CURRENT_LIMIT)"
echo ""

# 4. 重启服务器提示
echo "4️⃣ 准备重启开发服务器"
echo "   即将执行: PORT=3009 npm run dev"
echo ""
read -p "   是否立即启动服务器? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "   🚀 启动服务器..."
  PORT=3009 npm run dev
else
  echo "   ⚪ 已取消自动启动"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ 修复完成! 请手动执行: PORT=3009 npm run dev"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi




