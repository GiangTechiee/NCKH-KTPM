import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  capNhatDeTai,
  chapNhanLoiMoi,
  chonDeTaiDeXuat,
  getRegistrationPageData,
  layDanhSachDeTaiDeXuat,
  layGoiYGhepNhom,
  layDeTaiCuaToi,
  layNhomCuaToi,
  moiThanhVienVaoNhom,
  nopDeTai,
  roiNhom,
  thamGiaNhom,
  taoNhomNghienCuu,
  tuChoiLoiMoi,
  xoaNhom,
} from '../services/student-journey.service';

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
  const [group, setGroup] = useState(null);
  const [matching, setMatching] = useState({
    matchingCandidates: [],
    suggestedGroups: [],
    receivedInvitations: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchingAction, setMatchingAction] = useState({
    type: '',
    targetId: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [candidateQuery, setCandidateQuery] = useState('');
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
  const [selectedAreaTitle, setSelectedAreaTitle] = useState('Chưa chọn');

  const loadSelectedAreaSummary = useCallback(async () => {
    if (!studentCode.trim()) {
      setSelectedAreaTitle('Chưa chọn');
      return;
    }

    try {
      const data = await getRegistrationPageData(studentCode.trim());
      setSelectedAreaTitle(data.currentRegistration?.area?.title || 'Chưa chọn');
    } catch (_error) {
      setSelectedAreaTitle('Chưa chọn');
    }
  }, [studentCode]);

  useEffect(() => {
    loadSelectedAreaSummary();
  }, [loadSelectedAreaSummary]);

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
      await Promise.all([loadGroup(), loadMatching(), loadSelectedAreaSummary()]);
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
      await Promise.all([loadGroup(), loadMatching(), loadSelectedAreaSummary()]);
    } catch (error) {
      setGroupErrorMessage(error.message || 'Gửi lời mời thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleInviteCandidateFromMatching(candidateStudentCode) {
    if (!group) {
      setMatchingErrorMessage('Bạn chưa có nhóm để gửi lời mời.');
      return;
    }

    setIsSubmitting(true);
    setMatchingAction({
      type: 'invite-candidate',
      targetId: candidateStudentCode,
    });
    setMatchingErrorMessage('');
    setSuccessMessage('');

    try {
      await moiThanhVienVaoNhom(studentCode.trim(), group.id, candidateStudentCode);
      setSuccessMessage(`Đã gửi lời mời đến ${candidateStudentCode} thành công.`);
      await Promise.all([loadGroup(), loadMatching()]);
    } catch (error) {
      setMatchingErrorMessage(error.message || 'Gửi lời mời thất bại.');
    } finally {
      setIsSubmitting(false);
      setMatchingAction({ type: '', targetId: '' });
    }
  }

  async function handleDeleteGroup() {
    if (!group) {
      setGroupErrorMessage('Không tìm thấy nhóm để xóa.');
      return;
    }

    setIsSubmitting(true);
    setGroupErrorMessage('');
    setSuccessMessage('');

    try {
      await xoaNhom(studentCode.trim(), group.id);
      setSuccessMessage('Đã xóa nhóm thành công.');
      await Promise.all([loadGroup(), loadMatching(), loadSelectedAreaSummary()]);
    } catch (error) {
      setGroupErrorMessage(error.message || 'Xóa nhóm thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRequestJoinGroup(groupId) {
    if (!studentCode.trim()) {
      setMatchingErrorMessage('Bạn cần nhập MSSV trước khi tham gia nhóm.');
      return;
    }

    setIsSubmitting(true);
    setMatchingAction({
      type: 'join-group',
      targetId: String(groupId),
    });
    setMatchingErrorMessage('');
    setSuccessMessage('');

    try {
      await thamGiaNhom(studentCode.trim(), groupId);
      setSuccessMessage('Tham gia nhóm thành công.');
      await Promise.all([loadGroup(), loadMatching(), loadSelectedAreaSummary()]);
    } catch (error) {
      setMatchingErrorMessage(error.message || 'Tham gia nhóm thất bại.');
    } finally {
      setIsSubmitting(false);
      setMatchingAction({ type: '', targetId: '' });
    }
  }

  async function handleLeaveGroup() {
    if (!group) {
      setGroupErrorMessage('Không tìm thấy nhóm để rời.');
      return;
    }

    setIsSubmitting(true);
    setGroupErrorMessage('');
    setSuccessMessage('');

    try {
      await roiNhom(studentCode.trim(), group.id);
      setSuccessMessage('Đã rời nhóm thành công.');
      await Promise.all([loadGroup(), loadMatching(), loadSelectedAreaSummary()]);
    } catch (error) {
      setGroupErrorMessage(error.message || 'Rời nhóm thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAcceptInvitation(invitationId) {
    setIsSubmitting(true);
    setMatchingAction({
      type: 'accept-invitation',
      targetId: String(invitationId),
    });
    setMatchingErrorMessage('');
    setSuccessMessage('');

    try {
      await chapNhanLoiMoi(studentCode.trim(), invitationId);
      setSuccessMessage('Chấp nhận lời mời thành công.');
      await Promise.all([loadGroup(), loadMatching(), loadSelectedAreaSummary()]);
    } catch (error) {
      setMatchingErrorMessage(error.message || 'Chấp nhận lời mời thất bại.');
    } finally {
      setIsSubmitting(false);
      setMatchingAction({ type: '', targetId: '' });
    }
  }

  async function handleRejectInvitation(invitationId) {
    setIsSubmitting(true);
    setMatchingAction({
      type: 'reject-invitation',
      targetId: String(invitationId),
    });
    setMatchingErrorMessage('');
    setSuccessMessage('');

    try {
      await tuChoiLoiMoi(studentCode.trim(), invitationId);
      setSuccessMessage('Từ chối lời mời thành công.');
      await Promise.all([loadGroup(), loadMatching(), loadSelectedAreaSummary()]);
    } catch (error) {
      setMatchingErrorMessage(error.message || 'Từ chối lời mời thất bại.');
    } finally {
      setIsSubmitting(false);
      setMatchingAction({ type: '', targetId: '' });
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
    candidateQuery,
    createGroupName,
    filteredCandidates,
    group,
    groupErrorMessage,
    inviteStudentCode,
    isSubmitting,
    matching,
    matchingAction,
    matchingErrorMessage,
    proposedTopics,
    selectedAreaTitle,
    studentCode,
    successMessage,
    topicDraft,
    topicErrorMessage,
    topicOverview,
    onAcceptInvitation: handleAcceptInvitation,
    onCandidateQueryChange: setCandidateQuery,
    onChooseProposedTopic: handleChooseProposedTopic,
    onCreateGroup: handleCreateGroup,
    onCreateGroupNameChange: setCreateGroupName,
    onDeleteGroup: handleDeleteGroup,
    onInvite: handleInviteMember,
    onInviteCandidateFromMatching: handleInviteCandidateFromMatching,
    onInviteStudentCodeChange: setInviteStudentCode,
    onLeaveGroup: handleLeaveGroup,
    onLoadGroup: loadGroup,
    onLoadMatching: loadMatching,
    onLoadTopic: loadTopic,
    onRequestJoinGroup: handleRequestJoinGroup,
    onRejectInvitation: handleRejectInvitation,
    onSubmitTopic: handleSubmitTopic,
    onTopicDraftChange: (field, value) =>
      setTopicDraft((currentDraft) => ({
        ...currentDraft,
        [field]: value,
      })),
  };
}
