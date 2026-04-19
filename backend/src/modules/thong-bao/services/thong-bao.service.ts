import { NotFoundError } from '../../../common/exceptions';
import { ThongBaoRepository } from '../repositories/thong-bao.repository';
import { TaoThongBaoInput, ThongBaoNguoiNhanHienTai, ThongBaoResponse } from '../types/thong-bao.types';

function mapThongBao(thongBao: {
  id: bigint;
  tieuDe: string;
  noiDung: string;
  loaiThongBao: string;
  loaiDoiTuong: string | null;
  doiTuongId: bigint | null;
  daDoc: boolean;
  thoiGianDoc: Date | null;
  ngayTao: Date;
}): ThongBaoResponse {
  return {
    id: thongBao.id,
    title: thongBao.tieuDe,
    content: thongBao.noiDung,
    type: thongBao.loaiThongBao,
    isRead: thongBao.daDoc,
    readAt: thongBao.thoiGianDoc,
    createdAt: thongBao.ngayTao,
    linkedObject: thongBao.loaiDoiTuong && thongBao.doiTuongId
      ? {
          loaiDoiTuong: thongBao.loaiDoiTuong,
          doiTuongId: thongBao.doiTuongId,
        }
      : null,
  };
}

class ThongBaoService {
  constructor(private readonly thongBaoRepository: ThongBaoRepository = new ThongBaoRepository()) {}

  async taoNhieuThongBao(danhSachThongBao: TaoThongBaoInput[]): Promise<void> {
    await this.thongBaoRepository.taoNhieuThongBao(danhSachThongBao);
  }

  async lietKeThongBaoCuaNguoiNhan(nguoiNhan: ThongBaoNguoiNhanHienTai): Promise<ThongBaoResponse[]> {
    const danhSachThongBao = await this.thongBaoRepository.lietKeThongBaoTheoNguoiNhan(nguoiNhan);
    return danhSachThongBao.map(mapThongBao);
  }

  async danhDauThongBaoDaDoc(nguoiNhan: ThongBaoNguoiNhanHienTai, thongBaoId: bigint): Promise<ThongBaoResponse> {
    const thongBao = await this.thongBaoRepository.timThongBaoTheoIdVaNguoiNhan(thongBaoId, nguoiNhan);

    if (!thongBao) {
      throw new NotFoundError('Không tìm thấy thông báo');
    }

    if (thongBao.daDoc) {
      return mapThongBao(thongBao);
    }

    const thongBaoDaCapNhat = await this.thongBaoRepository.danhDauDaDoc(thongBaoId, new Date());
    return mapThongBao(thongBaoDaCapNhat);
  }
}

const thongBaoService = new ThongBaoService();

export { ThongBaoService, thongBaoService };
