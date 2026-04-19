interface GoiYSinhVienResponse {
  id: bigint;
  maSinhVien: string;
  hoTen: string;
  tenLop: string | null;
  tenKhoa: string | null;
}

interface GoiYNhomResponse {
  id: bigint;
  tenNhom: string;
  soLuongThanhVien: number;
  truongNhom: {
    id: bigint;
    hoTen: string;
    maSinhVien: string;
  };
}

interface GoiYGhepNhomResponse {
  sinhVienPhuHop: GoiYSinhVienResponse[];
  nhomPhuHop: GoiYNhomResponse[];
  loiMoiDaNhan: Array<{
    id: bigint;
    nhomNghienCuuId: bigint;
    tenNhom: string;
    nguoiMoi: {
      id: bigint;
      hoTen: string;
      maSinhVien: string;
    };
    trangThai: string;
    thoiGianMoi: Date;
  }>;
}

export type { GoiYGhepNhomResponse };
