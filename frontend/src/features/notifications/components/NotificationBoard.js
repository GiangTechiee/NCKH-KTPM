import React from 'react';

const NOTIFICATION_TYPE_ICONS = {
  DANG_KY_MANG: { label: 'Đăng ký mảng', bg: 'bg-blue-100', text: 'text-blue-600' },
  DANG_KY_MANG_THANH_CONG: { label: 'Đăng ký mảng', bg: 'bg-blue-100', text: 'text-blue-600' },
  TAO_NHOM_THANH_CONG: { label: 'Tạo nhóm', bg: 'bg-sky-100', text: 'text-sky-700' },
  MOI_VAO_NHOM: { label: 'Lời mời nhóm', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  CHAP_NHAN_LOI_MOI: { label: 'Chấp nhận lời mời', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  LOI_MOI_DUOC_CHAP_NHAN: { label: 'Lời mời được chấp nhận', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  TU_CHOI_LOI_MOI: { label: 'Từ chối lời mời', bg: 'bg-rose-100', text: 'text-rose-600' },
  LOI_MOI_BI_TU_CHOI: { label: 'Lời mời bị từ chối', bg: 'bg-rose-100', text: 'text-rose-600' },
  NHAN_HUONG_DAN: { label: 'Nhận hướng dẫn', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  GIANG_VIEN_NHAN_HUONG_DAN_NHOM: { label: 'Nhận hướng dẫn', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  NOP_DE_TAI: { label: 'Nộp đề tài', bg: 'bg-blue-100', text: 'text-blue-600' },
  NHOM_NOP_DE_TAI: { label: 'Nhóm nộp đề tài', bg: 'bg-blue-100', text: 'text-blue-600' },
  NHOM_CAP_NHAT_DE_TAI: { label: 'Cập nhật đề tài', bg: 'bg-sky-100', text: 'text-sky-700' },
  CO_DE_TAI_GIANG_VIEN_DE_XUAT: { label: 'Đề tài giảng viên đề xuất', bg: 'bg-sky-100', text: 'text-sky-700' },
  NHOM_CHON_DE_TAI_GIANG_VIEN_DE_XUAT: { label: 'Chọn đề tài đề xuất', bg: 'bg-sky-100', text: 'text-sky-700' },
  YEU_CAU_CHINH_SUA: { label: 'Yêu cầu chỉnh sửa', bg: 'bg-amber-100', text: 'text-amber-600' },
  GIANG_VIEN_YEU_CAU_CHINH_SUA_DE_TAI: { label: 'Yêu cầu chỉnh sửa', bg: 'bg-amber-100', text: 'text-amber-600' },
  DUYET_DE_TAI: { label: 'Duyệt đề tài', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  GIANG_VIEN_DUYET_DE_TAI: { label: 'Duyệt đề tài', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  TU_CHOI_DE_TAI: { label: 'Từ chối đề tài', bg: 'bg-rose-100', text: 'text-rose-600' },
  GIANG_VIEN_TU_CHOI_DE_TAI: { label: 'Từ chối đề tài', bg: 'bg-rose-100', text: 'text-rose-600' },
  CHOT_DE_TAI: { label: 'Chốt đề tài', bg: 'bg-emerald-100', text: 'text-emerald-600' },
};

const DEFAULT_TYPE_STYLE = { label: 'Thông báo', bg: 'bg-slate-100', text: 'text-slate-600' };

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function FilterTabs({ filter, onFilterChange, unreadCount }) {
  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'unread', label: `Chưa đọc${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { key: 'read', label: 'Đã đọc' },
  ];

  return (
    <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onFilterChange(tab.key)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
            filter === tab.key
              ? 'bg-white text-[#0b4a7a] shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function NotificationCard({ notification, onMarkAsRead }) {
  const typeStyle = NOTIFICATION_TYPE_ICONS[notification.type] || DEFAULT_TYPE_STYLE;
  const isUnread = !notification.isRead;

  return (
    <div
      className={`group relative rounded-2xl border px-5 py-4 transition ${
        isUnread
          ? 'border-blue-200 bg-blue-50/30 shadow-sm'
          : 'border-slate-200 bg-white hover:bg-slate-50/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeStyle.bg}`}>
          <svg className={`h-5 w-5 ${typeStyle.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {isUnread ? (
                  <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                ) : null}
                <h4 className={`truncate text-sm ${isUnread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                  {notification.title}
                </h4>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-600">{notification.content}</p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] tabular-nums text-slate-400" title={formatFullDate(notification.createdAt)}>
                {formatTimeAgo(notification.createdAt)}
              </p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeStyle.bg} ${typeStyle.text}`}>
                {typeStyle.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isUnread ? (
        <button
          type="button"
          onClick={() => onMarkAsRead(notification.id)}
          className="absolute right-3 bottom-3 rounded-lg bg-white px-2.5 py-1 text-[10px] font-semibold text-[#0b4a7a] opacity-0 shadow-sm ring-1 ring-slate-200 transition group-hover:opacity-100"
        >
          Đánh dấu đã đọc
        </button>
      ) : null}
    </div>
  );
}

function EmptyNotifications({ filter }) {
  const messages = {
    all: 'Bạn chưa có thông báo nào.',
    unread: 'Không có thông báo chưa đọc.',
    read: 'Không có thông báo đã đọc.',
  };

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-700">{messages[filter] || messages.all}</p>
      <p className="mt-1 text-xs text-slate-500">Thông báo sẽ xuất hiện khi có sự kiện mới trong hệ thống.</p>
    </div>
  );
}

function NotificationBoard({ notifications, isLoading, errorMessage, filter, unreadCount, onFilterChange, onMarkAsRead, onRefresh }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <FilterTabs filter={filter} onFilterChange={onFilterChange} unreadCount={unreadCount} />
          {unreadCount > 0 ? (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {unreadCount} chưa đọc
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <svg className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Làm mới
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0b4a7a]" />
            <p className="mt-4 text-sm text-slate-500">Đang tải thông báo...</p>
          </div>
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center">
          <p className="text-sm text-amber-700">{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && notifications.length === 0 ? (
        <EmptyNotifications filter={filter} />
      ) : null}

      {!isLoading && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkAsRead={onMarkAsRead} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default NotificationBoard;
