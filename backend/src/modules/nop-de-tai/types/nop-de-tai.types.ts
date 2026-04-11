export interface DeTaiTomTatResponse {
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
  thoiGianDuyet: Date | null;
  thoiGianChot: Date | null;
  hanChinhSua: Date | null;
}

export interface DeTaiCuaToiResponse {
  nhom: {
    id: bigint;
    tenNhom: string;
    trangThai: string;
    soLuongThanhVien: number;
    tenMang: string;
    tenGiangVien: string | null;
  } | null;
  deTai: DeTaiTomTatResponse | null;
  quyenThaoTac: {
    coTheNop: boolean;
    coTheChinhSua: boolean;
  };
}
