import { useCallback, useEffect, useState } from 'react';
import { GROUP_STATUS, TOPIC_SUBMISSION_STATUS } from '../../../shared/types/status.types';
import { formatStatusText } from '../../../shared/utils/status-labels';
import { workflowStatusService } from '../services/workflow-status.service';

const GROUP_STATUS_DISPLAY = {
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
  GIANG_VIEN_NHAN_HUONG_DAN: 'Giảng viên đã nhận hướng dẫn nhóm nghiên cứu.',
  NHOM_NOP_DE_TAI: 'Nhóm nộp đề tài để chờ giảng viên phản hồi.',
  GIANG_VIEN_DUYET_DE_TAI: 'Giảng viên xem xét và phản hồi đề tài của nhóm.',
  CHOT_DE_TAI: 'Chốt đề tài chính thức sau khi đã được duyệt.',
};

const MILESTONE_COLOR = {
  DA_NHAN_HUONG_DAN: 'blue',
  NHOM_DA_NOP_DE_TAI: 'blue',
  DE_TAI_DA_DUOC_DUYET: 'blue',
  DE_TAI_DA_CHOT: 'emerald',
};

function mapSteps(stepList) {
  if (!stepList || stepList.length === 0) return [];

  return stepList.map((step) => ({
    key: step.code,
    label: step.title,
    state: STEP_STATUS_TO_STATE[step.status] || 'pending',
    description: STEP_DESCRIPTION_MAP[step.code] || '',
  }));
}

function findCurrentStepIndex(stepList) {
  if (!stepList || stepList.length === 0) return 0;

  for (let i = stepList.length - 1; i >= 0; i -= 1) {
    if (stepList[i].status === 'CURRENT' || stepList[i].status === 'ACTION_REQUIRED') {
      return i;
    }
  }

  for (let i = stepList.length - 1; i >= 0; i -= 1) {
    if (stepList[i].status === 'COMPLETED') return i;
  }

  return 0;
}

function mapMilestones(backendMilestones) {
  if (!backendMilestones || backendMilestones.length === 0) return [];

  return backendMilestones
    .filter((m) => m.achieved)
    .map((m) => ({
      label: formatStatusText(m.title || m.summary || m.code),
      date: m.achievedAt,
      color: MILESTONE_COLOR[m.code] || 'blue',
    }));
}

function mapTimeline(backendTimeline) {
  if (!backendTimeline || backendTimeline.length === 0) return [];

  return backendTimeline.map((item) => ({
    id: String(item.id),
    title: formatStatusText(item.title),
    description: formatStatusText(item.description || ''),
    timestamp: item.at || null,
    isActive: !item.isDerived,
  }));
}

function buildGroupDetail(groupStatus, topicStatus, topicSummary, nextAction) {
  const groupDisplay = GROUP_STATUS_DISPLAY[groupStatus] || { text: groupStatus || 'Chưa xác định', color: 'slate' };
  const topicDisplay = topicStatus
    ? TOPIC_STATUS_DISPLAY[topicStatus] || { text: topicStatus, color: 'slate' }
    : null;

  const handlerRoleMap = {
    SINH_VIEN: 'Nhóm sinh viên',
    GIANG_VIEN: 'Giảng viên',
    HE_THONG: 'Hệ thống',
  };

  const processingText = nextAction?.description || 'Đang trong quá trình xử lý.';
  const handlerLabel = nextAction ? (handlerRoleMap[nextAction.handlerRole] || nextAction.handlerRole || '') : '';

  return {
    groupDisplay,
    topicDisplay,
    processingText: formatStatusText(processingText),
    handlerLabel,
    lecturerComment: formatStatusText(topicSummary?.nhanXetGiangVien || ''),
    revisionCount: topicSummary?.soLanChinhSua || 0,
    editDeadline: nextAction?.deadline || topicSummary?.hanChinhSua || null,
  };
}

function mapOneGroupProgress(groupProgress) {
  const groupSummary = groupProgress.groupSummary;
  const topicSummary = groupProgress.topicSummary;
  const groupStatus = groupSummary?.trangThai || null;
  const topicStatus = topicSummary?.trangThai || null;

  return {
    groupId: groupSummary ? String(groupSummary.id) : null,
    groupName: groupSummary?.tenNhom || 'Không xác định',
    groupStatus,
    memberCount: groupSummary?.soLuongThanhVien || 0,
    researchAreaName: groupSummary?.mangNghienCuu?.tenMang || '',
    members: (groupSummary?.thanhVien || []).map((m) => ({
      id: String(m.id),
      studentCode: m.maSinhVien,
      fullName: m.hoTen,
      role: m.vaiTro,
    })),
    topicTitle: topicSummary?.tenDeTai || null,
    topicStatus,
    steps: mapSteps(groupProgress.stepList),
    currentStepIndex: findCurrentStepIndex(groupProgress.stepList),
    detail: buildGroupDetail(groupStatus, topicStatus, topicSummary, groupProgress.nextAction),
    milestones: mapMilestones(groupProgress.milestones),
    timelineEvents: mapTimeline(groupProgress.timeline),
  };
}

export function useLecturerProgress(lecturerCode) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [backendData, setBackendData] = useState(null);

  const fetchProgress = useCallback(async () => {
    if (!lecturerCode) {
      setBackendData(null);
      setErrorMessage('');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await workflowStatusService.layTienTrinhGiangVien(lecturerCode);
      setBackendData(data);
    } catch {
      setBackendData(null);
      setErrorMessage('Không thể tải tiến trình. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [lecturerCode]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  if (!backendData) {
    return {
      isLoading,
      errorMessage,
      overview: null,
      lecturerSummary: null,
      groupProgressList: [],
      refetch: fetchProgress,
    };
  }

  const overview = backendData.overview || null;
  const lecturerSummary = backendData.lecturerSummary || null;
  const groupProgressList = (backendData.groupProgressList || []).map(mapOneGroupProgress);

  return {
    isLoading,
    errorMessage,
    overview,
    lecturerSummary,
    groupProgressList,
    refetch: fetchProgress,
  };
}
