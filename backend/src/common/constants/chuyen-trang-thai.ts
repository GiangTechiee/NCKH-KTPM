import { GroupStatus, TopicSubmissionStatus } from './trang-thai.enum';

export const GROUP_STATUS_TRANSITIONS: Record<GroupStatus, readonly GroupStatus[]> = Object.freeze({
  [GroupStatus.NHAP]: [GroupStatus.DANG_TUYEN_THANH_VIEN],
  [GroupStatus.DANG_TUYEN_THANH_VIEN]: [GroupStatus.DA_DU_THANH_VIEN, GroupStatus.DA_CO_GIANG_VIEN],
  [GroupStatus.DA_DU_THANH_VIEN]: [GroupStatus.DA_CO_GIANG_VIEN],
  [GroupStatus.CHUA_CO_GIANG_VIEN]: [GroupStatus.DA_CO_GIANG_VIEN],
  [GroupStatus.DA_CO_GIANG_VIEN]: [GroupStatus.DANG_CHON_DE_TAI],
  [GroupStatus.DANG_CHON_DE_TAI]: [GroupStatus.CHO_DUYET_DE_TAI],
  [GroupStatus.CHO_DUYET_DE_TAI]: [GroupStatus.CAN_CHINH_SUA_DE_TAI, GroupStatus.DA_DUYET_DE_TAI],
  [GroupStatus.CAN_CHINH_SUA_DE_TAI]: [GroupStatus.CHO_DUYET_DE_TAI],
  [GroupStatus.DA_DUYET_DE_TAI]: [GroupStatus.DA_CHOT_DE_TAI],
  [GroupStatus.DA_CHOT_DE_TAI]: [],
});

export const TOPIC_SUBMISSION_STATUS_TRANSITIONS: Record<TopicSubmissionStatus, readonly TopicSubmissionStatus[]> = Object.freeze({
  [TopicSubmissionStatus.NHAP]: [TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET],
  [TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET]: [
    TopicSubmissionStatus.CAN_CHINH_SUA,
    TopicSubmissionStatus.DA_DUYET,
    TopicSubmissionStatus.TU_CHOI,
  ],
  [TopicSubmissionStatus.CAN_CHINH_SUA]: [TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET],
  [TopicSubmissionStatus.DA_DUYET]: [TopicSubmissionStatus.DA_CHOT],
  [TopicSubmissionStatus.TU_CHOI]: [],
  [TopicSubmissionStatus.DA_CHOT]: [],
});
