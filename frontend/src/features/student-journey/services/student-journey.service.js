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

function taoHeadersGiangVien(lecturerCode) {
  return {
    'x-ma-giang-vien': lecturerCode,
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

function mapGroupResponse(group) {
  return {
    id: String(group.id),
    name: group.tenNhom,
    status: group.trangThai,
    maxMembers: 3,
    lecturerName: group.giangVien?.hoTen || 'Chưa có',
    researchAreaName: group.mangNghienCuu.tenMang,
    members: group.thanhVien.map((member) => ({
      id: String(member.id),
      fullName: member.hoTen,
      studentCode: member.maSinhVien,
      roleLabel: member.vaiTro === 'TRUONG_NHOM' ? 'Trưởng nhóm' : 'Thành viên',
      status: member.trangThaiThamGia,
    })),
    sentInvitations: group.loiMoiDaGui.map((invitation) => ({
      id: String(invitation.id),
      targetStudentId: String(invitation.sinhVienDuocMoiId),
      targetStudentName: invitation.hoTen,
      targetStudentCode: invitation.maSinhVien,
      status: invitation.trangThai,
      sentAt: invitation.thoiGianMoi,
    })),
  };
}

function mapMatchingResponse(payload) {
  return {
    matchingCandidates: payload.sinhVienPhuHop.map((candidate) => ({
      id: String(candidate.id),
      fullName: candidate.hoTen,
      studentCode: candidate.maSinhVien,
      compatibilityLabel: 'Cùng mảng',
      reason: [candidate.tenLop, candidate.tenKhoa].filter(Boolean).join(' - ') || 'Sinh viên cùng mảng nghiên cứu.',
      skillTags: ['Cùng mảng', 'Chưa có nhóm'],
    })),
    suggestedGroups: payload.nhomPhuHop.map((group) => ({
      id: String(group.id),
      name: group.tenNhom,
      leaderName: group.truongNhom.hoTen,
      leaderStudentCode: group.truongNhom.maSinhVien,
      memberCount: group.soLuongThanhVien,
    })),
    receivedInvitations: payload.loiMoiDaNhan.map((invitation) => ({
      id: String(invitation.id),
      groupId: String(invitation.nhomNghienCuuId),
      groupName: invitation.tenNhom,
      fromStudentName: invitation.nguoiMoi.hoTen,
      fromStudentCode: invitation.nguoiMoi.maSinhVien,
      message: `Lời mời tham gia nhóm ${invitation.tenNhom}.`,
      status: invitation.trangThai,
      sentAt: invitation.thoiGianMoi,
    })),
  };
}

async function getRegistrationPageData(studentCode) {
  const response = await apiClient.getJson('/api/mang-nghien-cuu/dang-mo');
  const researchAreas = (response?.data || []).map(mapResearchArea);
  const closeAt = researchAreas[0]?.closeAt || new Date().toISOString();
  const openAt = researchAreas[0]?.openAt || new Date().toISOString();

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
      isOpen: true,
    },
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

async function layNhomCuaToi(studentCode) {
  const response = await apiClient.getJson('/api/nhom-cua-toi', {
    headers: taoHeadersSinhVien(studentCode),
  });

  return mapGroupResponse(response.data);
}

async function taoNhomNghienCuu(studentCode, tenNhom) {
  return apiClient.postJson(
    '/api/nhom-nghien-cuu',
    { tenNhom },
    {
      headers: taoHeadersSinhVien(studentCode),
    }
  );
}

async function moiThanhVienVaoNhom(studentCode, groupId, maSinhVien) {
  return apiClient.postJson(
    `/api/nhom-nghien-cuu/${groupId}/moi-thanh-vien`,
    { maSinhVien },
    {
      headers: taoHeadersSinhVien(studentCode),
    }
  );
}

async function layGoiYGhepNhom(studentCode) {
  const response = await apiClient.getJson('/api/goi-y-ghep-nhom', {
    headers: taoHeadersSinhVien(studentCode),
  });

  return mapMatchingResponse(response.data);
}

async function chapNhanLoiMoi(studentCode, invitationId) {
  return apiClient.postJson(
    `/api/loi-moi-nhom/${invitationId}/chap-nhan`,
    {},
    {
      headers: taoHeadersSinhVien(studentCode),
    }
  );
}

async function tuChoiLoiMoi(studentCode, invitationId) {
  return apiClient.postJson(
    `/api/loi-moi-nhom/${invitationId}/tu-choi`,
    {},
    {
      headers: taoHeadersSinhVien(studentCode),
    }
  );
}

function mapLecturerCandidateGroup(group) {
  return {
    id: String(group.id),
    name: group.tenNhom,
    status: group.trangThai,
    memberCount: group.soLuongThanhVien,
    researchAreaCode: group.mangNghienCuu.maMang,
    researchAreaName: group.mangNghienCuu.tenMang,
    leaderName: group.truongNhom.hoTen,
    leaderStudentCode: group.truongNhom.maSinhVien,
    members: group.thanhVien.map((member) => ({
      id: String(member.id),
      fullName: member.hoTen,
      studentCode: member.maSinhVien,
      role: member.vaiTro,
    })),
    isSpecializationMatch: group.phuHopChuyenMon,
    lecturerName: group.giangVienHuongDan?.hoTen || null,
  };
}

async function layDanhSachNhomCoTheNhan(lecturerCode) {
  const response = await apiClient.getJson('/api/giang-vien/nhom/co-the-nhan', {
    headers: taoHeadersGiangVien(lecturerCode),
  });

  return (response.data || []).map(mapLecturerCandidateGroup);
}

async function layChiTietNhomChoGiangVien(lecturerCode, groupId) {
  const response = await apiClient.getJson(`/api/giang-vien/nhom/${groupId}`, {
    headers: taoHeadersGiangVien(lecturerCode),
  });

  return mapLecturerCandidateGroup(response.data);
}

async function nhanHuongDanNhom(lecturerCode, groupId) {
  return apiClient.postJson(
    `/api/giang-vien/nhom/${groupId}/nhan-huong-dan`,
    {},
    {
      headers: taoHeadersGiangVien(lecturerCode),
    }
  );
}

function mapStudentTopicOverview(payload) {
  return {
    group: payload.nhom
      ? {
          id: String(payload.nhom.id),
          name: payload.nhom.tenNhom,
          status: payload.nhom.trangThai,
          memberCount: payload.nhom.soLuongThanhVien,
          researchAreaName: payload.nhom.tenMang,
          lecturerName: payload.nhom.tenGiangVien,
        }
      : null,
    topic: payload.deTai
      ? {
          id: String(payload.deTai.id),
          title: payload.deTai.tenDeTai,
          type: payload.deTai.loaiDeTai,
          status: payload.deTai.trangThai,
          problemDescription: payload.deTai.moTaVanDe,
          researchGoals: payload.deTai.mucTieuNghienCuu,
          practicalApplication: payload.deTai.ungDungThucTien || '',
          researchScope: payload.deTai.phamViNghienCuu || '',
          technologyStack: payload.deTai.congNgheSuDung || '',
          reason: payload.deTai.lyDoLuaChon || '',
          lecturerComment: payload.deTai.nhanXetGiangVien || '',
          revisionNote: payload.deTai.ghiChuChinhSua || '',
          revisionCount: payload.deTai.soLanChinhSua || 0,
          submittedAt: payload.deTai.thoiGianNop,
          reviewedAt: payload.deTai.thoiGianDuyet,
          finalizedAt: payload.deTai.thoiGianChot,
          editDeadline: payload.deTai.hanChinhSua,
        }
      : null,
    permissions: {
      canSubmit: Boolean(payload.quyenThaoTac?.coTheNop),
      canEdit: Boolean(payload.quyenThaoTac?.coTheChinhSua),
    },
  };
}

async function layDeTaiCuaToi(studentCode) {
  const response = await apiClient.getJson('/api/nop-de-tai/de-tai-cua-toi/co-the-chon', {
    headers: taoHeadersSinhVien(studentCode),
  });

  return mapStudentTopicOverview(response.data);
}

function taoPayloadDeTai(topicDraft) {
  return {
    tenDeTai: topicDraft.title,
    moTaVanDe: topicDraft.problemDescription,
    mucTieuNghienCuu: topicDraft.researchGoals,
    ungDungThucTien: topicDraft.practicalApplication,
    phamViNghienCuu: topicDraft.researchScope,
    congNgheSuDung: topicDraft.technologyStack,
    lyDoLuaChon: topicDraft.reason,
  };
}

async function nopDeTai(studentCode, topicDraft) {
  return apiClient.postJson('/api/nop-de-tai/nop-de-tai', taoPayloadDeTai(topicDraft), {
    headers: taoHeadersSinhVien(studentCode),
  });
}

async function capNhatDeTai(studentCode, topicId, topicDraft) {
  return apiClient.putJson(`/api/nop-de-tai/nop-de-tai/${topicId}`, taoPayloadDeTai(topicDraft), {
    headers: taoHeadersSinhVien(studentCode),
  });
}

function mapProposedTopic(topic) {
  return {
    id: String(topic.id),
    title: topic.tenDeTai,
    type: topic.loaiDeTai,
    status: topic.trangThai,
    problemDescription: topic.moTaVanDe || '',
    researchGoals: topic.mucTieuNghienCuu || '',
    practicalApplication: topic.ungDungThucTien || '',
    researchScope: topic.phamViNghienCuu || '',
    technologyStack: topic.congNgheSuDung || '',
    reason: topic.lyDoLuaChon || '',
    submittedAt: topic.thoiGianNop,
    group: topic.nhom
      ? {
          id: String(topic.nhom.id),
          name: topic.nhom.tenNhom,
        }
      : null,
  };
}

async function layDanhSachDeTaiDeXuat(studentCode) {
  const response = await apiClient.getJson('/api/de-tai-de-xuat', {
    headers: taoHeadersSinhVien(studentCode),
  });

  return (response.data || []).map(mapProposedTopic);
}

async function chonDeTaiDeXuat(studentCode, proposedTopicId) {
  return apiClient.postJson(
    `/api/de-tai-de-xuat/${proposedTopicId}/chon`,
    {},
    {
      headers: taoHeadersSinhVien(studentCode),
    }
  );
}

function mapLecturerTopic(topic) {
  return {
    id: String(topic.id),
    title: topic.tenDeTai,
    type: topic.loaiDeTai,
    status: topic.trangThai,
    problemDescription: topic.moTaVanDe,
    researchGoals: topic.mucTieuNghienCuu,
    practicalApplication: topic.ungDungThucTien || '',
    researchScope: topic.phamViNghienCuu || '',
    technologyStack: topic.congNgheSuDung || '',
    reason: topic.lyDoLuaChon || '',
    lecturerComment: topic.nhanXetGiangVien || '',
    revisionNote: topic.ghiChuChinhSua || '',
    revisionCount: topic.soLanChinhSua || 0,
    submittedAt: topic.thoiGianNop,
    group: {
      id: String(topic.nhom.id),
      name: topic.nhom.tenNhom,
      status: topic.nhom.trangThai,
      researchAreaName: topic.nhom.tenMang,
      members: topic.nhom.thanhVien.map((member) => ({
        id: String(member.id),
        fullName: member.hoTen,
        studentCode: member.maSinhVien,
        role: member.vaiTro,
      })),
    },
  };
}

async function layDanhSachDeTaiChoDuyet(lecturerCode) {
  const response = await apiClient.getJson('/api/duyet-de-tai/giang-vien/de-tai-cho-duyet', {
    headers: taoHeadersGiangVien(lecturerCode),
  });

  return (response.data || []).map(mapLecturerTopic);
}

async function duyetDeTai(lecturerCode, topicId, nhanXet) {
  return apiClient.postJson(
    `/api/duyet-de-tai/giang-vien/de-tai/${topicId}/duyet`,
    { nhanXet },
    {
      headers: taoHeadersGiangVien(lecturerCode),
    }
  );
}

async function yeuCauChinhSuaDeTai(lecturerCode, topicId, nhanXet) {
  return apiClient.postJson(
    `/api/duyet-de-tai/giang-vien/de-tai/${topicId}/yeu-cau-chinh-sua`,
    { nhanXet },
    {
      headers: taoHeadersGiangVien(lecturerCode),
    }
  );
}

async function tuChoiDeTai(lecturerCode, topicId, nhanXet) {
  return apiClient.postJson(
    `/api/duyet-de-tai/giang-vien/de-tai/${topicId}/tu-choi`,
    { nhanXet },
    {
      headers: taoHeadersGiangVien(lecturerCode),
    }
  );
}

async function chotDeTai(lecturerCode, topicId) {
  return apiClient.postJson(
    `/api/duyet-de-tai/giang-vien/de-tai/${topicId}/chot`,
    {},
    {
      headers: taoHeadersGiangVien(lecturerCode),
    }
  );
}

function mapLecturerCurrentGroup(group) {
  return {
    id: String(group.id),
    name: group.tenNhom,
    status: group.trangThai,
    memberCount: group.soLuongThanhVien,
    researchAreaCode: group.mangNghienCuu?.maMang || '',
    researchAreaName: group.mangNghienCuu?.tenMang || '',
    leaderName: group.truongNhom?.hoTen || '',
    leaderStudentCode: group.truongNhom?.maSinhVien || '',
    members: (group.thanhVien || []).map((member) => ({
      id: String(member.id),
      fullName: member.hoTen,
      studentCode: member.maSinhVien,
      role: member.vaiTro,
    })),
    isSpecializationMatch: group.phuHopChuyenMon,
    lecturerName: group.giangVienHuongDan?.hoTen || null,
    topic: group.deTai
      ? {
          id: String(group.deTai.id),
          title: group.deTai.tenDeTai,
          status: group.deTai.trangThai,
          type: group.deTai.loaiDeTai,
          revisionCount: group.deTai.soLanChinhSua || 0,
          submittedAt: group.deTai.thoiGianNop,
          reviewedAt: group.deTai.thoiGianDuyet,
          finalizedAt: group.deTai.thoiGianChot,
        }
      : null,
  };
}

async function layDanhSachNhomDangHuongDan(lecturerCode) {
  const response = await apiClient.getJson('/api/giang-vien/nhom/dang-huong-dan', {
    headers: taoHeadersGiangVien(lecturerCode),
  });

  return (response.data || []).map(mapLecturerCurrentGroup);
}

export {
  capNhatDeTai,
  chapNhanLoiMoi,
  chotDeTai,
  chonDeTaiDeXuat,
  dangKyMangNghienCuu,
  duyetDeTai,
  getRegistrationPageData,
  layChiTietNhomChoGiangVien,
  layDanhSachDeTaiChoDuyet,
  layDanhSachDeTaiDeXuat,
  layDanhSachNhomCoTheNhan,
  layDanhSachNhomDangHuongDan,
  layDeTaiCuaToi,
  layGoiYGhepNhom,
  layNhomCuaToi,
  moiThanhVienVaoNhom,
  nhanHuongDanNhom,
  nopDeTai,
  taoNhomNghienCuu,
  tuChoiDeTai,
  tuChoiLoiMoi,
  yeuCauChinhSuaDeTai,
};
