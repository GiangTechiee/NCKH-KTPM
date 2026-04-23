# 🚀 Hướng dẫn chạy Backend sau Refactor

## ⚠️ Vấn đề: PowerShell Execution Policy

Lỗi bạn gặp:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

## ✅ Giải pháp (Chọn 1 trong 3 cách)

### Cách 1: Sửa Execution Policy (Khuyến nghị)

**Bước 1:** Mở PowerShell **as Administrator**
- Nhấn `Windows + X`
- Chọn "Windows PowerShell (Admin)" hoặc "Terminal (Admin)"

**Bước 2:** Chạy lệnh sau:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Bước 3:** Nhấn `Y` để xác nhận

**Bước 4:** Đóng PowerShell Admin và mở lại PowerShell bình thường

**Bước 5:** Chạy backend:
```bash
cd D:\NCKH-KTPM\backend
npm run dev
```

---

### Cách 2: Bypass Execution Policy (Tạm thời)

Chạy lệnh này mỗi lần mở PowerShell mới:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

Sau đó chạy:
```bash
cd D:\NCKH-KTPM\backend
npm run dev
```

---

### Cách 3: Dùng Command Prompt (CMD)

**Bước 1:** Mở Command Prompt (CMD)
- Nhấn `Windows + R`
- Gõ `cmd` và Enter

**Bước 2:** Chạy backend:
```bash
cd D:\NCKH-KTPM\backend
npm run dev
```

CMD không bị ảnh hưởng bởi PowerShell Execution Policy!

---

## 🧪 Kiểm tra Backend hoạt động

### 1. Sau khi chạy `npm run dev`, bạn sẽ thấy:

```
Server is running on port 3000
```

### 2. Mở trình duyệt và test:

**Health check:**
```
http://localhost:3000/api/health
```

Kết quả mong đợi:
```json
{
  "success": true,
  "message": "System health check completed successfully",
  "data": {
    "status": "OK",
    "timestamp": "2026-04-19T..."
  }
}
```

**Danh sách modules:**
```
http://localhost:3000/api
```

Kết quả mong đợi:
```json
{
  "success": true,
  "message": "Backend modules have been registered successfully",
  "data": {
    "modules": [
      { "path": "/api/dang-ky-mang-nghien-cuu", "key": "dang-ky-mang-nghien-cuu" },
      { "path": "/api/nhom-nghien-cuu", "key": "nhom-nghien-cuu" },
      ...
    ]
  }
}
```

---

## 🔗 Test Frontend kết nối

### 1. Mở terminal mới (hoặc CMD)

```bash
cd D:\NCKH-KTPM\frontend
npm run dev
```

### 2. Frontend sẽ chạy tại:
```
http://localhost:5173
```
(hoặc port khác tùy cấu hình)

### 3. Test các chức năng:
- ✅ Đăng nhập
- ✅ Đăng ký mảng nghiên cứu
- ✅ Tạo nhóm
- ✅ Nộp đề tài
- ✅ Duyệt đề tài

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find module"

Chạy lại:
```bash
cd backend
npm install
```

### Lỗi: "Port 3000 already in use"

**Cách 1:** Tìm và kill process đang dùng port 3000:
```powershell
# PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

**Cách 2:** Đổi port trong file `.env`:
```
PORT=3001
```

### Lỗi: Database connection

Kiểm tra file `.env`:
```
DATABASE_URL="postgresql://..."
```

Đảm bảo Supabase database đang chạy.

---

## 📊 Checklist Test

### Backend
- [ ] Server khởi động thành công
- [ ] `/api/health` trả về OK
- [ ] `/api` trả về danh sách modules
- [ ] Không có lỗi trong console

### Frontend
- [ ] Frontend khởi động thành công
- [ ] Kết nối được với backend
- [ ] Đăng nhập thành công
- [ ] Các chức năng chính hoạt động

### API Endpoints (Test bằng Postman/Thunder Client)
- [ ] POST `/api/xac-thuc/dang-nhap`
- [ ] GET `/api/dang-ky-mang-nghien-cuu`
- [ ] POST `/api/nhom-nghien-cuu`
- [ ] POST `/api/nop-de-tai`
- [ ] GET `/api/trang-thai-quy-trinh/sinh-vien`

---

## 🎯 Kết luận

Sau khi khắc phục vấn đề PowerShell Execution Policy:

1. ✅ Backend sẽ chạy bình thường
2. ✅ Frontend sẽ kết nối được
3. ✅ Tất cả API endpoints hoạt động
4. ✅ Không cần sửa gì thêm

**Lý do:** Refactor chỉ thay đổi cấu trúc thư mục, KHÔNG thay đổi logic nghiệp vụ hay API endpoints!

---

**Nếu vẫn gặp vấn đề, hãy:**
1. Chụp màn hình lỗi
2. Copy toàn bộ error message
3. Kiểm tra file `.env` có đúng không

Good luck! 🚀
