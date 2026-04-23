# Kế hoạch Refactor Kiến trúc Backend

## Mục tiêu
Refactor cấu trúc backend từ:
```
controllers/
services/
repositories/
```

Sang cấu trúc theo sơ đồ kiến trúc:
```
api-layer/          (API Layer - Nhận request, validate dữ liệu đầu vào)
middlewares/        (Auth & RBAC Middleware - Xác thực JWT, kiểm tra vai trò/quyền)
business-layer/     (Business Layer - Services - Logic nghiệp vụ)
data-access-layer/  (Data Access Layer - Truy vấn DB, mapping, transaction)
```

## Cấu trúc mới cho mỗi module

```
modules/
  nop-de-tai/
    api-layer/
      nop-de-tai.api.ts              ← Controller cũ (đổi tên)
    middlewares/
      nop-de-tai.middleware.ts       ← Middleware riêng cho module (nếu cần)
    business-layer/
      nop-de-tai.service.ts          ← Service cũ (giữ nguyên logic)
    data-access-layer/
      nop-de-tai.repository.ts       ← Repository cũ (đổi tên)
    dto/
      nop-de-tai.dto.ts
      cap-nhat-de-tai.dto.ts
    types/
      nop-de-tai.types.ts
    validators/
      nop-de-tai.validator.ts
    policies/
      nop-de-tai.policy.ts
    index.ts
```

## Mapping chi tiết

| Cũ | Mới | Mô tả |
|---|---|---|
| `controllers/` | `api-layer/` | Nhận request, validate đầu vào, gọi business layer |
| `services/` | `business-layer/` | Logic nghiệp vụ, orchestration |
| `repositories/` | `data-access-layer/` | Truy vấn DB, mapping dữ liệu, transaction |
| `middlewares/` (common) | `middlewares/` (common) | Auth, RBAC, error handling |

## Thứ tự thực hiện

1. ✅ Tạo kế hoạch refactor
2. Refactor module `nop-de-tai` (làm mẫu)
3. Refactor các module còn lại theo mẫu
4. Cập nhật import paths
5. Test lại toàn bộ

## Lưu ý quan trọng

- **KHÔNG thay đổi logic nghiệp vụ** - chỉ di chuyển và đổi tên
- **KHÔNG sửa database** - chỉ refactor code
- Giữ nguyên DTO, types, validators, policies
- Cập nhật import paths sau khi di chuyển
- Test từng module sau khi refactor
