import { useCallback, useEffect, useState } from 'react';
import { notificationService } from '../services/notification.service';

export function useNotifications(role, userCode) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const loadNotifications = useCallback(async () => {
    if (!userCode) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = role === 'lecturer'
        ? await notificationService.layThongBaoGiangVien(userCode)
        : await notificationService.layThongBaoSinhVien(userCode);
      setNotifications(data);
    } catch {
      setNotifications([]);
      setErrorMessage('Chưa có API thông báo hoặc không tải được dữ liệu.');
    } finally {
      setIsLoading(false);
    }
  }, [role, userCode]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    setErrorMessage('');
    try {
      await notificationService.danhDauDaDoc(notificationId, role, userCode);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        )
      );
    } catch {
      setErrorMessage('Không thể đánh dấu đã đọc. Vui lòng thử lại.');
    }
  }, [role, userCode]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications: filteredNotifications,
    allNotifications: notifications,
    isLoading,
    errorMessage,
    filter,
    unreadCount,
    onFilterChange: setFilter,
    onMarkAsRead: markAsRead,
    onRefresh: loadNotifications,
  };
}
