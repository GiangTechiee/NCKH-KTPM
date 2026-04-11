import React from 'react';

function RegistrationWindowPanel({ daysLeft, openAt, closeAt }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Thời gian đăng ký</p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{new Date(openAt).toLocaleDateString('vi-VN')}</p>
          <p className="text-sm text-slate-500">{new Date(closeAt).toLocaleDateString('vi-VN')}</p>
        </div>
        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Còn {daysLeft} ngày
        </div>
      </div>
    </div>
  );
}

export default RegistrationWindowPanel;
