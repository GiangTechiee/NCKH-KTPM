import { Prisma, PrismaClient } from '@prisma/client';
import { GroupStatus, MemberJoinStatus } from '../../../common/constants';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';

type CoSoDuLieu = PrismaClient | Prisma.TransactionClient;

class PhanCongGiangVienRepository {
  private readonly prisma = getPrismaClient();

  private layCoSoDuLieu(coSoDuLieu?: CoSoDuLieu): CoSoDuLieu {
    return coSoDuLieu ?? this.prisma;
  }

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

  async timChiTietNhomTheoId(groupId: bigint, coSoDuLieu?: CoSoDuLieu) {
    return this.layCoSoDuLieu(coSoDuLieu).nhomNghienCuu.findUnique({
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

  async timThongTinHuongDanGiangVien(giangVienId: bigint, coSoDuLieu?: CoSoDuLieu) {
    return this.layCoSoDuLieu(coSoDuLieu).giangVien.findUnique({
      where: { id: giangVienId },
      select: {
        id: true,
        soNhomDangHuongDan: true,
        soNhomHuongDanToiDa: true,
      },
    });
  }

  async ganGiangVienChoNhomNeuHopLe(
    groupId: bigint,
    giangVienId: bigint,
    danhSachTrangThaiHopLe: GroupStatus[],
    coSoDuLieu: CoSoDuLieu
  ) {
    const ketQua = await coSoDuLieu.nhomNghienCuu.updateMany({
      where: {
        id: groupId,
        giangVienId: null,
        trangThai: {
          in: danhSachTrangThaiHopLe,
        },
      },
      data: {
        giangVienId,
        trangThai: GroupStatus.DA_CO_GIANG_VIEN,
      },
    });

    return ketQua.count;
  }

  async tangSoNhomDangHuongDanNeuConSlot(
    giangVienId: bigint,
    soNhomHuongDanToiDa: number,
    coSoDuLieu: CoSoDuLieu
  ) {
    const ketQua = await coSoDuLieu.giangVien.updateMany({
      where: {
        id: giangVienId,
        soNhomDangHuongDan: {
          lt: soNhomHuongDanToiDa,
        },
      },
      data: {
        soNhomDangHuongDan: {
          increment: 1,
        },
      },
    });

    return ketQua.count;
  }
}

export { CoSoDuLieu, PhanCongGiangVienRepository };
