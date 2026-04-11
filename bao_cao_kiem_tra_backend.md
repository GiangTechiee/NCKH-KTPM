# Báo cáo kiểm tra toàn diện backend & frontend

> Phiên bản: 1.0 | Ngày kiểm tra: 2026-04-11  
> Mục đích: Audit gap analysis — tìm tất cả khoảng trống, vi phạm kiến trúc, stub chưa implement, và task còn lại.

---

## 1. TÓM TẮT NHANH

| Hạng mục | Trạng thái |
|---|---|
| Backend foundation (common, infra, module skeletons) | **Hoàn chỉnh** |
| Luồng sinh viên (đăng ký mảng → nhóm → ghép nhóm) | **Hoàn chỉnh** |
| Luồng giảng viên (nhận nhóm hướng dẫn) | **Hoàn chỉnh** |
| Luồng đề tài (nộp, duyệt, chốt) | **Hoàn chỉnh** — nhưng có 3 hard-code vi phạm |
| Giảng viên tạo đề tài đề xuất | **Hoàn chỉnh (POST)** — thiếu GET |
| Module `nhat-ky-kiem-toan` — HTTP API | **STUB** — không có route GET nào |
| Module `xac-thuc` | **STUB** — không có route thật |
| Bug double-mount routes | **BUG NGHIÊM TRỌNG** — `nop-de-tai` và `duyet-de-tai` bị mount 2 lần |
| Frontend — luồng chính | **Demo đang chạy** qua `student-journey` |
| Frontend — feature riêng lẻ | **Scaffolding trống** (chỉ có `index.js` rỗng) |
| Database schema | **Đầy đủ** — khớp với code |

---

## 2. CHI TIẾT TỪNG MODULE BACKEND

### 2.1. `dang-ky-mang-nghien-cuu` ✅ Hoàn chỉnh
- Routes: `GET /mang-nghien-cuu/dang-mo`, `POST /dang-ky-mang-nghien-cuu`
- Có transaction, audit log, notification
- Không có vi phạm

### 2.2. `nhom-nghien-cuu` ✅ Hoàn chỉnh
- Routes: `GET /nhom-cua-toi`, `POST /nhom-nghien-cuu`, `POST /nhom-nghien-cuu/:groupId/moi-thanh-vien`
- Transaction: tạo nhóm + thêm trưởng nhóm
- Enum dùng đúng

### 2.3. `ghep-nhom` ✅ Hoàn chỉnh
- Routes: `GET /goi-y-ghep-nhom`, `POST /loi-moi-nhom/:id/chap-nhan`, `POST /loi-moi-nhom/:id/tu-choi`
- Transaction đúng (chấp nhận lời mời dùng `$transaction` để chống race condition)
- Audit log + notification đầy đủ

### 2.4. `phan-cong-giang-vien` ✅ Hoàn chỉnh
- Routes: `GET /giang-vien/nhom/dang-huong-dan`, `GET /giang-vien/nhom/co-the-nhan`, `GET /giang-vien/nhom/:groupId`, `POST /giang-vien/nhom/:groupId/nhan-huong-dan`
- Transaction: nhận hướng dẫn với kiểm tra quota
- Audit log + notification đầy đủ

### 2.5. `de-tai-de-xuat` ⚠️ Thiếu GET endpoint
- Route hiện có: `POST /de-tai-de-xuat` (giảng viên tạo đề tài đề xuất) — dùng enum đúng
- **THIẾU**: Không có `GET /de-tai-de-xuat` để nhóm xem danh sách đề tài đề xuất mà giảng viên đã tạo
- Tài liệu `phan_tich_thiet_ke_luong_ung_dung.md` mục 9.6 nêu rõ: *"cho nhóm xem danh sách đề tài được gợi ý"*
- Repository đã có `timChiTietNhomTheoId` nhưng không có `timDanhSachDeTaiDeXuatChoNhom`

### 2.6. `nop-de-tai` ⚠️ Có vi phạm hard-code
- Routes: `GET /de-tai-cua-toi/co-the-chon`, `POST /nop-de-tai`, `PUT /nop-de-tai/:id`
- Logic hoàn chỉnh, transaction đúng, audit log đầy đủ
- **VI PHẠM**: 3 hard-coded strings trong `nop-de-tai.repository.ts`:
  - Dòng 70: `loaiDeTai: 'NHOM_DE_XUAT'` — phải dùng `TopicSource.NHOM_DE_XUAT`
  - Dòng 77: `trangThai: 'CHO_GIANG_VIEN_DUYET'` — phải dùng `TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET`
  - Dòng 108: `trangThai: 'CHO_GIANG_VIEN_DUYET'` — phải dùng `TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET`

### 2.7. `duyet-de-tai` ✅ Hoàn chỉnh
- Routes: `GET /giang-vien/de-tai-cho-duyet`, `POST /giang-vien/de-tai/:id/duyet`, `POST /giang-vien/de-tai/:id/yeu-cau-chinh-sua`, `POST /giang-vien/de-tai/:id/tu-choi`, `POST /giang-vien/de-tai/:id/chot`
- Transaction, audit log, notification đầy đủ
- State transition enforcement đúng

### 2.8. `trang-thai-quy-trinh` ✅ Hoàn chỉnh
- Routes: `GET /trang-thai-quy-trinh/sinh-vien` (mount tại `/trang-thai-quy-trinh`), `GET /trang-thai-quy-trinh/giang-vien`
- Service rất chi tiết: timeline, milestones, stepList, nextAction

### 2.9. `thong-bao` ✅ Hoàn chỉnh (nhưng thiếu 1 endpoint tiện ích)
- Routes: `GET /thong-bao`, `PATCH /thong-bao/:id/da-doc`
- **Thiếu** (không bắt buộc nhưng hữu ích): `PATCH /thong-bao/tat-ca/da-doc` — đánh dấu tất cả đã đọc

### 2.10. `nhat-ky-kiem-toan` ❌ STUB — không có HTTP routes
- `index.ts` chỉ 3 dòng, dùng `createModuleRouter` placeholder
- Service: chỉ có `taoBanGhi()` — write-only, không có read
- Repository: chỉ có `taoBanGhi()` — write-only
- Controller: chỉ có `.gitkeep` — trống hoàn toàn
- **THIẾU**: Không có endpoint nào để tra cứu audit log
- Tài liệu `phan_tich_thiet_ke_luong_ung_dung.md` mục 10.3 nêu: `GET /audit-logs/{entityType}/{entityId}`
- **AGENTS.md** yêu cầu: *"phục vụ truy vết nghiệp vụ"*

### 2.11. `xac-thuc` ❌ STUB hoàn toàn
- `index.ts` chỉ 3 dòng, dùng `createModuleRouter` placeholder
- Không có login, logout, JWT, session
- Auth hiện tại được giả lập bằng headers `x-ma-sinh-vien` / `x-ma-giang-vien`
- Theo `uu_tien_cong_viec_can_lam.md`: "Auth hoàn chỉnh" là ưu tiên 7 — sau luồng chính

### 2.12. `nguoi-dung` ✅ Đủ cho giai đoạn hiện tại
- Routes: `GET /nguoi-dung/sinh-vien`, `GET /nguoi-dung/giang-vien`
- Dùng làm internal helper và UI account selector
- Thiếu (thấp): `GET /nguoi-dung/toi` (profile hiện tại) — nhưng không bắt buộc khi auth chưa có

---

## 3. BUG NGHIÊM TRỌNG — Double-mount routes

**File**: `/home/giang/Documents/TKPM /NCKH-KTPM/backend/src/modules/index.ts`

```typescript
// HIỆN TẠI (SAI):
router.use(topicSubmissionRouter);         // dòng 64 — mount không prefix → /de-tai-cua-toi/co-the-chon, /nop-de-tai, /nop-de-tai/:id
router.use(topicReviewRouter);             // dòng 65 — mount không prefix → /giang-vien/de-tai-cho-duyet, v.v.
// ...
router.use('/nop-de-tai', topicSubmissionRouter);   // dòng 69 — mount lại với prefix /nop-de-tai
router.use('/duyet-de-tai', topicReviewRouter);     // dòng 70 — mount lại với prefix /duyet-de-tai
```

**Hệ quả cụ thể**:

| Route trong router | Mount dòng 64/65 (không prefix) | Mount dòng 69/70 (có prefix) |
|---|---|---|
| `GET /de-tai-cua-toi/co-the-chon` | `/api/de-tai-cua-toi/co-the-chon` ✅ | `/api/nop-de-tai/de-tai-cua-toi/co-the-chon` ❌ |
| `POST /` (nop-de-tai) | `/api/` ❌ | `/api/nop-de-tai` ✅ |
| `PUT /:id` (nop-de-tai) | `/api/:id` ❌ | `/api/nop-de-tai/:id` ✅ |
| `GET /giang-vien/de-tai-cho-duyet` | `/api/giang-vien/de-tai-cho-duyet` ✅ | `/api/duyet-de-tai/giang-vien/de-tai-cho-duyet` ❌ |

Frontend đang gọi `/api/nop-de-tai`, `/api/giang-vien/de-tai-cho-duyet`, v.v. — hành vi hiện tại **vô tình đúng** do mount không prefix (dòng 64/65) nhưng đây là side effect không kiểm soát được.

**Fix cần làm**: Xóa dòng 64 và 65, giữ nguyên dòng 69 và 70.

---

## 4. VI PHẠM KIẾN TRÚC

### 4.1. Hard-coded string trạng thái (vi phạm AGENTS.md section 2.4)
**File**: `/home/giang/Documents/TKPM /NCKH-KTPM/backend/src/modules/nop-de-tai/repositories/nop-de-tai.repository.ts`
```typescript
// Dòng 70 — SAI:
loaiDeTai: 'NHOM_DE_XUAT',
// Phải là:
loaiDeTai: TopicSource.NHOM_DE_XUAT,

// Dòng 77 — SAI:
trangThai: 'CHO_GIANG_VIEN_DUYET',
// Phải là:
trangThai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,

// Dòng 108 — SAI:
trangThai: 'CHO_GIANG_VIEN_DUYET',
// Phải là:
trangThai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
```

### 4.2. Không có import constants trong nop-de-tai.repository.ts
File chỉ import `MemberJoinStatus` nhưng không import `TopicSource` và `TopicSubmissionStatus` — dẫn đến vi phạm 4.1.

### 4.3. `trang-thai-quy-trinh/index.ts` — route không nhất quán với docs
Route được định nghĩa là `/sinh-vien` và `/giang-vien`.  
Mount tại `router.use('/trang-thai-quy-trinh', workflowStatusRouter)`.  
Kết quả: `GET /trang-thai-quy-trinh/sinh-vien` và `GET /trang-thai-quy-trinh/giang-vien`.  
Tài liệu nêu `GET /workflow-status/me` — không match, nhưng đây là naming convention khác, không phải bug nghiêm trọng.

### 4.4. `registeredModules` trong `index.ts` lỗi thời và không đầy đủ
Mảng `registeredModules` (dùng cho `GET /api/` discovery) có nhiều entry sai:
- Có entry `{ path: '/nop-de-tai', key: 'nop-de-tai' }` trùng lặp (dòng 32 và 43)
- Có entry `{ path: '/duyet-de-tai', key: 'duyet-de-tai' }` trùng lặp (dòng 44)
- Thiếu route `GET /de-tai-de-xuat` khi nó được implement

---

## 5. PHÂN TÍCH DATABASE SCHEMA

Schema hiện tại (`prisma/schema.prisma`) **đầy đủ và đúng** cho toàn bộ luồng nghiệp vụ:

| Model | Trạng thái |
|---|---|
| `SinhVien` | ✅ Đầy đủ |
| `GiangVien` | ✅ Đầy đủ |
| `MangNghienCuu` | ✅ Đầy đủ |
| `SinhVienDangKyMang` | ✅ Đầy đủ |
| `NhomNghienCuu` | ✅ Đầy đủ |
| `ThanhVienNhomNghienCuu` | ✅ Đầy đủ |
| `LoiMoiNhom` | ✅ Đầy đủ |
| `DeTaiNghienCuu` | ✅ Đầy đủ |
| `NhatKyKiemToan` | ✅ Đầy đủ |
| `ThongBao` | ✅ Đầy đủ |

**Ghi chú về schema**:
- `SinhVienDangKyMang.trangThai` default là `'REGISTERED'` (tiếng Anh) — không có enum tương ứng trong code, nhưng field này không được dùng trong logic hiện tại nên chưa gây lỗi
- Schema thiếu bảng `TopicReview` / `TopicSubmissionVersion` (lịch sử review, versioning đề tài) — được đề cập trong tài liệu nhưng chưa implement
- Schema thiếu `RegistrationPeriod` / `LecturerSpecialization` riêng biệt — thay vào đó dùng trực tiếp `MangNghienCuu` và `GiangVien.chuyenMon`

> ⚠️ Những điểm thiếu này không chặn luồng chính nhưng hạn chế tính năng versioning và review history.

---

## 6. PHÂN TÍCH FRONTEND

### 6.1. Trạng thái tổng quan
Frontend **đang hoạt động** nhưng chủ yếu tập trung trong `student-journey` feature — một UI tổng hợp nhiều boards:

**Hoàn chỉnh và kết nối thật với API**:
- `student-journey/services/student-journey.service.js` — gọi đủ tất cả endpoints đã có trên backend
- `workflow-status/` — có service + components
- `notifications/` — có service + components

**Scaffolding trống** (chỉ có `index.js` rỗng hoặc minimal):
- `features/research-area/` — scaffolding
- `features/research-group/` — scaffolding
- `features/group-matching/` — scaffolding
- `features/lecturer-group-selection/` — scaffolding
- `features/topic-selection/` — scaffolding
- `features/topic-review/` — scaffolding

### 6.2. Vi phạm kiến trúc frontend
- Frontend vẫn dùng **JavaScript**, không phải TypeScript — vi phạm kế hoạch đã thống nhất trong `uu_tien_cong_viec_can_lam.md`
- `App.js` 782 dòng — god component, mix routing + logic
- `student-journey/pages/StudentJourneyPage.js` 706 dòng — quá lớn
- `core/api/api-client.js` thiếu `PATCH` method (dùng cho `PATCH /thong-bao/:id/da-doc`)
- Không có route guard / auth context
- Không có shared/ui component library — mỗi board tự style

### 6.3. Missing API calls trong frontend
Frontend **chưa gọi**:
- `POST /de-tai-de-xuat` — giảng viên tạo đề tài đề xuất
- `GET /audit-logs/{entityType}/{entityId}` — chưa có endpoint backend và chưa có UI
- `PATCH /thong-bao/:id/da-doc` — apiClient thiếu `patchJson` method
- `GET /nguoi-dung/sinh-vien` và `GET /nguoi-dung/giang-vien` — chỉ dùng trong `account.service.js` để chọn tài khoản giả lập

---

## 7. DANH SÁCH TASK CÒN LẠI THEO ƯU TIÊN

### P0 — Bug phải fix ngay (ảnh hưởng đến hoạt động hiện tại)

#### TASK-001: Fix double-mount routes
- **File**: `/home/giang/Documents/TKPM /NCKH-KTPM/backend/src/modules/index.ts`
- **Action**: Xóa dòng 64 (`router.use(topicSubmissionRouter)`) và dòng 65 (`router.use(topicReviewRouter)`)
- **Giữ nguyên**: dòng 69 và 70 (mount có prefix đúng)
- **Không cần** thay đổi DB

#### TASK-002: Fix hard-coded strings trong `nop-de-tai.repository.ts`
- **File**: `/home/giang/Documents/TKPM /NCKH-KTPM/backend/src/modules/nop-de-tai/repositories/nop-de-tai.repository.ts`
- **Action**: 
  1. Thêm import: `import { TopicSource, TopicSubmissionStatus } from '../../../common/constants';`
  2. Dòng 70: đổi `'NHOM_DE_XUAT'` → `TopicSource.NHOM_DE_XUAT`
  3. Dòng 77: đổi `'CHO_GIANG_VIEN_DUYET'` → `TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET`
  4. Dòng 108: đổi `'CHO_GIANG_VIEN_DUYET'` → `TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET`
- **Không cần** thay đổi DB

---

### P1 — Feature còn thiếu quan trọng

#### TASK-003: Implement GET `/de-tai-de-xuat` — nhóm xem danh sách đề tài giảng viên đề xuất
- **Module**: `de-tai-de-xuat`
- **Endpoint**: `GET /de-tai-de-xuat` (sinh viên gọi, truyền header `x-ma-sinh-vien`)
- **Logic**: Lấy nhóm của sinh viên → lấy danh sách `DeTaiNghienCuu` thuộc nhóm đó và còn ở trạng thái `NHAP`
- **Files cần tạo/sửa**:
  - `de-tai-de-xuat.repository.ts` — thêm method `timDanhSachDeTaiDeXuatChoNhom(nhomId)`
  - `de-tai-de-xuat.service.ts` — thêm method `layDanhSachDeTaiDeXuat(maSinhVien)`
  - `de-tai-de-xuat.controller.ts` — thêm method `layDanhSachDeTaiDeXuat`
  - `de-tai-de-xuat/index.ts` — thêm `router.get('/', ...)`
- **Không cần** thay đổi DB

#### TASK-004: Implement HTTP API cho `nhat-ky-kiem-toan`
- **Module**: `nhat-ky-kiem-toan`
- **Endpoint**: `GET /nhat-ky-kiem-toan/:loaiDoiTuong/:doiTuongId`
- **Logic**: Tra cứu audit log theo entity type + entity ID
- **Files cần tạo/sửa**:
  - `nhat-ky-kiem-toan.repository.ts` — thêm `timTheoDoiTuong(loaiDoiTuong, doiTuongId)`
  - `nhat-ky-kiem-toan.service.ts` — thêm `layNhatKy(loaiDoiTuong, doiTuongId)`
  - `controllers/nhat-ky-kiem-toan.controller.ts` — tạo mới
  - `nhat-ky-kiem-toan/index.ts` — thay thế `createModuleRouter` bằng router thật
- **Không cần** thay đổi DB

---

### P2 — Cải thiện chất lượng code

#### TASK-005: Clean up `registeredModules` trong `modules/index.ts`
- **File**: `/home/giang/Documents/TKPM /NCKH-KTPM/backend/src/modules/index.ts`
- **Action**: Xóa entries trùng lặp (dòng 43, 44), cập nhật đúng paths sau khi fix TASK-001

#### TASK-006: Thêm `patchJson` vào `api-client.js`
- **File**: `/home/giang/Documents/TKPM /NCKH-KTPM/frontend/src/core/api/api-client.js`
- **Action**: Thêm method `patchJson(path, body, options)` để hỗ trợ `PATCH /thong-bao/:id/da-doc`

---

### P3 — Feature phụ (sau khi luồng chính đã ổn định)

#### TASK-007: Thêm `PATCH /thong-bao/tat-ca/da-doc` — đánh dấu tất cả đã đọc
- Cần cẩn thận với route conflict: phải đặt trước `PATCH /:id/da-doc`

#### TASK-008: Implement `xac-thuc` module với JWT
- Thay thế cơ chế header giả lập bằng JWT thật
- Theo `uu_tien_cong_viec_can_lam.md`: đây là ưu tiên 7

#### TASK-009: Chuyển frontend sang TypeScript
- Theo kế hoạch trong `uu_tien_cong_viec_can_lam.md`

#### TASK-010: Tách `App.js` (782 dòng) thành các route components riêng

#### TASK-011: Tách `StudentJourneyPage.js` (706 dòng) thành các pages riêng theo feature

#### TASK-012: Implement các feature scaffolding trống
- `research-area/`, `research-group/`, `group-matching/`, `lecturer-group-selection/`, `topic-selection/`, `topic-review/`

---

## 8. FILES CẦN SỬA — TỔNG HỢP

```
backend/src/modules/index.ts
  → TASK-001: Xóa dòng 64-65 (double-mount)
  → TASK-005: Clean up registeredModules

backend/src/modules/nop-de-tai/repositories/nop-de-tai.repository.ts
  → TASK-002: Fix 3 hard-coded strings (dòng 70, 77, 108)

backend/src/modules/de-tai-de-xuat/repositories/de-tai-de-xuat.repository.ts
  → TASK-003: Thêm timDanhSachDeTaiDeXuatChoNhom()

backend/src/modules/de-tai-de-xuat/services/de-tai-de-xuat.service.ts
  → TASK-003: Thêm layDanhSachDeTaiDeXuat()

backend/src/modules/de-tai-de-xuat/controllers/de-tai-de-xuat.controller.ts
  → TASK-003: Thêm layDanhSachDeTaiDeXuat()

backend/src/modules/de-tai-de-xuat/index.ts
  → TASK-003: Thêm GET route

backend/src/modules/nhat-ky-kiem-toan/repositories/nhat-ky-kiem-toan.repository.ts
  → TASK-004: Thêm timTheoDoiTuong()

backend/src/modules/nhat-ky-kiem-toan/services/nhat-ky-kiem-toan.service.ts
  → TASK-004: Thêm layNhatKy()

backend/src/modules/nhat-ky-kiem-toan/controllers/nhat-ky-kiem-toan.controller.ts
  → TASK-004: Tạo mới

backend/src/modules/nhat-ky-kiem-toan/index.ts
  → TASK-004: Thay createModuleRouter bằng router thật

frontend/src/core/api/api-client.js
  → TASK-006: Thêm patchJson method
```

---

## 9. ĐIỀU KHÔNG CẦN THAY ĐỔI DB

Tất cả task P0 và P1 trên **không cần thay đổi schema hay migration**. Schema hiện tại đã đủ để implement.

Những điểm schema có thể muốn mở rộng sau này (cần xác nhận chủ dự án trước):
- Bảng `TopicReview` — lịch sử duyệt theo từng lần
- Bảng `TopicSubmissionVersion` — versioning nội dung đề tài
- Bảng `RegistrationPeriod` riêng biệt — quản lý đợt đăng ký độc lập với `MangNghienCuu`

> ⚠️ Theo AGENTS.md: không được tự ý thay đổi schema — cần xác nhận chủ dự án trước khi làm.

---

*Báo cáo này được tạo bằng cách đọc trực tiếp toàn bộ source code backend và frontend.*
