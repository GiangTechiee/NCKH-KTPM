import { NhatKyKiemToanRepository } from '../repositories/nhat-ky-kiem-toan.repository';
import { NhatKyKiemToanResponse, TaoNhatKyKiemToanInput } from '../types/nhat-ky-kiem-toan.types';

function mapNhatKyKiemToan(banGhi: {
  id: bigint;
  nguoiThucHienId: bigint;
  vaiTroNguoiThucHien: string;
  hanhDong: string;
  loaiDoiTuong: string;
  doiTuongId: bigint;
  trangThaiTruoc: unknown;
  trangThaiSau: unknown;
  duLieuBoSung: unknown;
  ngayTao: Date;
}): NhatKyKiemToanResponse {
  return {
    id: banGhi.id,
    actorId: banGhi.nguoiThucHienId,
    actorRole: banGhi.vaiTroNguoiThucHien as NhatKyKiemToanResponse['actorRole'],
    action: banGhi.hanhDong as NhatKyKiemToanResponse['action'],
    entityType: banGhi.loaiDoiTuong as NhatKyKiemToanResponse['entityType'],
    entityId: banGhi.doiTuongId,
    oldState: (banGhi.trangThaiTruoc as NhatKyKiemToanResponse['oldState']) ?? null,
    newState: (banGhi.trangThaiSau as NhatKyKiemToanResponse['newState']) ?? null,
    metadata: (banGhi.duLieuBoSung as NhatKyKiemToanResponse['metadata']) ?? null,
    createdAt: banGhi.ngayTao,
  };
}

class NhatKyKiemToanService {
  constructor(
    private readonly nhatKyKiemToanRepository: NhatKyKiemToanRepository = new NhatKyKiemToanRepository()
  ) {}

  async taoBanGhi(input: TaoNhatKyKiemToanInput): Promise<void> {
    await this.nhatKyKiemToanRepository.taoBanGhi(input);
  }

  async lietKeTheoDoiTuong(loaiDoiTuong: string, doiTuongId: bigint): Promise<NhatKyKiemToanResponse[]> {
    const danhSach = await this.nhatKyKiemToanRepository.lietKeTheoDoiTuong(loaiDoiTuong, doiTuongId);
    return danhSach.map(mapNhatKyKiemToan);
  }
}

const nhatKyKiemToanService = new NhatKyKiemToanService();

export { NhatKyKiemToanService, nhatKyKiemToanService };
