import React, { useEffect, useMemo, useState } from 'react';
import { topicStatusLabel, topicStatusBadgeClass } from '../../../shared/utils/status-labels';

const STUDENT_PROPOSED_TOPIC = 'NHOM_DE_XUAT';
const LECTURER_PROPOSED_TOPIC = 'GIANG_VIEN_DE_XUAT';
const SWITCHABLE_TOPIC_STATUSES = ['NHAP', 'CHO_GIANG_VIEN_DUYET', 'CAN_CHINH_SUA', 'TU_CHOI'];
const TOPIC_TABS = Object.freeze({
  LECTURER_PROPOSALS: 'LECTURER_PROPOSALS',
  STUDENT_PROPOSAL: 'STUDENT_PROPOSAL',
});

function FieldBlock({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value || 'Chưa cập nhật'}</p>
    </div>
  );
}

function TopicSwitchConfirmationModal({ onCancel, onConfirm, isSubmitting, switchState }) {
  if (!switchState) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <div className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Xác nhận chuyển đề tài</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-950">{switchState.title}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-600">{switchState.description}</p>
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          {switchState.warning}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-2xl bg-[#0b4a7a] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận chuyển'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProposedTopicCard({ actionLabel, disabled, isChoosing, onChoose, topic }) {
  const proposalBadgeClass = topic.status === 'ACTIVE' ? 'bg-sky-100 text-sky-700' : topicStatusBadgeClass(topic.status);
  const proposalBadgeLabel = topic.status === 'ACTIVE' ? 'Sẵn sàng chọn' : topicStatusLabel(topic.status);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-semibold text-slate-950 leading-snug">{topic.title}</h4>
          <span className="mt-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Giảng viên đề xuất
          </span>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${proposalBadgeClass}`}>
          {proposalBadgeLabel}
        </span>
      </div>

      {topic.problemDescription ? (
        <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-3">{topic.problemDescription}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {topic.researchGoals ? (
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Mục tiêu:</span>{' '}
            <span className="line-clamp-1">{topic.researchGoals}</span>
          </div>
        ) : null}
        {topic.technologyStack ? (
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Công nghệ:</span> {topic.technologyStack}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onChoose(topic.id)}
        disabled={disabled || isChoosing}
        className="mt-4 w-full rounded-2xl bg-[#0b4a7a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#08395d] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
      >
        {disabled ? 'Không thể chọn' : isChoosing ? 'Đang chọn...' : actionLabel}
      </button>
    </div>
  );
}

function ProposedTopicSection({ canSwitchTopic, hasExistingTopic, isChoosingTopic, onChoose, proposedTopics }) {
  if (!proposedTopics.length) {
    return (
      <article className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
        <div className="mx-auto max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Đề tài giảng viên đề xuất</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">Chưa có đề tài đề xuất</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Giảng viên hướng dẫn chưa đề xuất đề tài nào cho nhóm. Bạn có thể tự đề xuất đề tài bằng form phía trên.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Đề tài giảng viên đề xuất</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            {proposedTopics.length} đề tài có sẵn
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Giảng viên đã đề xuất các đề tài bên dưới. Chọn một đề tài phù hợp hoặc tự đề xuất đề tài riêng.
          </p>
        </div>
        {hasExistingTopic ? (
          <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Đã có đề tài
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {proposedTopics.map((topic) => (
            <ProposedTopicCard
              actionLabel={hasExistingTopic && canSwitchTopic ? 'Chuyển sang đề tài này' : 'Chọn đề tài này'}
              key={topic.id}
              disabled={hasExistingTopic && !canSwitchTopic}
              isChoosing={isChoosingTopic(topic.id)}
              onChoose={onChoose}
              topic={topic}
          />
        ))}
      </div>
    </article>
  );
}

function TopicSubTabs({ activeTab, onChange, proposedTopicsCount }) {
  const tabs = [
    {
      id: TOPIC_TABS.LECTURER_PROPOSALS,
      label: 'Đề tài giảng viên đề xuất',
      description: proposedTopicsCount > 0 ? `${proposedTopicsCount} đề tài có sẵn` : 'Chưa có đề tài đề xuất',
    },
    {
      id: TOPIC_TABS.STUDENT_PROPOSAL,
      label: 'Tự đề xuất đề tài',
      description: 'Tạo, sửa hoặc xóa đề tài nhóm tự đề xuất',
    },
  ];

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid gap-2 md:grid-cols-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`rounded-[22px] px-4 py-4 text-left transition ${
                isActive
                  ? 'bg-[#0b4a7a] text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-950'}`}>{tab.label}</p>
              <p className={`mt-1 text-xs ${isActive ? 'text-slate-100' : 'text-slate-500'}`}>{tab.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StudentProposalSection({
  canDeleteTopic,
  group,
  isDeletingTopic,
  isEditable,
  isEditingTopic,
  isSwitchingFromLecturer,
  isSubmittingTopic,
  onDeleteTopic,
  onRefresh,
  onSubmit,
  onTopicDraftChange,
  topic,
  topicDraft,
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <article className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Nhóm hiện tại</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{group.name}</h3>
            <p className="mt-2 text-sm text-slate-500">
              Mảng {group.researchAreaName} • {group.memberCount} thành viên • Giảng viên{' '}
              {group.lecturerName || 'chưa phân công'}
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
          >
            Làm mới
          </button>
        </div>

        {!group.lecturerName ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
            Nhóm chưa có giảng viên hướng dẫn. Bạn sẽ nộp đề tài sau khi giảng viên nhận nhóm.
          </div>
        ) : null}

        {group.lecturerName ? (
          <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-800">
            Đây là khu vực cho đề tài sinh viên tự đề xuất. Nếu giảng viên chưa duyệt thì bạn vẫn có thể sửa hoặc xóa đề tài này.
          </div>
        ) : null}

        {topic ? (
          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Đề tài hiện tại</p>
                <h4 className="mt-2 text-xl font-semibold text-slate-950">{topic.title}</h4>
                <p className="mt-2 text-sm text-slate-500">
                  {topic.type === STUDENT_PROPOSED_TOPIC ? 'Đề tài sinh viên tự đề xuất' : 'Đề tài giảng viên đề xuất'}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${topicStatusBadgeClass(topic.status)}`}>
                {topicStatusLabel(topic.status)}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <FieldBlock label="Mô tả vấn đề" value={topic.problemDescription} />
              <FieldBlock label="Mục tiêu nghiên cứu" value={topic.researchGoals} />
              <FieldBlock label="Phạm vi nghiên cứu" value={topic.researchScope} />
              <FieldBlock label="Công nghệ sử dụng" value={topic.technologyStack} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <FieldBlock label="Ứng dụng thực tiễn" value={topic.practicalApplication} />
              <FieldBlock label="Lý do lựa chọn" value={topic.reason} />
            </div>

            {topic.lecturerComment || topic.revisionNote ? (
              <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-950">Phản hồi từ giảng viên</p>
                {topic.lecturerComment ? (
                  <p className="mt-2 text-sm leading-6 text-slate-700">{topic.lecturerComment}</p>
                ) : null}
                {topic.revisionNote ? (
                  <p className="mt-2 text-sm leading-6 text-slate-700">Ghi chú chỉnh sửa: {topic.revisionNote}</p>
                ) : null}
                {topic.editDeadline ? (
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Hạn chỉnh sửa: {new Date(topic.editDeadline).toLocaleDateString('vi-VN')}
                  </p>
                ) : null}
              </div>
            ) : null}

            {canDeleteTopic ? (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={onDeleteTopic}
                  disabled={isDeletingTopic}
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeletingTopic ? 'Đang xóa...' : 'Xóa đề tài'}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-5">
            <p className="text-sm font-semibold text-slate-900">Nhóm chưa nộp đề tài tự đề xuất.</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Điền form bên phải để gửi đề tài sinh viên tự đề xuất cho giảng viên duyệt.
            </p>
          </div>
        )}
      </article>

      <article className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          {isEditable ? 'Chỉnh sửa đề tài tự đề xuất' : 'Tự đề xuất đề tài'}
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-950">
          {isEditable ? 'Gửi lại nội dung đã chỉnh sửa' : 'Tạo đề tài nhóm'}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Giữ form ngắn gọn, rõ vấn đề nghiên cứu và hướng triển khai để giảng viên duyệt nhanh hơn.
        </p>

        {!isEditable ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            {group.lecturerName
              ? 'Bạn chưa thể chỉnh sửa hoặc nộp đề tài ở trạng thái hiện tại. Đề tài sinh viên tự đề xuất chỉ có thể chỉnh sửa/xóa khi còn đang chờ duyệt hoặc trước khi giảng viên kết luận cuối cùng.'
              : 'Cần có giảng viên hướng dẫn trước khi nhóm được nộp hoặc chọn đề tài.'}
          </div>
        ) : null}

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tên đề tài</span>
            <input
              value={topicDraft.title}
              onChange={(event) => onTopicDraftChange('title', event.target.value)}
              disabled={!isEditable || isSubmittingTopic}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mô tả vấn đề</span>
            <textarea
              value={topicDraft.problemDescription}
              onChange={(event) => onTopicDraftChange('problemDescription', event.target.value)}
              disabled={!isEditable || isSubmittingTopic}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mục tiêu nghiên cứu</span>
            <textarea
              value={topicDraft.researchGoals}
              onChange={(event) => onTopicDraftChange('researchGoals', event.target.value)}
              disabled={!isEditable || isSubmittingTopic}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Ứng dụng thực tiễn</span>
            <textarea
              value={topicDraft.practicalApplication}
              onChange={(event) => onTopicDraftChange('practicalApplication', event.target.value)}
              disabled={!isEditable || isSubmittingTopic}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Phạm vi nghiên cứu</span>
            <textarea
              value={topicDraft.researchScope}
              onChange={(event) => onTopicDraftChange('researchScope', event.target.value)}
              disabled={!isEditable || isSubmittingTopic}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Công nghệ sử dụng</span>
            <textarea
              value={topicDraft.technologyStack}
              onChange={(event) => onTopicDraftChange('technologyStack', event.target.value)}
              disabled={!isEditable || isSubmittingTopic}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Lý do lựa chọn</span>
            <textarea
              value={topicDraft.reason}
              onChange={(event) => onTopicDraftChange('reason', event.target.value)}
              disabled={!isEditable || isSubmittingTopic}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!isEditable || isSubmittingTopic}
          className="mt-5 w-full rounded-2xl bg-[#0b4a7a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#08395d] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmittingTopic
            ? 'Đang xử lý...'
            : isEditingTopic
              ? 'Gửi lại đề tài'
              : isSwitchingFromLecturer
                ? 'Chuyển sang đề tài tự đề xuất'
                : 'Nộp đề tài'}
        </button>
      </article>
    </div>
  );
}

function TopicBoard({
  isDeletingTopic,
  isChoosingTopic,
  isSubmittingTopic,
  onChooseProposedTopic,
  onDeleteTopic,
  onRefresh,
  onSubmit,
  onTopicDraftChange,
  proposedTopics,
  topicDraft,
  topicOverview,
}) {
  const group = topicOverview.group || null;
  const permissions = topicOverview.permissions || { canSubmit: false, canEdit: false, canDelete: false };
  const topic = topicOverview.topic || null;
  const isEditable = permissions.canSubmit || permissions.canEdit;
  const isEditingStudentProposal = Boolean(topic && topic.type === STUDENT_PROPOSED_TOPIC && permissions.canEdit);
  const canDeleteTopic = Boolean(topic && permissions.canDelete && topic.type === STUDENT_PROPOSED_TOPIC);
  const canSwitchTopic = Boolean(topic && SWITCHABLE_TOPIC_STATUSES.includes(topic.status));
  const isSwitchingFromLecturer = Boolean(topic && topic.type === LECTURER_PROPOSED_TOPIC && permissions.canSubmit);
  const [activeTab, setActiveTab] = useState(TOPIC_TABS.LECTURER_PROPOSALS);
  const [pendingSwitch, setPendingSwitch] = useState(null);
  const proposedTopicsCount = proposedTopics?.length || 0;

  const defaultTab = useMemo(() => {
    if (topic?.type === STUDENT_PROPOSED_TOPIC || proposedTopicsCount === 0) {
      return TOPIC_TABS.STUDENT_PROPOSAL;
    }

    return TOPIC_TABS.LECTURER_PROPOSALS;
  }, [proposedTopicsCount, topic?.type]);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const isSwitchConfirmSubmitting = isSubmittingTopic || isChoosingTopic(pendingSwitch?.proposedTopicId || '');

  function handleChooseTopic(topicId) {
    if (topic && canSwitchTopic) {
      setPendingSwitch({
        direction: 'TO_LECTURER_PROPOSAL',
        proposedTopicId: topicId,
        title: 'Chuyển sang đề tài giảng viên đề xuất',
        description: 'Bạn đang có một đề tài hiện tại. Nếu tiếp tục, hệ thống sẽ thay thế đề tài hiện tại bằng đề tài do giảng viên đề xuất mà bạn chọn.',
        warning: `Đề tài hiện tại "${topic.title}" sẽ bị thay thế. Nếu đề tài đang chờ giảng viên duyệt thì yêu cầu duyệt hiện tại cũng sẽ bị hủy.`,
      });
      return;
    }

    onChooseProposedTopic(topicId);
  }

  function handleSubmitStudentProposal() {
    if (isSwitchingFromLecturer && topic) {
      setPendingSwitch({
        direction: 'TO_STUDENT_PROPOSAL',
        title: 'Chuyển sang đề tài tự đề xuất',
        description: 'Bạn đang dùng đề tài giảng viên đề xuất. Nếu tiếp tục, hệ thống sẽ chuyển sang đề tài tự đề xuất với nội dung bạn vừa nhập.',
        warning: `Đề tài hiện tại "${topic.title}" sẽ bị thay thế bằng đề tài nhóm tự đề xuất. Nếu đề tài đang chờ duyệt thì yêu cầu duyệt hiện tại cũng sẽ bị hủy.`,
      });
      return;
    }

    onSubmit();
  }

  function handleCloseSwitchModal() {
    setPendingSwitch(null);
  }

  async function handleConfirmSwitch() {
    if (!pendingSwitch) {
      return;
    }

    if (pendingSwitch.direction === 'TO_LECTURER_PROPOSAL') {
      await onChooseProposedTopic(pendingSwitch.proposedTopicId, true);
    }

    if (pendingSwitch.direction === 'TO_STUDENT_PROPOSAL') {
      await onSubmit(true);
    }

    setPendingSwitch(null);
  }

  if (!topicOverview.group) {
    return (
      <section className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
        <h3 className="text-xl font-semibold text-slate-950">Chưa có nhóm để đăng ký đề tài</h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Bạn cần hoàn tất bước tạo nhóm hoặc tham gia nhóm trước khi chuyển sang bước đề tài nghiên cứu.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <TopicSubTabs activeTab={activeTab} onChange={setActiveTab} proposedTopicsCount={proposedTopicsCount} />

      {activeTab === TOPIC_TABS.LECTURER_PROPOSALS ? (
        <ProposedTopicSection
          canSwitchTopic={canSwitchTopic}
          hasExistingTopic={Boolean(topic)}
          isChoosingTopic={isChoosingTopic}
          onChoose={handleChooseTopic}
          proposedTopics={proposedTopics || []}
        />
      ) : null}

      {activeTab === TOPIC_TABS.STUDENT_PROPOSAL ? (
        <StudentProposalSection
          canDeleteTopic={canDeleteTopic}
          group={group}
          isDeletingTopic={isDeletingTopic}
          isEditingTopic={isEditingStudentProposal}
          isEditable={isEditable}
          isSwitchingFromLecturer={isSwitchingFromLecturer}
          isSubmittingTopic={isSubmittingTopic}
          onDeleteTopic={onDeleteTopic}
          onRefresh={onRefresh}
          onSubmit={handleSubmitStudentProposal}
          onTopicDraftChange={onTopicDraftChange}
          topic={topic}
          topicDraft={topicDraft}
        />
      ) : null}

      <TopicSwitchConfirmationModal
        isSubmitting={isSwitchConfirmSubmitting}
        onCancel={handleCloseSwitchModal}
        onConfirm={handleConfirmSwitch}
        switchState={pendingSwitch}
      />
    </section>
  );
}

export default TopicBoard;
