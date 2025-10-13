#!/bin/bash

# 文档重组脚本
# 将文档移动到对应的分类目录

echo "📚 开始文档重组..."

# 创建目录结构
echo "创建目录结构..."
mkdir -p docs/{getting-started,content-creation,seo-optimization,technical-architecture,deployment,growth-monetization,holidays-data,testing-reports,archive}

# 移动快速开始相关文档
echo "移动快速开始文档..."
mv docs/OBSIDIAN_BLOG_WORKFLOW.md docs/getting-started/
mv docs/BLOG_QUICK_REFERENCE.md docs/getting-started/
mv docs/TECH_STACK_QUICK_REFERENCE.md docs/getting-started/

# 移动内容创作相关文档
echo "移动内容创作文档..."
mv docs/BLOG_SYSTEM.md docs/content-creation/
mv docs/BLOG_CONTENT_GUIDELINES.md docs/content-creation/
mv docs/BLOG_CONTENT_ROADMAP.md docs/content-creation/
mv docs/BLOG_CONTENT_TECH.md docs/content-creation/
mv docs/MDX_COMPONENTS.md docs/content-creation/
mv docs/OBSIDIAN_WORKFLOW.md docs/content-creation/

# 移动 SEO 优化相关文档
echo "移动 SEO 优化文档..."
mv docs/SEO_CHECKLIST.md docs/seo-optimization/
mv docs/GOOGLE_SEARCH_CONSOLE_GUIDE.md docs/seo-optimization/
mv docs/GSC_DOMAIN_VERIFICATION_GUIDE.md docs/seo-optimization/
mv docs/GSC_REDIRECT_CHECK_GUIDE.md docs/seo-optimization/
mv docs/GSC_SUBMISSION_GUIDE.md docs/seo-optimization/
mv docs/SUBMIT_TO_GOOGLE_SEARCH_CONSOLE.md docs/seo-optimization/

# 移动技术架构相关文档
echo "移动技术架构文档..."
mv docs/TECH_STACK.md docs/technical-architecture/
mv docs/CONTENT_ARCHITECTURE.md docs/technical-architecture/
mv docs/PRODUCT_ROADMAP_V2.md docs/technical-architecture/
mv docs/FEATURE_ENHANCEMENT_PLAN.md docs/technical-architecture/
mv docs/TECHNICAL_IMPLEMENTATION_PLAN.md docs/technical-architecture/

# 移动部署相关文档
echo "移动部署文档..."
mv docs/DEPLOYMENT_CHECKLIST.md docs/deployment/
mv docs/DEPLOYMENT_SUMMARY_V2.md docs/deployment/
mv docs/DOMAIN_VERIFICATION_REPORT.md docs/deployment/

# 移动增长变现相关文档
echo "移动增长变现文档..."
mv docs/GROWTH_AND_MONETIZATION_PLAN.md docs/growth-monetization/
mv docs/TRAFFIC_GROWTH_PLAN.md docs/growth-monetization/
mv docs/CONTENT_AND_BACKLINK_STRATEGY.md docs/growth-monetization/
mv docs/BACKLINK_TRACKER.md docs/growth-monetization/
mv docs/SOCIAL_MEDIA_COPY.md docs/growth-monetization/

# 移动节假日数据相关文档
echo "移动节假日数据文档..."
mv docs/HOLIDAYS_DATA_SOURCE.md docs/holidays-data/
mv docs/HOLIDAYS_MAINTENANCE.md docs/holidays-data/

# 移动测试报告相关文档
echo "移动测试报告文档..."
mv docs/TEST_REPORT_V2.md docs/testing-reports/
mv docs/TEST_SUMMARY_V2.md docs/testing-reports/
mv docs/IMPLEMENTATION_SUMMARY.md docs/testing-reports/

# 移动项目总结到归档
echo "移动项目总结到归档..."
mv docs/PROJECT_SUMMARY.md docs/archive/

echo "✅ 文档重组完成！"
echo "📋 重组后的目录结构："
echo "   - docs/getting-started/ (3 个文档)"
echo "   - docs/content-creation/ (6 个文档)"
echo "   - docs/seo-optimization/ (6 个文档)"
echo "   - docs/technical-architecture/ (5 个文档)"
echo "   - docs/deployment/ (3 个文档)"
echo "   - docs/growth-monetization/ (5 个文档)"
echo "   - docs/holidays-data/ (2 个文档)"
echo "   - docs/testing-reports/ (3 个文档)"
echo "   - docs/archive/ (1 个文档)"
