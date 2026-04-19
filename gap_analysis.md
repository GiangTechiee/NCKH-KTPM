# Gap Analysis — NCKH-KTPM

> Tài liệu này so sánh **tài liệu thiết kế** (`kien_truc_he_thong_lap_trinh.md`, `phan_tich_thiet_ke_luong_ung_dung.md`, `uu_tien_cong_viec_can_lam.md`) với **trạng thái triển khai thực tế** (code backend + frontend).
>
> Mục tiêu: xác định rõ những gì đã làm, những gì còn thiếu, và thứ tự ưu tiên còn lại.
>
> **Ngày phân tích:** 11/04/2026

---

## 1. Tổng quan tiến độ

| Hạng mục | Tổng việc | Đã xong | Đang làm | Chưa làm | % hoàn thành |
|---|---|---|---|---|---|
| Backend foundation | 6 | 6 | 0 | 0 | 100% |
| Backend API luồng sinh viên | 7 | 7 | 0 | 0 | 100% |
| Backend API luồng giảng viên | 3 | 3 | 0 | 0 | 100% |
| Backend API luồng đề tài | 9 | 8 | 0 | 1 | 89% |
| Backend hạ tầng dùng chung | 5 | 0 | 0 | 5 | 0% |
| Frontend nền | 6 | 0 | 0 | 6 | 0% |
| Frontend màn hình | 12 | 0~4* | 0 | 8~12 | ~20%** |

> \* Frontend đã có component hoạt động cho các luồng chính nhưng theo cấu trúc legacy (không đúng feature folder, không có routing, không có TypeScript).
> \*\* Ước tính dựa trên số màn hình có component thực sự hoạt động so với tài liệu thiết kế.

---

## 2. Backend — API đã implement (inventory thực tế)

### 2.1 Routes đang hoạt động

| Route | Module | Trạng thái |
|---|---|---|
| `GET /api/mang-nghien-cuu/dang-mo` | dang-ky-mang-nghien-cuu | ✅ Hoạt động |
| `POST /api/dang-ky-mang-nghien-cuu` | dang-ky-mang-nghien-cuu | ✅ Hoạt động |
| `GET /api/nhom-cua-toi` | nhom-nghien-cuu | ✅ Hoạt động |
| `POST /api/nhom-nghien-cuu` | nhom-nghien-cuu | ✅ Hoạt động |
| `POST /api/nhom-nghien-cuu/:groupId/moi-thanh-vien` | nhom-nghien-cuu | ✅ Hoạt động |
| `POST /api/loi-moi-nhom/:id/chap-nhan` | ghep-nhom | ✅ Hoạt động |
| `POST /api/loi-moi-nhom/:id/tu-choi` | ghep-nhom | ✅ Hoạt động |
| `GET /api/goi-y-ghep-nhom` | ghep-nhom | ✅ Hoạt động |
| `GET /api/giang-vien/nhom/dang-huong-dan` | phan-cong-giang-vien | ✅ Hoạt động |
| `GET /api/giang-vien/nhom/co-the-nhan` | phan-cong-giang-vien | ✅ Hoạt động |
| `GET /api/giang-vien/nhom/:groupId` | phan-cong-giang-vien | ✅ Hoạt động |
| `POST /api/giang-vien/nhom/:groupId/nhan-huong-dan` | phan-cong-giang-vien | ✅ Hoạt động |
| `GET /api/de-tai-cua-toi/co-the-chon` | nop-de-tai | ✅ Hoạt động |
| `POST /api/nop-de-tai` | nop-de-tai | ✅ Hoạt động |
| `PUT /api/nop-de-tai/:id` | nop-de-tai | ✅ Hoạt động |
| `GET /api/giang-vien/de-tai-cho-duyet` | duyet-de-tai | ✅ Hoạt động |
| `POST /api/giang-vien/de-tai/:id/duyet` | duyet-de-tai | ✅ Hoạt động |
| `POST /api/giang-vien/de-tai/:id/yeu-cau-chinh-sua` | duyet-de-tai | ✅ Hoạt động |
| `POST /api/giang-vien/de-tai/:id/tu-choi` | duyet-de-tai | ✅ Hoạt động |
| `POST /api/giang-vien/de-tai/:id/chot` | duyet-de-tai | ✅ Hoạt động |
| `GET /api/trang-thai-quy-trinh/sinh-vien` | trang-thai-quy-trinh | ✅ Hoạt động |
| `GET /api/trang-thai-quy-trinh/giang-vien` | trang-thai-quy-trinh | ✅ Hoạt động |
| `GET /api/thong-bao` | thong-bao | ✅ Hoạt động |
| `PATCH /api/thong-bao/:id/da-doc` | thong-bao | ✅ Hoạt động |
| `GET /api/nguoi-dung/sinh-vien` | nguoi-dung | ✅ Hoạt động |
| `GET /api/nguoi-dung/giang-vien` | nguoi-dung | ✅ Hoạt động |

### 2.2 Routes đăng ký nhưng là STUB (không có controller/logic)

| Route | Module | Vấn đề |
|---|---|---|
| `/api/xac-thuc/*` | xac-thuc | Module chỉ có `createModuleRouter` placeholder — không có login, JWT, session |
| `GET /api/nhat-ky-kiem-toan` | nhat-ky-kiem-toan | Module chỉ có `createModuleRouter` placeholder — không có controller |

---

## 3. Backend — Gaps (API được tài liệu yêu cầu nhưng chưa có)

### 3.1 API hoàn toàn thiếu

| # | API tài liệu yêu cầu | Luồng nghiệp vụ | Mức ảnh hưởng |
|---|---|---|---|
| G1 | `POST /api/de-tai-de-xuat` | GV tạo đề tài đề xuất cho nhóm | **P0 — CRITICAL** |
| G2 | `GET /api/de-tai-de-xuat?nhomId=X` | Nhóm xem đề tài GV đã đề xuất | **P0 — CRITICAL** |
| G3 | `POST /api/chon-de-tai-tu-de-xuat/:proposalId` | Nhóm chọn từ đề tài GV đề xuất (Use Case G Trường hợp 1) | **P0 — CRITICAL** |
| G4 | `GET /api/nhat-ky-kiem-toan/:entityType/:entityId` | Xem lịch sử audit log | **P1 — HIGH** |
| G5 | `GET /api/trang-thai-quy-trinh/:groupId` | Workflow status theo groupId cụ thể | **P1 — HIGH** |
| G6 | `POST /api/xac-thuc/dang-nhap` | Đăng nhập / phát JWT | **P2 — MEDIUM** |
| G7 | `POST /api/xac-thuc/lam-moi-token` | Refresh token | **P2 — MEDIUM** |
| G8 | `POST /api/xac-thuc/dang-xuat` | Đăng xuất | **P2 — MEDIUM** |

### 3.2 Chi tiết vấn đề quan trọng nhất

**G1–G3: Luồng GV đề xuất đề tài bị thiếu hoàn toàn**

`POST /api/de-tai-de-xuat` đã được đăng ký trong `modules/index.ts` (dòng 68: `router.use('/de-tai-de-xuat', lecturerTopicProposalRouter)`) nhưng module này chỉ có:

```
router.post('/', xuLyBatDongBo(deTaiDeXuatController.taoDeTaiDeXuat));
```

Tức là chỉ có route tạo (POST) mà không có:
- GET để nhóm xem danh sách đề tài GV đã đề xuất cho mình
- Route để nhóm chọn/accept một đề tài GV đề xuất

Đây là **Use Case G Trường hợp 1** trong `phan_tich_thiet_ke_luong_ung_dung.md` — toàn bộ flow này hiện không có backend.

**G4: Audit log không có GET endpoint**

Schema `NhatKyKiemToan` đã đầy đủ trong Prisma. Module `nhat-ky-kiem-toan` đã được đăng ký router tại `/api/nhat-ky-kiem-toan`. Nhưng `index.ts` của module này chỉ là `createModuleRouter` stub — không có controller, không có route nào.

---

## 4. Database Schema — Gaps

So sánh `schema.prisma` với thiết kế tài liệu:

### 4.1 Bảng thiếu

| # | Bảng tài liệu yêu cầu | Trạng thái hiện tại | Ảnh hưởng |
|---|---|---|---|
| D1 | `TopicSubmissionVersion` — lưu version history mỗi lần chỉnh sửa | Không có. Chỉ có `soLanChinhSua` (counter) trong `DeTaiNghienCuu` | Mất lịch sử revision, không trace được thay đổi |
| D2 | `TopicReview` — lưu mỗi lần review riêng (nhận xét, kết quả, ngày) | Không có. Chỉ có `nhanXetGiangVien` text field ghi đè | Không có lịch sử review, không biết ai review khi nào |
| D3 | `LecturerSpecialization` — bảng riêng cho chuyên môn GV | Không có. `chuyenMon` là `String?` trong `GiangVien` | Matching GV–nhóm theo chuyên môn kém chính xác |
| D4 | `RegistrationPeriod` — đợt đăng ký riêng biệt | Không có. `thoiGianMoDangKy`/`thoiGianDongDangKy` gộp trong `MangNghienCuu` | Không quản lý được nhiều đợt đăng ký cho cùng mảng |
| D5 | `User` bảng trung tâm (1-1 với SinhVien/GiangVien) | Không có. `SinhVien` và `GiangVien` là bảng độc lập | Auth system không có user chung để gắn JWT |

### 4.2 Bảng đã có (không cần thêm)

Các bảng sau đã được thiết kế và implement đầy đủ:
- `SinhVien`, `GiangVien`, `MangNghienCuu`
- `SinhVienDangKyMang` (đăng ký mảng)
- `NhomNghienCuu`, `ThanhVienNhomNghienCuu`
- `LoiMoiNhom` (GroupInvitation — đã có)
- `DeTaiNghienCuu` (topic submission)
- `NhatKyKiemToan` (audit log — bảng đã đủ, chỉ thiếu API)
- `ThongBao` (notification — đã đủ)

> **Lưu ý:** Theo `AGENTS.md`, mọi thay đổi schema DB **phải được xác nhận trước** khi thực hiện.

---

## 5. Enum / Constants — Inconsistencies

### 5.1 Mâu thuẫn giữa code và tài liệu

| # | Vấn đề | Trong code | Trong tài liệu | Khuyến nghị |
|---|---|---|---|---|
| E1 | `ResearchAreaStatus` dùng tiếng Anh | `OPEN`, `CLOSED` | Tài liệu không quy định cụ thể | Đổi thành `DANG_MO`, `DA_DONG` cho nhất quán với các enum khác |
| E2 | Tên trạng thái nhóm trong `kien_truc` khác code | `kien_truc` ghi `CHO_CHON_DE_TAI` | Code dùng `DANG_CHON_DE_TAI` | Giữ `DANG_CHON_DE_TAI` như trong code và schema — đây là chuẩn đúng |
| E3 | `InvitationStatus` trong AGENTS.md dùng tiếng Anh | Code dùng `CHO_XAC_NHAN`, `DA_CHAP_NHAN`, `DA_TU_CHOI`, `DA_HUY` | `AGENTS.md` ghi `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED` | Code hiện tại (tiếng Việt) nhất quán với toàn bộ enum còn lại — nên giữ |
| E4 | `SinhVienDangKyMang.trangThai` dùng giá trị tiếng Anh | Schema có `@default("REGISTERED")` | Không có enum tương ứng trong `trang-thai.enum.ts` | Cần thêm enum `RegistrationStatus` vào `trang-thai.enum.ts` |

### 5.2 Enum thiếu (có trong schema nhưng không có enum constant trong code)

| # | Field | Giá trị trong schema | Enum trong code? |
|---|---|---|---|
| M1 | `SinhVienDangKyMang.trangThai` | `"REGISTERED"` (default) | Không có |
| M2 | `NhatKyKiemToan.vaiTroNguoiThucHien` | `SINH_VIEN`, `GIANG_VIEN`, `QUAN_TRI_VIEN` | Có trong `UserRole` — OK |
| M3 | `ThanhVienNhomNghienCuu.vaiTro` | `TRUONG_NHOM`, `THANH_VIEN` | Có trong `GroupMemberRole` — OK |
| M4 | `ThanhVienNhomNghienCuu.trangThaiThamGia` | `CHO_XAC_NHAN`, `DA_CHAP_NHAN`, `DA_TU_CHOI` | Có trong `MemberJoinStatus` — OK |

---

## 6. Frontend — Inventory thực tế

### 6.1 Components đang hoạt động

| Component | File | Chức năng | Tình trạng |
|---|---|---|---|
| `ResearchAreaBoard` | `student-journey/components/` | Xem + chọn mảng nghiên cứu | ✅ Hoạt động |
| `RegistrationConfirmationModal` | `student-journey/components/` | Xác nhận đăng ký mảng | ✅ Hoạt động |
| `ResearchGroupBoard` | `student-journey/components/` | Tạo nhóm, mời thành viên | ✅ Hoạt động |
| `GroupMatchingBoard` | `student-journey/components/` | Gợi ý ghép nhóm, lời mời nhận | ✅ Hoạt động |
| `TopicBoard` | `student-journey/components/` | Đề xuất đề tài (nhóm tự đề xuất) | ✅ Có — nhưng thiếu Tab GV đề xuất |
| `LecturerGroupSelectionBoard` | `student-journey/components/` | GV xem + chọn nhóm hướng dẫn | ✅ Hoạt động |
| `LecturerGroupDetailModal` | `student-journey/components/` | GV xem chi tiết nhóm | ✅ Hoạt động |
| `LecturerCurrentGroupsBoard` | `student-journey/components/` | GV xem nhóm đang hướng dẫn | ✅ Hoạt động |
| `LecturerTopicReviewBoard` | `student-journey/components/` | GV duyệt / từ chối đề tài | ✅ Hoạt động |
| `StudentProgressBoard` | `workflow-status/components/` | Sinh viên xem tiến trình | ✅ Hoạt động |
| `LecturerProgressBoard` | `workflow-status/components/` | GV xem tiến trình nhóm | ✅ Hoạt động |
| `NotificationBoard` | `notifications/components/` | Xem + đánh dấu đã đọc thông báo | ✅ Hoạt động |
| `ProgressRail` | `student-journey/components/` | Thanh tiến trình steps | ✅ Hoạt động |

### 6.2 Feature folders tồn tại nhưng là stub (chỉ có `index.js` rỗng)

| Folder | Trạng thái | Ghi chú |
|---|---|---|
| `features/research-area/` | ❌ Chỉ có `index.js` rỗng | Logic nằm trong `student-journey` |
| `features/research-group/` | ❌ Chỉ có `index.js` rỗng | Logic nằm trong `student-journey` |
| `features/group-matching/` | ❌ Chỉ có `index.js` rỗng | Logic nằm trong `student-journey` |
| `features/lecturer-group-selection/` | ❌ Chỉ có `index.js` rỗng | Logic nằm trong `student-journey` |
| `features/topic-selection/` | ❌ Chỉ có `index.js` rỗng | Logic nằm trong `student-journey` |
| `features/topic-review/` | ❌ Chỉ có `index.js` rỗng | Logic nằm trong `student-journey` |

---

## 7. Frontend — Gaps (màn hình/tính năng tài liệu yêu cầu nhưng chưa có)

### 7.1 Tính năng thiếu trong component đã có

| # | Thiếu gì | Component nào | Ảnh hưởng |
|---|---|---|---|
| F1 | Tab "Chọn từ đề tài GV đề xuất" | `TopicBoard.js` | **P0** — Use Case G Trường hợp 1 không có UI |
| F2 | Hiển thị trạng thái đề tài bằng tên có nghĩa (thay vì raw status string) | `TopicBoard.js` | P2 — UX kém |
| F3 | Checklist đánh giá (đúng hướng, khả thi, ứng dụng...) khi GV duyệt | `LecturerTopicReviewBoard.js` | P2 — Thiếu theo `phan_tich_thiet_ke` |
| F4 | Lịch sử review (nhiều vòng) trong chi tiết đề tài | `LecturerTopicReviewBoard.js` | P2 — Phụ thuộc vào `TopicReview` DB table |
| F5 | Lịch sử lời mời đã gửi / đã nhận / đã xử lý | `GroupMatchingBoard.js` | P2 |
| F6 | Badge "Phù hợp cao", "Cùng mảng", "Nhóm còn thiếu X người" | `GroupMatchingBoard.js` | P3 |
| F7 | Lịch sử thay đổi nhóm trong modal chi tiết nhóm | `LecturerGroupDetailModal.js` | P2 — Phụ thuộc vào audit log API |

### 7.2 Màn hình / tính năng hoàn toàn thiếu

| # | Màn hình / Tính năng | Nguồn tài liệu | Mức ưu tiên |
|---|---|---|---|
| F8 | Auth / Login screen | `kien_truc`, `uu_tien` mục 6 | P2 |
| F9 | Route guard (bảo vệ route theo role/login) | `kien_truc`, `AGENTS.md` | P2 |
| F10 | URL-based routing (React Router) | `kien_truc` cấu trúc `src/app/router/` | P2 |
| F11 | Admin dashboard | `App.js` chỉ có placeholder "đang phát triển" | P3 |
| F12 | Form validation schema (Zod/Yup) | `AGENTS.md` mục 5.3, `kien_truc` | P2 |
| F13 | CountdownTimer cho deadline đăng ký | `phan_tich_thiet_ke` Màn hình 1 | P3 |
| F14 | TypeScript cho toàn bộ frontend | `uu_tien` mục 0, `kien_truc` tech stack | P2 |

### 7.3 Vấn đề kiến trúc frontend (không phải feature gap, nhưng là tech debt)

| # | Vấn đề | Chi tiết |
|---|---|---|
| A1 | Toàn bộ logic student + lecturer nằm trong `student-journey/` | Vi phạm feature-based architecture theo `kien_truc` |
| A2 | Không có URL routing | `activeNavId` state thay vì React Router — không có deep link, không có browser back |
| A3 | `App.js` là god component (782 dòng) | Nhập và điều phối mọi thứ — vi phạm nguyên tắc single responsibility |
| A4 | Frontend dùng JavaScript, không phải TypeScript | Tài liệu yêu cầu TypeScript. Cần migrate sớm để tránh nợ kỹ thuật tích lũy |
| A5 | Không có form validation schema | Các form (đề xuất đề tài, tạo nhóm, mời thành viên) không validate bằng Zod/Yup |
| A6 | `useStudentJourneyDemo` hook — tên có "Demo" | Cần đổi tên khi migrate sang flow thật |

---

## 8. Backlog ưu tiên — Công việc còn lại

### P0 — Blockers (phải làm trước, ảnh hưởng đến flow cốt lõi)

| ID | Việc cần làm | Backend/Frontend | Ghi chú |
|---|---|---|---|
| P0-1 | `POST /api/de-tai-de-xuat` — hoàn thiện controller GV tạo đề xuất | Backend | Module có route nhưng chưa rõ service có đầy đủ không |
| P0-2 | `GET /api/de-tai-de-xuat` — list đề tài GV đã đề xuất (filter theo nhomId) | Backend | Thêm route GET vào `de-tai-de-xuat/index.ts` |
| P0-3 | `POST /api/de-tai-de-xuat/:id/chon` — nhóm chọn đề tài từ GV đề xuất | Backend | Use Case G Trường hợp 1 |
| P0-4 | Frontend `TopicBoard`: thêm Tab A "Chọn từ đề tài GV đề xuất" | Frontend | Phụ thuộc P0-2, P0-3 |

### P1 — Cao (ảnh hưởng trực tiếp tới nghiệp vụ hoặc auditability)

| ID | Việc cần làm | Backend/Frontend | Ghi chú |
|---|---|---|---|
| P1-1 | `GET /api/nhat-ky-kiem-toan/:entityType/:entityId` — implement controller + service + repository | Backend | Schema đã có, chỉ cần code tầng application |
| P1-2 | `GET /api/trang-thai-quy-trinh/:groupId` — workflow status cho nhóm cụ thể | Backend | Hiện chỉ có `/sinh-vien` và `/giang-vien` |
| P1-3 | Kiểm tra `POST /api/de-tai-de-xuat` có đủ business rule chưa (GV chỉ đề xuất cho nhóm mình hướng dẫn, v.v.) | Backend | Review service layer |
| P1-4 | Thêm enum `RegistrationStatus` cho `SinhVienDangKyMang.trangThai` | Backend | Hiện schema dùng `"REGISTERED"` string literal |

### P2 — Trung bình (chất lượng, completeness, hoặc chuẩn bị cho milestone tiếp)

| ID | Việc cần làm | Backend/Frontend | Ghi chú |
|---|---|---|---|
| P2-1 | Module `xac-thuc` — implement login/JWT/logout | Backend | Hiện là stub hoàn toàn |
| P2-2 | `ResearchAreaStatus` enum — đổi sang tiếng Việt (`DANG_MO`, `DA_DONG`) | Backend | Cần xác nhận DB migration nếu thay đổi giá trị trong DB |
| P2-3 | Frontend: Migrate sang TypeScript | Frontend | Làm trước khi codebase lớn thêm |
| P2-4 | Frontend: Thêm React Router, URL-based navigation | Frontend | Bỏ `activeNavId` state switch |
| P2-5 | Frontend: Form validation với Zod cho đề xuất đề tài, tạo nhóm | Frontend | |
| P2-6 | Frontend: Auth context + route guard | Frontend | Phụ thuộc P2-1 (backend auth) |
| P2-7 | Frontend: Refactor `App.js` god component thành feature containers | Frontend | |
| P2-8 | Frontend `LecturerTopicReviewBoard`: thêm checklist đánh giá | Frontend | Theo `phan_tich_thiet_ke` Màn hình 6 |
| P2-9 | Backend hạ tầng: hoàn thiện `AuditLogService` dùng chung | Backend | Verify audit log được ghi đúng trong tất cả service hiện có |
| P2-10 | Backend hạ tầng: hoàn thiện `NotificationService` dùng chung | Backend | Verify notification được gửi đúng sau tất cả transaction quan trọng |

### P3 — Thấp (ngoài luồng cốt lõi, làm sau)

| ID | Việc cần làm | Backend/Frontend | Ghi chú |
|---|---|---|---|
| P3-1 | Admin module/dashboard | Backend + Frontend | Placeholder hiện tại |
| P3-2 | `TopicSubmissionVersion` table — versioning đề tài | Backend + DB | Cần xác nhận DB migration |
| P3-3 | `TopicReview` table — lịch sử review | Backend + DB | Cần xác nhận DB migration |
| P3-4 | `LecturerSpecialization` table riêng | Backend + DB | Cần xác nhận DB migration |
| P3-5 | Frontend: CountdownTimer cho deadline | Frontend | |
| P3-6 | Frontend: Badge "Phù hợp cao / Cùng mảng" trong `GroupMatchingBoard` | Frontend | |
| P3-7 | Frontend: Lịch sử lời mời trong `GroupMatchingBoard` | Frontend | |
| P3-8 | Test coverage — service, repository, use case quan trọng | Backend + Frontend | |
| P3-9 | Refactor feature folders (bỏ stub index.js) | Frontend | |
| P3-10 | `RegistrationPeriod` table riêng | Backend + DB | Cần xác nhận DB migration |

---

## 9. Mâu thuẫn giữa các tài liệu

| # | Mâu thuẫn | Tài liệu A | Tài liệu B | Khuyến nghị |
|---|---|---|---|---|
| C1 | Tên trạng thái nhóm khi chờ chọn đề tài | `kien_truc`: `CHO_CHON_DE_TAI` | Code + schema + `phan_tich`: `DANG_CHON_DE_TAI` | Dùng `DANG_CHON_DE_TAI` (đã trong DB) |
| C2 | InvitationStatus dùng tiếng Anh hay tiếng Việt | `AGENTS.md`: `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED` | Code: `CHO_XAC_NHAN`, `DA_CHAP_NHAN`, `DA_TU_CHOI`, `DA_HUY` | Dùng tiếng Việt (nhất quán với toàn bộ enum còn lại) |
| C3 | `uu_tien_cong_viec_can_lam.md` mục 4 đánh dấu `[ ]` cho `POST /de-tai-de-xuat` | Danh sách "Nhóm API cần có cho luồng đề tài" | Cùng file đánh dấu `[x]` cho audit log/notification | Vẫn còn thiếu `GET /de-tai-de-xuat` và route chọn đề tài — chưa hoàn thành |
| C4 | `kien_truc` mô tả `User` table trung tâm | Kiến trúc `User` 1-1 `Student`/`Lecturer` | Schema: `SinhVien` và `GiangVien` riêng biệt, không có `User` | Giữ nguyên schema hiện tại — thêm `User` table là P3+ |

---

## 10. Tóm tắt — Những gì đã làm tốt

1. **Backend foundation hoàn chỉnh** — module structure, controller→service→repository, response format chuẩn, error handling, enum constants, Prisma singleton.
2. **Luồng sinh viên backend đầy đủ** — đăng ký mảng, tạo nhóm, mời thành viên, chấp nhận/từ chối lời mời, gợi ý ghép nhóm — đều có business rule + transaction.
3. **Luồng giảng viên backend đầy đủ** — xem nhóm ứng viên, chi tiết nhóm, nhận hướng dẫn với quota check + transaction.
4. **Luồng đề tài backend gần hoàn chỉnh** — nộp đề tài, chỉnh sửa, duyệt/từ chối/yêu cầu chỉnh sửa/chốt — đều có transaction + audit log + notification.
5. **Schema Prisma đầy đủ** cho tất cả entity cốt lõi bao gồm cả `LoiMoiNhom`, `NhatKyKiemToan`, `ThongBao`.
6. **Frontend có UI hoạt động** cho cả luồng sinh viên và giảng viên — tất cả 5 màn hình sinh viên + 4 màn hình giảng viên có component đang chạy.
7. **Workflow status + notification** có cả backend và frontend.
8. **Enum nhất quán** — tất cả trạng thái dùng enum constant, không hard-code string trừ `ResearchAreaStatus`.

---

## 11. Thứ tự làm việc được khuyến nghị tiếp theo

```
Bước 1 (P0): Hoàn thiện luồng GV đề xuất đề tài
  ├── Backend: Verify + complete service deTaiDeXuat.taoDeTaiDeXuat
  ├── Backend: Thêm GET /api/de-tai-de-xuat route
  ├── Backend: Thêm POST /api/de-tai-de-xuat/:id/chon route
  └── Frontend: Thêm Tab GV đề xuất vào TopicBoard

Bước 2 (P1): Audit log API + workflow status by groupId
  ├── Backend: Implement nhat-ky-kiem-toan controller/service/repository
  └── Backend: Thêm GET /trang-thai-quy-trinh/:groupId

Bước 3 (P2 — chuẩn bị cho production): Auth + TypeScript + Routing
  ├── Backend: Module xac-thuc (login/JWT/logout)
  ├── Frontend: Migrate sang TypeScript
  ├── Frontend: Thêm React Router
  └── Frontend: Auth context + route guard

Bước 4 (P2 — quality): Refactor + form validation
  ├── Frontend: Zod schema cho các form chính
  ├── Frontend: Tách App.js god component
  └── Backend: Verify audit log + notification đầy đủ trong tất cả flow

Bước 5 (P3): DB schema mở rộng (sau khi xác nhận chủ dự án)
  ├── TopicSubmissionVersion
  ├── TopicReview
  └── RegistrationPeriod
```

---

*Gap Analysis — Version 1.0 | Được tạo tự động từ so sánh code vs tài liệu thiết kế*
