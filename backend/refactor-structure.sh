#!/bin/bash

# Script để refactor cấu trúc thư mục từ controllers/services/repositories
# sang api-layer/business-layer/data-access-layer

# Danh sách các module cần refactor
MODULES=(
  "dang-ky-mang-nghien-cuu"
  "de-tai-de-xuat"
  "duyet-de-tai"
  "ghep-nhom"
  "nguoi-dung"
  "nhat-ky-kiem-toan"
  "nhom-nghien-cuu"
  "phan-cong-giang-vien"
  "thong-bao"
  "trang-thai-quy-trinh"
  "xac-thuc"
)

echo "🚀 Bắt đầu refactor cấu trúc backend..."
echo ""

for module in "${MODULES[@]}"; do
  MODULE_PATH="src/modules/$module"
  
  if [ ! -d "$MODULE_PATH" ]; then
    echo "⚠️  Module $module không tồn tại, bỏ qua..."
    continue
  fi
  
  echo "📦 Đang refactor module: $module"
  
  # Đổi tên repositories -> data-access-layer
  if [ -d "$MODULE_PATH/repositories" ]; then
    mv "$MODULE_PATH/repositories" "$MODULE_PATH/data-access-layer"
    echo "  ✅ repositories -> data-access-layer"
  fi
  
  # Đổi tên controllers -> api-layer
  if [ -d "$MODULE_PATH/controllers" ]; then
    mv "$MODULE_PATH/controllers" "$MODULE_PATH/api-layer"
    echo "  ✅ controllers -> api-layer"
  fi
  
  # Đổi tên services -> business-layer
  if [ -d "$MODULE_PATH/services" ]; then
    mv "$MODULE_PATH/services" "$MODULE_PATH/business-layer"
    echo "  ✅ services -> business-layer"
  fi
  
  echo ""
done

echo "✨ Hoàn thành refactor cấu trúc thư mục!"
echo ""
echo "⚠️  LƯU Ý: Bạn cần cập nhật import paths trong các file!"
echo "   - Thay 'services/' thành 'business-layer/'"
echo "   - Thay 'repositories/' thành 'data-access-layer/'"
echo "   - Thay 'controllers/' thành 'api-layer/'"
