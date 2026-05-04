import { ValidationError } from '../../../common/exceptions';
import { TaoYeuCauPhanTichXuHuongDto } from '../dto/tao-yeu-cau-phan-tich-xu-huong.dto';
import { LoaiPhanTichXuHuong } from '../types/phan-tich-xu-huong.types';

const dinhDangNgayIso = /^\d{4}-\d{2}-\d{2}$/;

function laySoNguyenDuong(giaTri: unknown, field: string): number {
  const so = typeof giaTri === 'number' ? giaTri : Number(giaTri);

  if (!Number.isInteger(so) || so <= 0) {
    throw new ValidationError('Dữ liệu quản lý không hợp lệ', [
      { field, code: 'INVALID_MANAGER_ID', detail: 'Mã quản lý phải là số nguyên dương' },
    ]);
  }

  return so;
}

function layNgayHopLe(giaTri: unknown, field: string): string {
  if (typeof giaTri !== 'string' || !dinhDangNgayIso.test(giaTri)) {
    throw new ValidationError('Ngày phân tích không hợp lệ', [
      { field, code: 'INVALID_DATE', detail: 'Ngày phải có định dạng YYYY-MM-DD' },
    ]);
  }

  const ngay = new Date(giaTri);
  if (Number.isNaN(ngay.getTime())) {
    throw new ValidationError('Ngày phân tích không hợp lệ', [
      { field, code: 'INVALID_DATE_VALUE', detail: 'Ngày không tồn tại' },
    ]);
  }

  return giaTri;
}

function layLoaiPhanTich(giaTri: unknown): LoaiPhanTichXuHuong {
  const danhSachLoai = Object.values(LoaiPhanTichXuHuong);
  if (typeof giaTri !== 'string' || !danhSachLoai.includes(giaTri as LoaiPhanTichXuHuong)) {
    throw new ValidationError('Loại phân tích không hợp lệ', [
      {
        field: 'loaiPhanTich',
        code: 'INVALID_ANALYSIS_TYPE',
        detail: `Loại phân tích phải thuộc: ${danhSachLoai.join(', ')}`,
      },
    ]);
  }

  return giaTri as LoaiPhanTichXuHuong;
}

function xacThucTaoYeuCauPhanTichXuHuong(body: unknown): TaoYeuCauPhanTichXuHuongDto {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Thiếu dữ liệu yêu cầu phân tích', [
      { field: 'body', code: 'BODY_REQUIRED', detail: 'Request body là bắt buộc' },
    ]);
  }

  const duLieu = body as Record<string, unknown>;

  return {
    quanLyId: laySoNguyenDuong(duLieu.quanLyId, 'quanLyId'),
    ngayBatDau: layNgayHopLe(duLieu.ngayBatDau, 'ngayBatDau'),
    ngayKetThuc: layNgayHopLe(duLieu.ngayKetThuc, 'ngayKetThuc'),
    loaiPhanTich: layLoaiPhanTich(duLieu.loaiPhanTich),
  };
}

export { xacThucTaoYeuCauPhanTichXuHuong };
