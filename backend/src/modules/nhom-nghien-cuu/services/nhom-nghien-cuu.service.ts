import { PrismaClient } from '@prisma/client';
import { AuditAction, AuditEntityType, GroupMemberRole, GroupStatus, MemberJoinStatus, UserRole } from '../../../common/constants';
import { ConflictError, ForbiddenError, ValidationError } from '../../../common/exceptions';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';
import { nhatKyKiemToanService } from '../../nhat-ky-kiem-toan/services/nhat-ky-kiem-toan.service';
import { thongBaoService } from '../../thong-bao/services/thong-bao.service';
import { nguoiDungService } from '../../nguoi-dung/services/nguoi-dung.service';
import { MoiThanhVienDto } from '../dto/moi-thanh-vien.dto';
import { TaoNhomNghienCuuDto } from '../dto/tao-nhom-nghien-cuu.dto';
import { NhomNghienCuuRepository } from '../repositories/nhom-nghien-cuu.repository';
import { NhomCuaToiResponse } from '../types/nhom-nghien-cuu.types';

const TRANG_THAI_NHOM_CO_THE_XOA = new Set<string>([
  GroupStatus.DANG_TUYEN_THANH_VIEN,
  GroupStatus.DA_DU_THANH_VIEN,
]);

const TRANG_THAI_NHOM_CO_THE_ROI = new Set<string>([
  GroupStatus.DANG_TUYEN_THANH_VIEN,
  GroupStatus.DA_DU_THANH_VIEN,
]);

class NhomNghienCuuService {
  private readonly prisma: PrismaClient;

  constructor(
    private readonly nhomNghienCuuRepository: NhomNghienCuuRepository = new NhomNghienCuuRepository()
  ) {
    this.prisma = getPrismaClient();
  }

  async layNhomCuaToi(sinhVienId: bigint): Promise<NhomCuaToiResponse | null> {
    const banGhiThanhVien = await this.nhomNghienCuuRepository.timNhomDangThamGia(sinhVienId);
    if (!banGhiThanhVien) {
      return null;
    }

    const nhom = banGhiThanhVien.nhomNghienCuu;

    return {
      id: nhom.id,
      tenNhom: nhom.tenNhom,
      trangThai: nhom.trangThai,
      soLuongThanhVien: nhom.soLuongThanhVien,
      mangNghienCuu: {
        id: nhom.mangNghienCuu.id,
        tenMang: nhom.mangNghienCuu.tenMang,
        maMang: nhom.mangNghienCuu.maMang,
      },
      giangVien: nhom.giangVien
        ? {
            id: nhom.giangVien.id,
            hoTen: nhom.giangVien.hoTen,
            maGiangVien: nhom.giangVien.maGiangVien,
          }
        : null,
      thanhVien: nhom.thanhVien.map((thanhVien) => ({
        id: thanhVien.id,
        sinhVienId: thanhVien.sinhVienId,
        maSinhVien: thanhVien.sinhVien.maSinhVien,
        hoTen: thanhVien.sinhVien.hoTen,
        vaiTro: thanhVien.vaiTro,
        trangThaiThamGia: thanhVien.trangThaiThamGia,
        thoiGianThamGia: thanhVien.thoiGianThamGia,
      })),
      loiMoiDaGui: nhom.loiMoi.map((loiMoi) => ({
        id: loiMoi.id,
        sinhVienDuocMoiId: loiMoi.sinhVienDuocMoiId,
        maSinhVien: loiMoi.sinhVienDuocMoi.maSinhVien,
        hoTen: loiMoi.sinhVienDuocMoi.hoTen,
        trangThai: loiMoi.trangThai,
        thoiGianMoi: loiMoi.thoiGianMoi,
      })),
    };
  }

  async taoNhomNghienCuu(sinhVienId: bigint, input: TaoNhomNghienCuuDto) {
    const dangKyMang = await this.nhomNghienCuuRepository.timDangKyMangGanNhat(sinhVienId);
    if (!dangKyMang) {
      throw new ConflictError({
        message: 'Sinh viên chưa đăng ký mảng nghiên cứu',
        errorCode: 'RESEARCH_AREA_REGISTRATION_REQUIRED',
      });
    }

    const nhomHienTai = await this.nhomNghienCuuRepository.timNhomDangThamGia(sinhVienId);
    if (nhomHienTai) {
      throw new ConflictError({
        message: 'Sinh viên đã thuộc một nhóm nghiên cứu',
        errorCode: 'ALREADY_IN_GROUP',
      });
    }

    const thoiDiemHienTai = new Date();
    const ketQua = await this.prisma.$transaction(async (giaoDich) => {
      const nhom = await this.nhomNghienCuuRepository.taoNhom(
        {
          tenNhom: input.tenNhom,
          mangNghienCuuId: dangKyMang.mangNghienCuuId,
          truongNhomSinhVienId: sinhVienId,
          thoiDiemTao: thoiDiemHienTai,
        },
        giaoDich
      );

      const thanhVien = await this.nhomNghienCuuRepository.taoThanhVienNhom(
        {
          nhomNghienCuuId: nhom.id,
          sinhVienId,
          vaiTro: GroupMemberRole.TRUONG_NHOM,
          trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          thoiGianThamGia: thoiDiemHienTai,
        },
        giaoDich
      );

      return { nhom, thanhVien };
    });

    await nhatKyKiemToanService.taoBanGhi({
      nguoiThucHienId: sinhVienId,
      vaiTroNguoiThucHien: UserRole.SINH_VIEN,
      hanhDong: AuditAction.TAO_NHOM,
      loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
      doiTuongId: ketQua.nhom.id,
      trangThaiSau: {
        tenNhom: ketQua.nhom.tenNhom,
        trangThai: ketQua.nhom.trangThai,
        soLuongThanhVien: ketQua.nhom.soLuongThanhVien,
      },
      duLieuBoSung: {
        thanhVienKhoiTaoId: ketQua.thanhVien.id.toString(),
      },
    });

    return {
      id: ketQua.nhom.id,
      tenNhom: ketQua.nhom.tenNhom,
      mangNghienCuuId: ketQua.nhom.mangNghienCuuId,
      truongNhomSinhVienId: ketQua.nhom.truongNhomSinhVienId,
      trangThai: ketQua.nhom.trangThai,
      soLuongThanhVien: ketQua.nhom.soLuongThanhVien,
    };
  }

  async moiThanhVien(sinhVienId: bigint, groupId: bigint, input: MoiThanhVienDto) {
    const nhom = await this.nhomNghienCuuRepository.timNhomTheoId(groupId);
    if (!nhom) {
      throw new ValidationError('Không tìm thấy nhóm nghiên cứu', [
        { field: 'groupId', code: 'GROUP_NOT_FOUND' },
      ]);
    }

    if (nhom.truongNhomSinhVienId !== sinhVienId) {
      throw new ForbiddenError({
        message: 'Chỉ trưởng nhóm mới được mời thành viên',
        errorCode: 'ONLY_GROUP_LEADER_CAN_INVITE',
      });
    }

    const soThanhVienDaChapNhan = await this.nhomNghienCuuRepository.demThanhVienDaChapNhan(groupId);
    if (soThanhVienDaChapNhan >= this.nhomNghienCuuRepository.layHangSoThanhVienToiDa()) {
      throw new ConflictError({
        message: 'Nhóm đã đủ số lượng thành viên',
        errorCode: 'GROUP_IS_FULL',
      });
    }

    const sinhVienDuocMoi = await nguoiDungService.laySinhVienTheoMa(input.maSinhVien);
    if (sinhVienDuocMoi.id === sinhVienId) {
      throw new ValidationError('Không thể tự mời chính mình vào nhóm', [
        { field: 'maSinhVien', code: 'SELF_INVITATION_NOT_ALLOWED' },
      ]);
    }

    const dangKyMang = await this.nhomNghienCuuRepository.timDangKyMangGanNhat(sinhVienDuocMoi.id);
    if (!dangKyMang || dangKyMang.mangNghienCuuId !== nhom.mangNghienCuuId) {
      throw new ConflictError({
        message: 'Chỉ được mời sinh viên cùng mảng nghiên cứu',
        errorCode: 'STUDENT_NOT_IN_SAME_RESEARCH_AREA',
      });
    }

    const nhomHienTai = await this.nhomNghienCuuRepository.timNhomDangThamGia(sinhVienDuocMoi.id);
    if (nhomHienTai) {
      throw new ConflictError({
        message: 'Sinh viên được mời đã thuộc một nhóm khác',
        errorCode: 'INVITED_STUDENT_ALREADY_IN_GROUP',
      });
    }

    const loiMoiChoPhanHoi = await this.nhomNghienCuuRepository.timLoiMoiChoPhanHoi(groupId, sinhVienDuocMoi.id);
    if (loiMoiChoPhanHoi) {
      throw new ConflictError({
        message: 'Đã tồn tại lời mời đang chờ phản hồi cho sinh viên này',
        errorCode: 'PENDING_INVITATION_ALREADY_EXISTS',
      });
    }

    const loiMoi = await this.nhomNghienCuuRepository.taoLoiMoi({
      nhomNghienCuuId: groupId,
      nguoiMoiSinhVienId: sinhVienId,
      sinhVienDuocMoiId: sinhVienDuocMoi.id,
      thoiGianMoi: new Date(),
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.MOI_THANH_VIEN,
        loaiDoiTuong: AuditEntityType.LOI_MOI_NHOM,
        doiTuongId: loiMoi.id,
        trangThaiSau: { trangThai: loiMoi.trangThai },
        duLieuBoSung: {
          nhomNghienCuuId: nhom.id.toString(),
          sinhVienDuocMoiId: sinhVienDuocMoi.id.toString(),
        },
      }),
      thongBaoService.taoNhieuThongBao([
        {
          nguoiNhanId: sinhVienDuocMoi.id,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Bạn vừa nhận được lời mời vào nhóm nghiên cứu',
          noiDung: `Nhóm ${nhom.tenNhom} đã gửi lời mời tham gia cho bạn.`,
          loaiThongBao: 'MOI_VAO_NHOM',
          loaiDoiTuong: AuditEntityType.LOI_MOI_NHOM,
          doiTuongId: loiMoi.id,
        },
      ]),
    ]);

    return {
      id: loiMoi.id,
      nhomNghienCuuId: loiMoi.nhomNghienCuuId,
      sinhVienDuocMoiId: loiMoi.sinhVienDuocMoiId,
      trangThai: loiMoi.trangThai,
      thoiGianMoi: loiMoi.thoiGianMoi,
    };
  }

  async xoaNhom(sinhVienId: bigint, groupId: bigint) {
    const nhom = await this.nhomNghienCuuRepository.timNhomTheoId(groupId);
    if (!nhom) {
      throw new ValidationError('Không tìm thấy nhóm nghiên cứu', [
        { field: 'groupId', code: 'GROUP_NOT_FOUND' },
      ]);
    }

    if (nhom.truongNhomSinhVienId !== sinhVienId) {
      throw new ForbiddenError({
        message: 'Chỉ trưởng nhóm mới được xóa nhóm',
        errorCode: 'ONLY_GROUP_LEADER_CAN_DELETE',
      });
    }

    if (!TRANG_THAI_NHOM_CO_THE_XOA.has(nhom.trangThai)) {
      throw new ConflictError({
        message: 'Nhóm không thể bị xóa ở trạng thái hiện tại',
        errorCode: 'GROUP_CANNOT_BE_DELETED_IN_CURRENT_STATE',
      });
    }

    const trangThaiTruoc = { tenNhom: nhom.tenNhom, trangThai: nhom.trangThai, soLuongThanhVien: nhom.soLuongThanhVien };

    await this.prisma.$transaction(async (giaoDich) => {
      await this.nhomNghienCuuRepository.huyLoiMoiDangChoCuaNhom(groupId, giaoDich);
      await this.nhomNghienCuuRepository.xoaTatCaThanhVienNhom(groupId, giaoDich);
      await this.nhomNghienCuuRepository.xoaNhom(groupId, giaoDich);
    });

    await nhatKyKiemToanService.taoBanGhi({
      nguoiThucHienId: sinhVienId,
      vaiTroNguoiThucHien: UserRole.SINH_VIEN,
      hanhDong: AuditAction.XOA_NHOM,
      loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
      doiTuongId: groupId,
      trangThaiTruoc,
      trangThaiSau: null,
      duLieuBoSung: {},
    });

    return { message: 'Xóa nhóm thành công' };
  }

  async roiNhom(sinhVienId: bigint, groupId: bigint) {
    const nhom = await this.nhomNghienCuuRepository.timNhomTheoId(groupId);
    if (!nhom) {
      throw new ValidationError('Không tìm thấy nhóm nghiên cứu', [
        { field: 'groupId', code: 'GROUP_NOT_FOUND' },
      ]);
    }

    if (nhom.truongNhomSinhVienId === sinhVienId) {
      throw new ForbiddenError({
        message: 'Trưởng nhóm không thể rời nhóm. Hãy xóa nhóm nếu muốn giải tán.',
        errorCode: 'GROUP_LEADER_CANNOT_LEAVE',
      });
    }

    if (!TRANG_THAI_NHOM_CO_THE_ROI.has(nhom.trangThai)) {
      throw new ConflictError({
        message: 'Không thể rời nhóm ở trạng thái hiện tại',
        errorCode: 'CANNOT_LEAVE_GROUP_IN_CURRENT_STATE',
      });
    }

    const banGhiThanhVien = await this.nhomNghienCuuRepository.timThanhVienTheoNhomVaSinhVien(groupId, sinhVienId);
    if (!banGhiThanhVien || banGhiThanhVien.trangThaiThamGia !== MemberJoinStatus.DA_CHAP_NHAN) {
      throw new ConflictError({
        message: 'Bạn không phải thành viên của nhóm này',
        errorCode: 'NOT_A_MEMBER',
      });
    }

    const soThanhVienHienTai = await this.nhomNghienCuuRepository.demThanhVienDaChapNhan(groupId);

    await this.prisma.$transaction(async (giaoDich) => {
      await this.nhomNghienCuuRepository.xoaThanhVienKhoiNhom(groupId, sinhVienId, giaoDich);
      await this.nhomNghienCuuRepository.capNhatSoLuongVaTrangThaiNhom(
        groupId,
        soThanhVienHienTai - 1,
        giaoDich
      );
    });

    await nhatKyKiemToanService.taoBanGhi({
      nguoiThucHienId: sinhVienId,
      vaiTroNguoiThucHien: UserRole.SINH_VIEN,
      hanhDong: AuditAction.ROI_NHOM,
      loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
      doiTuongId: groupId,
      trangThaiTruoc: { trangThai: nhom.trangThai, soLuongThanhVien: soThanhVienHienTai },
      trangThaiSau: { soLuongThanhVien: soThanhVienHienTai - 1 },
      duLieuBoSung: {},
    });

    return { message: 'Rời nhóm thành công' };
  }
}

const nhomNghienCuuService = new NhomNghienCuuService();

export { NhomNghienCuuService, nhomNghienCuuService };
