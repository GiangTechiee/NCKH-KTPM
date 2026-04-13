import { GroupStatus, StudentWorkflowStatus } from '../../../common/constants';
import { NotFoundError } from '../../../common/exceptions';
import { NguoiDungRepository } from '../repositories/nguoi-dung.repository';
import { LecturerAccountOption, StudentAccountOption } from '../types/nguoi-dung.types';

type SinhVienTaiKhoan = Awaited<ReturnType<NguoiDungRepository['lietKeTaiKhoanSinhVien']>>[number];
type GiangVienTaiKhoan = Awaited<ReturnType<NguoiDungRepository['lietKeTaiKhoanGiangVien']>>[number];
type NhomGanDayGiangVien = GiangVienTaiKhoan['nhomNghienCuu'][number];
type SinhVienThucThe = NonNullable<Awaited<ReturnType<NguoiDungRepository['timSinhVienTheoMa']>>>;
type GiangVienThucThe = NonNullable<Awaited<ReturnType<NguoiDungRepository['timGiangVienTheoMa']>>>;

function xacDinhTrangThaiTienTrinhSinhVien(input: {
  coDangKyMang: boolean;
  coNhom: boolean;
  coDeTai: boolean;
}): StudentAccountOption['workflowStatus'] {
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

class NguoiDungService {
  constructor(private readonly nguoiDungRepository: NguoiDungRepository = new NguoiDungRepository()) {}

  async laySinhVienTheoMa(maSinhVien: string): Promise<SinhVienThucThe> {
    const sinhVien = await this.nguoiDungRepository.timSinhVienTheoMa(maSinhVien);

    if (!sinhVien) {
      throw new NotFoundError('Không tìm thấy sinh viên', [
        { field: 'x-ma-sinh-vien', code: 'STUDENT_NOT_FOUND', detail: maSinhVien },
      ]);
    }

    return sinhVien;
  }

  async layGiangVienTheoMa(maGiangVien: string): Promise<GiangVienThucThe> {
    const giangVien = await this.nguoiDungRepository.timGiangVienTheoMa(maGiangVien);

    if (!giangVien) {
      throw new NotFoundError('Không tìm thấy giảng viên', [
        { field: 'x-ma-giang-vien', code: 'LECTURER_NOT_FOUND', detail: maGiangVien },
      ]);
    }

    return giangVien;
  }

  async lietKeTaiKhoanSinhVien(): Promise<StudentAccountOption[]> {
    const danhSachSinhVien = await this.nguoiDungRepository.lietKeTaiKhoanSinhVien();

    return danhSachSinhVien.map((sinhVien: SinhVienTaiKhoan) => {
      const dangKyMangGanNhat = sinhVien.dangKyMang[0] ?? null;
      const nhomDangThamGia = sinhVien.thanhVienNhom[0]?.nhomNghienCuu ?? null;
      const deTaiHienTai = nhomDangThamGia?.deTai ?? null;

      return {
        code: sinhVien.maSinhVien,
        displayName: `${sinhVien.maSinhVien} - ${sinhVien.hoTen}`,
        fullName: sinhVien.hoTen,
        className: sinhVien.tenLop,
        facultyName: sinhVien.tenKhoa,
        workflowStatus: xacDinhTrangThaiTienTrinhSinhVien({
          coDangKyMang: Boolean(dangKyMangGanNhat),
          coNhom: Boolean(nhomDangThamGia),
          coDeTai: Boolean(deTaiHienTai),
        }),
        researchAreaCode: dangKyMangGanNhat?.mangNghienCuu.maMang ?? null,
        researchAreaName: dangKyMangGanNhat?.mangNghienCuu.tenMang ?? null,
        registrationStatus: dangKyMangGanNhat?.trangThai ?? null,
        groupName: nhomDangThamGia?.tenNhom ?? null,
        groupStatus: (nhomDangThamGia?.trangThai as GroupStatus | undefined) ?? null,
        topicName: deTaiHienTai?.tenDeTai ?? null,
        topicStatus: deTaiHienTai?.trangThai ?? null,
      };
    });
  }

  async lietKeTaiKhoanGiangVien(): Promise<LecturerAccountOption[]> {
    const danhSachGiangVien = await this.nguoiDungRepository.lietKeTaiKhoanGiangVien();

    return danhSachGiangVien.map((giangVien: GiangVienTaiKhoan) => ({
      code: giangVien.maGiangVien,
      displayName: `${giangVien.maGiangVien} - ${giangVien.hoTen}`,
      fullName: giangVien.hoTen,
      departmentName: giangVien.tenBoMon,
      expertise: giangVien.chuyenMon,
      supervision: {
        currentGroupCount: giangVien.soNhomDangHuongDan,
        maxGroupCount: giangVien.soNhomHuongDanToiDa,
        availableSlots: Math.max(giangVien.soNhomHuongDanToiDa - giangVien.soNhomDangHuongDan, 0),
      },
      recentGroups: giangVien.nhomNghienCuu.map((nhom: NhomGanDayGiangVien) => ({
        groupName: nhom.tenNhom,
        groupStatus: nhom.trangThai,
      })),
    }));
  }
}

const nguoiDungService = new NguoiDungService();

export { NguoiDungService, nguoiDungService };
