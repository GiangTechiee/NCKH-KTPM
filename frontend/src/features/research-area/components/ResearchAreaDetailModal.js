import React from 'react';

function ResearchAreaDetailModal({ area, onClose }) {
  if (!area) {
    return null;
  }

  const hasSlotLimit = area.slotLimit !== null;
  const progress = hasSlotLimit ? Math.round((area.slotsFilled / area.slotLimit) * 100) : 0;
  const openDate = new Date(area.openAt).toLocaleDateString('vi-VN');
  const closeDate = new Date(area.closeAt).toLocaleDateString('vi-VN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg rounded-[28px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="rounded-t-[28px] bg-gradient-to-r from-[#0f3558] to-[#1f4e75] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                {area.shortCode}
              </span>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {area.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Đóng
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-slate-600">{area.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {area.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Sinh viên đăng ký
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {area.slotsFilled}
                {hasSlotLimit ? (
                  <span className="text-sm font-normal text-slate-400">
                    /{area.slotLimit}
                  </span>
                ) : null}
              </p>
              {hasSlotLimit ? (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[#0b4a7a]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Trạng thái
              </p>
              <p className="mt-2 text-xl font-semibold text-amber-600">
                {area.trend}
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Thời gian đăng ký
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              <span className="font-semibold">{openDate}</span>
              <span className="text-slate-400">→</span>
              <span className="font-semibold">{closeDate}</span>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResearchAreaDetailModal;
