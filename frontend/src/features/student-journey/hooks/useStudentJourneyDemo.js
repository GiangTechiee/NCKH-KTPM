import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  capNhatDeTai,
  chapNhanLoiMoi,
  chonDeTaiDeXuat,
  dangKyMangNghienCuu,
  getRegistrationPageData,
  layDanhSachDeTaiDeXuat,
  layGoiYGhepNhom,
  layDeTaiCuaToi,
  layNhomCuaToi,
  moiThanhVienVaoNhom,
  nopDeTai,
  taoNhomNghienCuu,
  tuChoiLoiMoi,
} from '../services/student-journey.service';

const SELECTED_AREA_STORAGE_KEY = 'nckh_selected_area_id';
const EMPTY_TOPIC_DRAFT = {
  title: '',
  problemDescription: '',
  researchGoals: '',
  practicalApplication: '',
  researchScope: '',
  technologyStack: '',
  reason: '',
};

export function useStudentJourneyDemo(studentCode) {
  const [journey, setJourney] = useState(null);
  const [group, setGroup] = useState(null);
  const [matching, setMatching] = useState({
    matchingCandidates: [],
    suggestedGroups: [],
    receivedInvitations: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [areaQuery, setAreaQuery] = useState('');
  const [candidateQuery, setCandidateQuery] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState(() => localStorage.getItem(SELECTED_AREA_STORAGE_KEY) || '');
  const [createGroupName, setCreateGroupName] = useState('');
  const [inviteStudentCode, setInviteStudentCode] = useState('');
  const [groupErrorMessage, setGroupErrorMessage] = useState('');
  const [matchingErrorMessage, setMatchingErrorMessage] = useState('');
  const [topicOverview, setTopicOverview] = useState({
    group: null,
    topic: null,
    permissions: {
      canSubmit: false,
      canEdit: false,
    },
  });
  const [topicDraft, setTopicDraft] = useState(EMPTY_TOPIC_DRAFT);
  const [topicErrorMessage, setTopicErrorMessage] = useState('');
  const [proposedTopics, setProposedTopics] = useState([]);

  const loadJourney = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await getRegistrationPageData(studentCode);
      setJourney(data);
    } catch (error) {
      setJourney(null);
      setErrorMessage(error.message || 'Không tải được dữ liệu đăng ký mảng nghiên cứu.');
    } finally {
      setIsLoading(false);
    }
  }, [studentCode]);

  const loadGroup = useCallback(async () => {
    if (!studentCode.trim()) {
      setGroup(null);
      setGroupErrorMessage('Nhập MSSV để tải thông tin nhóm nghiên cứu.');
      return;
    }

    setGroupErrorMessage('');

    try {
      const data = await layNhomCuaToi(studentCode.trim());
      setGroup(data);
    } catch (error) {
      if (error.statusCode === 404) {
        setGroup(null);
        setGroupErrorMessage('');
        return;
      }

      setGroup(null);
      setGroupErrorMessage(error.message || 'Không tải được thông tin nhóm.');
    }
  }, [studentCode]);

  const loadMatching = useCallback(async () => {
    if (!studentCode.trim()) {
      setMatching({
        matchingCandidates: [],
        suggestedGroups: [],
        receivedInvitations: [],
      });
      setMatchingErrorMessage('Nhập MSSV để tải gợi ý ghép nhóm.');
      return;
    }

    setMatchingErrorMessage('');

    try {
      const data = await layGoiYGhepNhom(studentCode.trim());
      setMatching(data);
    } catch (error) {
      setMatching({
        matchingCandidates: [],
        suggestedGroups: [],
        receivedInvitations: [],
      });
      setMatchingErrorMessage(error.message || 'Không tải được gợi ý ghép nhóm.');
    }
  }, [studentCode]);

  const loadTopic = useCallback(async () => {
    if (!studentCode.trim()) {
      setTopicOverview({
        group: null,
        topic: null,
        permissions: {
          canSubmit: false,
          canEdit: false,
        },
      });
      setTopicDraft(EMPTY_TOPIC_DRAFT);
      setProposedTopics([]);
      setTopicErrorMessage('Nhập MSSV để tải thông tin đề tài.');
      return;
    }

    setTopicErrorMessage('');

    try {
      const [data, proposals] = await Promise.all([
        layDeTaiCuaToi(studentCode.trim()),
        layDanhSachDeTaiDeXuat(studentCode.trim()).catch(() => []),
      ]);

      setTopicOverview(data);
      setProposedTopics(proposals);

      if (data.topic) {
        setTopicDraft({
          title: data.topic.title,
          problemDescription: data.topic.problemDescription,
          researchGoals: data.topic.researchGoals,
          practicalApplication: data.topic.practicalApplication,
          researchScope: data.topic.researchScope,
          technologyStack: data.topic.technologyStack,
          reason: data.topic.reason,
        });
      } else {
        setTopicDraft(EMPTY_TOPIC_DRAFT);
      }
    } catch (error) {
      setTopicOverview({
        group: null,
        topic: null,
        permissions: {
          canSubmit: false,
          canEdit: false,
        },
      });
      setTopicDraft(EMPTY_TOPIC_DRAFT);
      setProposedTopics([]);
      setTopicErrorMessage(error.message || 'Không tải được thông tin đề tài.');
    }
  }, [studentCode]);

  useEffect(() => {
    loadJourney();
  }, [loadJourney]);

  const filteredAreas = useMemo(() => {
    if (!journey) {
      return [];
    }

    const normalizedQuery = areaQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return journey.researchAreas;
    }

    return journey.researchAreas.filter((area) => {
      const searchable = `${area.title} ${area.shortCode} ${area.description}`.toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [areaQuery, journey]);

  const filteredCandidates = useMemo(() => {
    const normalizedQuery = candidateQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return matching.matchingCandidates;
    }

    return matching.matchingCandidates.filter((candidate) => {
      const searchable = `${candidate.fullName} ${candidate.studentCode} ${candidate.reason}`.toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [candidateQuery, matching.matchingCandidates]);

  const selectedArea = useMemo(() => {
    if (!journey) {
      return null;
    }

    return journey.researchAreas.find((area) => area.id === selectedAreaId) || null;
  }, [journey, selectedAreaId]);

  const summary = useMemo(() => {
    if (!journey) {
      return null;
    }

    return {
      selectedAreaTitle: selectedArea ? selectedArea.title : 'Chưa chọn',
    };
  }, [journey, selectedArea]);

  async function handleConfirmAreaRegistration(area) {
    if (!studentCode.trim()) {
      setErrorMessage('Bạn cần nhập mã sinh viên để gửi yêu cầu đăng ký.');
      return false;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await dangKyMangNghienCuu(studentCode.trim(), area.id);
      setSelectedAreaId(area.id);
      localStorage.setItem(SELECTED_AREA_STORAGE_KEY, area.id);
      setSuccessMessage(`Đăng ký mảng "${area.title}" thành công.`);
      return true;
    } catch (error) {
      setErrorMessage(error.message || 'Đăng ký mảng nghiên cứu thất bại.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateGroup() {
    if (!studentCode.trim()) {
      setGroupErrorMessage('Bạn cần nhập MSSV trước khi tạo nhóm.');
      return;
    }

    if (!createGroupName.trim()) {
      setGroupErrorMessage('Bạn cần nhập tên nhóm.');
      return;
    }

    setIsSubmitting(true);
    setGroupErrorMessage('');
    setSuccessMessage('');

    try {
      await taoNhomNghienCuu(studentCode.trim(), createGroupName.trim());
      setCreateGroupName('');
      setSuccessMessage('Tạo nhóm nghiên cứu thành công.');
      await Promise.all([loadGroup(), loadMatching()]);
    } catch (error) {
      setGroupErrorMessage(error.message || 'Tạo nhóm nghiên cứu thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleInviteMember() {
    if (!group) {
      setGroupErrorMessage('Bạn chưa có nhóm để gửi lời mời.');
      return;
    }

    if (!inviteStudentCode.trim()) {
      setGroupErrorMessage('Bạn cần nhập MSSV của sinh viên muốn mời.');
      return;
    }

    setIsSubmitting(true);
    setGroupErrorMessage('');
    setSuccessMessage('');

    try {
      await moiThanhVienVaoNhom(studentCode.trim(), group.id, inviteStudentCode.trim());
      setInviteStudentCode('');
      setSuccessMessage('Gửi lời mời thành công.');
      await Promise.all([loadGroup(), loadMatching()]);
    } catch (error) {
      setGroupErrorMessage(error.message || 'Gửi lời mời thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAcceptInvitation(invitationId) {
    setIsSubmitting(true);
    setMatchingErrorMessage('');
    setSuccessMessage('');

    try {
      await chapNhanLoiMoi(studentCode.trim(), invitationId);
      setSuccessMessage('Chấp nhận lời mời thành công.');
      await Promise.all([loadGroup(), loadMatching()]);
    } catch (error) {
      setMatchingErrorMessage(error.message || 'Chấp nhận lời mời thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRejectInvitation(invitationId) {
    setIsSubmitting(true);
    setMatchingErrorMessage('');
    setSuccessMessage('');

    try {
      await tuChoiLoiMoi(studentCode.trim(), invitationId);
      setSuccessMessage('Từ chối lời mời thành công.');
      await Promise.all([loadGroup(), loadMatching()]);
    } catch (error) {
      setMatchingErrorMessage(error.message || 'Từ chối lời mời thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmitTopic() {
    if (!studentCode.trim()) {
      setTopicErrorMessage('Bạn cần nhập MSSV trước khi nộp đề tài.');
      return;
    }

    if (!topicDraft.title.trim() || !topicDraft.problemDescription.trim() || !topicDraft.researchGoals.trim()) {
      setTopicErrorMessage('Bạn cần điền đủ tên đề tài, mô tả vấn đề và mục tiêu nghiên cứu.');
      return;
    }

    setIsSubmitting(true);
    setTopicErrorMessage('');
    setSuccessMessage('');

    try {
      if (topicOverview.topic && topicOverview.permissions.canEdit) {
        await capNhatDeTai(studentCode.trim(), topicOverview.topic.id, topicDraft);
        setSuccessMessage('Cập nhật và gửi lại đề tài thành công.');
      } else {
        await nopDeTai(studentCode.trim(), topicDraft);
        setSuccessMessage('Nộp đề tài thành công.');
      }

      await loadTopic();
    } catch (error) {
      setTopicErrorMessage(error.message || 'Nộp đề tài thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleChooseProposedTopic(proposedTopicId) {
    if (!studentCode.trim()) {
      setTopicErrorMessage('Bạn cần nhập MSSV trước khi chọn đề tài.');
      return;
    }

    setIsSubmitting(true);
    setTopicErrorMessage('');
    setSuccessMessage('');

    try {
      await chonDeTaiDeXuat(studentCode.trim(), proposedTopicId);
      setSuccessMessage('Chọn đề tài giảng viên đề xuất thành công.');
      await loadTopic();
    } catch (error) {
      setTopicErrorMessage(error.message || 'Chọn đề tài thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    areaQuery,
    candidateQuery,
    createGroupName,
    errorMessage,
    filteredAreas,
    filteredCandidates,
    group,
    groupErrorMessage,
    inviteStudentCode,
    isLoading,
    isSubmitting,
    journey,
    matching,
    matchingErrorMessage,
    proposedTopics,
    selectedAreaId,
    studentCode,
    successMessage,
    summary,
    topicDraft,
    topicErrorMessage,
    topicOverview,
    onAcceptInvitation: handleAcceptInvitation,
    onAreaQueryChange: setAreaQuery,
    onCandidateQueryChange: setCandidateQuery,
    onChooseProposedTopic: handleChooseProposedTopic,
    onConfirmAreaRegistration: handleConfirmAreaRegistration,
    onCreateGroup: handleCreateGroup,
    onCreateGroupNameChange: setCreateGroupName,
    onInvite: handleInviteMember,
    onInviteStudentCodeChange: setInviteStudentCode,
    onLoadGroup: loadGroup,
    onLoadMatching: loadMatching,
    onLoadTopic: loadTopic,
    onRefresh: loadJourney,
    onRejectInvitation: handleRejectInvitation,
    onSubmitTopic: handleSubmitTopic,
    onTopicDraftChange: (field, value) =>
      setTopicDraft((currentDraft) => ({
        ...currentDraft,
        [field]: value,
      })),
  };
}
