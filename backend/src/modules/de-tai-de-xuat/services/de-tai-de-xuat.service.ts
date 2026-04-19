import { PrismaClient } from '@prisma/client';
import {
  AuditAction,
  AuditEntityType,
  GroupStatus,
  TopicCatalogStatus,
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
import { ChonDeTaiDeXuatDto, ChonDeTaiDeXuatResponse, DeTaiDeXuatResponse } from '../types/de-tai-de-xuat.types';

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
  private readonly danhSachTrangThaiNhomCoTheChon = new Set<string>([
    GroupStatus.DA_CO_GIANG_VIEN,
    GroupStatus.DANG_CHON_DE_TAI,
    GroupStatus.CHO_DUYET_DE_TAI,
    GroupStatus.CAN_CHINH_SUA_DE_TAI,
  ]);
  private readonly danhSachTrangThaiDeTaiCoTheChuyen = new Set<string>([
    TopicSubmissionStatus.NHAP,
    TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
    TopicSubmissionStatus.CAN_CHINH_SUA,
    TopicSubmissionStatus.TU_CHOI,
  ]);

  constructor(
    private readonly deTaiDeXuatRepository: DeTaiDeXuatRepository = new DeTaiDeXuatRepository()
  ) {
    this.prisma = getPrismaClient();
  }

  private kiemTraNhomThuocGiangVien(
    nhom: {
      id: bigint;
      tenNhom: string;
      trangThai: string;
      giangVienId: bigint | null;
    },
    giangVienId: bigint
  ) {
    if (!nhom.giangVienId) {
      throw new ConflictError({
        message: 'Nhóm chưa có giảng viên hướng dẫn',
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
        message: 'Nhóm đã chốt đề tài nên không thể cấu hình danh mục đề tài đề xuất',
        errorCode: 'GROUP_TOPIC_ALREADY_FINALIZED',
      });
    }
  }

  private kiemTraNhomCoTheChonDeTaiDeXuat(nhom: {
    trangThai: string;
    giangVienId: bigint | null;
  }) {
    if (!nhom.giangVienId) {
      throw new ConflictError({
        message: 'Nhóm chưa có giảng viên hướng dẫn nên chưa thể chọn đề tài đề xuất',
        errorCode: 'GROUP_HAS_NO_LECTURER',
      });
    }

    if (!this.danhSachTrangThaiNhomCoTheChon.has(nhom.trangThai)) {
      throw new ConflictError({
        message: 'Trạng thái nhóm hiện tại chưa phù hợp để chọn đề tài đề xuất',
        errorCode: 'GROUP_STATUS_NOT_ELIGIBLE_FOR_PROPOSAL_SELECTION',
      });
    }
  }

  private kiemTraCoTheChuyenDeTai(trangThai: string) {
    if (!this.danhSachTrangThaiDeTaiCoTheChuyen.has(trangThai)) {
      throw new ConflictError({
        message: 'Đề tài đã được duyệt hoặc chốt nên không thể thay đổi',
        errorCode: 'TOPIC_NOT_SWITCHABLE',
      });
    }
  }

  async taoDeTaiDeXuat(giangVienId: bigint, input: TaoDeTaiDeXuatDto): Promise<DeTaiDeXuatResponse> {
    const nhom = await this.deTaiDeXuatRepository.timChiTietNhomTheoId(input.groupId);
    if (!nhom) {
      throw new NotFoundError('Không tìm thấy nhóm nghiên cứu');
    }

    this.kiemTraNhomThuocGiangVien(nhom, giangVienId);

    const deTaiDaTao = await this.prisma.$transaction(async (giaoDich) =>
      this.deTaiDeXuatRepository.taoDanhMucDeTaiGiangVien(
        {
          giangVienId,
          mangNghienCuuId: nhom.mangNghienCuuId,
          tenDeTai: input.tenDeTai,
          moTaVanDe: input.moTaVanDe,
          mucTieuNghienCuu: input.mucTieuNghienCuu,
          ungDungThucTien: input.ungDungThucTien || null,
          phamViNghienCuu: input.phamViNghienCuu || null,
          congNgheSuDung: input.congNgheSuDung || null,
          lyDoLuaChon: input.lyDoLuaChon || null,
        },
        giaoDich
      )
    );

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: giangVienId,
        vaiTroNguoiThucHien: UserRole.GIANG_VIEN,
        hanhDong: AuditAction.TAO_DE_XUAT_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: deTaiDaTao.id,
        trangThaiTruoc: {
          nhomNghienCuuId: nhom.id.toString(),
          mangNghienCuuId: nhom.mangNghienCuuId.toString(),
        },
        trangThaiSau: {
          loaiDeTai: TopicSource.GIANG_VIEN_DE_XUAT,
          trangThaiDeTai: TopicCatalogStatus.ACTIVE,
        },
      }),
      thongBaoService.taoNhieuThongBao(
        nhom.thanhVien.map((thanhVien) => ({
          nguoiNhanId: thanhVien.sinhVienId,
          loaiNguoiNhan: UserRole.SINH_VIEN,
          tieuDe: 'Có đề tài giảng viên đề xuất mới',
          noiDung: `Giảng viên đã bổ sung đề tài "${deTaiDaTao.tenDeTai}" vào danh mục đề tài của mảng ${nhom.mangNghienCuu.tenMang}.`,
          loaiThongBao: 'CO_DE_TAI_GIANG_VIEN_DE_XUAT',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTaiDaTao.id,
        }))
      ),
    ]);

    return mapDeTaiDeXuat({
      ...deTaiDaTao,
      loaiDeTai: TopicSource.GIANG_VIEN_DE_XUAT,
      thoiGianNop: null,
      nhom: {
        id: nhom.id,
        tenNhom: nhom.tenNhom,
        trangThai: nhom.trangThai,
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
    if (!nhom.giangVienId) {
      return [];
    }

    const danhSach = await this.deTaiDeXuatRepository.timDanhSachDeTaiDeXuatTheoMangVaGiangVien(
      nhom.mangNghienCuuId,
      nhom.giangVienId
    );

    return danhSach.map((deTai) =>
      mapDeTaiDeXuat({
        ...deTai,
        loaiDeTai: TopicSource.GIANG_VIEN_DE_XUAT,
        thoiGianNop: null,
        nhom: {
          id: nhom.id,
          tenNhom: nhom.tenNhom,
          trangThai: nhom.trangThai,
          thanhVien: nhom.thanhVien,
        },
      })
    );
  }

  async chonDeTaiDeXuat(
    sinhVienId: bigint,
    deTaiId: bigint,
    input: ChonDeTaiDeXuatDto
  ): Promise<ChonDeTaiDeXuatResponse> {
    const thanhVien = await this.deTaiDeXuatRepository.timNhomCuaSinhVien(sinhVienId);
    if (!thanhVien) {
      throw new NotFoundError('Sinh viên chưa thuộc nhóm nghiên cứu nào');
    }

    const nhom = thanhVien.nhomNghienCuu;
    const deTai = await this.deTaiDeXuatRepository.timDanhMucDeTaiTheoId(deTaiId);
    if (!deTai) {
      throw new NotFoundError('Không tìm thấy đề tài đề xuất');
    }

    this.kiemTraNhomCoTheChonDeTaiDeXuat(nhom);

    if (deTai.giangVienId !== nhom.giangVienId || deTai.mangNghienCuuId !== nhom.mangNghienCuuId) {
      throw new ForbiddenError({
        message: 'Đề tài đề xuất này không áp dụng cho nhóm hiện tại',
        errorCode: 'PROPOSED_TOPIC_NOT_AVAILABLE_FOR_GROUP',
      });
    }

    if (nhom.deTai?.danhMucDeTaiGiangVienId === deTai.id) {
      throw new ConflictError({
        message: 'Nhóm đã chọn đề tài giảng viên đề xuất này',
        errorCode: 'TOPIC_ALREADY_SELECTED',
      });
    }

    if (nhom.deTai) {
      this.kiemTraCoTheChuyenDeTai(nhom.deTai.trangThai);

      if (!input.xacNhanChuyenDeTai) {
        throw new ConflictError({
          message: 'Cần xác nhận trước khi chuyển sang đề tài giảng viên đề xuất',
          errorCode: 'TOPIC_SWITCH_CONFIRMATION_REQUIRED',
        });
      }
    }

    const deTaiDaChon = await this.prisma.$transaction(async (giaoDich) => {
      if (nhom.deTai) {
        await this.deTaiDeXuatRepository.xoaDeTaiHienTai(nhom.deTai.id, giaoDich);
      }

      const deTaiMoi = await this.deTaiDeXuatRepository.taoDeTaiNghienCuuTuDanhMuc(
        {
          nhomNghienCuuId: nhom.id,
          giangVienId: nhom.giangVienId!,
          danhMucDeTaiGiangVienId: deTai.id,
          tenDeTai: deTai.tenDeTai,
          moTaVanDe: deTai.moTaVanDe,
          mucTieuNghienCuu: deTai.mucTieuNghienCuu,
          ungDungThucTien: deTai.ungDungThucTien,
          phamViNghienCuu: deTai.phamViNghienCuu,
          congNgheSuDung: deTai.congNgheSuDung,
          lyDoLuaChon: deTai.lyDoLuaChon,
          thoiGianNop: new Date(),
        },
        giaoDich
      );

      await this.deTaiDeXuatRepository.capNhatTrangThaiNhomTheoGiaTri(
        nhom.id,
        GroupStatus.CHO_DUYET_DE_TAI,
        giaoDich
      );

      return deTaiMoi;
    });

    await Promise.all([
      nhatKyKiemToanService.taoBanGhi({
        nguoiThucHienId: sinhVienId,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.NOP_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: deTaiDaChon.id,
        trangThaiTruoc: {
          trangThaiDeTai: nhom.deTai?.trangThai || null,
          loaiDeTai: nhom.deTai?.loaiDeTai || null,
          trangThaiNhom: nhom.trangThai,
        },
        trangThaiSau: {
          loaiDeTai: TopicSource.GIANG_VIEN_DE_XUAT,
          trangThaiDeTai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
          trangThaiNhom: GroupStatus.CHO_DUYET_DE_TAI,
        },
      }),
      thongBaoService.taoNhieuThongBao([
        {
          nguoiNhanId: nhom.giangVienId!,
          loaiNguoiNhan: UserRole.GIANG_VIEN,
          tieuDe: 'Nhóm đã chọn đề tài giảng viên đề xuất',
          noiDung: `Nhóm ${nhom.tenNhom} đã chọn đề tài "${deTai.tenDeTai}" và gửi để chờ duyệt.`,
          loaiThongBao: 'NHOM_CHON_DE_TAI_GIANG_VIEN_DE_XUAT',
          loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
          doiTuongId: deTaiDaChon.id,
        },
      ]),
    ]);

    return {
      ...mapDeTaiDeXuat({
        ...deTaiDaChon,
        nhom: {
          id: nhom.id,
          tenNhom: nhom.tenNhom,
          trangThai: GroupStatus.CHO_DUYET_DE_TAI,
          thanhVien: nhom.thanhVien,
        },
      }),
      daChon: true,
    };
  }
}

const deTaiDeXuatService = new DeTaiDeXuatService();

export { DeTaiDeXuatService, deTaiDeXuatService };
