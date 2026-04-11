# Phân công sequence và activity cho nhóm 5 người

## 1. Mục tiêu của file này

File này dùng để chia việc cho nhóm 5 người trong giai đoạn sát ngày báo cáo.

Mục tiêu là:

- vẫn có **cả sequence diagram và activity diagram**
- ưu tiên các sơ đồ **quan trọng nhất** trước
- nếu còn thời gian thì làm thêm các sơ đồ mở rộng

---

## 2. Nguyên tắc chia

- Use case đã làm xong
- Phần còn lại: **sequence diagram** và **activity diagram**
- Chia theo **cụm nghiệp vụ** để dễ bám vào code
- Mỗi người nên làm **một cụm rõ ràng**, tránh chồng chéo quá nhiều

---

## 3. Bộ sơ đồ nên làm trước

Đây là bộ sơ đồ nên ưu tiên trước vì dễ bị hỏi nhất khi báo cáo.

### 3.1. Sequence diagram nên làm trước

1. Đăng ký mảng nghiên cứu
2. Tạo nhóm nghiên cứu
3. Chấp nhận lời mời vào nhóm
4. Giảng viên nhận hướng dẫn nhóm
5. Sinh viên nộp đề tài tự đề xuất
6. Giảng viên yêu cầu chỉnh sửa đề tài
7. Sinh viên chỉnh sửa và nộp lại đề tài
8. Giảng viên chốt đề tài
9. Sinh viên chọn đề tài giảng viên đề xuất
10. Xem tiến trình thực hiện
11. Xem / đánh dấu đã đọc thông báo

### 3.2. Activity diagram nên làm trước

1. Đăng ký mảng nghiên cứu
2. Ghép nhóm / phản hồi lời mời
3. Nộp đề tài nghiên cứu
4. Giảng viên nhận hướng dẫn nhóm
5. Giảng viên duyệt đề tài
6. Theo dõi tiến trình thực hiện
7. Xử lý thông báo

---

## 4. Phân công đề xuất cho 5 người

## Người 1 — Đăng ký mảng và tạo nhóm

### Activity diagram
- Đăng ký mảng nghiên cứu

### Sequence diagram
- Đăng ký mảng nghiên cứu
- Tạo nhóm nghiên cứu

### Nếu còn thời gian thì làm thêm
- Sinh viên xem danh sách mảng nghiên cứu
- Sinh viên xem chi tiết mảng nghiên cứu

---

## Người 2 — Mời thành viên và ghép nhóm

### Activity diagram
- Ghép nhóm / phản hồi lời mời

### Sequence diagram
- Mời thành viên vào nhóm
- Chấp nhận lời mời vào nhóm

### Nếu còn thời gian thì làm thêm
- Xem gợi ý ghép nhóm
- Từ chối lời mời vào nhóm

---

## Người 3 — Đề tài phía sinh viên

### Activity diagram
- Nộp đề tài nghiên cứu

### Sequence diagram
- Sinh viên nộp đề tài tự đề xuất
- Sinh viên chỉnh sửa và nộp lại đề tài
- Sinh viên chọn đề tài giảng viên đề xuất

### Nếu còn thời gian thì làm thêm
- Sinh viên xem thông tin đề tài hiện tại
- Sinh viên xem đề tài giảng viên đề xuất

---

## Người 4 — Giảng viên hướng dẫn và duyệt đề tài

### Activity diagram
- Giảng viên nhận hướng dẫn nhóm
- Giảng viên duyệt đề tài

### Sequence diagram
- Giảng viên nhận hướng dẫn nhóm
- Giảng viên yêu cầu chỉnh sửa đề tài
- Giảng viên chốt đề tài

### Nếu còn thời gian thì làm thêm
- Giảng viên xem nhóm có thể nhận hướng dẫn
- Giảng viên xem chi tiết nhóm ứng viên
- Giảng viên duyệt đề tài
- Giảng viên từ chối đề tài
- Giảng viên xem danh sách đề tài chờ duyệt

---

## Người 5 — Tiến trình, thông báo và tổng hợp

### Activity diagram
- Theo dõi tiến trình thực hiện
- Xử lý thông báo

### Sequence diagram
- Xem tiến trình thực hiện
- Xem / đánh dấu đã đọc thông báo

### Nếu còn thời gian thì làm thêm
- Xem tiến trình sinh viên
- Xem tiến trình giảng viên
- Giảng viên xem và đánh dấu đã đọc thông báo
- Tải unread badge ở nav
- Chuyển role Sinh viên / Giảng viên

### Nhiệm vụ tổng hợp
- rà format toàn bộ sơ đồ cho thống nhất
- kiểm tra tên actor, lifeline, message
- gom tất cả sơ đồ vào báo cáo cuối

---

## 5. Danh sách các sơ đồ ngoài nhóm ưu tiên

Nếu nhóm làm xong phần chính sớm, có thể bổ sung thêm các sơ đồ sau:

### Sequence diagram ngoài nhóm ưu tiên
- Tải ứng dụng và chọn tài khoản sinh viên
- Sinh viên xem danh sách mảng nghiên cứu
- Sinh viên xem chi tiết mảng nghiên cứu
- Sinh viên xem gợi ý ghép nhóm và lời mời
- Sinh viên từ chối lời mời vào nhóm
- Sinh viên xem thông tin đề tài hiện tại
- Sinh viên xem đề tài giảng viên đề xuất
- Giảng viên xem nhóm có thể nhận hướng dẫn
- Giảng viên xem chi tiết nhóm ứng viên
- Giảng viên xem các nhóm đang hướng dẫn
- Giảng viên xem danh sách đề tài chờ duyệt
- Giảng viên duyệt đề tài
- Giảng viên từ chối đề tài
- Giảng viên xem tiến trình các nhóm đang hướng dẫn
- Giảng viên xem và đánh dấu đã đọc thông báo
- Đọc audit log theo entity

### Activity diagram ngoài nhóm ưu tiên
- Xem danh sách mảng nghiên cứu
- Tạo nhóm nghiên cứu
- Mời thành viên vào nhóm
- Sinh viên chọn đề tài giảng viên đề xuất
- Giảng viên xem danh sách nhóm ứng viên

---

## 6. Gợi ý cách làm nhanh trong 2 ngày cuối

### Ngày 1
- mỗi người chốt phần sơ đồ chính của mình
- ưu tiên làm xong **bộ recommended** trước

### Ngày 2
- bổ sung sơ đồ ngoài recommended nếu còn thời gian
- thống nhất format
- sửa tên actor, lifeline, arrow, note cho đồng nhất

---

## 7. Gợi ý format chung khi vẽ

### Với sequence diagram
Nên giữ các lifeline chính:

- Actor
- UI / Component
- Hook
- Service frontend
- Controller
- Service backend
- Repository
- Database

### Với activity diagram
Nên thể hiện rõ:

- điểm bắt đầu / kết thúc
- các bước xử lý chính
- rẽ nhánh điều kiện
- trường hợp thành công / thất bại
- bước quay lại nếu cần chỉnh sửa

---

## 8. Kết luận

Với cách chia này:

- nhóm vẫn có **cả sequence và activity** trong cùng một file phân công
- có phân biệt rõ **phần nên làm trước** và **phần làm thêm nếu còn thời gian**
- mỗi người có một cụm nghiệp vụ rõ ràng để bám theo code
- phù hợp với tình huống chỉ còn **2 ngày trước báo cáo**
