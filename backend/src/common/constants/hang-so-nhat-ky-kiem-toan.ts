export const AuditAction = Object.freeze({
  DANG_KY_MANG: 'DANG_KY_MANG',
  HUY_DANG_KY_MANG: 'HUY_DANG_KY_MANG',
  TAO_NHOM: 'TAO_NHOM',
  XOA_NHOM: 'XOA_NHOM',
  THAM_GIA_NHOM: 'THAM_GIA_NHOM',
  MOI_THANH_VIEN: 'MOI_THANH_VIEN',
  CHAP_NHAN_LOI_MOI: 'CHAP_NHAN_LOI_MOI',
  TU_CHOI_LOI_MOI: 'TU_CHOI_LOI_MOI',
  ROI_NHOM: 'ROI_NHOM',
  GIANG_VIEN_NHAN_NHOM: 'GIANG_VIEN_NHAN_NHOM',
  TAO_DE_XUAT_DE_TAI: 'TAO_DE_XUAT_DE_TAI',
  NOP_DE_TAI: 'NOP_DE_TAI',
  CHINH_SUA_DE_TAI: 'CHINH_SUA_DE_TAI',
  DUYET_DE_TAI: 'DUYET_DE_TAI',
  YEU_CAU_CHINH_SUA_DE_TAI: 'YEU_CAU_CHINH_SUA_DE_TAI',
  TU_CHOI_DE_TAI: 'TU_CHOI_DE_TAI',
  CHOT_DE_TAI: 'CHOT_DE_TAI',
} as const);

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export const AuditEntityType = Object.freeze({
  SINH_VIEN_DANG_KY_MANG: 'SinhVienDangKyMang',
  NHOM_NGHIEN_CUU: 'NhomNghienCuu',
  LOI_MOI_NHOM: 'LoiMoiNhom',
  DE_TAI_NGHIEN_CUU: 'DeTaiNghienCuu',
  THONG_BAO: 'ThongBao',
} as const);

export type AuditEntityType = (typeof AuditEntityType)[keyof typeof AuditEntityType];
