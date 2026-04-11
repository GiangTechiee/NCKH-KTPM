export interface CapNhatDeTaiDto {
  deTaiId: bigint;
  tenDeTai: string;
  moTaVanDe: string;
  mucTieuNghienCuu: string;
  ungDungThucTien?: string | null;
  phamViNghienCuu?: string | null;
  congNgheSuDung?: string | null;
  lyDoLuaChon?: string | null;
}
