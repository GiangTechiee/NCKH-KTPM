import React, { useState } from 'react';
import {
  groupStatusBadgeClass,
  groupStatusLabel,
  invitationStatusBadgeClass,
  invitationStatusLabel,
  memberJoinStatusBadgeClass,
  memberJoinStatusLabel,
  memberRoleLabel,
} from '../../../shared/utils/status-labels';

const TRUONG_NHOM_DISPLAY_LABEL = 'Trưởng nhóm';

function MemberAvatar({ fullName }) {
  const initials = fullName
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('');

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f1fb] text-sm font-semibold text-[#0b4a7a]">
      {initials}
    </div>
  );
}

function InviteStudentDropdown({ studentSuggestions, value, onChange, onInvite, isInviting }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = studentSuggestions.filter((student) => {
    const searchable = `${student.studentCode} ${student.fullName} ${student.className || student.reason || ''}`.toLowerCase();
    return searchable.includes(query.toLowerCase());
  });

  function handleSelect(studentCode) {
    onChange(studentCode);
    setQuery('');
    setIsOpen(false);
  }

  function handleInputChange(event) {
    setQuery(event.target.value);
    onChange(event.target.value);
    setIsOpen(true);
  }

  function handleInputFocus() {
    setIsOpen(true);
  }

  function handleInputBlur() {
    setTimeout(() => setIsOpen(false), 150);
  }

  const selectedStudent = studentSuggestions.find((s) => s.studentCode === value);
  const inputDisplayValue = query || (selectedStudent ? `${selectedStudent.studentCode} — ${selectedStudent.fullName}` : value);

  return (
    <div className="relative min-w-0 flex-1">
      <input
        value={inputDisplayValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Tìm theo MSSV, tên hoặc lớp để mời..."
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
      />
      {isOpen && filtered.length > 0 ? (
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
          {filtered.map((student) => (
            <li
              key={student.studentCode}
              onMouseDown={() => handleSelect(student.studentCode)}
              className="cursor-pointer px-4 py-3 hover:bg-slate-50"
            >
              <p className="text-sm font-semibold text-slate-950">
                {student.studentCode} — {student.fullName}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{student.className || student.reason || 'Sinh viên cùng mảng'}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ResearchGroupBoard({
  createGroupName,
  currentStudentCode,
  group,
  inviteStudentCode,
  isCreating,
  isDeleting,
  isInviting,
  isLeaving,
  onCreateGroup,
  onCreateGroupNameChange,
  onDeleteGroup,
  onInvite,
  onInviteStudentCodeChange,
  onLeaveGroup,
  studentSuggestions,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  if (!group) {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-6">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Bạn chưa có nhóm nghiên cứu</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sau khi đã đăng ký mảng nghiên cứu, bạn có thể tạo nhóm để bắt đầu mời thành viên.
          </p>

          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <input
              value={createGroupName}
              onChange={(event) => onCreateGroupNameChange(event.target.value)}
              placeholder="Nhập tên nhóm nghiên cứu"
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none"
            />
            <button
              type="button"
              onClick={onCreateGroup}
              disabled={isCreating}
              className="rounded-2xl bg-[#0b4a7a] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isCreating ? 'Đang tạo...' : 'Tạo nhóm'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const currentMember = group.members.find((m) => m.studentCode === currentStudentCode);
  const isLeader = currentMember?.roleLabel === TRUONG_NHOM_DISPLAY_LABEL;
  const remainingSlots = group.maxMembers - group.members.length;
  const fillPercent = Math.round((group.members.length / group.maxMembers) * 100);

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 border-b border-slate-200 pb-5 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Mảng đã đăng ký</p>
          <p className="mt-3 text-lg font-semibold text-slate-950">{group.researchAreaName}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Trạng thái nhóm</p>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${groupStatusBadgeClass(group.status)}`}>
            {groupStatusLabel(group.status)}
          </span>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Số thành viên</p>
          <p className="mt-3 text-lg font-semibold text-slate-950">
            {group.members.length}/{group.maxMembers}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-[#0b4a7a]" style={{ width: `${fillPercent}%` }} />
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Giảng viên</p>
          <p className="mt-3 text-lg font-semibold text-slate-950">{group.lecturerName}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <article className="rounded-[22px] border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-950">Nhóm của tôi ({group.name})</p>
              <p className="mt-1 text-sm text-slate-500">Quản lý thành viên và mời thêm sinh viên cùng mảng.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#edf5ff] px-4 py-2 text-sm font-medium text-[#0b4a7a]">
                Còn trống {remainingSlots} vị trí
              </div>
              {isLeader ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa nhóm'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(true)}
                  disabled={isLeaving}
                  className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLeaving ? 'Đang rời...' : 'Rời nhóm'}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4 px-5 py-5">
            {group.members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <MemberAvatar fullName={member.fullName} />
                  <div>
                    <p className="font-semibold text-slate-950">{member.fullName}</p>
                    <p className="mt-1 text-sm text-slate-500">{member.studentCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {memberRoleLabel(member.roleLabel)}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${memberJoinStatusBadgeClass(member.status)}`}>
                    {memberJoinStatusLabel(member.status)}
                  </span>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
              {remainingSlots > 0 ? `Còn trống ${remainingSlots} vị trí để hoàn tất nhóm.` : 'Nhóm đã đủ thành viên.'}
            </div>

            {isLeader ? (
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row">
                <InviteStudentDropdown
                  studentSuggestions={studentSuggestions}
                  value={inviteStudentCode}
                  onChange={onInviteStudentCodeChange}
                  onInvite={onInvite}
                  isInviting={isInviting}
                />
                <button
                  type="button"
                  onClick={onInvite}
                  disabled={isInviting}
                  className="rounded-2xl bg-[#0b4a7a] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isInviting ? 'Đang gửi...' : 'Mời thêm thành viên'}
                </button>
              </div>
            ) : null}
          </div>
        </article>

        <article className="rounded-[22px] border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="text-sm font-semibold text-slate-950">Lời mời đã gửi</p>
            <p className="mt-1 text-sm text-slate-500">Theo dõi các lời mời đang chờ phản hồi.</p>
          </div>

          <div className="space-y-4 px-5 py-5">
            {group.sentInvitations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                Chưa có lời mời nào được gửi.
              </div>
            ) : null}

            {group.sentInvitations.map((invitation) => (
              <div key={invitation.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{invitation.targetStudentName}</p>
                <p className="mt-1 text-sm text-slate-500">{invitation.targetStudentCode}</p>
                <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${invitationStatusBadgeClass(invitation.status)}`}>
                  {invitationStatusLabel(invitation.status)}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl">
            <h4 className="text-lg font-semibold text-slate-950">Xác nhận xóa nhóm</h4>
            <p className="mt-2 text-sm text-slate-600">
              Bạn có chắc muốn xóa nhóm <strong>{group.name}</strong>? Tất cả thành viên và lời mời sẽ bị hủy. Hành động này không thể hoàn tác.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteGroup();
                }}
                className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Xóa nhóm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showLeaveConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl">
            <h4 className="text-lg font-semibold text-slate-950">Xác nhận rời nhóm</h4>
            <p className="mt-2 text-sm text-slate-600">
              Bạn có chắc muốn rời nhóm <strong>{group.name}</strong>? Bạn sẽ không còn thuộc nhóm này nữa.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLeaveConfirm(false)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeaveConfirm(false);
                  onLeaveGroup();
                }}
                className="rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Rời nhóm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ResearchGroupBoard;
