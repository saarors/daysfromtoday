#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           🔍 DaysFromToday 开发环境诊断工具 🔍                 ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# 1. 检查端口
echo "━━━ 1️⃣ 端口检查 ━━━"
PORT=3009
PID=$(lsof -ti:$PORT 2>/dev/null)
if [ -n "$PID" ]; then
  PROCESS=$(ps -p $PID -o comm= 2>/dev/null)
  echo "❌ 端口 $PORT 被占用 (PID: $PID, 进程: $PROCESS)"
  echo "   解决: lsof -ti:3009 | xargs kill -9"
else
  echo "✅ 端口 $PORT 空闲"
fi
echo ""

# 2. 检查文件句柄
echo "━━━ 2️⃣ 文件句柄限制 ━━━"
ULIMIT=$(ulimit -n)
if [ "$ULIMIT" -lt 10240 ]; then
  echo "❌ 文件句柄限制过低: $ULIMIT (建议: 10240+)"
  echo "   解决: ulimit -n 10240"
else
  echo "✅ 文件句柄限制充足: $ULIMIT"
fi
echo ""

# 3. 检查编译缓存
echo "━━━ 3️⃣ 编译缓存 ━━━"
if [ -d ".next" ]; then
  SIZE=$(du -sh .next 2>/dev/null | awk '{print $1}')
  echo "⚠️  编译缓存存在: $SIZE"
  echo "   建议定期清理: rm -rf .next"
else
  echo "✅ 无编译缓存 (或已清理)"
fi
echo ""

# 4. 检查node_modules
echo "━━━ 4️⃣ 依赖包 ━━━"
if [ -d "node_modules" ]; then
  echo "✅ node_modules 存在"
else
  echo "❌ node_modules 缺失"
  echo "   解决: npm install"
fi
echo ""

# 5. 检查环境变量
echo "━━━ 5️⃣ 环境变量 ━━━"
if [ -f ".env.local" ]; then
  echo "✅ .env.local 存在"
  # 检查关键变量(不输出值)
  if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local 2>/dev/null; then
    echo "✅ SUPABASE_URL 已配置"
  else
    echo "❌ SUPABASE_URL 缺失"
  fi
  if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local 2>/dev/null; then
    echo "✅ SUPABASE_ANON_KEY 已配置"
  else
    echo "❌ SUPABASE_ANON_KEY 缺失"
  fi
else
  echo "❌ .env.local 文件缺失"
fi
echo ""

# 总结
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                        诊断完成                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "💡 快速修复命令:"
echo "   1. 停止端口: lsof -ti:3009 | xargs kill -9"
echo "   2. 清理缓存: rm -rf .next"
echo "   3. 重启服务: ulimit -n 10240 && PORT=3009 npm run dev"
echo ""




