import React from 'react';
import {
  groupStatusBadgeClass,
  groupStatusLabel,
  memberRoleLabel,
} from '../../../shared/utils/status-labels';

function LecturerGroupDetailModal({ group, isSubmitting, onAssign, onClose }) {
  if (!group) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#0b4a7a]">Nhóm ứng viên</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{group.name}</h3>
            <p className="mt-2 text-sm text-slate-500">
              Lĩnh vực: {group.researchAreaName}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-500">
            Đóng
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {group.memberCount}/{3} thành viên
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${groupStatusBadgeClass(group.status)}`}>
            {groupStatusLabel(group.status)}
          </span>
          {group.isSpecializationMatch ? (
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
              Phù hợp chuyên môn
            </span>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-950">Trưởng nhóm</p>
          <p className="mt-2 text-sm text-slate-700">
            {group.leaderName} ({group.leaderStudentCode})
          </p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-950">Thành viên nhóm</p>
          <div className="mt-3 space-y-3">
            {group.members.map((member) => (
              <div key={member.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-950">{member.fullName}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {member.studentCode} • {memberRoleLabel(member.role)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => onAssign(group.id)}
            disabled={isSubmitting}
            className="rounded-2xl bg-[#0b4a7a] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? 'Đang xác nhận...' : 'Nhận hướng dẫn nhóm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LecturerGroupDetailModal;
