import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  dangKyMangNghienCuu,
  getRegistrationPageData,
  huyDangKyMangNghienCuu,
  layNhomTheoMang,
} from '../services/research-area.service';
import {
  taoNhomNghienCuu,
  thamGiaNhom,
} from '../../student-journey/services/student-journey.service';

export function useResearchArea(studentCode) {
  const [journey, setJourney] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [areaQuery, setAreaQuery] = useState('');
  const [areaStatusFilter, setAreaStatusFilter] = useState('ALL');
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [groupSelectionData, setGroupSelectionData] = useState(null);
  const [groupSelectionMode, setGroupSelectionMode] = useState('join');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  const loadJourney = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await getRegistrationPageData(studentCode);
      setJourney(data);
      setSelectedAreaId(data.currentRegistration?.researchAreaId || '');
    } catch (error) {
      setJourney(null);
      setSelectedAreaId('');
      setErrorMessage(error.message || 'Không tải được dữ liệu đăng ký mảng nghiên cứu.');
    } finally {
      setIsLoading(false);
    }
  }, [studentCode]);

  useEffect(() => {
    setSelectedAreaId('');
    setAreaQuery('');
    setAreaStatusFilter('ALL');
    setJourney(null);
  }, [studentCode]);

  useEffect(() => {
    loadJourney();
  }, [loadJourney]);

  const filteredAreas = useMemo(() => {
    if (!journey) {
      return [];
    }

    const normalizedQuery = areaQuery.trim().toLowerCase();
    const now = Date.now();
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const matchingAreas = journey.researchAreas.filter((area) => {
      const searchable = `${area.title} ${area.shortCode} ${area.description}`.toLowerCase();
      if (normalizedQuery && !searchable.includes(normalizedQuery)) {
        return false;
      }

      if (areaStatusFilter === 'SAP_DONG') {
        const closeTime = new Date(area.closeAt).getTime();
        return closeTime - now <= THREE_DAYS_MS && closeTime >= now;
      }

      return true;
    });

    return [...matchingAreas].sort((areaA, areaB) => {
      if (areaA.id === selectedAreaId) {
        return -1;
      }

      if (areaB.id === selectedAreaId) {
        return 1;
      }

      return areaA.title.localeCompare(areaB.title, 'vi');
    });
  }, [areaQuery, areaStatusFilter, journey, selectedAreaId]);

  const selectedArea = useMemo(() => {
    if (!journey) {
      return null;
    }

    if (journey.currentRegistration?.area?.id === selectedAreaId) {
      return journey.currentRegistration.area;
    }

    return journey.researchAreas.find((area) => area.id === selectedAreaId) || journey.currentRegistration?.area || null;
  }, [journey, selectedAreaId]);

  const summary = useMemo(() => {
    if (!journey) {
      return null;
    }

    return {
      selectedAreaTitle: selectedArea ? selectedArea.title : 'Chưa chọn',
    };
  }, [journey, selectedArea]);

  async function handleConfirmAreaRegistration(area) {
    if (!studentCode.trim()) {
      const error = new Error('Bạn cần nhập mã sinh viên để gửi yêu cầu đăng ký.');
      setErrorMessage(error.message);
      throw error;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await dangKyMangNghienCuu(studentCode.trim(), area.id);
      setSuccessMessage(response?.message || `Đăng ký mảng "${area.title}" thành công.`);
      await loadJourney();

      return true;
    } catch (error) {
      setErrorMessage(error.message || 'Đăng ký mảng nghiên cứu thất bại.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePrepareAreaRegistration(area) {
  if (!studentCode.trim()) {
    const error = new Error('Bạn cần nhập mã sinh viên để đăng ký.');
    setErrorMessage(error.message);
    throw error;
  }

  setIsSubmitting(true);
  setErrorMessage('');
  setSuccessMessage('');

  try {
    const data = await layNhomTheoMang(area.id);
    setGroupSelectionData({
      area,
      ...data,
    });
    setGroupSelectionMode(data.nhomHienCo.length > 0 ? 'join' : 'create');
    setSelectedGroupId(data.nhomHienCo.find((group) => group.coTheThamGia)?.id || '');
    setNewGroupName('');
    return true;
  } catch (error) {
    setErrorMessage(error.message || 'Không tải được danh sách nhóm.');
    throw error;
  } finally {
    setIsSubmitting(false);
  }
}
async function handleCompleteAreaRegistration() {
  if (!groupSelectionData?.area) {
    return false;
  }

  if (groupSelectionMode === 'join' && !selectedGroupId) {
    const error = new Error('Bạn cần chọn một nhóm để tham gia.');
    setErrorMessage(error.message);
    throw error;
  }

  if (groupSelectionMode === 'create' && !newGroupName.trim()) {
    const error = new Error('Bạn cần nhập tên nhóm mới.');
    setErrorMessage(error.message);
    throw error;
  }

  let daDangKyMang = false;

  setIsSubmitting(true);
  setErrorMessage('');
  setSuccessMessage('');

  try {
    await dangKyMangNghienCuu(studentCode.trim(), groupSelectionData.area.id);
    daDangKyMang = true;

    if (groupSelectionMode === 'join') {
      await thamGiaNhom(studentCode.trim(), selectedGroupId);
    } else {
      await taoNhomNghienCuu(studentCode.trim(), newGroupName.trim());
    }

    setSuccessMessage(`Đăng ký mảng "${groupSelectionData.area.title}" thành công.`);
    setGroupSelectionData(null);
    setSelectedGroupId('');
    setNewGroupName('');
    await loadJourney();
    return true;
  } catch (error) {
    if (daDangKyMang) {
      try {
        await huyDangKyMangNghienCuu(studentCode.trim());
      } catch (_rollbackError) {
        // bỏ qua rollback lỗi
      }
    }

    setErrorMessage(error.message || 'Đăng ký mảng thất bại.');
    throw error;
  } finally {
    setIsSubmitting(false);
  }
}
function handleCloseGroupSelection() {
  setGroupSelectionData(null);
  setSelectedGroupId('');
  setNewGroupName('');
}

  async function handleCancelAreaRegistration() {
    if (!studentCode.trim()) {
      const error = new Error('Bạn cần nhập mã sinh viên để hủy đăng ký.');
      setErrorMessage(error.message);
      throw error;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await huyDangKyMangNghienCuu(studentCode.trim());
      setSuccessMessage(response?.message || 'Hủy đăng ký mảng nghiên cứu thành công.');
      await loadJourney();
      return true;
    } catch (error) {
      setErrorMessage(error.message || 'Hủy đăng ký thất bại.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    areaQuery,
    errorMessage,
    filteredAreas,
    isLoading,
    isSubmitting,
    journey,
    selectedArea,
    selectedAreaId,
    successMessage,
    summary,
    areaStatusFilter,
    onAreaQueryChange: setAreaQuery,
    onAreaStatusFilterChange: setAreaStatusFilter,
    onCancelAreaRegistration: handleCancelAreaRegistration,
    groupSelectionData,
    groupSelectionMode,
    selectedGroupId,
    newGroupName,
    onGroupSelectionModeChange: setGroupSelectionMode,
    onSelectedGroupIdChange: setSelectedGroupId,
    onNewGroupNameChange: setNewGroupName,
    onPrepareAreaRegistration: handlePrepareAreaRegistration,
    onCompleteAreaRegistration: handleCompleteAreaRegistration,
    onCloseGroupSelection: handleCloseGroupSelection,
    onRefresh: loadJourney,
  };
}
