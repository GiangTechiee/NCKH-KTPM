import React from 'react';

function SelectedAreaBanner({ canCancel, selectedArea, onViewDetail, onCancel }) {
  if (!selectedArea) return null;

  return (
    <div className="mb-5 overflow-hidden rounded-[24px] border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 shadow-sm">
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
                Đã đăng ký
              </p>
              <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                {selectedArea.shortCode}
              </span>
            </div>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">{selectedArea.title}</h3>
            <p className="mt-1 text-sm text-slate-600">
              Bạn đã đăng ký mảng nghiên cứu này. Bạn có thể xem chi tiết hoặc chuyển sang mảng khác.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onViewDetail}
            className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Xem mảng đã chọn
          </button>
          {canCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy đăng ký
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SelectedAreaBanner;
