import { useCallback, useEffect, useState } from 'react';
import { GROUP_STATUS, TOPIC_SUBMISSION_STATUS } from '../../../shared/types/status.types';
import { formatStatusText } from '../../../shared/utils/status-labels';
import { workflowStatusService } from '../services/workflow-status.service';

const STATUS_DISPLAY = {
  [GROUP_STATUS.NHAP]: { text: 'Mới tạo', color: 'slate' },
  [GROUP_STATUS.DANG_TUYEN_THANH_VIEN]: { text: 'Đang tuyển', color: 'blue' },
  [GROUP_STATUS.DA_DU_THANH_VIEN]: { text: 'Đủ thành viên', color: 'blue' },
  [GROUP_STATUS.CHUA_CO_GIANG_VIEN]: { text: 'Chưa có GV hướng dẫn', color: 'amber' },
  [GROUP_STATUS.DA_CO_GIANG_VIEN]: { text: 'Đã có GV hướng dẫn', color: 'emerald' },
  [GROUP_STATUS.DANG_CHON_DE_TAI]: { text: 'Đang chọn đề tài', color: 'blue' },
  [GROUP_STATUS.CHO_DUYET_DE_TAI]: { text: 'Đang chờ duyệt', color: 'amber' },
  [GROUP_STATUS.CAN_CHINH_SUA_DE_TAI]: { text: 'Cần chỉnh sửa', color: 'amber' },
  [GROUP_STATUS.DA_DUYET_DE_TAI]: { text: 'Đã duyệt', color: 'emerald' },
  [GROUP_STATUS.DA_CHOT_DE_TAI]: { text: 'Đã chốt', color: 'emerald' },
};

const TOPIC_STATUS_DISPLAY = {
  [TOPIC_SUBMISSION_STATUS.NHAP]: { text: 'Bản nháp', color: 'slate' },
  [TOPIC_SUBMISSION_STATUS.CHO_GIANG_VIEN_DUYET]: { text: 'Đang chờ duyệt', color: 'amber' },
  [TOPIC_SUBMISSION_STATUS.CAN_CHINH_SUA]: { text: 'Cần chỉnh sửa', color: 'amber' },
  [TOPIC_SUBMISSION_STATUS.DA_DUYET]: { text: 'Đã duyệt', color: 'emerald' },
  [TOPIC_SUBMISSION_STATUS.TU_CHOI]: { text: 'Từ chối', color: 'rose' },
  [TOPIC_SUBMISSION_STATUS.DA_CHOT]: { text: 'Đã chốt', color: 'emerald' },
};

const STEP_STATUS_TO_STATE = {
  COMPLETED: 'completed',
  CURRENT: 'active',
  ACTION_REQUIRED: 'active',
  PENDING: 'pending',
};

const STEP_DESCRIPTION_MAP = {
  DANG_KY_MANG: 'Sinh viên đã chọn mảng nghiên cứu để bắt đầu quy trình.',
  TAO_HOAC_GIA_NHAP_NHOM: 'Sinh viên cần tạo nhóm hoặc tham gia một nhóm nghiên cứu.',
  GIANG_VIEN_NHAN_HUONG_DAN: 'Nhóm đang chờ giảng viên phù hợp nhận hướng dẫn.',
  NOP_DE_TAI: 'Nhóm chọn hoặc đề xuất đề tài để gửi giảng viên duyệt.',
  GIANG_VIEN_DUYET_DE_TAI: 'Giảng viên xem xét và phản hồi đề tài của nhóm.',
  CHOT_DE_TAI: 'Đề tài được chốt chính thức sau khi đã được duyệt.',
};

const MILESTONE_COLOR = {
  DA_DANG_KY_MANG: 'blue',
  DA_CO_NHOM: 'blue',
  DA_CO_GIANG_VIEN: 'emerald',
  DA_NOP_DE_TAI: 'blue',
  DE_TAI_DA_DUOC_PHAN_HOI: 'blue',
  DE_TAI_DA_CHOT: 'emerald',
};

function mapSteps(stepList) {
  if (!stepList || stepList.length === 0) {
    return [];
  }

  return stepList.map((step) => ({
    key: step.code,
    label: step.title,
    state: STEP_STATUS_TO_STATE[step.status] || 'pending',
    description: STEP_DESCRIPTION_MAP[step.code] || '',
  }));
}

function findCurrentStepIndex(stepList) {
  if (!stepList || stepList.length === 0) {
    return 0;
  }

  for (let index = stepList.length - 1; index >= 0; index -= 1) {
    if (stepList[index].status === 'CURRENT' || stepList[index].status === 'ACTION_REQUIRED') {
      return index;
    }
  }

  for (let index = stepList.length - 1; index >= 0; index -= 1) {
    if (stepList[index].status === 'COMPLETED') {
      return index;
    }
  }

  return 0;
}

function buildDetail(groupStatus, topicStatus, topicSummary, nextAction) {
  const groupDisplay = STATUS_DISPLAY[groupStatus] || { text: groupStatus || 'Chưa xác định', color: 'slate' };
  const topicDisplay = topicStatus
    ? TOPIC_STATUS_DISPLAY[topicStatus] || { text: topicStatus, color: 'slate' }
    : null;

  let actionLabel = null;
  let actionNav = null;
  let processingText = nextAction?.description || '';
  let handlerLabel = '';

  if (nextAction) {
    const roleMap = {
      SINH_VIEN: 'Nhóm trưởng',
      GIANG_VIEN: 'Giảng viên hướng dẫn',
      HE_THONG: 'Hệ thống',
    };
    handlerLabel = roleMap[nextAction.handlerRole] || nextAction.handlerRole || '';
  }

  if (groupStatus === GROUP_STATUS.DANG_CHON_DE_TAI || groupStatus === GROUP_STATUS.DA_CO_GIANG_VIEN) {
    if (!processingText) processingText = 'Nhóm cần chọn hoặc đề xuất đề tài.';
    if (!handlerLabel) handlerLabel = 'Nhóm trưởng';
    actionLabel = 'Đi tới chọn đề tài';
    actionNav = 'topic';
  } else if (groupStatus === GROUP_STATUS.CHUA_CO_GIANG_VIEN || groupStatus === GROUP_STATUS.DA_DU_THANH_VIEN) {
    if (!processingText) processingText = 'Nhóm đang chờ giảng viên nhận hướng dẫn.';
    if (!handlerLabel) handlerLabel = 'Giảng viên hướng dẫn';
  } else if (topicStatus === TOPIC_SUBMISSION_STATUS.CAN_CHINH_SUA) {
    if (!processingText) processingText = 'Giảng viên yêu cầu chỉnh sửa đề tài.';
    if (!handlerLabel) handlerLabel = 'Nhóm trưởng';
    actionLabel = 'Đi tới chỉnh sửa đề tài';
    actionNav = 'topic';
  } else if (topicStatus === TOPIC_SUBMISSION_STATUS.TU_CHOI) {
    if (!processingText) processingText = 'Đề tài đã bị từ chối bởi giảng viên.';
    if (!handlerLabel) handlerLabel = 'Nhóm trưởng';
    actionLabel = 'Đề xuất đề tài mới';
    actionNav = 'topic';
  } else if (topicStatus === TOPIC_SUBMISSION_STATUS.CHO_GIANG_VIEN_DUYET) {
    if (!processingText) processingText = 'Nhóm đang chờ giảng viên duyệt đề tài.';
    if (!handlerLabel) handlerLabel = 'Giảng viên hướng dẫn';
  } else if (topicStatus === TOPIC_SUBMISSION_STATUS.DA_DUYET) {
    if (!processingText) processingText = 'Đề tài đã được giảng viên duyệt, chờ chốt.';
    if (!handlerLabel) handlerLabel = 'Giảng viên hướng dẫn';
  } else if (topicStatus === TOPIC_SUBMISSION_STATUS.DA_CHOT) {
    if (!processingText) processingText = 'Đề tài đã được chốt chính thức.';
    if (!handlerLabel) handlerLabel = 'Hoàn thành';
  } else {
    if (!processingText) processingText = 'Đang trong quá trình đăng ký.';
    if (!handlerLabel) handlerLabel = 'Sinh viên';
  }

  return {
    groupDisplay,
    topicDisplay,
    actionLabel,
    actionNav,
    processingText: formatStatusText(processingText),
    handlerLabel,
    lecturerComment: formatStatusText(topicSummary?.nhanXetGiangVien || ''),
    revisionCount: topicSummary?.soLanChinhSua || 0,
    editDeadline: nextAction?.deadline || topicSummary?.hanChinhSua || null,
  };
}

function mapMilestones(backendMilestones) {
  if (!backendMilestones || backendMilestones.length === 0) {
    return [];
  }

  return backendMilestones
    .filter((milestone) => milestone.achieved)
    .map((milestone) => ({
      label: formatStatusText(milestone.title || milestone.summary || milestone.code),
      date: milestone.achievedAt,
      color: MILESTONE_COLOR[milestone.code] || 'blue',
    }));
}

function mapTimeline(backendTimeline) {
  if (!backendTimeline || backendTimeline.length === 0) {
    return [];
  }

  return backendTimeline.map((item) => ({
    id: String(item.id),
    title: formatStatusText(item.title),
    description: formatStatusText(item.description || ''),
    timestamp: item.at || null,
    isActive: !item.isDerived,
  }));
}

function mapGroupData(groupSummary, registrationSummary) {
  if (!groupSummary) {
    return null;
  }

  return {
    id: String(groupSummary.id),
    name: groupSummary.tenNhom,
    status: groupSummary.trangThai,
    members: (groupSummary.thanhVien || []).map((member) => ({
      id: String(member.id),
      studentId: String(member.sinhVienId),
      studentCode: member.maSinhVien,
      fullName: member.hoTen,
      role: member.vaiTro,
      joinedAt: member.thoiGianThamGia,
    })),
    lecturerName: groupSummary.giangVienHuongDan?.hoTen || '',
    researchAreaName: registrationSummary?.tenMang || '',
  };
}

function mapTopicOverview(groupSummary, topicSummary, registrationSummary) {
  return {
    group: groupSummary
      ? {
          name: groupSummary.tenNhom,
          status: groupSummary.trangThai,
          lecturerName: groupSummary.giangVienHuongDan?.hoTen || '',
          researchAreaName: registrationSummary?.tenMang || '',
        }
      : null,
    topic: topicSummary
      ? {
          title: topicSummary.tenDeTai,
          status: topicSummary.trangThai,
          lecturerComment: topicSummary.nhanXetGiangVien || '',
          revisionCount: topicSummary.soLanChinhSua || 0,
          editDeadline: topicSummary.hanChinhSua || null,
          submittedAt: topicSummary.thoiGianNop || null,
          reviewedAt: topicSummary.thoiGianDuyet || null,
          finalizedAt: topicSummary.thoiGianChot || null,
        }
      : null,
  };
}

function emptyResult() {
  return {
    isLoading: false,
    errorMessage: '',
    groupData: null,
    topicOverview: { group: null, topic: null },
    steps: [],
    currentStepIndex: 0,
    detail: {
      groupDisplay: { text: 'Chưa xác định', color: 'slate' },
      topicDisplay: null,
      actionLabel: null,
      actionNav: null,
      processingText: 'Đang trong quá trình đăng ký.',
      handlerLabel: 'Sinh viên',
      lecturerComment: '',
      revisionCount: 0,
      editDeadline: null,
    },
    milestones: [],
    timelineEvents: [],
    groupStatus: null,
    topicStatus: null,
  };
}

export function useStudentProgress(studentCode) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [backendData, setBackendData] = useState(null);

  const fetchProgress = useCallback(async () => {
    if (!studentCode) {
      setBackendData(null);
      setErrorMessage('');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await workflowStatusService.layTienTrinhSinhVien(studentCode);
      setBackendData(data);
    } catch {
      setBackendData(null);
      setErrorMessage('Không thể tải tiến trình. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [studentCode]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  if (!backendData) {
    return { ...emptyResult(), isLoading, errorMessage };
  }

  const groupStatus = backendData.groupSummary?.trangThai || null;
  const topicStatus = backendData.topicSummary?.trangThai || null;

  return {
    isLoading,
    errorMessage,
    groupData: mapGroupData(backendData.groupSummary, backendData.registrationSummary),
    topicOverview: mapTopicOverview(
      backendData.groupSummary,
      backendData.topicSummary,
      backendData.registrationSummary
    ),
    steps: mapSteps(backendData.stepList),
    currentStepIndex: findCurrentStepIndex(backendData.stepList),
    detail: buildDetail(groupStatus, topicStatus, backendData.topicSummary, backendData.nextAction),
    milestones: mapMilestones(backendData.milestones),
    timelineEvents: mapTimeline(backendData.timeline),
    groupStatus,
    topicStatus,
  };
}
