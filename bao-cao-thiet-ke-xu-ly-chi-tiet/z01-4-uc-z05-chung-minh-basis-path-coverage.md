# Bài tập Z01.4 - Chứng minh Basis Path Test Coverage = 100%

**Sinh viên:** Trần Trường Giang  
**Nhóm/Lớp:** G04 / 2210A02  
**System Use Case:** UC-Z05 - Ghi nhận quyết định và lý do phê duyệt  
**Phạm vi kiểm thử:** Các unit/method đã thiết kế chi tiết tại Z01.3 và đã lập trình trong module `duyet-de-tai`.

---

## 1. Mục tiêu chứng minh

Tài liệu này chứng minh các ca kiểm thử unit đã xây dựng đạt **Basis Path Test Coverage = 100%** đối với các method phục vụ UC-Z05.

Các method được kiểm thử gồm:

| STT | Method | Vai trò |
|---|---|---|
| 1 | `PheDuyetDeTai.batBuocCoNhanXet()` | Kiểm tra nhận xét/lý do bắt buộc |
| 2 | `DeTaiNghienCuu.doiTrangThai()` | Cập nhật trạng thái đề tài |
| 3 | `PheDuyetDeTai.pheDuyet()` | Ghi nhận quyết định phê duyệt |
| 4 | `PheDuyetDeTai.yeuCauChinhSua()` | Ghi nhận yêu cầu chỉnh sửa |
| 5 | `PheDuyetDeTai.tuChoi()` | Ghi nhận quyết định từ chối |

---

## 2. Cơ sở lý thuyết

### 2.1. Cyclomatic Complexity

Cyclomatic Complexity, ký hiệu **V(G)**, dùng để đo số lượng đường xử lý độc lập trong logic của một unit.

Công thức sử dụng trong bài:

```text
V(G) = Số điểm rẽ nhánh + 1
```

Trong đó điểm rẽ nhánh là các điều kiện như:

- `if`
- kiểm tra dữ liệu tồn tại hay không
- kiểm tra quyền
- kiểm tra trạng thái
- kiểm tra dữ liệu bắt buộc

### 2.2. Basis Path Test Coverage

Basis Path Test Coverage được tính như sau:

```text
Basis Path Test Coverage =
  (Số đường cơ sở đã được kiểm thử / Tổng số đường cơ sở cần kiểm thử) x 100%
```

Để đạt 100%, mỗi đường xử lý độc lập của unit phải có ít nhất một test case bao phủ.

---

## 3. Môi trường và mã nguồn kiểm thử

### 3.1. Mã nguồn được kiểm thử

```text
backend/src/modules/duyet-de-tai/business-layer/duyet-de-tai.service.ts
```

### 3.2. File unit test

```text
backend/src/modules/duyet-de-tai/business-layer/duyet-de-tai.service.test.ts
```

### 3.3. Lệnh chạy kiểm thử

Chạy trong thư mục `backend`:

```bash
npm test
```

### 3.4. Kết quả kiểm thử

Kết quả chạy gần nhất:

```text
tests 26
pass 26
fail 0
```

---

## 4. Chứng minh coverage theo từng unit

## 4.1. Unit `PheDuyetDeTai.batBuocCoNhanXet()`

### Mục đích

Kiểm tra quyết định phê duyệt/từ chối/yêu cầu chỉnh sửa có đủ nhận xét hoặc lý do bắt buộc hay không.

### Cyclomatic Complexity

Các điểm rẽ nhánh chính:

| STT | Điều kiện |
|---|---|
| 1 | Quyết định là `YEU_CAU_CHINH_SUA` hoặc `TU_CHOI` |
| 2 | Nhận xét/lý do có nội dung hay không |
| 3 | Trường hợp `PHE_DUYET` có nhận xét hay không |

```text
V(G) = 3 + 1 = 4
```

### Basis paths và test case bao phủ

| Path | Mô tả đường xử lý | Test case bao phủ | Kết quả |
|---|---|---|---|
| Path 1 | Quyết định `PHE_DUYET`, có nhận xét hợp lệ | `TC-BBCNX-01` | Đạt |
| Path 2 | Quyết định `PHE_DUYET`, thiếu nhận xét | `TC-BBCNX-02` | Đạt |
| Path 3 | Quyết định `TU_CHOI`, có lý do hợp lệ | `TC-BBCNX-03` | Đạt |
| Path 4 | Quyết định `YEU_CAU_CHINH_SUA`, thiếu cả nhận xét và lý do | `TC-BBCNX-04` | Đạt |

### Kết luận coverage

```text
Số basis path cần kiểm thử: 4
Số basis path đã kiểm thử: 4
Basis Path Test Coverage = 4/4 x 100% = 100%
```

---

## 4.2. Unit `DeTaiNghienCuu.doiTrangThai()`

### Mục đích

Cập nhật trạng thái của đề tài nghiên cứu theo quyết định hợp lệ.

### Cyclomatic Complexity

Các điểm rẽ nhánh chính:

| STT | Điều kiện |
|---|---|
| 1 | Đề tài có tồn tại hay không |
| 2 | Trạng thái mới có thuộc enum hợp lệ hay không |
| 3 | Chuyển trạng thái có hợp lệ theo state machine hay không |

```text
V(G) = 3 + 1 = 4
```

### Basis paths và test case bao phủ

| Path | Mô tả đường xử lý | Test case bao phủ | Kết quả |
|---|---|---|---|
| Path 1 | Không tìm thấy đề tài | `TC-DTT-01` | Đạt |
| Path 2 | Trạng thái mới không thuộc enum | `TC-DTT-02` | Đạt |
| Path 3 | Chuyển trạng thái không hợp lệ | `TC-DTT-03` | Đạt |
| Path 4 | Cập nhật trạng thái thành công | `TC-DTT-04` | Đạt |

### Kết luận coverage

```text
Số basis path cần kiểm thử: 4
Số basis path đã kiểm thử: 4
Basis Path Test Coverage = 4/4 x 100% = 100%
```

---

## 4.3. Unit `PheDuyetDeTai.pheDuyet()`

### Mục đích

Ghi nhận quyết định phê duyệt đề tài, cập nhật trạng thái đề tài/nhóm, ghi audit log và gửi thông báo.

### Cyclomatic Complexity

Các điểm rẽ nhánh chính:

| STT | Điều kiện |
|---|---|
| 1 | Đề tài có tồn tại hay không |
| 2 | Giảng viên có quyền phê duyệt hay không |
| 3 | Đề tài đã chốt hay chưa |
| 4 | Đề tài có đang ở trạng thái chờ duyệt hay không |
| 5 | Nhận xét phê duyệt có hợp lệ hay không |

```text
V(G) = 5 + 1 = 6
```

### Basis paths và test case bao phủ

| Path | Mô tả đường xử lý | Test case bao phủ | Kết quả |
|---|---|---|---|
| Path 1 | Không tìm thấy đề tài | `TC-PD-01` | Đạt |
| Path 2 | Giảng viên không có quyền phê duyệt | `TC-PD-02` | Đạt |
| Path 3 | Đề tài đã chốt nên không được duyệt lại | `TC-PD-03` | Đạt |
| Path 4 | Đề tài không ở trạng thái chờ duyệt | `TC-PD-04` | Đạt |
| Path 5 | Thiếu nhận xét phê duyệt | `TC-PD-05` | Đạt |
| Path 6 | Phê duyệt thành công | `TC-PD-06` | Đạt |

### Kết luận coverage

```text
Số basis path cần kiểm thử: 6
Số basis path đã kiểm thử: 6
Basis Path Test Coverage = 6/6 x 100% = 100%
```

---

## 4.4. Unit `PheDuyetDeTai.yeuCauChinhSua()`

### Mục đích

Ghi nhận quyết định yêu cầu chỉnh sửa khi đề tài chưa đủ điều kiện phê duyệt nhưng vẫn có thể bổ sung.

### Cyclomatic Complexity

Các điểm rẽ nhánh chính:

| STT | Điều kiện |
|---|---|
| 1 | Nhận xét chỉnh sửa có hợp lệ hay không |
| 2 | Đề tài có tồn tại hay không |
| 3 | Giảng viên có quyền yêu cầu chỉnh sửa hay không |
| 4 | Đề tài đã chốt hay chưa |
| 5 | Đề tài có đang ở trạng thái chờ duyệt hay không |

```text
V(G) = 5 + 1 = 6
```

### Basis paths và test case bao phủ

| Path | Mô tả đường xử lý | Test case bao phủ | Kết quả |
|---|---|---|---|
| Path 1 | Thiếu nhận xét chỉnh sửa | `TC-YCCS-01` | Đạt |
| Path 2 | Không tìm thấy đề tài | `TC-YCCS-02` | Đạt |
| Path 3 | Giảng viên không có quyền yêu cầu chỉnh sửa | `TC-YCCS-03` | Đạt |
| Path 4 | Đề tài đã chốt nên không được yêu cầu chỉnh sửa | `TC-YCCS-04` | Đạt |
| Path 5 | Đề tài không ở trạng thái chờ duyệt | `TC-YCCS-05` | Đạt |
| Path 6 | Yêu cầu chỉnh sửa thành công | `TC-YCCS-06` | Đạt |

### Kết luận coverage

```text
Số basis path cần kiểm thử: 6
Số basis path đã kiểm thử: 6
Basis Path Test Coverage = 6/6 x 100% = 100%
```

---

## 4.5. Unit `PheDuyetDeTai.tuChoi()`

### Mục đích

Ghi nhận quyết định từ chối đề tài khi nội dung đề tài không đủ điều kiện được chấp nhận.

### Cyclomatic Complexity

Các điểm rẽ nhánh chính:

| STT | Điều kiện |
|---|---|
| 1 | Lý do/nhận xét từ chối có hợp lệ hay không |
| 2 | Đề tài có tồn tại hay không |
| 3 | Giảng viên có quyền từ chối hay không |
| 4 | Đề tài đã chốt hay chưa |
| 5 | Đề tài có đang ở trạng thái chờ duyệt hay không |

```text
V(G) = 5 + 1 = 6
```

### Basis paths và test case bao phủ

| Path | Mô tả đường xử lý | Test case bao phủ | Kết quả |
|---|---|---|---|
| Path 1 | Thiếu lý do/nhận xét từ chối | `TC-TC-01` | Đạt |
| Path 2 | Không tìm thấy đề tài | `TC-TC-02` | Đạt |
| Path 3 | Giảng viên không có quyền từ chối | `TC-TC-03` | Đạt |
| Path 4 | Đề tài đã chốt nên không được từ chối | `TC-TC-04` | Đạt |
| Path 5 | Đề tài không ở trạng thái chờ duyệt | `TC-TC-05` | Đạt |
| Path 6 | Từ chối thành công | `TC-TC-06` | Đạt |

### Kết luận coverage

```text
Số basis path cần kiểm thử: 6
Số basis path đã kiểm thử: 6
Basis Path Test Coverage = 6/6 x 100% = 100%
```

---

## 5. Bảng tổng hợp coverage

| STT | Unit/Method | V(G) | Số basis path cần kiểm thử | Số basis path đã kiểm thử | Coverage |
|---|---|---:|---:|---:|---:|
| 1 | `batBuocCoNhanXet()` | 4 | 4 | 4 | 100% |
| 2 | `doiTrangThai()` | 4 | 4 | 4 | 100% |
| 3 | `pheDuyet()` | 6 | 6 | 6 | 100% |
| 4 | `yeuCauChinhSua()` | 6 | 6 | 6 | 100% |
| 5 | `tuChoi()` | 6 | 6 | 6 | 100% |

Tổng số basis path cần kiểm thử:

```text
4 + 4 + 6 + 6 + 6 = 26
```

Tổng số basis path đã có test case bao phủ:

```text
26
```

Tỉ lệ bao phủ:

```text
Basis Path Test Coverage = 26/26 x 100% = 100%
```

---

## 6. Kết luận

Các unit/method phục vụ UC-Z05 đã được lập trình và kiểm thử bằng unit test. Mỗi basis path được xác định từ Cyclomatic Complexity đều có ít nhất một test case tương ứng.

Kết quả:

```text
Basis Path Test Coverage = 100%
```

Do đó, yêu cầu kiểm thử basis path của bài Z01.4 đối với UC-Z05 đã được đáp ứng.

