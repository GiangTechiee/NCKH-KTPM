import { Prisma, PrismaClient } from '@prisma/client';
import { MemberJoinStatus, RegistrationStatus, ResearchAreaStatus } from '../../../common/constants';
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
            dangKyMang: {
              where: { trangThai: RegistrationStatus.REGISTERED },
            },
            nhomNghienCuu: true,
          },
        },
      },
      orderBy: [{ thoiGianDongDangKy: 'asc' }, { tenMang: 'asc' }],
    });
  }

  async demSoNhomTheoMang(mangNghienCuuId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma): Promise<number> {
  return coSoDuLieu.nhomNghienCuu.count({
    where: { mangNghienCuuId },
  });
}

async timDanhSachNhomTheoMang(mangNghienCuuId: bigint) {
  return this.prisma.nhomNghienCuu.findMany({
    where: { mangNghienCuuId },
    include: {
      thanhVien: {
        where: {
          trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
        },
        include: {
          sinhVien: true,
        },
        orderBy: [{ vaiTro: 'asc' }, { ngayTao: 'asc' }],
      },
    },
    orderBy: [{ soLuongThanhVien: 'asc' }, { ngayTao: 'asc' }],
  });
}

  async timDangKyHienTaiTrongDotMo(sinhVienId: bigint, thoiDiem: Date) {
    return this.prisma.sinhVienDangKyMang.findFirst({
      where: {
        sinhVienId,
        trangThai: RegistrationStatus.REGISTERED,
        mangNghienCuu: {
          trangThai: ResearchAreaStatus.OPEN,
          thoiGianMoDangKy: { lte: thoiDiem },
          thoiGianDongDangKy: { gte: thoiDiem },
        },
      },
      include: {
        mangNghienCuu: {
          select: {
            id: true,
            maMang: true,
            tenMang: true,
            moTa: true,
            thoiGianMoDangKy: true,
            thoiGianDongDangKy: true,
            trangThai: true,
          },
        },
      },
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
        trangThai: RegistrationStatus.REGISTERED,
      },
    });
  }

  async capNhatTrangThaiDangKy(
    dangKyId: bigint,
    trangThaiMoi: string,
    coSoDuLieu: CoSoDuLieu = this.prisma
  ) {
    return coSoDuLieu.sinhVienDangKyMang.update({
      where: { id: dangKyId },
      data: { trangThai: trangThaiMoi },
    });
  }

  async timDangKyTheoId(dangKyId: bigint) {
    return this.prisma.sinhVienDangKyMang.findUnique({
      where: { id: dangKyId },
      include: {
        mangNghienCuu: {
          select: {
            id: true,
            maMang: true,
            tenMang: true,
            moTa: true,
            thoiGianMoDangKy: true,
            thoiGianDongDangKy: true,
            trangThai: true,
          },
        },
      },
    });
  }
}

export { DangKyMangNghienCuuRepository, CoSoDuLieu };
