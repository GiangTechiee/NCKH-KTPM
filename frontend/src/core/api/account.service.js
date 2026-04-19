import { apiClient } from './api-client';

async function layDanhSachSinhVien() {
  const response = await apiClient.getJson('/api/nguoi-dung/sinh-vien');

  return (response.data || []).map((sinhVien) => ({
    code: sinhVien.code,
    displayName: sinhVien.displayName,
    fullName: sinhVien.fullName,
    className: sinhVien.className || '',
    facultyName: sinhVien.facultyName || '',
    workflowStatus: sinhVien.workflowStatus,
    researchAreaName: sinhVien.researchAreaName || '',
    groupName: sinhVien.groupName || '',
    topicName: sinhVien.topicName || '',
  }));
}

async function layDanhSachGiangVien() {
  const response = await apiClient.getJson('/api/nguoi-dung/giang-vien');

  return (response.data || []).map((giangVien) => ({
    code: giangVien.code,
    displayName: giangVien.displayName,
    fullName: giangVien.fullName,
    departmentName: giangVien.departmentName || '',
    expertise: giangVien.expertise || '',
    specialization: giangVien.expertise || '',
    supervision: giangVien.supervision,
    recentGroups: giangVien.recentGroups || [],
  }));
}

export { layDanhSachSinhVien, layDanhSachGiangVien };
