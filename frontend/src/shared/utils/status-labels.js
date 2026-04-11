import {
  GROUP_STATUS,
  INVITATION_STATUS,
  STUDENT_WORKFLOW_STATUS,
  TOPIC_SUBMISSION_STATUS,
} from '../types/status.types';

// ── Topic submission status ─────────────────────────────────────────

const TOPIC_STATUS_LABELS = {
  [TOPIC_SUBMISSION_STATUS.NHAP]: 'Nháp',
  [TOPIC_SUBMISSION_STATUS.CHO_GIANG_VIEN_DUYET]: 'Chờ giảng viên duyệt',
  [TOPIC_SUBMISSION_STATUS.CAN_CHINH_SUA]: 'Cần chỉnh sửa',
  [TOPIC_SUBMISSION_STATUS.DA_DUYET]: 'Đã duyệt',
  [TOPIC_SUBMISSION_STATUS.TU_CHOI]: 'Từ chối',
  [TOPIC_SUBMISSION_STATUS.DA_CHOT]: 'Đã chốt',
};

const TOPIC_STATUS_BADGE_CLASS = {
  [TOPIC_SUBMISSION_STATUS.CHO_GIANG_VIEN_DUYET]: 'bg-amber-100 text-amber-700',
  [TOPIC_SUBMISSION_STATUS.CAN_CHINH_SUA]: 'bg-rose-100 text-rose-700',
  [TOPIC_SUBMISSION_STATUS.DA_DUYET]: 'bg-emerald-100 text-emerald-700',
  [TOPIC_SUBMISSION_STATUS.TU_CHOI]: 'bg-slate-200 text-slate-700',
  [TOPIC_SUBMISSION_STATUS.DA_CHOT]: 'bg-sky-100 text-sky-700',
  [TOPIC_SUBMISSION_STATUS.NHAP]: 'bg-slate-100 text-slate-600',
};

export function topicStatusLabel(status) {
  return TOPIC_STATUS_LABELS[status] || status;
}

export function topicStatusBadgeClass(status) {
  return TOPIC_STATUS_BADGE_CLASS[status] || 'bg-slate-100 text-slate-600';
}

// ── Group status ────────────────────────────────────────────────────

const GROUP_STATUS_LABELS = {
  [GROUP_STATUS.NHAP]: 'Nháp',
  [GROUP_STATUS.DANG_TUYEN_THANH_VIEN]: 'Đang tuyển thành viên',
  [GROUP_STATUS.DA_DU_THANH_VIEN]: 'Đã đủ thành viên',
  [GROUP_STATUS.CHUA_CO_GIANG_VIEN]: 'Chưa có giảng viên',
  [GROUP_STATUS.DA_CO_GIANG_VIEN]: 'Đã có giảng viên',
  [GROUP_STATUS.DANG_CHON_DE_TAI]: 'Đang chọn đề tài',
  [GROUP_STATUS.CHO_DUYET_DE_TAI]: 'Chờ duyệt đề tài',
  [GROUP_STATUS.CAN_CHINH_SUA_DE_TAI]: 'Cần chỉnh sửa đề tài',
  [GROUP_STATUS.DA_DUYET_DE_TAI]: 'Đã duyệt đề tài',
  [GROUP_STATUS.DA_CHOT_DE_TAI]: 'Đã chốt đề tài',
};

const GROUP_STATUS_BADGE_CLASS = {
  [GROUP_STATUS.NHAP]: 'bg-slate-100 text-slate-600',
  [GROUP_STATUS.DANG_TUYEN_THANH_VIEN]: 'bg-amber-100 text-amber-700',
  [GROUP_STATUS.DA_DU_THANH_VIEN]: 'bg-emerald-100 text-emerald-700',
  [GROUP_STATUS.CHUA_CO_GIANG_VIEN]: 'bg-rose-100 text-rose-700',
  [GROUP_STATUS.DA_CO_GIANG_VIEN]: 'bg-sky-100 text-sky-700',
  [GROUP_STATUS.DANG_CHON_DE_TAI]: 'bg-amber-100 text-amber-700',
  [GROUP_STATUS.CHO_DUYET_DE_TAI]: 'bg-amber-100 text-amber-700',
  [GROUP_STATUS.CAN_CHINH_SUA_DE_TAI]: 'bg-rose-100 text-rose-700',
  [GROUP_STATUS.DA_DUYET_DE_TAI]: 'bg-emerald-100 text-emerald-700',
  [GROUP_STATUS.DA_CHOT_DE_TAI]: 'bg-sky-100 text-sky-700',
};

export function groupStatusLabel(status) {
  return GROUP_STATUS_LABELS[status] || status;
}

export function groupStatusBadgeClass(status) {
  return GROUP_STATUS_BADGE_CLASS[status] || 'bg-slate-100 text-slate-600';
}

// ── Invitation status ───────────────────────────────────────────────

const INVITATION_STATUS_LABELS = {
  [INVITATION_STATUS.CHO_XAC_NHAN]: 'Chờ phản hồi',
  [INVITATION_STATUS.DA_CHAP_NHAN]: 'Đã chấp nhận',
  [INVITATION_STATUS.DA_TU_CHOI]: 'Đã từ chối',
  [INVITATION_STATUS.DA_HUY]: 'Đã hủy',
};

const INVITATION_STATUS_BADGE_CLASS = {
  [INVITATION_STATUS.CHO_XAC_NHAN]: 'bg-amber-100 text-amber-700',
  [INVITATION_STATUS.DA_CHAP_NHAN]: 'bg-emerald-100 text-emerald-700',
  [INVITATION_STATUS.DA_TU_CHOI]: 'bg-rose-100 text-rose-700',
  [INVITATION_STATUS.DA_HUY]: 'bg-slate-100 text-slate-700',
};

export function invitationStatusLabel(status) {
  return INVITATION_STATUS_LABELS[status] || status;
}

export function invitationStatusBadgeClass(status) {
  return INVITATION_STATUS_BADGE_CLASS[status] || 'bg-slate-100 text-slate-700';
}

// ── Member join status ───────────────────────────────────────────────

const MEMBER_JOIN_STATUS_LABELS = {
  CHO_XAC_NHAN: 'Chờ xác nhận',
  DA_CHAP_NHAN: 'Đã xác nhận',
  DA_TU_CHOI: 'Đã từ chối',
};

const MEMBER_JOIN_STATUS_BADGE_CLASS = {
  CHO_XAC_NHAN: 'bg-amber-100 text-amber-700',
  DA_CHAP_NHAN: 'bg-emerald-100 text-emerald-700',
  DA_TU_CHOI: 'bg-rose-100 text-rose-700',
};

export function memberJoinStatusLabel(status) {
  return MEMBER_JOIN_STATUS_LABELS[status] || status;
}

export function memberJoinStatusBadgeClass(status) {
  return MEMBER_JOIN_STATUS_BADGE_CLASS[status] || 'bg-slate-100 text-slate-700';
}

// ── Student workflow status ──────────────────────────────────────────

const STUDENT_WORKFLOW_STATUS_LABELS = {
  [STUDENT_WORKFLOW_STATUS.CHUA_DANG_KY_MANG]: 'Chưa đăng ký mảng',
  [STUDENT_WORKFLOW_STATUS.DA_DANG_KY_MANG]: 'Đã đăng ký mảng',
  [STUDENT_WORKFLOW_STATUS.CHUA_CO_NHOM]: 'Chưa có nhóm',
  [STUDENT_WORKFLOW_STATUS.DA_CO_NHOM]: 'Đã có nhóm',
  [STUDENT_WORKFLOW_STATUS.DA_CO_DE_TAI]: 'Đã có đề tài',
};

export function studentWorkflowStatusLabel(status) {
  return STUDENT_WORKFLOW_STATUS_LABELS[status] || status;
}

const ALL_STATUS_LABELS = {
  ...TOPIC_STATUS_LABELS,
  ...GROUP_STATUS_LABELS,
  ...INVITATION_STATUS_LABELS,
  ...STUDENT_WORKFLOW_STATUS_LABELS,
};

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatStatusText(text) {
  if (!text) {
    return text;
  }

  return Object.entries(ALL_STATUS_LABELS)
    .sort((left, right) => right[0].length - left[0].length)
    .reduce((currentText, [statusKey, statusLabel]) => {
      const pattern = new RegExp(`\\b${escapeRegExp(statusKey)}\\b`, 'g');
      return currentText.replace(pattern, statusLabel);
    }, text);
}

// ── Member role ─────────────────────────────────────────────────────

const MEMBER_ROLE_LABELS = {
  TRUONG_NHOM: 'Trưởng nhóm',
  THANH_VIEN: 'Thành viên',
};

export function memberRoleLabel(role) {
  return MEMBER_ROLE_LABELS[role] || role;
}
