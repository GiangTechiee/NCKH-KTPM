import { Prisma, PrismaClient } from '@prisma/client';
import { InvitationStatus, MAX_GROUP_MEMBERS, MemberJoinStatus } from '../../../common/constants';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';

type CoSoDuLieu = PrismaClient | Prisma.TransactionClient;

class GhepNhomRepository {
  private readonly prisma = getPrismaClient();

  async timDangKyMangGanNhat(sinhVienId: bigint) {
    return this.prisma.sinhVienDangKyMang.findFirst({
      where: { sinhVienId },
      orderBy: { thoiGianDangKy: 'desc' },
    });
  }

  async timNhomDangThamGia(sinhVienId: bigint) {
    return this.prisma.thanhVienNhomNghienCuu.findFirst({
      where: {
        sinhVienId,
        trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
      },
      include: {
        nhomNghienCuu: true,
      },
    });
  }

  async timSinhVienPhuHop(mangNghienCuuId: bigint, sinhVienLoaiTruId: bigint) {
    return this.prisma.sinhVien.findMany({
      where: {
        id: { not: sinhVienLoaiTruId },
        dangKyMang: {
          some: {
            mangNghienCuuId,
          },
        },
        thanhVienNhom: {
          none: {
            trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          },
        },
      },
      orderBy: { hoTen: 'asc' },
      take: 10,
    });
  }

  async timNhomPhuHop(mangNghienCuuId: bigint, sinhVienLoaiTruId: bigint) {
    return this.prisma.nhomNghienCuu.findMany({
      where: {
        mangNghienCuuId,
        soLuongThanhVien: { lt: MAX_GROUP_MEMBERS },
        thanhVien: {
          none: {
            sinhVienId: sinhVienLoaiTruId,
            trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          },
        },
      },
      include: {
        truongNhom: true,
      },
      orderBy: [{ soLuongThanhVien: 'desc' }, { ngayTao: 'asc' }],
      take: 10,
    });
  }

  async timLoiMoiDaNhan(sinhVienId: bigint) {
    return this.prisma.loiMoiNhom.findMany({
      where: {
        sinhVienDuocMoiId: sinhVienId,
      },
      include: {
        nhomNghienCuu: true,
        nguoiMoi: true,
      },
      orderBy: { thoiGianMoi: 'desc' },
      take: 10,
    });
  }

  async timLoiMoiTheoId(loiMoiId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma) {
    return coSoDuLieu.loiMoiNhom.findUnique({
      where: { id: loiMoiId },
      include: {
        nhomNghienCuu: true,
      },
    });
  }

  async capNhatLoiMoi(
    loiMoiId: bigint,
    duLieu: { trangThai: string; lyDoTuChoi?: string | null; thoiGianPhanHoi: Date },
    coSoDuLieu: CoSoDuLieu = this.prisma
  ) {
    return coSoDuLieu.loiMoiNhom.update({
      where: { id: loiMoiId },
      data: {
        trangThai: duLieu.trangThai,
        lyDoTuChoi: duLieu.lyDoTuChoi,
        thoiGianPhanHoi: duLieu.thoiGianPhanHoi,
      },
    });
  }

  async demThanhVienDaChapNhan(nhomNghienCuuId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma): Promise<number> {
    return coSoDuLieu.thanhVienNhomNghienCuu.count({
      where: {
        nhomNghienCuuId,
        trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
      },
    });
  }

  async timThanhVienTheoNhomVaSinhVien(nhomNghienCuuId: bigint, sinhVienId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma) {
    return coSoDuLieu.thanhVienNhomNghienCuu.findUnique({
      where: {
        nhomNghienCuuId_sinhVienId: {
          nhomNghienCuuId,
          sinhVienId,
        },
      },
    });
  }

  async taoThanhVienNhom(
    duLieu: {
      nhomNghienCuuId: bigint;
      sinhVienId: bigint;
      vaiTro: string;
      trangThaiThamGia: string;
      thoiGianThamGia: Date;
    },
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.thanhVienNhomNghienCuu.create({ data: duLieu });
  }

  async capNhatSoLuongVaTrangThaiNhom(
    nhomNghienCuuId: bigint,
    soLuongThanhVien: number,
    trangThai: string,
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.nhomNghienCuu.update({
      where: { id: nhomNghienCuuId },
      data: {
        soLuongThanhVien,
        trangThai,
      },
    });
  }

  async huyCacLoiMoiChoPhanHoiKhacCuaSinhVien(
    sinhVienId: bigint,
    loiMoiDangXuLyId: bigint,
    coSoDuLieu: CoSoDuLieu
  ) {
    await coSoDuLieu.loiMoiNhom.updateMany({
      where: {
        sinhVienDuocMoiId: sinhVienId,
        id: { not: loiMoiDangXuLyId },
        trangThai: InvitationStatus.CHO_XAC_NHAN,
      },
      data: {
        trangThai: InvitationStatus.DA_HUY,
      },
    });
  }
}

export { GhepNhomRepository, CoSoDuLieu };
