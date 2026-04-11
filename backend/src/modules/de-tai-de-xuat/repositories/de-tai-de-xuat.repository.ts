import { Prisma, PrismaClient } from '@prisma/client';
import {
  GroupStatus,
  MemberJoinStatus,
  TopicCatalogStatus,
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
          mangNghienCuu: true,
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
            mangNghienCuu: true,
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

  async timDanhSachDeTaiDeXuatTheoMangVaGiangVien(
    mangNghienCuuId: bigint,
    giangVienId: bigint,
    coSoDuLieu: CoSoDuLieu = this.prisma
  ) {
    return coSoDuLieu.danhMucDeTaiGiangVien.findMany({
      where: {
        mangNghienCuuId,
        giangVienId,
        trangThai: TopicCatalogStatus.ACTIVE,
      },
      orderBy: [{ ngayTao: 'desc' }],
    });
  }

  async timDanhMucDeTaiTheoId(deTaiId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma) {
    return coSoDuLieu.danhMucDeTaiGiangVien.findUnique({
      where: { id: deTaiId },
      include: {
        giangVien: true,
        mangNghienCuu: true,
      },
    });
  }

  async taoDanhMucDeTaiGiangVien(
    duLieu: {
      giangVienId: bigint;
      mangNghienCuuId: bigint;
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
    return coSoDuLieu.danhMucDeTaiGiangVien.create({
      data: {
        giangVienId: duLieu.giangVienId,
        mangNghienCuuId: duLieu.mangNghienCuuId,
        tenDeTai: duLieu.tenDeTai,
        moTaVanDe: duLieu.moTaVanDe,
        mucTieuNghienCuu: duLieu.mucTieuNghienCuu,
        ungDungThucTien: duLieu.ungDungThucTien,
        phamViNghienCuu: duLieu.phamViNghienCuu,
        congNgheSuDung: duLieu.congNgheSuDung,
        lyDoLuaChon: duLieu.lyDoLuaChon,
        trangThai: TopicCatalogStatus.ACTIVE,
      },
    });
  }

  async taoDeTaiNghienCuuTuDanhMuc(
    duLieu: {
      nhomNghienCuuId: bigint;
      giangVienId: bigint;
      danhMucDeTaiGiangVienId: bigint;
      tenDeTai: string;
      moTaVanDe: string;
      mucTieuNghienCuu: string;
      ungDungThucTien: string | null;
      phamViNghienCuu: string | null;
      congNgheSuDung: string | null;
      lyDoLuaChon: string | null;
      thoiGianNop: Date;
    },
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.deTaiNghienCuu.create({
      data: {
        nhomNghienCuuId: duLieu.nhomNghienCuuId,
        giangVienId: duLieu.giangVienId,
        danhMucDeTaiGiangVienId: duLieu.danhMucDeTaiGiangVienId,
        tenDeTai: duLieu.tenDeTai,
        loaiDeTai: TopicSource.GIANG_VIEN_DE_XUAT,
        moTaVanDe: duLieu.moTaVanDe,
        mucTieuNghienCuu: duLieu.mucTieuNghienCuu,
        ungDungThucTien: duLieu.ungDungThucTien,
        phamViNghienCuu: duLieu.phamViNghienCuu,
        congNgheSuDung: duLieu.congNgheSuDung,
        lyDoLuaChon: duLieu.lyDoLuaChon,
        trangThai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
        thoiGianNop: duLieu.thoiGianNop,
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

  async xoaDeTaiHienTai(deTaiId: bigint, coSoDuLieu: CoSoDuLieu) {
    return coSoDuLieu.deTaiNghienCuu.delete({
      where: { id: deTaiId },
    });
  }
}

export { CoSoDuLieu, DeTaiDeXuatRepository };
