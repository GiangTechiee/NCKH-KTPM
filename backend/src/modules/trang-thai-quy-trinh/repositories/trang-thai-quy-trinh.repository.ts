import { UserRole } from '../../../common/constants';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';

class TrangThaiQuyTrinhRepository {
  private readonly prisma = getPrismaClient();

  async timTongQuanTienTrinhSinhVien(sinhVienId: bigint) {
    return this.prisma.sinhVien.findUnique({
      where: { id: sinhVienId },
      select: {
        id: true,
        maSinhVien: true,
        hoTen: true,
        tenLop: true,
        tenKhoa: true,
        dangKyMang: {
          orderBy: { thoiGianDangKy: 'desc' },
          take: 1,
          select: {
            id: true,
            trangThai: true,
            thoiGianDangKy: true,
            mangNghienCuu: {
              select: {
                maMang: true,
                tenMang: true,
                thoiGianDongDangKy: true,
              },
            },
          },
        },
        thanhVienNhom: {
          where: {
            trangThaiThamGia: 'DA_CHAP_NHAN',
          },
          orderBy: { ngayTao: 'desc' },
          take: 1,
          select: {
            nhomNghienCuu: {
              select: {
                id: true,
                tenNhom: true,
                trangThai: true,
                soLuongThanhVien: true,
                ngayTao: true,
                giangVien: {
                  select: {
                    id: true,
                    maGiangVien: true,
                    hoTen: true,
                    tenBoMon: true,
                  },
                },
                thanhVien: {
                  where: {
                    trangThaiThamGia: 'DA_CHAP_NHAN',
                  },
                  orderBy: [{ vaiTro: 'asc' }, { ngayTao: 'asc' }],
                  select: {
                    id: true,
                    sinhVienId: true,
                    vaiTro: true,
                    thoiGianThamGia: true,
                    sinhVien: {
                      select: {
                        maSinhVien: true,
                        hoTen: true,
                      },
                    },
                  },
                },
                deTai: {
                  select: {
                    id: true,
                    tenDeTai: true,
                    loaiDeTai: true,
                    trangThai: true,
                    soLanChinhSua: true,
                    nhanXetGiangVien: true,
                    ghiChuChinhSua: true,
                    thoiGianNop: true,
                    thoiGianDuyet: true,
                    thoiGianChot: true,
                    hanChinhSua: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async timTongQuanTienTrinhGiangVien(giangVienId: bigint) {
    return this.prisma.giangVien.findUnique({
      where: { id: giangVienId },
      select: {
        id: true,
        maGiangVien: true,
        hoTen: true,
        tenBoMon: true,
        chuyenMon: true,
        soNhomDangHuongDan: true,
        soNhomHuongDanToiDa: true,
        nhomNghienCuu: {
          where: {
            giangVienId,
          },
          orderBy: [{ ngayTao: 'desc' }],
          select: {
            id: true,
            tenNhom: true,
            trangThai: true,
            soLuongThanhVien: true,
            ngayTao: true,
            mangNghienCuu: {
              select: {
                maMang: true,
                tenMang: true,
              },
            },
            giangVien: {
              select: {
                id: true,
                maGiangVien: true,
                hoTen: true,
                tenBoMon: true,
              },
            },
            thanhVien: {
              where: {
                trangThaiThamGia: 'DA_CHAP_NHAN',
              },
              orderBy: [{ vaiTro: 'asc' }, { ngayTao: 'asc' }],
              select: {
                id: true,
                sinhVienId: true,
                vaiTro: true,
                thoiGianThamGia: true,
                sinhVien: {
                  select: {
                    maSinhVien: true,
                    hoTen: true,
                  },
                },
              },
            },
            deTai: {
              select: {
                id: true,
                tenDeTai: true,
                loaiDeTai: true,
                trangThai: true,
                soLanChinhSua: true,
                nhanXetGiangVien: true,
                ghiChuChinhSua: true,
                thoiGianNop: true,
                thoiGianDuyet: true,
                thoiGianChot: true,
                hanChinhSua: true,
              },
            },
          },
        },
      },
    });
  }

  async lietKeNhatKyLienQuan(input: {
    sinhVienId: bigint;
    dangKyMangId?: bigint;
    nhomNghienCuuId?: bigint;
    deTaiId?: bigint;
  }) {
    const dieuKienOr: Array<Record<string, unknown>> = [
      {
        nguoiThucHienId: input.sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
      },
    ];

    if (input.dangKyMangId) {
      dieuKienOr.push({
        loaiDoiTuong: 'SinhVienDangKyMang',
        doiTuongId: input.dangKyMangId,
      });
    }

    if (input.nhomNghienCuuId) {
      dieuKienOr.push({
        loaiDoiTuong: 'NhomNghienCuu',
        doiTuongId: input.nhomNghienCuuId,
      });
    }

    if (input.deTaiId) {
      dieuKienOr.push({
        loaiDoiTuong: 'DeTaiNghienCuu',
        doiTuongId: input.deTaiId,
      });
    }

    return this.prisma.nhatKyKiemToan.findMany({
      where: {
        OR: dieuKienOr,
      },
      orderBy: {
        ngayTao: 'asc',
      },
      select: {
        id: true,
        ngayTao: true,
        vaiTroNguoiThucHien: true,
        hanhDong: true,
        loaiDoiTuong: true,
        doiTuongId: true,
        trangThaiTruoc: true,
        trangThaiSau: true,
        duLieuBoSung: true,
      },
    });
  }

  async lietKeNhatKyTienTrinhGiangVien(input: {
    nhomNghienCuuIds: bigint[];
    deTaiIds: bigint[];
  }) {
    const dieuKienOr: Array<Record<string, unknown>> = [];

    if (input.nhomNghienCuuIds.length > 0) {
      dieuKienOr.push({
        loaiDoiTuong: 'NhomNghienCuu',
        doiTuongId: { in: input.nhomNghienCuuIds },
      });
    }

    if (input.deTaiIds.length > 0) {
      dieuKienOr.push({
        loaiDoiTuong: 'DeTaiNghienCuu',
        doiTuongId: { in: input.deTaiIds },
      });
    }

    if (dieuKienOr.length === 0) {
      return [];
    }

    return this.prisma.nhatKyKiemToan.findMany({
      where: {
        OR: dieuKienOr,
      },
      orderBy: {
        ngayTao: 'asc',
      },
      select: {
        id: true,
        ngayTao: true,
        vaiTroNguoiThucHien: true,
        hanhDong: true,
        loaiDoiTuong: true,
        doiTuongId: true,
        trangThaiTruoc: true,
        trangThaiSau: true,
        duLieuBoSung: true,
      },
    });
  }
}

export { TrangThaiQuyTrinhRepository };
