import { PrismaClient } from '@prisma/client';
import {
  AuditAction,
  AuditEntityType,
  GroupStatus,
  TopicSource,
  TopicSubmissionStatus,
  UserRole,
} from '../../../common/constants';
import { ConflictError, ForbiddenError, NotFoundError } from '../../../common/exceptions';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';
import { nhatKyKiemToanService } from '../../nhat-ky-kiem-toan/services/nhat-ky-kiem-toan.service';
import { thongBaoService } from '../../thong-bao/services/thong-bao.service';
import { CapNhatDeTaiDto } from '../dto/cap-nhat-de-tai.dto';
import { NopDeTaiDto } from '../dto/nop-de-tai.dto';
import { NopDeTaiRepository } from '../repositories/nop-de-tai.repository';
import { DeTaiCuaToiResponse } from '../types/nop-de-tai.types';

function mapDeTai(deTai: NonNullable<DeTaiCuaToiResponse['deTai']>): DeTaiCuaToiResponse['deTai'] {
  return {
    id: deTai.id,
    tenDeTai: deTai.tenDeTai,
    loaiDeTai: deTai.loaiDeTai,
    trangThai: deTai.trangThai,
    moTaVanDe: deTai.moTaVanDe,
    mucTieuNghienCuu: deTai.mucTieuNghienCuu,
    ungDungThucTien: deTai.ungDungThucTien,
    phamViNghienCuu: deTai.phamViNghienCuu,
    congNgheSuDung: deTai.congNgheSuDung,
    lyDoLuaChon: deTai.lyDoLuaChon,
    nhanXetGiangVien: deTai.nhanXetGiangVien,
    ghiChuChinhSua: deTai.ghiChuChinhSua,
    soLanChinhSua: deTai.soLanChinhSua,
    thoiGianNop: deTai.thoiGianNop,
    thoiGianDuyet: deTai.thoiGianDuyet,
    thoiGianChot: deTai.thoiGianChot,
    hanChinhSua: deTai.hanChinhSua,
  };
}

function coTheChinhSuaDeTai(trangThai: string): boolean {
  return trangThai === TopicSubmissionStatus.CAN_CHINH_SUA || trangThai === TopicSubmissionStatus.TU_CHOI;
}

class NopDeTaiService {
  private readonly prisma: PrismaClient;

  constructor(private readonly nopDeTaiRepository: NopDeTaiRepository = new NopDeTaiRepository()) {
    this.prisma = getPrismaClient();
  }

  private kiemTraNhomCoTheLamDeTai(nhom: {
    id: bigint;
    tenNhom: string;
    trangThai: string;
    giangVienId: bigint | null;
  }) {
    if (!nhom.giangVienId) {
      throw new ConflictError({
        message: 'Nhóm chưa có giảng viên hướng dẫn nên chưa thể nộp đề tài',
        errorCode: 'GROUP_HAS_NO_LECTURER',
      });
    }

    if (nhom.trangThai === GroupStatus.DA_CHOT_DE_TAI) {
      throw new ConflictError({
        message: 'Nhóm đã chốt đề tài nên không thể thay đổi',
        errorCode: 'TOPIC_ALREADY_FINALIZED',
      });
    }
  }

  private kiemTraDeTaiConHanChinhSua(hanChinhSua: Date | null) {
    if (hanChinhSua && hanChinhSua.getTime() < Date.now()) {
      throw new ConflictError({
        message: 'Đề tài đã quá hạn chỉnh sửa',
        errorCode: 'TOPIC_EDIT_WINDOW_CLOSED',
      });
    }
  }

  async layDeTaiCuaToi(sinhVienId: bigint): Promise<DeTaiCuaToiResponse> {
    const thanhVien = await this.nopDeTaiRepository.timNhomCuaSinhVien(sinhVienId);
    if (!thanhVien) {
      return {
        nhom: null,
        deTai: null,
        quyenThaoTac: {
          coTheNop: false,
          coTheChinhSua: false,
        },
      };
    }

    const { nhomNghienCuu } = thanhVien;
    const coTheNop = Boolean(nhomNghienCuu.giangVienId) && !nhomNghienCuu.deTai;
    const coTheChinhSua = Boolean(
      nhomNghienCuu.deTai
      && coTheChinhSuaDeTai(nhomNghienCuu.deTai.trangThai)
      && (!nhomNghienCuu.deTai.hanChinhSua || nhomNghienCuu.deTai.hanChinhSua.getTime() >= Date.now())
    );

    return {
      nhom: {
        id: nhomNghienCuu.id,
        tenNhom: nhomNghienCuu.tenNhom,
        trangThai: nhomNghienCuu.trangThai,
        soLuongThanhVien: nhomNghienCuu.soLuongThanhVien,
        tenMang: nhomNghienCuu.mangNghienCuu.tenMang,
        tenGiangVien: nhomNghienCuu.giangVien?.hoTen || null,
      },
      deTai: nhomNghienCuu.deTai ? mapDeTai(nhomNghienCuu.deTai) : null,
      quyenThaoTac: {
        coTheNop,
        coTheChinhSua,
      },
    };
  }

  async nopDeTai(sinhVienId: bigint, input: NopDeTaiDto) {
    const thanhVien = await this.nopDeTaiRepository.timNhomCuaSinhVien(sinhVienId);
    if (!thanhVien) {
      throw new NotFoundError('Sinh viên chưa thuộc nhóm nghiên cứu nào');
    }

    const nhom = thanhVien.nhomNghienCuu;
    this.kiemTraNhomCoTheLamDeTai(nhom);

    if (nhom.deTai) {
      throw new ConflictError({
        message: 'Nhóm đã có đề tài, hãy dùng chức năng chỉnh sửa nếu cần',
        errorCode: 'TOPIC_ALREADY_EXISTS',
      });
    }

    const thoiDiemHienTai = new Date();
    const deTaiMoi = await this.prisma.$transaction(async (giaoDich) => {
      const deTai = await this.nopDeTaiRepository.taoDeTai(
        {
          nhomNghienCuuId: nhom.id,
          giangVienId: nhom.giangVienId!,
          tenDeTai: input.tenDeTai,
          moTaVanDe: input.moTaVanDe,
          mucTieuNghienCuu: input.mucTieuNghienCuu,
          ungDungThucTien: input.ungDungThucTien || null,
          phamViNghienCuu: input.phamViNghienCuu || null,
          congNgheSuDung: input.congNgheSuDung || null,
          lyDoLuaChon: input.lyDoLuaChon || null,
          thoiGianNop: thoiDiemHienTai,
        },
        giaoDich
      );

      await this.nopDeTaiRepository.capNhatTrangThaiNhom(nhom.id, GroupStatus.CHO_DUYET_DE_TAI, giaoDich);

      return deTai;
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.NOP_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: deTaiMoi.id,
        trangThaiSau: {
          trangThai: deTaiMoi.trangThai,
          loaiDeTai: TopicSource.NHOM_DE_XUAT,
        },
        duLieuBoSung: {
          nhomNghienCuuId: nhom.id.toString(),
        },
      }),
      thongBaoService.taoNhieuThongBao([
        {
          nguoiNhanId: nhom.giangVienId!,
          loaiNguoiNhan: UserRole.GIANG_VIEN,
          tieuDe: 'Có đề tài mới chờ duyệt',
          noiDung: `Nhóm ${nhom.tenNhom} vừa nộp đề tài "${deTaiMoi.tenDeTai}".`,
          loaiThongBao: 'NHOM_NOP_DE_TAI',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTaiMoi.id,
        },
      ]),
    ]);

    return mapDeTai(deTaiMoi);
  }

  async capNhatDeTai(sinhVienId: bigint, input: CapNhatDeTaiDto) {
    const thanhVien = await this.nopDeTaiRepository.timNhomCuaSinhVien(sinhVienId);
    if (!thanhVien) {
      throw new NotFoundError('Sinh viên chưa thuộc nhóm nghiên cứu nào');
    }

    const nhom = thanhVien.nhomNghienCuu;
    this.kiemTraNhomCoTheLamDeTai(nhom);

    const deTaiHienTai = await this.nopDeTaiRepository.timDeTaiTheoId(input.deTaiId);
    if (!deTaiHienTai || deTaiHienTai.nhomNghienCuuId !== nhom.id) {
      throw new NotFoundError('Không tìm thấy đề tài của nhóm');
    }

    if (!coTheChinhSuaDeTai(deTaiHienTai.trangThai)) {
      throw new ForbiddenError({
        message: 'Đề tài hiện tại không ở trạng thái cho phép chỉnh sửa',
        errorCode: 'TOPIC_NOT_EDITABLE',
      });
    }

    this.kiemTraDeTaiConHanChinhSua(deTaiHienTai.hanChinhSua);

    const thoiDiemHienTai = new Date();
    const deTaiDaCapNhat = await this.prisma.$transaction(async (giaoDich) => {
      const deTai = await this.nopDeTaiRepository.capNhatDeTai(
        input.deTaiId,
        {
          tenDeTai: input.tenDeTai,
          moTaVanDe: input.moTaVanDe,
          mucTieuNghienCuu: input.mucTieuNghienCuu,
          ungDungThucTien: input.ungDungThucTien || null,
          phamViNghienCuu: input.phamViNghienCuu || null,
          congNgheSuDung: input.congNgheSuDung || null,
          lyDoLuaChon: input.lyDoLuaChon || null,
          thoiGianNop: thoiDiemHienTai,
          soLanChinhSuaTangThem: 1,
        },
        giaoDich
      );

      await this.nopDeTaiRepository.capNhatTrangThaiNhom(nhom.id, GroupStatus.CHO_DUYET_DE_TAI, giaoDich);

      return deTai;
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.CHINH_SUA_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: deTaiDaCapNhat.id,
        trangThaiTruoc: {
          trangThai: deTaiHienTai.trangThai,
          soLanChinhSua: deTaiHienTai.soLanChinhSua,
        },
        trangThaiSau: {
          trangThai: deTaiDaCapNhat.trangThai,
          soLanChinhSua: deTaiHienTai.soLanChinhSua + 1,
        },
      }),
      thongBaoService.taoNhieuThongBao([
        {
          nguoiNhanId: nhom.giangVienId!,
          loaiNguoiNhan: UserRole.GIANG_VIEN,
          tieuDe: 'Nhóm đã cập nhật đề tài',
          noiDung: `Nhóm ${nhom.tenNhom} vừa gửi lại đề tài "${deTaiDaCapNhat.tenDeTai}".`,
          loaiThongBao: 'NHOM_CAP_NHAT_DE_TAI',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTaiDaCapNhat.id,
        },
      ]),
    ]);

    return mapDeTai(deTaiDaCapNhat);
  }
}

const nopDeTaiService = new NopDeTaiService();

export { NopDeTaiService, nopDeTaiService };
