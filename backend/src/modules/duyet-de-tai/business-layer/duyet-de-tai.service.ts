import { PrismaClient } from '@prisma/client';
import {
  AuditAction,
  AuditEntityType,
  GroupStatus,
  TopicSubmissionStatus,
  TOPIC_SUBMISSION_STATUS_TRANSITIONS,
  UserRole,
} from '../../../common/constants';
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../../../common/exceptions';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';
import { nhatKyKiemToanService } from '../../nhat-ky-kiem-toan/business-layer/nhat-ky-kiem-toan.service';
import { thongBaoService } from '../../thong-bao/business-layer/thong-bao.service';
import { DuyetDeTaiDto } from '../dto/duyet-de-tai.dto';
import { CoSoDuLieu, DuyetDeTaiRepository } from '../data-access-layer/duyet-de-tai.repository';
import { DeTaiChoDuyetResponse } from '../types/duyet-de-tai.types';

const MAC_DINH_SO_NGAY_CHINH_SUA = 7;

export const QuyetDinhPheDuyet = Object.freeze({
  PHE_DUYET: 'PHE_DUYET',
  YEU_CAU_CHINH_SUA: 'YEU_CAU_CHINH_SUA',
  TU_CHOI: 'TU_CHOI',
} as const);

export type QuyetDinhPheDuyet = (typeof QuyetDinhPheDuyet)[keyof typeof QuyetDinhPheDuyet];

type GiaoDichPrisma = Pick<PrismaClient, '$transaction'>;
type AuditService = Pick<typeof nhatKyKiemToanService, 'taoBanGhi'>;
type NotificationService = Pick<typeof thongBaoService, 'taoNhieuThongBao'>;

interface DoiTrangThaiDeTaiInput {
  deTaiId: bigint;
  trangThaiMoi: TopicSubmissionStatus;
  nguoiThucHienId: bigint;
  thoiDiemCapNhat: Date;
  nhanXetGiangVien: string | null;
  ghiChuChinhSua: string | null;
  hanChinhSua: Date | null;
  coSoDuLieu: CoSoDuLieu;
}

function congNgay(soNgay: number): Date {
  return new Date(Date.now() + soNgay * 24 * 60 * 60 * 1000);
}

function laChuoiCoNoiDung(giaTri: string | null | undefined): boolean {
  return typeof giaTri === 'string' && giaTri.trim().length > 0;
}

function mapDeTaiChoDuyet(deTai: {
  id: bigint;
  tenDeTai: string;
  loaiDeTai: string;
  trangThai: string;
  moTaVanDe: string;
  mucTieuNghienCuu: string;
  ungDungThucTien: string | null;
  phamViNghienCuu: string | null;
  congNgheSuDung: string | null;
  lyDoLuaChon: string | null;
  nhanXetGiangVien: string | null;
  ghiChuChinhSua: string | null;
  soLanChinhSua: number;
  thoiGianNop: Date | null;
  nhomNghienCuu: {
    id: bigint;
    tenNhom: string;
    trangThai: string;
    mangNghienCuu: { tenMang: string };
    thanhVien: Array<{
      id: bigint;
      vaiTro: string;
      sinhVien: { maSinhVien: string; hoTen: string };
    }>;
  };
}): DeTaiChoDuyetResponse {
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
    nhom: {
      id: deTai.nhomNghienCuu.id,
      tenNhom: deTai.nhomNghienCuu.tenNhom,
      trangThai: deTai.nhomNghienCuu.trangThai,
      tenMang: deTai.nhomNghienCuu.mangNghienCuu.tenMang,
      thanhVien: deTai.nhomNghienCuu.thanhVien.map((thanhVien) => ({
        id: thanhVien.id,
        maSinhVien: thanhVien.sinhVien.maSinhVien,
        hoTen: thanhVien.sinhVien.hoTen,
        vaiTro: thanhVien.vaiTro,
      })),
    },
  };
}

class DuyetDeTaiService {
  constructor(
    private readonly duyetDeTaiRepository: DuyetDeTaiRepository = new DuyetDeTaiRepository(),
    private readonly prisma: GiaoDichPrisma = getPrismaClient(),
    private readonly auditService: AuditService = nhatKyKiemToanService,
    private readonly notificationService: NotificationService = thongBaoService
  ) {}

  private kiemTraQuyenDuyet(deTai: Awaited<ReturnType<DuyetDeTaiRepository['timDeTaiTheoId']>>, giangVienId: bigint) {
    if (!deTai) {
      throw new NotFoundError('Không tìm thấy đề tài');
    }

    if (deTai.giangVienId !== giangVienId) {
      throw new ForbiddenError({
        message: 'Giảng viên không có quyền duyệt đề tài này',
        errorCode: 'LECTURER_CANNOT_REVIEW_TOPIC',
      });
    }

    if (deTai.trangThai === TopicSubmissionStatus.DA_CHOT) {
      throw new ConflictError({
        message: 'Đề tài đã chốt nên không thể duyệt lại',
        errorCode: 'TOPIC_ALREADY_FINALIZED',
      });
    }

    if (deTai.trangThai !== TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET) {
      throw new ConflictError({
        message: 'Đề tài không ở trạng thái chờ duyệt',
        errorCode: 'TOPIC_NOT_PENDING_REVIEW',
      });
    }
  }

  batBuocCoNhanXet(quyetDinh: QuyetDinhPheDuyet, nhanXet?: string | null, lyDo?: string | null): boolean {
    if (quyetDinh === QuyetDinhPheDuyet.YEU_CAU_CHINH_SUA || quyetDinh === QuyetDinhPheDuyet.TU_CHOI) {
      return laChuoiCoNoiDung(nhanXet) || laChuoiCoNoiDung(lyDo);
    }

    return laChuoiCoNoiDung(nhanXet);
  }

  private damBaoNhanXetHopLe(quyetDinh: QuyetDinhPheDuyet, nhanXet?: string | null, lyDo?: string | null): void {
    if (this.batBuocCoNhanXet(quyetDinh, nhanXet, lyDo)) {
      return;
    }

    throw new ValidationError('Nhận xét hoặc lý do là bắt buộc cho quyết định này', [
      { field: 'nhanXet', code: 'COMMENT_REQUIRED' },
    ]);
  }

  async doiTrangThai(input: DoiTrangThaiDeTaiInput) {
    const deTai = await this.duyetDeTaiRepository.timDeTaiTheoId(input.deTaiId, input.coSoDuLieu);

    if (!deTai) {
      throw new NotFoundError('Không tìm thấy đề tài');
    }

    if (!Object.values(TopicSubmissionStatus).includes(input.trangThaiMoi)) {
      throw new ValidationError('Trạng thái mới không hợp lệ', [
        { field: 'trangThaiMoi', code: 'INVALID_TOPIC_STATUS' },
      ]);
    }

    const danhSachTrangThaiHopLe = TOPIC_SUBMISSION_STATUS_TRANSITIONS[deTai.trangThai as TopicSubmissionStatus] ?? [];

    if (!danhSachTrangThaiHopLe.includes(input.trangThaiMoi)) {
      throw new ConflictError({
        message: 'Chuyển trạng thái đề tài không hợp lệ',
        errorCode: 'INVALID_TOPIC_STATUS_TRANSITION',
        errors: [{ field: 'trangThaiMoi', code: 'INVALID_TOPIC_STATUS_TRANSITION' }],
      });
    }

    return this.duyetDeTaiRepository.capNhatKetQuaDuyet(
      input.deTaiId,
      {
        trangThai: input.trangThaiMoi,
        nhanXetGiangVien: input.nhanXetGiangVien,
        ghiChuChinhSua: input.ghiChuChinhSua,
        thoiGianDuyet: input.thoiDiemCapNhat,
        hanChinhSua: input.hanChinhSua,
      },
      input.coSoDuLieu
    );
  }

  async layDanhSachDeTaiChoDuyet(giangVienId: bigint): Promise<DeTaiChoDuyetResponse[]> {
    const danhSach = await this.duyetDeTaiRepository.timDeTaiChoDuyetCuaGiangVien(giangVienId);
    return danhSach.map(mapDeTaiChoDuyet);
  }

  async duyetDeTai(giangVienId: bigint, input: DuyetDeTaiDto) {
    const deTai = await this.duyetDeTaiRepository.timDeTaiTheoId(input.deTaiId);
    this.kiemTraQuyenDuyet(deTai, giangVienId);
    this.damBaoNhanXetHopLe(QuyetDinhPheDuyet.PHE_DUYET, input.nhanXet);

    const thoiDiemDuyet = new Date();
    const deTaiDaDuyet = await this.prisma.$transaction(async (giaoDich) => {
      const deTaiCapNhat = await this.doiTrangThai({
        deTaiId: input.deTaiId,
        trangThaiMoi: TopicSubmissionStatus.DA_DUYET,
        nguoiThucHienId: giangVienId,
        thoiDiemCapNhat: thoiDiemDuyet,
        nhanXetGiangVien: input.nhanXet || null,
        ghiChuChinhSua: null,
        hanChinhSua: null,
        coSoDuLieu: giaoDich,
      });

      await this.duyetDeTaiRepository.capNhatTrangThaiNhom(
        deTai!.nhomNghienCuuId,
        GroupStatus.DA_DUYET_DE_TAI,
        giaoDich
      );

      return deTaiCapNhat;
    });

    await Promise.all([
      this.auditService.taoBanGhi({
        nguoiThucHienId: giangVienId,
        vaiTroNguoiThucHien: UserRole.GIANG_VIEN,
        hanhDong: AuditAction.DUYET_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: deTaiDaDuyet.id,
        trangThaiTruoc: { trangThai: deTai!.trangThai },
        trangThaiSau: { trangThai: deTaiDaDuyet.trangThai },
      }),
      this.notificationService.taoNhieuThongBao(
        deTai!.nhomNghienCuu.thanhVien.map((thanhVien) => ({
          nguoiNhanId: thanhVien.sinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Đề tài đã được duyệt',
          noiDung: `Đề tài "${deTaiDaDuyet.tenDeTai}" của nhóm ${deTai!.nhomNghienCuu.tenNhom} đã được duyệt.`,
          loaiThongBao: 'GIANG_VIEN_DUYET_DE_TAI',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTaiDaDuyet.id,
        }))
      ),
    ]);

    return mapDeTaiChoDuyet({
      ...deTaiDaDuyet,
      nhomNghienCuu: deTai!.nhomNghienCuu,
    });
  }

  async yeuCauChinhSua(giangVienId: bigint, input: DuyetDeTaiDto) {
    const deTai = await this.duyetDeTaiRepository.timDeTaiTheoId(input.deTaiId);
    this.kiemTraQuyenDuyet(deTai, giangVienId);
    this.damBaoNhanXetHopLe(QuyetDinhPheDuyet.YEU_CAU_CHINH_SUA, input.nhanXet);

    const thoiDiemDuyet = new Date();
    const hanChinhSua = congNgay(MAC_DINH_SO_NGAY_CHINH_SUA);
    const deTaiDaCapNhat = await this.prisma.$transaction(async (giaoDich) => {
      const deTaiCapNhat = await this.doiTrangThai({
        deTaiId: input.deTaiId,
        trangThaiMoi: TopicSubmissionStatus.CAN_CHINH_SUA,
        nguoiThucHienId: giangVienId,
        thoiDiemCapNhat: thoiDiemDuyet,
        nhanXetGiangVien: input.nhanXet || null,
        ghiChuChinhSua: input.nhanXet || null,
        hanChinhSua,
        coSoDuLieu: giaoDich,
      });

      await this.duyetDeTaiRepository.capNhatTrangThaiNhom(
        deTai!.nhomNghienCuuId,
        GroupStatus.CAN_CHINH_SUA_DE_TAI,
        giaoDich
      );

      return deTaiCapNhat;
    });

    await Promise.all([
      this.auditService.taoBanGhi({
        nguoiThucHienId: giangVienId,
        vaiTroNguoiThucHien: UserRole.GIANG_VIEN,
        hanhDong: AuditAction.YEU_CAU_CHINH_SUA_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: deTaiDaCapNhat.id,
        trangThaiTruoc: { trangThai: deTai!.trangThai },
        trangThaiSau: { trangThai: deTaiDaCapNhat.trangThai, hanChinhSua: deTaiDaCapNhat.hanChinhSua },
      }),
      this.notificationService.taoNhieuThongBao(
        deTai!.nhomNghienCuu.thanhVien.map((thanhVien) => ({
          nguoiNhanId: thanhVien.sinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Đề tài cần chỉnh sửa',
          noiDung: `Giảng viên đã yêu cầu chỉnh sửa đề tài "${deTaiDaCapNhat.tenDeTai}".`,
          loaiThongBao: 'GIANG_VIEN_YEU_CAU_CHINH_SUA_DE_TAI',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTaiDaCapNhat.id,
        }))
      ),
    ]);

    return mapDeTaiChoDuyet({
      ...deTaiDaCapNhat,
      nhomNghienCuu: deTai!.nhomNghienCuu,
    });
  }

  async tuChoiDeTai(giangVienId: bigint, input: DuyetDeTaiDto) {
    const deTai = await this.duyetDeTaiRepository.timDeTaiTheoId(input.deTaiId);
    this.kiemTraQuyenDuyet(deTai, giangVienId);
    this.damBaoNhanXetHopLe(QuyetDinhPheDuyet.TU_CHOI, input.nhanXet);

    const thoiDiemDuyet = new Date();
    const deTaiDaCapNhat = await this.prisma.$transaction(async (giaoDich) => {
      const deTaiCapNhat = await this.doiTrangThai({
        deTaiId: input.deTaiId,
        trangThaiMoi: TopicSubmissionStatus.TU_CHOI,
        nguoiThucHienId: giangVienId,
        thoiDiemCapNhat: thoiDiemDuyet,
        nhanXetGiangVien: input.nhanXet || null,
        ghiChuChinhSua: input.nhanXet || null,
        hanChinhSua: congNgay(MAC_DINH_SO_NGAY_CHINH_SUA),
        coSoDuLieu: giaoDich,
      });

      await this.duyetDeTaiRepository.capNhatTrangThaiNhom(
        deTai!.nhomNghienCuuId,
        GroupStatus.DANG_CHON_DE_TAI,
        giaoDich
      );

      return deTaiCapNhat;
    });

    await Promise.all([
      this.auditService.taoBanGhi({
        nguoiThucHienId: giangVienId,
        vaiTroNguoiThucHien: UserRole.GIANG_VIEN,
        hanhDong: AuditAction.TU_CHOI_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: deTaiDaCapNhat.id,
        trangThaiTruoc: { trangThai: deTai!.trangThai },
        trangThaiSau: { trangThai: deTaiDaCapNhat.trangThai },
      }),
      this.notificationService.taoNhieuThongBao(
        deTai!.nhomNghienCuu.thanhVien.map((thanhVien) => ({
          nguoiNhanId: thanhVien.sinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Đề tài bị từ chối',
          noiDung: `Đề tài "${deTaiDaCapNhat.tenDeTai}" đã bị từ chối. Bạn có thể cập nhật và nộp lại.`,
          loaiThongBao: 'GIANG_VIEN_TU_CHOI_DE_TAI',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTaiDaCapNhat.id,
        }))
      ),
    ]);

    return mapDeTaiChoDuyet({
      ...deTaiDaCapNhat,
      nhomNghienCuu: deTai!.nhomNghienCuu,
    });
  }

  async chotDeTai(giangVienId: bigint, deTaiId: bigint) {
    const deTai = await this.duyetDeTaiRepository.timDeTaiTheoId(deTaiId);

    if (!deTai) {
      throw new NotFoundError('Không tìm thấy đề tài');
    }

    if (deTai.giangVienId !== giangVienId) {
      throw new ForbiddenError({
        message: 'Giảng viên không có quyền chốt đề tài này',
        errorCode: 'LECTURER_CANNOT_FINALIZE_TOPIC',
      });
    }

    if (deTai.trangThai === TopicSubmissionStatus.DA_CHOT) {
      throw new ConflictError({
        message: 'Đề tài đã được chốt trước đó',
        errorCode: 'TOPIC_ALREADY_FINALIZED',
      });
    }

    if (deTai.trangThai !== TopicSubmissionStatus.DA_DUYET) {
      throw new ConflictError({
        message: 'Chỉ có thể chốt đề tài đã được duyệt',
        errorCode: 'TOPIC_NOT_APPROVED',
      });
    }

    const thoiGianChot = new Date();
    const deTaiDaChot = await this.prisma.$transaction(async (giaoDich) => {
      const deTaiCapNhat = await this.duyetDeTaiRepository.chotDeTai(deTaiId, thoiGianChot, giaoDich);

      await this.duyetDeTaiRepository.capNhatTrangThaiNhom(
        deTai.nhomNghienCuuId,
        GroupStatus.DA_CHOT_DE_TAI,
        giaoDich
      );

      return deTaiCapNhat;
    });

    const danhSachThanhVien = deTai.nhomNghienCuu.thanhVien;
    await Promise.all([
      this.auditService.taoBanGhi({
        nguoiThucHienId: giangVienId,
        vaiTroNguoiThucHien: UserRole.GIANG_VIEN,
        hanhDong: AuditAction.CHOT_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: deTaiDaChot.id,
        trangThaiTruoc: { trangThai: deTai.trangThai },
        trangThaiSau: { trangThai: deTaiDaChot.trangThai, thoiGianChot },
      }),
      this.notificationService.taoNhieuThongBao([
        ...danhSachThanhVien.map((thanhVien) => ({
          nguoiNhanId: thanhVien.sinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Đề tài đã được chốt',
          noiDung: `Đề tài "${deTaiDaChot.tenDeTai}" của nhóm ${deTai.nhomNghienCuu.tenNhom} đã được chốt chính thức.`,
          loaiThongBao: 'CHOT_DE_TAI',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTaiDaChot.id,
        })),
        {
          nguoiNhanId: giangVienId,
          loaiNguoiNhan: UserRole.GIANG_VIEN,
          tieuDe: 'Đề tài đã được chốt',
          noiDung: `Đề tài "${deTaiDaChot.tenDeTai}" của nhóm ${deTai.nhomNghienCuu.tenNhom} đã được chốt thành công.`,
          loaiThongBao: 'CHOT_DE_TAI',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTaiDaChot.id,
        },
      ]),
    ]);

    return mapDeTaiChoDuyet({
      ...deTaiDaChot,
      nhomNghienCuu: deTai.nhomNghienCuu,
    });
  }
}

const duyetDeTaiService = new DuyetDeTaiService();

export { DuyetDeTaiService, duyetDeTaiService };
