import { Prisma, PrismaClient } from '@prisma/client';
import {
  GroupStatus,
  MemberJoinStatus,
  TopicSource,
  TopicSubmissionStatus,
} from '../../../common/constants';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';

type CoSoDuLieu = PrismaClient | Prisma.TransactionClient;

class DeTaiDeXuatRepository {
  private readonly prisma = getPrismaClient();

  async timChiTietNhomTheoId(groupId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma) {
    return coSoDuLieu.nhomNghienCuu.findUnique({
      where: { id: groupId },
      include: {
        giangVien: true,
        deTai: true,
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

  async timNhomCuaSinhVien(sinhVienId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma) {
    return coSoDuLieu.thanhVienNhomNghienCuu.findFirst({
      where: {
        sinhVienId,
        trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
      },
      include: {
        nhomNghienCuu: {
          include: {
            giangVien: true,
            deTai: true,
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
        },
      },
    });
  }

  async timDanhSachDeTaiDeXuatTheoNhom(groupId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma) {
    return coSoDuLieu.deTaiNghienCuu.findMany({
      where: {
        nhomNghienCuuId: groupId,
        loaiDeTai: TopicSource.GIANG_VIEN_DE_XUAT,
      },
      include: {
        nhomNghienCuu: {
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
        },
      },
      orderBy: [{ ngayTao: 'desc' }],
    });
  }

  async timDeTaiDeXuatTheoId(deTaiId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma) {
    return coSoDuLieu.deTaiNghienCuu.findFirst({
      where: {
        id: deTaiId,
        loaiDeTai: TopicSource.GIANG_VIEN_DE_XUAT,
      },
      include: {
        nhomNghienCuu: {
          include: {
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
        },
      },
    });
  }

  async taoDeTaiDeXuat(
    duLieu: {
      nhomNghienCuuId: bigint;
      giangVienId: bigint;
      tenDeTai: string;
      moTaVanDe: string;
      mucTieuNghienCuu: string;
      ungDungThucTien: string | null;
      phamViNghienCuu: string | null;
      congNgheSuDung: string | null;
      lyDoLuaChon: string | null;
    },
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.deTaiNghienCuu.create({
      data: {
        nhomNghienCuuId: duLieu.nhomNghienCuuId,
        giangVienId: duLieu.giangVienId,
        tenDeTai: duLieu.tenDeTai,
        loaiDeTai: TopicSource.GIANG_VIEN_DE_XUAT,
        moTaVanDe: duLieu.moTaVanDe,
        mucTieuNghienCuu: duLieu.mucTieuNghienCuu,
        ungDungThucTien: duLieu.ungDungThucTien,
        phamViNghienCuu: duLieu.phamViNghienCuu,
        congNgheSuDung: duLieu.congNgheSuDung,
        lyDoLuaChon: duLieu.lyDoLuaChon,
        trangThai: TopicSubmissionStatus.NHAP,
      },
    });
  }

  async capNhatTrangThaiNhom(nhomNghienCuuId: bigint, coSoDuLieu: CoSoDuLieu) {
    return coSoDuLieu.nhomNghienCuu.update({
      where: { id: nhomNghienCuuId },
      data: { trangThai: GroupStatus.DANG_CHON_DE_TAI },
    });
  }

  async capNhatTrangThaiNhomTheoGiaTri(
    nhomNghienCuuId: bigint,
    trangThai: string,
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.nhomNghienCuu.update({
      where: { id: nhomNghienCuuId },
      data: { trangThai },
    });
  }

  async capNhatDeTaiSauKhiChon(deTaiId: bigint, coSoDuLieu: CoSoDuLieu) {
    return coSoDuLieu.deTaiNghienCuu.update({
      where: { id: deTaiId },
      data: {
        trangThai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
        thoiGianNop: new Date(),
      },
    });
  }
}

export { CoSoDuLieu, DeTaiDeXuatRepository };
