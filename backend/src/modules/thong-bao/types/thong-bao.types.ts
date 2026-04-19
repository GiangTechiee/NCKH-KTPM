import { UserRole } from '../../../common/constants';

interface TaoThongBaoInput {
  nguoiNhanId: bigint;
  loaiNguoiNhan: UserRole;
  tieuDe: string;
  noiDung: string;
  loaiThongBao: string;
  loaiDoiTuong?: string;
  doiTuongId?: bigint;
}

interface ThongBaoNguoiNhanHienTai {
  nguoiNhanId: bigint;
  loaiNguoiNhan: UserRole;
}

interface ThongBaoLienKetResponse {
  loaiDoiTuong: string;
  doiTuongId: bigint;
}

interface ThongBaoResponse {
  id: bigint;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
  linkedObject: ThongBaoLienKetResponse | null;
}

export type { TaoThongBaoInput, ThongBaoLienKetResponse, ThongBaoNguoiNhanHienTai, ThongBaoResponse };
