import { apiClient } from '../../../core/api/api-client';

function taoHeadersSinhVien(studentCode) {
  return { 'x-ma-sinh-vien': studentCode };
}

function taoHeadersGiangVien(lecturerCode) {
  return { 'x-ma-giang-vien': lecturerCode };
}

async function layTienTrinhSinhVien(studentCode) {
  const response = await apiClient.getJson('/api/trang-thai-quy-trinh/sinh-vien', {
    headers: taoHeadersSinhVien(studentCode),
  });
  return response.data;
}

async function layTienTrinhGiangVien(lecturerCode) {
  const response = await apiClient.getJson('/api/trang-thai-quy-trinh/giang-vien', {
    headers: taoHeadersGiangVien(lecturerCode),
  });
  return response.data;
}

export const workflowStatusService = {
  layTienTrinhSinhVien,
  layTienTrinhGiangVien,
};
