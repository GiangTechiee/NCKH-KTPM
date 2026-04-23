import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';
import { TaoNhatKyKiemToanInput } from '../types/nhat-ky-kiem-toan.types';

class NhatKyKiemToanRepository {
  private readonly prisma = getPrismaClient();

  async taoBanGhi(input: TaoNhatKyKiemToanInput): Promise<void> {
    await this.prisma.nhatKyKiemToan.create({
      data: {
        nguoiThucHienId: input.nguoiThucHienId,
        vaiTroNguoiThucHien: input.vaiTroNguoiThucHien,
        hanhDong: input.hanhDong,
        loaiDoiTuong: input.loaiDoiTuong,
        doiTuongId: input.doiTuongId,
        trangThaiTruoc: input.trangThaiTruoc ?? undefined,
        trangThaiSau: input.trangThaiSau ?? undefined,
        duLieuBoSung: input.duLieuBoSung ?? undefined,
      },
    });
  }

  async lietKeTheoDoiTuong(loaiDoiTuong: string, doiTuongId: bigint) {
    return this.prisma.nhatKyKiemToan.findMany({
      where: {
        loaiDoiTuong,
        doiTuongId,
      },
      orderBy: {
        ngayTao: 'desc',
      },
    });
  }
}

export { NhatKyKiemToanRepository };
