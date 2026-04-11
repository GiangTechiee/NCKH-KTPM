import { apiClient } from '../../../core/api/api-client';

function tinhSoNgayConLai(closeAt) {
  const now = new Date();
  const closeDate = new Date(closeAt);
  const difference = closeDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
}

function taoHeadersSinhVien(studentCode) {
  return {
    'x-ma-sinh-vien': studentCode,
  };
}

function mapResearchArea(area) {
  return {
    id: String(area.id),
    shortCode: area.maMang,
    title: area.tenMang,
    description: area.moTa || 'Chưa có mô tả chi tiết cho mảng nghiên cứu này.',
    tags: [area.maMang, 'Nghiên cứu khoa học'],
    slotsFilled: area.soLuongDaDangKy || 0,
    slotLimit: Math.max((area.soLuongDaDangKy || 0) + 10, 10),
    trend: area.trangThai === 'OPEN' ? 'Mở đăng ký' : area.trangThai,
    openAt: area.thoiGianMoDangKy,
    closeAt: area.thoiGianDongDangKy,
  };
}

function mapCurrentRegistration(registration) {
  if (!registration) {
    return null;
  }

  return {
    id: String(registration.id),
    researchAreaId: String(registration.mangNghienCuuId),
    registeredAt: registration.thoiGianDangKy,
    status: registration.trangThai,
    area: mapResearchArea({
      ...registration.mangNghienCuu,
      soLuongDaDangKy: registration.mangNghienCuu.soLuongDaDangKy || 0,
    }),
  };
}

async function layDangKyMangHienTai(studentCode) {
  if (!studentCode?.trim()) {
    return null;
  }

  const response = await apiClient.getJson('/api/dang-ky-mang-nghien-cuu/hien-tai', {
    headers: taoHeadersSinhVien(studentCode.trim()),
  });

  return mapCurrentRegistration(response?.data || null);
}

async function getRegistrationPageData(studentCode) {
  const [response, currentRegistration] = await Promise.all([
    apiClient.getJson('/api/mang-nghien-cuu/dang-mo'),
    layDangKyMangHienTai(studentCode).catch(() => null),
  ]);

  const researchAreas = (response?.data || []).map(mapResearchArea);
  const registrationAnchorArea = currentRegistration?.area;
  const openAt = researchAreas[0]?.openAt || registrationAnchorArea?.openAt || new Date().toISOString();
  const closeAt = researchAreas[0]?.closeAt || registrationAnchorArea?.closeAt || new Date().toISOString();

  return {
    student: {
      fullName: 'Người dùng hiện tại',
      studentCode: studentCode || '',
      major: 'Sinh viên nghiên cứu khoa học',
    },
    registrationWindow: {
      openAt,
      closeAt,
      daysLeft: tinhSoNgayConLai(closeAt),
      isOpen: new Date(closeAt).getTime() >= Date.now(),
    },
    currentRegistration,
    researchAreas,
  };
}

async function dangKyMangNghienCuu(studentCode, researchAreaId) {
  return apiClient.postJson(
    '/api/dang-ky-mang-nghien-cuu',
    { mangNghienCuuId: researchAreaId },
    {
      headers: taoHeadersSinhVien(studentCode),
    }
  );
}

async function huyDangKyMangNghienCuu(studentCode) {
  return apiClient.deleteJson('/api/dang-ky-mang-nghien-cuu/huy', {
    headers: taoHeadersSinhVien(studentCode),
  });
}

export {
  dangKyMangNghienCuu,
  getRegistrationPageData,
  huyDangKyMangNghienCuu,
  layDangKyMangHienTai,
  mapResearchArea,
};
