#!/bin/bash

# Script kiểm tra API danh sách sinh viên với chấm nhận biết

echo "🔍 Kiểm tra API danh sách sinh viên..."
echo ""

# Lấy danh sách sinh viên
echo "📋 GET /api/nguoi-dung/sinh-vien"
echo "=================================="
curl -s http://localhost:3000/api/nguoi-dung/sinh-vien | jq '.'

echo ""
echo ""

# Lọc chỉ sinh viên chưa đăng ký mảng (có dấu chấm •)
echo "🔴 Sinh viên CHƯA đăng ký mảng (có dấu •):"
echo "=========================================="
curl -s http://localhost:3000/api/nguoi-dung/sinh-vien | jq '.data[] | select(.hasRegisteredArea == false) | {code, displayName, workflowStatus}'

echo ""
echo ""

# Lọc chỉ sinh viên đã đăng ký mảng
echo "✅ Sinh viên ĐÃ đăng ký mảng:"
echo "============================="
curl -s http://localhost:3000/api/nguoi-dung/sinh-vien | jq '.data[] | select(.hasRegisteredArea == true) | {code, displayName, researchAreaName, workflowStatus}'

echo ""
echo ""

# Thống kê
echo "📊 Thống kê:"
echo "============"
TOTAL=$(curl -s http://localhost:3000/api/nguoi-dung/sinh-vien | jq '.data | length')
REGISTERED=$(curl -s http://localhost:3000/api/nguoi-dung/sinh-vien | jq '[.data[] | select(.hasRegisteredArea == true)] | length')
NOT_REGISTERED=$(curl -s http://localhost:3000/api/nguoi-dung/sinh-vien | jq '[.data[] | select(.hasRegisteredArea == false)] | length')

echo "Tổng số sinh viên: $TOTAL"
echo "Đã đăng ký mảng: $REGISTERED"
echo "Chưa đăng ký mảng: $NOT_REGISTERED"

echo ""
echo "✅ Hoàn thành kiểm tra!"
