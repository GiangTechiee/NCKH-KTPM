import React from 'react';

function ChangeAreaConfirmationModal({
  currentArea,
  errorMessage,
  newArea,
  isSubmitting,
  onCancel,
  onConfirm,
}) {
  if (!currentArea || !newArea) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 className="mt-5 text-center text-2xl font-semibold tracking-tight text-slate-950">
          Xác nhận chuyển mảng nghiên cứu
        </h3>

        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              Mảng hiện tại
            </p>
            <p className="mt-2 font-semibold text-slate-950">{currentArea.title}</p>
            <p className="mt-1 text-xs text-slate-600">{currentArea.shortCode}</p>
          </div>

          <div className="flex justify-center">
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Mảng mới
            </p>
            <p className="mt-2 font-semibold text-slate-950">{newArea.title}</p>
            <p className="mt-1 text-xs text-slate-600">{newArea.shortCode}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3">
          <p className="text-sm leading-6 text-amber-900">
            <span className="font-semibold">Lưu ý:</span> Bạn sẽ chuyển từ mảng <span className="font-semibold">{currentArea.title}</span> sang mảng <span className="font-semibold">{newArea.title}</span>. Hệ thống sẽ hủy đăng ký hiện tại và ghi nhận đăng ký mới nếu vẫn còn trong thời gian đăng ký.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm font-medium text-rose-700">{errorMessage}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {errorMessage ? 'Đóng' : 'Hủy'}
          </button>
          {!errorMessage && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận chuyển'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangeAreaConfirmationModal;
