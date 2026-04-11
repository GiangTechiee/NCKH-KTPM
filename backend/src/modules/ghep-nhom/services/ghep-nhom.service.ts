import { PrismaClient } from '@prisma/client';
import {
  AuditAction,
  AuditEntityType,
  GroupMemberRole,
  GroupStatus,
  InvitationStatus,
  MAX_GROUP_MEMBERS,
  MemberJoinStatus,
  UserRole,
} from '../../../common/constants';
import { ConflictError, ForbiddenError, ValidationError } from '../../../common/exceptions';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';
import { nhatKyKiemToanService } from '../../nhat-ky-kiem-toan/services/nhat-ky-kiem-toan.service';
import { thongBaoService } from '../../thong-bao/services/thong-bao.service';
import { PhanHoiLoiMoiDto } from '../dto/phan-hoi-loi-moi.dto';
import { GhepNhomRepository } from '../repositories/ghep-nhom.repository';
import { GoiYGhepNhomResponse } from '../types/ghep-nhom.types';

class GhepNhomService {
  private readonly prisma: PrismaClient;

  constructor(private readonly ghepNhomRepository: GhepNhomRepository = new GhepNhomRepository()) {
    this.prisma = getPrismaClient();
  }

  async layGoiYGhepNhom(sinhVienId: bigint): Promise<GoiYGhepNhomResponse> {
    const dangKyMang = await this.ghepNhomRepository.timDangKyMangGanNhat(sinhVienId);
    if (!dangKyMang) {
      throw new ConflictError({
        message: 'Sinh viên chưa đăng ký mảng nghiên cứu',
        errorCode: 'RESEARCH_AREA_REGISTRATION_REQUIRED',
      });
    }

    const [nhomHienTai, sinhVienPhuHop, nhomPhuHop, loiMoiDaNhan] = await Promise.all([
      this.ghepNhomRepository.timNhomDangThamGia(sinhVienId),
      this.ghepNhomRepository.timSinhVienPhuHop(dangKyMang.mangNghienCuuId, sinhVienId),
      this.ghepNhomRepository.timNhomPhuHop(dangKyMang.mangNghienCuuId, sinhVienId),
      this.ghepNhomRepository.timLoiMoiDaNhan(sinhVienId),
    ]);

    const duocGoiYSinhVien = nhomHienTai?.nhomNghienCuu.truongNhomSinhVienId === sinhVienId && nhomHienTai.nhomNghienCuu.soLuongThanhVien < MAX_GROUP_MEMBERS;

    return {
      sinhVienPhuHop: duocGoiYSinhVien
        ? sinhVienPhuHop.map((sinhVien) => ({
            id: sinhVien.id,
            maSinhVien: sinhVien.maSinhVien,
            hoTen: sinhVien.hoTen,
            tenLop: sinhVien.tenLop,
            tenKhoa: sinhVien.tenKhoa,
          }))
        : [],
      nhomPhuHop: nhomHienTai
        ? []
        : nhomPhuHop.map((nhom) => ({
            id: nhom.id,
            tenNhom: nhom.tenNhom,
            soLuongThanhVien: nhom.soLuongThanhVien,
            truongNhom: {
              id: nhom.truongNhom.id,
              hoTen: nhom.truongNhom.hoTen,
              maSinhVien: nhom.truongNhom.maSinhVien,
            },
          })),
      loiMoiDaNhan: loiMoiDaNhan.map((loiMoi) => ({
        id: loiMoi.id,
        nhomNghienCuuId: loiMoi.nhomNghienCuuId,
        tenNhom: loiMoi.nhomNghienCuu.tenNhom,
        nguoiMoi: {
          id: loiMoi.nguoiMoi.id,
          hoTen: loiMoi.nguoiMoi.hoTen,
          maSinhVien: loiMoi.nguoiMoi.maSinhVien,
        },
        trangThai: loiMoi.trangThai,
        thoiGianMoi: loiMoi.thoiGianMoi,
      })),
    };
  }

  async chapNhanLoiMoi(sinhVienId: bigint, loiMoiId: bigint) {
    const loiMoi = await this.ghepNhomRepository.timLoiMoiTheoId(loiMoiId);
    if (!loiMoi) {
      throw new ValidationError('Không tìm thấy lời mời nhóm', [
        { field: 'id', code: 'INVITATION_NOT_FOUND' },
      ]);
    }

    if (loiMoi.sinhVienDuocMoiId !== sinhVienId) {
      throw new ForbiddenError({
        message: 'Bạn không có quyền phản hồi lời mời này',
        errorCode: 'INVITATION_ACCESS_DENIED',
      });
    }

    if (loiMoi.trangThai !== InvitationStatus.CHO_XAC_NHAN) {
      throw new ConflictError({
        message: 'Lời mời này đã được xử lý trước đó',
        errorCode: 'INVITATION_ALREADY_PROCESSED',
      });
    }

    const nhomHienTai = await this.ghepNhomRepository.timNhomDangThamGia(sinhVienId);
    if (nhomHienTai) {
      throw new ConflictError({
        message: 'Sinh viên đã thuộc một nhóm khác',
        errorCode: 'ALREADY_IN_GROUP',
      });
    }

    const thoiDiemHienTai = new Date();
    const ketQua = await this.prisma.$transaction(async (giaoDich) => {
      const soLuongThanhVienHienTai = await this.ghepNhomRepository.demThanhVienDaChapNhan(loiMoi.nhomNghienCuuId, giaoDich);
      if (soLuongThanhVienHienTai >= MAX_GROUP_MEMBERS) {
        throw new ConflictError({
          message: 'Nhóm nghiên cứu đã đủ thành viên',
          errorCode: 'GROUP_IS_FULL',
        });
      }

      const thanhVienDaTonTai = await this.ghepNhomRepository.timThanhVienTheoNhomVaSinhVien(
        loiMoi.nhomNghienCuuId,
        sinhVienId,
        giaoDich
      );
      if (thanhVienDaTonTai) {
        throw new ConflictError({
          message: 'Sinh viên đã có trong nhóm nghiên cứu này',
          errorCode: 'MEMBER_ALREADY_EXISTS',
        });
      }

      const thanhVien = await this.ghepNhomRepository.taoThanhVienNhom(
        {
          nhomNghienCuuId: loiMoi.nhomNghienCuuId,
          sinhVienId,
          vaiTro: GroupMemberRole.THANH_VIEN,
          trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          thoiGianThamGia: thoiDiemHienTai,
        },
        giaoDich
      );

      const loiMoiDaCapNhat = await this.ghepNhomRepository.capNhatLoiMoi(
        loiMoi.id,
        {
          trangThai: InvitationStatus.DA_CHAP_NHAN,
          thoiGianPhanHoi: thoiDiemHienTai,
        },
        giaoDich
      );

      const soLuongMoi = soLuongThanhVienHienTai + 1;
      const nhomDaCapNhat = await this.ghepNhomRepository.capNhatSoLuongVaTrangThaiNhom(
        loiMoi.nhomNghienCuuId,
        soLuongMoi,
        soLuongMoi >= MAX_GROUP_MEMBERS ? GroupStatus.DA_DU_THANH_VIEN : GroupStatus.DANG_TUYEN_THANH_VIEN,
        giaoDich
      );

      await this.ghepNhomRepository.huyCacLoiMoiChoPhanHoiKhacCuaSinhVien(sinhVienId, loiMoi.id, giaoDich);

      return { thanhVien, loiMoiDaCapNhat, nhomDaCapNhat };
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.CHAP_NHAN_LOI_MOI,
        loaiDoiTuong: AuditEntityType.LOI_MOI_NHOM,
        doiTuongId: ketQua.loiMoiDaCapNhat.id,
        trangThaiTruoc: { trangThai: loiMoi.trangThai },
        trangThaiSau: { trangThai: ketQua.loiMoiDaCapNhat.trangThai },
        duLieuBoSung: {
          nhomNghienCuuId: ketQua.loiMoiDaCapNhat.nhomNghienCuuId.toString(),
          thanhVienNhomId: ketQua.thanhVien.id.toString(),
        },
      }),
      thongBaoService.taoNhieuThongBao([
        {
          nguoiNhanId: loiMoi.nguoiMoiSinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Lời mời tham gia nhóm đã được chấp nhận',
          noiDung: `Sinh viên đã chấp nhận lời mời vào nhóm ${loiMoi.nhomNghienCuu.tenNhom}.`,
          loaiThongBao: 'LOI_MOI_DUOC_CHAP_NHAN',
          loaiDoiTuong: AuditEntityType.LOI_MOI_NHOM,
          doiTuongId: ketQua.loiMoiDaCapNhat.id,
        },
      ]),
    ]);

    return {
      id: ketQua.loiMoiDaCapNhat.id,
      nhomNghienCuuId: ketQua.loiMoiDaCapNhat.nhomNghienCuuId,
      trangThai: ketQua.loiMoiDaCapNhat.trangThai,
      soLuongThanhVien: ketQua.nhomDaCapNhat.soLuongThanhVien,
      trangThaiNhom: ketQua.nhomDaCapNhat.trangThai,
    };
  }

  async tuChoiLoiMoi(sinhVienId: bigint, loiMoiId: bigint, input: PhanHoiLoiMoiDto) {
    const loiMoi = await this.ghepNhomRepository.timLoiMoiTheoId(loiMoiId);
    if (!loiMoi) {
      throw new ValidationError('Không tìm thấy lời mời nhóm', [
        { field: 'id', code: 'INVITATION_NOT_FOUND' },
      ]);
    }

    if (loiMoi.sinhVienDuocMoiId !== sinhVienId) {
      throw new ForbiddenError({
        message: 'Bạn không có quyền phản hồi lời mời này',
        errorCode: 'INVITATION_ACCESS_DENIED',
      });
    }

    if (loiMoi.trangThai !== InvitationStatus.CHO_XAC_NHAN) {
      throw new ConflictError({
        message: 'Lời mời này đã được xử lý trước đó',
        errorCode: 'INVITATION_ALREADY_PROCESSED',
      });
    }

    const loiMoiDaCapNhat = await this.ghepNhomRepository.capNhatLoiMoi(loiMoiId, {
      trangThai: InvitationStatus.DA_TU_CHOI,
      lyDoTuChoi: input.lyDoTuChoi ?? null,
      thoiGianPhanHoi: new Date(),
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.TU_CHOI_LOI_MOI,
        loaiDoiTuong: AuditEntityType.LOI_MOI_NHOM,
        doiTuongId: loiMoiDaCapNhat.id,
        trangThaiTruoc: { trangThai: loiMoi.trangThai },
        trangThaiSau: { trangThai: loiMoiDaCapNhat.trangThai },
        duLieuBoSung: input.lyDoTuChoi ? { lyDoTuChoi: input.lyDoTuChoi } : null,
      }),
      thongBaoService.taoNhieuThongBao([
        {
          nguoiNhanId: loiMoi.nguoiMoiSinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Lời mời tham gia nhóm đã bị từ chối',
          noiDung: `Sinh viên đã từ chối lời mời vào nhóm ${loiMoi.nhomNghienCuu.tenNhom}.`,
          loaiThongBao: 'LOI_MOI_BI_TU_CHOI',
          loaiDoiTuong: AuditEntityType.LOI_MOI_NHOM,
          doiTuongId: loiMoiDaCapNhat.id,
        },
      ]),
    ]);

    return {
      id: loiMoiDaCapNhat.id,
      nhomNghienCuuId: loiMoiDaCapNhat.nhomNghienCuuId,
      trangThai: loiMoiDaCapNhat.trangThai,
      lyDoTuChoi: loiMoiDaCapNhat.lyDoTuChoi,
    };
  }
}

const ghepNhomService = new GhepNhomService();

export { GhepNhomService, ghepNhomService };
