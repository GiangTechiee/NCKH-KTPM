import React from 'react';

export function ResearchAreaLoadingState() {
  return (
    <div className="mt-6 flex items-center justify-center py-12">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b4a7a]" />
        <p className="mt-4 text-sm text-slate-500">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}

export function ResearchAreaErrorState({ errorMessage, onRetry }) {
  return (
    <div className="mt-6 rounded-2xl border border-rose-200 bg-white px-6 py-8 text-center shadow-sm">
      <p className="text-lg font-semibold text-slate-950">Không thể tải dữ liệu</p>
      <p className="mt-2 text-sm text-rose-600">{errorMessage || 'Vui lòng kiểm tra kết nối và thử lại.'}</p>
      <button type="button" onClick={onRetry} className="mt-4 rounded-xl bg-[#0b4a7a] px-5 py-2 text-sm font-semibold text-white">
        Thử lại
      </button>
    </div>
  );
}
