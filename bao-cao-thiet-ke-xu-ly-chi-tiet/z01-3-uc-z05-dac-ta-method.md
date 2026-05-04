# Bài tập Z01.3 - Thiết kế chi tiết đơn vị xử lý

**Sinh viên:** Trần Trường Giang  
**Nhóm/Lớp:** G04 / 2210A02  
**System Use Case được chọn:** UC-Z05 - Ghi nhận quyết định và lý do phê duyệt  
**Business Use Case tương ứng:** BUC_Z01 - Phân tích xu hướng và Đề xuất tối ưu hóa vận hành

---

## 1. Phạm vi thiết kế

Tài liệu này thiết kế chi tiết các đơn vị xử lý phục vụ hoạt động hoàn chỉnh của UC-Z05: cán bộ quản lý khoa học hoặc người có thẩm quyền mở hồ sơ đề xuất/đề tài đang chờ xem xét, chọn quyết định, nhập lý do hoặc nhận xét, sau đó hệ thống kiểm tra tính hợp lệ, lưu quyết định, cập nhật trạng thái liên quan và ghi nhật ký truy vết.

Dựa trên Class Diagram ở bài Z01.2, các lớp và phương thức được dùng trong UC-Z05 gồm:

| STT | Lớp | Phương thức | Vai trò trong UC-Z05 |
|---|---|---|---|
| 1 | `PheDuyetDeTai` | `batBuocCoNhanXet()` | Kiểm tra quyết định có bắt buộc nhập nhận xét/lý do hay không |
| 2 | `PheDuyetDeTai` | `pheDuyet()` | Ghi nhận quyết định phê duyệt |
| 3 | `PheDuyetDeTai` | `tuChoi()` | Ghi nhận quyết định từ chối |
| 4 | `PheDuyetDeTai` | `yeuCauChinhSua()` | Ghi nhận quyết định yêu cầu chỉnh sửa/chưa duyệt ngay |
| 5 | `DeTaiNghienCuu` | `doiTrangThai()` | Cập nhật trạng thái đề tài sau quyết định |
| 6 | `NhatKyKiemToan` | `ghiLog()` | Ghi nhật ký truy vết thao tác phê duyệt |
| 7 | `ThongBao` | `gui()` | Gửi thông báo sau khi quyết định được ghi nhận thành công |

Ghi chú: Trong đặc tả UC-Z05 ở bài Z01.1 có nhắc đến các quyết định "phê duyệt", "từ chối" và "trì hoãn". Với Class Diagram hiện tại, phương thức tương ứng gần nhất với trường hợp "trì hoãn/chưa phê duyệt ngay" là `yeuCauChinhSua()`.

---

## 2. Quy ước dữ liệu dùng chung

### 2.1. Kiểu dữ liệu giả định

| Tên | Ý nghĩa |
|---|---|
| `BIGINT` | Mã định danh của bản ghi |
| `TEXT` | Chuỗi văn bản dài |
| `BOOLEAN` | Giá trị đúng/sai |
| `DATETIME` | Thời điểm thực hiện |
| `JSON` | Dữ liệu có cấu trúc |
| `ENUM` | Tập giá trị cố định |

### 2.2. Enum quyết định phê duyệt

```text
QuyetDinhPheDuyet = {
  PHE_DUYET,
  YEU_CAU_CHINH_SUA,
  TU_CHOI
}
```

### 2.3. Enum trạng thái đề tài

```text
TrangThaiDeTai = {
  CHO_DUYET,
  CAN_CHINH_SUA,
  DA_DUYET,
  TU_CHOI
}
```

---

## 3. Đặc tả chi tiết các phương thức

## 3.1. Method `PheDuyetDeTai.batBuocCoNhanXet()`

### Đặc tả

| Mục | Nội dung |
|---|---|
| **Purpose** | Kiểm tra quyết định phê duyệt có bắt buộc phải nhập nhận xét hoặc lý do hay không. |
| **Pre-Condition** | Quyết định phê duyệt đã được người dùng chọn. |
| **Input** | `quyetDinh: QuyetDinhPheDuyet`; `nhanXet: TEXT`; `lyDo: TEXT` |
| **Output** | `BOOLEAN`; trả về `true` nếu dữ liệu hợp lệ, trả về `false` nếu thiếu nhận xét/lý do bắt buộc. |
| **Post-Condition** | Hệ thống xác định được dữ liệu nhận xét/lý do có đủ điều kiện để tiếp tục lưu quyết định hay không. |

### Logic xử lý

```text
Start
  Nhận quyetDinh, nhanXet, lyDo
  Nếu quyetDinh = YEU_CAU_CHINH_SUA hoặc quyetDinh = TU_CHOI
    Nếu nhanXet rỗng và lyDo rỗng
      Trả về false
    Ngược lại
      Trả về true
  Ngược lại nếu quyetDinh = PHE_DUYET
    Nếu nhanXet rỗng
      Trả về false
    Ngược lại
      Trả về true
End
```

### Đánh giá chất lượng thiết kế

| Tiêu chí | Đánh giá |
|---|---|
| **Cyclomatic Complexity - V(G)** | Có 3 điểm rẽ nhánh chính: kiểm tra loại quyết định, kiểm tra rỗng khi yêu cầu chỉnh sửa/từ chối, kiểm tra rỗng khi phê duyệt. V(G) = 3 + 1 = 4. |
| **Nhận xét V(G)** | V(G) = 4, nhỏ hơn 10, không cần phân rã thêm. |
| **SRP** | Phương thức chỉ có một nhiệm vụ: kiểm tra tính bắt buộc của nhận xét/lý do. Phương thức không lưu dữ liệu, không cập nhật trạng thái, không gửi thông báo. |

---

## 3.2. Method `PheDuyetDeTai.pheDuyet()`

### Đặc tả

| Mục | Nội dung |
|---|---|
| **Purpose** | Ghi nhận quyết định phê duyệt đề tài/hồ sơ đề xuất khi người có thẩm quyền chọn phê duyệt. |
| **Pre-Condition** | Hồ sơ đề tài tồn tại; đề tài đang ở trạng thái `CHO_DUYET`; người duyệt có quyền phê duyệt; nhận xét phê duyệt đã được nhập hợp lệ. |
| **Input** | `deTaiNghienCuuId: BIGINT`; `nguoiDuyetGiangVienId: BIGINT`; `nhanXet: TEXT`; `thoiDiemPheDuyet: DATETIME` |
| **Output** | `PheDuyetDeTai`; bản ghi phê duyệt đã được tạo/cập nhật. |
| **Post-Condition** | Quyết định `PHE_DUYET` được lưu; đề tài được chuyển sang trạng thái `DA_DUYET`; nhật ký truy vết và thông báo được tạo ở các bước xử lý sau. |

### Logic xử lý

```text
Start
  Nhận deTaiNghienCuuId, nguoiDuyetGiangVienId, nhanXet
  Tìm hồ sơ đề tài theo deTaiNghienCuuId
  Nếu không tìm thấy đề tài
    Trả về lỗi "Không tìm thấy đề tài"
  Kiểm tra trạng thái đề tài
  Nếu trạng thái khác CHO_DUYET
    Trả về lỗi "Đề tài không ở trạng thái chờ duyệt"
  Kiểm tra quyền người duyệt
  Nếu người duyệt không có quyền
    Trả về lỗi "Không có quyền phê duyệt"
  Gọi batBuocCoNhanXet(PHE_DUYET, nhanXet, null)
  Nếu nhận xét không hợp lệ
    Trả về lỗi "Vui lòng nhập nhận xét phê duyệt"
  Lưu bản ghi phê duyệt với quyết định PHE_DUYET
  Gọi DeTaiNghienCuu.doiTrangThai(DA_DUYET)
  Gọi NhatKyKiemToan.ghiLog()
  Gọi ThongBao.gui()
  Trả về bản ghi phê duyệt
End
```

### Đánh giá chất lượng thiết kế

| Tiêu chí | Đánh giá |
|---|---|
| **Cyclomatic Complexity - V(G)** | Có 4 điểm rẽ nhánh: đề tài tồn tại, trạng thái hợp lệ, quyền hợp lệ, nhận xét hợp lệ. V(G) = 4 + 1 = 5. |
| **Nhận xét V(G)** | V(G) = 5, nhỏ hơn 10, logic có thể kiểm thử được. |
| **SRP** | Phương thức tập trung vào nghiệp vụ ghi nhận quyết định phê duyệt. Các việc phụ như đổi trạng thái, ghi log, gửi thông báo được ủy quyền cho các phương thức chuyên trách. |

---

## 3.3. Method `PheDuyetDeTai.tuChoi()`

### Đặc tả

| Mục | Nội dung |
|---|---|
| **Purpose** | Ghi nhận quyết định từ chối đề tài/hồ sơ đề xuất khi người có thẩm quyền không chấp nhận nội dung được gửi. |
| **Pre-Condition** | Hồ sơ đề tài tồn tại; đề tài đang ở trạng thái `CHO_DUYET`; người duyệt có quyền từ chối; lý do từ chối không được rỗng. |
| **Input** | `deTaiNghienCuuId: BIGINT`; `nguoiDuyetGiangVienId: BIGINT`; `lyDo: TEXT`; `nhanXet: TEXT`; `thoiDiemTuChoi: DATETIME` |
| **Output** | `PheDuyetDeTai`; bản ghi quyết định từ chối đã được tạo/cập nhật. |
| **Post-Condition** | Quyết định `TU_CHOI` được lưu; đề tài được chuyển sang trạng thái `TU_CHOI`; nhật ký truy vết và thông báo được tạo ở các bước xử lý sau. |

### Logic xử lý

```text
Start
  Nhận deTaiNghienCuuId, nguoiDuyetGiangVienId, lyDo, nhanXet
  Tìm hồ sơ đề tài theo deTaiNghienCuuId
  Nếu không tìm thấy đề tài
    Trả về lỗi "Không tìm thấy đề tài"
  Kiểm tra trạng thái đề tài
  Nếu trạng thái khác CHO_DUYET
    Trả về lỗi "Đề tài không ở trạng thái chờ duyệt"
  Kiểm tra quyền người duyệt
  Nếu người duyệt không có quyền
    Trả về lỗi "Không có quyền từ chối"
  Gọi batBuocCoNhanXet(TU_CHOI, nhanXet, lyDo)
  Nếu lý do/nhận xét không hợp lệ
    Trả về lỗi "Vui lòng nhập lý do từ chối"
  Lưu bản ghi phê duyệt với quyết định TU_CHOI
  Gọi DeTaiNghienCuu.doiTrangThai(TU_CHOI)
  Gọi NhatKyKiemToan.ghiLog()
  Gọi ThongBao.gui()
  Trả về bản ghi từ chối
End
```

### Đánh giá chất lượng thiết kế

| Tiêu chí | Đánh giá |
|---|---|
| **Cyclomatic Complexity - V(G)** | Có 4 điểm rẽ nhánh: đề tài tồn tại, trạng thái hợp lệ, quyền hợp lệ, lý do/nhận xét hợp lệ. V(G) = 4 + 1 = 5. |
| **Nhận xét V(G)** | V(G) = 5, nhỏ hơn 10, không cần phân rã. |
| **SRP** | Phương thức chỉ xử lý một quyết định nghiệp vụ là từ chối. Phương thức không tự triển khai chi tiết ghi log hoặc gửi thông báo mà gọi các đơn vị xử lý riêng. |

---

## 3.4. Method `PheDuyetDeTai.yeuCauChinhSua()`

### Đặc tả

| Mục | Nội dung |
|---|---|
| **Purpose** | Ghi nhận quyết định yêu cầu chỉnh sửa khi hồ sơ chưa đủ điều kiện được phê duyệt nhưng vẫn có thể bổ sung, hoàn thiện. |
| **Pre-Condition** | Hồ sơ đề tài tồn tại; đề tài đang ở trạng thái `CHO_DUYET`; người duyệt có quyền yêu cầu chỉnh sửa; nhận xét chỉnh sửa không được rỗng. |
| **Input** | `deTaiNghienCuuId: BIGINT`; `nguoiDuyetGiangVienId: BIGINT`; `nhanXet: TEXT`; `hanChinhSua: DATETIME` |
| **Output** | `PheDuyetDeTai`; bản ghi yêu cầu chỉnh sửa đã được tạo/cập nhật. |
| **Post-Condition** | Quyết định `YEU_CAU_CHINH_SUA` được lưu; đề tài được chuyển sang trạng thái `CAN_CHINH_SUA`; nhóm/sinh viên liên quan nhận được thông báo chỉnh sửa. |

### Logic xử lý

```text
Start
  Nhận deTaiNghienCuuId, nguoiDuyetGiangVienId, nhanXet, hanChinhSua
  Tìm hồ sơ đề tài theo deTaiNghienCuuId
  Nếu không tìm thấy đề tài
    Trả về lỗi "Không tìm thấy đề tài"
  Kiểm tra trạng thái đề tài
  Nếu trạng thái khác CHO_DUYET
    Trả về lỗi "Đề tài không ở trạng thái chờ duyệt"
  Kiểm tra quyền người duyệt
  Nếu người duyệt không có quyền
    Trả về lỗi "Không có quyền yêu cầu chỉnh sửa"
  Gọi batBuocCoNhanXet(YEU_CAU_CHINH_SUA, nhanXet, null)
  Nếu nhận xét không hợp lệ
    Trả về lỗi "Vui lòng nhập nội dung cần chỉnh sửa"
  Nếu hanChinhSua nhỏ hơn thời điểm hiện tại
    Trả về lỗi "Hạn chỉnh sửa không hợp lệ"
  Lưu bản ghi phê duyệt với quyết định YEU_CAU_CHINH_SUA
  Gọi DeTaiNghienCuu.doiTrangThai(CAN_CHINH_SUA)
  Gọi NhatKyKiemToan.ghiLog()
  Gọi ThongBao.gui()
  Trả về bản ghi yêu cầu chỉnh sửa
End
```

### Đánh giá chất lượng thiết kế

| Tiêu chí | Đánh giá |
|---|---|
| **Cyclomatic Complexity - V(G)** | Có 5 điểm rẽ nhánh: đề tài tồn tại, trạng thái hợp lệ, quyền hợp lệ, nhận xét hợp lệ, hạn chỉnh sửa hợp lệ. V(G) = 5 + 1 = 6. |
| **Nhận xét V(G)** | V(G) = 6, nhỏ hơn 10, logic vẫn dễ kiểm thử. |
| **SRP** | Phương thức chỉ ghi nhận yêu cầu chỉnh sửa. Kiểm tra nhận xét, đổi trạng thái, ghi log và gửi thông báo được tách thành các phương thức riêng hoặc lời gọi riêng. |

---

## 3.5. Method `DeTaiNghienCuu.doiTrangThai()`

### Đặc tả

| Mục | Nội dung |
|---|---|
| **Purpose** | Cập nhật trạng thái của đề tài nghiên cứu theo quyết định phê duyệt hợp lệ. |
| **Pre-Condition** | Đề tài tồn tại; trạng thái mới thuộc tập trạng thái hợp lệ; việc chuyển trạng thái phù hợp với quy trình nghiệp vụ. |
| **Input** | `deTaiNghienCuuId: BIGINT`; `trangThaiMoi: TrangThaiDeTai`; `nguoiThucHienId: BIGINT`; `thoiDiemCapNhat: DATETIME` |
| **Output** | `DeTaiNghienCuu`; bản ghi đề tài sau khi cập nhật trạng thái. |
| **Post-Condition** | Trạng thái đề tài được cập nhật sang `DA_DUYET`, `CAN_CHINH_SUA` hoặc `TU_CHOI` tùy quyết định. |

### Logic xử lý

```text
Start
  Nhận deTaiNghienCuuId, trangThaiMoi, nguoiThucHienId
  Tìm đề tài theo deTaiNghienCuuId
  Nếu không tìm thấy đề tài
    Trả về lỗi "Không tìm thấy đề tài"
  Kiểm tra trangThaiMoi có thuộc enum TrangThaiDeTai hay không
  Nếu trạng thái mới không hợp lệ
    Trả về lỗi "Trạng thái mới không hợp lệ"
  Kiểm tra chuyển trạng thái có hợp lệ không
  Nếu trạng thái hiện tại không thể chuyển sang trạng thái mới
    Trả về lỗi "Chuyển trạng thái không hợp lệ"
  Cập nhật trạng thái đề tài
  Cập nhật thời điểm sửa đổi
  Trả về đề tài đã cập nhật
End
```

### Đánh giá chất lượng thiết kế

| Tiêu chí | Đánh giá |
|---|---|
| **Cyclomatic Complexity - V(G)** | Có 3 điểm rẽ nhánh: đề tài tồn tại, trạng thái mới thuộc enum, chuyển trạng thái hợp lệ. V(G) = 3 + 1 = 4. |
| **Nhận xét V(G)** | V(G) = 4, nhỏ hơn 10. |
| **SRP** | Phương thức chỉ chịu trách nhiệm đổi trạng thái đề tài. Phương thức không quyết định phê duyệt, không ghi log và không gửi thông báo. |

---

## 3.6. Method `NhatKyKiemToan.ghiLog()`

### Đặc tả

| Mục | Nội dung |
|---|---|
| **Purpose** | Ghi lại nhật ký truy vết cho thao tác phê duyệt, từ chối hoặc yêu cầu chỉnh sửa nhằm phục vụ kiểm tra và đối chiếu sau này. |
| **Pre-Condition** | Thao tác nghiệp vụ đã được thực hiện thành công; có đủ thông tin người thực hiện, hành động và đối tượng bị tác động. |
| **Input** | `taiKhoanId: BIGINT`; `hanhDong: TEXT`; `doiTuongTacDong: TEXT`; `doiTuongId: BIGINT`; `noiDungTruoc: JSON`; `noiDungSau: JSON`; `thoiDiemGhiLog: DATETIME` |
| **Output** | `NhatKyKiemToan`; bản ghi nhật ký vừa được tạo. |
| **Post-Condition** | Một bản ghi nhật ký kiểm toán mới được lưu vào hệ thống. |

### Logic xử lý

```text
Start
  Nhận thông tin taiKhoanId, hanhDong, doiTuongTacDong, doiTuongId, noiDungTruoc, noiDungSau
  Kiểm tra taiKhoanId có hợp lệ không
  Nếu taiKhoanId không hợp lệ
    Trả về lỗi "Thiếu người thực hiện"
  Kiểm tra hanhDong có rỗng không
  Nếu hanhDong rỗng
    Trả về lỗi "Thiếu hành động"
  Kiểm tra doiTuongTacDong và doiTuongId có hợp lệ không
  Nếu thông tin đối tượng không hợp lệ
    Trả về lỗi "Thiếu đối tượng tác động"
  Tạo bản ghi nhật ký kiểm toán
  Lưu bản ghi nhật ký
  Trả về bản ghi nhật ký đã tạo
End
```

### Đánh giá chất lượng thiết kế

| Tiêu chí | Đánh giá |
|---|---|
| **Cyclomatic Complexity - V(G)** | Có 3 điểm rẽ nhánh: kiểm tra người thực hiện, kiểm tra hành động, kiểm tra đối tượng tác động. V(G) = 3 + 1 = 4. |
| **Nhận xét V(G)** | V(G) = 4, nhỏ hơn 10. |
| **SRP** | Phương thức chỉ thực hiện ghi nhật ký kiểm toán. Nó không quyết định nghiệp vụ và không cập nhật trạng thái đề tài. |

---

## 3.7. Method `ThongBao.gui()`

### Đặc tả

| Mục | Nội dung |
|---|---|
| **Purpose** | Gửi thông báo đến người nhận liên quan sau khi quyết định phê duyệt được ghi nhận thành công. |
| **Pre-Condition** | Quyết định phê duyệt/từ chối/yêu cầu chỉnh sửa đã được lưu thành công; đã xác định được người nhận thông báo. |
| **Input** | `nguoiNhanTaiKhoanId: BIGINT`; `tieuDe: TEXT`; `noiDung: TEXT`; `loaiThongBao: ENUM`; `doiTuongLienQuanId: BIGINT` |
| **Output** | `ThongBao`; bản ghi thông báo vừa được tạo. |
| **Post-Condition** | Người nhận có một thông báo mới trong hệ thống với trạng thái chưa đọc. |

### Logic xử lý

```text
Start
  Nhận nguoiNhanTaiKhoanId, tieuDe, noiDung, loaiThongBao
  Kiểm tra người nhận có tồn tại không
  Nếu người nhận không tồn tại
    Trả về lỗi "Không tìm thấy người nhận"
  Kiểm tra tiêu đề và nội dung có rỗng không
  Nếu tiêu đề hoặc nội dung rỗng
    Trả về lỗi "Nội dung thông báo không hợp lệ"
  Tạo thông báo mới với daDoc = false
  Lưu thông báo
  Trả về thông báo đã tạo
End
```

### Đánh giá chất lượng thiết kế

| Tiêu chí | Đánh giá |
|---|---|
| **Cyclomatic Complexity - V(G)** | Có 2 điểm rẽ nhánh: người nhận tồn tại, nội dung thông báo hợp lệ. V(G) = 2 + 1 = 3. |
| **Nhận xét V(G)** | V(G) = 3, nhỏ hơn 10. |
| **SRP** | Phương thức chỉ gửi/tạo thông báo, không xử lý quyết định phê duyệt hoặc cập nhật trạng thái nghiệp vụ. |

---

## 4. Tổng hợp Cyclomatic Complexity

| STT | Phương thức | Số điểm rẽ nhánh | V(G) | Có cần phân rã không? |
|---|---|---:|---:|---|
| 1 | `PheDuyetDeTai.batBuocCoNhanXet()` | 3 | 4 | Không |
| 2 | `PheDuyetDeTai.pheDuyet()` | 4 | 5 | Không |
| 3 | `PheDuyetDeTai.tuChoi()` | 4 | 5 | Không |
| 4 | `PheDuyetDeTai.yeuCauChinhSua()` | 5 | 6 | Không |
| 5 | `DeTaiNghienCuu.doiTrangThai()` | 3 | 4 | Không |
| 6 | `NhatKyKiemToan.ghiLog()` | 3 | 4 | Không |
| 7 | `ThongBao.gui()` | 2 | 3 | Không |

Tất cả các phương thức đều có V(G) nhỏ hơn hoặc bằng 6, thấp hơn ngưỡng 10. Vì vậy, các phương thức hiện tại chưa cần phân rã thêm theo tiêu chí Cyclomatic Complexity.

---

## 5. Tổng hợp tuân thủ SRP

| Phương thức | Nhiệm vụ duy nhất |
|---|---|
| `batBuocCoNhanXet()` | Kiểm tra nhận xét/lý do bắt buộc |
| `pheDuyet()` | Ghi nhận quyết định phê duyệt |
| `tuChoi()` | Ghi nhận quyết định từ chối |
| `yeuCauChinhSua()` | Ghi nhận yêu cầu chỉnh sửa |
| `doiTrangThai()` | Cập nhật trạng thái đề tài |
| `ghiLog()` | Ghi nhật ký truy vết |
| `gui()` | Tạo/gửi thông báo |

Các phương thức được thiết kế theo nguyên lý Đơn nhiệm. Mỗi phương thức tập trung vào một mục tiêu rõ ràng, các chức năng phụ trợ được tách ra thành đơn vị xử lý riêng. Cách thiết kế này giúp giảm độ phức tạp, dễ kiểm thử từng phương thức và dễ bảo trì khi quy trình nghiệp vụ thay đổi.

---

## 6. Gợi ý Activity Diagram cần vẽ trong file `.drawio`

Trong sản phẩm nộp kèm `.drawio`, nên tạo 7 trang tương ứng với 7 phương thức:

1. Activity Diagram - `batBuocCoNhanXet()`
2. Activity Diagram - `pheDuyet()`
3. Activity Diagram - `tuChoi()`
4. Activity Diagram - `yeuCauChinhSua()`
5. Activity Diagram - `doiTrangThai()`
6. Activity Diagram - `ghiLog()`
7. Activity Diagram - `gui()`

Mỗi sơ đồ nên có:

- Initial Node.
- Action Node cho từng bước xử lý.
- Decision Node cho các bước kiểm tra điều kiện.
- Merge Node khi các nhánh quay về luồng chính.
- Activity Final Node.

Các luồng xử lý trong mục "Logic xử lý" của từng phương thức có thể dùng trực tiếp để dựng Activity Diagram theo chuẩn UML 2.5.1.
