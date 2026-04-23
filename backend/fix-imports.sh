#!/bin/bash

# Script để tự động sửa các import paths sau khi refactor

echo "🔧 Đang sửa import paths..."
echo ""

# Tìm tất cả file .ts và thay thế import paths
find src/modules -name "*.ts" -type f -exec sed -i \
  -e "s|from '../../nguoi-dung/services/nguoi-dung.service'|from '../../nguoi-dung/business-layer/nguoi-dung.service'|g" \
  -e "s|from '../../nhat-ky-kiem-toan/services/nhat-ky-kiem-toan.service'|from '../../nhat-ky-kiem-toan/business-layer/nhat-ky-kiem-toan.service'|g" \
  -e "s|from '../services/|from '../business-layer/|g" \
  -e "s|from '../repositories/|from '../data-access-layer/|g" \
  -e "s|from '../controllers/|from '../api-layer/|g" \
  {} \;

echo "✅ Đã sửa xong import paths!"
echo ""
echo "📝 Kiểm tra lại bằng lệnh:"
echo "   grep -r \"from.*\/services\/\" src/modules/"
echo "   grep -r \"from.*\/repositories\/\" src/modules/"
echo "   grep -r \"from.*\/controllers\/\" src/modules/"
