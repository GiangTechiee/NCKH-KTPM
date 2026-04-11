import { Prisma, PrismaClient } from '@prisma/client';
import { GroupStatus, MemberJoinStatus } from '../../../common/constants';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';

type CoSoDuLieu = PrismaClient | Prisma.TransactionClient;

class PhanCongGiangVienRepository {
  private readonly prisma = getPrismaClient();

  async timDanhSachNhomUngVien() {
    return this.prisma.nhomNghienCuu.findMany({
      where: {
        giangVienId: null,
        trangThai: {
          in: [
            GroupStatus.DANG_TUYEN_THANH_VIEN,
            GroupStatus.DA_DU_THANH_VIEN,
            GroupStatus.CHUA_CO_GIANG_VIEN,
          ],
        },
      },
      include: {
        mangNghienCuu: true,
        truongNhom: true,
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
      orderBy: [{ soLuongThanhVien: 'desc' }, { ngayTao: 'asc' }],
    });
  }

  async timDanhSachNhomDangHuongDan(giangVienId: bigint) {
    return this.prisma.nhomNghienCuu.findMany({
      where: {
        giangVienId,
      },
      include: {
        mangNghienCuu: true,
        truongNhom: true,
        giangVien: true,
        thanhVien: {
          where: {
            trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          },
          include: {
            sinhVien: true,
          },
          orderBy: [{ vaiTro: 'asc' }, { ngayTao: 'asc' }],
        },
        deTai: true,
      },
      orderBy: [{ ngayTao: 'desc' }],
    });
  }

  async timChiTietNhomTheoId(groupId: bigint) {
    return this.prisma.nhomNghienCuu.findUnique({
      where: { id: groupId },
      include: {
        mangNghienCuu: true,
        truongNhom: true,
        giangVien: true,
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
    });
  }

  async capNhatNhomHuongDan(
    groupId: bigint,
    giangVienId: bigint,
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.nhomNghienCuu.update({
      where: { id: groupId },
      data: {
        giangVienId,
        trangThai: GroupStatus.DA_CO_GIANG_VIEN,
      },
    });
  }

  async tangSoNhomDangHuongDan(giangVienId: bigint, coSoDuLieu: CoSoDuLieu) {
    return coSoDuLieu.giangVien.update({
      where: { id: giangVienId },
      data: {
        soNhomDangHuongDan: {
          increment: 1,
        },
      },
    });
  }
}

export { CoSoDuLieu, PhanCongGiangVienRepository };
