interface MangNghienCuuDangMoResponse {
  id: bigint;
  maMang: string;
  tenMang: string;
  moTa: string | null;
  thoiGianMoDangKy: Date;
  thoiGianDongDangKy: Date;
  trangThai: string;
  soLuongDaDangKy: number;
}

interface DangKyMangResponse {
  id: bigint;
  sinhVienId: bigint;
  mangNghienCuuId: bigint;
  thoiGianDangKy: Date;
  trangThai: string;
}

export type { MangNghienCuuDangMoResponse, DangKyMangResponse };
