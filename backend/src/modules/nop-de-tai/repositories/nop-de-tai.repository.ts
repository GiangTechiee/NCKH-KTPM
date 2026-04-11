import { Prisma, PrismaClient } from '@prisma/client';
import { MemberJoinStatus, TopicSource, TopicSubmissionStatus } from '../../../common/constants';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';

type CoSoDuLieu = PrismaClient | Prisma.TransactionClient;

class NopDeTaiRepository {
  private readonly prisma = getPrismaClient();

  async timNhomCuaSinhVien(sinhVienId: bigint) {
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
            deTai: true,
            thanhVien: {
              where: { trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN },
              include: { sinhVien: true },
            },
          },
        },
      },
    });
  }

  async timDeTaiTheoId(deTaiId: bigint, coSoDuLieu: CoSoDuLieu = this.prisma) {
    return coSoDuLieu.deTaiNghienCuu.findUnique({
      where: { id: deTaiId },
      include: {
        nhomNghienCuu: {
          include: {
            giangVien: true,
            mangNghienCuu: true,
            thanhVien: {
              where: { trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN },
              include: { sinhVien: true },
            },
          },
        },
      },
    });
  }

  async taoDeTai(
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
      thoiGianNop: Date;
    },
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.deTaiNghienCuu.create({
      data: {
        nhomNghienCuuId: duLieu.nhomNghienCuuId,
        giangVienId: duLieu.giangVienId,
        tenDeTai: duLieu.tenDeTai,
        loaiDeTai: TopicSource.NHOM_DE_XUAT,
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

  async capNhatDeTai(
    deTaiId: bigint,
    duLieu: {
      tenDeTai: string;
      moTaVanDe: string;
      mucTieuNghienCuu: string;
      ungDungThucTien: string | null;
      phamViNghienCuu: string | null;
      congNgheSuDung: string | null;
      lyDoLuaChon: string | null;
      thoiGianNop: Date;
      soLanChinhSuaTangThem: number;
    },
    coSoDuLieu: CoSoDuLieu
  ) {
    return coSoDuLieu.deTaiNghienCuu.update({
      where: { id: deTaiId },
      data: {
        tenDeTai: duLieu.tenDeTai,
        moTaVanDe: duLieu.moTaVanDe,
        mucTieuNghienCuu: duLieu.mucTieuNghienCuu,
        ungDungThucTien: duLieu.ungDungThucTien,
        phamViNghienCuu: duLieu.phamViNghienCuu,
        congNgheSuDung: duLieu.congNgheSuDung,
        lyDoLuaChon: duLieu.lyDoLuaChon,
        trangThai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
        thoiGianNop: duLieu.thoiGianNop,
        ghiChuChinhSua: null,
        hanChinhSua: null,
        soLanChinhSua: {
          increment: duLieu.soLanChinhSuaTangThem,
        },
      },
    });
  }

  async capNhatTrangThaiNhom(nhomNghienCuuId: bigint, trangThai: string, coSoDuLieu: CoSoDuLieu) {
    return coSoDuLieu.nhomNghienCuu.update({
      where: { id: nhomNghienCuuId },
      data: { trangThai },
    });
  }
}

export { CoSoDuLieu, NopDeTaiRepository };
