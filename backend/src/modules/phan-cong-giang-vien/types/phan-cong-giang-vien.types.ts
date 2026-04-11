interface NhomUngVienHuongDanResponse {
  id: bigint;
  tenNhom: string;
  trangThai: string;
  soLuongThanhVien: number;
  mangNghienCuu: {
    id: bigint;
    maMang: string;
    tenMang: string;
  };
  truongNhom: {
    id: bigint;
    maSinhVien: string;
    hoTen: string;
  };
  thanhVien: Array<{
    id: bigint;
    maSinhVien: string;
    hoTen: string;
    vaiTro: string;
  }>;
  phuHopChuyenMon: boolean;
}

interface ChiTietNhomUngVienResponse extends NhomUngVienHuongDanResponse {
  giangVienHuongDan: {
    id: bigint;
    maGiangVien: string;
    hoTen: string;
  } | null;
}

interface DeTaiTomTatNhomDangHuongDanResponse {
  id: bigint;
  tenDeTai: string;
  trangThai: string;
  loaiDeTai: string;
  soLanChinhSua: number;
  thoiGianNop: Date | null;
  thoiGianDuyet: Date | null;
  thoiGianChot: Date | null;
}

interface NhomDangHuongDanResponse extends ChiTietNhomUngVienResponse {
  deTai: DeTaiTomTatNhomDangHuongDanResponse | null;
}

export type {
  ChiTietNhomUngVienResponse,
  DeTaiTomTatNhomDangHuongDanResponse,
  NhomDangHuongDanResponse,
  NhomUngVienHuongDanResponse,
};
