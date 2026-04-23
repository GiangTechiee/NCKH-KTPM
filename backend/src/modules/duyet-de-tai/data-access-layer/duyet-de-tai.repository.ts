import { Prisma, PrismaClient } from '@prisma/client';
import { TopicSubmissionStatus } from '../../../common/constants';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';

type CoSoDuLieu = PrismaClient | Prisma.TransactionClient;

class DuyetDeTaiRepository {
  private readonly prisma = getPrismaClient();

  async timDeTaiChoDuyetCuaGiangVien(giangVienId: bigint) {
    return this.prisma.deTaiNghienCuu.findMany({
      where: {
        giangVienId,
        trangThai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
      },
      include: {
        nhomNghienCuu: {
          include: {
            mangNghienCuu: true,
            thanhVien: {
              include: { sinhVien: true },
              orderBy: [{ vaiTro: 'asc' }, { ngayTao: 'asc' }],
            },
          },
        },
      },
      orderBy: [{ thoiGianNop: 'asc' }, { ngayTao: 'asc' }],
    });
  }

  async timDeTaiTheoId(deTaiId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma) {
    return coSoDuLieu.deTaiNghienCuu.findUnique({
      where: { id: deTaiId },
      include: {
        nhomNghienCuu: {
          include: {
            mangNghienCuu: true,
            thanhVien: {
              include: { sinhVien: true },
              orderBy: [{ vaiTro: 'asc' }, { ngayTao: 'asc' }],
            },
          },
        },
      },
    });
  }

  async capNhatKetQuaDuyet(
    deTaiId: bigint,
    duLieu: {
      trangThai: string;
      nhanXetGiangVien: string | null;
      ghiChuChinhSua: string | null;
      thoiGianDuyet: Date;
      hanChinhSua: Date | null;
    },
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.deTaiNghienCuu.update({
      where: { id: deTaiId },
      data: duLieu,
    });
  }

  async chotDeTai(deTaiId: bigint, thoiGianChot: Date, coSoDuLieu: CoSoDuLieu) {
    return coSoDuLieu.deTaiNghienCuu.update({
      where: { id: deTaiId },
      data: {
        trangThai: TopicSubmissionStatus.DA_CHOT,
        thoiGianChot,
      },
    });
  }

  async capNhatTrangThaiNhom(nhomNghienCuuId: bigint, trangThai: string, coSoDuLieu: CoSoDuLieu) {
    return coSoDuLieu.nhomNghienCuu.update({
      where: { id: nhomNghienCuuId },
      data: { trangThai },
    });
  }
}

export { CoSoDuLieu, DuyetDeTaiRepository };
