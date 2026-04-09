# Tài liệu mô tả kiến trúc hệ thống  
## Hệ thống quản lý nghiên cứu khoa học sinh viên  
### Phiên bản định hướng cho coding agent

---

## 1. Mục đích tài liệu
Tài liệu này mô tả **kiến trúc hệ thống ở mức đủ chi tiết để triển khai code đúng hướng**, đồng thời vẫn giữ cách trình bày phù hợp với báo cáo thiết kế phần mềm.

Mục tiêu của tài liệu:
- Chuẩn hóa cách hiểu hệ thống trước khi code.
- Xác định rõ các tầng kiến trúc, module, trách nhiệm và cách chúng tương tác.
- Đảm bảo coding agent triển khai đúng nghiệp vụ cốt lõi đã chọn.
- Làm nền cho thiết kế database, API, frontend và phân chia công việc.

Tài liệu này **không cố gắng mô tả toàn bộ tất cả chức năng của hệ thống trong báo cáo gốc**, mà tập trung vào **kiến trúc triển khai cho luồng nghiệp vụ trọng tâm**:

**Đăng ký mảng nghiên cứu → tạo/ghép nhóm → giảng viên chọn nhóm hướng dẫn → nhóm chọn hoặc đề xuất đề tài → giảng viên duyệt → chốt đề tài**

---

## 2. Căn cứ kiến trúc
Báo cáo gốc xác định hệ thống:
- là ứng dụng web,
- có các vai trò chính: sinh viên, giảng viên, cán bộ quản lý, quản trị,
- phục vụ quản lý nghiên cứu khoa học sinh viên,
- cần đảm bảo các yêu cầu về bảo mật, độ tin cậy, hiệu năng, khả năng bảo trì và tính hữu dụng.

Vì vậy kiến trúc được chọn phải đáp ứng các mục tiêu sau:
- rõ ràng, dễ mở rộng,
- ít phụ thuộc chéo giữa các module,
- dễ bảo trì và dễ truy vết nghiệp vụ,
- hỗ trợ kiểm soát dữ liệu nhất quán,
- phù hợp với ứng dụng web nhiều vai trò dùng chung một backend.

---

## 3. Định hướng kiến trúc tổng thể

### 3.1. Kiểu kiến trúc
Hệ thống được thiết kế theo hướng:

- **Client–Server**
- **Frontend tách riêng Backend**
- **Backend phân lớp theo module nghiệp vụ**
- **Database quan hệ tập trung**
- **API-first**
- **State-driven workflow**

### 3.2. Lý do chọn
Cách tổ chức này phù hợp với:
- mô hình ứng dụng web đa vai trò,
- nghiệp vụ có nhiều trạng thái,
- yêu cầu mở rộng về sau sang đề cương, tiến độ, bảo vệ và chấm điểm,
- tiêu chí bảo trì tốt trong báo cáo học phần.

---

## 4. Phạm vi kiến trúc được mô tả

### 4.1. Trong phạm vi
- kiến trúc frontend
- kiến trúc backend
- phân rã module
- mô hình dữ liệu chính
- nguyên tắc API
- quản lý trạng thái nghiệp vụ
- notification
- audit log
- nguyên tắc transaction
- ràng buộc thiết kế cho coding agent

### 4.2. Ngoài phạm vi
- kiến trúc hạ tầng production chi tiết
- CI/CD
- monitoring nâng cao
- tối ưu scale lớn
- hệ thống email thực tế
- caching phân tán
- kiến trúc microservices

---

## 5. Sơ đồ kiến trúc logic tổng quan

```text
[Frontend Web]
    |
    | HTTPS / JSON API
    v
[Backend API Server]
    |
    +--> [Auth & Access Control]
    +--> [Module Dang Ky Mang Nghien Cuu]
    +--> [Module Nhom Nghien Cuu]
    +--> [Module Ghep Nhom]
    +--> [Module Phan Cong Giang Vien]
    +--> [Module De Tai De Xuat]
    +--> [Module Nop De Tai]
    +--> [Module Duyet De Tai]
    +--> [Module Trang Thai Quy Trinh]
    +--> [Module Thong Bao]
    +--> [Module Nhat Ky Kiem Toan]
    |
    v
[Relational Database]
```

---

## 6. Các nguyên tắc kiến trúc bắt buộc

### 6.1. Phân tách rõ frontend và backend
- Frontend chỉ xử lý giao diện, điều hướng, hiển thị dữ liệu, validate cơ bản phía client.
- Backend chịu trách nhiệm toàn bộ business rule, kiểm tra trạng thái, phân quyền nghiệp vụ, transaction và lưu trữ dữ liệu.

### 6.2. Business rule chỉ nằm ở backend
Các rule như:
- một sinh viên chỉ đăng ký một mảng,
- nhóm tối đa 3 người,
- chỉ sinh viên cùng mảng mới vào cùng nhóm,
- giảng viên có quota,
- đề tài phải qua duyệt,
- hết hạn thì không được sửa,

phải được backend kiểm tra. Frontend chỉ hỗ trợ UX, không được coi là nơi bảo vệ rule.

### 6.3. Thiết kế theo module nghiệp vụ
Không gom mọi xử lý vào một service lớn. Mỗi nghiệp vụ chính phải có module riêng, tránh phụ thuộc chéo và tránh “god service”.

### 6.4. Quản lý theo trạng thái
Luồng nghiệp vụ cốt lõi có nhiều bước. Vì vậy phải quản lý bằng trạng thái rõ ràng cho:
- sinh viên,
- nhóm,
- đề tài,
- lời mời,
- review.

### 6.5. Có audit log cho thao tác quan trọng
Các thao tác như:
- chọn mảng,
- tạo nhóm,
- chấp nhận lời mời,
- nhận hướng dẫn,
- gửi đề tài,
- duyệt / từ chối / yêu cầu chỉnh sửa,
- chốt đề tài

đều phải có audit log.

### 6.6. Dùng transaction cho thao tác thay đổi trạng thái quan trọng
Nhằm đảm bảo tính toàn vẹn dữ liệu.

---

## 7. Kiến trúc frontend

## 7.1. Mục tiêu frontend
Frontend phải:
- dễ hiểu với sinh viên và giảng viên,
- bám theo từng bước nghiệp vụ,
- hiển thị rõ trạng thái hiện tại,
- giảm thao tác thừa,
- dễ mở rộng về sau.

## 7.2. Cấu trúc frontend đề xuất
Frontend nên tổ chức theo **feature-based structure** thay vì theo kiểu chia thư mục chung chung theo component.

### Cấu trúc đề xuất
```text
src/
  app/
  core/
    api/
    auth/
    router/
    layouts/
    constants/
    utils/
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
    ui/
    hooks/
    types/
    schemas/
```

## 7.3. Vai trò của từng vùng

### `core/`
Chứa các thành phần dùng toàn hệ thống:
- API client
- route guard
- layout chung
- helper
- config

### `features/`
Mỗi nghiệp vụ lớn là một feature độc lập, có:
- pages
- components
- hooks
- services
- types
- validation schema

### `shared/`
Các thành phần tái sử dụng:
- button
- modal
- badge
- table
- form field
- stepper
- toast
- confirm dialog

## 7.4. Nguyên tắc frontend
- Component phải nhỏ, có trách nhiệm rõ.
- Tách page component và presentational component.
- Form lớn phải có schema validate.
- Không viết business rule phức tạp trực tiếp trong UI component.
- Mọi thao tác thay đổi trạng thái phải đi qua API layer.

---

## 8. Kiến trúc backend

## 8.1. Mục tiêu backend
Backend phải:
- kiểm soát chuẩn business rule,
- dễ mở rộng module mới,
- dễ test,
- dễ mapping từ use case sang code,
- tránh phụ thuộc chéo giữa controller, service và repository.

## 8.2. Kiểu tổ chức backend
Backend nên dùng kiến trúc phân lớp theo module:

```text
src/
  modules/
    xac-thuc/
    nguoi-dung/
    dang-ky-mang-nghien-cuu/
    nhom-nghien-cuu/
    ghep-nhom/
    phan-cong-giang-vien/
    de-tai-de-xuat/
    nop-de-tai/
    duyet-de-tai/
    trang-thai-quy-trinh/
    thong-bao/
    nhat-ky-kiem-toan/
  common/
    base/
    exceptions/
    guards/
    interceptors/
    decorators/
    constants/
    utils/
  infrastructure/
    database/
    messaging/
    config/
```

## 8.3. Cấu trúc bên trong mỗi module
Ví dụ:

```text
nhom-nghien-cuu/
  controllers/
  services/
  repositories/
  entities/
  dto/
  policies/
  validators/
  mappers/
```

### Ý nghĩa
- **controllers**: nhận request, gọi service, trả response
- **services**: xử lý use case nghiệp vụ
- **repositories**: truy vấn dữ liệu
- **entities**: mô hình dữ liệu
- **dto**: input/output contract
- **policies**: rule phân quyền nghiệp vụ
- **validators**: validate phức tạp
- **mappers**: chuyển đổi entity ↔ dto

## 8.4. Nguyên tắc backend
- Controller mỏng.
- Service điều phối use case.
- Repository không chứa logic nghiệp vụ.
- Không query database trực tiếp trong controller.
- Không để nhiều module gọi chéo lẫn nhau hỗn loạn. Nên gọi qua service public hoặc application service.
- Các thao tác thay đổi trạng thái phải có guard logic rõ ràng.

---

## 9. Phân rã module nghiệp vụ chính

# 9.1. Module xác thực
### Trách nhiệm
- xác thực người dùng
- gắn thông tin người dùng vào request
- kiểm tra role cơ bản

### Ghi chú
Module này là nền tảng, không phải trọng tâm nghiệp vụ, nhưng coding agent phải dựng đủ để các module khác dùng được.

---

# 9.2. Module đăng ký mảng nghiên cứu
### Trách nhiệm
- quản lý danh sách mảng nghiên cứu
- quản lý đợt đăng ký mảng
- cho sinh viên đăng ký mảng
- kiểm tra hạn đăng ký

### Không làm
- không quản lý đề tài ở đây
- không xử lý nhóm ở đây

---

# 9.3. Module nhóm nghiên cứu
### Trách nhiệm
- tạo nhóm
- thêm / xóa / cập nhật thành viên
- quản lý vai trò trưởng nhóm
- quản lý trạng thái nhóm
- khóa / mở nhóm theo thời gian

### Rule chính
- tối đa 3 thành viên
- một sinh viên chỉ thuộc một nhóm
- chỉ cùng mảng mới vào cùng nhóm

---

# 9.4. Module ghép nhóm
### Trách nhiệm
- tìm sinh viên chưa có nhóm
- tìm nhóm còn thiếu thành viên
- trả danh sách gợi ý ghép nhóm
- quản lý lời mời tham gia nhóm

### Ghi chú
Module này chỉ **gợi ý**, không tự động ép ghép.

---

# 9.5. Module phân công giảng viên
### Trách nhiệm
- cho giảng viên xem nhóm ứng viên
- cho giảng viên nhận hướng dẫn
- kiểm tra quota
- kiểm tra chuyên môn

### Ghi chú
Ở luồng này, giảng viên chủ động chọn nhóm, không phải sinh viên chọn giảng viên trước.

---

# 9.6. Module đề tài đề xuất
### Trách nhiệm
- cho giảng viên tạo các đề tài đề xuất
- quản lý danh sách đề tài đề xuất theo nhóm hoặc theo mảng
- cho nhóm xem danh sách đề tài được gợi ý

---

# 9.7. Module nộp đề tài
### Trách nhiệm
- cho nhóm chọn đề tài do giảng viên đề xuất
- cho nhóm tự đề xuất đề tài riêng
- lưu nội dung đề tài
- lưu version của đề tài

### Ghi chú
Đề tài của nhóm phải được quản lý như một thực thể riêng, không chỉ là text gắn thẳng vào group.

---

# 9.8. Module duyệt đề tài
### Trách nhiệm
- cho giảng viên duyệt đề tài
- yêu cầu chỉnh sửa
- từ chối đề tài
- lưu nhận xét duyệt
- lưu lịch sử review

---

# 9.9. Module trạng thái quy trình
### Trách nhiệm
- tính toán và trả trạng thái tiến trình
- cung cấp timeline trạng thái cho frontend
- chuẩn hóa state transition

### Ghi chú
Đây là module rất quan trọng để frontend có thể hiển thị stepper / tiến trình một cách nhất quán.

---

# 9.10. Module thông báo
### Trách nhiệm
- tạo thông báo nội bộ
- trả danh sách thông báo cho người dùng
- đánh dấu đã đọc
- bắn sự kiện thông báo sau thao tác nghiệp vụ

---

# 9.11. Module nhật ký kiểm toán
### Trách nhiệm
- ghi nhật ký thao tác
- lưu trạng thái cũ / mới nếu cần
- phục vụ truy vết nghiệp vụ

---

## 10. Thiết kế lớp logic backend

## 10.1. API Layer
### Vai trò
- nhận request HTTP
- parse input
- validate syntax
- gọi application service
- trả response theo format thống nhất

### Không được làm
- không viết business rule phức tạp
- không trực tiếp query database

---

## 10.2. Application Service Layer
### Vai trò
- điều phối use case
- gọi domain service / repository / notification / audit
- mở transaction khi cần
- trả kết quả use case

### Ví dụ use case phù hợp
- registerResearchArea
- createResearchGroup
- inviteMemberToGroup
- acceptGroupInvitation
- assignLecturerToGroup
- submitTopic
- reviewTopic
- finalizeTopic

---

## 10.3. Domain Layer
### Vai trò
- chứa logic nghiệp vụ cốt lõi
- kiểm tra state transition
- kiểm tra ràng buộc domain

### Ví dụ
- group.canAddMember()
- group.canBeAssignedLecturer()
- topicSubmission.canBeEdited()
- topicSubmission.review()

---

## 10.4. Repository Layer
### Vai trò
- lưu / đọc dữ liệu
- cung cấp method query rõ nghĩa

### Ví dụ method
- findOpenAreaRegistrationPeriod()
- findGroupWithMembersById()
- existsStudentInActiveGroup()
- countAssignedGroupsByLecturer()
- findPendingTopicSubmissionsByLecturer()

---

## 11. Mô hình dữ liệu logic

## 11.1. Thực thể chính
- User
- Student
- Lecturer
- ResearchArea
- RegistrationPeriod
- StudentAreaRegistration
- ResearchGroup
- ResearchGroupMember
- GroupInvitation
- LecturerSpecialization
- LecturerGroupAssignment
- TopicProposal
- TopicSubmission
- TopicSubmissionVersion
- TopicReview
- Notification
- AuditLog

## 11.2. Quan hệ chính
- User 1-1 Student hoặc Lecturer
- Student n-1 ResearchAreaRegistration theo thời gian
- ResearchGroup 1-n ResearchGroupMember
- Lecturer 1-n LecturerGroupAssignment
- ResearchGroup 1-n TopicSubmissionVersion
- TopicSubmission 1-n TopicReview
- User 1-n Notification
- User 1-n AuditLog

---

## 12. Trạng thái hệ thống chuẩn hóa

## 12.1. Student workflow state
- `CHUA_DANG_KY_MANG`
- `DA_DANG_KY_MANG`
- `DA_CO_NHOM`
- `DA_CO_DE_TAI`

## 12.2. Group state
- `NHAP`
- `DANG_TUYEN_THANH_VIEN`
- `DA_DU_THANH_VIEN`
- `CHUA_CO_GIANG_VIEN`
- `DA_CO_GIANG_VIEN`
- `CHO_CHON_DE_TAI`
- `CHO_DUYET_DE_TAI`
- `CAN_CHINH_SUA_DE_TAI`
- `DA_DUYET_DE_TAI`
- `DA_CHOT_DE_TAI`

## 12.3. Topic submission state
- `NHAP`
- `CHO_GIANG_VIEN_DUYET`
- `CAN_CHINH_SUA`
- `DA_DUYET`
- `TU_CHOI`
- `DA_CHOT`

## 12.4. Invitation state
- `PENDING`
- `ACCEPTED`
- `REJECTED`
- `CANCELLED`

---

## 13. Quy tắc chuyển trạng thái

### 13.1. Nhóm
- `NHAP` → `DANG_TUYEN_THANH_VIEN`
- `DANG_TUYEN_THANH_VIEN` → `DA_DU_THANH_VIEN`
- `DANG_TUYEN_THANH_VIEN` hoặc `DA_DU_THANH_VIEN` → `DA_CO_GIANG_VIEN`
- `DA_CO_GIANG_VIEN` → `CHO_CHON_DE_TAI`
- `CHO_CHON_DE_TAI` → `CHO_DUYET_DE_TAI`
- `CHO_DUYET_DE_TAI` → `CAN_CHINH_SUA_DE_TAI` hoặc `DA_DUYET_DE_TAI`
- `DA_DUYET_DE_TAI` → `DA_CHOT_DE_TAI`

### 13.2. Đề tài
- `NHAP` → `CHO_GIANG_VIEN_DUYET`
- `CHO_GIANG_VIEN_DUYET` → `CAN_CHINH_SUA`
- `CHO_GIANG_VIEN_DUYET` → `DA_DUYET`
- `CHO_GIANG_VIEN_DUYET` → `TU_CHOI`
- `CAN_CHINH_SUA` → `CHO_GIANG_VIEN_DUYET`
- `DA_DUYET` → `DA_CHOT`

### Nguyên tắc
Mọi transition phải được backend kiểm tra, không tin trạng thái do frontend gửi lên.

---

## 14. Thiết kế API

## 14.1. Nguyên tắc API
- RESTful vừa đủ
- JSON request/response
- endpoint theo resource và action rõ nghĩa
- lỗi trả về nhất quán
- status code rõ ràng
- không nhồi toàn bộ nghiệp vụ vào một endpoint đa năng

## 14.2. Response format gợi ý
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Response lỗi
```json
{
  "success": false,
  "message": "Group is already full",
  "errors": [
    {
      "field": "groupId",
      "code": "GROUP_FULL"
    }
  ]
}
```

## 14.3. API chính

### Sinh viên
- `GET /research-areas/open`
- `POST /student-area-registrations`
- `GET /groups/my-group`
- `POST /groups`
- `POST /groups/{groupId}/invitations`
- `POST /group-invitations/{invitationId}/accept`
- `POST /group-invitations/{invitationId}/reject`
- `GET /group-matching/suggestions`
- `GET /topics/options`
- `POST /topic-selections/from-proposal`
- `POST /topic-submissions`
- `PUT /topic-submissions/{id}`
- `GET /workflow-status/me`

### Giảng viên
- `GET /lecturer/groups/candidates`
- `GET /lecturer/groups/{groupId}`
- `POST /lecturer/groups/{groupId}/assign`
- `POST /topic-proposals`
- `GET /lecturer/topic-submissions/pending`
- `POST /topic-submissions/{id}/approve`
- `POST /topic-submissions/{id}/request-changes`
- `POST /topic-submissions/{id}/reject`

### Dùng chung
- `GET /notifications`
- `PATCH /notifications/{id}/read`
- `GET /workflow-status/{groupId}`

---

## 15. Kiến trúc dữ liệu và transaction

## 15.1. Những thao tác bắt buộc transaction
- tạo nhóm
- chấp nhận lời mời vào nhóm
- gán giảng viên hướng dẫn
- nhóm gửi đề tài
- giảng viên duyệt đề tài
- nhóm chỉnh sửa đề tài
- chốt đề tài

## 15.2. Lý do
Nếu không có transaction, có thể xảy ra:
- một nhóm vượt quá 3 thành viên,
- một sinh viên vào 2 nhóm,
- một nhóm có 2 giảng viên,
- trạng thái đề tài và nhóm lệch nhau,
- version đề tài bị mất nhất quán.

---

## 16. Notification architecture

## 16.1. Nguyên tắc
Notification là module phụ trợ, không chứa rule nghiệp vụ.

## 16.2. Các sự kiện tạo thông báo
- đăng ký mảng thành công
- được mời vào nhóm
- lời mời được chấp nhận / từ chối
- giảng viên nhận nhóm hướng dẫn
- có đề tài do giảng viên đề xuất
- nhóm gửi đề tài chờ duyệt
- giảng viên yêu cầu chỉnh sửa
- giảng viên từ chối đề tài
- giảng viên duyệt đề tài
- đề tài được chốt

## 16.3. Cách dùng
Application service gọi notification service sau khi transaction thành công.

---

## 17. Audit log architecture

## 17.1. Mục tiêu
- truy vết thay đổi
- hỗ trợ kiểm tra lỗi nghiệp vụ
- minh bạch quá trình duyệt

## 17.2. Dữ liệu cần lưu
- actorId
- actorRole
- action
- entityType
- entityId
- oldState
- newState
- metadata
- createdAt

---

## 18. Chính sách phân quyền

## 18.1. Sinh viên
Được:
- chọn mảng
- tạo nhóm
- nhận / từ chối lời mời
- xem nhóm của mình
- chọn đề tài
- tự đề xuất đề tài
- sửa đề tài khi còn hạn và đúng trạng thái

Không được:
- nhận nhóm khác
- duyệt đề tài
- chỉnh nhóm khác

## 18.2. Giảng viên
Được:
- xem nhóm ứng viên
- nhận hướng dẫn nhóm
- tạo đề tài đề xuất
- xem đề tài nhóm mình hướng dẫn
- duyệt / yêu cầu sửa / từ chối đề tài

Không được:
- duyệt đề tài của nhóm không do mình hướng dẫn

## 18.3. Cán bộ quản lý
Trong phạm vi luồng cốt lõi này, cán bộ quản lý có thể được giữ ở mức đọc / cấu hình đợt đăng ký, nhưng coding agent không cần mở rộng nhiều nếu chưa cần.

---

## 19. Quy ước coding cho agent

## 19.1. Quy ước đặt tên
- Module: danh từ nghiệp vụ rõ nghĩa
- Service: `<ModuleName>Service`
- Repository: `<EntityName>Repository`
- DTO: `<Action><Entity>Dto`
- Enum trạng thái: `<Entity>Status`
- Controller endpoint theo resource

## 19.2. Không được làm
- Không hard-code trạng thái bằng string rải rác.
- Không viết query SQL trực tiếp trong controller.
- Không dùng một bảng duy nhất cho mọi log / thông báo / workflow mà không tách nghĩa.
- Không nhét toàn bộ logic vào frontend.
- Không để UI quyết định quyền được sửa hay duyệt.

## 19.3. Bắt buộc có
- enum trạng thái
- validator cho DTO
- policy cho quyền nghiệp vụ
- service cho state transition
- audit log cho thao tác quan trọng

---

## 20. Kiến trúc UI ở mức hệ thống

## 20.1. Các màn hình cốt lõi
1. Chọn mảng nghiên cứu  
2. Quản lý nhóm nghiên cứu  
3. Gợi ý ghép nhóm / lời mời  
4. Danh sách nhóm cho giảng viên  
5. Chi tiết nhóm  
6. Chọn đề tài / tự đề xuất đề tài  
7. Chỉnh sửa đề tài  
8. Giảng viên duyệt đề tài  
9. Trạng thái tiến trình  

## 20.2. Quan hệ giữa UI và API
- UI không lưu business state độc lập ngoài cache client ngắn hạn.
- UI luôn lấy trạng thái thật từ API.
- Sau mỗi thao tác thay đổi trạng thái, UI phải refetch hoặc đồng bộ lại dữ liệu từ server.

---

## 21. Kịch bản triển khai kỹ thuật đề xuất

## 21.1. Frontend
- React hoặc Next.js
- TypeScript
- state management mức vừa phải
- form validation bằng schema
- UI component có thể dùng thư viện nhưng phải nhất quán

## 21.2. Backend
- NestJS hoặc Node.js framework có module rõ ràng
- TypeScript
- ORM cho database quan hệ
- migration để quản lý schema

## 21.3. Database
- PostgreSQL
- migration-based schema management
- unique constraint và foreign key đầy đủ

---

## 22. Các ràng buộc database bắt buộc

- Một sinh viên không thể có hơn một nhóm active trong cùng đợt.
- Một nhóm không quá 3 thành viên.
- Một nhóm chỉ có một giảng viên hướng dẫn active.
- Một lời mời không được accept nhiều lần.
- Một đề tài đã chốt không được sửa.
- Một đề tài chỉ thuộc một nhóm.
- Một review phải gắn với một đề tài và một giảng viên hợp lệ.

---

## 23. Khả năng mở rộng kiến trúc
Kiến trúc này cho phép mở rộng tự nhiên sang:
- nộp đề cương
- duyệt đề cương
- báo cáo tiến độ
- nhắc hạn
- tổ chức bảo vệ
- chấm điểm
- báo cáo thống kê

Cách mở rộng là thêm module mới nhưng vẫn dùng:
- auth chung
- workflow chung
- notification chung
- audit log chung
- database quan hệ chung

---

## 24. Ưu điểm của kiến trúc đã chọn

### 24.1. Phụ thuộc thấp, nhất quán cao
Các module được tách theo nghiệp vụ nên dễ bảo trì.

### 24.2. Dễ truy vết
Audit log và state transition rõ ràng giúp kiểm tra lỗi dễ hơn.

### 24.3. Dễ mở rộng
Có thể thêm các giai đoạn khác của nghiên cứu mà không phá vỡ core flow.

### 24.4. Phù hợp báo cáo học phần
Kiến trúc này thể hiện được:
- phân lớp rõ,
- mô-đun hóa,
- tính bảo trì,
- kiểm soát nghiệp vụ,
- gắn được với use case và cơ sở dữ liệu.

---

## 25. Kết luận
Kiến trúc được đề xuất cho hệ thống quản lý nghiên cứu khoa học sinh viên là kiến trúc **web client–server, frontend và backend tách riêng, backend phân module nghiệp vụ, database quan hệ tập trung, điều khiển theo trạng thái nghiệp vụ**.

Đây là kiến trúc phù hợp để coding agent triển khai đúng, vì:
- rõ luồng,
- rõ module,
- rõ trách nhiệm,
- rõ trạng thái,
- dễ code,
- dễ test,
- dễ đối chiếu với báo cáo phân tích thiết kế.

Coding agent khi triển khai phải luôn tuân thủ 5 nguyên tắc:
1. Business rule ở backend  
2. State transition rõ ràng  
3. Module tách theo nghiệp vụ  
4. Có transaction cho thao tác quan trọng  
5. Có notification và audit log cho các thay đổi chính
