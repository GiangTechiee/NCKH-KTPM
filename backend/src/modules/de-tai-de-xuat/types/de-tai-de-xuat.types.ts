export interface DeTaiDeXuatResponse {
  id: bigint;
  tenDeTai: string;
  loaiDeTai: string;
  trangThai: string;
  moTaVanDe: string;
  mucTieuNghienCuu: string;
  ungDungThucTien: string | null;
  phamViNghienCuu: string | null;
  congNgheSuDung: string | null;
  lyDoLuaChon: string | null;
  thoiGianNop: Date | null;
  nhom: {
    id: bigint;
    tenNhom: string;
    trangThai: string;
    thanhVien: Array<{
      id: bigint;
      maSinhVien: string;
      hoTen: string;
      vaiTro: string;
    }>;
  };
}

export interface ChonDeTaiDeXuatResponse extends DeTaiDeXuatResponse {
  daChon: boolean;
}
