# Phân tích thiết kế luồng hoạt động nghiệp vụ chính  
## Hệ thống quản lý nghiên cứu khoa học sinh viên

## 1. Mục tiêu tài liệu
Tài liệu này mô tả chi tiết phân tích thiết kế cho **nghiệp vụ quan trọng nhất** của hệ thống, tập trung vào luồng:

**Đăng ký mảng nghiên cứu → hình thành nhóm → giảng viên chọn nhóm hướng dẫn → nhóm chọn hoặc đề xuất đề tài → giảng viên duyệt → chốt đề tài**

Phạm vi tài liệu chỉ tập trung vào phần nghiệp vụ cốt lõi, **không bao gồm** các chức năng nền như đăng nhập, đăng ký tài khoản, quản trị người dùng, thống kê báo cáo, bảo vệ đề tài hay công bố kết quả.

---

## 2. Bối cảnh và định hướng thiết kế
Trong báo cáo gốc, hệ thống đã xác định nhóm nghiệp vụ trọng tâm xoay quanh:
- đăng ký đề tài nghiên cứu,
- phê duyệt đề tài,
- quản lý sinh viên, giảng viên, hội đồng,
- vận hành dưới dạng ứng dụng web cho nhiều vai trò sử dụng.

Tuy nhiên, để phục vụ lập trình và bám sát quy trình thực tế, luồng nghiệp vụ này được **tái cấu trúc** theo hướng:
1. Sinh viên đăng ký **mảng nghiên cứu** trước.
2. Sinh viên hình thành **nhóm nghiên cứu** 1–3 người.
3. Hệ thống hỗ trợ **đề xuất ghép nhóm** cho sinh viên cùng mảng chưa có nhóm.
4. Giảng viên chủ động **chọn nhóm để hướng dẫn**.
5. Giảng viên **đề xuất đề tài**, hoặc nhóm **tự đăng ký đề tài riêng**.
6. Trong thời gian cho phép, nhóm được **chỉnh sửa đề tài**, nhưng mọi thay đổi vẫn phải qua giảng viên duyệt.
7. Khi hết hạn và đã được duyệt, đề tài được **chốt**.

Thiết kế này vẫn giữ tinh thần của báo cáo gốc: hệ thống quản lý nghiên cứu khoa học cho sinh viên, giảng viên và bộ phận quản lý; hỗ trợ quy trình đề tài theo nhóm; có ràng buộc số lượng thành viên; có phê duyệt và thông báo trạng thái.

---

## 3. Phạm vi nghiệp vụ được thiết kế

### 3.1. Tác nhân tham gia
- **Sinh viên**
- **Nhóm nghiên cứu**
- **Giảng viên hướng dẫn**
- **Hệ thống**

### 3.2. Nghiệp vụ trong phạm vi
- Đăng ký mảng nghiên cứu
- Tạo nhóm / tham gia nhóm / ghép nhóm
- Đề xuất ghép thành viên cùng mảng
- Giảng viên chọn nhóm để hướng dẫn
- Giảng viên đề xuất đề tài
- Nhóm chọn đề tài hoặc tự đề xuất đề tài
- Giảng viên duyệt / yêu cầu chỉnh sửa / từ chối đề tài
- Chỉnh sửa đề tài trong thời gian cho phép
- Chốt đề tài

### 3.3. Ngoài phạm vi
- Đăng nhập / phân quyền
- Quản lý tài khoản
- Hội đồng khoa học
- Đề cương nghiên cứu
- Báo cáo tiến độ
- Tổ chức bảo vệ
- Chấm điểm
- Thống kê báo cáo

---

## 4. Mục tiêu thiết kế frontend và backend

### 4.1. Mục tiêu frontend
- Giao diện rõ ràng theo từng bước nghiệp vụ.
- Mỗi màn hình chỉ tập trung vào một quyết định chính của người dùng.
- Trạng thái nghiệp vụ hiển thị minh bạch.
- Dễ theo dõi hạn chót và các hành động còn được phép thực hiện.
- Giảm nhập liệu dư thừa.

### 4.2. Mục tiêu backend
- Phân tách rõ domain nghiệp vụ.
- Kiểm soát chặt các rule: thời gian, số lượng thành viên, trạng thái nhóm, trạng thái đề tài, quota giảng viên.
- Hỗ trợ transaction để tránh dữ liệu sai lệch khi ghép nhóm, nhận hướng dẫn, duyệt đề tài.
- Thiết kế API dễ mở rộng sang đề cương, tiến độ và bảo vệ sau này.

---

## 5. Quy tắc nghiệp vụ cốt lõi

### 5.1. Quy tắc về mảng nghiên cứu
- Một sinh viên chỉ được đăng ký **một mảng nghiên cứu** trong một đợt.
- Chỉ được đăng ký mảng khi đợt đăng ký mảng còn hiệu lực.
- Sinh viên chỉ được tạo hoặc tham gia nhóm thuộc mảng đã đăng ký.

### 5.2. Quy tắc về nhóm
- Mỗi nhóm có từ **1 đến 3 sinh viên**.
- Một sinh viên chỉ thuộc **một nhóm** tại một thời điểm trong đợt đăng ký.
- Chỉ các sinh viên cùng mảng mới được ở chung một nhóm.
- Chỉ sinh viên **chưa có nhóm** và **chưa có đề tài** mới được đưa vào danh sách đề xuất ghép nhóm.
- Có thể làm 1 mình nếu không muốn ghép nhóm.
- Chỉ được chỉnh sửa thành viên nhóm khi đợt đăng ký nhóm còn mở và nhóm chưa bị khóa.

### 5.3. Quy tắc về giảng viên
- Giảng viên chỉ được chọn nhóm thuộc mảng/chuyên môn phù hợp.
- Giảng viên có giới hạn số lượng nhóm tối đa có thể hướng dẫn.
- Một nhóm chỉ có một giảng viên hướng dẫn chính.
- Giảng viên chỉ được đề xuất đề tài cho các nhóm mà mình đang hướng dẫn.

### 5.4. Quy tắc về đề tài
- Nhóm chỉ được chọn hoặc đề xuất đề tài sau khi đã có giảng viên hướng dẫn.
- Có hai nguồn đề tài:
  - đề tài do giảng viên đề xuất,
  - đề tài do nhóm tự đề xuất.
- Đề tài tự đề xuất phải được giảng viên kiểm tra về:
  - tính đúng đắn,
  - tính thực tế,
  - tính khả thi,
  - độ phù hợp với mảng nghiên cứu.
- Trong thời gian chỉnh sửa, nhóm được phép sửa đề tài.
- Sau mỗi lần sửa, đề tài quay lại trạng thái chờ giảng viên duyệt.
- Hết thời gian chỉnh sửa thì không thể sửa thêm.
- Chỉ đề tài ở trạng thái đã duyệt và đã khóa chỉnh sửa mới được coi là chốt.

---

## 6. Trạng thái nghiệp vụ

## 6.1. Trạng thái sinh viên
- `CHUA_DANG_KY_MANG`
- `DA_DANG_KY_MANG`
- `CHUA_CO_NHOM`
- `DA_CO_NHOM`
- `DA_CO_DE_TAI`

## 6.2. Trạng thái nhóm
- `NHAP`
- `DANG_TUYEN_THANH_VIEN`
- `DA_DU_THANH_VIEN`
- `CHUA_CO_GIANG_VIEN`
- `DA_CO_GIANG_VIEN`
- `DANG_CHON_DE_TAI`
- `CHO_DUYET_DE_TAI`
- `CAN_CHINH_SUA_DE_TAI`
- `DA_DUYET_DE_TAI`
- `DA_CHOT_DE_TAI`

## 6.3. Trạng thái đề tài nhóm
- `NHAP`
- `CHO_GIANG_VIEN_DUYET`
- `CAN_CHINH_SUA`
- `DA_DUYET`
- `TU_CHOI`
- `DA_CHOT`

---

## 7. Phân rã module hệ thống

### 7.1. Frontend modules
1. Module chọn mảng nghiên cứu  
2. Module quản lý nhóm nghiên cứu  
3. Module ghép nhóm / lời mời / đề xuất  
4. Module giảng viên chọn nhóm hướng dẫn  
5. Module chọn đề tài  
6. Module tự đề xuất đề tài  
7. Module chỉnh sửa đề tài  
8. Module giảng viên duyệt đề tài  
9. Module theo dõi trạng thái tiến trình  

### 7.2. Backend modules
1. Module quản lý đợt đăng ký  
2. Module quản lý mảng nghiên cứu  
3. Module quản lý nhóm  
4. Module ghép nhóm / gợi ý ghép nhóm  
5. Module phân công giảng viên  
6. Module quản lý đề tài đề xuất  
7. Module đăng ký đề tài nhóm  
8. Module duyệt đề tài  
9. Module thông báo trạng thái  
10. Module audit log / lịch sử thay đổi  

---

## 8. Thiết kế luồng frontend

# Màn hình 1. Chọn mảng nghiên cứu

## Mục tiêu
Cho sinh viên chọn mảng như AI, ML, Web, App trong thời gian đợt đăng ký còn hiệu lực.

## Thành phần giao diện
- Tiêu đề đợt đăng ký
- Thời gian mở / đóng đăng ký
- Đồng hồ đếm ngược
- Danh sách card mảng nghiên cứu
- Thông tin mô tả ngắn từng mảng
- Trạng thái: còn mở / sắp hết hạn / đã đóng
- Nút `Chọn mảng`
- Nút `Xem chi tiết`

## Tương tác chính
- Sinh viên chọn một card mảng.
- Hệ thống yêu cầu xác nhận vì mỗi sinh viên chỉ được chọn một mảng.
- Sau khi chọn thành công, giao diện chuyển sang trạng thái đã chọn và dẫn sang quản lý nhóm.

## Xử lý giao diện
- Nếu hết hạn, nút chọn bị vô hiệu hóa.
- Nếu sinh viên đã có nhóm hoặc đã qua bước chọn mảng, màn hình chuyển thành read-only.

---

# Màn hình 2. Quản lý nhóm nghiên cứu

## Mục tiêu
Cho sinh viên tạo nhóm, xem nhóm hiện tại, quản lý thành viên, tiếp nhận lời mời.

## Thành phần giao diện
- Khối `Thông tin nhóm của tôi`
- Danh sách thành viên hiện tại
- Vai trò trưởng nhóm / thành viên
- Số lượng thành viên hiện có
- Trạng thái nhóm
- Các nút:
  - `Tạo nhóm`
  - `Mời thành viên`
  - `Rời nhóm`
  - `Xóa thành viên`
  - `Khóa nhóm` hoặc `Hoàn tất nhóm`

## Kịch bản UX
- Nếu sinh viên chưa có nhóm: hiển thị CTA tạo nhóm hoặc tham gia nhóm.
- Nếu đã có nhóm: hiển thị cấu trúc nhóm và các quyền thao tác.
- Nếu là trưởng nhóm: có quyền gửi lời mời, loại thành viên trước khi chốt.
- Nếu là thành viên thường: ít quyền hơn, chủ yếu xem và rời nhóm.

## Ràng buộc UI
- Không cho thêm quá 3 người.
- Không cho mời sinh viên khác mảng.
- Không cho sửa nhóm khi hết hạn đăng ký nhóm.

---

# Màn hình 3. Gợi ý ghép nhóm / lời mời tham gia

## Mục tiêu
Giúp nhóm còn thiếu người và sinh viên chưa có nhóm kết nối với nhau.

## Thành phần giao diện
- Danh sách sinh viên phù hợp
- Danh sách nhóm còn thiếu thành viên
- Thông tin đề xuất:
  - cùng mảng nghiên cứu
  - chưa có nhóm
  - chưa có đề tài
- Hành động:
  - `Gửi lời mời`
  - `Chấp nhận`
  - `Từ chối`

## Trải nghiệm
- Nhóm 1–2 người sẽ được ưu tiên nhìn thấy danh sách sinh viên có thể ghép.
- Sinh viên đơn lẻ sẽ thấy danh sách nhóm phù hợp để tham gia.
- Có badge “Phù hợp cao”, “Cùng mảng”, “Nhóm còn thiếu 1 người”.

## Điểm thiết kế
- Tách riêng đề xuất hệ thống với lời mời thủ công.
- Có lịch sử lời mời đã gửi / đã nhận / đã từ chối.

---

# Màn hình 4. Danh sách nhóm cho giảng viên chọn hướng dẫn

## Mục tiêu
Cho giảng viên xem các nhóm phù hợp và nhận hướng dẫn.

## Thành phần giao diện
- Bộ lọc theo mảng
- Bộ lọc theo số thành viên
- Card nhóm:
  - tên nhóm
  - thành viên
  - mảng
  - định hướng quan tâm
  - trạng thái hiện tại
- Chỉ tiêu giảng viên: `Đã nhận X/Y nhóm`
- Nút:
  - `Xem chi tiết`
  - `Nhận hướng dẫn`

## Trải nghiệm
- Nhóm phù hợp chuyên môn được đánh dấu.
- Nhóm đã có giảng viên không cho nhận nữa.
- Khi quota đã đủ, nút nhận hướng dẫn bị vô hiệu hóa.

---

# Màn hình 5. Chi tiết nhóm nghiên cứu

## Mục tiêu
Cho giảng viên xem sâu một nhóm trước khi quyết định hướng dẫn.

## Thành phần giao diện
- Thông tin chung nhóm
- Danh sách thành viên
- Mảng nghiên cứu
- Ghi chú định hướng
- Lịch sử thay đổi nhóm
- Hành động:
  - `Nhận hướng dẫn`
  - `Từ chối`
  - `Quay lại danh sách`

## Mục đích UX
Màn hình này giúp quyết định nhận hướng dẫn có cơ sở, không phải chỉ nhìn card tóm tắt.

---

# Màn hình 6. Chọn đề tài / tự đề xuất đề tài

## Mục tiêu
Sau khi nhóm đã có giảng viên, nhóm chọn một đề tài cụ thể.

## Bố cục
Dùng 2 tab:

### Tab A. Đề tài giảng viên đề xuất
- Danh sách đề tài đề xuất
- Mỗi card có:
  - tên đề tài
  - mô tả
  - độ khó
  - kỹ năng cần có
  - hướng ứng dụng
- Nút `Chọn đề tài này`

### Tab B. Tự đề xuất đề tài
Form nhập:
- tên đề tài
- mô tả bài toán
- mục tiêu nghiên cứu
- phạm vi
- tính thực tế
- định hướng ứng dụng
- lý do chọn đề tài
- nút `Gửi giảng viên duyệt`

## Trải nghiệm
- Phân tách rõ giữa chọn đề tài có sẵn và tự đề xuất.
- Có thanh trạng thái hiển thị đề tài đang ở bước nào.
- Có cảnh báo nếu còn ít thời gian trước hạn chỉnh sửa.

---

# Màn hình 7. Chỉnh sửa đề tài

## Mục tiêu
Cho nhóm cập nhật lại đề tài sau khi giảng viên yêu cầu chỉnh sửa.

## Thành phần giao diện
- Thông tin đề tài hiện tại
- Trạng thái
- Hạn cuối chỉnh sửa
- Nhận xét gần nhất của giảng viên
- Form chỉnh sửa
- Sidebar hiển thị lịch sử phiên bản
- Nút `Gửi lại để duyệt`

## Điểm mạnh UX
- Người dùng thấy rõ phải sửa gì.
- Có version history để đối chiếu các lần chỉnh sửa.
- Hết hạn thì form chuyển sang read-only.

---

# Màn hình 8. Giảng viên duyệt đề tài

## Mục tiêu
Giảng viên đánh giá đề tài mà nhóm đã chọn hoặc tự đề xuất.

## Thành phần giao diện
- Thông tin nhóm
- Loại đề tài:
  - do giảng viên đề xuất
  - do nhóm tự đề xuất
- Nội dung đề tài
- Checklist đánh giá:
  - đúng hướng nghiên cứu
  - có tính khả thi
  - có tính ứng dụng
  - không quá rộng
  - không trùng lặp hoặc phi thực tế
- Ô nhận xét
- Các nút:
  - `Duyệt`
  - `Yêu cầu chỉnh sửa`
  - `Từ chối`

## Luật giao diện
- Nếu yêu cầu chỉnh sửa hoặc từ chối, bắt buộc nhập lý do.
- Nếu duyệt, hệ thống xác nhận thao tác cuối.
- Sau khi duyệt, nhóm chỉ còn được sửa nếu vẫn trong khoảng thời gian cho phép và giảng viên trả lại trạng thái chỉnh sửa.

---

# Màn hình 9. Trạng thái tiến trình đề tài

## Mục tiêu
Cho sinh viên và giảng viên theo dõi toàn bộ tiến trình.

## Thành phần giao diện
- Stepper tiến trình:
  - Đã đăng ký mảng
  - Đã có nhóm
  - Đã có giảng viên
  - Đã chọn đề tài
  - Chờ duyệt
  - Cần chỉnh sửa / Đã duyệt
  - Đã chốt
- Người đang phải xử lý bước tiếp theo
- Hạn cuối tiếp theo
- Thông báo gần nhất
- Lịch sử trạng thái

## Vai trò
Đây là màn hình tổng quan, giảm việc người dùng phải tự suy đoán mình đang ở đâu trong quy trình.

---

## 9. Thiết kế luồng backend

# 9.1. Kiến trúc xử lý đề xuất
Có thể chia backend thành các lớp:

- **Controller / API layer**: nhận request, validate input cơ bản, trả response.
- **Application service layer**: điều phối use case nghiệp vụ.
- **Domain layer**: chứa entity, business rules, state machine.
- **Repository layer**: truy cập dữ liệu.
- **Notification layer**: gửi thông báo trong hệ thống.
- **Audit layer**: lưu lịch sử thay đổi.

Kiến trúc này phù hợp với yêu cầu bảo trì, mở rộng và tính nhất quán dữ liệu.

---

# 9.2. Luồng backend chi tiết theo use case

## Use Case A. Sinh viên đăng ký mảng nghiên cứu

### Input
- studentId
- areaId
- registrationPeriodId

### Xử lý backend
1. Kiểm tra sinh viên tồn tại và hợp lệ.
2. Kiểm tra đợt đăng ký mảng đang mở.
3. Kiểm tra sinh viên chưa đăng ký mảng trong đợt này.
4. Kiểm tra sinh viên chưa có nhóm hoặc đề tài ở đợt hiện tại.
5. Tạo bản ghi đăng ký mảng.
6. Cập nhật trạng thái sinh viên.
7. Ghi audit log.
8. Trả kết quả thành công.

### Response
- area registration created
- current student workflow state

### Lỗi có thể gặp
- Đợt đăng ký đã hết hạn
- Sinh viên đã đăng ký mảng
- Sinh viên không hợp lệ

---

## Use Case B. Tạo nhóm nghiên cứu

### Input
- leaderStudentId
- areaId
- groupName

### Xử lý backend
1. Kiểm tra sinh viên đã đăng ký mảng chưa.
2. Kiểm tra mảng nhóm trùng với mảng sinh viên đã đăng ký.
3. Kiểm tra sinh viên chưa thuộc nhóm nào.
4. Kiểm tra đợt đăng ký nhóm còn mở.
5. Tạo group.
6. Tạo group member với vai trò trưởng nhóm.
7. Cập nhật trạng thái sinh viên và nhóm.
8. Ghi audit log.

### Lỗi
- Sinh viên chưa đăng ký mảng
- Sinh viên đã có nhóm
- Hết hạn tạo nhóm

---

## Use Case C. Gửi lời mời / ghép nhóm

### Input
- groupId
- inviterId
- invitedStudentId

### Xử lý backend
1. Kiểm tra người gửi thuộc nhóm và có quyền.
2. Kiểm tra nhóm chưa đủ 3 người.
3. Kiểm tra sinh viên được mời cùng mảng.
4. Kiểm tra sinh viên chưa có nhóm và chưa có đề tài.
5. Kiểm tra không có lời mời đang chờ trùng lặp.
6. Tạo group invitation.
7. Gửi notification.
8. Ghi audit log.

### Khi sinh viên chấp nhận
1. Khóa bản ghi lời mời ở transaction.
2. Kiểm tra lại nhóm chưa đầy.
3. Kiểm tra lại sinh viên chưa vào nhóm khác.
4. Thêm sinh viên vào group_members.
5. Cập nhật trạng thái nhóm nếu đã đủ thành viên.
6. Đóng lời mời.
7. Gửi notification cho trưởng nhóm.

### Lý do phải kiểm tra lại
Vì có thể xảy ra race condition: cùng lúc một sinh viên nhận nhiều lời mời hoặc một nhóm có nhiều lời mời cùng được chấp nhận.

---

## Use Case D. Hệ thống gợi ý ghép nhóm

### Cách thiết kế
Nên tách thành service riêng:
- `MatchingService`

### Dữ liệu đầu vào
- areaId
- danh sách sinh viên chưa có nhóm
- danh sách nhóm có 1 hoặc 2 thành viên

### Tiêu chí gợi ý
- cùng mảng
- chưa có nhóm
- chưa có đề tài
- ưu tiên nhóm thiếu ít thành viên hơn
- có thể ưu tiên theo lớp / khoa / định hướng nếu muốn mở rộng

### Kết quả
Trả danh sách đề xuất, nhưng **không tự động ghép**. Hệ thống chỉ gợi ý, việc tham gia vẫn cần người dùng xác nhận.

---

## Use Case E. Giảng viên nhận hướng dẫn nhóm

### Input
- lecturerId
- groupId

### Xử lý backend
1. Kiểm tra giảng viên hợp lệ.
2. Kiểm tra giảng viên còn quota.
3. Kiểm tra nhóm chưa có giảng viên.
4. Kiểm tra mảng nhóm phù hợp chuyên môn giảng viên.
5. Gán lecturerId vào group.
6. Cập nhật trạng thái nhóm.
7. Gửi notification cho nhóm.
8. Ghi audit log.

### Lỗi
- Hết quota
- Nhóm đã có giảng viên
- Không đúng chuyên môn

---

## Use Case F. Giảng viên tạo đề tài đề xuất

### Input
- lecturerId
- groupId
- topicProposal data

### Xử lý backend
1. Kiểm tra giảng viên đang hướng dẫn nhóm đó.
2. Tạo bản ghi topic proposal thuộc nhóm và giảng viên.
3. Đưa trạng thái về đề tài đề xuất khả dụng.
4. Thông báo cho nhóm.

### Ghi chú
Đề tài do giảng viên đề xuất có thể được lưu như một proposal template để nhóm lựa chọn.

---

## Use Case G. Nhóm chọn đề tài hoặc tự đề xuất đề tài

### Trường hợp 1: Chọn từ đề tài giảng viên đề xuất
1. Kiểm tra nhóm đã có giảng viên.
2. Kiểm tra đề tài thuộc giảng viên của nhóm.
3. Kiểm tra đợt chọn đề tài còn mở.
4. Tạo `group_topic_selection`.
5. Đặt trạng thái đề tài nhóm = `CHO_GIANG_VIEN_DUYET`.
6. Gửi notification cho giảng viên.

### Trường hợp 2: Tự đề xuất đề tài
1. Kiểm tra nhóm đã có giảng viên.
2. Kiểm tra hạn đăng ký đề tài còn mở.
3. Validate nội dung form.
4. Tạo `research_topic_submission`.
5. Đặt trạng thái = `CHO_GIANG_VIEN_DUYET`.
6. Gửi notification cho giảng viên.

---

## Use Case H. Giảng viên duyệt đề tài

### Input
- lecturerId
- topicSubmissionId
- action: APPROVE / REQUEST_CHANGES / REJECT
- comment

### Xử lý backend
1. Kiểm tra giảng viên đúng người hướng dẫn.
2. Kiểm tra đề tài đang ở trạng thái được phép duyệt.
3. Tùy action:
   - APPROVE → cập nhật trạng thái `DA_DUYET`
   - REQUEST_CHANGES → cập nhật `CAN_CHINH_SUA`
   - REJECT → cập nhật `TU_CHOI`
4. Lưu comment duyệt.
5. Ghi lịch sử duyệt.
6. Gửi notification cho nhóm.
7. Nếu `DA_DUYET` và đã hết thời hạn chỉnh sửa thì có thể chuyển sang `DA_CHOT`.

### Ràng buộc
- `REQUEST_CHANGES` bắt buộc có nhận xét.
- `REJECT` bắt buộc có lý do.
- Không cho duyệt lại đề tài đã chốt.

---

## Use Case I. Nhóm chỉnh sửa đề tài

### Input
- topicSubmissionId
- updated content
- editorStudentId

### Xử lý backend
1. Kiểm tra nhóm còn trong thời gian chỉnh sửa.
2. Kiểm tra trạng thái hiện tại là `CAN_CHINH_SUA` hoặc trạng thái cho phép sửa.
3. Tạo version mới.
4. Cập nhật submission hiện tại.
5. Đặt trạng thái về `CHO_GIANG_VIEN_DUYET`.
6. Gửi notification cho giảng viên.
7. Ghi audit log.

### Tại sao cần versioning
Để giảng viên xem lịch sử thay đổi và để báo cáo có thể mô tả quá trình duyệt.

---

## Use Case J. Chốt đề tài

### Điều kiện
- đề tài đã ở trạng thái `DA_DUYET`
- hết thời gian chỉnh sửa hoặc được CBQL chốt theo đợt
- không còn thay đổi chờ xử lý

### Xử lý backend
1. Kiểm tra đề tài đủ điều kiện chốt.
2. Cập nhật trạng thái `DA_CHOT`.
3. Cập nhật trạng thái nhóm `DA_CHOT_DE_TAI`.
4. Cập nhật trạng thái sinh viên `DA_CO_DE_TAI`.
5. Ghi audit log.
6. Gửi thông báo chốt đề tài.

---

## 10. API backend đề xuất

### 10.1. API cho sinh viên
- `GET /research-areas/open`
- `POST /student-area-registrations`
- `GET /my-group`
- `POST /groups`
- `POST /groups/{groupId}/invite`
- `POST /group-invitations/{id}/accept`
- `POST /group-invitations/{id}/reject`
- `GET /group-matching/suggestions`
- `GET /my-topic-options`
- `POST /topic-selections/from-lecturer-proposal`
- `POST /topic-submissions`
- `PUT /topic-submissions/{id}`
- `GET /workflow-status/me`

### 10.2. API cho giảng viên
- `GET /lecturer/groups/candidates`
- `GET /lecturer/groups/{groupId}`
- `POST /lecturer/groups/{groupId}/assign`
- `POST /lecturer/topic-proposals`
- `GET /lecturer/topic-submissions/pending`
- `POST /lecturer/topic-submissions/{id}/approve`
- `POST /lecturer/topic-submissions/{id}/request-changes`
- `POST /lecturer/topic-submissions/{id}/reject`

### 10.3. API dùng chung
- `GET /notifications`
- `GET /workflow-status/{groupId}`
- `GET /audit-logs/{entityType}/{entityId}`

---

## 11. Thiết kế dữ liệu mức khái niệm

## 11.1. Các thực thể chính
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
- LecturerTopicProposal
- ResearchTopicSubmission
- TopicReview
- TopicSubmissionVersion
- Notification
- AuditLog

## 11.2. Quan hệ chính
- Một sinh viên có thể có nhiều đăng ký theo thời gian, nhưng mỗi đợt chỉ một đăng ký mảng.
- Một nhóm có nhiều thành viên.
- Một giảng viên có thể hướng dẫn nhiều nhóm, trong giới hạn quota.
- Một nhóm có thể có nhiều phiên bản đề tài.
- Một đề tài có thể có nhiều lần review.
- Một nhóm chỉ có một đề tài chính thức được chốt.

---

## 12. Quy tắc transaction quan trọng

Các thao tác sau cần transaction:
1. Chấp nhận lời mời vào nhóm
2. Giảng viên nhận hướng dẫn nhóm
3. Nhóm gửi đề tài
4. Giảng viên duyệt đề tài
5. Nhóm chỉnh sửa đề tài
6. Chốt đề tài

Lý do:
- tránh vượt quá số lượng nhóm hoặc thành viên,
- tránh một nhóm có hai giảng viên,
- tránh mất đồng bộ giữa trạng thái nhóm, đề tài và thông báo.

---

## 13. Notification và audit log

### 13.1. Các sự kiện cần thông báo
- Đăng ký mảng thành công
- Có lời mời tham gia nhóm
- Lời mời được chấp nhận / từ chối
- Giảng viên nhận hướng dẫn nhóm
- Có đề tài do giảng viên đề xuất
- Nhóm gửi đề tài để duyệt
- Giảng viên yêu cầu chỉnh sửa
- Giảng viên từ chối đề tài
- Giảng viên duyệt đề tài
- Đề tài được chốt

### 13.2. Audit log cần lưu
- ai thao tác
- thao tác gì
- lúc nào
- trên entity nào
- dữ liệu trạng thái cũ / mới

Audit log rất quan trọng cho nghiệp vụ phê duyệt và báo cáo quá trình xử lý.

---

## 14. Các tình huống lỗi nghiệp vụ cần xử lý tốt

### 14.1. Lỗi phía sinh viên
- Chọn mảng khi đã hết hạn
- Tạo nhóm khi chưa đăng ký mảng
- Tham gia nhóm khác mảng
- Thêm quá 3 thành viên
- Gửi đề tài khi chưa có giảng viên
- Sửa đề tài khi đã hết thời gian chỉnh sửa

### 14.2. Lỗi phía giảng viên
- Nhận nhóm khi đã hết quota
- Nhận nhóm không đúng chuyên môn
- Duyệt đề tài không thuộc nhóm mình hướng dẫn
- Duyệt đề tài đã chốt

### 14.3. Lỗi hệ thống
- Xung đột đồng thời khi nhiều lời mời được chấp nhận cùng lúc
- Trạng thái không hợp lệ khi người dùng mở nhiều tab
- Notification gửi trùng
- Phiên bản đề tài bị ghi đè

---

## 15. Đề xuất tổ chức source code

## 15.1. Frontend
Có thể chia theo feature:
- `features/research-area`
- `features/research-group`
- `features/group-matching`
- `features/lecturer-group-selection`
- `features/topic-selection`
- `features/topic-review`
- `features/workflow-status`

Mỗi feature gồm:
- pages
- components
- hooks
- services
- schemas
- types

## 15.2. Backend
Có thể chia module:
- `research-area`
- `nhom-nghien-cuu`
- `ghep-nhom`
- `phan-cong-giang-vien`
- `de-tai-de-xuat`
- `nop-de-tai`
- `duyet-de-tai`
- `trang-thai-quy-trinh`
- `thong-bao`
- `nhat-ky-kiem-toan`

Mỗi module gồm:
- controller
- service
- repository
- dto
- entity
- policy / validator

---

## 16. Đề xuất component frontend theo từng màn hình

### Chọn mảng nghiên cứu
- AreaCard
- AreaList
- RegistrationPeriodBanner
- CountdownTimer
- ConfirmAreaSelectionModal

### Quản lý nhóm
- GroupSummaryCard
- MemberList
- InviteMemberDialog
- GroupStatusBadge
- GroupActionBar

### Gợi ý ghép nhóm
- SuggestedStudentCard
- SuggestedGroupCard
- InvitationInbox
- MatchingPanel

### Giảng viên chọn nhóm
- LecturerQuotaCard
- GroupCandidateList
- GroupCandidateCard
- GroupFilterBar

### Chọn đề tài
- TopicProposalCard
- TopicProposalList
- TopicSubmissionForm
- TopicStatusBanner
- TopicSubTabs (`Đề tài giảng viên đề xuất` / `Tự đề xuất đề tài`)

### Chỉnh sửa đề tài
- TopicEditorForm
- ReviewCommentBox
- VersionHistoryPanel

### Giảng viên duyệt đề tài
- TopicReviewChecklist
- TopicReviewActionBar
- TopicReviewCommentBox

### Trạng thái tiến trình
- WorkflowStepper
- WorkflowTimeline
- NextActionCard
- NotificationFeed

---

## 17. Kịch bản end-to-end tổng thể

1. Sinh viên vào hệ thống và chọn mảng nghiên cứu.

## 17.1. Ghi chú cập nhật cho luồng đề tài

- Trong trang **Đề tài nghiên cứu**, giao diện nên tách 2 tab con:
  - **Đề tài giảng viên đề xuất**
  - **Tự đề xuất đề tài**
- **Đề tài giảng viên đề xuất** được lấy từ catalog riêng theo giảng viên hướng dẫn và mảng nghiên cứu.
- Khi nhóm đang có đề tài ở trạng thái chưa chốt mà muốn đổi sang loại đề tài còn lại, hệ thống phải yêu cầu **modal xác nhận chuyển đề tài** trước khi thực hiện.
- Dữ liệu đề tài giảng viên đề xuất không nên lưu trực tiếp như đề tài hiện tại của nhóm; cần tách riêng khỏi bản ghi đề tài đang sở hữu của nhóm.
2. Sinh viên tạo nhóm hoặc tham gia nhóm cùng mảng.
3. Nếu nhóm chưa đủ người, hệ thống gợi ý các sinh viên phù hợp.
4. Giảng viên xem danh sách nhóm và nhận hướng dẫn một nhóm phù hợp.
5. Giảng viên đề xuất một hoặc nhiều đề tài cho nhóm.
6. Nhóm chọn một đề tài đề xuất hoặc tự đề xuất đề tài riêng.
7. Hệ thống chuyển đề tài sang trạng thái chờ giảng viên duyệt.
8. Giảng viên duyệt, yêu cầu chỉnh sửa hoặc từ chối.
9. Nếu bị yêu cầu chỉnh sửa, nhóm sửa lại và gửi duyệt lại.
10. Khi đề tài được duyệt và hết thời gian chỉnh sửa, hệ thống chốt đề tài.

---

## 18. Lý do luồng này phù hợp để lập trình trước
- Đây là luồng tạo ra giá trị cốt lõi nhất cho hệ thống.
- Có đủ nhiều trạng thái để thể hiện thiết kế phần mềm.
- Có đủ tương tác frontend và kiểm soát backend.
- Dễ chứng minh tính nhất quán dữ liệu.
- Dễ mở rộng sang các giai đoạn sau như đề cương, tiến độ, bảo vệ.
- Có thể demo rõ vai trò sinh viên và giảng viên.

---

## 19. Kết luận
Thiết kế của luồng nghiệp vụ này nên xoay quanh nguyên tắc:

- **Frontend rõ bước, rõ trạng thái, rõ hành động**
- **Backend kiểm soát chặt business rule, trạng thái và transaction**
- **Mọi thay đổi quan trọng đều có notification và audit log**
- **Dữ liệu được tổ chức theo hướng dễ mở rộng cho toàn bộ vòng đời đề tài nghiên cứu**

Với cách phân tích này, bạn có thể tiếp tục triển khai:
1. đặc tả use case chi tiết,
2. sơ đồ sequence,
3. thiết kế database,
4. thiết kế API,
5. prompt thiết kế UI cho từng màn hình,
6. chia task lập trình frontend và backend theo sprint.
