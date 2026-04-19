import React, { useEffect, useMemo, useState } from 'react';
import { useAccountSelector } from '../shared/hooks/useAccountSelector';
import { TOPIC_SUBMISSION_STATUS } from '../shared/types/status.types';
import { groupStatusLabel, topicStatusLabel } from '../shared/utils/status-labels';
import GroupMatchingBoard from '../features/student-journey/components/GroupMatchingBoard';
import LecturerGroupDetailModal from '../features/student-journey/components/LecturerGroupDetailModal';
import LecturerCurrentGroupsBoard from '../features/student-journey/components/LecturerCurrentGroupsBoard';
import LecturerGroupSelectionBoard from '../features/student-journey/components/LecturerGroupSelectionBoard';
import LecturerTopicReviewBoard from '../features/student-journey/components/LecturerTopicReviewBoard';
import { ResearchAreaPage } from '../features/research-area';
import ResearchGroupBoard from '../features/student-journey/components/ResearchGroupBoard';
import TopicBoard from '../features/student-journey/components/TopicBoard';
import { useLecturerGroupSelection } from '../features/student-journey/hooks/useLecturerGroupSelection';
import { useLecturerTopicReview } from '../features/student-journey/hooks/useLecturerTopicReview';
import { useStudentJourneyDemo } from '../features/student-journey/hooks/useStudentJourneyDemo';
import { StudentProgressBoard, LecturerProgressBoard } from '../features/workflow-status';
import { useStudentProgress } from '../features/workflow-status/hooks/useWorkflowStatus';
import { useLecturerProgress } from '../features/workflow-status/hooks/useLecturerProgress';
import { NotificationBoard } from '../features/notifications';
import { useNotifications } from '../features/notifications/hooks/useNotifications';

const STUDENT_NAV = [
  { id: 'research-area', label: 'Đăng ký mảng nghiên cứu', icon: 'area' },
  { id: 'research-group', label: 'Nhóm nghiên cứu', icon: 'group' },
  { id: 'matching', label: 'Ghép nhóm / lời mời', icon: 'matching' },
  { id: 'topic', label: 'Đề tài nghiên cứu', icon: 'topic' },
  { id: 'workflow', label: 'Tiến trình thực hiện', icon: 'workflow' },
  { id: 'notifications', label: 'Thông báo', icon: 'bell' },
];

const LECTURER_NAV = [
  { id: 'lecturer-groups', label: 'Chọn nhóm hướng dẫn', icon: 'group' },
  { id: 'lecturer-current', label: 'Nhóm đang hướng dẫn', icon: 'group' },
  { id: 'lecturer-topic', label: 'Duyệt đề tài', icon: 'topic' },
  { id: 'lecturer-progress', label: 'Tiến trình', icon: 'workflow' },
  { id: 'lecturer-notifications', label: 'Thông báo', icon: 'bell' },
];

const PAGE_META = {
  'research-area': {
    title: 'Đăng ký mảng nghiên cứu',
    description: 'Chọn một mảng nghiên cứu phù hợp để tham gia đợt nghiên cứu khoa học hiện tại.',
  },
  'research-group': {
    title: 'Nhóm nghiên cứu',
    description: 'Tạo nhóm, xem nhóm hiện tại và mời thành viên cùng mảng vào nhóm nghiên cứu.',
  },
  matching: {
    title: 'Ghép nhóm và lời mời',
    description: 'Xem gợi ý sinh viên, nhóm phù hợp và phản hồi các lời mời tham gia đang chờ xử lý.',
  },
  topic: {
    title: 'Đề tài nghiên cứu',
    description: 'Nhóm tự đề xuất đề tài để gửi giảng viên duyệt.',
  },
  'lecturer-groups': {
    title: 'Chọn nhóm hướng dẫn',
    description: 'Giảng viên xem các nhóm ứng viên phù hợp chuyên môn và nhận hướng dẫn.',
  },
  'lecturer-topic': {
    title: 'Duyệt đề tài nghiên cứu',
    description: 'Theo dõi các đề tài chờ duyệt, phản hồi nhận xét và quyết định duyệt, yêu cầu chỉnh sửa hoặc từ chối.',
  },
  workflow: {
    title: 'Tiến trình thực hiện',
    description: 'Theo dõi tiến trình nghiên cứu khoa học của nhóm từ đăng ký mảng đến chốt đề tài.',
  },
  notifications: {
    title: 'Thông báo',
    description: 'Xem các thông báo từ hệ thống về lời mời, duyệt đề tài và các sự kiện quan trọng.',
  },
  'lecturer-progress': {
    title: 'Tiến trình',
    description: 'Theo dõi tiến trình của các nhóm đang hướng dẫn.',
  },
  'lecturer-notifications': {
    title: 'Thông báo',
    description: 'Xem các thông báo từ hệ thống dành cho giảng viên.',
  },
  'lecturer-current': {
    title: 'Nhóm đang hướng dẫn',
    description: 'Danh sách các nhóm nghiên cứu bạn đang hướng dẫn.',
  },
};

function NavIcon({ type }) {
  const iconPaths = {
    area: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
    group: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    matching: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    topic: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    workflow: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  };

  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[type] || iconPaths.area} />
    </svg>
  );
}

function AccountAvatar({ name, size }) {
  const initials = (name || '')
    .split(' ')
    .slice(-2)
    .map((p) => p[0])
    .join('');

  const sizeClass = size === 'lg' ? 'h-10 w-10 text-sm' : 'h-8 w-8 text-xs';

  return (
    <div className={`flex items-center justify-center rounded-full bg-[#0b4a7a] font-semibold text-white ${sizeClass}`}>
      {initials || '?'}
    </div>
  );
}

function OverviewCard({ accentClassName, label, value, note }) {
  return (
    <article className={`rounded-2xl border bg-white px-5 py-4 shadow-sm ${accentClassName}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{note}</p>
    </article>
  );
}

function getNavUnreadCount(itemId, selectedRole, ROLES, studentNotifications, lecturerNotifications) {
  if (selectedRole === ROLES.STUDENT && itemId === 'notifications') {
    return studentNotifications.unreadCount;
  }

  if (selectedRole === ROLES.LECTURER && itemId === 'lecturer-notifications') {
    return lecturerNotifications.unreadCount;
  }

  return 0;
}

function App() {
  const {
    accountError,
    activeAccount,
    isLoadingAccounts,
    lecturerAccounts,
    selectedLecturerCode,
    selectedRole,
    selectedStudentCode,
    studentAccounts,
    onLecturerCodeChange,
    onRoleChange,
    onStudentCodeChange,
    ROLE_OPTIONS,
    ROLES,
  } = useAccountSelector();

  const [activeNavId, setActiveNavId] = useState('research-area');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const studentJourney = useStudentJourneyDemo(selectedStudentCode);
  const {
    candidateQuery,
    createGroupName,
    filteredCandidates,
    group,
    groupAction,
    groupErrorMessage,
    inviteStudentCode,
    matching,
    matchingAction,
    matchingErrorMessage,
    proposedTopics,
    selectedAreaTitle,
    successMessage,
    topicAction,
    topicDraft,
    topicErrorMessage,
    topicOverview,
    onAcceptInvitation,
    onCandidateQueryChange,
    onChooseProposedTopic,
    onCreateGroup,
    onCreateGroupNameChange,
    onDeleteGroup,
    onDeleteTopic,
    onInvite,
    onInviteCandidateFromMatching,
    onInviteStudentCodeChange,
    onLeaveGroup,
    onLoadGroup,
    onLoadMatching,
    onLoadTopic,
    onRequestJoinGroup,
    onRejectInvitation,
    onSubmitTopic,
    onTopicDraftChange,
  } = studentJourney;

  const {
    currentErrorMessage,
    currentGroups,
    errorMessage: lecturerErrorMessage,
    groups: lecturerGroups,
    isCurrentLoading,
    isLoading: isLecturerLoading,
    isSubmitting: isLecturerSubmitting,
    selectedGroup: selectedLecturerGroup,
    successMessage: lecturerSuccessMessage,
    onAssignGroup,
    onCloseGroupDetail,
    onRefresh: onRefreshLecturerGroups,
    onRefreshCurrentGroups,
    onSelectGroup,
  } = useLecturerGroupSelection(selectedRole === ROLES.LECTURER, selectedLecturerCode);

  const {
    errorMessage: lecturerTopicErrorMessage,
    isLoading: isLecturerTopicLoading,
    isSubmitting: isLecturerTopicSubmitting,
    reviewNote,
    selectedTopic,
    successMessage: lecturerTopicSuccessMessage,
    topics: lecturerTopics,
    onApproveTopic,
    onFinalizeTopic,
    onRefresh: onRefreshLecturerTopics,
    onRejectTopic,
    onRequestChangesTopic,
    onReviewNoteChange,
    onSelectTopic,
  } = useLecturerTopicReview(selectedRole === ROLES.LECTURER, selectedLecturerCode);

  const studentProgress = useStudentProgress(selectedStudentCode);

  const lecturerProgress = useLecturerProgress(
    selectedRole === ROLES.LECTURER ? selectedLecturerCode : ''
  );

  const studentNotifications = useNotifications(
    'student',
    selectedRole === ROLES.STUDENT ? selectedStudentCode : ''
  );

  const lecturerNotifications = useNotifications(
    'lecturer',
    selectedRole === ROLES.LECTURER ? selectedLecturerCode : ''
  );

  useEffect(() => {
    if (selectedRole === ROLES.LECTURER && !activeNavId.startsWith('lecturer-')) {
      setActiveNavId('lecturer-groups');
    }
    if (selectedRole === ROLES.STUDENT && activeNavId.startsWith('lecturer-')) {
      setActiveNavId('research-area');
    }
    if (selectedRole === ROLES.ADMIN && (activeNavId.startsWith('lecturer-') || !activeNavId.startsWith('admin'))) {
      setActiveNavId('admin-dashboard');
    }
  }, [selectedRole, activeNavId, ROLES]);

  useEffect(() => {
    if (selectedRole !== ROLES.STUDENT) return;
    if (activeNavId === 'research-group') onLoadGroup();
    if (activeNavId === 'matching') onLoadMatching();
    if (activeNavId === 'topic') onLoadTopic();
    if (activeNavId === 'workflow') { onLoadGroup(); onLoadTopic(); }
  }, [activeNavId, selectedRole, ROLES, onLoadGroup, onLoadMatching, onLoadTopic]);

  useEffect(() => {
    if (selectedRole !== ROLES.STUDENT || !selectedStudentCode.trim()) return undefined;

    const timeoutId = window.setTimeout(() => {
      if (activeNavId === 'research-group') onLoadGroup();
      if (activeNavId === 'matching') onLoadMatching();
      if (activeNavId === 'topic') onLoadTopic();
      if (activeNavId === 'workflow') { onLoadGroup(); onLoadTopic(); }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [activeNavId, selectedRole, ROLES, onLoadGroup, onLoadMatching, onLoadTopic, selectedStudentCode]);

  useEffect(() => {
    if (selectedRole === ROLES.LECTURER && activeNavId === 'lecturer-current') {
      onRefreshCurrentGroups();
    }
  }, [activeNavId, selectedRole, ROLES, onRefreshCurrentGroups]);

  useEffect(() => {
    if (selectedRole === ROLES.LECTURER && activeNavId === 'lecturer-progress') {
      lecturerProgress.refetch();
    }
  }, [activeNavId, selectedRole, ROLES, lecturerProgress]);

  const navigationItems = selectedRole === ROLES.LECTURER ? LECTURER_NAV : STUDENT_NAV;
  const currentPageMeta = PAGE_META[activeNavId] || { title: 'Trang chủ', description: '' };
  const canInviteCandidates = Boolean(
    group
    && group.members.find(
      (member) => member.studentCode === selectedStudentCode && member.roleLabel === 'Trưởng nhóm'
    )
  );

  const topCards = useMemo(() => {
    if (selectedRole !== ROLES.STUDENT) return [];

    if (activeNavId === 'research-group') {
      return [
        { accentClassName: 'border-l-4 border-l-[#0b4a7a]', label: 'Trạng thái nhóm', value: group ? groupStatusLabel(group.status) : 'Chưa có nhóm', note: group ? `Nhóm ${group.name} — ${group.members.length}/${group.maxMembers} thành viên.` : 'Bạn có thể tạo nhóm mới.' },
        { accentClassName: 'border-l-4 border-l-slate-300', label: 'Mảng đã chọn', value: selectedAreaTitle, note: 'Chỉ sinh viên cùng mảng mới được vào cùng nhóm.' },
        { accentClassName: 'border-l-4 border-l-rose-300', label: 'Lời mời đã gửi', value: group ? String(group.sentInvitations.length) : '0', note: 'Theo dõi các lời mời đang chờ phản hồi.' },
      ];
    }

    if (activeNavId === 'matching') {
      return [
        { accentClassName: 'border-l-4 border-l-[#0b4a7a]', label: 'Sinh viên phù hợp', value: String(filteredCandidates.length), note: 'Sinh viên cùng mảng, chưa có nhóm.' },
        { accentClassName: 'border-l-4 border-l-slate-300', label: 'Nhóm phù hợp', value: String(matching.suggestedGroups.length), note: 'Nhóm còn thiếu thành viên.' },
        { accentClassName: 'border-l-4 border-l-rose-300', label: 'Lời mời đã nhận', value: String(matching.receivedInvitations.length), note: 'Chấp nhận hoặc từ chối trực tiếp.' },
      ];
    }

    if (activeNavId === 'topic') {
      return [
        { accentClassName: 'border-l-4 border-l-[#0b4a7a]', label: 'Nhóm hiện tại', value: topicOverview.group ? topicOverview.group.name : 'Chưa có nhóm', note: topicOverview.group ? `Trạng thái: ${groupStatusLabel(topicOverview.group.status)}` : 'Cần có nhóm trước.' },
        { accentClassName: 'border-l-4 border-l-slate-300', label: 'Giảng viên hướng dẫn', value: topicOverview.group?.lecturerName || 'Chưa có', note: 'Đề tài chỉ gửi khi đã có giảng viên.' },
        { accentClassName: 'border-l-4 border-l-rose-300', label: 'Trạng thái đề tài', value: topicOverview.topic ? topicStatusLabel(topicOverview.topic.status) : 'Chưa nộp', note: topicOverview.topic ? `Số lần chỉnh sửa: ${topicOverview.topic.revisionCount}` : 'Nhóm chưa có đề tài.' },
      ];
    }

    return [];
  }, [activeNavId, selectedRole, ROLES, filteredCandidates.length, group, matching, selectedAreaTitle, topicOverview]);

  const lecturerTopCards = useMemo(() => {
    if (selectedRole !== ROLES.LECTURER) return [];

    if (activeNavId === 'lecturer-groups') {
      return [
        { accentClassName: 'border-l-4 border-l-[#0b4a7a]', label: 'Nhóm ứng viên', value: String(lecturerGroups.length), note: 'Nhóm đang chờ giảng viên hướng dẫn.' },
        { accentClassName: 'border-l-4 border-l-slate-300', label: 'Nhóm đang xem', value: selectedLecturerGroup ? selectedLecturerGroup.name : 'Chưa chọn', note: selectedLecturerGroup ? `${selectedLecturerGroup.memberCount} thành viên` : 'Chọn để xem chi tiết.' },
        { accentClassName: 'border-l-4 border-l-rose-300', label: 'Phù hợp chuyên môn', value: String(lecturerGroups.filter((g) => g.isSpecializationMatch).length), note: 'Số nhóm phù hợp chuyên môn.' },
      ];
    }

    if (activeNavId === 'lecturer-topic') {
      return [
        { accentClassName: 'border-l-4 border-l-[#0b4a7a]', label: 'Đề tài chờ duyệt', value: String(lecturerTopics.length), note: 'Đề tài từ các nhóm bạn hướng dẫn.' },
        { accentClassName: 'border-l-4 border-l-slate-300', label: 'Đề tài đang chọn', value: selectedTopic ? selectedTopic.group.name : 'Chưa chọn', note: selectedTopic ? selectedTopic.title : 'Chọn để xem chi tiết.' },
        { accentClassName: 'border-l-4 border-l-rose-300', label: 'Vòng chỉnh sửa', value: selectedTopic ? String(selectedTopic.revisionCount) : '0', note: 'Số lần nhóm đã cập nhật.' },
      ];
    }

    if (activeNavId === 'lecturer-current') {
      const groupsWithTopic = currentGroups.filter((g) => g.topic);
      const groupsFinalized = currentGroups.filter((g) => g.topic && g.topic.status === TOPIC_SUBMISSION_STATUS.DA_CHOT);
      return [
        { accentClassName: 'border-l-4 border-l-[#0b4a7a]', label: 'Nhóm đang hướng dẫn', value: String(currentGroups.length), note: 'Tổng số nhóm bạn đang hướng dẫn.' },
        { accentClassName: 'border-l-4 border-l-slate-300', label: 'Đã nộp đề tài', value: String(groupsWithTopic.length), note: 'Nhóm đã nộp hoặc đang xử lý đề tài.' },
        { accentClassName: 'border-l-4 border-l-emerald-300', label: 'Đã chốt đề tài', value: String(groupsFinalized.length), note: 'Nhóm đã hoàn tất quy trình đề tài.' },
      ];
    }

    if (activeNavId === 'lecturer-progress' && lecturerProgress.overview) {
      const ov = lecturerProgress.overview;
      return [
        { accentClassName: 'border-l-4 border-l-[#0b4a7a]', label: 'Tổng nhóm', value: String(ov.tongNhom), note: `Slot còn lại: ${ov.soSlotConLai}` },
        { accentClassName: 'border-l-4 border-l-amber-300', label: 'Chờ duyệt / Cần sửa', value: String(ov.nhomChoDuyetDeTai + ov.nhomCanChinhSua), note: `${ov.nhomChoDuyetDeTai} chờ duyệt, ${ov.nhomCanChinhSua} cần sửa` },
        { accentClassName: 'border-l-4 border-l-emerald-300', label: 'Đã duyệt / Đã chốt', value: String(ov.nhomDaDuyet + ov.nhomDaChot), note: `${ov.nhomDaDuyet} đã duyệt, ${ov.nhomDaChot} đã chốt` },
      ];
    }

    return [];
  }, [activeNavId, selectedRole, ROLES, currentGroups, lecturerGroups, selectedLecturerGroup, lecturerTopics, selectedTopic, lecturerProgress.overview]);

  const displayCards = selectedRole === ROLES.LECTURER ? lecturerTopCards : topCards;

  if (isLoadingAccounts) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-3xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b4a7a]" />
          <p className="mt-5 text-sm font-medium text-slate-500">Đang tải danh sách tài khoản...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="mx-auto flex max-w-[1520px] gap-0">
        {isMobileNavOpen ? (
          <div className="fixed inset-0 z-50 xl:hidden">
            <div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
              onClick={() => setIsMobileNavOpen(false)}
            />
            <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col overflow-y-auto border-r border-slate-200 bg-white px-4 py-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-[#0b4a7a] px-4 py-3 text-white flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-sm font-bold">H</div>
                    <div>
                      <p className="text-sm font-semibold leading-tight">Hanoi Open University</p>
                      <p className="mt-0.5 text-xs text-sky-200">Hệ thống NCKH</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                  aria-label="Đóng menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="mt-5 flex-1 space-y-1">
                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Điều hướng</p>
                {navigationItems.map((item) => {
                  const isActive = item.id === activeNavId;
                  const unreadCount = getNavUnreadCount(
                    item.id,
                    selectedRole,
                    ROLES,
                    studentNotifications,
                    lecturerNotifications
                  );
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setActiveNavId(item.id); setIsMobileNavOpen(false); }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#edf5ff] text-[#0b4a7a]'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <NavIcon type={item.icon} />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {unreadCount > 0 ? (
                        <span
                          className={`inline-flex min-w-[1.4rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                            isActive ? 'bg-[#0b4a7a] text-white' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold text-slate-700">Hỗ trợ</p>
                <p className="mt-1 text-xs text-slate-500">nckh@hou.edu.vn</p>
              </div>
            </aside>
          </div>
        ) : null}

        <aside className="hidden w-[260px] shrink-0 xl:flex xl:flex-col" style={{ position: 'sticky', top: 0, height: '100vh' }}>
          <div className="flex flex-1 flex-col overflow-y-auto border-r border-slate-200 bg-white px-4 py-5">
            <div className="rounded-2xl bg-[#0b4a7a] px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-sm font-bold">H</div>
                <div>
                  <p className="text-sm font-semibold leading-tight">Hanoi Open University</p>
                  <p className="mt-0.5 text-xs text-sky-200">Hệ thống NCKH</p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Vai trò</p>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0b4a7a]"
                value={selectedRole}
                onChange={(e) => onRoleChange(e.target.value)}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {selectedRole === ROLES.LECTURER ? 'Giảng viên' : selectedRole === ROLES.ADMIN ? 'Quản trị viên' : 'Sinh viên'}
              </p>
              {selectedRole === ROLES.ADMIN ? (
                <div className="rounded-xl bg-white px-3 py-2 text-sm text-slate-500">Quản trị viên</div>
              ) : selectedRole === ROLES.LECTURER ? (
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0b4a7a]"
                  value={selectedLecturerCode}
                  onChange={(e) => onLecturerCodeChange(e.target.value)}
                >
                  {lecturerAccounts.length === 0 ? (
                    <option value="">Không có tài khoản</option>
                  ) : null}
                  {lecturerAccounts.map((acc) => (
                    <option key={acc.code} value={acc.code}>
                      {acc.code} — {acc.fullName}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0b4a7a]"
                  value={selectedStudentCode}
                  onChange={(e) => onStudentCodeChange(e.target.value)}
                >
                  {studentAccounts.length === 0 ? (
                    <option value="">Không có tài khoản</option>
                  ) : null}
                  {studentAccounts.map((acc) => (
                    <option key={acc.code} value={acc.code}>
                      {acc.code} — {acc.fullName}
                    </option>
                  ))}
                </select>
              )}

              {accountError ? (
                <p className="mt-2 text-xs text-rose-500">{accountError}</p>
              ) : null}
            </div>

            <nav className="mt-5 flex-1 space-y-1">
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Điều hướng</p>
              {navigationItems.map((item) => {
                const isActive = item.id === activeNavId;
                const unreadCount = getNavUnreadCount(
                  item.id,
                  selectedRole,
                  ROLES,
                  studentNotifications,
                  lecturerNotifications
                );
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveNavId(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                      isActive
                        ? 'bg-[#edf5ff] text-[#0b4a7a]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <NavIcon type={item.icon} />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {unreadCount > 0 ? (
                      <span
                        className={`inline-flex min-w-[1.4rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                          isActive ? 'bg-[#0b4a7a] text-white' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold text-slate-700">Hỗ trợ</p>
              <p className="mt-1 text-xs text-slate-500">nckh@hou.edu.vn</p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-5 py-3 md:px-6">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#0b4a7a]">Quản lý Nghiên cứu Khoa học</p>
                <h1 className="mt-0.5 truncate text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
                  {currentPageMeta.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 xl:hidden"
                  aria-label="Mở menu điều hướng"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="flex items-center gap-2 xl:hidden">
                  <select
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 outline-none"
                    value={selectedRole}
                    onChange={(e) => onRoleChange(e.target.value)}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>

                  {selectedRole !== ROLES.ADMIN ? (
                    <select
                      className="max-w-[180px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 outline-none"
                      value={selectedRole === ROLES.LECTURER ? selectedLecturerCode : selectedStudentCode}
                      onChange={(e) =>
                        selectedRole === ROLES.LECTURER
                          ? onLecturerCodeChange(e.target.value)
                          : onStudentCodeChange(e.target.value)
                      }
                    >
                      {(selectedRole === ROLES.LECTURER ? lecturerAccounts : studentAccounts).map((acc) => (
                        <option key={acc.code} value={acc.code}>
                          {acc.code} — {acc.fullName}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2">
                  <AccountAvatar name={activeAccount?.fullName} size="lg" />
                  <div className="hidden min-w-0 md:block">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {activeAccount?.fullName || 'Chưa chọn'}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {selectedRole === ROLES.LECTURER
                        ? activeAccount?.specialization || 'Giảng viên'
                        : selectedRole === ROLES.ADMIN
                        ? 'Quản trị viên'
                        : activeAccount?.className || 'Sinh viên'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-5 md:px-6 md:py-6">
            {selectedRole === ROLES.ADMIN ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950">Trang quản trị</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Chức năng quản trị viên đang được phát triển. Hiện tại bạn có thể chuyển sang vai trò Sinh viên hoặc Giảng viên để sử dụng các tính năng đã hoàn thiện.
                </p>
              </div>
            ) : null}

            {selectedRole !== ROLES.ADMIN ? (
              <>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{currentPageMeta.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{currentPageMeta.description}</p>
                  </div>

                </div>

                {displayCards.length > 0 ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {displayCards.map((card) => (
                      <OverviewCard key={card.label} accentClassName={card.accentClassName} label={card.label} value={card.value} note={card.note} />
                    ))}
                  </div>
                ) : null}

                {selectedRole === ROLES.STUDENT && successMessage ? (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</div>
                ) : null}
                {selectedRole === ROLES.LECTURER && lecturerSuccessMessage ? (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{lecturerSuccessMessage}</div>
                ) : null}
                {selectedRole === ROLES.LECTURER && lecturerTopicSuccessMessage ? (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{lecturerTopicSuccessMessage}</div>
                ) : null}

                {selectedRole === ROLES.STUDENT ? (
                  <div className="mt-5">
                    {activeNavId === 'research-area' ? (
                      <ResearchAreaPage studentCode={selectedStudentCode} />
                    ) : null}

                    {activeNavId === 'research-group' ? (
                      <>
                        <ResearchGroupBoard createGroupName={createGroupName} currentStudentCode={selectedStudentCode} group={group} inviteStudentCode={inviteStudentCode} isCreating={groupAction.type === 'create-group'} isDeleting={groupAction.type === 'delete-group' && groupAction.targetId === String(group?.id || '')} isInviting={groupAction.type === 'invite-member'} isLeaving={groupAction.type === 'leave-group' && groupAction.targetId === String(group?.id || '')} onCreateGroup={onCreateGroup} onCreateGroupNameChange={onCreateGroupNameChange} onDeleteGroup={onDeleteGroup} onInvite={onInvite} onInviteStudentCodeChange={onInviteStudentCodeChange} onLeaveGroup={onLeaveGroup} studentSuggestions={matching.matchingCandidates} />
                        {groupErrorMessage ? <p className="mt-5 text-sm text-rose-600">{groupErrorMessage}</p> : null}
                      </>
                    ) : null}

                    {activeNavId === 'matching' ? (
                      <>
                        <GroupMatchingBoard candidateQuery={candidateQuery} canInviteCandidates={canInviteCandidates} candidates={filteredCandidates} invitations={matching.receivedInvitations} matchingAction={matchingAction} onAcceptInvitation={onAcceptInvitation} onCandidateQueryChange={onCandidateQueryChange} onInviteCandidate={onInviteCandidateFromMatching} onRejectInvitation={onRejectInvitation} onRequestJoinGroup={onRequestJoinGroup} suggestedGroups={matching.suggestedGroups} />
                        {matchingErrorMessage ? <p className="mt-5 text-sm text-rose-600">{matchingErrorMessage}</p> : null}
                      </>
                    ) : null}

                    {activeNavId === 'topic' ? (
                      <>
                        <TopicBoard isChoosingTopic={(topicId) => topicAction.type === 'choose-proposed-topic' && topicAction.targetId === String(topicId)} isDeletingTopic={topicAction.type === 'delete-topic'} isSubmittingTopic={topicAction.type === 'submit-topic' || topicAction.type === 'edit-topic'} onChooseProposedTopic={onChooseProposedTopic} onDeleteTopic={onDeleteTopic} onRefresh={onLoadTopic} onSubmit={onSubmitTopic} onTopicDraftChange={onTopicDraftChange} proposedTopics={proposedTopics} topicDraft={topicDraft} topicOverview={topicOverview} />
                        {topicErrorMessage ? <p className="mt-5 text-sm text-rose-600">{topicErrorMessage}</p> : null}
                      </>
                    ) : null}

                    {activeNavId === 'workflow' ? (
                      studentProgress.isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b4a7a]" />
                            <p className="mt-4 text-sm text-slate-500">Đang tải tiến trình...</p>
                          </div>
                        </div>
                      ) : studentProgress.errorMessage ? (
                        <div className="rounded-2xl border border-rose-200 bg-white px-6 py-8 text-center shadow-sm">
                          <p className="text-lg font-semibold text-slate-950">Không thể tải tiến trình</p>
                          <p className="mt-2 text-sm text-rose-600">{studentProgress.errorMessage}</p>
                        </div>
                      ) : (
                        <StudentProgressBoard
                          groupData={studentProgress.groupData}
                          topicOverview={studentProgress.topicOverview}
                          steps={studentProgress.steps}
                          currentStepIndex={studentProgress.currentStepIndex}
                          detail={studentProgress.detail}
                          milestones={studentProgress.milestones}
                          timelineEvents={studentProgress.timelineEvents}
                          onNavigate={setActiveNavId}
                        />
                      )
                    ) : null}

                    {activeNavId === 'notifications' ? (
                      <NotificationBoard
                        notifications={studentNotifications.notifications}
                        isLoading={studentNotifications.isLoading}
                        errorMessage={studentNotifications.errorMessage}
                        filter={studentNotifications.filter}
                        unreadCount={studentNotifications.unreadCount}
                        onFilterChange={studentNotifications.onFilterChange}
                        onMarkAsRead={studentNotifications.onMarkAsRead}
                        onRefresh={studentNotifications.onRefresh}
                      />
                    ) : null}
                  </div>
                ) : null}

                {selectedRole === ROLES.LECTURER ? (
                  <div className="mt-5">
                    {activeNavId === 'lecturer-groups' ? (
                      <>
                        <LecturerGroupSelectionBoard groups={lecturerGroups} isLoading={isLecturerLoading} onRefresh={onRefreshLecturerGroups} onSelectGroup={onSelectGroup} />
                        {lecturerErrorMessage ? <p className="mt-5 text-sm text-rose-600">{lecturerErrorMessage}</p> : null}
                      </>
                    ) : null}

                     {activeNavId === 'lecturer-topic' ? (
                       <>
                         <LecturerTopicReviewBoard isLoading={isLecturerTopicLoading} isSubmitting={isLecturerTopicSubmitting} onApproveTopic={onApproveTopic} onFinalizeTopic={onFinalizeTopic} onRefresh={onRefreshLecturerTopics} onRejectTopic={onRejectTopic} onRequestChangesTopic={onRequestChangesTopic} onReviewNoteChange={onReviewNoteChange} onSelectTopic={onSelectTopic} reviewNote={reviewNote} selectedTopic={selectedTopic} topics={lecturerTopics} />
                         {lecturerTopicErrorMessage ? <p className="mt-5 text-sm text-rose-600">{lecturerTopicErrorMessage}</p> : null}
                       </>
                     ) : null}

                    {activeNavId === 'lecturer-current' ? (
                      <>
                        <LecturerCurrentGroupsBoard
                          groups={currentGroups}
                          isLoading={isCurrentLoading}
                          onRefresh={onRefreshCurrentGroups}
                        />
                        {currentErrorMessage ? <p className="mt-5 text-sm text-rose-600">{currentErrorMessage}</p> : null}
                      </>
                    ) : null}

                    {activeNavId === 'lecturer-progress' ? (
                      lecturerProgress.isLoading && lecturerProgress.groupProgressList.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b4a7a]" />
                            <p className="mt-4 text-sm text-slate-500">Đang tải tiến trình...</p>
                          </div>
                        </div>
                      ) : lecturerProgress.errorMessage ? (
                        <div className="rounded-2xl border border-rose-200 bg-white px-6 py-8 text-center shadow-sm">
                          <p className="text-lg font-semibold text-slate-950">Không thể tải tiến trình</p>
                          <p className="mt-2 text-sm text-rose-600">{lecturerProgress.errorMessage}</p>
                          <button type="button" onClick={lecturerProgress.refetch} className="mt-4 rounded-xl bg-[#0b4a7a] px-5 py-2 text-sm font-semibold text-white">
                            Thử lại
                          </button>
                        </div>
                      ) : (
                        <LecturerProgressBoard
                          groupProgressList={lecturerProgress.groupProgressList}
                          isLoading={lecturerProgress.isLoading}
                          onRefresh={lecturerProgress.refetch}
                        />
                      )
                    ) : null}

                    {activeNavId === 'lecturer-notifications' ? (
                      <NotificationBoard
                        notifications={lecturerNotifications.notifications}
                        isLoading={lecturerNotifications.isLoading}
                        errorMessage={lecturerNotifications.errorMessage}
                        filter={lecturerNotifications.filter}
                        unreadCount={lecturerNotifications.unreadCount}
                        onFilterChange={lecturerNotifications.onFilterChange}
                        onMarkAsRead={lecturerNotifications.onMarkAsRead}
                        onRefresh={lecturerNotifications.onRefresh}
                      />
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <LecturerGroupDetailModal
        group={selectedLecturerGroup}
        isSubmitting={isLecturerSubmitting}
        onAssign={onAssignGroup}
        onClose={onCloseGroupDetail}
      />
    </main>
  );
}

export default App;
