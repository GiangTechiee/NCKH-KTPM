import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  chotDeTai,
  duyetDeTai,
  layDanhSachDeTaiChoDuyet,
  tuChoiDeTai,
  yeuCauChinhSuaDeTai,
} from '../services/student-journey.service';

export function useLecturerTopicReview(isLecturerMode, lecturerCode) {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadTopics = useCallback(async () => {
    if (!isLecturerMode || !lecturerCode.trim()) {
      setTopics([]);
      setSelectedTopicId('');
      setErrorMessage(isLecturerMode ? 'Nhập mã giảng viên để tải danh sách đề tài chờ duyệt.' : '');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await layDanhSachDeTaiChoDuyet(lecturerCode.trim());
      setTopics(data);
      setSelectedTopicId((currentId) => {
        if (currentId && data.some((topic) => topic.id === currentId)) {
          return currentId;
        }

        return data[0]?.id || '';
      });
    } catch (error) {
      setTopics([]);
      setSelectedTopicId('');
      setErrorMessage(error.message || 'Không tải được danh sách đề tài chờ duyệt.');
    } finally {
      setIsLoading(false);
    }
  }, [isLecturerMode, lecturerCode]);

  useEffect(() => {
    if (isLecturerMode) {
      loadTopics();
    }
  }, [isLecturerMode, loadTopics]);

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopicId) || null,
    [selectedTopicId, topics]
  );

  async function handleReview(action) {
    if (!lecturerCode.trim()) {
      setErrorMessage('Nhập mã giảng viên để xử lý đề tài.');
      return false;
    }

    if (!selectedTopic) {
      setErrorMessage('Chọn một đề tài để xử lý.');
      return false;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (action === 'approve') {
        await duyetDeTai(lecturerCode.trim(), selectedTopic.id, reviewNote.trim());
        setSuccessMessage('Duyệt đề tài thành công.');
      }

      if (action === 'request-changes') {
        await yeuCauChinhSuaDeTai(lecturerCode.trim(), selectedTopic.id, reviewNote.trim());
        setSuccessMessage('Đã gửi yêu cầu chỉnh sửa cho nhóm.');
      }

      if (action === 'reject') {
        await tuChoiDeTai(lecturerCode.trim(), selectedTopic.id, reviewNote.trim());
        setSuccessMessage('Đã từ chối đề tài.');
      }

      if (action === 'finalize') {
        await chotDeTai(lecturerCode.trim(), selectedTopic.id);
        setSuccessMessage('Đã chốt đề tài thành công.');
      }

      setReviewNote('');
      await loadTopics();
      return true;
    } catch (error) {
      setErrorMessage(error.message || 'Xử lý đề tài thất bại.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    errorMessage,
    isLoading,
    isSubmitting,
    reviewNote,
    selectedTopic,
    successMessage,
    topics,
    onApproveTopic: () => handleReview('approve'),
    onFinalizeTopic: () => handleReview('finalize'),
    onRefresh: loadTopics,
    onRejectTopic: () => handleReview('reject'),
    onRequestChangesTopic: () => handleReview('request-changes'),
    onReviewNoteChange: setReviewNote,
    onSelectTopic: setSelectedTopicId,
  };
}
