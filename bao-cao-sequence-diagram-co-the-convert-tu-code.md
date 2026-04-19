# Đề xuất các sequence diagram nên vẽ trước ngày báo cáo

## 1. Mục đích của file này

File này **không còn liệt kê toàn bộ sơ đồ có thể vẽ từ code** như bản đầy đủ trước đó.

Mục tiêu hiện tại là:

- nhóm có thể **chọn nhanh các sơ đồ quan trọng nhất**
- ưu tiên các sơ đồ **giảng viên dễ hỏi nhất khi báo cáo**
- tránh vẽ quá nhiều sơ đồ trong khi chỉ còn **2 ngày**

---

## 2. Kết luận nhanh

### Nếu thời gian rất gấp
Chỉ nên vẽ **8 sequence diagram cốt lõi**.

### Nếu còn đủ thời gian hơn
Nên vẽ khoảng **10 đến 11 sequence diagram**.

### Không nên
- không nên cố vẽ toàn bộ hơn 20 sequence diagram
- không nên sa vào các sơ đồ phụ ít giá trị khi thuyết trình

---

## 3. Bộ sơ đồ cốt lõi nhất — nên vẽ chắc chắn

Đây là **8 sequence diagram quan trọng nhất**, cũng là bộ dễ bị hỏi nhất vì bám trực tiếp vào luồng nghiệp vụ chính của hệ thống.

### SD-01 — Đăng ký mảng nghiên cứu
**Lý do nên vẽ:**
- là bước mở đầu toàn bộ quy trình
- dễ giải thích
- thể hiện rõ luồng từ UI → API → backend → database

**Code bám vào:**
- Frontend: `ResearchAreaBoard.js`, `RegistrationConfirmationModal.js`, `useStudentJourneyDemo.js`
- Backend: `dang-ky-mang-nghien-cuu`

---

### SD-02 — Tạo nhóm nghiên cứu
**Lý do nên vẽ:**
- nhóm nghiên cứu là thực thể trung tâm của hệ thống
- là bước chuyển tiếp quan trọng sau đăng ký mảng

**Code bám vào:**
- Frontend: `ResearchGroupBoard.js`, `useStudentJourneyDemo.js`
- Backend: `nhom-nghien-cuu`

---

### SD-03 — Chấp nhận lời mời vào nhóm
**Lý do nên vẽ:**
- có kiểm tra business rule
- có transaction
- thể hiện rõ nghiệp vụ ghép nhóm

**Code bám vào:**
- Frontend: `GroupMatchingBoard.js`, `useStudentJourneyDemo.js`
- Backend: `ghep-nhom`

---

### SD-04 — Giảng viên nhận hướng dẫn nhóm
**Lý do nên vẽ:**
- là điểm giao giữa phía sinh viên và giảng viên
- có kiểm tra quota và chuyên môn

**Code bám vào:**
- Frontend: `LecturerGroupSelectionBoard.js`, `LecturerGroupDetailModal.js`, `useLecturerGroupSelection.js`
- Backend: `phan-cong-giang-vien`

---

### SD-05 — Sinh viên nộp đề tài tự đề xuất
**Lý do nên vẽ:**
- là một trong các nghiệp vụ chính nhất của hệ thống
- liên quan trực tiếp đến quy trình duyệt đề tài

**Code bám vào:**
- Frontend: `TopicBoard.js`, `useStudentJourneyDemo.js`
- Backend: `nop-de-tai`

---

### SD-06 — Giảng viên yêu cầu chỉnh sửa đề tài
**Lý do nên vẽ:**
- thể hiện rõ quy trình phản hồi của giảng viên
- có thay đổi trạng thái nghiệp vụ
- là nhánh rất hay bị giảng viên hỏi

**Code bám vào:**
- Frontend: `LecturerTopicReviewBoard.js`, `useLecturerTopicReview.js`
- Backend: `duyet-de-tai`

---

### SD-07 — Sinh viên chỉnh sửa và nộp lại đề tài
**Lý do nên vẽ:**
- thể hiện vòng lặp nghiệp vụ, không chỉ là luồng thẳng
- cho thấy hệ thống có xử lý “request changes” hoàn chỉnh

**Code bám vào:**
- Frontend: `TopicBoard.js`
- Backend: `PUT /api/nop-de-tai/nop-de-tai/:id`

---

### SD-08 — Giảng viên chốt đề tài
**Lý do nên vẽ:**
- là điểm kết thúc quan trọng nhất của quy trình đề tài
- thể hiện được trạng thái cuối cùng của nhóm và đề tài

**Code bám vào:**
- Frontend: `LecturerTopicReviewBoard.js`
- Backend: `POST /api/duyet-de-tai/giang-vien/de-tai/:id/chot`

---

## 4. Bộ sơ đồ nên vẽ thêm nếu còn thời gian

Nếu nhóm còn thời gian, nên bổ sung thêm các sơ đồ sau để bài báo cáo đầy đặn hơn.

### SD-09 — Sinh viên chọn đề tài giảng viên đề xuất
**Lý do nên vẽ:**
- đây là nhánh nghiệp vụ phụ nhưng khá hay
- cho thấy hệ thống hỗ trợ **2 hướng chọn đề tài**:
  - nhóm tự đề xuất
  - giảng viên đề xuất để nhóm chọn

**Code bám vào:**
- Frontend: `TopicBoard.js`
- Backend: `de-tai-de-xuat`

---

### SD-10 — Xem tiến trình thực hiện
**Lý do nên vẽ:**
- thể hiện khả năng tổng hợp trạng thái toàn quy trình
- phù hợp để giải thích dashboard / workflow của hệ thống

**Code bám vào:**
- Frontend: `StudentProgressBoard.js`, `LecturerProgressBoard.js`
- Backend: `trang-thai-quy-trinh`

---

### SD-11 — Xem thông báo và đánh dấu đã đọc
**Lý do nên vẽ:**
- là luồng hỗ trợ nhưng rất dễ được hỏi để kiểm tra tính hoàn chỉnh hệ thống
- có tương tác state thay đổi ngay trên UI

**Code bám vào:**
- Frontend: `NotificationBoard.js`, `useNotifications.js`
- Backend: `thong-bao`

---

## 5. Những sơ đồ không cần ưu tiên nếu thiếu thời gian

Các sơ đồ sau **không bắt buộc phải vẽ trước**:

- tải app và chọn tài khoản
- xem chi tiết mảng nghiên cứu
- xem nhóm đang hướng dẫn
- xem danh sách đề tài chờ duyệt
- từ chối lời mời
- từ chối đề tài
- xem audit log riêng
- các sơ đồ phụ như unread badge ở nav

Lý do:
- vẫn có thể giải thích miệng khi báo cáo
- không phải trọng tâm nghiệp vụ
- không nên chiếm thời gian của nhóm trong 2 ngày cuối

---

## 6. Danh sách các sơ đồ ngoài nhóm recommended

Phần này dùng để **giữ đầy đủ phạm vi các sequence diagram có thể convert ngược từ code**, nhưng không bắt buộc phải ưu tiên vẽ ngay.

### 6.1. Các sơ đồ ngoài 8 sơ đồ cốt lõi

Đây là các sơ đồ **không nằm trong nhóm ưu tiên cao nhất**, nhưng vẫn có thể vẽ nếu nhóm còn thời gian:

1. **Tải ứng dụng và chọn tài khoản sinh viên**
2. **Sinh viên xem danh sách mảng nghiên cứu**
3. **Sinh viên xem chi tiết mảng nghiên cứu**
4. **Sinh viên xem gợi ý ghép nhóm và lời mời**
5. **Sinh viên từ chối lời mời vào nhóm**
6. **Sinh viên xem thông tin đề tài hiện tại**
7. **Sinh viên xem đề tài giảng viên đề xuất**
8. **Giảng viên xem nhóm có thể nhận hướng dẫn**
9. **Giảng viên xem chi tiết nhóm ứng viên**
10. **Giảng viên xem các nhóm đang hướng dẫn**
11. **Giảng viên xem danh sách đề tài chờ duyệt**
12. **Giảng viên duyệt đề tài**
13. **Giảng viên từ chối đề tài**
14. **Giảng viên xem tiến trình các nhóm đang hướng dẫn**
15. **Giảng viên xem và đánh dấu đã đọc thông báo**
16. **Đọc audit log theo entity**

### 6.2. Các sơ đồ phụ có thể bổ sung nếu muốn làm đầy báo cáo

Đây là các sơ đồ phụ, phù hợp khi nhóm muốn làm báo cáo dày hơn hoặc chuẩn bị để trả lời câu hỏi mở rộng:

1. **Tải unread badge ở nav**
2. **Chuyển role Sinh viên / Giảng viên**

### 6.3. Tổng hợp toàn bộ phạm vi sequence diagram

Nếu tính cả phần recommended và phần ngoài recommended, có thể chia như sau:

- **Nhóm sơ đồ cốt lõi nên vẽ trước:** 8 sơ đồ
- **Nhóm sơ đồ nên vẽ thêm nếu còn thời gian:** 3 sơ đồ
- **Nhóm sơ đồ ngoài recommended nhưng vẫn có thể vẽ:** 16 sơ đồ
- **Nhóm sơ đồ phụ:** 2 sơ đồ

=> Tổng phạm vi đầy đủ có thể khai thác từ code hiện tại là **29 sơ đồ sequence**.

---

## 7. Đề xuất số lượng sơ đồ nên làm

### Phương án tối thiểu nhưng an toàn
- **8 sequence diagram cốt lõi**

### Phương án đẹp nhất để báo cáo
- **11 sequence diagram**
  - 8 sơ đồ cốt lõi
  - 3 sơ đồ nên vẽ thêm

### Không khuyến khích
- vẽ toàn bộ hơn 20 sơ đồ sequence

---

## 8. Thứ tự ưu tiên để nhóm thực hiện

Nếu chia việc và làm theo độ ưu tiên, nên theo thứ tự này:

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

---

## 9. Gợi ý khi thuyết trình

Khi giảng viên hỏi, nên nhấn mạnh rằng hệ thống có **2 nhánh xử lý đề tài**:

### Nhánh 1 — Nhóm tự đề xuất đề tài
- Sinh viên nhập nội dung đề tài
- Nộp cho giảng viên duyệt
- Giảng viên có thể:
  - duyệt
  - yêu cầu chỉnh sửa
  - từ chối
- Sinh viên chỉnh sửa và nộp lại
- Giảng viên chốt đề tài

### Nhánh 2 — Giảng viên đề xuất đề tài
- Giảng viên tạo đề tài đề xuất cho nhóm
- Sinh viên chọn đề tài đó
- Đề tài vẫn đi vào luồng chờ duyệt
- Sau đó giảng viên tiếp tục duyệt/chốt như bình thường

Đây là điểm khá mạnh của hệ thống, nên nếu có thể hãy vẽ thêm sơ đồ **“Sinh viên chọn đề tài giảng viên đề xuất”**.

---

## 10. Kết luận

Nếu chỉ còn 2 ngày:

- nên vẽ chắc **8 sơ đồ cốt lõi**
- nếu còn thời gian, nâng lên **11 sơ đồ**

Đây là bộ sơ đồ vừa đủ để:

- bám sát code hiện tại
- bám sát nghiệp vụ chính
- đủ tốt để báo cáo và trả lời câu hỏi của giảng viên
