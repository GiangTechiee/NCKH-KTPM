import React, { useState } from 'react';

const COLOR_MAP = {
  amber: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
  },
  emerald: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
  },
  blue: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  rose: {
    border: 'border-l-rose-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-700',
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-600',
  },
  slate: {
    border: 'border-l-slate-400',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600',
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-500',
  },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function StepCircle({ state }) {
  if (state === 'completed') {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b4a7a] text-white shadow-md shadow-[#0b4a7a]/20">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (state === 'active') {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b4a7a] text-white shadow-lg shadow-[#0b4a7a]/30 ring-4 ring-[#0b4a7a]/10">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-400">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    </div>
  );
}

function CompactStepRail({ steps }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center" style={{ minWidth: 56 }}>
            <StepCircle state={step.state} />
            <p className={`mt-1 text-center text-[9px] font-semibold uppercase leading-tight tracking-wide ${
              step.state === 'completed' || step.state === 'active' ? 'text-[#0b4a7a]' : 'text-slate-400'
            }`}>
              {step.label}
            </p>
          </div>
          {index < steps.length - 1 ? (
            <div className="mt-[-14px] flex-1 px-0.5">
              <div className={`h-0.5 w-full rounded ${
                step.state === 'completed' ? 'bg-[#0b4a7a]' : 'bg-slate-200'
              }`} />
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

function GroupProgressCard({ group, isExpanded, onToggle }) {
  const colorKey = group.detail.groupDisplay?.color || 'slate';
  const c = COLOR_MAP[colorKey] || COLOR_MAP.slate;

  return (
    <article className={`rounded-[22px] border bg-white shadow-sm transition-shadow hover:shadow-md border-l-4 ${c.border}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-4 px-5 py-4 text-left"
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.iconBg} mt-0.5`}>
          <svg className={`h-5 w-5 ${c.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold text-slate-950">{group.groupName}</h4>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${c.badge}`}>
              {group.detail.groupDisplay?.text || group.groupStatus}
            </span>
            {group.detail.topicDisplay ? (
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${(COLOR_MAP[group.detail.topicDisplay.color] || COLOR_MAP.slate).badge}`}>
                {group.detail.topicDisplay.text}
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{group.memberCount} thành viên</span>
            {group.researchAreaName ? <span>Mảng: {group.researchAreaName}</span> : null}
            {group.topicTitle ? <span>Đề tài: {group.topicTitle}</span> : null}
          </div>
          <p className="mt-1.5 text-sm font-medium text-slate-700">{group.detail.processingText}</p>
        </div>

        <svg
          className={`mt-2 h-5 w-5 shrink-0 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isExpanded ? (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">
          <CompactStepRail steps={group.steps} />

          <div className="flex items-start gap-3 rounded-xl border-l-4 border-l-blue-500 bg-blue-50 px-4 py-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-blue-900">
                Người cần xử lý tiếp: <span className="font-bold">{group.detail.handlerLabel || '—'}</span>
                {group.detail.editDeadline ? (
                  <span className="ml-2 text-blue-700">
                    Hạn: <span className="font-bold">{formatDate(group.detail.editDeadline)}</span>
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          {group.detail.lecturerComment ? (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Nhận xét giảng viên</p>
              <p className="mt-1 text-sm text-slate-700">"{group.detail.lecturerComment}"</p>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Giai đoạn</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{group.currentStepIndex + 1}/{group.steps.length}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Thành viên</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{group.memberCount}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Lần chỉnh sửa</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{group.detail.revisionCount}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Hạn cuối</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{group.detail.editDeadline ? formatDate(group.detail.editDeadline) : '—'}</p>
            </div>
          </div>

          {group.members.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Thành viên nhóm</p>
              <div className="mt-2 space-y-2">
                {group.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b4a7a] text-[9px] font-semibold text-white">
                        {(member.fullName || '').split(' ').slice(-1).map((p) => p[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{member.fullName}</span>
                      {member.role === 'TRUONG_NHOM' ? (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">Trưởng nhóm</span>
                      ) : null}
                    </div>
                    <span className="text-xs text-slate-500">{member.studentCode}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {group.milestones.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Mốc quan trọng</p>
              <div className="mt-2 space-y-2">
                {group.milestones.map((m, i) => {
                  const mc = COLOR_MAP[m.color] || COLOR_MAP.blue;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`h-2 w-2 shrink-0 rounded-full ${mc.dot}`} />
                      <span className="text-xs text-slate-600">{m.label}</span>
                      <span className="ml-auto text-xs tabular-nums text-slate-400">{formatDate(m.date)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {group.timelineEvents.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">Lịch sử</p>
              <div className="relative ml-1">
                <div className="absolute left-[3px] top-1 bottom-1 w-px bg-slate-200" />
                <div className="space-y-3">
                  {group.timelineEvents.map((event) => (
                    <div key={event.id} className="relative flex gap-3 pl-5">
                      <div className={`absolute left-0 top-1 h-[7px] w-[7px] rounded-full border-2 ${
                        event.isActive
                          ? 'border-[#0b4a7a] bg-[#0b4a7a]'
                          : 'border-slate-300 bg-white'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-700">{event.title}</p>
                        {event.description ? (
                          <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{event.description}</p>
                        ) : null}
                      </div>
                      {event.timestamp ? (
                        <p className="shrink-0 text-[11px] tabular-nums text-slate-400">
                          {formatDateTime(event.timestamp)}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function LecturerProgressBoard({ groupProgressList, isLoading, onRefresh }) {
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  function handleToggle(groupId) {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  }

  if (isLoading && groupProgressList.length === 0) {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b4a7a]" />
            <p className="mt-4 text-sm font-medium text-slate-500">Đang tải tiến trình nhóm...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Tiến trình các nhóm hướng dẫn</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Theo dõi chi tiết tiến trình đề tài của từng nhóm bạn đang hướng dẫn.
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
        {groupProgressList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-950">Chưa có nhóm nào</p>
            <p className="mt-1.5 text-sm text-slate-500">
              Bạn chưa nhận hướng dẫn nhóm nào. Xem danh sách nhóm ứng viên tại mục "Chọn nhóm hướng dẫn".
            </p>
          </div>
        ) : null}

        {groupProgressList.map((group) => (
          <GroupProgressCard
            key={group.groupId}
            group={group}
            isExpanded={expandedGroupId === group.groupId}
            onToggle={() => handleToggle(group.groupId)}
          />
        ))}
      </div>
    </section>
  );
}

export default LecturerProgressBoard;
