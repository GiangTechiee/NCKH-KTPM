enum LoaiPhanTichXuHuong {
  DANG_KY_MANG = 'DANG_KY_MANG',
  TAO_NHOM = 'TAO_NHOM',
  NOP_DE_TAI = 'NOP_DE_TAI',
}

enum TrangThaiYeuCauPhanTich {
  DA_TAO = 'DA_TAO',
}

interface YeuCauPhanTichXuHuong {
  id: number;
  quanLyId: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  loaiPhanTich: LoaiPhanTichXuHuong;
  trangThai: TrangThaiYeuCauPhanTich;
  thoiGianTao: Date;
}

interface KhaDungDuLieuPhanTich {
  duDieuKien: boolean;
  soNgayDuLieu: number;
}

interface TaoYeuCauPhanTichXuHuongResponse {
  yeuCauId: number;
  trangThai: TrangThaiYeuCauPhanTich;
  message: string;
}

export {
  KhaDungDuLieuPhanTich,
  LoaiPhanTichXuHuong,
  TaoYeuCauPhanTichXuHuongResponse,
  TrangThaiYeuCauPhanTich,
  YeuCauPhanTichXuHuong,
};
