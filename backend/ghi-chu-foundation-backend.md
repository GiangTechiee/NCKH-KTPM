# Ghi chú foundation backend

Phần foundation backend đã được chuẩn hóa ở mức an toàn mà không thay đổi database/schema:

- Bổ sung exception dùng chung cho các lỗi nghiệp vụ phổ biến.
- Bổ sung constants cho workflow transition và audit action.
- Bổ sung utility `async-handler` cho controller bất đồng bộ.
- Dựng khung thư mục chuẩn cho 12 module theo kiến trúc:
  - `controllers/`
  - `services/`
  - `repositories/`
  - `dto/`
  - `policies/`
  - `validators/`
  - `types/`

## Các điểm còn bị chặn

1. Chuyển backend sang TypeScript
   - Chỉ làm khi chủ dự án xác nhận.

2. Chuẩn trạng thái giữa code và database
   - Enum trong code đang theo tài liệu nghiệp vụ.
   - Database hiện có dấu hiệu dùng giá trị trạng thái khác.
   - Không được triển khai service/repository nghiệp vụ ghi trạng thái trước khi xác nhận chuẩn dùng chung.

3. Các bảng còn thiếu cho luồng hoàn chỉnh
   - `GroupInvitation`
   - `AuditLog`
   - `Notification`

Theo `AGENTS.md`, các mục trên cần xác nhận trước khi sửa database/schema.
