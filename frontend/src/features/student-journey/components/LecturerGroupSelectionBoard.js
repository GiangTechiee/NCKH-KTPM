import React from 'react';

function LecturerGroupSelectionBoard({ groups, isLoading, onRefresh, onSelectGroup }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Chọn nhóm hướng dẫn</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Giảng viên xem danh sách nhóm phù hợp, kiểm tra thành viên và nhận hướng dẫn trực tiếp.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600"
        >
          {isLoading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
            Không có nhóm ứng viên phù hợp ở thời điểm hiện tại.
          </div>
        ) : null}

        {groups.map((group) => (
          <article key={group.id} className="rounded-[22px] border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                    Chưa có giảng viên hướng dẫn
                  </span>
                  {group.isSpecializationMatch ? (
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                      Phù hợp chuyên môn cao
                    </span>
                  ) : null}
                </div>
                <h4 className="mt-3 text-xl font-semibold text-slate-950">{group.name}</h4>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>Mảng: {group.researchAreaName}</span>
                  <span>Trưởng nhóm: {group.leaderName}</span>
                  <span>{group.memberCount} thành viên</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onSelectGroup(group.id)}
                  className="rounded-xl bg-[#0b4a7a] px-4 py-2 text-sm font-semibold text-white"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LecturerGroupSelectionBoard;
