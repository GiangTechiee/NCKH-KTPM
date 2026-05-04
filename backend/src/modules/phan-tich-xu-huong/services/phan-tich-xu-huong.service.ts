import { ValidationError } from '../../../common/exceptions';
import { TaoYeuCauPhanTichXuHuongDto } from '../dto/tao-yeu-cau-phan-tich-xu-huong.dto';
import { PhanTichXuHuongRepository } from '../repositories/phan-tich-xu-huong.repository';
import {
  TaoYeuCauPhanTichXuHuongResponse,
  TrangThaiYeuCauPhanTich,
  YeuCauPhanTichXuHuong,
} from '../types/phan-tich-xu-huong.types';

const SO_NGAY_TOI_THIEU_DE_PHAN_TICH = 30;

function tinhSoNgay(ngayBatDau: string, ngayKetThuc: string): number {
  const batDau = new Date(ngayBatDau);
  const ketThuc = new Date(ngayKetThuc);
  const soMsMotNgay = 24 * 60 * 60 * 1000;

  return Math.floor((ketThuc.getTime() - batDau.getTime()) / soMsMotNgay) + 1;
}

class PhanTichXuHuongService {
  constructor(
    private readonly phanTichXuHuongRepository: PhanTichXuHuongRepository = new PhanTichXuHuongRepository()
  ) {}

  async taoYeuCauPhanTichXuHuong(
    input: TaoYeuCauPhanTichXuHuongDto
  ): Promise<TaoYeuCauPhanTichXuHuongResponse> {
    this.kiemTraQuyenQuanLy(input.quanLyId);
    this.kiemTraKhoangNgay(input.ngayBatDau, input.ngayKetThuc);

    const duLieuKhaDung = await this.phanTichXuHuongRepository.kiemTraDuLieuKhaDung(
      input.ngayBatDau,
      input.ngayKetThuc
    );

    if (!duLieuKhaDung.duDieuKien) {
      throw new ValidationError('Không đủ 30 ngày dữ liệu để phân tích', [
        {
          field: 'ngayBatDau',
          code: 'INSUFFICIENT_ANALYSIS_DATA',
          detail: `Hiện chỉ có ${duLieuKhaDung.soNgayDuLieu} ngày dữ liệu`,
        },
      ]);
    }

    const yeuCau = await this.phanTichXuHuongRepository.taoYeuCauPhanTich({
      quanLyId: input.quanLyId,
      ngayBatDau: input.ngayBatDau,
      ngayKetThuc: input.ngayKetThuc,
      loaiPhanTich: input.loaiPhanTich,
      trangThai: TrangThaiYeuCauPhanTich.DA_TAO,
    });

    return {
      yeuCauId: yeuCau.id,
      trangThai: yeuCau.trangThai,
      message: 'Yêu cầu phân tích xu hướng đã được gửi',
    };
  }

  async layDanhSachYeuCauPhanTich(): Promise<YeuCauPhanTichXuHuong[]> {
    return this.phanTichXuHuongRepository.layDanhSachYeuCau();
  }

  private kiemTraQuyenQuanLy(quanLyId: number): void {
    if (!Number.isInteger(quanLyId) || quanLyId <= 0) {
      throw new ValidationError('Quản lý không hợp lệ', [
        { field: 'quanLyId', code: 'INVALID_MANAGER_ID' },
      ]);
    }
  }

  private kiemTraKhoangNgay(ngayBatDau: string, ngayKetThuc: string): void {
    const soNgay = tinhSoNgay(ngayBatDau, ngayKetThuc);

    if (soNgay <= 0) {
      throw new ValidationError('Khoảng thời gian phân tích không hợp lệ', [
        { field: 'ngayKetThuc', code: 'END_DATE_BEFORE_START_DATE' },
      ]);
    }

    if (soNgay < SO_NGAY_TOI_THIEU_DE_PHAN_TICH) {
      throw new ValidationError('Khoảng thời gian phải tối thiểu 30 ngày', [
        { field: 'ngayKetThuc', code: 'DATE_RANGE_TOO_SHORT' },
      ]);
    }
  }
}

const phanTichXuHuongService = new PhanTichXuHuongService();

export { PhanTichXuHuongService, phanTichXuHuongService };
