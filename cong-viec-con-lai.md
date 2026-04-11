# Công việc còn lại để tiến tới hoàn thiện hệ thống

## Nguyên tắc đánh giá

- Chỉ tính các phần nằm trong phạm vi tài liệu hiện có và UI mockup hiện có.
- Không tự ý thay đổi DB/schema/migration.
- Ưu tiên các việc có thể hoàn thành bằng code hiện tại, không cần xác nhận thêm.

## Đã hoàn thành gần đây

- Dropdown chọn tài khoản sinh viên / giảng viên từ DB thật.
- Phân quyền giao diện theo vai trò.
- Các luồng sinh viên chính: đăng ký mảng, nhóm nghiên cứu, ghép nhóm, nộp/chỉnh sửa đề tài.
- Các luồng giảng viên chính: chọn nhóm hướng dẫn, nhóm đang hướng dẫn, duyệt đề tài, tiến trình.
- Thông báo và tiến trình cho sinh viên / giảng viên.
- Backend/Frontend cho `lecturer-current` và `lecturer-progress`.
- Sửa quy ước tên file backend sang kebab tiếng Việt ở các file đã phát hiện sai.

## Việc còn lại có thể làm ngay (không cần đổi schema)

### Ưu tiên cao

1. **Hoàn thiện luồng đề tài giảng viên đề xuất**
   - Backend: thêm API đọc danh sách đề tài đề xuất cho nhóm/sinh viên.
   - Backend: thêm API để nhóm chọn một đề tài giảng viên đề xuất.
   - Frontend: thêm giao diện chọn từ đề tài giảng viên đề xuất trong màn đề tài sinh viên.

2. **Mở API đọc nhật ký kiểm toán**
   - Backend: thêm `GET /api/audit-logs/:entityType/:entityId` hoặc path tương đương trong module `nhat-ky-kiem-toan`.
   - Có thể dùng cho timeline/debug/truy vết nghiệp vụ.

3. **Cleanup backend rõ ràng**
   - Xóa mount route trùng trong `backend/src/modules/index.ts`.
   - Thay các hard-coded enum/string còn sót bằng constants/enums.

### Ưu tiên trung bình

4. **Hoàn thiện nút “Chốt đề tài” ở frontend giảng viên**
   - Backend đã có route.
   - Frontend cần nút thao tác đúng theo trạng thái `DA_DUYET`.

5. **Chuẩn hóa hiển thị trạng thái ở frontend**
   - Một số chỗ còn hiển thị raw enum string thay vì label tiếng Việt dễ hiểu.

6. **Bổ sung giao diện đọc nhật ký kiểm toán**
   - Sau khi có API read, có thể gắn vào timeline hoặc màn chi tiết liên quan.

## Việc còn thiếu nhưng hiện xem là blocked / ngoài phạm vi an toàn

1. **Auth thật (`xac-thuc`)**
   - Hiện module còn stub.
   - Nếu làm đúng nghĩa sẽ mở rộng phạm vi lớn hơn đáng kể.

2. **Admin dashboard thật**
   - Hiện vẫn là placeholder.
   - Cần chốt scope chức năng quản trị trước khi làm sâu.

3. **Các thay đổi schema theo đúng thiết kế lý tưởng**
   - Ví dụ version lịch sử đề tài/review entity riêng/registration period riêng.
   - Không được tự làm khi chưa có xác nhận.

## Thứ tự thực hiện đề xuất

1. Cleanup backend bắt buộc.
2. Luồng đề tài giảng viên đề xuất full-stack.
3. API đọc nhật ký kiểm toán.
4. Nút chốt đề tài ở frontend.
5. Chuẩn hóa status labels / UI consistency.

## Mục tiêu thực tế của đợt này

Mục tiêu khả thi là đưa hệ thống tới mức **hoàn thiện tối đa trong phạm vi tài liệu + schema hiện tại**, chứ không phải mở rộng thêm scope mới như auth thật hoặc thay schema DB.
