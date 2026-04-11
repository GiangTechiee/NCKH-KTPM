import React from 'react';
import {
  groupStatusBadgeClass,
  groupStatusLabel,
  invitationStatusBadgeClass,
  invitationStatusLabel,
  memberJoinStatusBadgeClass,
  memberJoinStatusLabel,
  memberRoleLabel,
} from '../../../shared/utils/status-labels';

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

function ResearchGroupBoard({
  createGroupName,
  group,
  inviteStudentCode,
  isCreating,
  isInviting,
  onCreateGroup,
  onCreateGroupNameChange,
  onInvite,
  onInviteStudentCodeChange,
}) {
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
            <div className="rounded-full bg-[#edf5ff] px-4 py-2 text-sm font-medium text-[#0b4a7a]">
              Còn trống {remainingSlots} vị trí
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

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row">
              <input
                value={inviteStudentCode}
                onChange={(event) => onInviteStudentCodeChange(event.target.value)}
                placeholder="Nhập MSSV muốn mời"
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
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
    </section>
  );
}

export default ResearchGroupBoard;
