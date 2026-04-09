# AGENTS.md — Quy định cho Coding Agent

> Tài liệu này là **luật bắt buộc** cho mọi coding agent làm việc trên dự án này.
> Đọc kỹ và tuân thủ toàn bộ trước khi viết bất kỳ dòng code nào.

---

## 1. Tổng quan dự án

**Tên hệ thống:** Quản lý nghiên cứu khoa học sinh viên  
**Luồng nghiệp vụ trọng tâm:**  
Đăng ký mảng nghiên cứu → Tạo/ghép nhóm → Giảng viên chọn nhóm hướng dẫn → Nhóm chọn hoặc đề xuất đề tài → Giảng viên duyệt → Chốt đề tài

**Tech stack:**
| Tầng | Công nghệ |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js + TypeScript (Express hoặc framework module-based) |
| Database | PostgreSQL (Supabase Cloud) |
| ORM | Prisma |

**Tài liệu tham chiếu bắt buộc:**
- `kien_truc_he_thong_agent_coding.md` — kiến trúc tổng thể
- `phan_tich_thiet_ke_luong_backend_frontend.md` — phân tích & thiết kế luồng nghiệp vụ

---

## 2. Quy tắc tuyệt đối — KHÔNG được vi phạm

### 2.1. 🚫 KHÔNG sửa Database khi chưa được phép

> **⛔ ĐÂY LÀ QUY TẮC QUAN TRỌNG NHẤT.**

- **KHÔNG** tạo migration mới, thêm bảng, thêm cột, xóa cột, thay đổi kiểu dữ liệu, thêm index nếu chưa được chủ dự án xác nhận bằng văn bản rõ ràng.
- **KHÔNG** chạy `prisma migrate dev`, `prisma migrate deploy`, `prisma db push` hay bất kỳ lệnh nào thay đổi schema DB mà không có lệnh cho phép.
- **KHÔNG** chỉnh sửa file `schema.prisma` để thêm/xóa/đổi model, field, relation mà không hỏi trước.
- Nếu agent phát hiện cần thay đổi schema, phải **dừng lại**, mô tả rõ thay đổi cần thiết và **hỏi chủ dự án trước**.
- Chỉ được chạy `prisma generate` (tạo client) và `prisma db pull` (check schema hiện tại) nếu không thay đổi gì.

**Câu hỏi bắt buộc phải hỏi trước khi sửa DB:**
```
Tôi dự kiến thay đổi sau với database:
- [liệt kê thay đổi cụ thể]
Lý do: [giải thích rõ]
Bạn có xác nhận cho tôi tiến hành không?
```

---

### 2.2. 🚫 KHÔNG viết business rule ở frontend

- **KHÔNG** để frontend kiểm soát quyền truy cập, quyết định ai được làm gì.
- **KHÔNG** để frontend quyết định thay đổi trạng thái (ví dụ: tự chuyển state mà không gọi API).
- Frontend chỉ được **hiển thị kết quả** từ API và **hỗ trợ UX** (disable button, hiện thông báo lỗi từ server).

---

### 2.3. 🚫 KHÔNG query database trực tiếp trong controller

- Controller nhận request → gọi service → trả response.
- Service điều phối use case → gọi repository.
- Repository mới được phép dùng Prisma Client để truy vấn.

---

### 2.4. 🚫 KHÔNG hard-code trạng thái bằng string rải rác

Sai:
```typescript
if (group.status === 'active') { ... }
if (topic.status === 'pending_review') { ... }
```

Đúng:
```typescript
if (group.status === GroupStatus.DA_CO_GIANG_VIEN) { ... }
if (topic.status === TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET) { ... }
```

Mọi trạng thái phải được định nghĩa bằng **enum rõ ràng**.

---

### 2.5. 🚫 KHÔNG để nhiều module gọi chéo hỗn loạn

- Module A muốn dùng chức năng của Module B → gọi qua **service public** hoặc **application service**, không gọi repository của module khác.
- Tránh god service, tránh import chéo không có kiểm soát.

---

## 3. Quy tắc về code quality

### 3.1. Code phải clean và đơn giản

- Mỗi function/method chỉ làm **một việc rõ ràng**.
- Không viết function dài hơn 50 dòng mà không có lý do hết sức chính đáng.
- Ưu tiên đọc hiểu được, không ưu tiên ngắn.
- Đặt tên biến/function mô tả đúng ý nghĩa — không dùng `data`, `temp`, `item`, `x` không rõ nghĩa.
- Xóa code dead, comment thừa, console.log debug trước khi submit.

### 3.2. Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Module backend | danh từ nghiệp vụ | `research-group`, `topic-review` |
| Service | `<ModuleName>Service` | `ResearchGroupService` |
| Repository | `<EntityName>Repository` | `GroupInvitationRepository` |
| DTO | `<Action><Entity>Dto` | `CreateGroupDto`, `SubmitTopicDto` |
| Enum trạng thái | `<Entity>Status` | `GroupStatus`, `TopicSubmissionStatus` |
| React component | PascalCase | `GroupSummaryCard`, `TopicProposalList` |
| Hook | camelCase bắt đầu `use` | `useGroupStatus`, `useTopicSubmit` |
| API route | kebab-case theo resource | `/research-areas`, `/topic-submissions` |

### 3.3. Cấu trúc file

**Mỗi file phải:**
- Có một trách nhiệm duy nhất
- Import rõ ràng, không import wildcard từ module khác
- Export rõ ràng những gì cần export

**Không được:**
- Để nhiều class không liên quan trong cùng một file
- Mix business logic và presentation trong cùng một component
- Đặt magic number không có tên (`if (members.length >= 3)` → dùng constant `MAX_GROUP_MEMBERS = 3`)

---

## 4. Kiến trúc backend (Node.js + Prisma)

### 4.1. Cấu trúc thư mục backend

```
src/
  modules/
    auth/
    users/
    research-area/
    research-group/
    matching/
    lecturer-assignment/
    topic-proposal/
    topic-submission/
    topic-review/
    workflow/
    notification/
    audit-log/
  common/
    exceptions/
    guards/
    middlewares/
    decorators/
    constants/
    utils/
  infrastructure/
    database/         ← Prisma client singleton
    config/
```

### 4.2. Cấu trúc bên trong mỗi module

```
research-group/
  controllers/
    research-group.controller.ts
  services/
    research-group.service.ts
  repositories/
    research-group.repository.ts
  dto/
    create-group.dto.ts
    update-group.dto.ts
  policies/
    group.policy.ts
  validators/
    group.validator.ts
  types/
    group.types.ts
  index.ts             ← export public API của module
```

### 4.3. Phân lớp trách nhiệm backend

| Tầng | Trách nhiệm | KHÔNG được |
|---|---|---|
| **Controller** | Nhận request, validate input cơ bản, gọi service, trả response | Viết business logic, query DB |
| **Service** | Điều phối use case, kiểm tra business rule, gọi repository | Query DB trực tiếp, xử lý HTTP |
| **Repository** | Truy vấn Prisma, trả raw data | Chứa business logic, kiểm tra quyền |
| **Policy** | Định nghĩa rule phân quyền nghiệp vụ | |
| **DTO** | Định nghĩa input/output contract | |

### 4.4. Quy tắc Prisma

- **KHÔNG** scatter Prisma queries khắp nơi — tập trung vào `repositories/`.
- Dùng Prisma transaction (`$transaction`) cho các thao tác quan trọng (xem mục 7).
- Không expose Prisma model trực tiếp ra ngoài API — luôn map sang DTO/response type.
- Đặt tên method repository có nghĩa rõ:
  - `findGroupWithMembersById()`
  - `existsStudentInActiveGroup()`
  - `countAssignedGroupsByLecturer()`

### 4.5. Response format chuẩn

```typescript
// Thành công
{
  success: true,
  message: "Operation completed successfully",
  data: { ... }
}

// Lỗi
{
  success: false,
  message: "Group is already full",
  errors: [
    { field: "groupId", code: "GROUP_FULL" }
  ]
}
```

Sử dụng HTTP status code đúng: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`.

---

## 5. Kiến trúc frontend (React + TypeScript)

### 5.1. Cấu trúc thư mục frontend

```
src/
  app/                   ← App entry, routes
  core/
    api/                 ← Axios/fetch client, interceptors
    auth/                ← Auth context, token management
    router/              ← Route guards, protected routes
    layouts/             ← Layout chung
    constants/           ← Constants toàn hệ thống
    utils/               ← Helper functions
  features/
    research-area/
    research-group/
    group-matching/
    lecturer-group-selection/
    topic-selection/
    topic-review/
    workflow-status/
    notifications/
  shared/
    ui/                  ← Button, Modal, Badge, Table, Toast...
    hooks/               ← useDebounce, usePagination...
    types/               ← Shared TypeScript types
    schemas/             ← Zod/Yup validation schemas
```

### 5.2. Cấu trúc bên trong mỗi feature

```
features/research-group/
  pages/
    ResearchGroupPage.tsx
  components/
    GroupSummaryCard.tsx
    MemberList.tsx
    InviteMemberDialog.tsx
  hooks/
    useMyGroup.ts
    useGroupInvitation.ts
  services/
    research-group.service.ts    ← gọi API
  schemas/
    group.schema.ts              ← Zod validation
  types/
    group.types.ts
  index.ts
```

### 5.3. Nguyên tắc frontend

- **Page component** chỉ compose layout và feature component — không xử lý logic phức tạp.
- **Logic gọi API** nằm trong `services/` hoặc `hooks/`.
- **Form lớn** phải có validation schema (Zod/Yup) — không viết validate thủ công.
- **Trạng thái nghiệp vụ** luôn lấy từ API, không tự tính ở client.
- Sau mỗi action thành công, phải **invalidate / refetch** data từ server.
- **Không** dùng `any` trong TypeScript.

### 5.4. Quy tắc component

- Component nhỏ, có trách nhiệm rõ ràng.
- Prop types định nghĩa đầy đủ với TypeScript interface.
- Tách `presentational component` (hiển thị) và `container component` (logic).
- Không viết inline style phức tạp — dùng CSS module hoặc styled component nhất quán.

---

## 6. Enum trạng thái bắt buộc

Phải định nghĩa enum cho tất cả trạng thái. Không được hard-code string.

### Backend (`common/constants/status.enum.ts`)

```typescript
export enum StudentWorkflowStatus {
  CHUA_DANG_KY_MANG = 'CHUA_DANG_KY_MANG',
  DA_DANG_KY_MANG   = 'DA_DANG_KY_MANG',
  CHUA_CO_NHOM      = 'CHUA_CO_NHOM',
  DA_CO_NHOM        = 'DA_CO_NHOM',
  DA_CO_DE_TAI      = 'DA_CO_DE_TAI',
}

export enum GroupStatus {
  NHAP                   = 'NHAP',
  DANG_TUYEN_THANH_VIEN  = 'DANG_TUYEN_THANH_VIEN',
  DA_DU_THANH_VIEN       = 'DA_DU_THANH_VIEN',
  CHUA_CO_GIANG_VIEN     = 'CHUA_CO_GIANG_VIEN',
  DA_CO_GIANG_VIEN       = 'DA_CO_GIANG_VIEN',
  DANG_CHON_DE_TAI       = 'DANG_CHON_DE_TAI',
  CHO_DUYET_DE_TAI       = 'CHO_DUYET_DE_TAI',
  CAN_CHINH_SUA_DE_TAI   = 'CAN_CHINH_SUA_DE_TAI',
  DA_DUYET_DE_TAI        = 'DA_DUYET_DE_TAI',
  DA_CHOT_DE_TAI         = 'DA_CHOT_DE_TAI',
}

export enum TopicSubmissionStatus {
  NHAP                 = 'NHAP',
  CHO_GIANG_VIEN_DUYET = 'CHO_GIANG_VIEN_DUYET',
  CAN_CHINH_SUA        = 'CAN_CHINH_SUA',
  DA_DUYET             = 'DA_DUYET',
  TU_CHOI              = 'TU_CHOI',
  DA_CHOT              = 'DA_CHOT',
}

export enum InvitationStatus {
  PENDING   = 'PENDING',
  ACCEPTED  = 'ACCEPTED',
  REJECTED  = 'REJECTED',
  CANCELLED = 'CANCELLED',
}
```

### Frontend phải mirror enum này

```typescript
// src/shared/types/status.types.ts
export type GroupStatus = 
  | 'NHAP'
  | 'DANG_TUYEN_THANH_VIEN'
  | 'DA_DU_THANH_VIEN'
  // ...
```

---

## 7. Các thao tác bắt buộc dùng Transaction (Prisma `$transaction`)

| Thao tác | Lý do |
|---|---|
| Tạo nhóm + thêm trưởng nhóm | Tránh nhóm không có leader |
| Chấp nhận lời mời vào nhóm | Race condition: nhiều sinh viên chấp nhận cùng lúc |
| Giảng viên nhận hướng dẫn nhóm | Tránh vượt quota, tránh nhóm 2 giảng viên |
| Nhóm gửi đề tài | Cập nhật trạng thái nhóm + tạo submission |
| Giảng viên duyệt đề tài | Cập nhật topic + group state đồng bộ |
| Nhóm chỉnh sửa đề tài | Tạo version mới + cập nhật submission |
| Chốt đề tài | Cập nhật topic + group + student state |

---

## 8. Audit Log — bắt buộc cho thao tác quan trọng

Sau mỗi thao tác quan trọng, **phải ghi audit log** với cấu trúc:

```typescript
{
  actorId:    string,   // ID người thực hiện
  actorRole:  string,   // 'STUDENT' | 'LECTURER' | 'ADMIN'
  action:     string,   // Tên hành động: 'ACCEPT_INVITATION', 'APPROVE_TOPIC'...
  entityType: string,   // 'ResearchGroup' | 'TopicSubmission'...
  entityId:   string,   // ID entity bị thay đổi
  oldState:   object,   // Trạng thái trước
  newState:   object,   // Trạng thái sau
  metadata:   object,   // Thông tin bổ sung tùy ngữ cảnh
  createdAt:  Date,
}
```

**Các hành động bắt buộc phải audit log:**
- Chọn mảng nghiên cứu
- Tạo nhóm
- Chấp nhận / từ chối lời mời
- Giảng viên nhận nhóm hướng dẫn
- Gửi đề tài
- Giảng viên duyệt / yêu cầu chỉnh sửa / từ chối đề tài
- Chỉnh sửa đề tài
- Chốt đề tài

---

## 9. Notification — khi nào phải gửi

Notification được gửi **sau khi transaction thành công**, không gửi trong giữa transaction.

| Sự kiện | Người nhận |
|---|---|
| Đăng ký mảng thành công | Sinh viên |
| Được mời vào nhóm | Sinh viên được mời |
| Lời mời được chấp nhận | Trưởng nhóm |
| Lời mời bị từ chối | Trưởng nhóm |
| Giảng viên nhận hướng dẫn nhóm | Tất cả thành viên nhóm |
| Có đề tài giảng viên đề xuất | Nhóm |
| Nhóm gửi đề tài chờ duyệt | Giảng viên |
| Giảng viên yêu cầu chỉnh sửa | Nhóm |
| Giảng viên từ chối đề tài | Nhóm |
| Giảng viên duyệt đề tài | Nhóm |
| Đề tài được chốt | Nhóm + giảng viên |

---

## 10. Business Rules — backend phải kiểm tra

### Mảng nghiên cứu
- Một sinh viên chỉ đăng ký **một mảng** trong một đợt.
- Chỉ được đăng ký khi đợt đăng ký còn hiệu lực.

### Nhóm
- Nhóm tối đa **3 thành viên**.
- Một sinh viên chỉ thuộc **một nhóm** tại một thời điểm trong đợt.
- Chỉ sinh viên **cùng mảng** mới được vào cùng nhóm.
-  Chỉ được sửa nhóm khi đợt đăng ký nhóm còn mở.

### Giảng viên
- Giảng viên có **giới hạn quota** nhóm hướng dẫn — phải kiểm tra trước khi gán.
- Một nhóm chỉ có **một giảng viên hướng dẫn**.
- Giảng viên chỉ được chọn nhóm **phù hợp chuyên môn**.

### Đề tài
- Nhóm chỉ được chọn/đề xuất đề tài sau khi **đã có giảng viên hướng dẫn**.
- Đề tài tự đề xuất phải **qua giảng viên duyệt**.
- Hết thời gian chỉnh sửa → **không được sửa nữa**.
- Đề tài đã chốt → **không được sửa, không được duyệt lại**.
- `REQUEST_CHANGES` và `REJECT` **bắt buộc có nhận xét**.

### State transition — backend phải enforce

```
Nhóm:
NHAP → DANG_TUYEN_THANH_VIEN
DANG_TUYEN_THANH_VIEN → DA_DU_THANH_VIEN
(DANG_TUYEN | DA_DU) → DA_CO_GIANG_VIEN
DA_CO_GIANG_VIEN → DANG_CHON_DE_TAI
DANG_CHON_DE_TAI → CHO_DUYET_DE_TAI
CHO_DUYET_DE_TAI → CAN_CHINH_SUA_DE_TAI | DA_DUYET_DE_TAI
DA_DUYET_DE_TAI → DA_CHOT_DE_TAI

Đề tài:
NHAP → CHO_GIANG_VIEN_DUYET
CHO_GIANG_VIEN_DUYET → CAN_CHINH_SUA | DA_DUYET | TU_CHOI
CAN_CHINH_SUA → CHO_GIANG_VIEN_DUYET
DA_DUYET → DA_CHOT
```

**KHÔNG** tin trạng thái do frontend gửi lên. Backend tự tính toán transition hợp lệ.

---

## 11. API Design

### Nguyên tắc
- RESTful, JSON request/response.
- Endpoint theo resource + action có nghĩa.
- Không nhồi toàn bộ nghiệp vụ vào một endpoint đa năng.
- Status code đúng chuẩn HTTP.

### API chính — Sinh viên
```
GET    /research-areas/open
POST   /student-area-registrations
GET    /my-group
POST   /groups
POST   /groups/:groupId/invite
POST   /group-invitations/:id/accept
POST   /group-invitations/:id/reject
GET    /group-matching/suggestions
GET    /my-topic-options
POST   /topic-selections/from-lecturer-proposal
POST   /topic-submissions
PUT    /topic-submissions/:id
GET    /workflow-status/me
```

### API chính — Giảng viên
```
GET    /lecturer/groups/candidates
GET    /lecturer/groups/:groupId
POST   /lecturer/groups/:groupId/assign
POST   /lecturer/topic-proposals
GET    /lecturer/topic-submissions/pending
POST   /lecturer/topic-submissions/:id/approve
POST   /lecturer/topic-submissions/:id/request-changes
POST   /lecturer/topic-submissions/:id/reject
```

### API dùng chung
```
GET    /notifications
PATCH  /notifications/:id/read
GET    /workflow-status/:groupId
GET    /audit-logs/:entityType/:entityId
```

---

## 12. Database constraints bắt buộc (Prisma schema)

Những ràng buộc sau **PHẢI** được đảm bảo ở tầng DB (unique constraint, check constraint):

- Một sinh viên không có hơn một nhóm active trong cùng đợt.
- Một nhóm không quá 3 thành viên.
- Một nhóm chỉ có một giảng viên hướng dẫn active.
- Một lời mời không được accept nhiều lần.
- Một đề tài đã chốt không được sửa.
- Một đề tài chỉ thuộc một nhóm.

---

## 13. Quy tắc hỏi trước khi làm

Agent **PHẢI dừng lại và hỏi** chủ dự án trong các tình huống sau:

| Tình huống | Lý do |
|---|---|
| Cần thêm/xóa/sửa bảng hoặc cột trong DB | Nguy cơ mất dữ liệu, breaking change |
| Cần thêm dependency mới không có trong package.json | Ảnh hưởng bundle, bảo mật |
| Cần refactor kiến trúc tầng (đổi cấu trúc thư mục lớn) | Ảnh hưởng nhiều module |
| Chức năng không có trong tài liệu thiết kế | Có thể ngoài phạm vi |
| Phát hiện mâu thuẫn giữa 2 tài liệu thiết kế | Cần xác nhận intention |
| Cần tạo seed data hay chạy query trực tiếp lên Supabase | Nguy cơ ảnh hưởng production |

**Cách hỏi chuẩn:**
```
📌 CẦN XÁC NHẬN TRƯỚC KHI TIẾN HÀNH

Tôi cần [mô tả việc cần làm].
Lý do: [giải thích rõ tại sao cần làm].
Ảnh hưởng: [những gì có thể bị tác động].

Bạn có xác nhận không?
```

---

## 14. Những điều KHÔNG được làm — checklist

```
[ ] KHÔNG sửa DB khi chưa được phép
[ ] KHÔNG chạy migrate khi chưa được phép
[ ] KHÔNG viết business rule ở frontend
[ ] KHÔNG query DB trực tiếp trong controller
[ ] KHÔNG hard-code string trạng thái
[ ] KHÔNG để module gọi chéo repository của nhau
[ ] KHÔNG tin trạng thái do frontend gửi lên để transition
[ ] KHÔNG để thao tác quan trọng chạy không có transaction
[ ] KHÔNG để thao tác quan trọng chạy không có audit log
[ ] KHÔNG expose Prisma model raw ra API
[ ] KHÔNG bỏ qua validate DTO phía backend
[ ] KHÔNG dùng `any` trong TypeScript
[ ] KHÔNG để code có console.log debug khi submit
[ ] KHÔNG tạo dependency vòng tròn giữa các module
[ ] KHÔNG tạo god service chứa toàn bộ logic
```

---

## 15. Quy trình làm việc của agent

```
1. Đọc yêu cầu
      ↓
2. Đọc tài liệu kiến trúc liên quan
      ↓
3. Xác định module nào bị ảnh hưởng
      ↓
4. Kiểm tra xem có cần thay đổi DB không
      ├── Có → HỎI TRƯỚC, đợi cho phép
      └── Không → tiếp tục
      ↓
5. Viết code theo đúng phân lớp
      ↓
6. Đảm bảo có transaction, audit log, notification (nếu cần)
      ↓
7. Viết DTO, enum, validator đầy đủ
      ↓
8. Code sạch: không debug log, không magic string, không any
      ↓
9. Báo cáo lại những gì đã làm và những điểm còn mở
```

---

## 16. Tài liệu tham chiếu

| Tài liệu | Mục đích |
|---|---|
| `kien_truc_he_thong_agent_coding.md` | Kiến trúc tổng thể, module, nguyên tắc, state machine |
| `phan_tich_thiet_ke_luong_backend_frontend.md` | Use case chi tiết, luồng frontend/backend, business rules |

> Khi có bất kỳ mâu thuẫn nào, ưu tiên hỏi chủ dự án hơn là tự suy luận.

---

*AGENTS.md — Version 1.0 | Dự án NCKH-KTPM*
