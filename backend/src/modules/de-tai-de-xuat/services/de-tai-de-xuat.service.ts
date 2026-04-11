import { PrismaClient } from '@prisma/client';
import {
  AuditAction,
  AuditEntityType,
  GroupStatus,
  TopicSource,
  TopicSubmissionStatus,
  UserRole,
} from '../../../common/constants';
import { ConflictError, ForbiddenError, NotFoundError } from '../../../common/exceptions';
import { getPrismaClient } from '../../../infrastructure/database/trinh-khach-prisma';
import { nhatKyKiemToanService } from '../../nhat-ky-kiem-toan/services/nhat-ky-kiem-toan.service';
import { thongBaoService } from '../../thong-bao/services/thong-bao.service';
import { TaoDeTaiDeXuatDto } from '../dto/tao-de-tai-de-xuat.dto';
import { DeTaiDeXuatRepository } from '../repositories/de-tai-de-xuat.repository';
import { ChonDeTaiDeXuatResponse, DeTaiDeXuatResponse } from '../types/de-tai-de-xuat.types';

function mapDeTaiDeXuat(
  deTai: {
    id: bigint;
    tenDeTai: string;
    loaiDeTai: string;
    trangThai: string;
    moTaVanDe: string;
    mucTieuNghienCuu: string;
    ungDungThucTien: string | null;
    phamViNghienCuu: string | null;
    congNgheSuDung: string | null;
    lyDoLuaChon: string | null;
    thoiGianNop: Date | null;
    nhom: {
      id: bigint;
      tenNhom: string;
      trangThai: string;
      thanhVien: Array<{
        id: bigint;
        vaiTro: string;
        sinhVien: { maSinhVien: string; hoTen: string };
      }>;
    };
  }
): DeTaiDeXuatResponse {
  return {
    id: deTai.id,
    tenDeTai: deTai.tenDeTai,
    loaiDeTai: deTai.loaiDeTai,
    trangThai: deTai.trangThai,
    moTaVanDe: deTai.moTaVanDe,
    mucTieuNghienCuu: deTai.mucTieuNghienCuu,
    ungDungThucTien: deTai.ungDungThucTien,
    phamViNghienCuu: deTai.phamViNghienCuu,
    congNgheSuDung: deTai.congNgheSuDung,
    lyDoLuaChon: deTai.lyDoLuaChon,
    thoiGianNop: deTai.thoiGianNop,
    nhom: {
      id: deTai.nhom.id,
      tenNhom: deTai.nhom.tenNhom,
      trangThai: deTai.nhom.trangThai,
      thanhVien: deTai.nhom.thanhVien.map((thanhVien) => ({
        id: thanhVien.id,
        maSinhVien: thanhVien.sinhVien.maSinhVien,
        hoTen: thanhVien.sinhVien.hoTen,
        vaiTro: thanhVien.vaiTro,
      })),
    },
  };
}

class DeTaiDeXuatService {
  private readonly prisma: PrismaClient;
  private readonly danhSachTrangThaiNhomHopLe = new Set<string>([
    GroupStatus.DA_CO_GIANG_VIEN,
    GroupStatus.DANG_CHON_DE_TAI,
  ]);

  constructor(
    private readonly deTaiDeXuatRepository: DeTaiDeXuatRepository = new DeTaiDeXuatRepository()
  ) {
    this.prisma = getPrismaClient();
  }

  private kiemTraNhomCoTheNhanDeTaiDeXuat(nhom: {
    id: bigint;
    tenNhom: string;
    trangThai: string;
    giangVienId: bigint | null;
    deTai: { id: bigint; trangThai: string } | null;
  }, giangVienId: bigint) {
    if (!nhom.giangVienId) {
      throw new ConflictError({
        message: 'Nhóm chưa có giảng viên hướng dẫn nên chưa thể nhận đề tài đề xuất',
        errorCode: 'GROUP_HAS_NO_LECTURER',
      });
    }

    if (nhom.giangVienId !== giangVienId) {
      throw new ForbiddenError({
        message: 'Giảng viên không phải người đang hướng dẫn nhóm này',
        errorCode: 'LECTURER_NOT_ASSIGNED_TO_GROUP',
      });
    }

    if (nhom.trangThai === GroupStatus.DA_CHOT_DE_TAI) {
      throw new ConflictError({
        message: 'Nhóm đã chốt đề tài nên không thể tạo đề tài đề xuất mới',
        errorCode: 'GROUP_TOPIC_ALREADY_FINALIZED',
      });
    }

    if (!this.danhSachTrangThaiNhomHopLe.has(nhom.trangThai)) {
      throw new ConflictError({
        message: 'Trạng thái nhóm hiện tại chưa phù hợp để tạo đề tài đề xuất',
        errorCode: 'GROUP_STATUS_NOT_ELIGIBLE_FOR_PROPOSAL',
      });
    }

    if (nhom.deTai) {
      throw new ConflictError({
        message: 'Nhóm đã có đề tài nên không thể tạo thêm đề tài đề xuất',
        errorCode: 'TOPIC_ALREADY_EXISTS',
      });
    }
  }

  private kiemTraNhomCoTheChonDeTaiDeXuat(nhom: {
    id: bigint;
    trangThai: string;
    giangVienId: bigint | null;
  }) {
    if (!nhom.giangVienId) {
      throw new ConflictError({
        message: 'Nhóm chưa có giảng viên hướng dẫn nên chưa thể chọn đề tài đề xuất',
        errorCode: 'GROUP_HAS_NO_LECTURER',
      });
    }

    if (nhom.trangThai !== GroupStatus.DA_CO_GIANG_VIEN && nhom.trangThai !== GroupStatus.DANG_CHON_DE_TAI) {
      throw new ConflictError({
        message: 'Trạng thái nhóm hiện tại chưa phù hợp để chọn đề tài đề xuất',
        errorCode: 'GROUP_STATUS_NOT_ELIGIBLE_FOR_PROPOSAL_SELECTION',
      });
    }
  }

  async taoDeTaiDeXuat(giangVienId: bigint, input: TaoDeTaiDeXuatDto): Promise<DeTaiDeXuatResponse> {
    const nhom = await this.deTaiDeXuatRepository.timChiTietNhomTheoId(input.groupId);
    if (!nhom) {
      throw new NotFoundError('Không tìm thấy nhóm nghiên cứu');
    }

    this.kiemTraNhomCoTheNhanDeTaiDeXuat(nhom, giangVienId);

    const deTaiDaTao = await this.prisma.$transaction(async (giaoDich) => {
      const deTai = await this.deTaiDeXuatRepository.taoDeTaiDeXuat(
        {
          nhomNghienCuuId: nhom.id,
          giangVienId,
          tenDeTai: input.tenDeTai,
          moTaVanDe: input.moTaVanDe,
          mucTieuNghienCuu: input.mucTieuNghienCuu,
          ungDungThucTien: input.ungDungThucTien || null,
          phamViNghienCuu: input.phamViNghienCuu || null,
          congNgheSuDung: input.congNgheSuDung || null,
          lyDoLuaChon: input.lyDoLuaChon || null,
        },
        giaoDich
      );

      await this.deTaiDeXuatRepository.capNhatTrangThaiNhom(nhom.id, giaoDich);

      return deTai;
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: giangVienId,
        vaiTroNguoiThucHien: UserRole.GIANG_VIEN,
        hanhDong: AuditAction.TAO_DE_XUAT_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: deTaiDaTao.id,
        trangThaiTruoc: {
          nhomNghienCuuId: nhom.id.toString(),
          trangThaiNhom: nhom.trangThai,
          deTaiId: null,
        },
        trangThaiSau: {
          loaiDeTai: TopicSource.GIANG_VIEN_DE_XUAT,
          trangThaiDeTai: TopicSubmissionStatus.NHAP,
          trangThaiNhom: GroupStatus.DANG_CHON_DE_TAI,
        },
      }),
      thongBaoService.taoNhieuThongBao(
        nhom.thanhVien.map((thanhVien) => ({
          nguoiNhanId: thanhVien.sinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Có đề tài giảng viên đề xuất mới',
          noiDung: `Giảng viên đã đề xuất đề tài "${deTaiDaTao.tenDeTai}" cho nhóm ${nhom.tenNhom}.`,
          loaiThongBao: 'CO_DE_TAI_GIANG_VIEN_DE_XUAT',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTaiDaTao.id,
        }))
      ),
    ]);

    return mapDeTaiDeXuat({
      ...deTaiDaTao,
      nhom: {
        id: nhom.id,
        tenNhom: nhom.tenNhom,
        trangThai: GroupStatus.DANG_CHON_DE_TAI,
        thanhVien: nhom.thanhVien,
      },
    });
  }

  async layDanhSachDeTaiDeXuatChoSinhVien(sinhVienId: bigint): Promise<DeTaiDeXuatResponse[]> {
    const thanhVien = await this.deTaiDeXuatRepository.timNhomCuaSinhVien(sinhVienId);
    if (!thanhVien) {
      return [];
    }

    const nhom = thanhVien.nhomNghienCuu;
    const danhSach = await this.deTaiDeXuatRepository.timDanhSachDeTaiDeXuatTheoNhom(nhom.id);
    return danhSach.map((deTai) =>
      mapDeTaiDeXuat({
        ...deTai,
        nhom: deTai.nhomNghienCuu,
      })
    );
  }

  async chonDeTaiDeXuat(sinhVienId: bigint, deTaiId: bigint): Promise<ChonDeTaiDeXuatResponse> {
    const deTai = await this.deTaiDeXuatRepository.timDeTaiDeXuatTheoId(deTaiId);
    if (!deTai) {
      throw new NotFoundError('Không tìm thấy đề tài đề xuất');
    }

    const laThanhVienCuaNhom = deTai.nhomNghienCuu.thanhVien.some((thanhVien) => thanhVien.sinhVienId === sinhVienId);
    if (!laThanhVienCuaNhom) {
      throw new ForbiddenError({
        message: 'Sinh viên không thuộc nhóm được đề xuất đề tài này',
        errorCode: 'STUDENT_NOT_IN_PROPOSED_GROUP',
      });
    }

    this.kiemTraNhomCoTheChonDeTaiDeXuat(deTai.nhomNghienCuu);

    const deTaiDaChon = await this.prisma.$transaction(async (giaoDich) => {
      const deTaiCapNhat = await this.deTaiDeXuatRepository.capNhatDeTaiSauKhiChon(deTai.id, giaoDich);
      await this.deTaiDeXuatRepository.capNhatTrangThaiNhomTheoGiaTri(
        deTai.nhomNghienCuu.id,
        GroupStatus.CHO_DUYET_DE_TAI,
        giaoDich
      );

      return deTaiCapNhat;
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.NOP_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: deTai.id,
        trangThaiTruoc: {
          trangThaiDeTai: deTai.trangThai,
          trangThaiNhom: deTai.nhomNghienCuu.trangThai,
        },
        trangThaiSau: {
          loaiDeTai: TopicSource.GIANG_VIEN_DE_XUAT,
          trangThaiDeTai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
          trangThaiNhom: GroupStatus.CHO_DUYET_DE_TAI,
        },
      }),
      thongBaoService.taoNhieuThongBao([
        {
          nguoiNhanId: deTai.giangVienId!,
          loaiNguoiNhan: UserRole.GIANG_VIEN,
          tieuDe: 'Nhóm đã chọn đề tài giảng viên đề xuất',
          noiDung: `Nhóm ${deTai.nhomNghienCuu.tenNhom} đã chọn đề tài "${deTai.tenDeTai}" và gửi để chờ duyệt.`,
          loaiThongBao: 'NHOM_CHON_DE_TAI_GIANG_VIEN_DE_XUAT',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTai.id,
        },
      ]),
    ]);

    return {
      ...mapDeTaiDeXuat({
        ...deTaiDaChon,
        nhom: {
          ...deTai.nhomNghienCuu,
          trangThai: GroupStatus.CHO_DUYET_DE_TAI,
        },
      }),
      daChon: true,
    };
  }
}

const deTaiDeXuatService = new DeTaiDeXuatService();

export { DeTaiDeXuatService, deTaiDeXuatService };
