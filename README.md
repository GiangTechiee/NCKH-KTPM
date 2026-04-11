# NCKH-KTPM

Hệ thống **Quản lý nghiên cứu khoa học sinh viên**.

Luồng nghiệp vụ chính của hệ thống:

1. Sinh viên đăng ký mảng nghiên cứu
2. Sinh viên tạo nhóm hoặc tham gia nhóm
3. Giảng viên chọn nhóm hướng dẫn
4. Nhóm chọn hoặc đề xuất đề tài
5. Giảng viên duyệt / yêu cầu chỉnh sửa / từ chối / chốt đề tài
6. Hệ thống theo dõi tiến trình và thông báo cho các bên liên quan

---

## 1. Cấu trúc dự án

```text
NCKH-KTPM/
├── backend/   # API Node.js + Express + TypeScript + Prisma
├── frontend/  # UI React
└── README.md
```

---

## 2. Công nghệ sử dụng

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL / Supabase

### Frontend
- React
- React Scripts
- Tailwind CSS

---

## 3. Điều kiện cần trước khi chạy

Máy cần có:

- Node.js
- npm
- Cơ sở dữ liệu PostgreSQL / Supabase đang hoạt động

Backend hiện đọc biến môi trường từ `.env` qua Prisma client.

Biến môi trường quan trọng:

```env
DATABASE_URL=...
```

Hoặc:

```env
DIRECT_URL=...
```

Nếu không có `DATABASE_URL` hoặc `DIRECT_URL`, backend sẽ không khởi động được.

---

## 4. Cài đặt dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## 5. Lệnh chạy dự án

## 5.1. Chạy backend

```bash
cd backend
npm run dev
```

Backend mặc định chạy tại:

```text
http://localhost:3000
```

API health check:

```text
http://localhost:3000/api/health
```

---

## 5.2. Chạy frontend

```bash
cd frontend
npm start
```

Frontend dùng CRA, thường chạy tại:

```text
http://localhost:3001
```

> Trong `frontend/package.json`, frontend đang cấu hình proxy về `http://localhost:3000`, nên backend cần chạy trước hoặc chạy song song.

---

## 6. Lệnh build

### Backend

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
npm run build
```

---

## 7. Seed dữ liệu demo

### Seed demo đầy đủ

```bash
cd backend
npm run db:seed:demo
```

### Bổ sung thêm dữ liệu demo giao diện

```bash
cd backend
npm run db:seed:demo:additive
```

Ngoài ra trong repo hiện có script chuẩn hóa lại dữ liệu demo có dấu:

```text
backend/src/scripts/cap-nhat-du-lieu-demo-co-dau.ts
```

Script này dùng để làm sạch dữ liệu demo đã có trong DB khi cần.

---

## 8. Các lệnh backend hiện có

```bash
npm run dev
npm run dev:watch
npm run build
npm run start
npm run db:seed:demo
npm run db:seed:demo:additive
npm run prisma:generate
npm run prisma:migrate:deploy
```

---

## 9. Các lệnh frontend hiện có

```bash
npm start
npm run build
npm test
```

---

## 10. Luồng chạy đề xuất khi phát triển

Mở 2 terminal riêng:

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm start
```

Sau đó mở trình duyệt tại:

```text
http://localhost:3001
```

---

## 11. Tài khoản demo

Hệ thống hiện không dùng màn hình đăng nhập đầy đủ cho demo.

Frontend đang cho phép chọn nhanh tài khoản từ danh sách:

- Sinh viên
- Giảng viên

Danh sách tài khoản này được tải từ backend qua:

- `GET /api/nguoi-dung/sinh-vien`
- `GET /api/nguoi-dung/giang-vien`

---

## 12. Ghi chú quan trọng

- Backend entrypoint hiện tại là:

```text
backend/src/may-chu.ts
```

- Frontend entrypoint hiện tại là:

```text
frontend/src/index.js
```

- App shell thực tế đang chạy ở:

```text
frontend/src/app/App.js
```

---

## 13. Trạng thái hiện tại

Trong phạm vi hiện tại, hệ thống đã có các luồng chính:

- Đăng ký mảng nghiên cứu
- Tạo nhóm, mời thành viên, phản hồi lời mời
- Giảng viên nhận hướng dẫn nhóm
- Sinh viên nộp đề tài / chỉnh sửa đề tài
- Sinh viên chọn đề tài giảng viên đề xuất
- Giảng viên duyệt / yêu cầu chỉnh sửa / từ chối / chốt đề tài
- Theo dõi tiến trình thực hiện
- Xem thông báo và đánh dấu đã đọc

---

## 14. Tác giả

Nhóm thực hiện dự án NCKH-KTPM.
