# Bài tập Z01.4 - Danh sách phát hiện và rút ra

**Sinh viên:** Trần Trường Giang  
**Nhóm/Lớp:** G04 / 2210A02  
**System Use Case:** UC-Z05 - Ghi nhận quyết định và lý do phê duyệt  
**Phạm vi:** Lập trình và kiểm thử các method/unit đã thiết kế tại Z01.3.

---

## 1. Bối cảnh thực hiện

Ở bài Z01.3, UC-Z05 đã được thiết kế chi tiết ở mức method. Sang bài Z01.4, các method này được lập trình trong backend và được kiểm thử bằng unit test.

Các method chính đã thực hiện:

| STT | Method | Vai trò |
|---|---|---|
| 1 | `batBuocCoNhanXet()` | Kiểm tra nhận xét/lý do bắt buộc |
| 2 | `doiTrangThai()` | Cập nhật trạng thái đề tài |
| 3 | `pheDuyet()` | Ghi nhận quyết định phê duyệt |
| 4 | `yeuCauChinhSua()` | Ghi nhận yêu cầu chỉnh sửa |
| 5 | `tuChoi()` | Ghi nhận quyết định từ chối |

Kết quả kiểm thử:

```text
Số test case đã chạy: 26
Số test case đạt: 26
Số test case lỗi: 0
Basis Path Test Coverage: 100%
```

---

## 2. Các phát hiện trong quá trình lập trình

## 2.1. Thiết kế chi tiết giúp code rõ ràng hơn

Khi đã có đặc tả method từ Z01.3, việc lập trình ở Z01.4 trở nên rõ ràng hơn vì mỗi method đã có:

- mục đích xử lý,
- tiền điều kiện,
- dữ liệu đầu vào,
- dữ liệu đầu ra,
- hậu điều kiện,
- luồng xử lý chính và luồng lỗi.

Nhờ đó, khi viết code không bị mơ hồ về việc method cần làm gì và không cần làm gì.

---

## 2.2. Các nhánh lỗi quan trọng thường dễ bị bỏ sót

Trong quá trình chuyển từ thiết kế sang code, nếu chỉ kiểm tra luồng thành công thì chưa đủ. Các nhánh lỗi quan trọng cần được xử lý rõ gồm:

- không tìm thấy đề tài,
- giảng viên không có quyền duyệt,
- đề tài không ở trạng thái chờ duyệt,
- đề tài đã chốt nhưng vẫn bị yêu cầu duyệt lại,
- thiếu nhận xét hoặc lý do khi phê duyệt/từ chối/yêu cầu chỉnh sửa,
- chuyển trạng thái không hợp lệ.

Các nhánh này rất quan trọng vì nếu bỏ sót có thể làm sai quy trình nghiệp vụ.

---

## 2.3. Business rule phải nằm ở backend

Một phát hiện quan trọng là frontend chỉ nên gửi hành động của người dùng, ví dụ:

- phê duyệt,
- từ chối,
- yêu cầu chỉnh sửa.

Frontend không nên tự quyết định trạng thái mới của đề tài. Backend phải là nơi:

- kiểm tra quyền,
- kiểm tra trạng thái hiện tại,
- kiểm tra transition hợp lệ,
- cập nhật trạng thái mới,
- ghi audit log,
- gửi thông báo.

Điều này giúp hệ thống an toàn hơn và tránh trường hợp người dùng thao tác sai từ phía client.

---

## 2.4. State transition nên được quản lý tập trung

Ban đầu có thể dễ viết trực tiếp:

```text
nếu duyệt thì chuyển sang DA_DUYET
nếu từ chối thì chuyển sang TU_CHOI
```

Tuy nhiên, cách này dễ làm logic trạng thái bị rải rác trong nhiều method.

Khi tách method `doiTrangThai()`, việc kiểm tra trạng thái được tập trung hơn. Method này giúp đảm bảo:

- trạng thái mới phải thuộc enum hợp lệ,
- trạng thái hiện tại được phép chuyển sang trạng thái mới,
- trạng thái đề tài không bị cập nhật tùy tiện.

Đây là điểm quan trọng để bảo trì hệ thống khi quy trình nghiệp vụ thay đổi.

---

## 2.5. Method nhỏ giúp unit test dễ viết hơn

Method `batBuocCoNhanXet()` là một ví dụ rõ. Vì method này chỉ làm một nhiệm vụ là kiểm tra nhận xét/lý do, nên có thể test độc lập mà không cần database, API hoặc transaction.

Điều rút ra:

- method càng nhỏ và rõ trách nhiệm thì càng dễ viết test,
- test dễ hiểu hơn,
- lỗi dễ xác định vị trí hơn,
- không cần mock quá nhiều thành phần phụ.

---

## 2.6. Audit log và notification nên thực hiện sau transaction

Với các thao tác quan trọng như phê duyệt, từ chối, yêu cầu chỉnh sửa, hệ thống cần:

- cập nhật trạng thái đề tài,
- cập nhật trạng thái nhóm,
- ghi audit log,
- gửi notification.

Tuy nhiên, audit log và notification chỉ nên thực hiện sau khi transaction cập nhật dữ liệu chính thành công. Nếu gửi thông báo trước rồi transaction thất bại, người dùng có thể nhận thông báo sai.

Điều này giúp đảm bảo tính nhất quán giữa dữ liệu và thông báo.

---

## 2.7. Basis Path Testing giúp kiểm thử có hệ thống

Khi dùng Cyclomatic Complexity để xác định số đường cơ sở, việc lập test case trở nên có căn cứ hơn.

Ví dụ:

```text
Method pheDuyet()
V(G) = 6
=> cần ít nhất 6 basis paths
=> cần test các nhánh lỗi và nhánh thành công
```

Nếu không dùng Basis Path Testing, người lập trình có thể chỉ viết 1 đến 2 test case cho luồng thành công và bỏ sót nhiều nhánh lỗi.

---

## 3. Những điều quan trọng rút ra

## 3.1. Không nên bắt đầu code khi chưa hiểu rõ luồng xử lý

Thiết kế chi tiết ở Z01.3 đóng vai trò như bản hướng dẫn cho lập trình. Nếu chưa xác định được method làm gì, input/output là gì, điều kiện lỗi là gì thì code rất dễ bị thiếu hoặc sai nghiệp vụ.

---

## 3.2. Cyclomatic Complexity giúp đánh giá khả năng kiểm thử

Chỉ số V(G) không chỉ dùng để tính toán hình thức. Nó giúp trả lời câu hỏi:

```text
Method này cần tối thiểu bao nhiêu test case để kiểm thử đủ các đường xử lý độc lập?
```

Nếu V(G) quá cao, method sẽ khó hiểu, khó test và nên được tách nhỏ.

---

## 3.3. SRP giúp code dễ bảo trì

Khi mỗi method chỉ làm một nhiệm vụ, việc sửa đổi và kiểm thử trở nên dễ hơn.

Ví dụ:

- `batBuocCoNhanXet()` chỉ kiểm tra nhận xét/lý do.
- `doiTrangThai()` chỉ xử lý cập nhật trạng thái.
- `pheDuyet()` chỉ điều phối nghiệp vụ phê duyệt.

Nhờ vậy, khi cần thay đổi rule về nhận xét bắt buộc, chỉ cần sửa ở một chỗ thay vì sửa nhiều method khác nhau.

---

## 3.4. Unit test không nhất thiết phải phụ thuộc database thật

Trong bài này, repository được mock để kiểm thử service. Cách này có lợi vì:

- test chạy nhanh,
- không làm thay đổi dữ liệu thật,
- dễ tạo các tình huống lỗi,
- phù hợp với quy tắc không tự ý thay đổi database.

Điều này đặc biệt quan trọng khi database là Supabase Cloud hoặc môi trường có dữ liệu dùng chung.

---

## 3.5. Cần kiểm thử cả luồng thành công và luồng thất bại

Một use case hoàn chỉnh không chỉ có happy path. Với UC-Z05, các luồng thất bại rất quan trọng:

- không có quyền,
- thiếu nhận xét,
- sai trạng thái,
- đề tài đã chốt,
- đề tài không tồn tại.

Nếu chỉ kiểm thử luồng thành công, hệ thống có thể vẫn lỗi khi gặp dữ liệu hoặc thao tác không hợp lệ.

---

## 4. Kết quả đạt được

Sau khi thực hiện Z01.4, các kết quả đạt được gồm:

| Nội dung | Kết quả |
|---|---|
| Method đã lập trình | 5 method chính phục vụ UC-Z05 |
| Unit test đã viết | 26 test cases |
| Test pass | 26 |
| Test fail | 0 |
| Basis Path Test Coverage | 100% |
| Có thay đổi database không | Không |
| Có kiểm thử business rule ở backend không | Có |

---

## 5. Kết luận

Qua bài Z01.4, có thể rút ra rằng thiết kế chi tiết, lập trình và kiểm thử unit có mối liên hệ chặt chẽ với nhau.

Thiết kế chi tiết giúp xác định đúng method cần code. Cyclomatic Complexity giúp xác định số đường kiểm thử tối thiểu. Basis Path Testing giúp đảm bảo các nhánh xử lý quan trọng đều được kiểm tra. SRP giúp các method nhỏ, rõ nhiệm vụ và dễ kiểm thử.

Đối với UC-Z05, các method đã được lập trình và kiểm thử đạt 100% Basis Path Test Coverage trong phạm vi đã chọn. Điều này cho thấy luồng xử lý phê duyệt, yêu cầu chỉnh sửa và từ chối đề tài đã được kiểm tra đầy đủ ở mức unit.

