import React from 'react';

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

/* ───────────────── Status Banner ───────────────── */
function StatusBanner({ detail }) {
  const colorKey = detail.groupDisplay?.color || 'slate';
  const c = COLOR_MAP[colorKey] || COLOR_MAP.slate;

  return (
    <div className={`flex items-start gap-4 rounded-2xl border bg-white px-5 py-4 shadow-sm border-l-4 ${c.border}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.iconBg}`}>
        <svg className={`h-5 w-5 ${c.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Trạng thái hiện tại</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.badge}`}>
            {detail.groupDisplay?.text || 'Chưa xác định'}
          </span>
          {detail.topicDisplay ? (
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${(COLOR_MAP[detail.topicDisplay.color] || COLOR_MAP.slate).badge}`}>
              {detail.topicDisplay.text}
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 text-sm font-semibold text-slate-800">{detail.processingText}</p>
        {detail.editDeadline ? (
          <p className="mt-0.5 text-xs text-slate-500">
            Hạn xử lý tiếp theo: <span className="font-semibold text-slate-700">{formatDate(detail.editDeadline)}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ───────────────── Group Meta Row ───────────────── */
function GroupMetaRow({ groupData, topicOverview }) {
  const items = [
    { label: 'Tên nhóm', value: groupData?.name || 'Chưa có nhóm' },
    { label: 'Mảng nghiên cứu', value: groupData?.researchAreaName || topicOverview?.group?.researchAreaName || '—' },
    { label: 'Giảng viên hướng dẫn', value: groupData?.lecturerName || topicOverview?.group?.lecturerName || 'Chưa có' },
    { label: 'Đề tài', value: topicOverview?.topic?.title || 'Chưa chọn đề tài' },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-white px-4 py-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-800" title={item.value}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ───────────────── Step Rail ───────────────── */
function StepCircle({ state }) {
  if (state === 'completed') {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b4a7a] text-white shadow-md shadow-[#0b4a7a]/20">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (state === 'active') {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b4a7a] text-white shadow-lg shadow-[#0b4a7a]/30 ring-4 ring-[#0b4a7a]/10">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    </div>
  );
}

function StepRail({ steps }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center" style={{ width: 90 }}>
              <StepCircle state={step.state} />
              <p className={`mt-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-wide ${
                step.state === 'completed' ? 'text-[#0b4a7a]'
                : step.state === 'active' ? 'text-[#0b4a7a]'
                : 'text-slate-400'
              }`}>
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 ? (
              <div className="mt-4 flex-1 px-1">
                <div className={`h-0.5 w-full rounded ${
                  step.state === 'completed' ? 'bg-[#0b4a7a]' : 'bg-slate-200'
                }`} />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ───────────────── Step Info Bar ───────────────── */
function StepInfoBar({ detail }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border-l-4 border-l-blue-500 bg-blue-50 px-4 py-3.5">
      <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
      <div>
        <p className="text-sm font-semibold text-blue-900">Thông tin bước hiện tại</p>
        <p className="mt-0.5 text-xs text-blue-800">
          Người cần xử lý tiếp: <span className="font-semibold">{detail.handlerLabel}</span>
          {detail.editDeadline ? (
            <span>. Hạn xử lý dự kiến: <span className="font-semibold">{formatDate(detail.editDeadline)}</span></span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

/* ───────────────── Current Step Detail Card ───────────────── */
function CurrentStepDetail({ steps, currentStepIndex, detail, onNavigate }) {
  const currentStep = steps[currentStepIndex];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Chi tiết bước hiện tại</h3>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
          Giai đoạn {currentStepIndex + 1}/{steps.length}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">{currentStep?.label || 'Bước hiện tại'}</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{currentStep?.description || ''}</p>
            {detail.lecturerComment ? (
              <p className="mt-2 text-xs leading-5 text-slate-600">
                <span className="font-semibold">Nhận xét của giảng viên:</span> "{detail.lecturerComment}"
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Người xử lý</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{detail.handlerLabel}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Hạn cuối</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{detail.editDeadline ? formatDate(detail.editDeadline) : 'Chưa xác định'}</p>
        </div>
      </div>

      {detail.actionLabel && onNavigate ? (
        <button
          type="button"
          onClick={() => onNavigate(detail.actionNav)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b4a7a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#093d66]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          {detail.actionLabel}
        </button>
      ) : null}
    </div>
  );
}

/* ───────────────── Processing Status + Milestones ───────────────── */
function StatusAndMilestones({ detail, milestones }) {
  const colorKey = detail.groupDisplay?.color || 'slate';
  const c = COLOR_MAP[colorKey] || COLOR_MAP.slate;

  return (
    <div className="space-y-4">
      {/* Processing Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.iconBg}`}>
            <svg className={`h-5 w-5 ${c.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Trạng thái xử lý</p>
            <p className={`mt-0.5 text-xs font-medium ${c.text}`}>{detail.processingText}</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      {milestones.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
            <p className="text-sm font-semibold text-slate-800">Mốc thời gian quan trọng</p>
          </div>
          <div className="mt-3 space-y-3">
            {milestones.map((m, i) => {
              const mc = COLOR_MAP[m.color] || COLOR_MAP.blue;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${mc.dot}`} />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">{m.label}</p>
                    <p className="text-sm font-semibold text-slate-800">{formatDate(m.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ───────────────── Timeline ───────────────── */
function Timeline({ events }) {
  if (events.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-slate-900">Lịch sử tiến trình</h3>
      </div>

      <div className="relative mt-5 ml-3">
        {/* Vertical line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />

        <div className="space-y-5">
          {events.map((event) => (
            <div key={event.id} className="relative flex gap-4 pl-6">
              <div className={`absolute left-0 top-1.5 h-[10px] w-[10px] rounded-full border-2 ${
                event.isActive
                  ? 'border-[#0b4a7a] bg-[#0b4a7a]'
                  : 'border-slate-300 bg-white'
              }`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">{event.description}</p>
              </div>
              {event.timestamp ? (
                <p className="shrink-0 text-xs tabular-nums text-slate-400">
                  {formatDateTime(event.timestamp)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────── Footer Note ───────────────── */
function FooterNote() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
      <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <div>
        <p className="text-sm font-semibold text-amber-900">Lưu ý về quy trình</p>
        <p className="mt-0.5 text-xs leading-5 text-amber-800">
          Tiến trình đề tài sẽ được cập nhật tự động ngay khi có thao tác từ phía Sinh viên hoặc Giảng viên.
          Sinh viên cần thường xuyên kiểm tra thông báo để không bỏ lỡ các mốc thời gian quan trọng.
        </p>
      </div>
    </div>
  );
}

/* ───────────────── No Data State ───────────────── */
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-800">Chưa có dữ liệu tiến trình</p>
      <p className="mt-1.5 text-sm text-slate-500">
        Bạn cần đăng ký mảng nghiên cứu và hình thành nhóm trước khi có thể xem tiến trình đề tài.
      </p>
    </div>
  );
}

/* ───────────────── Main Board ───────────────── */
function StudentProgressBoard({ groupData, topicOverview, steps, currentStepIndex, detail, milestones, timelineEvents, onNavigate }) {
  const hasGroup = Boolean(groupData);

  if (!hasGroup) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-5">
      {/* Status Banner */}
      <StatusBanner detail={detail} />

      {/* Group Meta Row */}
      <GroupMetaRow groupData={groupData} topicOverview={topicOverview} />

      {/* Step Rail */}
      <StepRail steps={steps} />

      {/* Step Info Bar */}
      <StepInfoBar detail={detail} />

      {/* Detail + Status split */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <CurrentStepDetail
          steps={steps}
          currentStepIndex={currentStepIndex}
          detail={detail}
          onNavigate={onNavigate}
        />
        <StatusAndMilestones detail={detail} milestones={milestones} />
      </div>

      {/* Timeline */}
      <Timeline events={timelineEvents} />

      {/* Footer Note */}
      <FooterNote />
    </div>
  );
}

export default StudentProgressBoard;
