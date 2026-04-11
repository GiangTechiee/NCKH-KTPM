export const StudentWorkflowStatus = Object.freeze({
  CHUA_DANG_KY_MANG: 'CHUA_DANG_KY_MANG',
  DA_DANG_KY_MANG: 'DA_DANG_KY_MANG',
  CHUA_CO_NHOM: 'CHUA_CO_NHOM',
  DA_CO_NHOM: 'DA_CO_NHOM',
  DA_CO_DE_TAI: 'DA_CO_DE_TAI',
} as const);

export type StudentWorkflowStatus = (typeof StudentWorkflowStatus)[keyof typeof StudentWorkflowStatus];

export const GroupStatus = Object.freeze({
  NHAP: 'NHAP',
  DANG_TUYEN_THANH_VIEN: 'DANG_TUYEN_THANH_VIEN',
  DA_DU_THANH_VIEN: 'DA_DU_THANH_VIEN',
  CHUA_CO_GIANG_VIEN: 'CHUA_CO_GIANG_VIEN',
  DA_CO_GIANG_VIEN: 'DA_CO_GIANG_VIEN',
  DANG_CHON_DE_TAI: 'DANG_CHON_DE_TAI',
  CHO_DUYET_DE_TAI: 'CHO_DUYET_DE_TAI',
  CAN_CHINH_SUA_DE_TAI: 'CAN_CHINH_SUA_DE_TAI',
  DA_DUYET_DE_TAI: 'DA_DUYET_DE_TAI',
  DA_CHOT_DE_TAI: 'DA_CHOT_DE_TAI',
} as const);

export type GroupStatus = (typeof GroupStatus)[keyof typeof GroupStatus];

export const TopicSubmissionStatus = Object.freeze({
  NHAP: 'NHAP',
  CHO_GIANG_VIEN_DUYET: 'CHO_GIANG_VIEN_DUYET',
  CAN_CHINH_SUA: 'CAN_CHINH_SUA',
  DA_DUYET: 'DA_DUYET',
  TU_CHOI: 'TU_CHOI',
  DA_CHOT: 'DA_CHOT',
} as const);

export type TopicSubmissionStatus = (typeof TopicSubmissionStatus)[keyof typeof TopicSubmissionStatus];

export const InvitationStatus = Object.freeze({
  CHO_XAC_NHAN: 'CHO_XAC_NHAN',
  DA_CHAP_NHAN: 'DA_CHAP_NHAN',
  DA_TU_CHOI: 'DA_TU_CHOI',
  DA_HUY: 'DA_HUY',
} as const);

export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus];

export const GroupMemberRole = Object.freeze({
  TRUONG_NHOM: 'TRUONG_NHOM',
  THANH_VIEN: 'THANH_VIEN',
} as const);

export type GroupMemberRole = (typeof GroupMemberRole)[keyof typeof GroupMemberRole];

export const MemberJoinStatus = Object.freeze({
  CHO_XAC_NHAN: 'CHO_XAC_NHAN',
  DA_CHAP_NHAN: 'DA_CHAP_NHAN',
  DA_TU_CHOI: 'DA_TU_CHOI',
} as const);

export type MemberJoinStatus = (typeof MemberJoinStatus)[keyof typeof MemberJoinStatus];

export const TopicSource = Object.freeze({
  GIANG_VIEN_DE_XUAT: 'GIANG_VIEN_DE_XUAT',
  NHOM_DE_XUAT: 'NHOM_DE_XUAT',
} as const);

export type TopicSource = (typeof TopicSource)[keyof typeof TopicSource];

export const TopicCatalogStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const);

export type TopicCatalogStatus = (typeof TopicCatalogStatus)[keyof typeof TopicCatalogStatus];

export const ResearchAreaStatus = Object.freeze({
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const);

export type ResearchAreaStatus = (typeof ResearchAreaStatus)[keyof typeof ResearchAreaStatus];

export const RegistrationStatus = Object.freeze({
  REGISTERED: 'REGISTERED',
  CANCELLED: 'CANCELLED',
} as const);

export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

export const UserRole = Object.freeze({
  SINH_VIEN: 'SINH_VIEN',
  GIANG_VIEN: 'GIANG_VIEN',
  QUAN_TRI_VIEN: 'QUAN_TRI_VIEN',
} as const);

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
