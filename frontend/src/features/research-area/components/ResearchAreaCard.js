import React from 'react';

function ResearchAreaCard({ area, hasSelectedArea, isSelected, onSelect, onViewDetail }) {
  const progress = Math.round((area.slotsFilled / area.slotLimit) * 100);
  const cardStateLabel = isSelected ? 'Đã đăng ký' : hasSelectedArea ? 'Có thể chuyển' : 'Chưa đăng ký';

  return (
    <article
      className={`overflow-hidden rounded-[22px] border-2 transition ${
        isSelected
          ? 'scale-[1.01] border-emerald-600 bg-emerald-100 shadow-[0_18px_44px_rgba(16,185,129,0.24)] ring-4 ring-emerald-300'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {isSelected ? (
        <div className="absolute right-4 top-4 z-10 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg">
          Đang chọn
        </div>
      ) : null}
      <div
        className={`px-5 py-4 ${
          isSelected
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
            : 'bg-gradient-to-r from-[#0f3558] to-[#1f4e75] text-white'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
            {area.shortCode}
          </span>
          {isSelected ? (
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-600">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Đã đăng ký
            </span>
          ) : null}
        </div>
      </div>

      <div className="relative p-5">
        <h4 className="text-xl font-semibold text-slate-950">{area.title}</h4>
        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{area.description}</p>

        {isSelected ? (
          <p className="mt-3 text-sm font-semibold text-emerald-700">
            Bạn đã đăng ký mảng nghiên cứu này.
          </p>
        ) : null}

        <div
          className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            isSelected
              ? 'bg-emerald-600 text-white'
              : hasSelectedArea
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-100 text-slate-600'
          }`}
        >
          {cardStateLabel}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {area.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-xs ${
                isSelected
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sinh viên</p>
            <p className="mt-2 font-semibold text-slate-900">
              {area.slotsFilled}/{area.slotLimit}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Số nhóm</p>
            <p className="mt-2 font-semibold text-slate-900">
              {Math.max(1, Math.floor(area.slotsFilled / 3))}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Trạng thái</p>
            <p className="mt-2 font-semibold text-amber-600">{area.trend}</p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div 
            className={`h-full rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-[#0b4a7a]'}`}
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => onSelect(area.id)}
            disabled={isSelected}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              isSelected
                ? 'cursor-not-allowed border border-emerald-300 bg-emerald-200 text-emerald-800 opacity-100'
                : 'bg-[#0b4a7a] text-white hover:bg-[#08395f]'
            }`}
            aria-disabled={isSelected}
          >
            {isSelected ? 'Đã đăng ký' : hasSelectedArea ? 'Chuyển sang mảng này' : 'Chọn mảng'}
          </button>
          <button
            type="button"
            onClick={() => onViewDetail(area.id)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </article>
  );
}

export default ResearchAreaCard;
