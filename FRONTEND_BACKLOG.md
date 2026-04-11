# Frontend Backlog — NCKH-KTPM
> Tạo ngày: 2026-04-11 | Dựa trên audit toàn bộ frontend source code

---

## Tóm tắt nhanh

| Mức độ | Số lượng | Mô tả |
|---|---|---|
| P0 — Critical | 3 | Chức năng bị thiếu hoàn toàn, ảnh hưởng trực tiếp đến flow nghiệp vụ |
| P1 — High | 5 | Dữ liệu sai/giả hiển thị ra UI, gây nhầm lẫn cho người dùng |
| P2 — Medium | 5 | Tính năng thiếu khiến UI không đầy đủ nhưng không blocking |
| P3 — Low | 4 | Cleanup, dead code, minor UX |

---

## P0 — Critical (làm trước)

---

### P0-1: "Chốt đề tài" flow hoàn toàn thiếu

**Vấn đề:**  
Backend có transition `DA_DUYET → DA_CHOT`. UI mockup `chot-de-tai-nghien-cuu-GV.jpg` và `xac-nhan-chot-de-tai-GV.jpg` mô tả rõ flow này. Nhưng `LecturerTopicReviewBoard.js` chỉ có 3 nút: Duyệt / Yêu cầu chỉnh sửa / Từ chối — **không có nút "Chốt đề tài"** và không có confirmation modal.

**Hành vi mong đợi:**  
Khi `selectedTopic.status === 'DA_DUYET'`, giảng viên thấy thêm nút **"Chốt đề tài"**. Nhấn vào mở confirmation modal, xác nhận → gọi API `POST /api/giang-vien/de-tai/:id/chot` → reload danh sách.

**Files cần chỉnh sửa:**
- `frontend/src/features/student-journey/components/LecturerTopicReviewBoard.js` — thêm nút Chốt đề tài (chỉ render khi status = DA_DUYET), thêm confirmation modal inline
- `frontend/src/features/student-journey/hooks/useLecturerTopicReview.js` — thêm `onFinalizeTopic` handler
- `frontend/src/features/student-journey/services/student-journey.service.js` — thêm hàm `chotDeTai(lecturerCode, topicId)`

**Endpoint cần gọi:** `POST /api/giang-vien/de-tai/:topicId/chot`

---

### P0-2: Button "Xem chi tiết" mảng nghiên cứu là dead button

**Vấn đề:**  
`ResearchAreaBoard.js` line 138–142: Button "Xem chi tiết" render nhưng không có `onClick` handler. Người dùng nhấn không có gì xảy ra.

**Hành vi mong đợi:**  
Nhấn "Xem chi tiết" mở một modal hiển thị thông tin đầy đủ của mảng: tên, mô tả dài, số lượng sinh viên đã đăng ký, thời gian mở/đóng, và danh sách giảng viên phụ trách (nếu có).

**Files cần chỉnh sửa:**
- `frontend/src/features/student-journey/components/ResearchAreaBoard.js` — thêm `onViewDetail` prop và wire `onClick`
- Tạo mới `frontend/src/features/student-journey/components/ResearchAreaDetailModal.js` — modal hiển thị chi tiết mảng
- `frontend/src/features/student-journey/hooks/useStudentJourneyDemo.js` — thêm state `detailArea` và handler `handleViewAreaDetail`
- `frontend/src/app/App.js` — pass props xuống ResearchAreaBoard

---

### P0-3: Mobile navigation hoàn toàn không tồn tại

**Vấn đề:**  
`App.js` sidebar dùng `xl:flex` (line 380) — chỉ hiển thị ở màn hình ≥ 1280px. Trên màn nhỏ hơn không có hamburger menu, bottom bar, hay bất kỳ navigation mechanism nào. Người dùng mobile hoàn toàn không thể điều hướng giữa các section.

**Hành vi mong đợi:**  
- Thêm hamburger button ở header (hiển thị khi `< xl`)
- Nhấn hamburger mở slide-over sidebar hoặc dropdown navigation
- Đóng khi chọn nav item hoặc click outside

**Files cần chỉnh sửa:**
- `frontend/src/app/App.js` — thêm `isMobileNavOpen` state, hamburger button vào header, overlay + slide-over sidebar logic

---

## P1 — High (dữ liệu sai/giả)

---

### P1-1: Raw enum strings hiển thị thay vì label tiếng Việt (3 files)

**Vấn đề:**  
Ba component hiển thị raw enum value trực tiếp ra UI:

| File | Line(s) | Raw value ví dụ |
|---|---|---|
| `TopicBoard.js` | 90 | `CHO_GIANG_VIEN_DUYET` |
| `LecturerTopicReviewBoard.js` | 77, 106 | `DA_DUYET`, `CAN_CHINH_SUA` |
| `LecturerTopicReviewBoard.js` | 138 | `TRUONG_NHOM` (member role) |
| `ResearchGroupBoard.js` | 70 | `DANG_TUYEN_THANH_VIEN` (group status) |

**Hành vi mong đợi:**  
Tất cả enum phải hiển thị bằng label tiếng Việt thân thiện.

**Map cần tạo (dùng chung, đặt trong `shared/`):**

```js
// TOPIC_SUBMISSION_STATUS labels
CHO_GIANG_VIEN_DUYET → 'Chờ giảng viên duyệt'
CAN_CHINH_SUA        → 'Cần chỉnh sửa'
DA_DUYET             → 'Đã duyệt'
TU_CHOI              → 'Bị từ chối'
DA_CHOT              → 'Đã chốt'
NHAP                 → 'Bản nháp'

// GROUP_STATUS labels
NHAP                   → 'Bản nháp'
DANG_TUYEN_THANH_VIEN  → 'Đang tuyển thành viên'
DA_DU_THANH_VIEN       → 'Đủ thành viên'
CHUA_CO_GIANG_VIEN     → 'Chưa có giảng viên'
DA_CO_GIANG_VIEN       → 'Đã có giảng viên'
DANG_CHON_DE_TAI       → 'Đang chọn đề tài'
CHO_DUYET_DE_TAI       → 'Chờ duyệt đề tài'
CAN_CHINH_SUA_DE_TAI   → 'Cần chỉnh sửa đề tài'
DA_DUYET_DE_TAI        → 'Đề tài đã duyệt'
DA_CHOT_DE_TAI         → 'Đã chốt đề tài'

// MEMBER_ROLE labels
TRUONG_NHOM → 'Trưởng nhóm'
THANH_VIEN  → 'Thành viên'

// INVITATION_STATUS labels (đã có InvitationStatusPill đúng trong GroupMatchingBoard — dùng lại)
```

**Files cần chỉnh sửa:**
- Tạo mới `frontend/src/shared/utils/status-label.utils.js` — export các hàm `getTopicStatusLabel(status)`, `getGroupStatusLabel(status)`, `getMemberRoleLabel(role)`, `getInvitationStatusLabel(status)`
- `frontend/src/features/student-journey/components/TopicBoard.js` — line 90: thay `{topic.status}` → `{getTopicStatusLabel(topic.status)}`
- `frontend/src/features/student-journey/components/LecturerTopicReviewBoard.js` — lines 77, 106, 138
- `frontend/src/features/student-journey/components/ResearchGroupBoard.js` — line 70 (group status), line 116–118 (member status — xem P1-2), line 164 (invitation status)
- `frontend/src/features/student-journey/components/LecturerGroupDetailModal.js` — line 29 (`{group.status}`), line 52 (`{member.role}`)

---

### P1-2: Member status badge trong ResearchGroupBoard hardcoded "Đã xác nhận"

**Vấn đề:**  
`ResearchGroupBoard.js` line 116–118: Badge luôn hiển thị "Đã xác nhận" bằng `bg-emerald-100` bất kể `member.status` thật. Data từ service có `member.status` (field `trangThaiThamGia` từ backend), nhưng không được dùng.

**Hành vi mong đợi:**  
Dùng `member.status` để render badge với màu và label đúng:
- `PENDING` / `CHO_XAC_NHAN` → amber "Chờ xác nhận"
- `ACCEPTED` / `DA_CHAP_NHAN` → emerald "Đã xác nhận"
- `REJECTED` / `DA_TU_CHOI` → rose "Đã từ chối"

**Files cần chỉnh sửa:**
- `frontend/src/features/student-journey/components/ResearchGroupBoard.js` — line 116: dùng `member.status` thay vì hardcode

---

### P1-3: `slotLimit` trong ResearchAreaBoard là dữ liệu giả (derived arbitrarily)

**Vấn đề:**  
`student-journey.service.js` line 30: `slotLimit: Math.max((area.soLuongDaDangKy || 0) + 10, 10)` — con số +10 là tự bịa, không phải từ backend. Progress bar và thống kê "X/Y sinh viên" hiển thị sai.

**Giải pháp:**  
Nếu backend không trả `soLuongToiDa` (slot limit), cần 1 trong 2:
- Ẩn progress bar và stat "X/Y" nếu không có dữ liệu thật
- Hoặc hỏi backend để thêm field `soLuongToiDa` vào response `/api/mang-nghien-cuu/dang-mo`

**Files cần chỉnh sửa:**
- `frontend/src/features/student-journey/services/student-journey.service.js` — line 30: đổi `slotLimit` thành `area.soLuongToiDa || null`
- `frontend/src/features/student-journey/components/ResearchAreaBoard.js` — line 63, 109: chỉ render progress bar và stat khi `area.slotLimit !== null`

> ⚠️ Nếu backend cần thêm field `soLuongToiDa`, cần xác nhận với chủ dự án trước.

---

### P1-4: `student.fullName` trong `getRegistrationPageData` hardcoded

**Vấn đề:**  
`student-journey.service.js` line 101: `fullName: 'Người dùng hiện tại'` — không lấy từ API. Field `journey.student.fullName` sẽ sai nếu có component nào dùng (hiện chỉ `StudentJourneyPage.js` cũ dùng).

**Hành vi mong đợi:**  
Nhận `studentCode` từ param đã có sẵn và trả về thông tin thực từ backend, hoặc xóa field fake này vì `App.js` đã dùng `activeAccount.fullName` trực tiếp từ `useAccountSelector`.

**Files cần chỉnh sửa:**
- `frontend/src/features/student-journey/services/student-journey.service.js` — line 100–103: xóa `student` object fake hoặc thay bằng data thật từ API

---

### P1-5: `WorkflowStatusOverview` component có nội dung debug/dev

**Vấn đề:**  
`WorkflowStatusOverview.js` hiển thị "Backend message" và "Health check" raw data — đây là widget debug dành cho development, không phải UI production. Nếu component này được render trong app thật, người dùng sẽ thấy thông tin kỹ thuật.

**Kiểm tra:** Verify xem component này có được render trong route nào của production app không (trong `App.js`).

**Files cần chỉnh sửa:**
- `frontend/src/features/workflow-status/components/WorkflowStatusOverview.js` — refactor thành widget trạng thái thân thiện, hoặc remove nếu không dùng trong production

---

## P2 — Medium (tính năng thiếu)

---

### P2-1: Filter dropdown trong ResearchAreaBoard không functional

**Vấn đề:**  
`ResearchAreaBoard.js` lines 32–35: Dropdown "Tất cả ▾" là UI decoration thuần túy — không có `onChange`, không có state, không lọc gì.

**Hành vi mong đợi:**  
Dropdown lọc danh sách mảng theo trạng thái: "Tất cả" / "Đang mở" / "Sắp đóng" / "Đã đóng".

**Files cần chỉnh sửa:**
- `frontend/src/features/student-journey/components/ResearchAreaBoard.js` — thêm `filterStatus` prop và wire `onChange`
- `frontend/src/features/student-journey/hooks/useStudentJourneyDemo.js` — thêm `areaFilter` state và filter logic

---

### P2-2: "Nhóm gợi ý" trong GroupMatchingBoard không có action button

**Vấn đề:**  
`GroupMatchingBoard.js` lines 102–110: Section "Nhóm phù hợp để tham gia" chỉ hiển thị thông tin, không có button để sinh viên request join hoặc liên hệ trưởng nhóm.

**Hành vi mong đợi:**  
Mỗi nhóm gợi ý có nút **"Liên hệ trưởng nhóm"** hoặc **"Xin vào nhóm"** — gửi thông báo đến trưởng nhóm (có thể là tính năng thông báo thuần, không cần API mới).

> ⚠️ Nếu cần API mới để gửi request, cần xác nhận với chủ dự án trước khi implement.

**Files cần chỉnh sửa:**
- `frontend/src/features/student-journey/components/GroupMatchingBoard.js` — thêm action button trong suggestedGroups section

---

### P2-3: Unread notification count không hiển thị trên nav sidebar

**Vấn đề:**  
`useNotifications` trả về `unreadCount`. `App.js` sidebar render nav items nhưng không hiển thị badge số chưa đọc trên nav item "Thông báo".

**Hành vi mong đợi:**  
Nav item "Thông báo" có badge số đỏ khi `unreadCount > 0`, ví dụ: `Thông báo (3)` hoặc badge tròn đỏ bên cạnh icon.

**Files cần chỉnh sửa:**
- `frontend/src/app/App.js` — trong render nav items: nếu nav item là "Thông báo", hiển thị `unreadCount` badge. Cần pass `unreadCount` từ `useNotifications` vào nav render logic.

---

### P2-4: Admin role hoàn toàn placeholder

**Vấn đề:**  
`App.js` line 538–551: Role ADMIN chỉ hiển thị placeholder "Trang quản trị đang được phát triển". Không có nav items, không có màn hình nào cho admin.

**Tính năng admin cần thiết (theo tài liệu thiết kế):**
- Xem danh sách sinh viên và trạng thái workflow
- Xem danh sách giảng viên và quota hướng dẫn
- Xem thống kê tổng quan (số nhóm, đề tài đã duyệt, v.v.)
- Quản lý đợt đăng ký mảng (mở/đóng)

> ⚠️ Đây là feature lớn. Cần xác nhận scope với chủ dự án trước khi implement toàn bộ.

**Files cần tạo mới:**
- `frontend/src/features/admin/` directory với pages, hooks, services
- `frontend/src/app/App.js` — thêm `ADMIN_NAV` array và render admin content

---

### P2-5: `selectedAreaId` từ localStorage có thể stale

**Vấn đề:**  
`useStudentJourneyDemo.js` line 41: `selectedAreaId` được persist vào localStorage. Nếu sinh viên đã đăng ký mảng trên thiết bị khác hoặc admin reset, localStorage sẽ hiển thị sai trạng thái "Bạn đã chọn".

**Hành vi mong đợi:**  
Sau khi load data từ backend, ưu tiên `registrationSummary.selectedAreaId` (từ API) hơn localStorage. Chỉ dùng localStorage làm optimistic UI tạm thời.

**Files cần chỉnh sửa:**
- `frontend/src/features/student-journey/hooks/useStudentJourneyDemo.js` — sync `selectedAreaId` state với data từ backend sau mỗi lần fetch

---

## P3 — Low (cleanup)

---

### P3-1: `StudentJourneyPage.js` là orphan file

**Vấn đề:**  
`frontend/src/features/student-journey/pages/StudentJourneyPage.js` tồn tại nhưng `App.js` không import nó. File này có inline role selector và test accounts hardcoded — là phiên bản cũ trước khi có `useAccountSelector`.

**Hành động:**  
Xóa file này hoặc convert thành Storybook/demo page nếu cần giữ để test.

**Files cần xử lý:**
- `frontend/src/features/student-journey/pages/StudentJourneyPage.js` — xóa hoặc archive

---

### P3-2: `ProgressRail.js` là dead code

**Vấn đề:**  
`frontend/src/features/student-journey/components/ProgressRail.js` — component tồn tại nhưng không được import ở bất kỳ đâu trong `App.js` hay các component khác. `StudentProgressBoard.js` có `StepRail` riêng bên trong.

**Hành động:**  
Verify bằng grep, nếu không có import → xóa.

**Files cần xử lý:**
- `frontend/src/features/student-journey/components/ProgressRail.js` — xóa nếu không có consumer

---

### P3-3: `useStudentProgress` có params không dùng

**Vấn đề:**  
`useWorkflowStatus.js`: `useStudentProgress(studentCode, _groupData, _topicOverview)` nhận 2 params `_groupData` và `_topicOverview` với prefix `_` (signaling unused) nhưng vẫn là noise trong signature.

**Hành động:**  
Xóa unused params khỏi function signature.

**Files cần chỉnh sửa:**
- `frontend/src/features/workflow-status/hooks/useWorkflowStatus.js`

---

### P3-4: `WorkflowStatusOverview` không dùng trong production flow

**Vấn đề:**  
`WorkflowStatusOverview.js` hiển thị raw backend message và health check. Verify xem nó có được mount trong App.js hay không. Nếu không → đây là debug widget nên remove hoặc gate sau `process.env.NODE_ENV === 'development'`.

**Files cần xử lý:**
- `frontend/src/features/workflow-status/components/WorkflowStatusOverview.js`

---

## Ghi chú thêm (không phải backlog item, cần aware)

### `apiClient.requestJson` — đã verify OK
`api-client.js` export `requestJson` ở line 49. `notification.service.js` dùng `apiClient.requestJson(...)` là hợp lệ. **Không cần fix.**

### `account.service.js` — kết nối backend thật
Cả `layDanhSachSinhVien()` và `layDanhSachGiangVien()` đều gọi real API endpoints. **Không có fake data.**

### `GroupMatchingBoard` — `InvitationStatusPill` đã đúng
Component này đã có `InvitationStatusPill` với label map tiếng Việt đầy đủ (`CHO_XAC_NHAN → 'Chờ phản hồi'` v.v.). **Không cần fix.**

### `ResearchGroupBoard` — invitation status badge dùng màu amber cứng
Line 163: `bg-amber-100` hardcoded bất kể `invitation.status`. Cần dùng `InvitationStatusPill` (đã có trong `GroupMatchingBoard`) thay vì hardcode màu. Đây là minor polish thuộc P3.

---

## Thứ tự implement đề xuất

```
Sprint 1 (1–2 ngày):
  P1-1 → Tạo status-label.utils.js và fix tất cả raw enum strings (1 lần, sửa 4 files)
  P1-2 → Fix member status badge hardcoded
  P0-2 → Tạo ResearchAreaDetailModal và wire "Xem chi tiết"

Sprint 2 (1–2 ngày):
  P0-1 → Implement "Chốt đề tài" flow (thêm nút + confirmation modal + API call)
  P2-3 → Unread count badge trên nav

Sprint 3 (1 ngày):
  P0-3 → Mobile navigation (hamburger + slide-over)
  P2-1 → Filter dropdown ResearchAreaBoard

Sprint 4 (theo priority):
  P1-3 → slotLimit (cần confirm với backend)
  P1-4 → student.fullName cleanup
  P2-2 → "Xin vào nhóm" action cho suggested groups
  P2-5 → selectedAreaId localStorage sync
  P3-1, P3-2, P3-3, P3-4 → cleanup

Sau khi có scope xác nhận:
  P2-4 → Admin dashboard (feature lớn, cần planning riêng)
```

