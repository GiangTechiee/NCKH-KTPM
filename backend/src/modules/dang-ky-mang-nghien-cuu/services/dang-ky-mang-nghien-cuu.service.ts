import { AuditAction, AuditEntityType, RegistrationStatus, ResearchAreaStatus, UserRole } from '../../../common/constants';
import { ConflictError, NotFoundError, ValidationError } from '../../../common/exceptions';
import { nhatKyKiemToanService } from '../../nhat-ky-kiem-toan/services/nhat-ky-kiem-toan.service';
import { nhomNghienCuuService } from '../../nhom-nghien-cuu/services/nhom-nghien-cuu.service';
import { thongBaoService } from '../../thong-bao/services/thong-bao.service';
import { DangKyMangNghienCuuDto } from '../dto/dang-ky-mang-nghien-cuu.dto';
import { DangKyMangNghienCuuRepository } from '../repositories/dang-ky-mang-nghien-cuu.repository';
import {
  ChuyenMangResponse,
  DangKyHienTaiResponse,
  DangKyMangResponse,
  HuyDangKyResponse,
  MangNghienCuuDangMoResponse,
} from '../types/dang-ky-mang-nghien-cuu.types';

class DangKyMangNghienCuuService {
  constructor(
    private readonly dangKyMangNghienCuuRepository: DangKyMangNghienCuuRepository = new DangKyMangNghienCuuRepository()
  ) {}

  async layDanhSachMangDangMo(): Promise<MangNghienCuuDangMoResponse[]> {
    const danhSach = await this.dangKyMangNghienCuuRepository.timDanhSachMangDangMo(new Date());

    return danhSach.map((mang) => ({
      id: mang.id,
      maMang: mang.maMang,
      tenMang: mang.tenMang,
      moTa: mang.moTa,
      thoiGianMoDangKy: mang.thoiGianMoDangKy,
      thoiGianDongDangKy: mang.thoiGianDongDangKy,
      trangThai: mang.trangThai,
      soLuongDaDangKy: mang._count.dangKyMang,
    }));
  }

  async layDangKyHienTai(sinhVienId: bigint): Promise<DangKyHienTaiResponse | null> {
    const dangKy = await this.dangKyMangNghienCuuRepository.timDangKyHienTaiTrongDotMo(sinhVienId, new Date());
    if (!dangKy) {
      return null;
    }

    return {
      id: dangKy.id,
      sinhVienId: dangKy.sinhVienId,
      mangNghienCuuId: dangKy.mangNghienCuuId,
      thoiGianDangKy: dangKy.thoiGianDangKy,
      trangThai: dangKy.trangThai,
      mangNghienCuu: dangKy.mangNghienCuu,
    };
  }

  async dangKyMang(sinhVienId: bigint, input: DangKyMangNghienCuuDto): Promise<DangKyMangResponse | ChuyenMangResponse> {
    const thoiDiemHienTai = new Date();

    const dangKyHienTai = await this.dangKyMangNghienCuuRepository.timDangKyHienTaiTrongDotMo(sinhVienId, thoiDiemHienTai);

    const mangNghienCuu = await this.dangKyMangNghienCuuRepository.timMangTheoId(input.mangNghienCuuId);
    if (!mangNghienCuu) {
      throw new ValidationError('Mảng nghiên cứu không tồn tại', [
        { field: 'mangNghienCuuId', code: 'RESEARCH_AREA_NOT_FOUND' },
      ]);
    }

    if (mangNghienCuu.trangThai !== ResearchAreaStatus.OPEN
      || thoiDiemHienTai < mangNghienCuu.thoiGianMoDangKy
      || thoiDiemHienTai > mangNghienCuu.thoiGianDongDangKy) {
      throw new ConflictError({
        message: 'Đợt đăng ký mảng nghiên cứu không còn hiệu lực',
        errorCode: 'RESEARCH_AREA_REGISTRATION_CLOSED',
        errors: [{ field: 'mangNghienCuuId', code: 'REGISTRATION_CLOSED' }],
      });
    }

    if (dangKyHienTai && dangKyHienTai.mangNghienCuuId === input.mangNghienCuuId) {
      throw new ConflictError({
        message: 'Sinh viên đã đăng ký mảng nghiên cứu này trong đợt hiện tại',
        errorCode: 'ALREADY_REGISTERED_SAME_AREA',
        errors: [{ field: 'mangNghienCuuId', code: 'ALREADY_REGISTERED' }],
      });
    }

    if (dangKyHienTai) {
      return this.chuyenMang(sinhVienId, dangKyHienTai, input.mangNghienCuuId, mangNghienCuu.tenMang, thoiDiemHienTai);
    }

    return this.taoDangKyMoi(sinhVienId, input.mangNghienCuuId, mangNghienCuu.tenMang, thoiDiemHienTai);
  }

  async huyDangKy(sinhVienId: bigint): Promise<HuyDangKyResponse> {
    const thoiDiemHienTai = new Date();

    const dangKyHienTai = await this.dangKyMangNghienCuuRepository.timDangKyHienTaiTrongDotMo(sinhVienId, thoiDiemHienTai);
    if (!dangKyHienTai) {
      throw new NotFoundError('Không tìm thấy đăng ký mảng nghiên cứu đang hoạt động trong đợt hiện tại', [
        { field: 'sinhVienId', code: 'NO_ACTIVE_REGISTRATION' },
      ]);
    }

    await this.kiemTraSinhVienChuaCoNhom(sinhVienId);

    await this.dangKyMangNghienCuuRepository.capNhatTrangThaiDangKy(
      dangKyHienTai.id,
      RegistrationStatus.CANCELLED
    );

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.HUY_DANG_KY_MANG,
        loaiDoiTuong: AuditEntityType.SINH_VIEN_DANG_KY_MANG,
        doiTuongId: dangKyHienTai.id,
        trangThaiTruoc: {
          sinhVienId: dangKyHienTai.sinhVienId.toString(),
          mangNghienCuuId: dangKyHienTai.mangNghienCuuId.toString(),
          trangThai: RegistrationStatus.REGISTERED,
        },
        trangThaiSau: {
          sinhVienId: dangKyHienTai.sinhVienId.toString(),
          mangNghienCuuId: dangKyHienTai.mangNghienCuuId.toString(),
          trangThai: RegistrationStatus.CANCELLED,
        },
      }),
      thongBaoService.taoNhieuThongBao([
        {
          nguoiNhanId: sinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Hủy đăng ký mảng nghiên cứu thành công',
          noiDung: `Bạn đã hủy đăng ký mảng ${dangKyHienTai.mangNghienCuu.tenMang}.`,
          loaiThongBao: 'HUY_DANG_KY_MANG',
          loaiDoiTuong: AuditEntityType.SINH_VIEN_DANG_KY_MANG,
          doiTuongId: dangKyHienTai.id,
        },
      ]),
    ]);

    return {
      id: dangKyHienTai.id,
      mangNghienCuuId: dangKyHienTai.mangNghienCuuId,
      trangThai: RegistrationStatus.CANCELLED,
      tenMang: dangKyHienTai.mangNghienCuu.tenMang,
    };
  }

  private async chuyenMang(
    sinhVienId: bigint,
    dangKyCu: { id: bigint; sinhVienId: bigint; mangNghienCuuId: bigint; mangNghienCuu: { tenMang: string } },
    mangMoiId: bigint,
    tenMangMoi: string,
    thoiDiem: Date
  ): Promise<ChuyenMangResponse> {
    await this.kiemTraSinhVienChuaCoNhom(sinhVienId);

    await this.dangKyMangNghienCuuRepository.capNhatTrangThaiDangKy(
      dangKyCu.id,
      RegistrationStatus.CANCELLED
    );

    const dangKyMoi = await this.dangKyMangNghienCuuRepository.taoDangKy({
      sinhVienId,
      mangNghienCuuId: mangMoiId,
      thoiGianDangKy: thoiDiem,
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.HUY_DANG_KY_MANG,
        loaiDoiTuong: AuditEntityType.SINH_VIEN_DANG_KY_MANG,
        doiTuongId: dangKyCu.id,
        trangThaiTruoc: {
          sinhVienId: dangKyCu.sinhVienId.toString(),
          mangNghienCuuId: dangKyCu.mangNghienCuuId.toString(),
          trangThai: RegistrationStatus.REGISTERED,
        },
        trangThaiSau: {
          sinhVienId: dangKyCu.sinhVienId.toString(),
          mangNghienCuuId: dangKyCu.mangNghienCuuId.toString(),
          trangThai: RegistrationStatus.CANCELLED,
        },
      }),
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.DANG_KY_MANG,
        loaiDoiTuong: AuditEntityType.SINH_VIEN_DANG_KY_MANG,
        doiTuongId: dangKyMoi.id,
        trangThaiSau: {
          sinhVienId: dangKyMoi.sinhVienId.toString(),
          mangNghienCuuId: dangKyMoi.mangNghienCuuId.toString(),
          trangThai: dangKyMoi.trangThai,
        },
      }),
      thongBaoService.taoNhieuThongBao([
        {
          nguoiNhanId: sinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Chuyển mảng nghiên cứu thành công',
          noiDung: `Bạn đã chuyển từ mảng ${dangKyCu.mangNghienCuu.tenMang} sang mảng ${tenMangMoi}.`,
          loaiThongBao: 'CHUYEN_MANG_NGHIEN_CUU',
          loaiDoiTuong: AuditEntityType.SINH_VIEN_DANG_KY_MANG,
          doiTuongId: dangKyMoi.id,
        },
      ]),
    ]);

    return {
      dangKyMoi: {
        id: dangKyMoi.id,
        sinhVienId: dangKyMoi.sinhVienId,
        mangNghienCuuId: dangKyMoi.mangNghienCuuId,
        thoiGianDangKy: dangKyMoi.thoiGianDangKy,
        trangThai: dangKyMoi.trangThai,
      },
      dangKyCuDaHuy: {
        id: dangKyCu.id,
        mangNghienCuuId: dangKyCu.mangNghienCuuId,
        tenMangCu: dangKyCu.mangNghienCuu.tenMang,
      },
    };
  }

  private async taoDangKyMoi(
    sinhVienId: bigint,
    mangNghienCuuId: bigint,
    tenMang: string,
    thoiDiem: Date
  ): Promise<DangKyMangResponse> {
    const dangKy = await this.dangKyMangNghienCuuRepository.taoDangKy({
      sinhVienId,
      mangNghienCuuId,
      thoiGianDangKy: thoiDiem,
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.DANG_KY_MANG,
        loaiDoiTuong: AuditEntityType.SINH_VIEN_DANG_KY_MANG,
        doiTuongId: dangKy.id,
        trangThaiSau: {
          sinhVienId: dangKy.sinhVienId.toString(),
          mangNghienCuuId: dangKy.mangNghienCuuId.toString(),
          trangThai: dangKy.trangThai,
        },
      }),
      thongBaoService.taoNhieuThongBao([
        {
          nguoiNhanId: sinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Đăng ký mảng nghiên cứu thành công',
          noiDung: `Bạn đã đăng ký mảng ${tenMang} thành công.`,
          loaiThongBao: 'DANG_KY_MANG_THANH_CONG',
          loaiDoiTuong: AuditEntityType.SINH_VIEN_DANG_KY_MANG,
          doiTuongId: dangKy.id,
        },
      ]),
    ]);

    return {
      id: dangKy.id,
      sinhVienId: dangKy.sinhVienId,
      mangNghienCuuId: dangKy.mangNghienCuuId,
      thoiGianDangKy: dangKy.thoiGianDangKy,
      trangThai: dangKy.trangThai,
    };
  }

  private async kiemTraSinhVienChuaCoNhom(sinhVienId: bigint): Promise<void> {
    const nhomHienTai = await nhomNghienCuuService.layNhomCuaToi(sinhVienId);
    if (nhomHienTai) {
      throw new ConflictError({
        message: 'Không thể hủy hoặc chuyển mảng khi đã tham gia nhóm nghiên cứu',
        errorCode: 'STUDENT_HAS_GROUP',
        errors: [{ field: 'sinhVienId', code: 'HAS_ACTIVE_GROUP' }],
      });
    }
  }
}

const dangKyMangNghienCuuService = new DangKyMangNghienCuuService();

export { DangKyMangNghienCuuService, dangKyMangNghienCuuService };
