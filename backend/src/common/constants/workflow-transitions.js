const {
  GroupStatus,
  TopicSubmissionStatus,
} = require('./status.enum');

const GROUP_STATUS_TRANSITIONS = Object.freeze({
  [GroupStatus.NHAP]: Object.freeze([GroupStatus.DANG_TUYEN_THANH_VIEN]),
  [GroupStatus.DANG_TUYEN_THANH_VIEN]: Object.freeze([
    GroupStatus.DA_DU_THANH_VIEN,
    GroupStatus.DA_CO_GIANG_VIEN,
  ]),
  [GroupStatus.DA_DU_THANH_VIEN]: Object.freeze([GroupStatus.DA_CO_GIANG_VIEN]),
  [GroupStatus.CHUA_CO_GIANG_VIEN]: Object.freeze([GroupStatus.DA_CO_GIANG_VIEN]),
  [GroupStatus.DA_CO_GIANG_VIEN]: Object.freeze([GroupStatus.DANG_CHON_DE_TAI]),
  [GroupStatus.DANG_CHON_DE_TAI]: Object.freeze([GroupStatus.CHO_DUYET_DE_TAI]),
  [GroupStatus.CHO_DUYET_DE_TAI]: Object.freeze([
    GroupStatus.CAN_CHINH_SUA_DE_TAI,
    GroupStatus.DA_DUYET_DE_TAI,
  ]),
  [GroupStatus.CAN_CHINH_SUA_DE_TAI]: Object.freeze([GroupStatus.CHO_DUYET_DE_TAI]),
  [GroupStatus.DA_DUYET_DE_TAI]: Object.freeze([GroupStatus.DA_CHOT_DE_TAI]),
  [GroupStatus.DA_CHOT_DE_TAI]: Object.freeze([]),
});

const TOPIC_SUBMISSION_STATUS_TRANSITIONS = Object.freeze({
  [TopicSubmissionStatus.NHAP]: Object.freeze([TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET]),
  [TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET]: Object.freeze([
    TopicSubmissionStatus.CAN_CHINH_SUA,
    TopicSubmissionStatus.DA_DUYET,
    TopicSubmissionStatus.TU_CHOI,
  ]),
  [TopicSubmissionStatus.CAN_CHINH_SUA]: Object.freeze([
    TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
  ]),
  [TopicSubmissionStatus.DA_DUYET]: Object.freeze([TopicSubmissionStatus.DA_CHOT]),
  [TopicSubmissionStatus.TU_CHOI]: Object.freeze([]),
  [TopicSubmissionStatus.DA_CHOT]: Object.freeze([]),
});

module.exports = {
  GROUP_STATUS_TRANSITIONS,
  TOPIC_SUBMISSION_STATUS_TRANSITIONS,
};
