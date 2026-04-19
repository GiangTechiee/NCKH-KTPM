# Ưu tiên công việc cần làm

Tài liệu này tổng hợp **thứ tự ưu tiên triển khai thực tế** cho dự án **Quản lý nghiên cứu khoa học sinh viên**, bám theo:

- `AGENTS.md`
- `kien_truc_he_thong_lap_trinh.md`
- `phan_tich_thiet_ke_luong_ung_dung.md`

Mục tiêu là tập trung vào **luồng nghiệp vụ cốt lõi**:

`Đăng ký mảng nghiên cứu -> Tạo/ghép nhóm -> Giảng viên chọn nhóm hướng dẫn -> Nhóm chọn/đề xuất đề tài -> Giảng viên duyệt -> Chốt đề tài`

---

## 0. Quy ước trạng thái để cập nhật tiến độ

Sử dụng các ký hiệu sau để cập nhật trực tiếp trên file này:

- `[ ]` Chưa làm
- `[~]` Đang làm
- `[x]` Hoàn thành
- `[!]` Bị chặn / cần xác nhận trước

> Mỗi khi bắt đầu làm một việc, đổi trạng thái từ `[ ]` sang `[~]`.
> Khi xong hẳn, đổi sang `[x]`.
> Nếu bị chặn vì schema, dependency, kiến trúc hoặc cần hỏi chủ dự án thì đổi sang `[!]`.

---

## 1. Kết luận nhanh

Thứ tự nên làm là:

1. **Xác nhận blocker liên quan DB/schema trước**.
2. **Dựng backend foundation** theo đúng kiến trúc module.
3. **Code API cho luồng nghiệp vụ cốt lõi**, đi từ sinh viên đến giảng viên rồi tới đề tài.
4. **Gắn business rule + transaction ngay trong lúc làm API**, không để dồn về sau.
5. **Bổ sung audit log + notification** vào các luồng chính sau khi các API lõi chạy ổn.
6. **Làm workflow status** sau khi các luồng chính đã hình thành.
7. **Dựng frontend theo feature-based structure** sau khi backend đã có API đủ ổn định.
8. Sau khi luồng chính chạy được mới làm tiếp auth hoàn chỉnh, test mở rộng, dashboard, báo cáo và các phần ngoài phạm vi lõi.

### Kết luận quan trọng

- **Backend phải làm trước frontend**.
- **Không nên làm frontend song song từ đầu** khi backend chưa có API thật.
- **Business rule và transaction không phải giai đoạn riêng ở cuối**, mà phải đi cùng từng API nghiệp vụ ngay từ đầu.
- **Audit log và notification không nên để quá muộn**; cần thiết kế từ sớm để gắn dần vào các use case quan trọng.

---

## 2. Hiện trạng dự án

### Backend

- Hiện mới có server Express rất cơ bản.
- Các module nghiệp vụ đã có thư mục nhưng gần như chưa có controller/service/repository hoàn chỉnh.
- Chưa có đầy đủ nền `common/`, middleware, error handling, response format.
- Chưa có flow API thực cho nghiệp vụ chính.

### Frontend

- Cấu trúc feature đã được gợi mở nhưng phần lớn còn trống.
- Mới có phần demo đơn giản cho `workflow-status`, chưa phải flow nghiệp vụ thật.
- API client còn rất cơ bản, chưa đủ để hỗ trợ đầy đủ các action nghiệp vụ.

### Database

- Đã có schema Prisma và SQL khởi tạo.
- Có dấu hiệu **chưa đồng nhất hoàn toàn** giữa trạng thái trong tài liệu và trạng thái trong schema hiện tại.
- Theo `AGENTS.md`, **không được tự ý sửa DB/schema/migration nếu chưa có xác nhận**.

---

## 3. Blocker phải xử lý trước khi đào sâu business module

## [!] Ưu tiên 0: Xác nhận các điểm chặn liên quan DB và kiến trúc

Đây là phần **phải kiểm tra hoặc hỏi trước**, nếu không rất dễ làm xong rồi phải sửa lại.

### [!] Việc cần xác nhận

- [x] Trạng thái trong schema/migration hiện tại đang dùng nhiều giá trị tiếng Anh như:
  - `FORMING`
  - `FULL`
  - `DRAFT`
  - `PENDING_APPROVAL`
- [x] Trong khi tài liệu nghiệp vụ và enum trong code đang dùng trạng thái tiếng Việt như:
  - `NHAP`
  - `DANG_TUYEN_THANH_VIEN`
  - `CHO_GIANG_VIEN_DUYET`
  - `DA_DUYET`
- [x] Cần xác nhận có bổ sung các bảng còn thiếu như:
  - `GroupInvitation`
  - `AuditLog`
  - `Notification`
- [x] Cần xác nhận có chuyển backend/frontend sang TypeScript hay tiếp tục giữ JavaScript trong giai đoạn đầu.

### Vì sao đây là blocker

- Nếu enum trong code không khớp giá trị mà DB chấp nhận, logic ghi trạng thái sẽ sai hoặc hỏng.
- Nếu chưa có bảng lời mời nhóm, audit log, notification thì nhiều API lõi sẽ không thể hoàn thiện đúng thiết kế.
- Nếu quyết định chuyển TypeScript thì nên làm sớm, tránh viết thêm nhiều JS rồi phải đổi lại.

### Mẫu câu hỏi nên dùng

```text
📌 CẦN XÁC NHẬN TRƯỚC KHI TIẾN HÀNH

Tôi dự kiến thay đổi sau với database / kiến trúc:
- [liệt kê thay đổi cụ thể]
Lý do: [giải thích rõ]
Ảnh hưởng: [nêu phần có thể bị tác động]

Bạn có xác nhận cho tôi tiến hành không?
```

---

## 4. Công việc ưu tiên cao nhất

## [x] Ưu tiên 1: Hoàn thiện nền tảng backend

Đây là phần cần làm đầu tiên vì toàn bộ business rule phải nằm ở backend.

### [x] Việc cần làm

- [x] Chuẩn hóa cấu trúc backend theo module:
  - `xac-thuc`
  - `nguoi-dung`
  - `dang-ky-mang-nghien-cuu`
  - `nhom-nghien-cuu`
  - `ghep-nhom`
  - `phan-cong-giang-vien`
  - `de-tai-de-xuat`
  - `nop-de-tai`
  - `duyet-de-tai`
  - `trang-thai-quy-trinh`
  - `thong-bao`
  - `nhat-ky-kiem-toan`
- [x] Tạo `common` cho exception, middleware, utils, constants.
- [x] Tạo Prisma client singleton trong `infrastructure/database`.
- [x] Chuẩn hóa response format thành:
  - `success`
  - `message`
  - `data`
  - `errors`
- [x] Tạo error handling thống nhất.
- [x] Tạo constants/enums tập trung để tránh hard-code string.
- [x] Nếu được xác nhận, chuyển backend sang TypeScript ngay từ đầu.

### [x] Kết quả mong muốn

- [x] Backend có khung chuẩn để phát triển tiếp.
- [x] Không còn viết API kiểu dồn toàn bộ logic vào một file.
- [x] Có nền rõ ràng cho controller -> service -> repository.

---

## [~] Ưu tiên 2: Code API cho luồng sinh viên trước

Sau khi có nền backend, cần ưu tiên các API đúng thứ tự nghiệp vụ mà sinh viên đi qua.

### [x] Nhóm API sinh viên cần làm trước

- [x] `GET /mang-nghien-cuu/dang-mo`
- [x] `POST /dang-ky-mang-nghien-cuu`
- [x] `GET /nhom-cua-toi`
- [x] `POST /nhom-nghien-cuu`
- [x] `POST /nhom-nghien-cuu/:groupId/moi-thanh-vien`
- [x] `POST /loi-moi-nhom/:id/chap-nhan`
- [x] `POST /loi-moi-nhom/:id/tu-choi`
- [x] `GET /goi-y-ghep-nhom`

### [x] Thứ tự bên trong luồng sinh viên

1. [x] Xem mảng nghiên cứu đang mở.
2. [x] Đăng ký mảng nghiên cứu.
3. [x] Xem nhóm hiện tại.
4. [x] Tạo nhóm.
5. [x] Mời thành viên.
6. [x] Chấp nhận hoặc từ chối lời mời.
7. [x] Xem gợi ý ghép nhóm.

### [x] Rule phải gắn ngay khi làm API sinh viên

- [x] Một sinh viên chỉ đăng ký một mảng trong một đợt.
- [x] Chỉ được đăng ký khi đợt còn hiệu lực.
- [x] Một sinh viên chỉ thuộc một nhóm tại một thời điểm.
- [x] Nhóm tối đa 3 thành viên.
- [x] Chỉ sinh viên cùng mảng mới vào cùng nhóm.
- [x] Không tin trạng thái do frontend gửi lên.

### [x] Transaction phải gắn ngay khi làm API sinh viên

- [x] Tạo nhóm + thêm trưởng nhóm.
- [x] Chấp nhận lời mời vào nhóm.

### [x] Audit log / notification cần gắn dần

- [x] Ghi audit log khi đăng ký mảng.
- [x] Ghi audit log khi tạo nhóm.
- [x] Ghi audit log khi chấp nhận / từ chối lời mời.
- [x] Gửi notification khi đăng ký mảng thành công.
- [x] Gửi notification khi mời vào nhóm.
- [x] Gửi notification khi lời mời được chấp nhận / từ chối.

### [!] Điểm còn mở để chốt hẳn ưu tiên 2

- [!] Database hiện chưa có dữ liệu test cho `sinh_vien` và `mang_nghien_cuu`, nên mới xác nhận được API ở mức build + gọi endpoint + nhánh lỗi; chưa xác nhận full nhánh thành công end-to-end trên dữ liệu thật.

---

## [x] Ưu tiên 3: Code API cho luồng giảng viên

Luồng này chỉ nên làm sau khi luồng sinh viên đã tạo được dữ liệu thật.

### [x] Nhóm API giảng viên cần làm trước

- [x] `GET /giang-vien/nhom/co-the-nhan`
- [x] `GET /giang-vien/nhom/:groupId`
- [x] `POST /giang-vien/nhom/:groupId/nhan-huong-dan`

### [x] Rule phải gắn ngay khi làm API giảng viên

- [x] Giảng viên chỉ được chọn nhóm phù hợp chuyên môn / mảng.
- [x] Giảng viên có quota hướng dẫn.
- [x] Một nhóm chỉ có một giảng viên hướng dẫn chính.

### [x] Transaction phải gắn ngay khi làm API giảng viên

- [x] Nhận hướng dẫn nhóm bằng transaction để tránh vượt quota hoặc gán trùng.

### [x] Audit log / notification cần gắn dần

- [x] Ghi audit log khi giảng viên nhận nhóm.
- [x] Gửi notification cho nhóm khi có giảng viên nhận hướng dẫn.

---

## [~] Ưu tiên 4: Code API cho luồng đề tài

Chỉ làm khi nhóm đã có giảng viên hướng dẫn.

### [ ] Nhóm API cần có cho luồng đề tài

- [ ] `POST /de-tai-de-xuat`
- [x] `GET /de-tai-cua-toi/co-the-chon`
- [x] `POST /nop-de-tai`
- [x] `PUT /nop-de-tai/:id`
- [x] `GET /giang-vien/de-tai-cho-duyet`
- [x] `POST /giang-vien/de-tai/:id/duyet`
- [x] `POST /giang-vien/de-tai/:id/yeu-cau-chinh-sua`
- [x] `POST /giang-vien/de-tai/:id/tu-choi`
- [x] `POST /de-tai/:id/chot`

### [ ] Rule phải gắn ngay khi làm API đề tài

- [x] Nhóm chỉ được chọn hoặc đề xuất đề tài sau khi đã có giảng viên.
- [x] Đề tài tự đề xuất phải qua giảng viên duyệt.
- [x] `REQUEST_CHANGES` và `REJECT` bắt buộc có nhận xét.
- [x] Hết thời gian chỉnh sửa thì không được sửa thêm.
- [x] Đề tài đã chốt thì không được sửa, không được duyệt lại.
- [x] Sau mỗi lần sửa, đề tài quay lại trạng thái chờ duyệt.

### [ ] Transaction phải gắn ngay khi làm API đề tài

- [x] Nhóm gửi đề tài.
- [x] Giảng viên duyệt đề tài.
- [x] Nhóm chỉnh sửa đề tài.
- [x] Chốt đề tài.

### [x] Audit log / notification cần gắn dần

- [x] Ghi audit log khi gửi đề tài.
- [x] Ghi audit log khi duyệt / yêu cầu chỉnh sửa / từ chối đề tài.
- [x] Ghi audit log khi chỉnh sửa đề tài.
- [x] Ghi audit log khi chốt đề tài.
- [x] Gửi notification khi nhóm gửi đề tài chờ duyệt.
- [x] Gửi notification khi giảng viên yêu cầu chỉnh sửa.
- [x] Gửi notification khi giảng viên từ chối đề tài.
- [x] Gửi notification khi giảng viên duyệt đề tài.
- [x] Gửi notification khi đề tài được chốt.

---

## [ ] Ưu tiên 5: Hạ tầng nghiệp vụ bổ sung sau khi luồng chính đã hình thành

Phần này quan trọng, nhưng không nên làm trước khi các luồng chính đã có dữ liệu thật để bám vào.

### [ ] Việc cần làm

- [ ] `Workflow status` cho sinh viên và nhóm.
- [ ] Hoàn thiện `AuditLogService` dùng chung.
- [ ] Hoàn thiện `NotificationService` dùng chung.
- [ ] Chuẩn hóa logging và lỗi.
- [ ] Viết test cho service, repository và các use case quan trọng.

### [ ] Gợi ý thứ tự bên trong

1. [ ] Hoàn thiện audit log dùng chung.
2. [ ] Hoàn thiện notification dùng chung.
3. [ ] Làm workflow status.
4. [ ] Test các luồng quan trọng.

---

## 5. Công việc ưu tiên tiếp theo ở frontend

Frontend chỉ nên dựng mạnh sau khi backend đã có các API thật cho luồng chính.

## [ ] Ưu tiên 6: Dựng nền frontend

### [ ] Cần làm

- [ ] Chuẩn hóa cấu trúc theo:
  - `src/app`
  - `src/core`
  - `src/features`
  - `src/shared`
- [ ] Hoàn thiện `core/api` cho API client.
- [ ] Tạo `shared/types/status.types` để mirror enum backend.
- [ ] Tạo `shared/ui` cho component dùng chung.
- [ ] Nếu được xác nhận, chuyển frontend sang TypeScript sớm thay vì để muộn.

### [ ] Lưu ý

- [ ] Không viết business rule ở frontend.
- [ ] Chỉ hiển thị trạng thái từ API.
- [ ] Sau mỗi action thành công phải refetch hoặc invalidate data.
- [ ] Form lớn phải có schema validation.

---

## [ ] Ưu tiên 7: Làm các màn hình chính theo đúng luồng nghiệp vụ

### [ ] Màn hình sinh viên

- [ ] Chọn mảng nghiên cứu.
- [ ] Quản lý nhóm nghiên cứu.
- [ ] Gợi ý ghép nhóm / lời mời tham gia.
- [ ] Chọn hoặc đề xuất đề tài.
- [ ] Chỉnh sửa đề tài khi được yêu cầu.
- [ ] Theo dõi workflow status.

### [ ] Màn hình giảng viên

- [ ] Danh sách nhóm có thể nhận hướng dẫn.
- [ ] Chi tiết nhóm.
- [ ] Nhận hướng dẫn nhóm.
- [ ] Danh sách đề tài chờ duyệt.
- [ ] Duyệt / yêu cầu chỉnh sửa / từ chối đề tài.

### [ ] Thứ tự frontend nên bám theo backend

1. [ ] Màn hình chọn mảng nghiên cứu.
2. [ ] Màn hình quản lý nhóm.
3. [ ] Màn hình ghép nhóm / lời mời.
4. [ ] Màn hình giảng viên nhận nhóm.
5. [ ] Màn hình chọn / nộp đề tài.
6. [ ] Màn hình duyệt đề tài.
7. [ ] Màn hình workflow status.

---

## 6. Những việc làm sau khi luồng chính đã chạy

Đây là nhóm việc quan trọng nhưng **không nên làm trước luồng chính**.

### [ ] Mức ưu tiên trung bình

- [ ] Auth context và route guard hoàn chỉnh.
- [ ] Chuẩn hóa layout theo từng vai trò.
- [ ] Bổ sung reusable UI components.
- [ ] Loading, error state, empty state rõ ràng.
- [ ] Mở rộng test cho các luồng phụ.
- [ ] Tối ưu logging, chuẩn hóa lỗi sâu hơn.

### [ ] Mức ưu tiên thấp hơn

- [ ] Dashboard tổng quan.
- [ ] Thống kê, báo cáo.
- [ ] Module quản trị sâu.
- [ ] Các chức năng ngoài phạm vi tài liệu cốt lõi như bảo vệ, chấm điểm, hội đồng.

---

## 7. Backlog đề xuất theo thứ tự thực thi

## [!] Giai đoạn 0: Xác nhận blocker

1. [!] Xác nhận chuẩn trạng thái dùng trong DB và code.
2. [!] Xác nhận có bổ sung bảng `GroupInvitation`, `AuditLog`, `Notification` hay không.
3. [!] Xác nhận có chuyển sang TypeScript ngay từ đầu hay không.

## [ ] Giai đoạn 1: Dựng nền backend

1. [ ] Chuẩn hóa cấu trúc backend.
2. [ ] Tạo constants, enums, response format, Prisma singleton.
3. [ ] Tạo error handling, middleware, common utils.
4. [ ] Chuẩn bị khung module theo controller -> service -> repository.

## [ ] Giai đoạn 2: Luồng sinh viên

1. [ ] Xem mảng nghiên cứu mở.
2. [ ] Đăng ký mảng nghiên cứu.
3. [ ] Xem nhóm của tôi.
4. [ ] Tạo nhóm.
5. [ ] Mời thành viên.
6. [ ] Chấp nhận hoặc từ chối lời mời.
7. [ ] Xem gợi ý ghép nhóm.

## [ ] Giai đoạn 3: Luồng giảng viên

1. [ ] Xem danh sách nhóm phù hợp.
2. [ ] Xem chi tiết nhóm.
3. [ ] Nhận hướng dẫn nhóm.

## [ ] Giai đoạn 4: Luồng đề tài

1. [ ] Giảng viên đề xuất đề tài.
2. [ ] Nhóm chọn hoặc nộp đề tài.
3. [ ] Giảng viên xem danh sách đề tài chờ duyệt.
4. [ ] Giảng viên duyệt đề tài.
5. [ ] Giảng viên yêu cầu chỉnh sửa.
6. [ ] Giảng viên từ chối đề tài.
7. [ ] Nhóm chỉnh sửa và gửi lại.
8. [ ] Chốt đề tài.

## [ ] Giai đoạn 5: Hạ tầng nghiệp vụ dùng chung

1. [ ] Hoàn thiện audit log.
2. [ ] Hoàn thiện notification.
3. [ ] Làm workflow status.
4. [ ] Test các luồng quan trọng.

## [ ] Giai đoạn 6: Frontend theo feature

1. [ ] Dựng nền frontend.
2. [ ] Màn hình sinh viên theo luồng.
3. [ ] Màn hình giảng viên theo luồng.
4. [ ] Gắn workflow status.

## [ ] Giai đoạn 7: Hoàn thiện và mở rộng

1. [ ] Auth hoàn chỉnh.
2. [ ] Reusable UI components.
3. [ ] Dashboard.
4. [ ] Báo cáo, thống kê.
5. [ ] Các phần mở rộng ngoài phạm vi lõi.

---

## 8. Kết luận

Nếu chỉ chọn một hướng làm ngay, thì nên làm theo thứ tự:

1. **Xác nhận blocker DB/schema**
2. **Backend foundation**
3. **API luồng sinh viên**
4. **API luồng giảng viên**
5. **API luồng đề tài**
6. **Audit log + notification + workflow status**
7. **Frontend theo feature**

Không nên bắt đầu bằng dashboard, UI đẹp hay báo cáo khi phần nghiệp vụ cốt lõi vẫn chưa được dựng xong.

> Khi cập nhật tiến độ thực tế, chỉ cần đổi trạng thái ở đầu từng mục từ `[ ]` -> `[~]` -> `[x]` hoặc `[!]`.
