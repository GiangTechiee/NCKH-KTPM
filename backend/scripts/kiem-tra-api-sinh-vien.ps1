# Script kiểm tra API danh sách sinh viên với chấm nhận biết

Write-Host "🔍 Kiểm tra API danh sách sinh viên..." -ForegroundColor Cyan
Write-Host ""

# Lấy danh sách sinh viên
Write-Host "📋 GET /api/nguoi-dung/sinh-vien" -ForegroundColor Yellow
Write-Host "=================================="
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/nguoi-dung/sinh-vien" -Method Get
$response | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host ""

# Lọc chỉ sinh viên chưa đăng ký mảng (có dấu chấm •)
Write-Host "🔴 Sinh viên CHƯA đăng ký mảng (có dấu •):" -ForegroundColor Red
Write-Host "=========================================="
$notRegistered = $response.data | Where-Object { $_.hasRegisteredArea -eq $false }
$notRegistered | Select-Object code, displayName, workflowStatus | Format-Table -AutoSize

Write-Host ""

# Lọc chỉ sinh viên đã đăng ký mảng
Write-Host "✅ Sinh viên ĐÃ đăng ký mảng:" -ForegroundColor Green
Write-Host "============================="
$registered = $response.data | Where-Object { $_.hasRegisteredArea -eq $true }
$registered | Select-Object code, displayName, researchAreaName, workflowStatus | Format-Table -AutoSize

Write-Host ""

# Thống kê
Write-Host "📊 Thống kê:" -ForegroundColor Cyan
Write-Host "============"
$total = $response.data.Count
$registeredCount = ($response.data | Where-Object { $_.hasRegisteredArea -eq $true }).Count
$notRegisteredCount = ($response.data | Where-Object { $_.hasRegisteredArea -eq $false }).Count

Write-Host "Tổng số sinh viên: $total"
Write-Host "Đã đăng ký mảng: $registeredCount" -ForegroundColor Green
Write-Host "Chưa đăng ký mảng: $notRegisteredCount" -ForegroundColor Red

Write-Host ""
Write-Host "✅ Hoàn thành kiểm tra!" -ForegroundColor Green
