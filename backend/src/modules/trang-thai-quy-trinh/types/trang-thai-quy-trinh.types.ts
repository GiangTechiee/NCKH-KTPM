import { AuditAction, GroupStatus, StudentWorkflowStatus, TopicSubmissionStatus, UserRole } from '../../../common/constants';

type TienTrinhBuocTrangThai = 'PENDING' | 'CURRENT' | 'COMPLETED' | 'ACTION_REQUIRED';

interface SinhVienTomTatTienTrinh {
  id: bigint;
  maSinhVien: string;
  hoTen: string;
  tenLop: string | null;
  tenKhoa: string | null;
}

interface DangKyMangTomTatTienTrinh {
  id: bigint;
  maMang: string;
  tenMang: string;
  trangThai: string;
  thoiGianDangKy: Date;
  thoiGianDongDangKy: Date;
}

interface ThanhVienNhomTienTrinh {
  id: bigint;
  sinhVienId: bigint;
  maSinhVien: string;
  hoTen: string;
  vaiTro: string;
  thoiGianThamGia: Date | null;
}

interface GiangVienHuongDanTienTrinh {
  id: bigint;
  maGiangVien: string;
  hoTen: string;
  tenBoMon: string | null;
}

interface MangNghienCuuTomTatTienTrinh {
  maMang: string;
  tenMang: string;
}

interface NhomTomTatTienTrinh {
  id: bigint;
  tenNhom: string;
  trangThai: GroupStatus | string;
  soLuongThanhVien: number;
  ngayTao: Date;
  mangNghienCuu: MangNghienCuuTomTatTienTrinh | null;
  thanhVien: ThanhVienNhomTienTrinh[];
  giangVienHuongDan: GiangVienHuongDanTienTrinh | null;
}

interface DeTaiTomTatTienTrinh {
  id: bigint;
  tenDeTai: string;
  loaiDeTai: string;
  trangThai: TopicSubmissionStatus | string;
  soLanChinhSua: number;
  nhanXetGiangVien: string | null;
  ghiChuChinhSua: string | null;
  thoiGianNop: Date | null;
  thoiGianDuyet: Date | null;
  thoiGianChot: Date | null;
  hanChinhSua: Date | null;
}

interface TienTrinhBuocResponse {
  code: string;
  title: string;
  status: TienTrinhBuocTrangThai;
  completedAt: Date | null;
}

interface TienTrinhMocResponse {
  code: string;
  title: string;
  achieved: boolean;
  achievedAt: Date | null;
  summary: string | null;
}

interface TienTrinhXuLyKeTiepResponse {
  handlerRole: UserRole;
  deadline: Date | null;
  description: string;
}

interface TienTrinhTimelineItemResponse {
  id: string;
  at: Date;
  actorRole: UserRole | 'HE_THONG';
  action: AuditAction | 'TRANG_THAI_HIEN_TAI';
  title: string;
  description: string;
  entityType: string | null;
  entityId: bigint | null;
  stateBefore: unknown;
  stateAfter: unknown;
  metadata: unknown;
  isDerived: boolean;
}

interface TrangThaiTienTrinhSinhVienResponse {
  studentSummary: SinhVienTomTatTienTrinh;
  currentStatus: StudentWorkflowStatus;
  registrationSummary: DangKyMangTomTatTienTrinh | null;
  groupSummary: NhomTomTatTienTrinh | null;
  topicSummary: DeTaiTomTatTienTrinh | null;
  stepList: TienTrinhBuocResponse[];
  milestones: TienTrinhMocResponse[];
  nextAction: TienTrinhXuLyKeTiepResponse | null;
  timeline: TienTrinhTimelineItemResponse[];
}

interface GiangVienTomTatTienTrinh {
  id: bigint;
  maGiangVien: string;
  hoTen: string;
  tenBoMon: string | null;
  chuyenMon: string | null;
  soNhomDangHuongDan: number;
  soNhomHuongDanToiDa: number;
}

interface TongQuanTienTrinhGiangVienResponse {
  tongNhom: number;
  nhomChoDuyetDeTai: number;
  nhomCanChinhSua: number;
  nhomDaDuyet: number;
  nhomDaChot: number;
  nhomChuaNopDeTai: number;
  soSlotConLai: number;
}

interface NhomTienTrinhGiangVienResponse {
  groupSummary: NhomTomTatTienTrinh;
  topicSummary: DeTaiTomTatTienTrinh | null;
  stepList: TienTrinhBuocResponse[];
  milestones: TienTrinhMocResponse[];
  nextAction: TienTrinhXuLyKeTiepResponse | null;
  timeline: TienTrinhTimelineItemResponse[];
}

interface TrangThaiTienTrinhGiangVienResponse {
  lecturerSummary: GiangVienTomTatTienTrinh;
  overview: TongQuanTienTrinhGiangVienResponse;
  groupProgressList: NhomTienTrinhGiangVienResponse[];
}

export type {
  DangKyMangTomTatTienTrinh,
  DeTaiTomTatTienTrinh,
  GiangVienTomTatTienTrinh,
  GiangVienHuongDanTienTrinh,
  MangNghienCuuTomTatTienTrinh,
  NhomTienTrinhGiangVienResponse,
  NhomTomTatTienTrinh,
  SinhVienTomTatTienTrinh,
  ThanhVienNhomTienTrinh,
  TienTrinhBuocResponse,
  TienTrinhBuocTrangThai,
  TienTrinhMocResponse,
  TienTrinhTimelineItemResponse,
  TongQuanTienTrinhGiangVienResponse,
  TrangThaiTienTrinhGiangVienResponse,
  TienTrinhXuLyKeTiepResponse,
  TrangThaiTienTrinhSinhVienResponse,
};
