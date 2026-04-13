import { MemberJoinStatus } from '../../../common/constants';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';

class NguoiDungRepository {
  private readonly prisma = getPrismaClient();

  async timSinhVienTheoMa(maSinhVien: string) {
    return this.prisma.sinhVien.findUnique({
      where: { maSinhVien },
    });
  }

  async timGiangVienTheoMa(maGiangVien: string) {
    return this.prisma.giangVien.findUnique({
      where: { maGiangVien },
    });
  }

  async lietKeTaiKhoanSinhVien() {
    return this.prisma.sinhVien.findMany({
      orderBy: { maSinhVien: 'asc' },
      select: {
        maSinhVien: true,
        hoTen: true,
        tenLop: true,
        tenKhoa: true,
        dangKyMang: {
          orderBy: { thoiGianDangKy: 'desc' },
          take: 1,
          select: {
            trangThai: true,
            mangNghienCuu: {
              select: {
                maMang: true,
                tenMang: true,
              },
            },
          },
        },
        thanhVienNhom: {
          where: {
            trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          },
          orderBy: { ngayTao: 'desc' },
          take: 1,
          select: {
            nhomNghienCuu: {
              select: {
                tenNhom: true,
                trangThai: true,
                deTai: {
                  select: {
                    tenDeTai: true,
                    trangThai: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async lietKeTaiKhoanGiangVien() {
    return this.prisma.giangVien.findMany({
      orderBy: { maGiangVien: 'asc' },
      select: {
        maGiangVien: true,
        hoTen: true,
        tenBoMon: true,
        chuyenMon: true,
        soNhomDangHuongDan: true,
        soNhomHuongDanToiDa: true,
        nhomNghienCuu: {
          orderBy: { ngayTao: 'desc' },
          take: 5,
          select: {
            tenNhom: true,
            trangThai: true,
          },
        },
      },
    });
  }
}

export { NguoiDungRepository };
