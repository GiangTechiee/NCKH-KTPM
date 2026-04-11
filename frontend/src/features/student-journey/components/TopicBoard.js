import React from 'react';
import { topicStatusLabel, topicStatusBadgeClass } from '../../../shared/utils/status-labels';

function FieldBlock({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value || 'Chưa cập nhật'}</p>
    </div>
  );
}

function ProposedTopicCard({ disabled, isSubmitting, onChoose, topic }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-semibold text-slate-950 leading-snug">{topic.title}</h4>
          <span className="mt-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Giảng viên đề xuất
          </span>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${topicStatusBadgeClass(topic.status)}`}>
          {topicStatusLabel(topic.status)}
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
        disabled={disabled || isSubmitting}
        className="mt-4 w-full rounded-2xl bg-[#0b4a7a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#08395d] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
      >
        {disabled ? 'Không thể chọn' : 'Chọn đề tài này'}
      </button>
    </div>
  );
}

function ProposedTopicSection({ hasExistingTopic, isSubmitting, onChoose, proposedTopics }) {
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
            key={topic.id}
            disabled={hasExistingTopic}
            isSubmitting={isSubmitting}
            onChoose={onChoose}
            topic={topic}
          />
        ))}
      </div>
    </article>
  );
}

function TopicBoard({
  isSubmitting,
  onChooseProposedTopic,
  onRefresh,
  onSubmit,
  onTopicDraftChange,
  proposedTopics,
  topicDraft,
  topicOverview,
}) {
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

  const { group, permissions, topic } = topicOverview;
  const isEditable = permissions.canSubmit || permissions.canEdit;

  return (
    <section className="space-y-5">
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

          {topic ? (
            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Đề tài hiện tại</p>
                  <h4 className="mt-2 text-xl font-semibold text-slate-950">{topic.title}</h4>
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
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-5">
              <p className="text-sm font-semibold text-slate-900">Nhóm chưa nộp đề tài.</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Điền form bên phải để gửi đề tài tự đề xuất cho giảng viên duyệt.
              </p>
            </div>
          )}
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            {permissions.canEdit ? 'Chỉnh sửa đề tài' : 'Đề xuất đề tài'}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            {permissions.canEdit ? 'Gửi lại nội dung đã chỉnh sửa' : 'Tạo đề tài nhóm'}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Giữ form ngắn gọn, rõ vấn đề nghiên cứu và hướng triển khai để giảng viên duyệt nhanh hơn.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tên đề tài</span>
              <input
                value={topicDraft.title}
                onChange={(event) => onTopicDraftChange('title', event.target.value)}
                disabled={!isEditable || isSubmitting}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Mô tả vấn đề</span>
              <textarea
                value={topicDraft.problemDescription}
                onChange={(event) => onTopicDraftChange('problemDescription', event.target.value)}
                disabled={!isEditable || isSubmitting}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Mục tiêu nghiên cứu</span>
              <textarea
                value={topicDraft.researchGoals}
                onChange={(event) => onTopicDraftChange('researchGoals', event.target.value)}
                disabled={!isEditable || isSubmitting}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Ứng dụng thực tiễn</span>
              <textarea
                value={topicDraft.practicalApplication}
                onChange={(event) => onTopicDraftChange('practicalApplication', event.target.value)}
                disabled={!isEditable || isSubmitting}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Phạm vi nghiên cứu</span>
              <textarea
                value={topicDraft.researchScope}
                onChange={(event) => onTopicDraftChange('researchScope', event.target.value)}
                disabled={!isEditable || isSubmitting}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Công nghệ sử dụng</span>
              <textarea
                value={topicDraft.technologyStack}
                onChange={(event) => onTopicDraftChange('technologyStack', event.target.value)}
                disabled={!isEditable || isSubmitting}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Lý do lựa chọn</span>
              <textarea
                value={topicDraft.reason}
                onChange={(event) => onTopicDraftChange('reason', event.target.value)}
                disabled={!isEditable || isSubmitting}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!isEditable || isSubmitting}
            className="mt-5 w-full rounded-2xl bg-[#0b4a7a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#08395d] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {permissions.canEdit ? 'Gửi lại đề tài' : 'Nộp đề tài'}
          </button>
        </article>
      </div>

      <ProposedTopicSection
        hasExistingTopic={Boolean(topic)}
        isSubmitting={isSubmitting}
        onChoose={onChooseProposedTopic}
        proposedTopics={proposedTopics || []}
      />
    </section>
  );
}

export default TopicBoard;
