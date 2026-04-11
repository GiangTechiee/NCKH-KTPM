import React, { useMemo, useState } from 'react';
import ResearchAreaBoard from '../components/ResearchAreaBoard';
import RegistrationConfirmationModal from '../components/RegistrationConfirmationModal';
import ResearchAreaDetailModal from '../components/ResearchAreaDetailModal';
import ChangeAreaConfirmationModal from '../components/ChangeAreaConfirmationModal';
import CancelAreaConfirmationModal from '../components/CancelAreaConfirmationModal';
import ResearchAreaOverviewCards from '../components/ResearchAreaOverviewCards';
import RegistrationWindowPanel from '../components/RegistrationWindowPanel';
import { ResearchAreaErrorState, ResearchAreaLoadingState } from '../components/ResearchAreaPageState';
import { useResearchArea } from '../hooks/useResearchArea';

function ResearchAreaPage({ studentCode }) {
  const {
    areaQuery,
    errorMessage,
    filteredAreas,
    isLoading,
    isSubmitting,
    journey,
    selectedArea,
    selectedAreaId,
    successMessage,
    areaStatusFilter,
    onAreaQueryChange,
    onAreaStatusFilterChange,
    onCancelAreaRegistration,
    onConfirmAreaRegistration,
    onRefresh,
  } = useResearchArea(studentCode);
  const [pendingAreaId, setPendingAreaId] = useState('');
  const [changeAreaId, setChangeAreaId] = useState('');
  const [detailAreaId, setDetailAreaId] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [localError, setLocalError] = useState('');

  const pendingArea = useMemo(() => {
    return (
      filteredAreas.find((area) => area.id === pendingAreaId) ||
      journey?.researchAreas.find((area) => area.id === pendingAreaId) ||
      null
    );
  }, [filteredAreas, journey, pendingAreaId]);

  const changeArea = useMemo(() => {
    return (
      filteredAreas.find((area) => area.id === changeAreaId) ||
      journey?.researchAreas.find((area) => area.id === changeAreaId) ||
      null
    );
  }, [filteredAreas, journey, changeAreaId]);

  const detailArea = useMemo(() => {
    return (
      filteredAreas.find((area) => area.id === detailAreaId) ||
      journey?.researchAreas.find((area) => area.id === detailAreaId) ||
      null
    );
  }, [filteredAreas, journey, detailAreaId]);

  const handleSelectArea = (areaId) => {
    if (areaId === selectedAreaId) {
      return;
    }

    if (selectedAreaId && areaId !== selectedAreaId) {
      setChangeAreaId(areaId);
    } else if (!selectedAreaId) {
      setPendingAreaId(areaId);
    }
  };

  const handleViewSelectedDetail = () => {
    if (selectedArea) {
      setDetailAreaId(selectedArea.id);
    }
  };

  const handleConfirmRegistration = async () => {
    if (!pendingArea) return;
    setLocalError('');
    try {
      const isSuccess = await onConfirmAreaRegistration(pendingArea);
      if (isSuccess) {
        setPendingAreaId('');
        setLocalError('');
      }
    } catch (error) {
      setLocalError(error.message || 'Có lỗi xảy ra khi đăng ký');
    }
  };

  const handleConfirmChange = async () => {
    if (!changeArea) return;
    setLocalError('');
    try {
      const isSuccess = await onConfirmAreaRegistration(changeArea);
      if (isSuccess) {
        setChangeAreaId('');
        setLocalError('');
      }
    } catch (error) {
      setLocalError(error.message || 'Có lỗi xảy ra khi chuyển mảng');
    }
  };

  const handleConfirmCancel = async () => {
    setLocalError('');
    try {
      const isSuccess = await onCancelAreaRegistration();
      if (isSuccess) {
        setShowCancelModal(false);
        setLocalError('');
      }
    } catch (error) {
      setLocalError(error.message || 'Có lỗi xảy ra khi hủy đăng ký');
    }
  };

  if (isLoading) {
    return <ResearchAreaLoadingState />;
  }

  if (!journey || !journey.registrationWindow) {
    return <ResearchAreaErrorState errorMessage={errorMessage} onRetry={onRefresh} />;
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <ResearchAreaOverviewCards
            areaCount={filteredAreas.length}
            closeAt={journey.registrationWindow.closeAt}
            selectedAreaTitle={selectedArea?.title || 'Chưa chọn'}
          />
        </div>
        <RegistrationWindowPanel
          closeAt={journey.registrationWindow.closeAt}
          daysLeft={journey.registrationWindow.daysLeft}
          openAt={journey.registrationWindow.openAt}
        />
      </div>

      <ResearchAreaBoard
        areas={filteredAreas}
        areaStatusFilter={areaStatusFilter}
        closeAt={journey?.registrationWindow?.closeAt}
        onAreaQueryChange={onAreaQueryChange}
        onAreaStatusFilterChange={onAreaStatusFilterChange}
        onCancelRegistration={() => setShowCancelModal(true)}
        onRefresh={onRefresh}
        onSelectArea={handleSelectArea}
        onViewDetail={setDetailAreaId}
        onViewSelectedDetail={handleViewSelectedDetail}
        query={areaQuery}
        selectedArea={selectedArea}
        selectedAreaId={selectedAreaId}
      />

      {successMessage ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <RegistrationConfirmationModal
        area={pendingArea}
        errorMessage={localError || errorMessage}
        isSubmitting={isSubmitting}
        onCancel={() => {
          setPendingAreaId('');
          setLocalError('');
        }}
        onConfirm={handleConfirmRegistration}
      />

      <ChangeAreaConfirmationModal
        currentArea={selectedArea}
        newArea={changeArea}
        isSubmitting={isSubmitting}
        onCancel={() => {
          setChangeAreaId('');
          setLocalError('');
        }}
        onConfirm={handleConfirmChange}
        errorMessage={localError || errorMessage}
      />

      <CancelAreaConfirmationModal
        area={showCancelModal ? selectedArea : null}
        isSubmitting={isSubmitting}
        onCancel={() => {
          setShowCancelModal(false);
          setLocalError('');
        }}
        onConfirm={handleConfirmCancel}
        errorMessage={localError || errorMessage}
      />

      <ResearchAreaDetailModal area={detailArea} onClose={() => setDetailAreaId('')} />
    </>
  );
}

export default ResearchAreaPage;
