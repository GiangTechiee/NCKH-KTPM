import React from 'react';

function ResearchAreaBoard({
  areas,
  closeAt,
  onAreaQueryChange,
  onRefresh,
  onSelectArea,
  onViewDetail,
  query,
  selectedAreaId,
}) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Danh sách mảng nghiên cứu</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Chọn một mảng nghiên cứu phù hợp với bạn. Sau khi xác nhận, bạn sẽ chuyển sang bước tạo nhóm nghiên cứu.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <label className="flex min-w-[260px] items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              className="w-full border-none bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Tìm theo tên mảng nghiên cứu..."
              value={query}
              onChange={(event) => onAreaQueryChange(event.target.value)}
            />
          </label>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span>Tất cả</span>
            <span>▾</span>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600"
          >
            Làm mới
          </button>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Hạn: {new Date(closeAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>

      {areas.length === 0 ? (
        <div className="mt-6 rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
          <p className="text-lg font-semibold text-slate-900">Chưa có mảng nghiên cứu đang mở</p>
          <p className="mt-2 text-sm text-slate-500">
            Hiện tại chưa có mảng nghiên cứu nào đang mở đăng ký. Vui lòng quay lại sau.
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {areas.map((area) => {
          const isSelected = area.id === selectedAreaId;
          const progress = Math.round((area.slotsFilled / area.slotLimit) * 100);

          return (
            <article
              key={area.id}
              className={`overflow-hidden rounded-[22px] border transition ${
                isSelected
                  ? 'border-[#0b4a7a] shadow-[0_8px_28px_rgba(11,74,122,0.12)]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`px-5 py-4 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#0b4a7a] to-[#215b8f] text-white'
                    : 'bg-gradient-to-r from-[#0f3558] to-[#1f4e75] text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    {area.shortCode}
                  </span>
                  {isSelected ? (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0b4a7a]">
                      Bạn đã chọn
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="p-5">
                <h4 className="text-xl font-semibold text-slate-950">{area.title}</h4>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{area.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {area.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
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
                  <div className="h-full rounded-full bg-[#0b4a7a]" style={{ width: `${progress}%` }} />
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectArea(area.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      isSelected ? 'bg-slate-100 text-slate-900' : 'bg-[#0b4a7a] text-white hover:bg-[#08395f]'
                    }`}
                  >
                    {isSelected ? 'Đã chọn' : 'Chọn mảng'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewDetail(area.id)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ResearchAreaBoard;
