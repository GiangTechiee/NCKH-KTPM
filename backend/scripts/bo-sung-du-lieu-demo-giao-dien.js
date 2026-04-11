require('../node_modules/dotenv').config({ path: `${__dirname}/../.env` });
const { Client } = require('../node_modules/pg');

const STUDENTS = [
  {
    maSinhVien: 'SV001',
    hoTen: 'Nguyễn Minh Anh',
    email: 'sv001@nckh-demo.hou.edu.vn',
    tenLop: 'CNTT01-K17',
    tenKhoa: 'Công nghệ thông tin',
    soDienThoai: '0900000001',
  },
  {
    maSinhVien: 'SV004',
    hoTen: 'Phạm Gia Hân',
    email: 'sv004@nckh-demo.hou.edu.vn',
    tenLop: 'AI01-K17',
    tenKhoa: 'Công nghệ thông tin',
    soDienThoai: '0900000004',
  },
  {
    maSinhVien: 'SV005',
    hoTen: 'Đỗ Đức Minh',
    email: 'sv005@nckh-demo.hou.edu.vn',
    tenLop: 'AI02-K17',
    tenKhoa: 'Công nghệ thông tin',
    soDienThoai: '0900000005',
  },
  {
    maSinhVien: 'SV008',
    hoTen: 'Hoàng Mai Phương',
    email: 'sv008@nckh-demo.hou.edu.vn',
    tenLop: 'CNTT04-K17',
    tenKhoa: 'Công nghệ thông tin',
    soDienThoai: '0900000008',
  },
  {
    maSinhVien: 'SV009',
    hoTen: 'Nguyễn Anh Khoa',
    email: 'sv009@nckh-demo.hou.edu.vn',
    tenLop: 'CNTT05-K17',
    tenKhoa: 'Công nghệ thông tin',
    soDienThoai: '0900000009',
  },
  {
    maSinhVien: 'SV013',
    hoTen: 'Lê Thu Trang',
    email: 'sv013@nckh-demo.hou.edu.vn',
    tenLop: 'CNTT06-K17',
    tenKhoa: 'Công nghệ thông tin',
    soDienThoai: '0900000013',
  },
];

const LECTURERS = [
  {
    maGiangVien: 'GV001',
    hoTen: 'TS. Nguyễn Thị Lan',
    email: 'gv001@nckh-demo.hou.edu.vn',
    tenBoMon: 'Công nghệ phần mềm',
    chuyenMon: 'Phát triển ứng dụng web và kiến trúc hệ thống',
    soNhomHuongDanToiDa: 6,
    soNhomDangHuongDan: 1,
  },
  {
    maGiangVien: 'GV002',
    hoTen: 'TS. Trần Văn Đức',
    email: 'gv002@nckh-demo.hou.edu.vn',
    tenBoMon: 'Hệ thống thông tin',
    chuyenMon: 'Trí tuệ nhân tạo và phân tích dữ liệu',
    soNhomHuongDanToiDa: 5,
    soNhomDangHuongDan: 1,
  },
  {
    maGiangVien: 'GV003',
    hoTen: 'ThS. Phạm Thu Trang',
    email: 'gv003@nckh-demo.hou.edu.vn',
    tenBoMon: 'Điện tử viễn thông',
    chuyenMon: 'IoT và hệ thống nhúng',
    soNhomHuongDanToiDa: 4,
    soNhomDangHuongDan: 0,
  },
];

const RESEARCH_AREAS = [
  {
    maMang: 'WEB-HOU',
    tenMang: 'Phát triển ứng dụng web',
    moTa: 'Xây dựng các hệ thống web phục vụ đào tạo, quản lý và nghiên cứu tại Hanoi Open University.',
  },
  {
    maMang: 'AI-HOU',
    tenMang: 'Trí tuệ nhân tạo ứng dụng',
    moTa: 'Ứng dụng AI vào tư vấn học tập, phân tích dữ liệu học vụ và đánh giá tiến độ đề tài.',
  },
];

function createClient() {
  return new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}

async function ensureStudent(client, student) {
  const inserted = await client.query(
    `
      insert into sinh_vien (
        ma_sinh_vien,
        ho_ten,
        email,
        ten_lop,
        ten_khoa,
        so_dien_thoai
      )
      values ($1, $2, $3, $4, $5, $6)
      on conflict (ma_sinh_vien) do update
      set
        ho_ten = excluded.ho_ten,
        email = excluded.email,
        ten_lop = excluded.ten_lop,
        ten_khoa = excluded.ten_khoa,
        so_dien_thoai = excluded.so_dien_thoai
      returning id
    `,
    [student.maSinhVien, student.hoTen, student.email, student.tenLop, student.tenKhoa, student.soDienThoai]
  );

  return inserted.rows[0].id;
}

async function ensureLecturer(client, lecturer) {
  const inserted = await client.query(
    `
      insert into giang_vien (
        ma_giang_vien,
        ho_ten,
        email,
        ten_bo_mon,
        chuyen_mon,
        so_nhom_huong_dan_toi_da,
        so_nhom_dang_huong_dan
      )
      values ($1, $2, $3, $4, $5, $6, $7)
      on conflict (ma_giang_vien) do update
      set
        ho_ten = excluded.ho_ten,
        email = excluded.email,
        ten_bo_mon = excluded.ten_bo_mon,
        chuyen_mon = excluded.chuyen_mon,
        so_nhom_huong_dan_toi_da = excluded.so_nhom_huong_dan_toi_da,
        so_nhom_dang_huong_dan = excluded.so_nhom_dang_huong_dan
      returning id
    `,
    [
      lecturer.maGiangVien,
      lecturer.hoTen,
      lecturer.email,
      lecturer.tenBoMon,
      lecturer.chuyenMon,
      lecturer.soNhomHuongDanToiDa,
      lecturer.soNhomDangHuongDan,
    ]
  );

  return inserted.rows[0].id;
}

async function ensureResearchArea(client, area) {
  const now = new Date();
  const moDangKy = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dongDangKy = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

  const inserted = await client.query(
    `
      insert into mang_nghien_cuu (
        ma_mang,
        ten_mang,
        mo_ta,
        thoi_gian_mo_dang_ky,
        thoi_gian_dong_dang_ky,
        trang_thai
      )
      values ($1, $2, $3, $4, $5, $6)
      on conflict (ma_mang) do update
      set
        ten_mang = excluded.ten_mang,
        mo_ta = excluded.mo_ta,
        thoi_gian_mo_dang_ky = excluded.thoi_gian_mo_dang_ky,
        thoi_gian_dong_dang_ky = excluded.thoi_gian_dong_dang_ky,
        trang_thai = excluded.trang_thai
      returning id
    `,
    [area.maMang, area.tenMang, area.moTa, moDangKy, dongDangKy, 'OPEN']
  );

  return inserted.rows[0].id;
}

async function ensureRegistration(client, studentId, areaId) {
  const existing = await client.query(
    `
      select id
      from sinh_vien_dang_ky_mang
      where sinh_vien_id = $1 and mang_nghien_cuu_id = $2
      order by thoi_gian_dang_ky desc
      limit 1
    `,
    [studentId, areaId]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }

  const inserted = await client.query(
    `
      insert into sinh_vien_dang_ky_mang (
        sinh_vien_id,
        mang_nghien_cuu_id,
        trang_thai,
        thoi_gian_dang_ky
      )
      values ($1, $2, $3, $4)
      returning id
    `,
    [studentId, areaId, 'REGISTERED', new Date()]
  );

  return inserted.rows[0].id;
}

async function ensureGroup(client, input) {
  const existing = await client.query(
    `
      select id
      from nhom_nghien_cuu
      where mang_nghien_cuu_id = $1 and ten_nhom = $2
      limit 1
    `,
    [input.areaId, input.tenNhom]
  );

  if (existing.rowCount > 0) {
    await client.query(
      `
        update nhom_nghien_cuu
        set
          truong_nhom_sinh_vien_id = $2,
          giang_vien_id = $3,
          trang_thai = $4,
          so_luong_thanh_vien = $5
        where id = $1
      `,
      [existing.rows[0].id, input.truongNhomSinhVienId, input.giangVienId, input.trangThai, input.soLuongThanhVien]
    );

    return existing.rows[0].id;
  }

  const inserted = await client.query(
    `
      insert into nhom_nghien_cuu (
        ten_nhom,
        mang_nghien_cuu_id,
        truong_nhom_sinh_vien_id,
        giang_vien_id,
        trang_thai,
        so_luong_thanh_vien
      )
      values ($1, $2, $3, $4, $5, $6)
      returning id
    `,
    [input.tenNhom, input.areaId, input.truongNhomSinhVienId, input.giangVienId, input.trangThai, input.soLuongThanhVien]
  );

  return inserted.rows[0].id;
}

async function ensureGroupMember(client, input) {
  await client.query(
    `
      insert into thanh_vien_nhom_nghien_cuu (
        nhom_nghien_cuu_id,
        sinh_vien_id,
        vai_tro,
        trang_thai_tham_gia,
        thoi_gian_tham_gia
      )
      values ($1, $2, $3, $4, $5)
      on conflict (nhom_nghien_cuu_id, sinh_vien_id) do update
      set
        vai_tro = excluded.vai_tro,
        trang_thai_tham_gia = excluded.trang_thai_tham_gia,
        thoi_gian_tham_gia = excluded.thoi_gian_tham_gia
    `,
    [input.groupId, input.studentId, input.vaiTro, input.trangThaiThamGia, input.thoiGianThamGia]
  );
}

async function ensureInvitation(client, input) {
  const existing = await client.query(
    `
      select id
      from loi_moi_nhom
      where nhom_nghien_cuu_id = $1 and sinh_vien_duoc_moi_id = $2 and trang_thai = $3
      limit 1
    `,
    [input.groupId, input.invitedStudentId, input.trangThai]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }

  const inserted = await client.query(
    `
      insert into loi_moi_nhom (
        nhom_nghien_cuu_id,
        nguoi_moi_sinh_vien_id,
        sinh_vien_duoc_moi_id,
        trang_thai,
        ly_do_tu_choi,
        thoi_gian_moi,
        thoi_gian_phan_hoi
      )
      values ($1, $2, $3, $4, $5, $6, $7)
      returning id
    `,
    [
      input.groupId,
      input.inviterStudentId,
      input.invitedStudentId,
      input.trangThai,
      input.lyDoTuChoi,
      input.thoiGianMoi,
      input.thoiGianPhanHoi,
    ]
  );

  return inserted.rows[0].id;
}

async function ensureTopic(client, input) {
  const existing = await client.query(
    'select id from de_tai_nghien_cuu where nhom_nghien_cuu_id = $1 limit 1',
    [input.groupId]
  );

  if (existing.rowCount > 0) {
    await client.query(
      `
        update de_tai_nghien_cuu
        set
          giang_vien_id = $2,
          ten_de_tai = $3,
          loai_de_tai = $4,
          mo_ta_van_de = $5,
          muc_tieu_nghien_cuu = $6,
          ung_dung_thuc_tien = $7,
          pham_vi_nghien_cuu = $8,
          cong_nghe_su_dung = $9,
          ly_do_lua_chon = $10,
          nhan_xet_giang_vien = $11,
          trang_thai = $12,
          thoi_gian_nop = $13
        where id = $1
      `,
      [
        existing.rows[0].id,
        input.lecturerId,
        input.tenDeTai,
        input.loaiDeTai,
        input.moTaVanDe,
        input.mucTieuNghienCuu,
        input.ungDungThucTien,
        input.phamViNghienCuu,
        input.congNgheSuDung,
        input.lyDoLuaChon,
        input.nhanXetGiangVien,
        input.trangThai,
        input.thoiGianNop,
      ]
    );

    return existing.rows[0].id;
  }

  const inserted = await client.query(
    `
      insert into de_tai_nghien_cuu (
        nhom_nghien_cuu_id,
        giang_vien_id,
        ten_de_tai,
        loai_de_tai,
        mo_ta_van_de,
        muc_tieu_nghien_cuu,
        ung_dung_thuc_tien,
        pham_vi_nghien_cuu,
        cong_nghe_su_dung,
        ly_do_lua_chon,
        nhan_xet_giang_vien,
        trang_thai,
        thoi_gian_nop
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      returning id
    `,
    [
      input.groupId,
      input.lecturerId,
      input.tenDeTai,
      input.loaiDeTai,
      input.moTaVanDe,
      input.mucTieuNghienCuu,
      input.ungDungThucTien,
      input.phamViNghienCuu,
      input.congNgheSuDung,
      input.lyDoLuaChon,
      input.nhanXetGiangVien,
      input.trangThai,
      input.thoiGianNop,
    ]
  );

  return inserted.rows[0].id;
}

async function ensureNotification(client, input) {
  const existing = await client.query(
    `
      select id
      from thong_bao
      where nguoi_nhan_id = $1 and loai_nguoi_nhan = $2 and tieu_de = $3 and loai_thong_bao = $4
      limit 1
    `,
    [input.nguoiNhanId, input.loaiNguoiNhan, input.tieuDe, input.loaiThongBao]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }

  const inserted = await client.query(
    `
      insert into thong_bao (
        nguoi_nhan_id,
        loai_nguoi_nhan,
        tieu_de,
        noi_dung,
        loai_thong_bao,
        loai_doi_tuong,
        doi_tuong_id
      )
      values ($1, $2, $3, $4, $5, $6, $7)
      returning id
    `,
    [
      input.nguoiNhanId,
      input.loaiNguoiNhan,
      input.tieuDe,
      input.noiDung,
      input.loaiThongBao,
      input.loaiDoiTuong,
      input.doiTuongId,
    ]
  );

  return inserted.rows[0].id;
}

async function ensureAuditLog(client, input) {
  const existing = await client.query(
    `
      select id
      from nhat_ky_kiem_toan
      where nguoi_thuc_hien_id = $1 and hanh_dong = $2 and loai_doi_tuong = $3 and doi_tuong_id = $4
      limit 1
    `,
    [input.nguoiThucHienId, input.hanhDong, input.loaiDoiTuong, input.doiTuongId]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }

  const inserted = await client.query(
    `
      insert into nhat_ky_kiem_toan (
        nguoi_thuc_hien_id,
        vai_tro_nguoi_thuc_hien,
        hanh_dong,
        loai_doi_tuong,
        doi_tuong_id,
        trang_thai_truoc,
        trang_thai_sau,
        du_lieu_bo_sung
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning id
    `,
    [
      input.nguoiThucHienId,
      input.vaiTroNguoiThucHien,
      input.hanhDong,
      input.loaiDoiTuong,
      input.doiTuongId,
      input.trangThaiTruoc ? JSON.stringify(input.trangThaiTruoc) : null,
      input.trangThaiSau ? JSON.stringify(input.trangThaiSau) : null,
      input.duLieuBoSung ? JSON.stringify(input.duLieuBoSung) : null,
    ]
  );

  return inserted.rows[0].id;
}

async function main() {
  const client = createClient();
  await client.connect();
  await client.query('begin');

  try {
    const studentIds = {};
    const lecturerIds = {};
    const areaIds = {};

    for (const student of STUDENTS) {
      studentIds[student.maSinhVien] = await ensureStudent(client, student);
    }

    for (const lecturer of LECTURERS) {
      lecturerIds[lecturer.maGiangVien] = await ensureLecturer(client, lecturer);
    }

    for (const area of RESEARCH_AREAS) {
      areaIds[area.maMang] = await ensureResearchArea(client, area);
    }

    await ensureRegistration(client, studentIds.SV001, areaIds['WEB-HOU']);
    await ensureRegistration(client, studentIds.SV004, areaIds['AI-HOU']);
    await ensureRegistration(client, studentIds.SV005, areaIds['AI-HOU']);
    await ensureRegistration(client, studentIds.SV009, areaIds['WEB-HOU']);
    await ensureRegistration(client, studentIds.SV013, areaIds['WEB-HOU']);

    const webGroupId = await ensureGroup(client, {
      tenNhom: 'Nhóm Web HOU Alpha',
      areaId: areaIds['WEB-HOU'],
      truongNhomSinhVienId: studentIds.SV001,
      giangVienId: lecturerIds.GV001,
      trangThai: 'CHO_DUYET_DE_TAI',
      soLuongThanhVien: 2,
    });

    const aiGroupId = await ensureGroup(client, {
      tenNhom: 'Nhóm AI HOU Vision',
      areaId: areaIds['AI-HOU'],
      truongNhomSinhVienId: studentIds.SV004,
      giangVienId: lecturerIds.GV002,
      trangThai: 'DA_CO_GIANG_VIEN',
      soLuongThanhVien: 1,
    });

    await ensureGroupMember(client, {
      groupId: webGroupId,
      studentId: studentIds.SV001,
      vaiTro: 'TRUONG_NHOM',
      trangThaiThamGia: 'DA_CHAP_NHAN',
      thoiGianThamGia: new Date(),
    });
    await ensureGroupMember(client, {
      groupId: webGroupId,
      studentId: studentIds.SV013,
      vaiTro: 'THANH_VIEN',
      trangThaiThamGia: 'DA_CHAP_NHAN',
      thoiGianThamGia: new Date(),
    });
    await ensureGroupMember(client, {
      groupId: aiGroupId,
      studentId: studentIds.SV004,
      vaiTro: 'TRUONG_NHOM',
      trangThaiThamGia: 'DA_CHAP_NHAN',
      thoiGianThamGia: new Date(),
    });

    const pendingInvitationId = await ensureInvitation(client, {
      groupId: aiGroupId,
      inviterStudentId: studentIds.SV004,
      invitedStudentId: studentIds.SV005,
      trangThai: 'CHO_XAC_NHAN',
      lyDoTuChoi: null,
      thoiGianMoi: new Date(),
      thoiGianPhanHoi: null,
    });

    const topicId = await ensureTopic(client, {
      groupId: webGroupId,
      lecturerId: lecturerIds.GV001,
      tenDeTai: 'Hệ thống quản lý đề tài nghiên cứu sinh viên HOU',
      loaiDeTai: 'NHOM_DE_XUAT',
      moTaVanDe: 'Xây dựng hệ thống hỗ trợ đăng ký mảng, tạo nhóm và theo dõi tiến độ đề tài.',
      mucTieuNghienCuu: 'Số hóa quy trình nghiên cứu khoa học sinh viên tại Hanoi Open University.',
      ungDungThucTien: 'Hỗ trợ khoa CNTT và phòng khoa học công nghệ quản lý đề tài tập trung.',
      phamViNghienCuu: 'Đăng ký mảng, tạo nhóm, mời thành viên, giảng viên duyệt đề tài.',
      congNgheSuDung: 'React, Node.js, TypeScript, Prisma, PostgreSQL',
      lyDoLuaChon: 'Đề tài gắn sát nhu cầu demo UI và hoàn thiện quy trình backend.',
      nhanXetGiangVien: 'Dữ liệu demo đã sẵn sàng cho frontend kiểm thử dropdown và workflow.',
      trangThai: 'CHO_GIANG_VIEN_DUYET',
      thoiGianNop: new Date(),
    });

    await ensureNotification(client, {
      nguoiNhanId: studentIds.SV005,
      loaiNguoiNhan: 'SINH_VIEN',
      tieuDe: 'Bạn vừa nhận được lời mời vào nhóm nghiên cứu',
      noiDung: 'Nhóm AI HOU Vision đang chờ bạn phản hồi lời mời tham gia.',
      loaiThongBao: 'MOI_VAO_NHOM',
      loaiDoiTuong: 'LOI_MOI_NHOM',
      doiTuongId: pendingInvitationId,
    });

    await ensureNotification(client, {
      nguoiNhanId: lecturerIds.GV001,
      loaiNguoiNhan: 'GIANG_VIEN',
      tieuDe: 'Có đề tài mới chờ giảng viên duyệt',
      noiDung: 'Nhóm Web HOU Alpha đã nộp đề tài cho giảng viên hướng dẫn.',
      loaiThongBao: 'NOP_DE_TAI',
      loaiDoiTuong: 'DE_TAI_NGHIEN_CUU',
      doiTuongId: topicId,
    });

    await ensureAuditLog(client, {
      nguoiThucHienId: studentIds.SV001,
      vaiTroNguoiThucHien: 'SINH_VIEN',
      hanhDong: 'TAO_NHOM',
      loaiDoiTuong: 'NHOM_NGHIEN_CUU',
      doiTuongId: webGroupId,
      trangThaiTruoc: null,
      trangThaiSau: {
        tenNhom: 'Nhóm Web HOU Alpha',
        trangThai: 'CHO_DUYET_DE_TAI',
        soLuongThanhVien: 2,
      },
      duLieuBoSung: null,
    });

    await ensureAuditLog(client, {
      nguoiThucHienId: studentIds.SV004,
      vaiTroNguoiThucHien: 'SINH_VIEN',
      hanhDong: 'MOI_THANH_VIEN',
      loaiDoiTuong: 'LOI_MOI_NHOM',
      doiTuongId: pendingInvitationId,
      trangThaiTruoc: null,
      trangThaiSau: { trangThai: 'CHO_XAC_NHAN' },
      duLieuBoSung: {
        nhomNghienCuuId: String(aiGroupId),
        sinhVienDuocMoiId: String(studentIds.SV005),
      },
    });

    await client.query('commit');
    console.log(
      JSON.stringify(
        {
          message: 'Đã bổ sung dữ liệu demo giao diện thành công',
          quickAccess: {
            noAreaStudent: 'SV008',
            registeredNoGroupStudent: 'SV009',
            activeGroupLeader: 'SV001',
            pendingInvitationStudent: 'SV005',
            lecturerPendingReview: 'GV001',
            lecturerAssignedGroup: 'GV002',
          },
        },
        null,
        2
      )
    );
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
