import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';
import { TaoThongBaoInput, ThongBaoNguoiNhanHienTai } from '../types/thong-bao.types';

class ThongBaoRepository {
  private readonly prisma = getPrismaClient();

  async taoNhieuThongBao(danhSachThongBao: TaoThongBaoInput[]): Promise<void> {
    if (danhSachThongBao.length === 0) {
      return;
    }

    await this.prisma.thongBao.createMany({
      data: danhSachThongBao.map((thongBao) => ({
        nguoiNhanId: thongBao.nguoiNhanId,
        loaiNguoiNhan: thongBao.loaiNguoiNhan,
        tieuDe: thongBao.tieuDe,
        noiDung: thongBao.noiDung,
        loaiThongBao: thongBao.loaiThongBao,
        loaiDoiTuong: thongBao.loaiDoiTuong,
        doiTuongId: thongBao.doiTuongId,
        })),
      });
    }

  async lietKeThongBaoTheoNguoiNhan(nguoiNhan: ThongBaoNguoiNhanHienTai) {
    return this.prisma.thongBao.findMany({
      where: {
        nguoiNhanId: nguoiNhan.nguoiNhanId,
        loaiNguoiNhan: nguoiNhan.loaiNguoiNhan,
      },
      orderBy: {
        ngayTao: 'desc',
      },
      select: {
        id: true,
        tieuDe: true,
        noiDung: true,
        loaiThongBao: true,
        loaiDoiTuong: true,
        doiTuongId: true,
        daDoc: true,
        thoiGianDoc: true,
        ngayTao: true,
      },
    });
  }

  async timThongBaoTheoIdVaNguoiNhan(id: bigint, nguoiNhan: ThongBaoNguoiNhanHienTai) {
    return this.prisma.thongBao.findFirst({
      where: {
        id,
        nguoiNhanId: nguoiNhan.nguoiNhanId,
        loaiNguoiNhan: nguoiNhan.loaiNguoiNhan,
      },
      select: {
        id: true,
        tieuDe: true,
        noiDung: true,
        loaiThongBao: true,
        loaiDoiTuong: true,
        doiTuongId: true,
        daDoc: true,
        thoiGianDoc: true,
        ngayTao: true,
      },
    });
  }

  async danhDauDaDoc(id: bigint, thoiGianDoc: Date) {
    return this.prisma.thongBao.update({
      where: { id },
      data: {
        daDoc: true,
        thoiGianDoc,
      },
      select: {
        id: true,
        tieuDe: true,
        noiDung: true,
        loaiThongBao: true,
        loaiDoiTuong: true,
        doiTuongId: true,
        daDoc: true,
        thoiGianDoc: true,
        ngayTao: true,
      },
    });
  }
}

export { ThongBaoRepository };
