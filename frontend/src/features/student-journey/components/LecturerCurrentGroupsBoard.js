import React from 'react';
import {
  topicStatusLabel,
  topicStatusBadgeClass,
  groupStatusLabel,
  groupStatusBadgeClass,
} from '../../../shared/utils/status-labels';

function formatDate(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function LecturerCurrentGroupsBoard({ groups, isLoading, onRefresh }) {
  if (isLoading && groups.length === 0) {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b4a7a]" />
            <p className="mt-4 text-sm font-medium text-slate-500">Đang tải nhóm đang hướng dẫn...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Nhóm đang hướng dẫn</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tổng quan các nhóm nghiên cứu bạn đang hướng dẫn, tiến trình đề tài và thành viên.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
        >
          {isLoading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
            Bạn chưa nhận hướng dẫn nhóm nào. Xem danh sách nhóm ứng viên tại mục &ldquo;Chọn nhóm hướng dẫn&rdquo;.
          </div>
        ) : null}

        {groups.map((group) => (
          <article key={group.id} className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${groupStatusBadgeClass(group.status)}`}>
                    {groupStatusLabel(group.status)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {group.memberCount} thành viên
                  </span>
                </div>

                <h4 className="mt-3 text-xl font-semibold text-slate-950">{group.name}</h4>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>Mảng: {group.researchAreaName}</span>
                  <span>Trưởng nhóm: {group.leaderName}</span>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Thành viên</p>
                  <div className="mt-2 space-y-2">
                    {group.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b4a7a] text-[10px] font-semibold text-white">
                            {(member.fullName || '').split(' ').slice(-1).map((p) => p[0]).join('')}
                          </div>
                          <span className="text-sm font-medium text-slate-800">{member.fullName}</span>
                        </div>
                        <span className="text-xs text-slate-500">{member.studentCode}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-[320px]">
                {group.topic ? (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Đề tài</p>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${topicStatusBadgeClass(group.topic.status)}`}>
                        {topicStatusLabel(group.topic.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-snug text-slate-950">{group.topic.title}</p>

                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      {group.topic.submittedAt ? (
                        <p>Nộp: {formatDate(group.topic.submittedAt)}</p>
                      ) : null}
                      {group.topic.reviewedAt ? (
                        <p>Duyệt: {formatDate(group.topic.reviewedAt)}</p>
                      ) : null}
                      {group.topic.finalizedAt ? (
                        <p>Chốt: {formatDate(group.topic.finalizedAt)}</p>
                      ) : null}
                      {group.topic.revisionCount > 0 ? (
                        <p>Số lần chỉnh sửa: {group.topic.revisionCount}</p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                    Nhóm chưa nộp đề tài.
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LecturerCurrentGroupsBoard;
