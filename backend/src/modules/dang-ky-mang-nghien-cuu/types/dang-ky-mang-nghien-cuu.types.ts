interface MangNghienCuuDangMoResponse {
  id: bigint;
  maMang: string;
  tenMang: string;
  moTa: string | null;
  thoiGianMoDangKy: Date;
  thoiGianDongDangKy: Date;
  trangThai: string;
  soLuongDaDangKy: number;
  soLuongNhomHienTai: number;
  gioiHanSoNhom: number;
}

interface DangKyMangResponse {
  id: bigint;
  sinhVienId: bigint;
  mangNghienCuuId: bigint;
  thoiGianDangKy: Date;
  trangThai: string;
}

interface DangKyHienTaiResponse {
  id: bigint;
  sinhVienId: bigint;
  mangNghienCuuId: bigint;
  thoiGianDangKy: Date;
  trangThai: string;
  mangNghienCuu: {
    id: bigint;
    maMang: string;
    tenMang: string;
    moTa: string | null;
    thoiGianMoDangKy: Date;
    thoiGianDongDangKy: Date;
    trangThai: string;
  };
}

interface ChuyenMangResponse {
  dangKyMoi: DangKyMangResponse;
  dangKyCuDaHuy: {
    id: bigint;
    mangNghienCuuId: bigint;
    tenMangCu: string;
  };
}

interface HuyDangKyResponse {
  id: bigint;
  mangNghienCuuId: bigint;
  trangThai: string;
  tenMang: string;
}

export type {
  MangNghienCuuDangMoResponse,
  DangKyMangResponse,
  DangKyHienTaiResponse,
  ChuyenMangResponse,
  HuyDangKyResponse,
  NhomTheoMangResponse,
  LuaChonNhomTheoMangResponse,
};

interface NhomTheoMangResponse {
  id: bigint;
  tenNhom: string;
  soLuongThanhVien: number;
  coTheThamGia: boolean;
  truongNhom: {
    maSinhVien: string;
    hoTen: string;
  } | null;
}

interface LuaChonNhomTheoMangResponse {
  mangNghienCuuId: bigint;
  soLuongNhomHienTai: number;
  gioiHanSoNhom: number;
  coTheTaoNhomMoi: boolean;
  nhomHienCo: NhomTheoMangResponse[];
}