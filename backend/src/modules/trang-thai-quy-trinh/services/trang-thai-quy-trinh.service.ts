import {
  AuditAction,
  GroupStatus,
  StudentWorkflowStatus,
  TopicSubmissionStatus,
  UserRole,
} from '../../../common/constants';
import { NotFoundError } from '../../../common/exceptions';
import {
  DangKyMangTomTatTienTrinh,
  DeTaiTomTatTienTrinh,
  GiangVienTomTatTienTrinh,
  NhomTienTrinhGiangVienResponse,
  NhomTomTatTienTrinh,
  SinhVienTomTatTienTrinh,
  TienTrinhBuocResponse,
  TienTrinhBuocTrangThai,
  TienTrinhMocResponse,
  TienTrinhTimelineItemResponse,
  TongQuanTienTrinhGiangVienResponse,
  TrangThaiTienTrinhGiangVienResponse,
  TienTrinhXuLyKeTiepResponse,
  TrangThaiTienTrinhSinhVienResponse,
} from '../types/trang-thai-quy-trinh.types';
import { TrangThaiQuyTrinhRepository } from '../repositories/trang-thai-quy-trinh.repository';

type BanGhiNhatKy = Awaited<ReturnType<TrangThaiQuyTrinhRepository['lietKeNhatKyLienQuan']>>[number];
type BanGhiNhatKyGiangVien = Awaited<ReturnType<TrangThaiQuyTrinhRepository['lietKeNhatKyTienTrinhGiangVien']>>[number];

function hienThiTrangThaiSinhVien(trangThai: string): string {
  switch (trangThai) {
    case StudentWorkflowStatus.CHUA_DANG_KY_MANG:
      return 'chưa đăng ký mảng';
    case StudentWorkflowStatus.DA_DANG_KY_MANG:
      return 'đã đăng ký mảng';
    case StudentWorkflowStatus.CHUA_CO_NHOM:
      return 'chưa có nhóm';
    case StudentWorkflowStatus.DA_CO_NHOM:
      return 'đã có nhóm';
    case StudentWorkflowStatus.DA_CO_DE_TAI:
      return 'đã có đề tài';
    default:
      return trangThai;
  }
}

function hienThiTrangThaiNhom(trangThai: string): string {
  switch (trangThai) {
    case GroupStatus.NHAP:
      return 'nháp';
    case GroupStatus.DANG_TUYEN_THANH_VIEN:
      return 'đang tuyển thành viên';
    case GroupStatus.DA_DU_THANH_VIEN:
      return 'đã đủ thành viên';
    case GroupStatus.CHUA_CO_GIANG_VIEN:
      return 'chưa có giảng viên hướng dẫn';
    case GroupStatus.DA_CO_GIANG_VIEN:
      return 'đã có giảng viên hướng dẫn';
    case GroupStatus.DANG_CHON_DE_TAI:
      return 'đang chọn đề tài';
    case GroupStatus.CHO_DUYET_DE_TAI:
      return 'chờ duyệt đề tài';
    case GroupStatus.CAN_CHINH_SUA_DE_TAI:
      return 'cần chỉnh sửa đề tài';
    case GroupStatus.DA_DUYET_DE_TAI:
      return 'đề tài đã được duyệt';
    case GroupStatus.DA_CHOT_DE_TAI:
      return 'đã chốt đề tài';
    default:
      return trangThai;
  }
}

function hienThiTrangThaiDeTai(trangThai: string): string {
  switch (trangThai) {
    case TopicSubmissionStatus.NHAP:
      return 'nháp';
    case TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET:
      return 'chờ giảng viên duyệt';
    case TopicSubmissionStatus.CAN_CHINH_SUA:
      return 'cần chỉnh sửa';
    case TopicSubmissionStatus.DA_DUYET:
      return 'đã duyệt';
    case TopicSubmissionStatus.TU_CHOI:
      return 'bị từ chối';
    case TopicSubmissionStatus.DA_CHOT:
      return 'đã chốt';
    default:
      return trangThai;
  }
}

function xacDinhTrangThaiTienTrinhSinhVien(input: {
  coDangKyMang: boolean;
  coNhom: boolean;
  coDeTai: boolean;
}): StudentWorkflowStatus {
  if (!input.coDangKyMang) {
    return StudentWorkflowStatus.CHUA_DANG_KY_MANG;
  }

  if (!input.coNhom) {
    return StudentWorkflowStatus.CHUA_CO_NHOM;
  }

  if (input.coDeTai) {
    return StudentWorkflowStatus.DA_CO_DE_TAI;
  }

  return StudentWorkflowStatus.DA_CO_NHOM;
}

function taoMoTaHanhDong(hanhDong: string): string {
  switch (hanhDong) {
    case AuditAction.DANG_KY_MANG:
      return 'Sinh viên đã đăng ký mảng nghiên cứu.';
    case AuditAction.TAO_NHOM:
      return 'Sinh viên đã tạo nhóm nghiên cứu.';
    case AuditAction.MOI_THANH_VIEN:
      return 'Nhóm đã gửi lời mời tham gia.';
    case AuditAction.CHAP_NHAN_LOI_MOI:
      return 'Một thành viên đã chấp nhận lời mời vào nhóm.';
    case AuditAction.TU_CHOI_LOI_MOI:
      return 'Một lời mời tham gia nhóm đã bị từ chối.';
    case AuditAction.GIANG_VIEN_NHAN_NHOM:
      return 'Giảng viên đã nhận hướng dẫn nhóm.';
    case AuditAction.NOP_DE_TAI:
      return 'Nhóm đã nộp đề tài để chờ giảng viên duyệt.';
    case AuditAction.CHINH_SUA_DE_TAI:
      return 'Nhóm đã chỉnh sửa và nộp lại đề tài.';
    case AuditAction.DUYET_DE_TAI:
      return 'Giảng viên đã duyệt đề tài.';
    case AuditAction.YEU_CAU_CHINH_SUA_DE_TAI:
      return 'Giảng viên đã yêu cầu nhóm chỉnh sửa đề tài.';
    case AuditAction.TU_CHOI_DE_TAI:
      return 'Giảng viên đã từ chối đề tài hiện tại.';
    case AuditAction.CHOT_DE_TAI:
      return 'Giảng viên đã chốt đề tài chính thức.';
    default:
      return hanhDong;
  }
}

function taoTieuDeHanhDong(hanhDong: string): string {
  switch (hanhDong) {
    case AuditAction.DANG_KY_MANG:
      return 'Đăng ký mảng nghiên cứu';
    case AuditAction.TAO_NHOM:
      return 'Tạo nhóm nghiên cứu';
    case AuditAction.MOI_THANH_VIEN:
      return 'Mời thành viên';
    case AuditAction.CHAP_NHAN_LOI_MOI:
      return 'Chấp nhận lời mời';
    case AuditAction.TU_CHOI_LOI_MOI:
      return 'Từ chối lời mời';
    case AuditAction.GIANG_VIEN_NHAN_NHOM:
      return 'Giảng viên nhận hướng dẫn';
    case AuditAction.NOP_DE_TAI:
      return 'Nộp đề tài';
    case AuditAction.CHINH_SUA_DE_TAI:
      return 'Chỉnh sửa đề tài';
    case AuditAction.DUYET_DE_TAI:
      return 'Duyệt đề tài';
    case AuditAction.YEU_CAU_CHINH_SUA_DE_TAI:
      return 'Yêu cầu chỉnh sửa đề tài';
    case AuditAction.TU_CHOI_DE_TAI:
      return 'Từ chối đề tài';
    case AuditAction.CHOT_DE_TAI:
      return 'Chốt đề tài';
    default:
      return hanhDong;
  }
}

function timThoiDiemHanhDong(danhSachNhatKy: BanGhiNhatKy[], hanhDong: string): Date | null {
  return danhSachNhatKy.find((nhatKy) => nhatKy.hanhDong === hanhDong)?.ngayTao ?? null;
}

function taoTimelineTuNhatKy(danhSachNhatKy: BanGhiNhatKy[]): TienTrinhTimelineItemResponse[] {
  return danhSachNhatKy.map((nhatKy) => ({
    id: nhatKy.id.toString(),
    at: nhatKy.ngayTao,
    actorRole: (nhatKy.vaiTroNguoiThucHien as UserRole) || 'HE_THONG',
    action: nhatKy.hanhDong as AuditAction,
    title: taoTieuDeHanhDong(nhatKy.hanhDong),
    description: taoMoTaHanhDong(nhatKy.hanhDong),
    entityType: nhatKy.loaiDoiTuong,
    entityId: nhatKy.doiTuongId,
    stateBefore: nhatKy.trangThaiTruoc,
    stateAfter: nhatKy.trangThaiSau,
    metadata: nhatKy.duLieuBoSung,
    isDerived: false,
  }));
}

function timThoiDiemHanhDongGiangVien(danhSachNhatKy: BanGhiNhatKyGiangVien[], hanhDong: string): Date | null {
  return danhSachNhatKy.find((nhatKy) => nhatKy.hanhDong === hanhDong)?.ngayTao ?? null;
}

function taoTimelineTuNhatKyGiangVien(danhSachNhatKy: BanGhiNhatKyGiangVien[]): TienTrinhTimelineItemResponse[] {
  return danhSachNhatKy.map((nhatKy) => ({
    id: nhatKy.id.toString(),
    at: nhatKy.ngayTao,
    actorRole: (nhatKy.vaiTroNguoiThucHien as UserRole) || 'HE_THONG',
    action: nhatKy.hanhDong as AuditAction,
    title: taoTieuDeHanhDong(nhatKy.hanhDong),
    description: taoMoTaHanhDong(nhatKy.hanhDong),
    entityType: nhatKy.loaiDoiTuong,
    entityId: nhatKy.doiTuongId,
    stateBefore: nhatKy.trangThaiTruoc,
    stateAfter: nhatKy.trangThaiSau,
    metadata: nhatKy.duLieuBoSung,
    isDerived: false,
  }));
}

function taoTimelineTrangThaiHienTai(input: {
  nhomTomTat: NhomTomTatTienTrinh | null;
  deTaiTomTat: DeTaiTomTatTienTrinh | null;
  currentStatus: StudentWorkflowStatus;
}): TienTrinhTimelineItemResponse {
  const trangThaiSinhVien = hienThiTrangThaiSinhVien(input.currentStatus);
  const trangThaiNhom = input.nhomTomTat ? hienThiTrangThaiNhom(input.nhomTomTat.trangThai) : null;
  const trangThaiDeTai = input.deTaiTomTat ? hienThiTrangThaiDeTai(input.deTaiTomTat.trangThai) : null;

  const moTa = input.deTaiTomTat
    ? `Trạng thái hiện tại: ${trangThaiSinhVien}, nhóm ${input.nhomTomTat?.tenNhom ?? 'chưa xác định'} đang ở trạng thái ${trangThaiNhom ?? 'chưa xác định'}, đề tài ở trạng thái ${trangThaiDeTai}.`
    : input.nhomTomTat
      ? `Trạng thái hiện tại: ${trangThaiSinhVien}, nhóm ${input.nhomTomTat.tenNhom} đang ở trạng thái ${trangThaiNhom}.`
      : `Trạng thái hiện tại: ${trangThaiSinhVien}.`;

  return {
    id: 'current-state',
    at: new Date(),
    actorRole: 'HE_THONG',
    action: 'TRANG_THAI_HIEN_TAI',
    title: 'Trạng thái hiện tại',
    description: moTa,
    entityType: input.deTaiTomTat ? 'DeTaiNghienCuu' : input.nhomTomTat ? 'NhomNghienCuu' : null,
    entityId: input.deTaiTomTat?.id ?? input.nhomTomTat?.id ?? null,
    stateBefore: null,
    stateAfter: {
      currentStatus: input.currentStatus,
      groupStatus: input.nhomTomTat?.trangThai ?? null,
      topicStatus: input.deTaiTomTat?.trangThai ?? null,
    },
    metadata: null,
    isDerived: true,
  };
}

function taoTimelineTrangThaiGiangVienHienTai(input: {
  nhomTomTat: NhomTomTatTienTrinh;
  deTaiTomTat: DeTaiTomTatTienTrinh | null;
}): TienTrinhTimelineItemResponse {
  const moTa = input.deTaiTomTat
    ? `Nhóm ${input.nhomTomTat.tenNhom} đang ở trạng thái ${input.nhomTomTat.trangThai}, đề tài ở trạng thái ${input.deTaiTomTat.trangThai}.`
    : `Nhóm ${input.nhomTomTat.tenNhom} đang ở trạng thái ${input.nhomTomTat.trangThai} và chưa nộp đề tài.`;

  return {
    id: `lecturer-current-state-${input.nhomTomTat.id.toString()}`,
    at: new Date(),
    actorRole: 'HE_THONG',
    action: 'TRANG_THAI_HIEN_TAI',
    title: 'Trạng thái nhóm hiện tại',
    description: moTa,
    entityType: input.deTaiTomTat ? 'DeTaiNghienCuu' : 'NhomNghienCuu',
    entityId: input.deTaiTomTat?.id ?? input.nhomTomTat.id,
    stateBefore: null,
    stateAfter: {
      groupStatus: input.nhomTomTat.trangThai,
      topicStatus: input.deTaiTomTat?.trangThai ?? null,
    },
    metadata: null,
    isDerived: true,
  };
}

class TrangThaiQuyTrinhService {
  constructor(
    private readonly trangThaiQuyTrinhRepository: TrangThaiQuyTrinhRepository = new TrangThaiQuyTrinhRepository()
  ) {}

  private xayDungBuocTienTrinh(input: {
    dangKyMangTomTat: DangKyMangTomTatTienTrinh | null;
    nhomTomTat: NhomTomTatTienTrinh | null;
    deTaiTomTat: DeTaiTomTatTienTrinh | null;
    danhSachNhatKy: BanGhiNhatKy[];
  }): TienTrinhBuocResponse[] {
    const { dangKyMangTomTat, nhomTomTat, deTaiTomTat, danhSachNhatKy } = input;
    const canNopLaiDeTai = Boolean(
      deTaiTomTat
      && (
        deTaiTomTat.trangThai === TopicSubmissionStatus.CAN_CHINH_SUA
        || deTaiTomTat.trangThai === TopicSubmissionStatus.TU_CHOI
      )
    );

    const buocHienTai = !dangKyMangTomTat
      ? 'DANG_KY_MANG'
      : !nhomTomTat
        ? 'TAO_HOAC_GIA_NHAP_NHOM'
        : !nhomTomTat.giangVienHuongDan
          ? 'GIANG_VIEN_NHAN_HUONG_DAN'
          : !deTaiTomTat || canNopLaiDeTai
            ? 'NOP_DE_TAI'
            : deTaiTomTat.trangThai === TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET
              ? 'GIANG_VIEN_DUYET_DE_TAI'
              : deTaiTomTat.trangThai === TopicSubmissionStatus.DA_DUYET
                ? 'CHOT_DE_TAI'
                : null;

    const taoTrangThaiBuoc = (maBuoc: string, daHoanTat: boolean, dangCanXuLyLai = false): TienTrinhBuocTrangThai => {
      if (dangCanXuLyLai) {
        return 'ACTION_REQUIRED';
      }

      if (buocHienTai === maBuoc) {
        return 'CURRENT';
      }

      if (daHoanTat) {
        return 'COMPLETED';
      }

      return 'PENDING';
    };

    return [
      {
        code: 'DANG_KY_MANG',
        title: 'Đăng ký mảng nghiên cứu',
        status: taoTrangThaiBuoc('DANG_KY_MANG', Boolean(dangKyMangTomTat)),
        completedAt: dangKyMangTomTat?.thoiGianDangKy ?? timThoiDiemHanhDong(danhSachNhatKy, AuditAction.DANG_KY_MANG),
      },
      {
        code: 'TAO_HOAC_GIA_NHAP_NHOM',
        title: 'Tạo hoặc gia nhập nhóm nghiên cứu',
        status: taoTrangThaiBuoc('TAO_HOAC_GIA_NHAP_NHOM', Boolean(nhomTomTat)),
        completedAt: nhomTomTat?.ngayTao ?? timThoiDiemHanhDong(danhSachNhatKy, AuditAction.TAO_NHOM),
      },
      {
        code: 'GIANG_VIEN_NHAN_HUONG_DAN',
        title: 'Được giảng viên nhận hướng dẫn',
        status: taoTrangThaiBuoc('GIANG_VIEN_NHAN_HUONG_DAN', Boolean(nhomTomTat?.giangVienHuongDan)),
        completedAt: timThoiDiemHanhDong(danhSachNhatKy, AuditAction.GIANG_VIEN_NHAN_NHOM),
      },
      {
        code: 'NOP_DE_TAI',
        title: 'Chọn hoặc đề xuất đề tài',
        status: taoTrangThaiBuoc('NOP_DE_TAI', Boolean(deTaiTomTat?.thoiGianNop), canNopLaiDeTai),
        completedAt: deTaiTomTat?.thoiGianNop ?? timThoiDiemHanhDong(danhSachNhatKy, AuditAction.NOP_DE_TAI),
      },
      {
        code: 'GIANG_VIEN_DUYET_DE_TAI',
        title: 'Giảng viên phản hồi đề tài',
        status: taoTrangThaiBuoc(
          'GIANG_VIEN_DUYET_DE_TAI',
          Boolean(deTaiTomTat?.thoiGianDuyet)
        ),
        completedAt: deTaiTomTat?.thoiGianDuyet ?? null,
      },
      {
        code: 'CHOT_DE_TAI',
        title: 'Chốt đề tài chính thức',
        status: taoTrangThaiBuoc('CHOT_DE_TAI', deTaiTomTat?.trangThai === TopicSubmissionStatus.DA_CHOT),
        completedAt: deTaiTomTat?.thoiGianChot ?? null,
      },
    ];
  }

  private xayDungMocTienTrinh(input: {
    dangKyMangTomTat: DangKyMangTomTatTienTrinh | null;
    nhomTomTat: NhomTomTatTienTrinh | null;
    deTaiTomTat: DeTaiTomTatTienTrinh | null;
    danhSachNhatKy: BanGhiNhatKy[];
  }): TienTrinhMocResponse[] {
    const { dangKyMangTomTat, nhomTomTat, deTaiTomTat, danhSachNhatKy } = input;

    return [
      {
        code: 'DA_DANG_KY_MANG',
        title: 'Đã đăng ký mảng nghiên cứu',
        achieved: Boolean(dangKyMangTomTat),
        achievedAt: dangKyMangTomTat?.thoiGianDangKy ?? timThoiDiemHanhDong(danhSachNhatKy, AuditAction.DANG_KY_MANG),
        summary: dangKyMangTomTat ? `${dangKyMangTomTat.maMang} - ${dangKyMangTomTat.tenMang}` : null,
      },
      {
        code: 'DA_CO_NHOM',
        title: 'Đã có nhóm nghiên cứu',
        achieved: Boolean(nhomTomTat),
        achievedAt: nhomTomTat?.ngayTao ?? timThoiDiemHanhDong(danhSachNhatKy, AuditAction.TAO_NHOM),
        summary: nhomTomTat ? nhomTomTat.tenNhom : null,
      },
      {
        code: 'DA_CO_GIANG_VIEN',
        title: 'Đã có giảng viên hướng dẫn',
        achieved: Boolean(nhomTomTat?.giangVienHuongDan),
        achievedAt: timThoiDiemHanhDong(danhSachNhatKy, AuditAction.GIANG_VIEN_NHAN_NHOM),
        summary: nhomTomTat?.giangVienHuongDan?.hoTen ?? null,
      },
      {
        code: 'DA_NOP_DE_TAI',
        title: 'Đã nộp đề tài',
        achieved: Boolean(deTaiTomTat?.thoiGianNop),
        achievedAt: deTaiTomTat?.thoiGianNop ?? null,
        summary: deTaiTomTat?.tenDeTai ?? null,
      },
      {
        code: 'DE_TAI_DA_DUOC_PHAN_HOI',
        title: 'Đề tài đã được giảng viên phản hồi',
        achieved: Boolean(deTaiTomTat?.thoiGianDuyet),
        achievedAt: deTaiTomTat?.thoiGianDuyet ?? null,
        summary: deTaiTomTat?.trangThai ?? null,
      },
      {
        code: 'DE_TAI_DA_CHOT',
        title: 'Đề tài đã được chốt',
        achieved: deTaiTomTat?.trangThai === TopicSubmissionStatus.DA_CHOT,
        achievedAt: deTaiTomTat?.thoiGianChot ?? null,
        summary: deTaiTomTat?.trangThai === TopicSubmissionStatus.DA_CHOT ? deTaiTomTat.tenDeTai : null,
      },
    ];
  }

  private xayDungXuLyKeTiep(input: {
    dangKyMangTomTat: DangKyMangTomTatTienTrinh | null;
    nhomTomTat: NhomTomTatTienTrinh | null;
    deTaiTomTat: DeTaiTomTatTienTrinh | null;
  }): TienTrinhXuLyKeTiepResponse | null {
    const { dangKyMangTomTat, nhomTomTat, deTaiTomTat } = input;

    if (!dangKyMangTomTat) {
      return {
        handlerRole: UserRole.SINH_VIEN,
        deadline: null,
        description: 'Sinh viên cần đăng ký một mảng nghiên cứu để bắt đầu quy trình.',
      };
    }

    if (!nhomTomTat) {
      return {
        handlerRole: UserRole.SINH_VIEN,
        deadline: dangKyMangTomTat.thoiGianDongDangKy,
        description: 'Sinh viên cần tạo nhóm hoặc tham gia một nhóm nghiên cứu.',
      };
    }

    if (!nhomTomTat.giangVienHuongDan) {
      return {
        handlerRole: UserRole.GIANG_VIEN,
        deadline: null,
        description: 'Chờ một giảng viên phù hợp nhận hướng dẫn nhóm nghiên cứu.',
      };
    }

    if (!deTaiTomTat) {
      return {
        handlerRole: UserRole.SINH_VIEN,
        deadline: null,
        description: 'Nhóm cần chọn hoặc đề xuất đề tài để gửi giảng viên duyệt.',
      };
    }

    if (deTaiTomTat.trangThai === TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET) {
      return {
        handlerRole: UserRole.GIANG_VIEN,
        deadline: null,
        description: 'Giảng viên cần duyệt, yêu cầu chỉnh sửa hoặc từ chối đề tài.',
      };
    }

    if (
      deTaiTomTat.trangThai === TopicSubmissionStatus.CAN_CHINH_SUA
      || deTaiTomTat.trangThai === TopicSubmissionStatus.TU_CHOI
    ) {
      return {
        handlerRole: UserRole.SINH_VIEN,
        deadline: deTaiTomTat.hanChinhSua,
        description:
          deTaiTomTat.trangThai === TopicSubmissionStatus.CAN_CHINH_SUA
            ? 'Nhóm cần chỉnh sửa đề tài theo nhận xét của giảng viên.'
            : 'Nhóm cần đề xuất lại đề tài sau khi đề tài hiện tại bị từ chối.',
      };
    }

    if (deTaiTomTat.trangThai === TopicSubmissionStatus.DA_DUYET) {
      return {
        handlerRole: UserRole.GIANG_VIEN,
        deadline: null,
        description: 'Giảng viên có thể chốt đề tài đã được duyệt.',
      };
    }

    return null;
  }

  private xayDungBuocTienTrinhGiangVien(input: {
    deTaiTomTat: DeTaiTomTatTienTrinh | null;
    danhSachNhatKy: BanGhiNhatKyGiangVien[];
  }): TienTrinhBuocResponse[] {
    const { deTaiTomTat, danhSachNhatKy } = input;

    const buocHienTai = !deTaiTomTat
      ? 'NHOM_NOP_DE_TAI'
      : deTaiTomTat.trangThai === TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET
        ? 'GIANG_VIEN_DUYET_DE_TAI'
        : deTaiTomTat.trangThai === TopicSubmissionStatus.DA_DUYET
          ? 'CHOT_DE_TAI'
          : null;

    const taoTrangThaiBuoc = (maBuoc: string, daHoanTat: boolean, canXuLy = false): TienTrinhBuocTrangThai => {
      if (canXuLy) {
        return 'ACTION_REQUIRED';
      }

      if (buocHienTai === maBuoc) {
        return 'CURRENT';
      }

      if (daHoanTat) {
        return 'COMPLETED';
      }

      return 'PENDING';
    };

    return [
      {
        code: 'GIANG_VIEN_NHAN_HUONG_DAN',
        title: 'Nhận hướng dẫn nhóm',
        status: taoTrangThaiBuoc('GIANG_VIEN_NHAN_HUONG_DAN', true),
        completedAt: timThoiDiemHanhDongGiangVien(danhSachNhatKy, AuditAction.GIANG_VIEN_NHAN_NHOM),
      },
      {
        code: 'NHOM_NOP_DE_TAI',
        title: 'Nhóm nộp đề tài',
        status: taoTrangThaiBuoc('NHOM_NOP_DE_TAI', Boolean(deTaiTomTat?.thoiGianNop)),
        completedAt: deTaiTomTat?.thoiGianNop ?? timThoiDiemHanhDongGiangVien(danhSachNhatKy, AuditAction.NOP_DE_TAI),
      },
      {
        code: 'GIANG_VIEN_DUYET_DE_TAI',
        title: 'Giảng viên phản hồi đề tài',
        status: taoTrangThaiBuoc(
          'GIANG_VIEN_DUYET_DE_TAI',
          Boolean(deTaiTomTat?.thoiGianDuyet),
          deTaiTomTat?.trangThai === TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET
        ),
        completedAt: deTaiTomTat?.thoiGianDuyet ?? null,
      },
      {
        code: 'CHOT_DE_TAI',
        title: 'Chốt đề tài',
        status: taoTrangThaiBuoc(
          'CHOT_DE_TAI',
          deTaiTomTat?.trangThai === TopicSubmissionStatus.DA_CHOT,
          deTaiTomTat?.trangThai === TopicSubmissionStatus.DA_DUYET
        ),
        completedAt: deTaiTomTat?.thoiGianChot ?? null,
      },
    ];
  }

  private xayDungMocTienTrinhGiangVien(input: {
    deTaiTomTat: DeTaiTomTatTienTrinh | null;
    danhSachNhatKy: BanGhiNhatKyGiangVien[];
  }): TienTrinhMocResponse[] {
    const { deTaiTomTat, danhSachNhatKy } = input;

    return [
      {
        code: 'DA_NHAN_HUONG_DAN',
        title: 'Đã nhận hướng dẫn nhóm',
        achieved: true,
        achievedAt: timThoiDiemHanhDongGiangVien(danhSachNhatKy, AuditAction.GIANG_VIEN_NHAN_NHOM),
        summary: null,
      },
      {
        code: 'NHOM_DA_NOP_DE_TAI',
        title: 'Nhóm đã nộp đề tài',
        achieved: Boolean(deTaiTomTat?.thoiGianNop),
        achievedAt: deTaiTomTat?.thoiGianNop ?? null,
        summary: deTaiTomTat?.tenDeTai ?? null,
      },
      {
        code: 'DE_TAI_DA_DUOC_DUYET',
        title: 'Đề tài đã được phản hồi',
        achieved: Boolean(deTaiTomTat?.thoiGianDuyet),
        achievedAt: deTaiTomTat?.thoiGianDuyet ?? null,
        summary: deTaiTomTat?.trangThai ?? null,
      },
      {
        code: 'DE_TAI_DA_CHOT',
        title: 'Đề tài đã được chốt',
        achieved: deTaiTomTat?.trangThai === TopicSubmissionStatus.DA_CHOT,
        achievedAt: deTaiTomTat?.thoiGianChot ?? null,
        summary: deTaiTomTat?.trangThai === TopicSubmissionStatus.DA_CHOT ? deTaiTomTat.tenDeTai : null,
      },
    ];
  }

  private xayDungXuLyKeTiepGiangVien(input: {
    deTaiTomTat: DeTaiTomTatTienTrinh | null;
  }): TienTrinhXuLyKeTiepResponse | null {
    const { deTaiTomTat } = input;

    if (!deTaiTomTat) {
      return {
        handlerRole: UserRole.SINH_VIEN,
        deadline: null,
        description: 'Nhóm chưa nộp đề tài. Giảng viên đang chờ nhóm hoàn thiện và gửi đề tài.',
      };
    }

    if (deTaiTomTat.trangThai === TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET) {
      return {
        handlerRole: UserRole.GIANG_VIEN,
        deadline: null,
        description: 'Giảng viên cần duyệt, yêu cầu chỉnh sửa hoặc từ chối đề tài của nhóm.',
      };
    }

    if (
      deTaiTomTat.trangThai === TopicSubmissionStatus.CAN_CHINH_SUA
      || deTaiTomTat.trangThai === TopicSubmissionStatus.TU_CHOI
    ) {
      return {
        handlerRole: UserRole.SINH_VIEN,
        deadline: deTaiTomTat.hanChinhSua,
        description:
          deTaiTomTat.trangThai === TopicSubmissionStatus.CAN_CHINH_SUA
            ? 'Nhóm cần chỉnh sửa đề tài theo phản hồi của giảng viên.'
            : 'Nhóm cần đề xuất lại đề tài sau khi bị từ chối.',
      };
    }

    if (deTaiTomTat.trangThai === TopicSubmissionStatus.DA_DUYET) {
      return {
        handlerRole: UserRole.GIANG_VIEN,
        deadline: null,
        description: 'Giảng viên có thể chốt đề tài đã được duyệt.',
      };
    }

    return null;
  }

  private tinhTongQuanTienTrinhGiangVien(input: {
    lecturerSummary: GiangVienTomTatTienTrinh;
    groupProgressList: NhomTienTrinhGiangVienResponse[];
  }): TongQuanTienTrinhGiangVienResponse {
    const { lecturerSummary, groupProgressList } = input;

    return {
      tongNhom: groupProgressList.length,
      nhomChoDuyetDeTai: groupProgressList.filter(
        (item) => item.topicSummary?.trangThai === TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET
      ).length,
      nhomCanChinhSua: groupProgressList.filter(
        (item) => item.topicSummary?.trangThai === TopicSubmissionStatus.CAN_CHINH_SUA
      ).length,
      nhomDaDuyet: groupProgressList.filter(
        (item) => item.topicSummary?.trangThai === TopicSubmissionStatus.DA_DUYET
      ).length,
      nhomDaChot: groupProgressList.filter(
        (item) => item.topicSummary?.trangThai === TopicSubmissionStatus.DA_CHOT
      ).length,
      nhomChuaNopDeTai: groupProgressList.filter((item) => !item.topicSummary).length,
      soSlotConLai: Math.max(lecturerSummary.soNhomHuongDanToiDa - lecturerSummary.soNhomDangHuongDan, 0),
    };
  }

  async layTienTrinhSinhVien(sinhVienId: bigint): Promise<TrangThaiTienTrinhSinhVienResponse> {
    const tongQuan = await this.trangThaiQuyTrinhRepository.timTongQuanTienTrinhSinhVien(sinhVienId);

    if (!tongQuan) {
      throw new NotFoundError('Không tìm thấy sinh viên');
    }

    const dangKyMangGanNhat = tongQuan.dangKyMang[0] ?? null;
    const nhomDangThamGia = tongQuan.thanhVienNhom[0]?.nhomNghienCuu ?? null;
    const deTaiHienTai = nhomDangThamGia?.deTai ?? null;

    const sinhVienTomTat: SinhVienTomTatTienTrinh = {
      id: tongQuan.id,
      maSinhVien: tongQuan.maSinhVien,
      hoTen: tongQuan.hoTen,
      tenLop: tongQuan.tenLop,
      tenKhoa: tongQuan.tenKhoa,
    };

    const dangKyMangTomTat: DangKyMangTomTatTienTrinh | null = dangKyMangGanNhat
      ? {
          id: dangKyMangGanNhat.id,
          maMang: dangKyMangGanNhat.mangNghienCuu.maMang,
          tenMang: dangKyMangGanNhat.mangNghienCuu.tenMang,
          trangThai: dangKyMangGanNhat.trangThai,
          thoiGianDangKy: dangKyMangGanNhat.thoiGianDangKy,
          thoiGianDongDangKy: dangKyMangGanNhat.mangNghienCuu.thoiGianDongDangKy,
        }
      : null;

    const nhomTomTat: NhomTomTatTienTrinh | null = nhomDangThamGia
      ? {
          id: nhomDangThamGia.id,
          tenNhom: nhomDangThamGia.tenNhom,
          trangThai: nhomDangThamGia.trangThai,
          soLuongThanhVien: nhomDangThamGia.soLuongThanhVien,
          ngayTao: nhomDangThamGia.ngayTao,
          mangNghienCuu: null,
          giangVienHuongDan: nhomDangThamGia.giangVien
            ? {
                id: nhomDangThamGia.giangVien.id,
                maGiangVien: nhomDangThamGia.giangVien.maGiangVien,
                hoTen: nhomDangThamGia.giangVien.hoTen,
                tenBoMon: nhomDangThamGia.giangVien.tenBoMon,
              }
            : null,
          thanhVien: nhomDangThamGia.thanhVien.map((thanhVien) => ({
            id: thanhVien.id,
            sinhVienId: thanhVien.sinhVienId,
            maSinhVien: thanhVien.sinhVien.maSinhVien,
            hoTen: thanhVien.sinhVien.hoTen,
            vaiTro: thanhVien.vaiTro,
            thoiGianThamGia: thanhVien.thoiGianThamGia,
          })),
        }
      : null;

    const deTaiTomTat: DeTaiTomTatTienTrinh | null = deTaiHienTai
      ? {
          id: deTaiHienTai.id,
          tenDeTai: deTaiHienTai.tenDeTai,
          loaiDeTai: deTaiHienTai.loaiDeTai,
          trangThai: deTaiHienTai.trangThai,
          soLanChinhSua: deTaiHienTai.soLanChinhSua,
          nhanXetGiangVien: deTaiHienTai.nhanXetGiangVien,
          ghiChuChinhSua: deTaiHienTai.ghiChuChinhSua,
          thoiGianNop: deTaiHienTai.thoiGianNop,
          thoiGianDuyet: deTaiHienTai.thoiGianDuyet,
          thoiGianChot: deTaiHienTai.thoiGianChot,
          hanChinhSua: deTaiHienTai.hanChinhSua,
        }
      : null;

    const currentStatus = xacDinhTrangThaiTienTrinhSinhVien({
      coDangKyMang: Boolean(dangKyMangTomTat),
      coNhom: Boolean(nhomTomTat),
      coDeTai: Boolean(deTaiTomTat),
    });

    const danhSachNhatKy = await this.trangThaiQuyTrinhRepository.lietKeNhatKyLienQuan({
      sinhVienId,
      dangKyMangId: dangKyMangTomTat?.id,
      nhomNghienCuuId: nhomTomTat?.id,
      deTaiId: deTaiTomTat?.id,
    });

    const timeline = [
      ...taoTimelineTuNhatKy(danhSachNhatKy),
      taoTimelineTrangThaiHienTai({
        nhomTomTat,
        deTaiTomTat,
        currentStatus,
      }),
    ];

    return {
      studentSummary: sinhVienTomTat,
      currentStatus,
      registrationSummary: dangKyMangTomTat,
      groupSummary: nhomTomTat,
      topicSummary: deTaiTomTat,
      stepList: this.xayDungBuocTienTrinh({
        dangKyMangTomTat,
        nhomTomTat,
        deTaiTomTat,
        danhSachNhatKy,
      }),
      milestones: this.xayDungMocTienTrinh({
        dangKyMangTomTat,
        nhomTomTat,
        deTaiTomTat,
        danhSachNhatKy,
      }),
      nextAction: this.xayDungXuLyKeTiep({
        dangKyMangTomTat,
        nhomTomTat,
        deTaiTomTat,
      }),
      timeline,
    };
  }

  async layTienTrinhGiangVien(giangVienId: bigint): Promise<TrangThaiTienTrinhGiangVienResponse> {
    const tongQuan = await this.trangThaiQuyTrinhRepository.timTongQuanTienTrinhGiangVien(giangVienId);

    if (!tongQuan) {
      throw new NotFoundError('Không tìm thấy giảng viên');
    }

    const lecturerSummary: GiangVienTomTatTienTrinh = {
      id: tongQuan.id,
      maGiangVien: tongQuan.maGiangVien,
      hoTen: tongQuan.hoTen,
      tenBoMon: tongQuan.tenBoMon,
      chuyenMon: tongQuan.chuyenMon,
      soNhomDangHuongDan: tongQuan.soNhomDangHuongDan,
      soNhomHuongDanToiDa: tongQuan.soNhomHuongDanToiDa,
    };

    const nhomIds = tongQuan.nhomNghienCuu.map((nhom) => nhom.id);
    const deTaiIds = tongQuan.nhomNghienCuu.flatMap((nhom) => (nhom.deTai ? [nhom.deTai.id] : []));
    const danhSachNhatKy = await this.trangThaiQuyTrinhRepository.lietKeNhatKyTienTrinhGiangVien({
      nhomNghienCuuIds: nhomIds,
      deTaiIds,
    });

    const groupProgressList: NhomTienTrinhGiangVienResponse[] = tongQuan.nhomNghienCuu.map((nhom) => {
      const nhomTomTat: NhomTomTatTienTrinh = {
        id: nhom.id,
        tenNhom: nhom.tenNhom,
        trangThai: nhom.trangThai,
        soLuongThanhVien: nhom.soLuongThanhVien,
        ngayTao: nhom.ngayTao,
        mangNghienCuu: nhom.mangNghienCuu
          ? {
              maMang: nhom.mangNghienCuu.maMang,
              tenMang: nhom.mangNghienCuu.tenMang,
            }
          : null,
        giangVienHuongDan: nhom.giangVien
          ? {
              id: nhom.giangVien.id,
              maGiangVien: nhom.giangVien.maGiangVien,
              hoTen: nhom.giangVien.hoTen,
              tenBoMon: nhom.giangVien.tenBoMon,
            }
          : null,
        thanhVien: nhom.thanhVien.map((thanhVien) => ({
          id: thanhVien.id,
          sinhVienId: thanhVien.sinhVienId,
          maSinhVien: thanhVien.sinhVien.maSinhVien,
          hoTen: thanhVien.sinhVien.hoTen,
          vaiTro: thanhVien.vaiTro,
          thoiGianThamGia: thanhVien.thoiGianThamGia,
        })),
      };

      const deTaiTomTat: DeTaiTomTatTienTrinh | null = nhom.deTai
        ? {
            id: nhom.deTai.id,
            tenDeTai: nhom.deTai.tenDeTai,
            loaiDeTai: nhom.deTai.loaiDeTai,
            trangThai: nhom.deTai.trangThai,
            soLanChinhSua: nhom.deTai.soLanChinhSua,
            nhanXetGiangVien: nhom.deTai.nhanXetGiangVien,
            ghiChuChinhSua: nhom.deTai.ghiChuChinhSua,
            thoiGianNop: nhom.deTai.thoiGianNop,
            thoiGianDuyet: nhom.deTai.thoiGianDuyet,
            thoiGianChot: nhom.deTai.thoiGianChot,
            hanChinhSua: nhom.deTai.hanChinhSua,
          }
        : null;

      const danhSachNhatKyCuaNhom = danhSachNhatKy.filter(
        (nhatKy) =>
          (nhatKy.loaiDoiTuong === 'NhomNghienCuu' && nhatKy.doiTuongId === nhom.id)
          || (nhatKy.loaiDoiTuong === 'DeTaiNghienCuu' && nhom.deTai && nhatKy.doiTuongId === nhom.deTai.id)
      );

      return {
        groupSummary: nhomTomTat,
        topicSummary: deTaiTomTat,
        stepList: this.xayDungBuocTienTrinhGiangVien({
          deTaiTomTat,
          danhSachNhatKy: danhSachNhatKyCuaNhom,
        }),
        milestones: this.xayDungMocTienTrinhGiangVien({
          deTaiTomTat,
          danhSachNhatKy: danhSachNhatKyCuaNhom,
        }),
        nextAction: this.xayDungXuLyKeTiepGiangVien({
          deTaiTomTat,
        }),
        timeline: [
          ...taoTimelineTuNhatKyGiangVien(danhSachNhatKyCuaNhom),
          taoTimelineTrangThaiGiangVienHienTai({
            nhomTomTat,
            deTaiTomTat,
          }),
        ],
      };
    });

    return {
      lecturerSummary,
      overview: this.tinhTongQuanTienTrinhGiangVien({
        lecturerSummary,
        groupProgressList,
      }),
      groupProgressList,
    };
  }
}

const trangThaiQuyTrinhService = new TrangThaiQuyTrinhService();

export { TrangThaiQuyTrinhService, trangThaiQuyTrinhService };
