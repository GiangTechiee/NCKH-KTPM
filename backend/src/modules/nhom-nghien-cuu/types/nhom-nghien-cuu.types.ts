interface ThanhVienNhomResponse {
  id: bigint;
  sinhVienId: bigint;
  maSinhVien: string;
  hoTen: string;
  vaiTro: string;
  trangThaiThamGia: string;
  thoiGianThamGia: Date | null;
}

interface LoiMoiDaGuiResponse {
  id: bigint;
  sinhVienDuocMoiId: bigint;
  maSinhVien: string;
  hoTen: string;
  trangThai: string;
  thoiGianMoi: Date;
}

interface NhomCuaToiResponse {
  id: bigint;
  tenNhom: string;
  trangThai: string;
  soLuongThanhVien: number;
  mangNghienCuu: {
    id: bigint;
    tenMang: string;
    maMang: string;
  };
  giangVien: {
    id: bigint;
    hoTen: string;
    maGiangVien: string;
  } | null;
  thanhVien: ThanhVienNhomResponse[];
  loiMoiDaGui: LoiMoiDaGuiResponse[];
}

export type { ThanhVienNhomResponse, LoiMoiDaGuiResponse, NhomCuaToiResponse };
