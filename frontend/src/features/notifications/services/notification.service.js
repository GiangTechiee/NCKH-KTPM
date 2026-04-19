import { apiClient } from '../../../core/api/api-client';

function taoHeadersSinhVien(studentCode) {
  return { 'x-ma-sinh-vien': studentCode };
}

function taoHeadersGiangVien(lecturerCode) {
  return { 'x-ma-giang-vien': lecturerCode };
}

function mapThongBao(raw) {
  return {
    id: String(raw.id),
    title: raw.title,
    content: raw.content,
    type: raw.type,
    entityType: raw.linkedObject?.loaiDoiTuong || null,
    entityId: raw.linkedObject?.doiTuongId ? String(raw.linkedObject.doiTuongId) : null,
    isRead: raw.isRead,
    readAt: raw.readAt || null,
    createdAt: raw.createdAt,
  };
}

async function layThongBaoSinhVien(studentCode) {
  const response = await apiClient.getJson('/api/thong-bao', {
    headers: taoHeadersSinhVien(studentCode),
  });
  return (response.data || []).map(mapThongBao);
}

async function layThongBaoGiangVien(lecturerCode) {
  const response = await apiClient.getJson('/api/thong-bao', {
    headers: taoHeadersGiangVien(lecturerCode),
  });
  return (response.data || []).map(mapThongBao);
}

async function danhDauDaDoc(notificationId, role, userCode) {
  const headers = role === 'lecturer'
    ? taoHeadersGiangVien(userCode)
    : taoHeadersSinhVien(userCode);

  return apiClient.requestJson(`/api/thong-bao/${notificationId}/da-doc`, {
    method: 'PATCH',
    headers,
  });
}

export const notificationService = {
  layThongBaoSinhVien,
  layThongBaoGiangVien,
  danhDauDaDoc,
};
