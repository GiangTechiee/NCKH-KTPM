import { Prisma, PrismaClient } from '@prisma/client';
import {
  GroupMemberRole,
  GroupStatus,
  InvitationStatus,
  MAX_GROUP_MEMBERS,
  MemberJoinStatus,
} from '../../../common/constants';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';

type CoSoDuLieu = PrismaClient | Prisma.TransactionClient;

class NhomNghienCuuRepository {
  private readonly prisma = getPrismaClient();

  async timDangKyMangGanNhat(sinhVienId: bigint) {
    return this.prisma.sinhVienDangKyMang.findFirst({
      where: { sinhVienId },
      include: { mangNghienCuu: true },
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
        nhomNghienCuu: {
          include: {
            mangNghienCuu: true,
            giangVien: true,
            thanhVien: {
              where: { trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN },
              include: { sinhVien: true },
              orderBy: [{ vaiTro: 'asc' }, { ngayTao: 'asc' }],
            },
            loiMoi: {
              include: {
                sinhVienDuocMoi: true,
              },
              orderBy: { thoiGianMoi: 'desc' },
              take: 10,
            },
          },
        },
      },
    });
  }

  async taoNhom(
    duLieu: { tenNhom: string; mangNghienCuuId: bigint; truongNhomSinhVienId: bigint; thoiDiemTao: Date },
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.nhomNghienCuu.create({
      data: {
        tenNhom: duLieu.tenNhom,
        mangNghienCuuId: duLieu.mangNghienCuuId,
        truongNhomSinhVienId: duLieu.truongNhomSinhVienId,
        trangThai: GroupStatus.DANG_TUYEN_THANH_VIEN,
        soLuongThanhVien: 1,
        ngayTao: duLieu.thoiDiemTao,
      },
    });
  }

  async taoThanhVienNhom(
    duLieu: {
      nhomNghienCuuId: bigint;
      sinhVienId: bigint;
      vaiTro: string;
      trangThaiThamGia: string;
      thoiGianThamGia: Date | null;
    },
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.thanhVienNhomNghienCuu.create({
      data: duLieu,
    });
  }

  async timNhomTheoId(nhomNghienCuuId: bigint) {
    return this.prisma.nhomNghienCuu.findUnique({
      where: { id: nhomNghienCuuId },
      include: {
        mangNghienCuu: true,
        thanhVien: {
          where: { trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN },
          include: { sinhVien: true },
        },
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

  async timLoiMoiChoPhanHoi(nhomNghienCuuId: bigint, sinhVienDuocMoiId: bigint) {
    return this.prisma.loiMoiNhom.findFirst({
      where: {
        nhomNghienCuuId,
        sinhVienDuocMoiId,
        trangThai: InvitationStatus.CHO_XAC_NHAN,
      },
    });
  }

  async taoLoiMoi(
    duLieu: { nhomNghienCuuId: bigint; nguoiMoiSinhVienId: bigint; sinhVienDuocMoiId: bigint; thoiGianMoi: Date }
  ) {
    return this.prisma.loiMoiNhom.create({
      data: {
        nhomNghienCuuId: duLieu.nhomNghienCuuId,
        nguoiMoiSinhVienId: duLieu.nguoiMoiSinhVienId,
        sinhVienDuocMoiId: duLieu.sinhVienDuocMoiId,
        trangThai: InvitationStatus.CHO_XAC_NHAN,
        thoiGianMoi: duLieu.thoiGianMoi,
      },
    });
  }

  async capNhatSoLuongVaTrangThaiNhom(
    nhomNghienCuuId: bigint,
    soLuongThanhVien: number,
    coSoDuLieu: CoSoDuLieu = this.prisma
  ) {
    const trangThai = soLuongThanhVien >= MAX_GROUP_MEMBERS ? GroupStatus.DA_DU_THANH_VIEN : GroupStatus.DANG_TUYEN_THANH_VIEN;

    return coSoDuLieu.nhomNghienCuu.update({
      where: { id: nhomNghienCuuId },
      data: {
        soLuongThanhVien,
        trangThai,
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

  layHangSoThanhVienToiDa(): number {
    return MAX_GROUP_MEMBERS;
  }

  layVaiTroTruongNhom(): string {
    return GroupMemberRole.TRUONG_NHOM;
  }
}

export { NhomNghienCuuRepository, CoSoDuLieu };
