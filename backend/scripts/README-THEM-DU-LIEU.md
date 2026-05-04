# Hướng dẫn thêm dữ liệu test

## Script: `them-sinh-vien-va-mang-nghien-cuu.js`

### Mục đích
Script này thêm dữ liệu test cho hệ thống, bao gồm:
- **3 mảng nghiên cứu mới**: AI & ML, An toàn bảo mật, IoT
- **8 sinh viên mới**: Một số đã đăng ký mảng, một số chưa đăng ký

### Cách chạy

```bash
node backend/scripts/them-sinh-vien-va-mang-nghien-cuu.js
```

### Dữ liệu được thêm

#### Mảng nghiên cứu

| Mã mảng | Tên mảng | Trạng thái |
|---------|----------|------------|
| MANG004 | Trí tuệ nhân tạo và Machine Learning | OPEN |
| MANG005 | An toàn và bảo mật thông tin | OPEN |
| MANG006 | Internet of Things (IoT) | OPEN |

#### Sinh viên

| Mã SV | Họ tên | Lớp | Đã đăng ký mảng | Mảng đã đăng ký |
|-------|--------|-----|-----------------|-----------------|
| SV013 | Trần Minh Khang | CNTT K17A | ✅ | MANG004 (AI) |
| SV014 | Lê Thị Hương | CNTT K17B | ✅ | MANG005 (Security) |
| SV015 | Phạm Văn Đức | CNTT K17A | ❌ | - |
| SV016 | Nguyễn Thị Mai | CNTT K17C | ❌ | - |
| SV017 | Hoàng Văn Nam | CNTT K17B | ✅ | MANG006 (IoT) |
| SV018 | Vũ Thị Lan | CNTT K17A | ❌ | - |
| SV019 | Đặng Minh Tuấn | CNTT K17C | ✅ | MANG004 (AI) |
| SV020 | Bùi Thị Hà | CNTT K17B | ❌ | - |

### Tính năng chấm nhận biết trong dropdown

Sau khi chạy script và cập nhật API, dropdown sinh viên sẽ hiển thị:

- **Sinh viên đã đăng ký mảng**: `SV013 - Trần Minh Khang`
- **Sinh viên chưa đăng ký mảng**: `SV015 - Phạm Văn Đức •` (có dấu chấm • ở cuối)

### API Response

API `GET /api/nguoi-dung/sinh-vien` sẽ trả về thêm trường `hasRegisteredArea`:

```json
{
  "success": true,
  "data": [
    {
      "code": "SV013",
      "displayName": "SV013 - Trần Minh Khang",
      "fullName": "Trần Minh Khang",
      "hasRegisteredArea": true,
      "researchAreaCode": "MANG004",
      "researchAreaName": "Trí tuệ nhân tạo và Machine Learning",
      "workflowStatus": "DA_DANG_KY_MANG"
    },
    {
      "code": "SV015",
      "displayName": "SV015 - Phạm Văn Đức •",
      "fullName": "Phạm Văn Đức",
      "hasRegisteredArea": false,
      "researchAreaCode": null,
      "researchAreaName": null,
      "workflowStatus": "CHUA_DANG_KY_MANG"
    }
  ]
}
```

### Lưu ý

- Script sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
- Nếu dữ liệu đã tồn tại, script sẽ bỏ qua và không tạo duplicate
- Script an toàn để chạy nhiều lần
- Thời gian đăng ký mảng: 01/04/2026 - 31/05/2026

### Kiểm tra kết quả

Sau khi chạy script, bạn có thể kiểm tra:

1. **Trong database**:
```sql
-- Kiểm tra mảng nghiên cứu
SELECT ma_mang, ten_mang, trang_thai FROM mang_nghien_cuu WHERE ma_mang IN ('MANG004', 'MANG005', 'MANG006');

-- Kiểm tra sinh viên
SELECT ma_sinh_vien, ho_ten FROM sinh_vien WHERE ma_sinh_vien BETWEEN 'SV013' AND 'SV020';

-- Kiểm tra đăng ký mảng
SELECT sv.ma_sinh_vien, sv.ho_ten, mnc.ten_mang
FROM sinh_vien sv
LEFT JOIN sinh_vien_dang_ky_mang svdkm ON sv.id = svdkm.sinh_vien_id
LEFT JOIN mang_nghien_cuu mnc ON svdkm.mang_nghien_cuu_id = mnc.id
WHERE sv.ma_sinh_vien BETWEEN 'SV013' AND 'SV020'
ORDER BY sv.ma_sinh_vien;
```

2. **Qua API**:
```bash
# Lấy danh sách sinh viên
curl http://localhost:3000/api/nguoi-dung/sinh-vien

# Lấy danh sách mảng nghiên cứu đang mở
curl http://localhost:3000/api/dang-ky-mang-nghien-cuu/mang-dang-mo
```

### Troubleshooting

Nếu gặp lỗi:

1. **Connection error**: Kiểm tra file `.env` có đúng `DIRECT_URL` không
2. **Duplicate key error**: Dữ liệu đã tồn tại, script sẽ tự động bỏ qua
3. **Foreign key error**: Đảm bảo các mảng nghiên cứu được tạo trước sinh viên

### Các thay đổi code

#### 1. Type definition (`nguoi-dung.types.ts`)
- Thêm trường `hasRegisteredArea: boolean` vào `StudentAccountOption`

#### 2. Service (`nguoi-dung.service.ts`)
- Thêm logic tính toán `hasRegisteredArea`
- Thêm dấu chấm `•` vào `displayName` nếu chưa đăng ký mảng

#### 3. Script mới
- `them-sinh-vien-va-mang-nghien-cuu.js`: Script thêm dữ liệu test

---

**Tác giả**: Kiro AI Assistant  
**Ngày tạo**: 28/04/2026  
**Phiên bản**: 1.0
