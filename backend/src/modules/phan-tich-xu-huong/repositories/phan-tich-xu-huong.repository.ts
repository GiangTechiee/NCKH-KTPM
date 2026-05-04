import {
  KhaDungDuLieuPhanTich,
  LoaiPhanTichXuHuong,
  TrangThaiYeuCauPhanTich,
  YeuCauPhanTichXuHuong,
} from '../types/phan-tich-xu-huong.types';

interface TaoYeuCauPhanTichInput {
  quanLyId: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  loaiPhanTich: LoaiPhanTichXuHuong;
  trangThai: TrangThaiYeuCauPhanTich;
}

const danhSachYeuCauPhanTich: YeuCauPhanTichXuHuong[] = [];

function tinhSoNgay(ngayBatDau: string, ngayKetThuc: string): number {
  const batDau = new Date(ngayBatDau);
  const ketThuc = new Date(ngayKetThuc);
  const soMsMotNgay = 24 * 60 * 60 * 1000;

  return Math.floor((ketThuc.getTime() - batDau.getTime()) / soMsMotNgay) + 1;
}

class PhanTichXuHuongRepository {
  async kiemTraDuLieuKhaDung(ngayBatDau: string, ngayKetThuc: string): Promise<KhaDungDuLieuPhanTich> {
    const soNgayDuLieu = tinhSoNgay(ngayBatDau, ngayKetThuc);

    return {
      duDieuKien: soNgayDuLieu >= 30,
      soNgayDuLieu,
    };
  }

  async taoYeuCauPhanTich(input: TaoYeuCauPhanTichInput): Promise<YeuCauPhanTichXuHuong> {
    const yeuCau: YeuCauPhanTichXuHuong = {
      id: danhSachYeuCauPhanTich.length + 1,
      quanLyId: input.quanLyId,
      ngayBatDau: input.ngayBatDau,
      ngayKetThuc: input.ngayKetThuc,
      loaiPhanTich: input.loaiPhanTich,
      trangThai: input.trangThai,
      thoiGianTao: new Date(),
    };

    danhSachYeuCauPhanTich.push(yeuCau);
    return yeuCau;
  }

  async layDanhSachYeuCau(): Promise<YeuCauPhanTichXuHuong[]> {
    return [...danhSachYeuCauPhanTich];
  }
}

export { PhanTichXuHuongRepository };
