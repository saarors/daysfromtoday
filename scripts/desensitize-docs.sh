#!/bin/bash

# 文档脱敏脚本
# 用于移除文档中的敏感信息

echo "🔒 开始文档脱敏处理..."

# 处理 GA ID
echo "处理 Google Analytics ID..."
find docs/ -name "*.md" -exec sed -i '' 's/G-9D2SZK734G/[GA_ID]/g' {} \;
find . -maxdepth 1 -name "*.md" -exec sed -i '' 's/G-9D2SZK734G/[GA_ID]/g' {} \;

# 处理 R2 配置信息
echo "处理 R2 配置信息..."
find docs/ -name "*.md" -exec sed -i '' 's/R2_ACCESS_KEY_ID=[^[:space:]]*/R2_ACCESS_KEY_ID=[R2_ACCESS_KEY]/g' {} \;
find docs/ -name "*.md" -exec sed -i '' 's/R2_SECRET_ACCESS_KEY=[^[:space:]]*/R2_SECRET_ACCESS_KEY=[R2_SECRET]/g' {} \;
find . -maxdepth 1 -name "*.md" -exec sed -i '' 's/R2_ACCESS_KEY_ID=[^[:space:]]*/R2_ACCESS_KEY_ID=[R2_ACCESS_KEY]/g' {} \;
find . -maxdepth 1 -name "*.md" -exec sed -i '' 's/R2_SECRET_ACCESS_KEY=[^[:space:]]*/R2_SECRET_ACCESS_KEY=[R2_SECRET]/g' {} \;

# 处理其他敏感信息
echo "处理其他敏感信息..."
find docs/ -name "*.md" -exec sed -i '' 's/API_KEY=[^[:space:]]*/API_KEY=[YOUR_API_KEY]/g' {} \;
find docs/ -name "*.md" -exec sed -i '' 's/SECRET=[^[:space:]]*/SECRET=[YOUR_SECRET]/g' {} \;
find docs/ -name "*.md" -exec sed -i '' 's/TOKEN=[^[:space:]]*/TOKEN=[YOUR_TOKEN]/g' {} \;

# 处理具体的 R2 配置值（已脱敏，无需处理）
echo "跳过具体的 R2 配置值处理（已脱敏）..."

# 处理 R2 端点
echo "处理 R2 端点..."
find docs/ -name "*.md" -exec sed -i '' 's|https://44466a5b45e448959d15908ac94f0c38.r2.cloudflarestorage.com|[R2_ENDPOINT]|g' {} \;
find . -maxdepth 1 -name "*.md" -exec sed -i '' 's|https://44466a5b45e448959d15908ac94f0c38.r2.cloudflarestorage.com|[R2_ENDPOINT]|g' {} \;

# 处理 R2 存储桶名称
echo "处理 R2 存储桶名称..."
find docs/ -name "*.md" -exec sed -i '' 's/daysfromtoday-assets/[R2_BUCKET_NAME]/g' {} \;
find . -maxdepth 1 -name "*.md" -exec sed -i '' 's/daysfromtoday-assets/[R2_BUCKET_NAME]/g' {} \;

echo "✅ 文档脱敏处理完成！"
echo "📋 请检查以下文件是否还有敏感信息："
echo "   - docs/analytics/GA_OVERVIEW.md"
echo "   - docs/analytics/GA_CUSTOM_EVENTS.md"
echo "   - 其他包含配置信息的文档"
