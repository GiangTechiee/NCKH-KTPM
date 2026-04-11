import { Prisma, PrismaClient } from '@prisma/client';
import { ResearchAreaStatus } from '../../../common/constants';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';

type CoSoDuLieu = PrismaClient | Prisma.TransactionClient;

class DangKyMangNghienCuuRepository {
  private readonly prisma = getPrismaClient();

  async timDanhSachMangDangMo(thoiDiem: Date) {
    return this.prisma.mangNghienCuu.findMany({
      where: {
        trangThai: ResearchAreaStatus.OPEN,
        thoiGianMoDangKy: { lte: thoiDiem },
        thoiGianDongDangKy: { gte: thoiDiem },
      },
      include: {
        _count: {
          select: {
            dangKyMang: true,
          },
        },
      },
      orderBy: [{ thoiGianDongDangKy: 'asc' }, { tenMang: 'asc' }],
    });
  }

  async timDangKyGanNhatCuaSinhVien(sinhVienId: bigint) {
    return this.prisma.sinhVienDangKyMang.findFirst({
      where: { sinhVienId },
      orderBy: { thoiGianDangKy: 'desc' },
    });
  }

  async timMangTheoId(mangNghienCuuId: bigint) {
    return this.prisma.mangNghienCuu.findUnique({
      where: { id: mangNghienCuuId },
    });
  }

  async taoDangKy(
    duLieu: { sinhVienId: bigint; mangNghienCuuId: bigint; thoiGianDangKy: Date },
    coSoDuLieu: CoSoDuLieu = this.prisma
  ) {
    return coSoDuLieu.sinhVienDangKyMang.create({
      data: {
        sinhVienId: duLieu.sinhVienId,
        mangNghienCuuId: duLieu.mangNghienCuuId,
        thoiGianDangKy: duLieu.thoiGianDangKy,
        trangThai: 'REGISTERED',
      },
    });
  }
}

export { DangKyMangNghienCuuRepository, CoSoDuLieu };
