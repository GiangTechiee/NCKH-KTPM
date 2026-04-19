import React from 'react';

function CancelAreaConfirmationModal({
  area,
  errorMessage,
  isSubmitting,
  onCancel,
  onConfirm,
}) {
  if (!area) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-[28px] bg-white p-7 text-center shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
          Xác nhận hủy đăng ký
        </h3>

        <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-4 text-left">
          <p className="text-sm leading-6 text-slate-700">
            Bạn đang hủy đăng ký mảng nghiên cứu:
          </p>
          <p className="mt-3 font-semibold text-slate-950">
            {area.title} <span className="text-sm font-normal text-slate-500">({area.shortCode})</span>
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3">
          <p className="text-sm leading-6 text-rose-900">
            <span className="font-semibold">Lưu ý:</span> Sau khi hủy, bạn có thể đăng ký lại mảng khác 
            miễn là còn trong thời gian đăng ký.
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
            {errorMessage ? 'Đóng' : 'Không hủy'}
          </button>
          {!errorMessage && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? 'Đang hủy...' : 'Xác nhận hủy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CancelAreaConfirmationModal;
