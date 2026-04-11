import React from 'react';
import ResearchAreaCard from './ResearchAreaCard';
import SelectedAreaBanner from './SelectedAreaBanner';

function ResearchAreaBoard({
  areas,
  canCancelRegistration,
  closeAt,
  onAreaQueryChange,
  onCancelRegistration,
  onRefresh,
  onSelectArea,
  onViewDetail,
  onViewSelectedDetail,
  query,
  selectedArea,
  selectedAreaId,
}) {
  const activeSelectedAreaId = selectedArea?.id || selectedAreaId;

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Danh sách mảng nghiên cứu</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Chọn một mảng nghiên cứu phù hợp với bạn. Bạn có thể chuyển đổi hoặc hủy đăng ký miễn là vẫn còn trong thời gian đăng ký.
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

          <button
            type="button"
            onClick={onRefresh}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Làm mới
          </button>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Hạn: {new Date(closeAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>

      {selectedArea ? (
        <div className="mt-5">
            <SelectedAreaBanner
              canCancel={canCancelRegistration}
              selectedArea={selectedArea}
              onViewDetail={onViewSelectedDetail}
              onCancel={onCancelRegistration}
          />
        </div>
      ) : null}

      {areas.length === 0 ? (
        <div className="mt-6 rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
          <p className="text-lg font-semibold text-slate-900">Chưa có mảng nghiên cứu đang mở</p>
          <p className="mt-2 text-sm text-slate-500">
            Hiện tại chưa có mảng nghiên cứu nào đang mở đăng ký. Vui lòng quay lại sau.
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {areas.map((area) => (
            <ResearchAreaCard
              key={area.id}
              area={area}
              hasSelectedArea={Boolean(activeSelectedAreaId)}
              isSelected={area.id === activeSelectedAreaId}
              onSelect={onSelectArea}
              onViewDetail={onViewDetail}
          />
        ))}
      </div>
    </section>
  );
}

export default ResearchAreaBoard;
