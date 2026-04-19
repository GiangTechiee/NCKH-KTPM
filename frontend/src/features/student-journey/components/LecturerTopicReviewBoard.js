import React from 'react';
import { TOPIC_SUBMISSION_STATUS } from '../../../shared/types/status.types';
import { topicStatusLabel, topicStatusBadgeClass, memberRoleLabel } from '../../../shared/utils/status-labels';

function LecturerTopicReviewBoard({
  isLoading,
  isSubmitting,
  onApproveTopic,
  onFinalizeTopic,
  onRefresh,
  onRejectTopic,
  onRequestChangesTopic,
  onReviewNoteChange,
  onSelectTopic,
  reviewNote,
  selectedTopic,
  topics,
}) {
  if (isLoading && topics.length === 0) {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Đang tải danh sách đề tài chờ duyệt...</p>
      </section>
    );
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <article className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Đề tài chờ duyệt</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{topics.length} đề tài</h3>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
          >
            Làm mới
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {topics.length ? (
            topics.map((topic) => {
              const isActive = selectedTopic?.id === topic.id;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onSelectTopic(topic.id)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                    isActive
                      ? 'border-sky-300 bg-sky-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{topic.title}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {topic.group.name} • {topic.group.researchAreaName}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${topicStatusBadgeClass(topic.status)}`}>
                      {topicStatusLabel(topic.status)}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Chưa có đề tài nào đang chờ bạn duyệt.
            </div>
          )}
        </div>
      </article>

      <article className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
        {selectedTopic ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Chi tiết đề tài</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{selectedTopic.title}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {selectedTopic.group.name} • nộp lúc{' '}
                  {selectedTopic.submittedAt
                    ? new Date(selectedTopic.submittedAt).toLocaleString('vi-VN')
                    : 'chưa cập nhật'}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${topicStatusBadgeClass(selectedTopic.status)}`}>
                {topicStatusLabel(selectedTopic.status)}
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mô tả vấn đề</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{selectedTopic.problemDescription}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Mục tiêu nghiên cứu</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{selectedTopic.researchGoals}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Phạm vi nghiên cứu</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{selectedTopic.researchScope || 'Chưa cập nhật'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Công nghệ sử dụng</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{selectedTopic.technologyStack || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-sm font-semibold text-slate-950">Thành viên nhóm</p>
              <div className="mt-3 space-y-2">
                {selectedTopic.group.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{member.fullName}</p>
                      <p className="text-xs text-slate-500">{member.studentCode}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{memberRoleLabel(member.role)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-950">Nhận xét giảng viên</span>
                <textarea
                  value={reviewNote}
                  onChange={(event) => onReviewNoteChange(event.target.value)}
                  rows={4}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-300"
                  placeholder="Nhập nhận xét để duyệt, yêu cầu chỉnh sửa hoặc từ chối."
                />
              </label>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <button
                  type="button"
                  onClick={onApproveTopic}
                  disabled={isSubmitting}
                  className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
                >
                  Duyệt đề tài
                </button>
                <button
                  type="button"
                  onClick={onRequestChangesTopic}
                  disabled={isSubmitting}
                  className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:bg-slate-300"
                >
                  Yêu cầu chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={onRejectTopic}
                  disabled={isSubmitting}
                  className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:bg-slate-300"
                >
                  Từ chối
                </button>
              </div>

              {selectedTopic.status === TOPIC_SUBMISSION_STATUS.DA_DUYET ? (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={onFinalizeTopic}
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:bg-slate-300"
                  >
                    Chốt đề tài
                  </button>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
            Chọn một đề tài trong danh sách bên trái để xem chi tiết và xử lý.
          </div>
        )}
      </article>
    </section>
  );
}

export default LecturerTopicReviewBoard;
