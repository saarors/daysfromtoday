#!/bin/bash

# DaysFromToday v2.0 全面测试脚本
# 生成详细的测试报告

BASE_URL="http://localhost:3000"
REPORT_FILE="./docs/TEST_REPORT_V2.md"

echo "🚀 开始 DaysFromToday v2.0 全面测试"
echo "=================================================="
echo ""

# 测试结果统计
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_url() {
  local url=$1
  local description=$2
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  echo -n "测试 $TOTAL_TESTS: $description ... "
  
  status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$status_code" -eq 200 ]; then
    echo "✅ PASS ($status_code)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    return 0
  else
    echo "❌ FAIL ($status_code)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    return 1
  fi
}

# 开始测试
echo "## 1. 基础功能测试"
echo "-----------------------------------"

# 主页测试
test_url "$BASE_URL/zh" "中文主页"
test_url "$BASE_URL/en" "英文主页"

echo ""
echo "## 2. 节假日API测试"
echo "-----------------------------------"

# 节假日 API
test_url "$BASE_URL/api/holidays?country=CN&year=2025" "中国2025年节假日"
test_url "$BASE_URL/api/holidays?country=US&year=2025" "美国2025年节假日"
test_url "$BASE_URL/api/holidays?country=GB&year=2026" "英国2026年节假日"

echo ""
echo "## 3. 日期计算页面测试"
echo "-----------------------------------"

# 自然日计算
test_url "$BASE_URL/zh/days/7" "未来7天（中文）"
test_url "$BASE_URL/en/days/30" "未来30天（英文）"
test_url "$BASE_URL/zh/days/ago/7" "过去7天（中文）"

# 工作日计算
test_url "$BASE_URL/zh/business-days/5" "未来5个工作日（中文）"
test_url "$BASE_URL/en/business-days/10" "未来10个工作日（英文）"
test_url "$BASE_URL/zh/business-days/ago/5" "过去5个工作日（中文）"

echo ""
echo "## 4. 纪念日功能测试"
echo "-----------------------------------"

test_url "$BASE_URL/zh/anniversaries" "纪念日管理页面（中文）"
test_url "$BASE_URL/en/anniversaries" "纪念日管理页面（英文）"

echo ""
echo "## 5. 节假日页面测试"
echo "-----------------------------------"

test_url "$BASE_URL/zh/holidays" "节假日列表页面（中文）"
test_url "$BASE_URL/en/holidays" "节假日列表页面（英文）"

echo ""
echo "## 6. 博客页面测试"
echo "-----------------------------------"

test_url "$BASE_URL/zh/blog/why-i-built-daysfromtoday" "创始故事博客（中文）"
test_url "$BASE_URL/en/blog/why-i-built-daysfromtoday" "创始故事博客（英文）"

echo ""
echo "## 7. SEO 相关测试"
echo "-----------------------------------"

test_url "$BASE_URL/sitemap.xml" "Sitemap"
test_url "$BASE_URL/robots.txt" "Robots.txt"

echo ""
echo "=================================================="
echo "📊 测试总结"
echo "=================================================="
echo "总测试数: $TOTAL_TESTS"
echo "通过: $PASSED_TESTS"
echo "失败: $FAILED_TESTS"
echo "成功率: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo "✅ 所有测试通过！"
  exit 0
else
  echo "❌ 有 $FAILED_TESTS 个测试失败"
  exit 1
fi

