import { PrismaClient } from '@prisma/client';
import {
  AuditAction,
  AuditEntityType,
  GroupStatus,
  UserRole,
} from '../../../common/constants';
import { ConflictError, ForbiddenError, NotFoundError } from '../../../common/exceptions';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';
import { nhatKyKiemToanService } from '../../nhat-ky-kiem-toan/services/nhat-ky-kiem-toan.service';
import { thongBaoService } from '../../thong-bao/services/thong-bao.service';
import { PhanCongGiangVienRepository } from '../repositories/phan-cong-giang-vien.repository';
import {
  ChiTietNhomUngVienResponse,
  NhomDangHuongDanResponse,
  NhomUngVienHuongDanResponse,
} from '../types/phan-cong-giang-vien.types';

function boDauVaChuanHoa(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function xacDinhPhuHopChuyenMon(chuyenMon: string | null, maMang: string, tenMang: string): boolean {
  const chuoiChuyenMon = boDauVaChuanHoa(chuyenMon || '');
  const ma = boDauVaChuanHoa(maMang);
  const ten = boDauVaChuanHoa(tenMang);

  const bangTuKhoa = [
    { mang: 'ai', keywords: ['ai', 'tri tue nhan tao', 'phan tich du lieu', 'du lieu'] },
    { mang: 'web', keywords: ['web', 'ung dung web', 'kien truc he thong', 'phan mem'] },
    { mang: 'iot', keywords: ['iot', 'he thong nhung', 'nhung', 'cam bien'] },
  ];

  const nhanMang = bangTuKhoa.find((item) => ma.includes(item.mang) || ten.includes(item.mang));
  if (!nhanMang) {
    return true;
  }

  return nhanMang.keywords.some((keyword) => chuoiChuyenMon.includes(keyword));
}

class PhanCongGiangVienService {
  private readonly prisma: PrismaClient;

  constructor(
    private readonly phanCongGiangVienRepository: PhanCongGiangVienRepository = new PhanCongGiangVienRepository()
  ) {
    this.prisma = getPrismaClient();
  }

  private mapNhomUngVien(
    nhom: {
      id: bigint;
      tenNhom: string;
      trangThai: string;
      soLuongThanhVien: number;
      mangNghienCuu: { id: bigint; maMang: string; tenMang: string };
      truongNhom: { id: bigint; maSinhVien: string; hoTen: string };
      thanhVien: Array<{
        id: bigint;
        vaiTro: string;
        sinhVien: { maSinhVien: string; hoTen: string };
      }>;
      giangVien?: { id: bigint; maGiangVien: string; hoTen: string } | null;
      deTai?: {
        id: bigint;
        tenDeTai: string;
        trangThai: string;
        loaiDeTai: string;
        soLanChinhSua: number;
        thoiGianNop: Date | null;
        thoiGianDuyet: Date | null;
        thoiGianChot: Date | null;
      } | null;
    } | null,
    phuHopChuyenMon: boolean
  ): ChiTietNhomUngVienResponse | NhomDangHuongDanResponse {
    if (!nhom) {
      throw new NotFoundError('Không tìm thấy nhóm nghiên cứu');
    }

    return {
      id: nhom.id,
      tenNhom: nhom.tenNhom,
      trangThai: nhom.trangThai,
      soLuongThanhVien: nhom.soLuongThanhVien,
      mangNghienCuu: {
        id: nhom.mangNghienCuu.id,
        maMang: nhom.mangNghienCuu.maMang,
        tenMang: nhom.mangNghienCuu.tenMang,
      },
      truongNhom: {
        id: nhom.truongNhom.id,
        maSinhVien: nhom.truongNhom.maSinhVien,
        hoTen: nhom.truongNhom.hoTen,
      },
      thanhVien: nhom.thanhVien.map((thanhVien) => ({
        id: thanhVien.id,
        maSinhVien: thanhVien.sinhVien.maSinhVien,
        hoTen: thanhVien.sinhVien.hoTen,
        vaiTro: thanhVien.vaiTro,
      })),
      phuHopChuyenMon,
      giangVienHuongDan: nhom.giangVien
        ? {
            id: nhom.giangVien.id,
            maGiangVien: nhom.giangVien.maGiangVien,
            hoTen: nhom.giangVien.hoTen,
          }
        : null,
      deTai: nhom.deTai
        ? {
            id: nhom.deTai.id,
            tenDeTai: nhom.deTai.tenDeTai,
            trangThai: nhom.deTai.trangThai,
            loaiDeTai: nhom.deTai.loaiDeTai,
            soLanChinhSua: nhom.deTai.soLanChinhSua,
            thoiGianNop: nhom.deTai.thoiGianNop,
            thoiGianDuyet: nhom.deTai.thoiGianDuyet,
            thoiGianChot: nhom.deTai.thoiGianChot,
          }
        : null,
    };
  }

  async layDanhSachNhomCoTheNhan(giangVien: {
    id: bigint;
    chuyenMon: string | null;
  }): Promise<NhomUngVienHuongDanResponse[]> {
    const nhomUngVien = await this.phanCongGiangVienRepository.timDanhSachNhomUngVien();

    return nhomUngVien.map((nhom) =>
      this.mapNhomUngVien(
        nhom,
        xacDinhPhuHopChuyenMon(giangVien.chuyenMon, nhom.mangNghienCuu.maMang, nhom.mangNghienCuu.tenMang)
      )
    );
  }

  async layDanhSachNhomDangHuongDan(giangVien: {
    id: bigint;
    chuyenMon: string | null;
  }): Promise<NhomDangHuongDanResponse[]> {
    const danhSachNhom = await this.phanCongGiangVienRepository.timDanhSachNhomDangHuongDan(giangVien.id);

    return danhSachNhom.map((nhom) =>
      this.mapNhomUngVien(
        nhom,
        xacDinhPhuHopChuyenMon(giangVien.chuyenMon, nhom.mangNghienCuu.maMang, nhom.mangNghienCuu.tenMang)
      ) as NhomDangHuongDanResponse
    );
  }

  async layChiTietNhomUngVien(
    giangVien: { id: bigint; chuyenMon: string | null },
    groupId: bigint
  ): Promise<ChiTietNhomUngVienResponse> {
    const nhom = await this.phanCongGiangVienRepository.timChiTietNhomTheoId(groupId);
    if (!nhom) {
      throw new NotFoundError('Không tìm thấy nhóm nghiên cứu');
    }

    return this.mapNhomUngVien(
      nhom,
      xacDinhPhuHopChuyenMon(giangVien.chuyenMon, nhom.mangNghienCuu.maMang, nhom.mangNghienCuu.tenMang)
    );
  }

  async nhanHuongDanNhom(giangVien: {
    id: bigint;
    maGiangVien: string;
    hoTen: string;
    chuyenMon: string | null;
    soNhomHuongDanToiDa: number;
    soNhomDangHuongDan: number;
  }, groupId: bigint) {
    const nhom = await this.phanCongGiangVienRepository.timChiTietNhomTheoId(groupId);
    if (!nhom) {
      throw new NotFoundError('Không tìm thấy nhóm nghiên cứu');
    }

    if (nhom.giangVienId) {
      throw new ConflictError({
        message: 'Nhóm này đã có giảng viên hướng dẫn',
        errorCode: 'GROUP_ALREADY_ASSIGNED',
      });
    }

    if (giangVien.soNhomDangHuongDan >= giangVien.soNhomHuongDanToiDa) {
      throw new ConflictError({
        message: 'Giảng viên đã hết quota hướng dẫn',
        errorCode: 'LECTURER_QUOTA_EXCEEDED',
      });
    }

    const phuHopChuyenMon = xacDinhPhuHopChuyenMon(
      giangVien.chuyenMon,
      nhom.mangNghienCuu.maMang,
      nhom.mangNghienCuu.tenMang
    );

    if (!phuHopChuyenMon) {
      throw new ForbiddenError({
        message: 'Nhóm nghiên cứu không phù hợp chuyên môn của giảng viên',
        errorCode: 'LECTURER_SPECIALIZATION_MISMATCH',
      });
    }

    const ketQua = await this.prisma.$transaction(async (giaoDich) => {
      const nhomDaCapNhat = await this.phanCongGiangVienRepository.capNhatNhomHuongDan(
        groupId,
        giangVien.id,
        giaoDich
      );

      const giangVienDaCapNhat = await this.phanCongGiangVienRepository.tangSoNhomDangHuongDan(
        giangVien.id,
        giaoDich
      );

      return { nhomDaCapNhat, giangVienDaCapNhat };
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: giangVien.id,
        vaiTroNguoiThucHien: UserRole.GIANG_VIEN,
        hanhDong: AuditAction.GIANG_VIEN_NHAN_NHOM,
        loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
        doiTuongId: ketQua.nhomDaCapNhat.id,
        trangThaiTruoc: {
          giangVienId: null,
          trangThai: nhom.trangThai,
        },
        trangThaiSau: {
          giangVienId: giangVien.id.toString(),
          trangThai: ketQua.nhomDaCapNhat.trangThai,
        },
      }),
      thongBaoService.taoNhieuThongBao(
        nhom.thanhVien.map((thanhVien) => ({
          nguoiNhanId: thanhVien.sinhVien.id,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Nhóm đã có giảng viên hướng dẫn',
          noiDung: `Giảng viên ${giangVien.hoTen} đã nhận hướng dẫn nhóm ${nhom.tenNhom}.`,
          loaiThongBao: 'GIANG_VIEN_NHAN_HUONG_DAN_NHOM',
          loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
          doiTuongId: nhom.id,
        }))
      ),
    ]);

    return {
      groupId: ketQua.nhomDaCapNhat.id,
      lecturerId: giangVien.id,
      lecturerCode: giangVien.maGiangVien,
      groupStatus: ketQua.nhomDaCapNhat.trangThai,
      currentLecturerLoad: ketQua.giangVienDaCapNhat.soNhomDangHuongDan,
    };
  }
}

const phanCongGiangVienService = new PhanCongGiangVienService();

export { PhanCongGiangVienService, phanCongGiangVienService };
