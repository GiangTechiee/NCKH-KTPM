import { Prisma } from '@prisma/client';
import { AuditAction, AuditEntityType, UserRole } from '../../../common/constants';

interface TaoNhatKyKiemToanInput {
  nguoiThucHienId: bigint;
  vaiTroNguoiThucHien: UserRole;
  hanhDong: AuditAction;
  loaiDoiTuong: AuditEntityType;
  doiTuongId: bigint;
  trangThaiTruoc?: Prisma.InputJsonValue | null;
  trangThaiSau?: Prisma.InputJsonValue | null;
  duLieuBoSung?: Prisma.InputJsonValue | null;
}

interface NhatKyKiemToanResponse {
  id: bigint;
  actorId: bigint;
  actorRole: UserRole;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: bigint;
  oldState: Prisma.JsonValue | null;
  newState: Prisma.JsonValue | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
}

export type { NhatKyKiemToanResponse, TaoNhatKyKiemToanInput };
