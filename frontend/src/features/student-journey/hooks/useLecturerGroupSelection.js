import { useCallback, useEffect, useState } from 'react';
import {
  layChiTietNhomChoGiangVien,
  layDanhSachNhomCoTheNhan,
  layDanhSachNhomDangHuongDan,
  nhanHuongDanNhom,
} from '../services/student-journey.service';

export function useLecturerGroupSelection(isLecturerMode, lecturerCode) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [currentGroups, setCurrentGroups] = useState([]);
  const [isCurrentLoading, setIsCurrentLoading] = useState(false);
  const [currentErrorMessage, setCurrentErrorMessage] = useState('');

  const loadGroups = useCallback(async () => {
    if (!isLecturerMode || !lecturerCode.trim()) {
      setGroups([]);
      setErrorMessage(isLecturerMode ? 'Nhập mã giảng viên để tải danh sách nhóm ứng viên.' : '');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await layDanhSachNhomCoTheNhan(lecturerCode.trim());
      setGroups(data);
    } catch (error) {
      setGroups([]);
      setErrorMessage(error.message || 'Không tải được danh sách nhóm ứng viên.');
    } finally {
      setIsLoading(false);
    }
  }, [isLecturerMode, lecturerCode]);

  const loadCurrentGroups = useCallback(async () => {
    if (!isLecturerMode || !lecturerCode.trim()) {
      setCurrentGroups([]);
      setCurrentErrorMessage(isLecturerMode ? 'Nhập mã giảng viên để tải nhóm đang hướng dẫn.' : '');
      return;
    }

    setIsCurrentLoading(true);
    setCurrentErrorMessage('');

    try {
      const data = await layDanhSachNhomDangHuongDan(lecturerCode.trim());
      setCurrentGroups(data);
    } catch (error) {
      setCurrentGroups([]);
      setCurrentErrorMessage(error.message || 'Không tải được danh sách nhóm đang hướng dẫn.');
    } finally {
      setIsCurrentLoading(false);
    }
  }, [isLecturerMode, lecturerCode]);

  useEffect(() => {
    if (isLecturerMode) {
      loadGroups();
    }
  }, [isLecturerMode, loadGroups]);

  async function handleSelectGroup(groupId) {
    if (!lecturerCode.trim()) {
      setErrorMessage('Nhập mã giảng viên để xem chi tiết nhóm.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await layChiTietNhomChoGiangVien(lecturerCode.trim(), groupId);
      setSelectedGroup(data);
    } catch (error) {
      setErrorMessage(error.message || 'Không tải được chi tiết nhóm.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAssignGroup(groupId) {
    if (!lecturerCode.trim()) {
      setErrorMessage('Nhập mã giảng viên để nhận hướng dẫn nhóm.');
      return false;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await nhanHuongDanNhom(lecturerCode.trim(), groupId);
      setSuccessMessage('Nhận hướng dẫn nhóm thành công.');
      setSelectedGroup(null);
      await loadGroups();
      await loadCurrentGroups();
      return true;
    } catch (error) {
      setErrorMessage(error.message || 'Nhận hướng dẫn nhóm thất bại.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    currentErrorMessage,
    currentGroups,
    errorMessage,
    groups,
    isCurrentLoading,
    isLoading,
    isSubmitting,
    lecturerCode,
    selectedGroup,
    successMessage,
    onAssignGroup: handleAssignGroup,
    onCloseGroupDetail: () => setSelectedGroup(null),
    onRefresh: loadGroups,
    onRefreshCurrentGroups: loadCurrentGroups,
    onSelectGroup: handleSelectGroup,
  };
}
