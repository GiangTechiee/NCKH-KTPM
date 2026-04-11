export interface DeTaiChoDuyetResponse {
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
  nhanXetGiangVien: string | null;
  ghiChuChinhSua: string | null;
  soLanChinhSua: number;
  thoiGianNop: Date | null;
  nhom: {
    id: bigint;
    tenNhom: string;
    trangThai: string;
    tenMang: string;
    thanhVien: Array<{
      id: bigint;
      maSinhVien: string;
      hoTen: string;
      vaiTro: string;
    }>;
  };
}
