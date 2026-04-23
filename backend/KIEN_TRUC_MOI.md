# Kiến trúc Backend - Sau Refactor

## 📐 Cấu trúc theo sơ đồ kiến trúc

Hệ thống đã được refactor để phù hợp với sơ đồ kiến trúc 4 tầng:

```
Application Server
├── API Layer (Nhận request, validate dữ liệu đầu vào)
├── Auth & RBAC Middleware (Xác thực JWT, kiểm tra vai trò/quyền)
├── Business Layer (Services - Logic nghiệp vụ)
└── Data Access Layer (Truy vấn DB, mapping dữ liệu, transaction)
```

---

## 📁 Cấu trúc thư mục mới

### Trước refactor:
```
modules/
  nop-de-tai/
    controllers/          ← API endpoints
    services/             ← Business logic
    repositories/         ← Database queries
    dto/
    types/
    validators/
    policies/
```

### Sau refactor:
```
modules/
  nop-de-tai/
    api-layer/            ← API endpoints (Controller cũ)
    business-layer/       ← Business logic (Service cũ)
    data-access-layer/    ← Database queries (Repository cũ)
    dto/                  ← Giữ nguyên
    types/                ← Giữ nguyên
    validators/           ← Giữ nguyên
    policies/             ← Giữ nguyên
```

---

## 🔄 Mapping chi tiết

| Tầng cũ | Tầng mới | Trách nhiệm | File pattern |
|---|---|---|---|
| **controllers/** | **api-layer/** | - Nhận HTTP request<br>- Validate input (DTO)<br>- Gọi business layer<br>- Trả HTTP response | `*.controller.ts` → `*.api.ts` (có thể đổi tên) |
| **services/** | **business-layer/** | - Logic nghiệp vụ<br>- Orchestration<br>- Kiểm tra business rules<br>- Gọi data access layer | `*.service.ts` (giữ nguyên) |
| **repositories/** | **data-access-layer/** | - Truy vấn Prisma<br>- Mapping dữ liệu<br>- Transaction DB<br>- Không chứa business logic | `*.repository.ts` (giữ nguyên) |

---

## 📦 Các module đã refactor

✅ Tất cả 12 modules đã được refactor:

1. ✅ `dang-ky-mang-nghien-cuu`
2. ✅ `de-tai-de-xuat`
3. ✅ `duyet-de-tai`
4. ✅ `ghep-nhom`
5. ✅ `nguoi-dung`
6. ✅ `nhat-ky-kiem-toan`
7. ✅ `nhom-nghien-cuu`
8. ✅ `nop-de-tai`
9. ✅ `phan-cong-giang-vien`
10. ✅ `thong-bao`
11. ✅ `trang-thai-quy-trinh`
12. ✅ `xac-thuc`

---

## 🎯 Luồng xử lý request

```
Client (Browser)
    ↓ HTTPS (REST/JSON)
┌─────────────────────────────────────────┐
│     Application Server                  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  API Layer                        │ │
│  │  (Nhận request, validate đầu vào) │ │
│  └───────────────┬───────────────────┘ │
│                  ↓                      │
│  ┌───────────────────────────────────┐ │
│  │  Auth & RBAC Middleware           │ │
│  │  (Xác thực JWT, kiểm tra quyền)   │ │
│  └───────────────┬───────────────────┘ │
│                  ↓                      │
│  ┌───────────────────────────────────┐ │
│  │  Business Layer (Services)        │ │
│  │  (Logic nghiệp vụ)                │ │
│  └───────────────┬───────────────────┘ │
│                  ↓                      │
│  ┌───────────────────────────────────┐ │
│  │  Data Access Layer                │ │
│  │  (Truy vấn DB, mapping, trans)    │ │
│  └───────────────┬───────────────────┘ │
└──────────────────┼─────────────────────┘
                   ↓ TCP 5432
         ┌─────────────────┐
         │ Database Server │
         │   PostgreSQL    │
         └─────────────────┘
```

---

## 📝 Ví dụ cụ thể: Module `nop-de-tai`

### 1. API Layer (`api-layer/nop-de-tai.controller.ts`)

```typescript
class NopDeTaiController {
  async nopDeTai(request: Request, response: Response): Promise<Response> {
    // 1. Lấy thông tin user từ request (đã qua middleware)
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    
    // 2. Validate input
    const input = xacThucNopDeTai(request.body);
    
    // 3. Gọi business layer
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const data = await nopDeTaiService.nopDeTai(sinhVien.id, input);
    
    // 4. Trả response
    return sendSuccess(response, {
      statusCode: 201,
      message: 'Nộp đề tài thành công',
      data,
    });
  }
}
```

**Trách nhiệm:**
- ✅ Nhận HTTP request
- ✅ Validate input (DTO)
- ✅ Gọi business layer
- ✅ Trả HTTP response
- ❌ KHÔNG chứa business logic
- ❌ KHÔNG truy vấn database trực tiếp

---

### 2. Business Layer (`business-layer/nop-de-tai.service.ts`)

```typescript
class NopDeTaiService {
  async nopDeTai(sinhVienId: bigint, input: NopDeTaiDto) {
    // 1. Lấy dữ liệu từ data access layer
    const thanhVien = await this.nopDeTaiRepository.timNhomCuaSinhVien(sinhVienId);
    
    // 2. Kiểm tra business rules
    if (!thanhVien) {
      throw new NotFoundError('Sinh viên chưa thuộc nhóm nghiên cứu nào');
    }
    
    const nhom = thanhVien.nhomNghienCuu;
    this.kiemTraNhomCoTheLamDeTai(nhom);
    
    // 3. Thực hiện logic nghiệp vụ với transaction
    const deTaiMoi = await this.prisma.$transaction(async (giaoDich) => {
      if (deTaiHienTai) {
        await this.nopDeTaiRepository.xoaDeTai(deTaiHienTai.id, giaoDich);
      }
      
      const deTai = await this.nopDeTaiRepository.taoDeTai({...}, giaoDich);
      await this.nopDeTaiRepository.capNhatTrangThaiNhom(nhom.id, GroupStatus.CHO_DUYET_DE_TAI, giaoDich);
      
      return deTai;
    });
    
    // 4. Ghi audit log và gửi thông báo
    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({...}),
      thongBaoService.taoNhieuThongBao([...]),
    ]);
    
    return mapDeTai(deTaiMoi);
  }
}
```

**Trách nhiệm:**
- ✅ Logic nghiệp vụ
- ✅ Kiểm tra business rules
- ✅ Orchestration (điều phối các thao tác)
- ✅ Gọi data access layer
- ✅ Quản lý transaction
- ❌ KHÔNG xử lý HTTP request/response
- ❌ KHÔNG viết raw SQL

---

### 3. Data Access Layer (`data-access-layer/nop-de-tai.repository.ts`)

```typescript
class NopDeTaiRepository {
  async timNhomCuaSinhVien(sinhVienId: bigint) {
    return this.prisma.thanhVienNhomNghienCuu.findFirst({
      where: {
        sinhVienId,
        trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
      },
      include: {
        nhomNghienCuu: {
          include: {
            mangNghienCuu: true,
            giangVien: true,
            deTai: true,
            thanhVien: {
              where: { trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN },
              include: { sinhVien: true },
            },
          },
        },
      },
    });
  }
  
  async taoDeTai(duLieu: {...}, coSoDuLieu: CoSoDuLieu) {
    return coSoDuLieu.deTaiNghienCuu.create({
      data: {
        nhomNghienCuuId: duLieu.nhomNghienCuuId,
        giangVienId: duLieu.giangVienId,
        tenDeTai: duLieu.tenDeTai,
        loaiDeTai: TopicSource.NHOM_DE_XUAT,
        trangThai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
        // ...
      },
    });
  }
}
```

**Trách nhiệm:**
- ✅ Truy vấn Prisma
- ✅ Mapping dữ liệu
- ✅ Hỗ trợ transaction (nhận `coSoDuLieu` parameter)
- ❌ KHÔNG chứa business logic
- ❌ KHÔNG kiểm tra business rules

---

## 🔐 Auth & RBAC Middleware

Middleware xác thực và phân quyền nằm trong `common/middlewares/`:

```typescript
// common/middlewares/xu-ly-loi.ts
// common/middlewares/xu-ly-khong-tim-thay.ts
```

Middleware này được áp dụng trước khi request đến API Layer.

---

## ✅ Lợi ích của kiến trúc mới

### 1. **Phù hợp với sơ đồ kiến trúc của thầy**
- Rõ ràng 4 tầng: API Layer → Middleware → Business Layer → Data Access Layer
- Dễ giải thích và bảo vệ

### 2. **Separation of Concerns**
- Mỗi tầng có trách nhiệm rõ ràng
- Dễ maintain và test

### 3. **Scalability**
- Dễ thêm tính năng mới
- Dễ thay đổi implementation của từng tầng

### 4. **Testability**
- Có thể test từng tầng độc lập
- Mock dễ dàng

---

## 🚨 Quy tắc quan trọng

### ❌ KHÔNG ĐƯỢC:

1. **API Layer KHÔNG được:**
   - Chứa business logic
   - Truy vấn database trực tiếp
   - Gọi repository trực tiếp

2. **Business Layer KHÔNG được:**
   - Xử lý HTTP request/response
   - Viết raw SQL
   - Trả về HTTP status code

3. **Data Access Layer KHÔNG được:**
   - Chứa business logic
   - Kiểm tra business rules
   - Gọi service khác

### ✅ NÊN:

1. **API Layer nên:**
   - Validate input
   - Gọi business layer
   - Format response

2. **Business Layer nên:**
   - Kiểm tra business rules
   - Orchestrate các thao tác
   - Quản lý transaction

3. **Data Access Layer nên:**
   - Truy vấn Prisma
   - Mapping dữ liệu
   - Hỗ trợ transaction

---

## 📚 Tài liệu tham khảo

- `AGENTS.md` - Quy định cho coding agent
- `kien_truc_he_thong_lap_trinh.md` - Kiến trúc tổng thể
- `phan_tich_thiet_ke_luong_ung_dung.md` - Phân tích luồng nghiệp vụ

---

**Ngày refactor:** 2026-04-19  
**Người thực hiện:** Kiro AI Agent  
**Trạng thái:** ✅ Hoàn thành
