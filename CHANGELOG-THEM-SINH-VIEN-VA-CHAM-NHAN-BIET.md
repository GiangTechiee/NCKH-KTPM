# Changelog: Thêm sinh viên, mảng nghiên cứu và chấm nhận biết

**Ngày**: 28/04/2026  
**Tác giả**: Kiro AI Assistant  
**Mục đích**: Thêm dữ liệu test và tính năng chấm nhận biết sinh viên chưa đăng ký mảng trong dropdown

---

## 📝 Tóm tắt thay đổi

### 1. Thêm dữ liệu test

#### Mảng nghiên cứu mới (3 mảng)
- **MANG004**: Trí tuệ nhân tạo và Machine Learning
- **MANG005**: An toàn và bảo mật thông tin  
- **MANG006**: Internet of Things (IoT)

#### Sinh viên mới (8 sinh viên)
- **4 sinh viên đã đăng ký mảng**: SV013, SV014, SV017, SV019
- **4 sinh viên chưa đăng ký mảng**: SV015, SV016, SV018, SV020

### 2. Tính năng chấm nhận biết

Thêm dấu chấm `•` vào cuối tên sinh viên trong dropdown để nhận biết sinh viên chưa đăng ký mảng nghiên cứu.

**Ví dụ**:
- Đã đăng ký: `SV013 - Trần Minh Khang`
- Chưa đăng ký: `SV015 - Phạm Văn Đức •`

---

## 🔧 Chi tiết thay đổi code

### 1. Backend Type Definition

**File**: `backend/src/modules/nguoi-dung/types/nguoi-dung.types.ts`

```typescript
interface StudentAccountOption {
  // ... các trường khác
  hasRegisteredArea: boolean;  // ✨ THÊM MỚI
  // ... các trường khác
}
```

**Mục đích**: Thêm trường boolean để frontend biết sinh viên đã đăng ký mảng hay chưa.

---

### 2. Backend Service Logic

**File**: `backend/src/modules/nguoi-dung/business-layer/nguoi-dung.service.ts`

**Thay đổi**:
```typescript
async lietKeTaiKhoanSinhVien(): Promise<StudentAccountOption[]> {
  const danhSachSinhVien = await this.nguoiDungRepository.lietKeTaiKhoanSinhVien();

  return danhSachSinhVien.map((sinhVien) => {
    const dangKyMangGanNhat = sinhVien.dangKyMang[0] ?? null;
    const hasRegisteredArea = Boolean(dangKyMangGanNhat);  // ✨ TÍNH TOÁN

    return {
      code: sinhVien.maSinhVien,
      displayName: `${sinhVien.maSinhVien} - ${sinhVien.hoTen}${hasRegisteredArea ? '' : ' •'}`,  // ✨ THÊM DẤU CHẤM
      hasRegisteredArea,  // ✨ THÊM TRƯỜNG MỚI
      // ... các trường khác
    };
  });
}
```

**Logic**:
1. Kiểm tra sinh viên có đăng ký mảng không
2. Nếu chưa đăng ký → thêm dấu `•` vào cuối `displayName`
3. Trả về trường `hasRegisteredArea` để frontend có thể xử lý thêm

---

### 3. Script thêm dữ liệu

**File**: `backend/scripts/them-sinh-vien-va-mang-nghien-cuu.js`

**Chức năng**:
- Thêm 3 mảng nghiên cứu mới
- Thêm 8 sinh viên mới
- Tự động đăng ký mảng cho một số sinh viên
- Sử dụng transaction để đảm bảo tính toàn vẹn
- Kiểm tra duplicate trước khi insert

**Cách chạy**:
```bash
node backend/scripts/them-sinh-vien-va-mang-nghien-cuu.js
```

---

### 4. Script kiểm tra API

**File**: 
- `backend/scripts/kiem-tra-api-sinh-vien.sh` (Linux/Mac)
- `backend/scripts/kiem-tra-api-sinh-vien.ps1` (Windows)

**Chức năng**:
- Gọi API lấy danh sách sinh viên
- Lọc và hiển thị sinh viên đã/chưa đăng ký mảng
- Hiển thị thống kê

**Cách chạy**:
```bash
# Linux/Mac
bash backend/scripts/kiem-tra-api-sinh-vien.sh

# Windows PowerShell
powershell backend/scripts/kiem-tra-api-sinh-vien.ps1
```

---

## 📊 Kết quả API

### Endpoint
```
GET /api/nguoi-dung/sinh-vien
```

### Response mẫu

```json
{
  "success": true,
  "message": "Lấy danh sách tài khoản sinh viên thành công",
  "data": [
    {
      "code": "SV013",
      "displayName": "SV013 - Trần Minh Khang",
      "fullName": "Trần Minh Khang",
      "className": "CNTT K17A",
      "facultyName": "Công nghệ thông tin",
      "workflowStatus": "DA_DANG_KY_MANG",
      "hasRegisteredArea": true,
      "researchAreaCode": "MANG004",
      "researchAreaName": "Trí tuệ nhân tạo và Machine Learning",
      "registrationStatus": "REGISTERED",
      "groupName": null,
      "groupStatus": null,
      "topicName": null,
      "topicStatus": null
    },
    {
      "code": "SV015",
      "displayName": "SV015 - Phạm Văn Đức •",
      "fullName": "Phạm Văn Đức",
      "className": "CNTT K17A",
      "facultyName": "Công nghệ thông tin",
      "workflowStatus": "CHUA_DANG_KY_MANG",
      "hasRegisteredArea": false,
      "researchAreaCode": null,
      "researchAreaName": null,
      "registrationStatus": null,
      "groupName": null,
      "groupStatus": null,
      "topicName": null,
      "topicStatus": null
    }
  ]
}
```

---

## 🎯 Use Case Frontend

### Hiển thị dropdown sinh viên

```typescript
// React component example
function StudentDropdown() {
  const [students, setStudents] = useState<StudentAccountOption[]>([]);

  useEffect(() => {
    fetch('/api/nguoi-dung/sinh-vien')
      .then(res => res.json())
      .then(data => setStudents(data.data));
  }, []);

  return (
    <select>
      {students.map(student => (
        <option 
          key={student.code} 
          value={student.code}
          style={{ 
            color: student.hasRegisteredArea ? 'black' : 'red' 
          }}
        >
          {student.displayName}
        </option>
      ))}
    </select>
  );
}
```

### Lọc sinh viên theo trạng thái

```typescript
// Lọc sinh viên chưa đăng ký mảng
const studentsWithoutArea = students.filter(s => !s.hasRegisteredArea);

// Lọc sinh viên đã đăng ký mảng
const studentsWithArea = students.filter(s => s.hasRegisteredArea);

// Lọc theo mảng cụ thể
const aiStudents = students.filter(s => s.researchAreaCode === 'MANG004');
```

---

## ✅ Checklist tuân thủ AGENTS.md

- [x] **KHÔNG sửa DB schema** - Chỉ thêm dữ liệu, không thay đổi cấu trúc
- [x] **KHÔNG viết business rule ở frontend** - Logic ở backend service
- [x] **KHÔNG query DB trực tiếp trong controller** - Dùng repository pattern
- [x] **KHÔNG hard-code string trạng thái** - Sử dụng enum từ constants
- [x] **Code sạch** - Không có console.log, magic string, any
- [x] **Đặt tên rõ ràng** - Tên biến, function mô tả đúng ý nghĩa
- [x] **Transaction cho thao tác quan trọng** - Script sử dụng transaction
- [x] **Type safety** - TypeScript với type đầy đủ

---

## 🧪 Cách kiểm tra

### 1. Kiểm tra database

```sql
-- Kiểm tra mảng nghiên cứu mới
SELECT ma_mang, ten_mang, trang_thai 
FROM mang_nghien_cuu 
WHERE ma_mang IN ('MANG004', 'MANG005', 'MANG006');

-- Kiểm tra sinh viên mới
SELECT ma_sinh_vien, ho_ten 
FROM sinh_vien 
WHERE ma_sinh_vien BETWEEN 'SV013' AND 'SV020'
ORDER BY ma_sinh_vien;

-- Kiểm tra đăng ký mảng
SELECT 
  sv.ma_sinh_vien,
  sv.ho_ten,
  mnc.ten_mang,
  svdkm.trang_thai
FROM sinh_vien sv
LEFT JOIN sinh_vien_dang_ky_mang svdkm ON sv.id = svdkm.sinh_vien_id
LEFT JOIN mang_nghien_cuu mnc ON svdkm.mang_nghien_cuu_id = mnc.id
WHERE sv.ma_sinh_vien BETWEEN 'SV013' AND 'SV020'
ORDER BY sv.ma_sinh_vien;
```

### 2. Kiểm tra API

```bash
# Lấy danh sách sinh viên
curl http://localhost:3000/api/nguoi-dung/sinh-vien | jq '.'

# Chạy script kiểm tra (Windows)
powershell backend/scripts/kiem-tra-api-sinh-vien.ps1
```

### 3. Kiểm tra trong ứng dụng

1. Mở dropdown chọn sinh viên
2. Quan sát sinh viên có dấu `•` ở cuối tên
3. Kiểm tra màu sắc hoặc style khác biệt (nếu frontend implement)

---

## 📚 Tài liệu liên quan

- `backend/scripts/README-THEM-DU-LIEU.md` - Hướng dẫn chi tiết về script
- `AGENTS.md` - Quy định coding cho dự án
- `backend/prisma/schema.prisma` - Database schema

---

## 🔄 Rollback (nếu cần)

Nếu cần xóa dữ liệu test:

```sql
-- Xóa đăng ký mảng
DELETE FROM sinh_vien_dang_ky_mang 
WHERE sinh_vien_id IN (
  SELECT id FROM sinh_vien 
  WHERE ma_sinh_vien BETWEEN 'SV013' AND 'SV020'
);

-- Xóa sinh viên
DELETE FROM sinh_vien 
WHERE ma_sinh_vien BETWEEN 'SV013' AND 'SV020';

-- Xóa mảng nghiên cứu
DELETE FROM mang_nghien_cuu 
WHERE ma_mang IN ('MANG004', 'MANG005', 'MANG006');
```

---

## 📝 Notes

- Dấu chấm `•` (bullet point) được chọn vì dễ nhận biết và không gây nhầm lẫn
- Trường `hasRegisteredArea` giúp frontend dễ dàng filter và style
- Script an toàn để chạy nhiều lần (idempotent)
- Tất cả thay đổi tuân thủ quy tắc trong `AGENTS.md`

---

**Status**: ✅ Hoàn thành  
**Tested**: ✅ Đã test script và API  
**Documentation**: ✅ Đầy đủ
