# Báo cáo điều chỉnh thiết kế - Bổ sung BakDb và LogDb

**Sinh viên:** Trần Trường Giang  
**Nhóm/Lớp:** G04 / 2210A02  
**Nghiệp vụ phụ trách:**  
1. **UC-03 - Đăng ký đề tài nghiên cứu**  
2. **UC-04 - Phê duyệt đề tài nghiên cứu**  

**Tài liệu căn cứ:** `TKPM/DHL-SWD.202502.G04.docx`

Trong báo cáo nhóm, mục **2.4.4. Đặc tả chi tiết các System Use Case** ghi rõ phần của Trần Trường Giang là:

```text
(Trần Trường Giang UC-03 → UC-04)
Use Case 03: Đăng ký đề tài nghiên cứu
Use Case 04: Phê duyệt đề tài nghiên cứu
```

Vì vậy, báo cáo điều chỉnh này tập trung vào hai nghiệp vụ trên.

---

## 1. Yêu cầu mới của đề bài

Để tăng tính sẵn sàng của hệ thống, khi có thay đổi dữ liệu trong cơ sở dữ liệu ban đầu, hệ thống cần:

- Lưu trữ song song dữ liệu sang cơ sở dữ liệu thứ 2 có tên **BakDb**.
- Ghi nhật ký thay đổi dữ liệu vào cơ sở dữ liệu thứ 3 có tên **LogDb**.
- Bổ sung chức năng hiển thị lịch sử thay đổi ngay tại màn hình xem chi tiết đối tượng tương ứng.

Áp dụng cho phần nghiệp vụ phụ trách theo UC-03 và UC-04:

- Khi sinh viên/nhóm **đăng ký đề tài nghiên cứu**, bao gồm tự đề xuất đề tài hoặc chọn đề tài giảng viên đề xuất, dữ liệu thay đổi phải được ghi vào:
  - CSDL chính.
  - `BakDb`.
  - `LogDb`.

- Khi giảng viên/cán bộ có thẩm quyền **phê duyệt, yêu cầu chỉnh sửa, từ chối hoặc chốt đề tài nghiên cứu**, dữ liệu thay đổi phải được ghi vào:
  - CSDL chính.
  - `BakDb`.
  - `LogDb`.

---

## 2. Nghiệp vụ phụ trách

## 2.1. UC-03 - Đăng ký đề tài nghiên cứu

### Mô tả nghiệp vụ

Theo báo cáo `DHL-SWD.202502.G04`, UC-03 mô tả nghiệp vụ sinh viên/nhóm đăng ký đề tài nghiên cứu. Nhóm sinh viên sau khi đã có giảng viên hướng dẫn có thể đăng ký đề tài nghiên cứu. Đề tài có thể là:

- đề tài do giảng viên đề xuất,
- đề tài do nhóm tự đề xuất.

Sau khi đăng ký/nộp đề tài, hệ thống tạo hoặc cập nhật bản ghi `DeTaiNghienCuu`, gán:

```text
loaiDeTai = NHOM_DE_XUAT hoặc GIANG_VIEN_DE_XUAT
trangThai = CHO_GIANG_VIEN_DUYET
trangThai nhóm = CHO_DUYET_DE_TAI
```

Đồng thời hệ thống ghi audit log và gửi thông báo cho giảng viên hướng dẫn.

### Đối tượng dữ liệu bị thay đổi

| Đối tượng | Thay đổi chính |
|---|---|
| `DeTaiNghienCuu` | Tạo mới hoặc cập nhật nội dung đề tài |
| `NhomNghienCuu` | Cập nhật trạng thái nhóm sang chờ duyệt đề tài |
| `ThongBao` | Thông báo cho giảng viên có đề tài cần duyệt |
| `NhatKyThayDoi` | Ghi lịch sử thay đổi vào `LogDb` |

---

## 2.2. UC-04 - Phê duyệt đề tài nghiên cứu

### Mô tả nghiệp vụ

Theo báo cáo `DHL-SWD.202502.G04`, UC-04 mô tả nghiệp vụ phê duyệt đề tài nghiên cứu sau khi đề tài được nhóm gửi lên. Giảng viên/cán bộ có thẩm quyền xem đề tài đang chờ duyệt và đưa ra một trong các quyết định:

- phê duyệt đề tài,
- yêu cầu chỉnh sửa,
- từ chối đề tài,
- chốt đề tài sau khi đề tài đã được duyệt.

Sau quyết định, hệ thống cập nhật trạng thái đề tài, trạng thái nhóm, gửi thông báo cho nhóm và ghi nhận lịch sử thay đổi.

### Đối tượng dữ liệu bị thay đổi

| Đối tượng | Thay đổi chính |
|---|---|
| `DeTaiNghienCuu` | Cập nhật trạng thái, nhận xét, hạn chỉnh sửa nếu có |
| `NhomNghienCuu` | Cập nhật trạng thái theo kết quả duyệt |
| `ThongBao` | Thông báo kết quả duyệt cho nhóm |
| `PheDuyetDeTai` | Lưu quyết định phê duyệt/yêu cầu chỉnh sửa/từ chối/chốt |
| `NhatKyThayDoi` | Ghi lịch sử thay đổi vào `LogDb` |

---

## 3. Điều chỉnh kiến trúc dữ liệu

## 3.1. Kiến trúc trước khi điều chỉnh

Trước yêu cầu mới, các thao tác nghiệp vụ chỉ ghi dữ liệu vào cơ sở dữ liệu chính:

```text
Frontend
   ↓
Backend Service
   ↓
MainDb
```

## 3.2. Kiến trúc sau khi điều chỉnh

Sau điều chỉnh, mỗi thao tác làm thay đổi dữ liệu phải ghi nhận vào 3 nơi:

```text
Frontend
   ↓
Backend Service
   ↓
DataChangeCoordinator
   ├── MainDb: lưu dữ liệu nghiệp vụ chính
   ├── BakDb: lưu bản sao dữ liệu sau thay đổi
   └── LogDb: lưu nhật ký thay đổi
```

### Vai trò của từng cơ sở dữ liệu

| Cơ sở dữ liệu | Vai trò |
|---|---|
| `MainDb` | Cơ sở dữ liệu chính, phục vụ vận hành nghiệp vụ |
| `BakDb` | Cơ sở dữ liệu dự phòng, lưu bản sao dữ liệu sau thay đổi |
| `LogDb` | Cơ sở dữ liệu nhật ký, lưu lịch sử thay đổi để truy vết |

---

## 4. Điều chỉnh thiết kế backend

## 4.1. Bổ sung thành phần thiết kế

Để tránh việc mỗi service tự ghi vào nhiều database một cách rời rạc, bổ sung các thành phần sau:

| Thành phần | Trách nhiệm |
|---|---|
| `DataChangeCoordinator` | Điều phối ghi dữ liệu vào `MainDb`, `BakDb`, `LogDb` |
| `BackupRepository` | Ghi bản sao dữ liệu sang `BakDb` |
| `ChangeLogRepository` | Ghi nhật ký thay đổi sang `LogDb` |
| `ChangeHistoryService` | Truy vấn lịch sử thay đổi từ `LogDb` |
| `ChangeHistoryController` | Cung cấp API hiển thị lịch sử thay đổi |

## 4.2. Nguyên tắc xử lý

Khi có thao tác thay đổi dữ liệu:

1. Backend kiểm tra quyền và business rule.
2. Backend ghi thay đổi vào `MainDb`.
3. Backend ghi bản sao dữ liệu mới nhất vào `BakDb`.
4. Backend ghi nhật ký thay đổi vào `LogDb`.
5. Nếu tất cả thành công, trả kết quả thành công cho frontend.
6. Nếu ghi `MainDb` thất bại, không ghi `BakDb` và `LogDb`.
7. Nếu ghi `BakDb` hoặc `LogDb` thất bại, hệ thống phải ghi nhận lỗi và trả thông báo thao tác chưa hoàn tất để tránh sai lệch dữ liệu.

Ghi chú thiết kế: Trong triển khai thực tế, nếu 3 database không hỗ trợ transaction phân tán, có thể dùng cơ chế outbox/retry. Tuy nhiên, trong phạm vi thiết kế môn học, thao tác được mô tả là một quy trình đồng bộ để bảo đảm dễ hiểu và dễ kiểm thử.

---

## 5. Điều chỉnh nghiệp vụ UC-03 - Đăng ký đề tài nghiên cứu

## 5.1. Method bị ảnh hưởng

| Method | Điều chỉnh |
|---|---|
| `nopDeTaiTuDeXuat()` / `nopDeTai()` | Sau khi lưu đề tài tự đề xuất vào `MainDb`, ghi snapshot sang `BakDb` và ghi log `NOP_DE_TAI` sang `LogDb` |
| `chonDeTaiGiangVienDeXuat()` | Khi nhóm chọn đề tài trong danh mục giảng viên, ghi snapshot và log thay đổi |
| `capNhatNoiDungDeTai()` | Khi nhóm sửa/nộp lại đề tài, ghi lại trạng thái trước/sau vào `LogDb` |
| `doiTrangThaiDeTai()` | Khi đổi trạng thái đề tài, ghi bản sao và log thay đổi |
| `capNhatTrangThaiNhom()` | Khi nhóm chuyển sang `CHO_DUYET_DE_TAI`, ghi snapshot nhóm vào `BakDb` |

## 5.2. Luồng xử lý sau điều chỉnh

```text
Sinh viên/Nhóm gửi đề tài tự đề xuất hoặc chọn đề tài giảng viên đề xuất
→ Backend kiểm tra nhóm đã có giảng viên hướng dẫn
→ Backend kiểm tra đề tài hợp lệ
→ Ghi đề tài vào MainDb
→ Cập nhật trạng thái nhóm trong MainDb
→ Ghi bản sao DeTaiNghienCuu và NhomNghienCuu sang BakDb
→ Ghi nhật ký thay đổi vào LogDb
→ Gửi thông báo cho giảng viên
→ Trả kết quả thành công
```

## 5.3. Dữ liệu ghi vào BakDb

`BakDb` lưu bản sao dữ liệu sau thay đổi.

Ví dụ với `DeTaiNghienCuu`:

```json
{
  "entityType": "DeTaiNghienCuu",
  "entityId": "123",
  "snapshot": {
    "tenDeTai": "Hệ thống quản lý nghiên cứu khoa học",
    "trangThai": "CHO_GIANG_VIEN_DUYET",
    "nhomNghienCuuId": "10",
    "giangVienId": "5"
  },
  "backupAt": "2026-05-11T10:00:00"
}
```

## 5.4. Dữ liệu ghi vào LogDb

`LogDb` lưu lịch sử thay đổi.

```json
{
  "actorId": "100",
  "actorRole": "SINH_VIEN",
  "action": "NOP_DE_TAI",
  "entityType": "DeTaiNghienCuu",
  "entityId": "123",
  "oldState": null,
  "newState": {
    "trangThai": "CHO_GIANG_VIEN_DUYET"
  },
  "metadata": {
    "source": "DangKyDeTai"
  },
  "createdAt": "2026-05-11T10:00:00"
}
```

---

## 6. Điều chỉnh nghiệp vụ UC-04 - Phê duyệt đề tài nghiên cứu

## 6.1. Method bị ảnh hưởng

| Method | Điều chỉnh |
|---|---|
| `pheDuyet()` | Ghi trạng thái sau phê duyệt vào `BakDb`, ghi log `DUYET_DE_TAI` vào `LogDb` |
| `yeuCauChinhSua()` | Ghi trạng thái cần chỉnh sửa vào `BakDb`, ghi log `YEU_CAU_CHINH_SUA_DE_TAI` vào `LogDb` |
| `tuChoi()` | Ghi trạng thái từ chối vào `BakDb`, ghi log `TU_CHOI_DE_TAI` vào `LogDb` |
| `chotDeTai()` | Ghi trạng thái chốt vào `BakDb`, ghi log `CHOT_DE_TAI` vào `LogDb` |
| `doiTrangThai()` | Đảm bảo mọi chuyển trạng thái đều tạo snapshot và change log |

## 6.2. Luồng xử lý sau điều chỉnh

```text
Giảng viên/cán bộ có thẩm quyền chọn quyết định
→ Backend kiểm tra quyền duyệt
→ Backend kiểm tra trạng thái đề tài
→ Backend kiểm tra nhận xét/lý do bắt buộc
→ Cập nhật DeTaiNghienCuu trong MainDb
→ Cập nhật NhomNghienCuu trong MainDb
→ Ghi snapshot dữ liệu sau thay đổi vào BakDb
→ Ghi nhật ký thay đổi vào LogDb
→ Gửi thông báo cho nhóm
→ Trả kết quả thành công
```

## 6.3. Ví dụ LogDb khi phê duyệt đề tài

```json
{
  "actorId": "5",
  "actorRole": "GIANG_VIEN",
  "action": "DUYET_DE_TAI",
  "entityType": "DeTaiNghienCuu",
  "entityId": "123",
  "oldState": {
    "trangThai": "CHO_GIANG_VIEN_DUYET"
  },
  "newState": {
    "trangThai": "DA_DUYET",
    "nhanXetGiangVien": "Đề tài phù hợp, đồng ý phê duyệt"
  },
  "metadata": {
    "module": "DuyetDeTai",
    "backupDatabase": "BakDb",
    "logDatabase": "LogDb"
  },
  "createdAt": "2026-05-11T10:15:00"
}
```

---

## 7. Điều chỉnh API

## 7.1. API đăng ký đề tài

API hiện có:

```text
POST /topic-submissions
POST /topic-selections/from-lecturer-proposal
PUT  /topic-submissions/:id
```

Điều chỉnh xử lý nội bộ:

- Ghi dữ liệu chính vào `MainDb`.
- Ghi bản sao sang `BakDb`.
- Ghi nhật ký sang `LogDb`.

Không cần frontend truyền thêm thông tin trạng thái hoặc thông tin database. Backend tự xử lý.

## 7.2. API phê duyệt đề tài

API hiện có:

```text
POST /lecturer/topic-submissions/:id/approve
POST /lecturer/topic-submissions/:id/request-changes
POST /lecturer/topic-submissions/:id/reject
POST /lecturer/topic-submissions/:id/finalize
```

Điều chỉnh xử lý nội bộ:

- Sau khi cập nhật `MainDb`, ghi snapshot sang `BakDb`.
- Ghi lịch sử thay đổi sang `LogDb`.
- Trả response gồm trạng thái mới nhất của đề tài.

## 7.3. API xem lịch sử thay đổi

Bổ sung API:

```text
GET /change-history/:entityType/:entityId
```

Ví dụ:

```text
GET /change-history/DeTaiNghienCuu/123
```

Response:

```json
{
  "success": true,
  "message": "Lấy lịch sử thay đổi thành công",
  "data": [
    {
      "actorId": "5",
      "actorRole": "GIANG_VIEN",
      "action": "DUYET_DE_TAI",
      "entityType": "DeTaiNghienCuu",
      "entityId": "123",
      "oldState": {
        "trangThai": "CHO_GIANG_VIEN_DUYET"
      },
      "newState": {
        "trangThai": "DA_DUYET"
      },
      "createdAt": "2026-05-11T10:15:00"
    }
  ]
}
```

---

## 8. Điều chỉnh frontend

## 8.1. Chức năng xem chi tiết đề tài

Tại màn hình xem chi tiết đề tài của UC-03 và UC-04, bổ sung thêm khu vực:

```text
Lịch sử thay đổi
```

Khu vực này hiển thị:

- thời gian thay đổi,
- người thực hiện,
- vai trò người thực hiện,
- hành động,
- trạng thái trước,
- trạng thái sau,
- ghi chú hoặc nhận xét nếu có.

Đối tượng tương ứng cần hiển thị lịch sử là `DeTaiNghienCuu`. Nếu thao tác đồng thời làm thay đổi `NhomNghienCuu`, lịch sử có thể hiển thị thêm thay đổi trạng thái nhóm trong cùng timeline.

## 8.2. Màn hình đăng ký đề tài

Sau khi nhóm nộp đề tài thành công, màn hình chi tiết đề tài có thể hiển thị lịch sử:

```text
10:00 11/05/2026 - Sinh viên nộp đề tài - NHAP → CHO_GIANG_VIEN_DUYET
```

## 8.3. Màn hình phê duyệt đề tài

Khi giảng viên mở chi tiết đề tài, ngoài nội dung đề tài và nút xử lý, hệ thống hiển thị lịch sử:

```text
10:00 11/05/2026 - Sinh viên nộp đề tài
10:15 11/05/2026 - Giảng viên phê duyệt đề tài
```

Nếu đề tài từng bị yêu cầu chỉnh sửa, lịch sử có thể hiển thị:

```text
10:15 11/05/2026 - Giảng viên yêu cầu chỉnh sửa - CHO_GIANG_VIEN_DUYET → CAN_CHINH_SUA
14:20 11/05/2026 - Nhóm nộp lại đề tài - CAN_CHINH_SUA → CHO_GIANG_VIEN_DUYET
```

---

## 9. Điều chỉnh Class Diagram

## 9.1. Lớp mới cần bổ sung

| Lớp | Thuộc tính chính | Phương thức chính |
|---|---|---|
| `DataChangeCoordinator` | `mainDb`, `bakDb`, `logDb` | `commitChange()`, `backupSnapshot()`, `writeChangeLog()` |
| `BackupRepository` | `bakDbClient` | `saveSnapshot()`, `findSnapshotByEntity()` |
| `ChangeLogRepository` | `logDbClient` | `createChangeLog()`, `findByEntity()` |
| `ChangeHistoryService` | `changeLogRepository` | `getHistoryByEntity()` |
| `ChangeHistoryController` | `changeHistoryService` | `getHistory()` |

## 9.2. Quan hệ với module đăng ký/phê duyệt đề tài

```text
NopDeTaiService
  → DataChangeCoordinator
      → MainDbRepository
      → BackupRepository
      → ChangeLogRepository

DuyetDeTaiService
  → DataChangeCoordinator
      → MainDbRepository
      → BackupRepository
      → ChangeLogRepository

ChangeHistoryController
  → ChangeHistoryService
      → ChangeLogRepository
```

---

## 10. Điều chỉnh Sequence/Activity Diagram

Các sơ đồ cần điều chỉnh hoặc bổ sung:

| Sơ đồ | Nội dung điều chỉnh |
|---|---|
| Activity Diagram đăng ký đề tài | Thêm bước ghi `BakDb` và `LogDb` sau khi ghi `MainDb` |
| Activity Diagram phê duyệt đề tài | Thêm bước ghi `BakDb` và `LogDb` sau khi cập nhật trạng thái |
| Sequence Diagram đăng ký đề tài | Thêm lifeline `BakDb` và `LogDb` |
| Sequence Diagram phê duyệt đề tài | Thêm lifeline `BakDb` và `LogDb` |
| UI Flow xem chi tiết đề tài | Thêm bước gọi API lấy lịch sử thay đổi |

---

## 11. Quy tắc nhất quán dữ liệu

## 11.1. Khi ghi dữ liệu thành công

Một thao tác được xem là hoàn tất khi:

- dữ liệu chính được ghi vào `MainDb`,
- snapshot được ghi vào `BakDb`,
- change log được ghi vào `LogDb`.

## 11.2. Khi ghi dữ liệu thất bại

| Trường hợp | Xử lý |
|---|---|
| Ghi `MainDb` thất bại | Dừng thao tác, không ghi `BakDb`, không ghi `LogDb` |
| Ghi `BakDb` thất bại | Trả lỗi thao tác chưa hoàn tất, ghi nhận lỗi hệ thống |
| Ghi `LogDb` thất bại | Trả lỗi thao tác chưa hoàn tất, yêu cầu retry |

## 11.3. Không để frontend tự ghi LogDb

Frontend không được gọi trực tiếp `LogDb`. Frontend chỉ gọi API nghiệp vụ hoặc API xem lịch sử. Backend chịu trách nhiệm ghi và đọc lịch sử thay đổi.

---

## 12. Kết luận

Với yêu cầu mới, hai nghiệp vụ phụ trách là **đăng ký đề tài nghiên cứu** và **phê duyệt đề tài nghiên cứu** cần được điều chỉnh để mọi thay đổi dữ liệu đều được ghi nhận đồng thời vào:

- `MainDb`: cơ sở dữ liệu vận hành chính,
- `BakDb`: cơ sở dữ liệu dự phòng,
- `LogDb`: cơ sở dữ liệu lịch sử thay đổi.

Ngoài ra, chức năng xem chi tiết đề tài cần bổ sung khu vực **Lịch sử thay đổi** để người dùng theo dõi toàn bộ quá trình thay đổi trạng thái và nội dung đề tài.

Thiết kế này giúp hệ thống:

- tăng tính sẵn sàng,
- hỗ trợ phục hồi dữ liệu,
- tăng khả năng truy vết,
- minh bạch lịch sử xử lý đề tài,
- phù hợp hơn với yêu cầu vận hành hệ thống thực tế.
