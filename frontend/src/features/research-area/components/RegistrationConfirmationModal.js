import React from 'react';

function RegistrationConfirmationModal({
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]"
      onClick={(e) => {
        // Prevent closing when clicking backdrop during submission
        if (e.target === e.currentTarget && !isSubmitting) {
          onCancel();
        }
      }}
    >
      <div 
        className="w-full max-w-md rounded-[28px] bg-white p-7 text-center shadow-[0_30px_80px_rgba(15,23,42,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f2ff] text-[#0b4a7a]">
          <div className="h-7 w-7 rounded-lg border-2 border-current" />
        </div>

        <h3 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Xác nhận đăng ký mảng nghiên cứu
        </h3>

        <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-4 text-left">
          <p className="text-sm leading-6 text-slate-700">
            Bạn chỉ được đăng ký một mảng nghiên cứu trong đợt hiện tại.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Bạn có chắc chắn muốn chọn mảng <span className="font-semibold text-[#0b4a7a]">"{area.title}"</span> không?
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            disabled={isSubmitting}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {errorMessage ? 'Đóng' : 'Hủy'}
          </button>
          {!errorMessage && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isSubmitting) {
                  onConfirm();
                }
              }}
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-[#0b4a7a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#08395f] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? 'Đang đăng ký...' : 'Xác nhận đăng ký'}
            </button>
          )}
        </div>

        {!errorMessage && (
          <p className="mt-4 text-xs leading-5 text-slate-400">
            Hệ thống sẽ ghi nhận kết quả và không thể hoàn tác sau khi xác nhận.
          </p>
        )}
      </div>
    </div>
  );
}

export default RegistrationConfirmationModal;
