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
import { CoSoDuLieu, GhepNhomRepository } from '../repositories/ghep-nhom.repository';
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
      nhomPhuHop: nhomPhuHop.map((nhom) => ({
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

    const thoiDiemHienTai = new Date();
    const ketQua = await this.prisma.$transaction(async (giaoDich) => {
      await this.xuLyChuyenNhomNeuCan(sinhVienId, loiMoi.nhomNghienCuuId, thoiDiemHienTai, giaoDich);

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

  async thamGiaNhom(sinhVienId: bigint, groupId: bigint) {
    const dangKyMang = await this.ghepNhomRepository.timDangKyMangGanNhat(sinhVienId);
    if (!dangKyMang) {
      throw new ConflictError({
        message: 'Sinh viên chưa đăng ký mảng nghiên cứu',
        errorCode: 'RESEARCH_AREA_REGISTRATION_REQUIRED',
      });
    }

    const nhomMucTieu = await this.ghepNhomRepository.timNhomTheoId(groupId);
    if (!nhomMucTieu) {
      throw new ValidationError('Không tìm thấy nhóm nghiên cứu', [
        { field: 'groupId', code: 'GROUP_NOT_FOUND' },
      ]);
    }

    if (nhomMucTieu.mangNghienCuuId !== dangKyMang.mangNghienCuuId) {
      throw new ConflictError({
        message: 'Chỉ được tham gia nhóm cùng mảng nghiên cứu',
        errorCode: 'GROUP_NOT_IN_SAME_RESEARCH_AREA',
      });
    }

    const thoiDiemHienTai = new Date();
    const ketQua = await this.prisma.$transaction(async (giaoDich) => {
      await this.xuLyChuyenNhomNeuCan(sinhVienId, groupId, thoiDiemHienTai, giaoDich);

      const soLuongThanhVienHienTai = await this.ghepNhomRepository.demThanhVienDaChapNhan(groupId, giaoDich);
      if (soLuongThanhVienHienTai >= MAX_GROUP_MEMBERS) {
        throw new ConflictError({
          message: 'Nhóm nghiên cứu đã đủ thành viên',
          errorCode: 'GROUP_IS_FULL',
        });
      }

      const thanhVienDaTonTai = await this.ghepNhomRepository.timThanhVienTheoNhomVaSinhVien(groupId, sinhVienId, giaoDich);
      if (thanhVienDaTonTai) {
        throw new ConflictError({
          message: 'Sinh viên đã có trong nhóm nghiên cứu này',
          errorCode: 'MEMBER_ALREADY_EXISTS',
        });
      }

      const thanhVien = await this.ghepNhomRepository.taoThanhVienNhom(
        {
          nhomNghienCuuId: groupId,
          sinhVienId,
          vaiTro: GroupMemberRole.THANH_VIEN,
          trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          thoiGianThamGia: thoiDiemHienTai,
        },
        giaoDich
      );

      const soLuongMoi = soLuongThanhVienHienTai + 1;
      const nhomDaCapNhat = await this.ghepNhomRepository.capNhatSoLuongVaTrangThaiNhom(
        groupId,
        soLuongMoi,
        soLuongMoi >= MAX_GROUP_MEMBERS ? GroupStatus.DA_DU_THANH_VIEN : GroupStatus.DANG_TUYEN_THANH_VIEN,
        giaoDich
      );

      await this.ghepNhomRepository.huyTatCaLoiMoiChoPhanHoiCuaSinhVien(sinhVienId, giaoDich);

      return { thanhVien, nhomDaCapNhat };
    });

    await nhatKyKiemToanService.taoBanGhi({
      nguoiThucHienId: sinhVienId,
      vaiTroNguoiThucHien: UserRole.SINH_VIEN,
      hanhDong: AuditAction.THAM_GIA_NHOM,
      loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
      doiTuongId: groupId,
      trangThaiSau: {
        thanhVienNhomId: ketQua.thanhVien.id.toString(),
        soLuongThanhVien: ketQua.nhomDaCapNhat.soLuongThanhVien,
        trangThaiNhom: ketQua.nhomDaCapNhat.trangThai,
      },
      duLieuBoSung: {
        trigger: 'DIRECT_JOIN',
      },
    });

    await thongBaoService.taoNhieuThongBao([
      {
        nguoiNhanId: nhomMucTieu.truongNhomSinhVienId,
        loaiNguoiNhan: UserRole.SINH_VIEN,
        tieuDe: 'Có thành viên mới tham gia nhóm',
        noiDung: `Một sinh viên đã tham gia trực tiếp vào nhóm ${nhomMucTieu.tenNhom}.`,
        loaiThongBao: 'THAM_GIA_NHOM_TRUC_TIEP',
        loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
        doiTuongId: groupId,
      },
    ]);

    return {
      nhomNghienCuuId: groupId,
      soLuongThanhVien: ketQua.nhomDaCapNhat.soLuongThanhVien,
      trangThaiNhom: ketQua.nhomDaCapNhat.trangThai,
    };
  }

  private async xuLyChuyenNhomNeuCan(
    sinhVienId: bigint,
    nhomMucTieuId: bigint,
    thoiDiemHienTai: Date,
    giaoDich: CoSoDuLieu
  ) {
    const nhomHienTai = await this.ghepNhomRepository.timNhomDangThamGia(sinhVienId);
    if (!nhomHienTai) {
      return;
    }

    const nhomCu = nhomHienTai.nhomNghienCuu;
    if (nhomCu.id === nhomMucTieuId) {
      throw new ConflictError({
        message: 'Sinh viên đã thuộc nhóm nghiên cứu này',
        errorCode: 'ALREADY_IN_TARGET_GROUP',
      });
    }

    const laTruongNhom = nhomCu.truongNhomSinhVienId === sinhVienId;
    if (laTruongNhom && nhomCu.soLuongThanhVien > 1) {
      throw new ConflictError({
        message: 'Trưởng nhóm phải giải tán nhóm hoặc chuyển quyền trước khi tham gia nhóm khác',
        errorCode: 'LEADER_MUST_TRANSFER_OR_DISBAND_FIRST',
      });
    }

    if (laTruongNhom) {
      await this.ghepNhomRepository.huyLoiMoiDangChoCuaNhom(nhomCu.id, giaoDich);
      await this.ghepNhomRepository.xoaTatCaThanhVienNhom(nhomCu.id, giaoDich);
      await this.ghepNhomRepository.xoaNhom(nhomCu.id, giaoDich);

      await nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.XOA_NHOM,
        loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
        doiTuongId: nhomCu.id,
        trangThaiTruoc: {
          trangThai: nhomCu.trangThai,
          soLuongThanhVien: nhomCu.soLuongThanhVien,
        },
        trangThaiSau: null,
        duLieuBoSung: {
          trigger: 'JOINED_NEW_GROUP',
          newGroupId: nhomMucTieuId.toString(),
        },
      });

      return;
    }

    await this.ghepNhomRepository.xoaThanhVienKhoiNhom(nhomCu.id, sinhVienId, giaoDich);
    await this.ghepNhomRepository.capNhatSoLuongVaTrangThaiNhom(
      nhomCu.id,
      nhomCu.soLuongThanhVien - 1,
      GroupStatus.DANG_TUYEN_THANH_VIEN,
      giaoDich
    );

    await nhatKyKiemToanService.taoBanGhi({
      nguoiThucHienId: sinhVienId,
      vaiTroNguoiThucHien: UserRole.SINH_VIEN,
      hanhDong: AuditAction.ROI_NHOM,
      loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
      doiTuongId: nhomCu.id,
      trangThaiTruoc: {
        trangThai: nhomCu.trangThai,
        soLuongThanhVien: nhomCu.soLuongThanhVien,
      },
      trangThaiSau: {
        soLuongThanhVien: nhomCu.soLuongThanhVien - 1,
        trangThai: GroupStatus.DANG_TUYEN_THANH_VIEN,
      },
      duLieuBoSung: {
        trigger: 'JOINED_NEW_GROUP',
        newGroupId: nhomMucTieuId.toString(),
        switchedAt: thoiDiemHienTai.toISOString(),
      },
    });
  }
}

const ghepNhomService = new GhepNhomService();

export { GhepNhomService, ghepNhomService };
