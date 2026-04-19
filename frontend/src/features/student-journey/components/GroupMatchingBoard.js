import React from 'react';
import { INVITATION_STATUS } from '../../../shared/types/status.types';
import {
  invitationStatusBadgeClass,
  invitationStatusLabel,
} from '../../../shared/utils/status-labels';

function InvitationStatusPill({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${invitationStatusBadgeClass(status)}`}>
      {invitationStatusLabel(status)}
    </span>
  );
}

function GroupMatchingBoard({
  candidateQuery,
  canInviteCandidates,
  candidates,
  invitations,
  matchingAction,
  onAcceptInvitation,
  onCandidateQueryChange,
  onInviteCandidate,
  onRequestJoinGroup,
  onRejectInvitation,
  suggestedGroups,
}) {
  const isCandidateInviting = (studentCode) => matchingAction.type === 'invite-candidate' && matchingAction.targetId === studentCode;
  const isGroupJoining = (groupId) => matchingAction.type === 'join-group' && matchingAction.targetId === String(groupId);
  const isAcceptingInvitation = (invitationId) => matchingAction.type === 'accept-invitation' && matchingAction.targetId === String(invitationId);
  const isRejectingInvitation = (invitationId) => matchingAction.type === 'reject-invitation' && matchingAction.targetId === String(invitationId);

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Ghép nhóm và lời mời tham gia</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Xem gợi ý sinh viên và nhóm phù hợp, đồng thời phản hồi các lời mời tham gia nhóm đang chờ xử lý.
          </p>
        </div>

        <label className="flex min-w-[280px] items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            className="w-full border-none bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Tìm theo tên, MSSV..."
            value={candidateQuery}
            onChange={(event) => onCandidateQueryChange(event.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <article className="rounded-[22px] border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <p className="font-semibold text-slate-950">Sinh viên phù hợp với nhóm hiện tại</p>
              <p className="mt-1 text-sm text-slate-500">{candidates.length} hồ sơ được hệ thống gợi ý.</p>
            </div>

            <div className="space-y-4 px-5 py-5">
              {candidates.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  Chưa có sinh viên phù hợp hoặc bạn chưa là trưởng nhóm.
                </div>
              ) : null}

              {candidates.map((candidate) => (
                <div key={candidate.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-semibold text-slate-950">{candidate.fullName}</p>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {candidate.compatibilityLabel}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{candidate.studentCode}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{candidate.reason}</p>
                    </div>
                    {canInviteCandidates ? (
                      <button
                        type="button"
                        onClick={() => onInviteCandidate(candidate.studentCode)}
                        disabled={isCandidateInviting(candidate.studentCode)}
                        className="shrink-0 self-start rounded-xl bg-[#0b4a7a] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 lg:mt-1"
                      >
                        {isCandidateInviting(candidate.studentCode) ? 'Đang gửi...' : 'Mời vào nhóm'}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[22px] border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <p className="font-semibold text-slate-950">Nhóm phù hợp để tham gia</p>
              <p className="mt-1 text-sm text-slate-500">{suggestedGroups.length} nhóm còn thiếu thành viên.</p>
            </div>

            <div className="space-y-4 px-5 py-5">
              {suggestedGroups.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  Chưa có nhóm phù hợp.
                </div>
              ) : null}

              {suggestedGroups.map((group) => (
                <div key={group.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{group.name}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        Trưởng nhóm: {group.leaderName} ({group.leaderStudentCode})
                      </p>
                      <p className="mt-2 text-sm text-slate-500">Số thành viên hiện tại: {group.memberCount}</p>
                    </div>
                      <button
                        type="button"
                        onClick={() => onRequestJoinGroup(group.id)}
                        disabled={isGroupJoining(group.id)}
                        className="shrink-0 self-start rounded-xl border border-[#0b4a7a] bg-white px-4 py-2 text-sm font-semibold text-[#0b4a7a] disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 lg:mt-1"
                      >
                        {isGroupJoining(group.id) ? 'Đang xử lý...' : 'Tham gia nhóm'}
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-[22px] border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="font-semibold text-slate-950">Lời mời của tôi</p>
            <p className="mt-1 text-sm text-slate-500">Phản hồi trực tiếp từng lời mời đang chờ xử lý.</p>
          </div>

          <div className="space-y-4 px-5 py-5">
            {invitations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                Chưa có lời mời tham gia nhóm.
              </div>
            ) : null}

            {invitations.map((invitation) => (
              <div key={invitation.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{invitation.groupName}</p>
                <p className="mt-2 text-sm text-slate-500">
                  Người gửi: {invitation.fromStudentName} ({invitation.fromStudentCode})
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{invitation.message}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <InvitationStatusPill status={invitation.status} />
                  {invitation.status === INVITATION_STATUS.CHO_XAC_NHAN ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onAcceptInvitation(invitation.id)}
                        disabled={isAcceptingInvitation(invitation.id) || isRejectingInvitation(invitation.id)}
                        className="rounded-xl bg-[#0b4a7a] px-4 py-2 text-sm font-semibold text-white"
                      >
                        {isAcceptingInvitation(invitation.id) ? 'Đang xử lý...' : 'Đồng ý'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectInvitation(invitation.id)}
                        disabled={isAcceptingInvitation(invitation.id) || isRejectingInvitation(invitation.id)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        {isRejectingInvitation(invitation.id) ? 'Đang xử lý...' : 'Từ chối'}
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default GroupMatchingBoard;
