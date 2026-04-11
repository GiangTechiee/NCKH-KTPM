import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  dangKyMangNghienCuu,
  getRegistrationPageData,
  huyDangKyMangNghienCuu,
} from '../services/research-area.service';

export function useResearchArea(studentCode) {
  const [journey, setJourney] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [areaQuery, setAreaQuery] = useState('');
  const [areaStatusFilter, setAreaStatusFilter] = useState('ALL');
  const [selectedAreaId, setSelectedAreaId] = useState('');

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
    onConfirmAreaRegistration: handleConfirmAreaRegistration,
    onRefresh: loadJourney,
  };
}
