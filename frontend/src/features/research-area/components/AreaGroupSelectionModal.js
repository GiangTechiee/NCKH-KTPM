import React from 'react';

function AreaGroupSelectionModal({
  data,
  mode,
  selectedGroupId,
  newGroupName,
  isSubmitting,
  errorMessage,
  onModeChange,
  onSelectedGroupIdChange,
  onNewGroupNameChange,
  onCancel,
  onConfirm,
}) {
  if (!data) {
    return null;
  }

  const { area, nhomHienCo = [], soLuongNhomHienTai, gioiHanSoNhom, coTheTaoNhomMoi } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-7 shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
          Chọn nhóm cho mảng {area.title}
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Hiện có {soLuongNhomHienTai}/{gioiHanSoNhom} nhóm trong mảng này.
        </p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => onModeChange('join')}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
              mode === 'join' ? 'bg-[#0b4a7a] text-white' : 'border border-slate-200 text-slate-700'
            }`}
          >
            Tham gia nhóm có sẵn
          </button>

          <button
            type="button"
            onClick={() => onModeChange('create')}
            disabled={!coTheTaoNhomMoi}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
              mode === 'create' ? 'bg-emerald-600 text-white' : 'border border-slate-200 text-slate-700'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Tạo nhóm mới
          </button>
        </div>

        {mode === 'join' ? (
          <div className="mt-5 space-y-3">
            {nhomHienCo.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                Chưa có nhóm nào trong mảng này.
              </div>
            ) : (
              nhomHienCo.map((group) => (
                <label
                  key={group.id}
                  className={`block rounded-2xl border px-4 py-4 ${
                    selectedGroupId === String(group.id)
                      ? 'border-[#0b4a7a] bg-[#eef6ff]'
                      : 'border-slate-200 bg-white'
                  } ${!group.coTheThamGia ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="selected-group"
                      value={group.id}
                      checked={selectedGroupId === String(group.id)}
                      disabled={!group.coTheThamGia}
                      onChange={(e) => onSelectedGroupIdChange(e.target.value)}
                    />
                    <div>
                      <p className="font-semibold text-slate-950">{group.tenNhom}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Trưởng nhóm: {group.truongNhom?.hoTen || 'Chưa có'} • {group.soLuongThanhVien}/3 thành viên
                      </p>
                      {!group.coTheThamGia ? (
                        <p className="mt-2 text-sm font-medium text-rose-600">Nhóm này đã đủ thành viên.</p>
                      ) : null}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        ) : (
          <div className="mt-5">
            {!coTheTaoNhomMoi ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                Mảng này đã đạt tối đa {gioiHanSoNhom} nhóm, bạn không thể tạo nhóm mới nữa.
              </div>
            ) : (
              <input
                value={newGroupName}
                onChange={(e) => onNewGroupNameChange(e.target.value)}
                placeholder="Nhập tên nhóm mới"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
            )}
          </div>
        )}

        {errorMessage ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm font-medium text-rose-700">{errorMessage}</p>
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 rounded-2xl bg-[#0b4a7a] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AreaGroupSelectionModal;