import React from 'react';

function ResearchAreaOverviewCards({ areaCount, closeAt, selectedAreaTitle }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <article className="rounded-2xl border border-l-4 border-l-[#0b4a7a] bg-white px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Mảng đang mở</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{areaCount}</p>
        <p className="mt-2 text-sm text-slate-500">Số mảng có thể đăng ký hiện tại.</p>
      </article>

      <article className="rounded-2xl border border-l-4 border-l-slate-300 bg-white px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Trạng thái</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{selectedAreaTitle}</p>
        <p className="mt-2 text-sm text-slate-500">Mỗi sinh viên chỉ được chọn một mảng.</p>
      </article>

      <article className="rounded-2xl border border-l-4 border-l-rose-300 bg-white px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Hạn đăng ký</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {new Date(closeAt).toLocaleDateString('vi-VN')}
        </p>
        <p className="mt-2 text-sm text-slate-500">Sau khi chọn, tiến sang nhóm nghiên cứu.</p>
      </article>
    </div>
  );
}

export default ResearchAreaOverviewCards;
