import { AuditAction, AuditEntityType, UserRole } from '../../../common/constants';
import { ConflictError, ValidationError } from '../../../common/exceptions';
import { nhatKyKiemToanService } from '../../nhat-ky-kiem-toan/services/nhat-ky-kiem-toan.service';
import { thongBaoService } from '../../thong-bao/services/thong-bao.service';
import { DangKyMangNghienCuuDto } from '../dto/dang-ky-mang-nghien-cuu.dto';
import { DangKyMangNghienCuuRepository } from '../repositories/dang-ky-mang-nghien-cuu.repository';
import { DangKyMangResponse, MangNghienCuuDangMoResponse } from '../types/dang-ky-mang-nghien-cuu.types';

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

  async dangKyMang(sinhVienId: bigint, input: DangKyMangNghienCuuDto): Promise<DangKyMangResponse> {
    const dangKyHienTai = await this.dangKyMangNghienCuuRepository.timDangKyGanNhatCuaSinhVien(sinhVienId);
    if (dangKyHienTai) {
      throw new ConflictError({
        message: 'Sinh viên đã đăng ký mảng nghiên cứu trong đợt hiện tại',
        errorCode: 'ALREADY_REGISTERED_RESEARCH_AREA',
        errors: [{ field: 'mangNghienCuuId', code: 'ALREADY_REGISTERED' }],
      });
    }

    const mangNghienCuu = await this.dangKyMangNghienCuuRepository.timMangTheoId(input.mangNghienCuuId);
    if (!mangNghienCuu) {
      throw new ValidationError('Mảng nghiên cứu không tồn tại', [
        { field: 'mangNghienCuuId', code: 'RESEARCH_AREA_NOT_FOUND' },
      ]);
    }

    const thoiDiemHienTai = new Date();
    if (thoiDiemHienTai < mangNghienCuu.thoiGianMoDangKy || thoiDiemHienTai > mangNghienCuu.thoiGianDongDangKy) {
      throw new ConflictError({
        message: 'Đợt đăng ký mảng nghiên cứu không còn hiệu lực',
        errorCode: 'RESEARCH_AREA_REGISTRATION_CLOSED',
        errors: [{ field: 'mangNghienCuuId', code: 'REGISTRATION_CLOSED' }],
      });
    }

    const dangKy = await this.dangKyMangNghienCuuRepository.taoDangKy({
      sinhVienId,
      mangNghienCuuId: input.mangNghienCuuId,
      thoiGianDangKy: thoiDiemHienTai,
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
          noiDung: `Bạn đã đăng ký mảng ${mangNghienCuu.tenMang} thành công.`,
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
}

const dangKyMangNghienCuuService = new DangKyMangNghienCuuService();

export { DangKyMangNghienCuuService, dangKyMangNghienCuuService };
