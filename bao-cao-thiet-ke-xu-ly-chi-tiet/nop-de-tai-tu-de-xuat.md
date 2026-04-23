# 4.3.2. Chức năng "Sinh viên nộp đề tài tự đề xuất"

- **Input:** maSinhVien, tenDeTai, moTaVanDe, mucTieuNghienCuu, ungDungThucTien, phamViNghienCuu, congNgheSuDung, lyDoLuaChon, xacNhanChuyenDeTai
- **Output:** Thông báo "Nộp đề tài thành công" hoặc thông báo lỗi tương ứng
- **Process:**
  + Vào màn hình "Tự đề xuất đề tài".
  + Sinh viên nhập thông tin đề tài và nhấn nút "Gửi giảng viên duyệt".
  + Hệ thống lấy mã sinh viên từ request, kiểm tra dữ liệu đầu vào và đối chiếu thông tin sinh viên trong hệ thống.
  + Hệ thống kiểm tra sinh viên đã thuộc nhóm nghiên cứu hay chưa, nhóm đã có giảng viên hướng dẫn hay chưa và nhóm có còn được phép làm đề tài hay không.
  + Hệ thống kiểm tra nhóm hiện tại đã có đề tài chưa. Nếu chưa có đề tài, hệ thống tạo đề tài mới với loại đề tài `NHOM_DE_XUAT`, cập nhật trạng thái nhóm sang `CHO_DUYET_DE_TAI`, ghi nhật ký kiểm toán và tạo thông báo cho giảng viên.
    - Nếu sinh viên chưa thuộc nhóm, hệ thống hiển thị thông báo lỗi tương ứng.
    - Nếu nhóm chưa có giảng viên hướng dẫn, hệ thống hiển thị thông báo `GROUP_HAS_NO_LECTURER`.
    - Nếu nhóm đã chốt đề tài, hệ thống hiển thị thông báo `TOPIC_ALREADY_FINALIZED`.
    - Nếu nhóm đã có đề tài tự đề xuất, hệ thống hiển thị thông báo `TOPIC_ALREADY_EXISTS`.
    - Nếu đang chuyển từ đề tài giảng viên đề xuất nhưng chưa xác nhận chuyển, hệ thống hiển thị thông báo `TOPIC_SWITCH_CONFIRMATION_REQUIRED`.
    - Nếu đề tài cũ không còn được phép chuyển hoặc đã hết hạn chỉnh sửa, hệ thống hiển thị thông báo lỗi tương ứng.

## 4.3.2.1. Sơ đồ tuần tự

```mermaid
sequenceDiagram
  actor SinhVien as Sinh viên
  participant NopDeTaiAPI as API Layer<br/>NopDeTaiAPI
  participant nguoiDungService as Business Layer<br/>NguoiDungService
  participant nopDeTaiService as Business Layer<br/>NopDeTaiService
  participant NopDeTaiDataAccess as Data Access Layer<br/>NopDeTaiDataAccess
  participant PrismaDB as Database<br/>Prisma/PostgreSQL
  participant nhatKyKiemToanService as Business Layer<br/>NhatKyKiemToanService
  participant thongBaoService as Business Layer<br/>ThongBaoService

  SinhVien->>NopDeTaiAPI: POST /api/nop-de-tai
  activate NopDeTaiAPI
  Note over NopDeTaiAPI: layMaSinhVienTuYeuCau(request)<br/>xacThucNopDeTai(request.body)

  NopDeTaiAPI->>nguoiDungService: laySinhVienTheoMa(maSinhVien)
  activate nguoiDungService
  nguoiDungService-->>NopDeTaiAPI: sinhVien
  deactivate nguoiDungService

  NopDeTaiAPI->>nopDeTaiService: nopDeTai(sinhVien.id, input)
  activate nopDeTaiService

  nopDeTaiService->>NopDeTaiDataAccess: timNhomCuaSinhVien(sinhVienId)
  activate NopDeTaiDataAccess
  NopDeTaiDataAccess->>PrismaDB: findFirst()
  activate PrismaDB
  PrismaDB-->>NopDeTaiDataAccess: nhomNghienCuu
  deactivate PrismaDB
  NopDeTaiDataAccess-->>nopDeTaiService: nhomNghienCuu
  deactivate NopDeTaiDataAccess

  Note over nopDeTaiService: Kiểm tra nhóm có giảng viên<br/>Kiểm tra trạng thái đề tài hiện tại<br/>Kiểm tra quyền chuyển đề tài nếu có

  rect rgba(220, 235, 255, 0.6)
    Note over nopDeTaiService,PrismaDB: Transaction
    opt Chuyển từ đề tài giảng viên đề xuất
      nopDeTaiService->>NopDeTaiDataAccess: xoaDeTai(deTaiHienTai.id)
      activate NopDeTaiDataAccess
      NopDeTaiDataAccess->>PrismaDB: delete()
      activate PrismaDB
      PrismaDB-->>NopDeTaiDataAccess: OK
      deactivate PrismaDB
      NopDeTaiDataAccess-->>nopDeTaiService: OK
      deactivate NopDeTaiDataAccess
    end

    nopDeTaiService->>NopDeTaiDataAccess: taoDeTai(...)
    activate NopDeTaiDataAccess
    NopDeTaiDataAccess->>PrismaDB: create()
    activate PrismaDB
    PrismaDB-->>NopDeTaiDataAccess: deTaiMoi
    deactivate PrismaDB
    NopDeTaiDataAccess-->>nopDeTaiService: deTaiMoi
    deactivate NopDeTaiDataAccess

    nopDeTaiService->>NopDeTaiDataAccess: capNhatTrangThaiNhom(nhomId, CHO_DUYET_DE_TAI)
    activate NopDeTaiDataAccess
    NopDeTaiDataAccess->>PrismaDB: update()
    activate PrismaDB
    PrismaDB-->>NopDeTaiDataAccess: nhomDaCapNhat
    deactivate PrismaDB
    NopDeTaiDataAccess-->>nopDeTaiService: nhomDaCapNhat
    deactivate NopDeTaiDataAccess
  end

  par Ghi audit log
    nopDeTaiService->>nhatKyKiemToanService: taoBanGhi(NOP_DE_TAI)
    activate nhatKyKiemToanService
    nhatKyKiemToanService->>PrismaDB: create audit log
    activate PrismaDB
    PrismaDB-->>nhatKyKiemToanService: OK
    deactivate PrismaDB
    nhatKyKiemToanService-->>nopDeTaiService: OK
    deactivate nhatKyKiemToanService
  and Gửi thông báo
    nopDeTaiService->>thongBaoService: taoNhieuThongBao([NHOM_NOP_DE_TAI])
    activate thongBaoService
    thongBaoService->>PrismaDB: create notifications
    activate PrismaDB
    PrismaDB-->>thongBaoService: OK
    deactivate PrismaDB
    thongBaoService-->>nopDeTaiService: OK
    deactivate thongBaoService
  end

  nopDeTaiService-->>NopDeTaiAPI: DeTaiTomTatResponse
  deactivate nopDeTaiService
  NopDeTaiAPI-->>SinhVien: 201 Nộp đề tài thành công
  deactivate NopDeTaiAPI
```

## 4.3.2.2. Các unit cần cho chức năng "Sinh viên nộp đề tài tự đề xuất"

- **Dữ liệu**

| STT | Tên | Kiểu dữ liệu | Mô tả |
|-----|-----|--------------|-------|
| 1 | maSinhVien | string | Mã sinh viên gửi trong header `x-ma-sinh-vien` |
| 2 | sinhVienId | bigint | Định danh sinh viên trong hệ thống |
| 3 | tenDeTai | string | Tên đề tài tự đề xuất |
| 4 | moTaVanDe | string | Mô tả vấn đề nghiên cứu |
| 5 | mucTieuNghienCuu | string | Mục tiêu nghiên cứu của đề tài |
| 6 | xacNhanChuyenDeTai | boolean | Xác nhận chuyển từ đề tài giảng viên đề xuất sang đề tài tự đề xuất |
| 7 | nhomNghienCuu | NhomNghienCuu | Nhóm nghiên cứu hiện tại của sinh viên |
| 8 | deTaiMoi | DeTaiTomTatResponse | Đề tài mới được tạo |

- **Unit cần thiết (theo kiến trúc 4 tầng)**

| STT | Tầng | Class | Method | Input | Output |
|-----|------|-------|--------|-------|--------|
| 1 | API Layer | NopDeTaiAPI | nopDeTai(request, response) | request, response | 201: Nộp đề tài thành công |
| 2 | Business Layer | NguoiDungService | laySinhVienTheoMa(maSinhVien) | maSinhVien | sinhVien |
| 3 | Business Layer | NopDeTaiService | nopDeTai(sinhVienId, input) | sinhVienId, input | DeTaiTomTatResponse |
| 4 | Data Access Layer | NopDeTaiDataAccess | timNhomCuaSinhVien(sinhVienId) | sinhVienId | nhomNghienCuu |
| 5 | Data Access Layer | NopDeTaiDataAccess | xoaDeTai(deTaiId) | deTaiId | OK |
| 6 | Data Access Layer | NopDeTaiDataAccess | taoDeTai(input) | input | deTaiMoi |
| 7 | Data Access Layer | NopDeTaiDataAccess | capNhatTrangThaiNhom(nhomId, trangThaiMoi) | nhomId, trangThaiMoi | nhomDaCapNhat |
| 8 | Business Layer | NhatKyKiemToanService | taoBanGhi(input) | input | Ghi audit log thành công |
| 9 | Business Layer | ThongBaoService | taoNhieuThongBao(danhSachThongBao) | danhSachThongBao | Tạo thông báo thành công |

**Mapping với code thực tế:**
- `NopDeTaiAPI` → `backend/src/modules/nop-de-tai/api-layer/nop-de-tai.controller.ts`
- `NguoiDungService` → `backend/src/modules/nguoi-dung/business-layer/nguoi-dung.service.ts`
- `NopDeTaiService` → `backend/src/modules/nop-de-tai/business-layer/nop-de-tai.service.ts`
- `NopDeTaiDataAccess` → `backend/src/modules/nop-de-tai/data-access-layer/nop-de-tai.repository.ts`
- `NhatKyKiemToanService` → `backend/src/modules/nhat-ky-kiem-toan/business-layer/nhat-ky-kiem-toan.service.ts`
- `ThongBaoService` → `backend/src/modules/thong-bao/business-layer/thong-bao.service.ts`

## 4.3.2.3. Activity cho `xacThucNopDeTai()`

```mermaid
flowchart TD
    A[Bắt đầu] --> B[Nhận request body]
    B --> C{Body có tồn tại và là object?}
    C -- Không --> D[Throw ValidationError BODY_REQUIRED]
    C -- Có --> E[Kiểm tra tenDeTai]
    E --> F[Kiểm tra moTaVanDe]
    F --> G[Kiểm tra mucTieuNghienCuu]
    G --> H[Chuẩn hóa các trường tùy chọn]
    H --> I[Trả về NopDeTaiDto]
    I --> J[Kết thúc]
```

## 4.3.2.4. Activity cho `nguoiDungService::laySinhVienTheoMa(maSinhVien)`

```mermaid
flowchart TD
    A[Bắt đầu] --> B[Nhận maSinhVien]
    B --> C[Truy vấn sinh viên theo mã]
    C --> D{Có tìm thấy sinh viên không?}
    D -- Không --> E[Throw NotFoundError STUDENT_NOT_FOUND]
    D -- Có --> F[Trả về sinhVien]
    F --> G[Kết thúc]
```

## 4.3.2.5. Activity cho `nopDeTaiService::nopDeTai(sinhVienId, input)`

```mermaid
flowchart TD
    A[Bắt đầu] --> B[Tìm nhóm của sinh viên]
    B --> C{Sinh viên đã thuộc nhóm?}
    C -- Không --> D[Throw NotFoundError]
    C -- Có --> E[Kiểm tra nhóm có giảng viên hướng dẫn]
    E --> F{Nhóm có giảng viên?}
    F -- Không --> G[Throw GROUP_HAS_NO_LECTURER]
    F -- Có --> H{Nhóm đã chốt đề tài?}
    H -- Có --> I[Throw TOPIC_ALREADY_FINALIZED]
    H -- Không --> J[Kiểm tra đề tài hiện tại]
    J --> K{Đã có đề tài tự đề xuất?}
    K -- Có --> L[Throw TOPIC_ALREADY_EXISTS]
    K -- Không --> M{Đang chuyển từ đề tài giảng viên đề xuất?}
    M -- Có --> N[Kiểm tra trạng thái được phép chuyển]
    N --> O[Kiểm tra hạn chỉnh sửa]
    O --> P[Kiểm tra xacNhanChuyenDeTai]
    P --> Q[Xóa đề tài cũ nếu hợp lệ]
    M -- Không --> R[Tạo đề tài mới]
    Q --> R[Tạo đề tài mới]
    R --> S[Cập nhật trạng thái nhóm]
    S --> T[Ghi audit log và tạo thông báo]
    T --> U[Trả về DeTaiTomTatResponse]
    U --> V[Kết thúc]
```

## 4.3.2.6. Activity cho `NopDeTaiDataAccess::taoDeTai(input)`

```mermaid
flowchart TD
    A[Bắt đầu] --> B[Nhận dữ liệu đề tài mới]
    B --> C[Tạo bản ghi deTaiNghienCuu]
    C --> D[Gán loaiDeTai là NHOM_DE_XUAT]
    D --> E[Gán trangThai là CHO_GIANG_VIEN_DUYET]
    E --> F[Lưu dữ liệu vào Prisma/PostgreSQL]
    F --> G[Trả về deTaiMoi]
    G --> H[Kết thúc]
```

## 4.3.2.7. Activity cho `NopDeTaiDataAccess::capNhatTrangThaiNhom(nhomId, trangThaiMoi)`

```mermaid
flowchart TD
    A[Bắt đầu] --> B[Nhận nhomId và trangThaiMoi]
    B --> C[Cập nhật nhóm nghiên cứu]
    C --> D[Đặt trạng thái nhóm là CHO_DUYET_DE_TAI]
    D --> E[Lưu dữ liệu vào Prisma/PostgreSQL]
    E --> F[Trả về nhomDaCapNhat]
    F --> G[Kết thúc]
```

## 4.3.2.8. Ghi chú đối chiếu mã nguồn (Kiến trúc 4 tầng)

### Cấu trúc theo kiến trúc mới:

**API Layer (Nhận request, validate dữ liệu đầu vào):**
- Route: `backend/src/modules/nop-de-tai/index.ts`
- Controller: `backend/src/modules/nop-de-tai/api-layer/nop-de-tai.controller.ts`
- Validator: `backend/src/modules/nop-de-tai/validators/nop-de-tai.validator.ts`
- DTO: `backend/src/modules/nop-de-tai/dto/nop-de-tai.dto.ts`

**Business Layer (Logic nghiệp vụ):**
- Service chính: `backend/src/modules/nop-de-tai/business-layer/nop-de-tai.service.ts`
- Dịch vụ tra cứu sinh viên: `backend/src/modules/nguoi-dung/business-layer/nguoi-dung.service.ts`
- Audit log service: `backend/src/modules/nhat-ky-kiem-toan/business-layer/nhat-ky-kiem-toan.service.ts`
- Notification service: `backend/src/modules/thong-bao/business-layer/thong-bao.service.ts`

**Data Access Layer (Truy vấn DB, mapping dữ liệu, transaction):**
- Repository: `backend/src/modules/nop-de-tai/data-access-layer/nop-de-tai.repository.ts`

**Middleware (Xác thực JWT, kiểm tra vai trò/quyền):**
- Error handler: `backend/src/common/middlewares/xu-ly-loi.ts`
- Not found handler: `backend/src/common/middlewares/xu-ly-khong-tim-thay.ts`

### Luồng xử lý request:

```
Client → API Layer → Middleware → Business Layer → Data Access Layer → Database
```

1. **API Layer** nhận request, validate input
2. **Middleware** xác thực JWT, kiểm tra quyền
3. **Business Layer** xử lý logic nghiệp vụ
4. **Data Access Layer** truy vấn database
5. **Database** (PostgreSQL via Prisma)
