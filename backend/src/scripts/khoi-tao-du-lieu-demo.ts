import { Prisma, PrismaClient } from '@prisma/client';
import { AuditAction, AuditEntityType, GroupMemberRole, GroupStatus, InvitationStatus, MemberJoinStatus, ResearchAreaStatus, TopicSource, TopicSubmissionStatus, UserRole } from '../common/constants';
import { createPrismaClient } from '../infrastructure/database/trinh-khach-prisma';

type StudentSeed = {
  maSinhVien: string;
  hoTen: string;
  email: string;
  tenLop: string;
  tenKhoa: string;
  soDienThoai: string;
};

type LecturerSeed = {
  maGiangVien: string;
  hoTen: string;
  email: string;
  tenBoMon: string;
  chuyenMon: string;
  soNhomHuongDanToiDa: number;
  soNhomDangHuongDan: number;
};

type ResearchAreaSeed = {
  maMang: string;
  tenMang: string;
  moTa: string;
};

type StudentMap = Record<string, { id: bigint; hoTen: string; maSinhVien: string }>;
type LecturerMap = Record<string, { id: bigint; hoTen: string; maGiangVien: string }>;
type ResearchAreaMap = Record<string, { id: bigint; tenMang: string; maMang: string }>;
type GroupMap = Record<string, { id: bigint; tenNhom: string }>;
type DbClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$extends' | '$on' | '$use'>;

const demoStudents: readonly StudentSeed[] = [
  {
    maSinhVien: 'SV001',
    hoTen: 'Nguyễn Minh Anh',
    email: 'sv001@nckh-demo.hou.edu.vn',
    tenLop: 'CNTT01-K17',
    tenKhoa: 'Công nghệ thông tin',
    soDienThoai: '0900000001',
  },
  {
    maSinhVien: 'SV002',
    hoTen: 'Trần Thu Hà',
    email: 'sv002@nckh-demo.hou.edu.vn',
    tenLop: 'CNTT02-K17',
    tenKhoa: 'Công nghệ thông tin',
    soDienThoai: '0900000002',
  },
  {
    maSinhVien: 'SV003',
    hoTen: 'Lê Quang Huy',
    email: 'sv003@nckh-demo.hou.edu.vn',
    tenLop: 'CNTT03-K17',
    tenKhoa: 'Công nghệ thông tin',
    soDienThoai: '0900000003',
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
    maSinhVien: 'SV006',
    hoTen: 'Vũ Khánh Linh',
    email: 'sv006@nckh-demo.hou.edu.vn',
    tenLop: 'IOT01-K17',
    tenKhoa: 'Điện tử - Viễn thông',
    soDienThoai: '0900000006',
  },
  {
    maSinhVien: 'SV007',
    hoTen: 'Bùi Nhật Nam',
    email: 'sv007@nckh-demo.hou.edu.vn',
    tenLop: 'IOT02-K17',
    tenKhoa: 'Điện tử - Viễn thông',
    soDienThoai: '0900000007',
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
    maSinhVien: 'SV010',
    hoTen: 'Tạ Bảo Châu',
    email: 'sv010@nckh-demo.hou.edu.vn',
    tenLop: 'IOT03-K17',
    tenKhoa: 'Điện tử - Viễn thông',
    soDienThoai: '0900000010',
  },
];

const demoLecturers: readonly LecturerSeed[] = [
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

const demoResearchAreas: readonly ResearchAreaSeed[] = [
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
  {
    maMang: 'IOT-HOU',
    tenMang: 'Internet of Things và hệ thống nhúng',
    moTa: 'Nghiên cứu các giải pháp IoT, thu thập dữ liệu và tự động hóa trong môi trường đại học mở.',
  },
];

function formatForLog(value: unknown): string {
  return JSON.stringify(
    value,
    (_key, currentValue) => (typeof currentValue === 'bigint' ? currentValue.toString() : currentValue),
    2
  );
}

async function ensureCoreTablesAreEmpty(prisma: DbClient): Promise<void> {
  const [studentCount, lecturerCount, areaCount, registrationCount, groupCount, invitationCount, topicCount] = await Promise.all([
    prisma.sinhVien.count(),
    prisma.giangVien.count(),
    prisma.mangNghienCuu.count(),
    prisma.sinhVienDangKyMang.count(),
    prisma.nhomNghienCuu.count(),
    prisma.loiMoiNhom.count(),
    prisma.deTaiNghienCuu.count(),
  ]);

  const hasExistingData = [studentCount, lecturerCount, areaCount, registrationCount, groupCount, invitationCount, topicCount].some(
    (count) => count > 0
  );

  if (hasExistingData) {
    throw new Error(
      `Database already contains data. Refusing to seed demo dataset automatically. Counts: ${formatForLog({
        studentCount,
        lecturerCount,
        areaCount,
        registrationCount,
        groupCount,
        invitationCount,
        topicCount,
      })}`
    );
  }
}

async function buildStudentMap(prisma: DbClient): Promise<StudentMap> {
  const students = await prisma.sinhVien.findMany({
    where: { maSinhVien: { in: demoStudents.map((student) => student.maSinhVien) } },
    select: { id: true, maSinhVien: true, hoTen: true },
  });

  return students.reduce<StudentMap>((accumulator, student) => {
    accumulator[student.maSinhVien] = student;
    return accumulator;
  }, {});
}

async function buildLecturerMap(prisma: DbClient): Promise<LecturerMap> {
  const lecturers = await prisma.giangVien.findMany({
    where: { maGiangVien: { in: demoLecturers.map((lecturer) => lecturer.maGiangVien) } },
    select: { id: true, maGiangVien: true, hoTen: true },
  });

  return lecturers.reduce<LecturerMap>((accumulator, lecturer) => {
    accumulator[lecturer.maGiangVien] = lecturer;
    return accumulator;
  }, {});
}

async function buildResearchAreaMap(prisma: DbClient): Promise<ResearchAreaMap> {
  const researchAreas = await prisma.mangNghienCuu.findMany({
    where: { maMang: { in: demoResearchAreas.map((area) => area.maMang) } },
    select: { id: true, maMang: true, tenMang: true },
  });

  return researchAreas.reduce<ResearchAreaMap>((accumulator, area) => {
    accumulator[area.maMang] = area;
    return accumulator;
  }, {});
}

function requireEntity<T>(value: T | undefined, message: string): T {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

async function seedDemoData(prisma: PrismaClient): Promise<void> {
  await ensureCoreTablesAreEmpty(prisma);

  const now = new Date();
  const registrationOpenAt = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const registrationCloseAt = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
  const topicSubmittedAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  await prisma.$transaction(async (tx) => {
    await tx.sinhVien.createMany({
      data: [...demoStudents],
    });

    await tx.giangVien.createMany({
      data: [...demoLecturers],
    });

    await tx.mangNghienCuu.createMany({
      data: demoResearchAreas.map((area) => ({
        ...area,
        thoiGianMoDangKy: registrationOpenAt,
        thoiGianDongDangKy: registrationCloseAt,
        trangThai: ResearchAreaStatus.OPEN,
      })),
    });

    const students = await buildStudentMap(tx);
    const lecturers = await buildLecturerMap(tx);
    const researchAreas = await buildResearchAreaMap(tx);

    const webArea = requireEntity(researchAreas['WEB-HOU'], 'Missing WEB-HOU research area after seeding');
    const aiArea = requireEntity(researchAreas['AI-HOU'], 'Missing AI-HOU research area after seeding');
    const iotArea = requireEntity(researchAreas['IOT-HOU'], 'Missing IOT-HOU research area after seeding');

    const registrations = [
      { studentCode: 'SV001', areaId: webArea.id },
      { studentCode: 'SV002', areaId: webArea.id },
      { studentCode: 'SV003', areaId: webArea.id },
      { studentCode: 'SV004', areaId: aiArea.id },
      { studentCode: 'SV005', areaId: aiArea.id },
      { studentCode: 'SV006', areaId: iotArea.id },
      { studentCode: 'SV007', areaId: iotArea.id },
      { studentCode: 'SV009', areaId: webArea.id },
      { studentCode: 'SV010', areaId: iotArea.id },
    ];

    await tx.sinhVienDangKyMang.createMany({
      data: registrations.map((registration) => ({
        sinhVienId: requireEntity(students[registration.studentCode], `Missing student ${registration.studentCode}`).id,
        mangNghienCuuId: registration.areaId,
        thoiGianDangKy: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        trangThai: 'REGISTERED',
      })),
    });

    const registrationRecords = await tx.sinhVienDangKyMang.findMany({
      where: {
        sinhVienId: {
          in: registrations.map((registration) => requireEntity(students[registration.studentCode], `Missing student ${registration.studentCode}`).id),
        },
      },
      select: { id: true, sinhVienId: true, mangNghienCuuId: true },
    });

    const registrationMap = registrationRecords.reduce<Record<string, { id: bigint }>>((accumulator, registration) => {
      accumulator[`${registration.sinhVienId.toString()}-${registration.mangNghienCuuId.toString()}`] = { id: registration.id };
      return accumulator;
    }, {});

    const webLeader = requireEntity(students.SV001, 'Missing SV001');
    const aiLeader = requireEntity(students.SV004, 'Missing SV004');
    const iotLeader = requireEntity(students.SV006, 'Missing SV006');
    const lecturerOne = requireEntity(lecturers.GV001, 'Missing GV001');
    const lecturerTwo = requireEntity(lecturers.GV002, 'Missing GV002');

    const createdGroups = await Promise.all([
      tx.nhomNghienCuu.create({
        data: {
          tenNhom: 'Nhóm Web HOU Alpha',
          mangNghienCuuId: webArea.id,
          truongNhomSinhVienId: webLeader.id,
          giangVienId: lecturerOne.id,
          trangThai: GroupStatus.CHO_DUYET_DE_TAI,
          soLuongThanhVien: 3,
        },
        select: { id: true, tenNhom: true },
      }),
      tx.nhomNghienCuu.create({
        data: {
          tenNhom: 'Nhóm AI HOU Vision',
          mangNghienCuuId: aiArea.id,
          truongNhomSinhVienId: aiLeader.id,
          trangThai: GroupStatus.DANG_TUYEN_THANH_VIEN,
          soLuongThanhVien: 1,
        },
        select: { id: true, tenNhom: true },
      }),
      tx.nhomNghienCuu.create({
        data: {
          tenNhom: 'Nhóm IoT HOU Pioneer',
          mangNghienCuuId: iotArea.id,
          truongNhomSinhVienId: iotLeader.id,
          giangVienId: lecturerTwo.id,
          trangThai: GroupStatus.DA_CO_GIANG_VIEN,
          soLuongThanhVien: 2,
        },
        select: { id: true, tenNhom: true },
      }),
    ]);

    const groups = createdGroups.reduce<GroupMap>((accumulator, group) => {
      accumulator[group.tenNhom] = group;
      return accumulator;
    }, {});

    const webGroup = requireEntity(groups['Nhóm Web HOU Alpha'], 'Missing web group');
    const aiGroup = requireEntity(groups['Nhóm AI HOU Vision'], 'Missing AI group');
    const iotGroup = requireEntity(groups['Nhóm IoT HOU Pioneer'], 'Missing IoT group');

    await tx.thanhVienNhomNghienCuu.createMany({
      data: [
        {
          nhomNghienCuuId: webGroup.id,
          sinhVienId: webLeader.id,
          vaiTro: GroupMemberRole.TRUONG_NHOM,
          trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          thoiGianThamGia: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        },
        {
          nhomNghienCuuId: webGroup.id,
          sinhVienId: requireEntity(students.SV002, 'Missing SV002').id,
          vaiTro: GroupMemberRole.THANH_VIEN,
          trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          thoiGianThamGia: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          nhomNghienCuuId: webGroup.id,
          sinhVienId: requireEntity(students.SV003, 'Missing SV003').id,
          vaiTro: GroupMemberRole.THANH_VIEN,
          trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          thoiGianThamGia: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          nhomNghienCuuId: aiGroup.id,
          sinhVienId: aiLeader.id,
          vaiTro: GroupMemberRole.TRUONG_NHOM,
          trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          thoiGianThamGia: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          nhomNghienCuuId: iotGroup.id,
          sinhVienId: iotLeader.id,
          vaiTro: GroupMemberRole.TRUONG_NHOM,
          trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          thoiGianThamGia: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          nhomNghienCuuId: iotGroup.id,
          sinhVienId: requireEntity(students.SV007, 'Missing SV007').id,
          vaiTro: GroupMemberRole.THANH_VIEN,
          trangThaiThamGia: MemberJoinStatus.DA_CHAP_NHAN,
          thoiGianThamGia: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        },
      ],
    });

    const invitations = await Promise.all([
      tx.loiMoiNhom.create({
        data: {
          nhomNghienCuuId: aiGroup.id,
          nguoiMoiSinhVienId: aiLeader.id,
          sinhVienDuocMoiId: requireEntity(students.SV005, 'Missing SV005').id,
          trangThai: InvitationStatus.CHO_XAC_NHAN,
          thoiGianMoi: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        },
      }),
      tx.loiMoiNhom.create({
        data: {
          nhomNghienCuuId: iotGroup.id,
          nguoiMoiSinhVienId: iotLeader.id,
          sinhVienDuocMoiId: requireEntity(students.SV010, 'Missing SV010').id,
          trangThai: InvitationStatus.DA_TU_CHOI,
          lyDoTuChoi: 'Em đang ưu tiên đề tài phần cứng IoT khác.',
          thoiGianMoi: new Date(now.getTime() - 30 * 60 * 60 * 1000),
          thoiGianPhanHoi: new Date(now.getTime() - 20 * 60 * 60 * 1000),
        },
      }),
    ]);

    const pendingInvitation = invitations[0];
    const rejectedInvitation = invitations[1];

    const webTopic = await tx.deTaiNghienCuu.create({
      data: {
        nhomNghienCuuId: webGroup.id,
        giangVienId: lecturerOne.id,
        tenDeTai: 'Hệ thống quản lý đề tài nghiên cứu sinh viên HOU',
        loaiDeTai: TopicSource.NHOM_DE_XUAT,
        moTaVanDe: 'Xây dựng hệ thống hỗ trợ sinh viên đăng ký mảng nghiên cứu, tạo nhóm và theo dõi tiến độ đề tài.',
        mucTieuNghienCuu: 'Số hóa quy trình nghiên cứu khoa học sinh viên tại Hanoi Open University.',
        ungDungThucTien: 'Hỗ trợ Phòng Khoa học Công nghệ và Khoa Công nghệ thông tin quản lý thông tin đề tài tập trung.',
        phamViNghienCuu: 'Tập trung vào quy trình đăng ký mảng, tạo nhóm, ghép nhóm và duyệt đề tài.',
        congNgheSuDung: 'React, Node.js, TypeScript, Prisma, PostgreSQL',
        lyDoLuaChon: 'Đề tài sát với nhu cầu chuyển đổi số trong quản lý nghiên cứu khoa học sinh viên.',
        nhanXetGiangVien: 'Cần bổ sung thêm luồng nghiệp vụ cho vai trò giảng viên.',
        ghiChuChinhSua: null,
        soLanChinhSua: 0,
        trangThai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
        thoiGianNop: topicSubmittedAt,
      },
    });

    await tx.danhMucDeTaiGiangVien.createMany({
      data: [
        {
          giangVienId: lecturerOne.id,
          mangNghienCuuId: webArea.id,
          tenDeTai: 'Cổng quản lý tiến độ nghiên cứu khoa học sinh viên theo thời gian thực',
          moTaVanDe: 'Xây dựng cổng web giúp giảng viên và sinh viên theo dõi tiến độ nghiên cứu, mốc công việc, phản hồi và cảnh báo chậm tiến độ.',
          mucTieuNghienCuu: 'Thiết kế hệ thống web hỗ trợ quản lý tiến độ đề tài, cộng tác nhóm và phản hồi giữa sinh viên với giảng viên.',
          ungDungThucTien: 'Hỗ trợ quản lý đề tài khoa học sinh viên tập trung, minh bạch và thuận tiện hơn cho khoa CNTT.',
          phamViNghienCuu: 'Tập trung vào nhóm nghiên cứu sinh viên trong nội bộ trường với workflow từ đăng ký đến duyệt đề tài.',
          congNgheSuDung: 'React, Node.js, TypeScript, Prisma, PostgreSQL',
          lyDoLuaChon: 'Đề tài bám sát bài toán của hệ thống demo hiện tại và phù hợp mảng phát triển ứng dụng web.',
          trangThai: 'ACTIVE',
        },
        {
          giangVienId: lecturerTwo.id,
          mangNghienCuuId: aiArea.id,
          tenDeTai: 'Hệ thống gợi ý lộ trình học tập cá nhân hóa cho sinh viên HOU bằng AI',
          moTaVanDe: 'Xây dựng mô hình gợi ý học phần, tài nguyên học tập và tiến độ nghiên cứu cá nhân hóa dựa trên dữ liệu học tập của sinh viên.',
          mucTieuNghienCuu: 'Đề xuất kiến trúc dữ liệu và thuật toán gợi ý giúp sinh viên lựa chọn lộ trình học tập phù hợp với năng lực và mục tiêu nghiên cứu.',
          ungDungThucTien: 'Hỗ trợ cố vấn học tập, giảng viên và sinh viên theo dõi tiến độ, đề xuất học phần và giảm nguy cơ chậm tiến độ.',
          phamViNghienCuu: 'Tập trung vào dữ liệu học tập nội bộ, dashboard giám sát và mô hình gợi ý mức cơ bản đến trung bình.',
          congNgheSuDung: 'Python, FastAPI, PostgreSQL, scikit-learn, React',
          lyDoLuaChon: 'Phù hợp định hướng AI ứng dụng và có giá trị thực tế rõ ràng trong môi trường đại học mở.',
          trangThai: 'ACTIVE',
        },
        {
          giangVienId: lecturerTwo.id,
          mangNghienCuuId: iotArea.id,
          tenDeTai: 'Nền tảng thu thập dữ liệu cảm biến phục vụ giám sát lớp học thông minh',
          moTaVanDe: 'Nghiên cứu nền tảng thu thập dữ liệu từ cảm biến môi trường để giám sát điều kiện học tập và hỗ trợ vận hành lớp học thông minh.',
          mucTieuNghienCuu: 'Thiết kế giải pháp cảm biến, truyền dữ liệu và dashboard hiển thị theo thời gian thực cho bối cảnh đại học mở.',
          ungDungThucTien: 'Có thể ứng dụng trong phòng học, phòng thực hành và không gian nghiên cứu để cảnh báo điều kiện bất thường.',
          phamViNghienCuu: 'Tập trung vào nhiệt độ, độ ẩm, tiếng ồn, ánh sáng và mô phỏng hạ tầng IoT cỡ nhỏ.',
          congNgheSuDung: 'ESP32, MQTT, Node.js, React, PostgreSQL',
          lyDoLuaChon: 'Đề tài giúp demo tốt tính ứng dụng của IoT trong môi trường giáo dục và dễ mở rộng về sau.',
          trangThai: 'ACTIVE',
        },
      ],
    });

    const notifications = [
      {
        nguoiNhanId: webLeader.id,
        loaiNguoiNhan: UserRole.SINH_VIEN,
        tieuDe: 'Nhóm nghiên cứu đã được tạo thành công',
        noiDung: 'Nhóm Web HOU Alpha đã sẵn sàng cho quá trình duyệt đề tài.',
        loaiThongBao: 'TAO_NHOM_THANH_CONG',
        loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
        doiTuongId: webGroup.id,
      },
      {
        nguoiNhanId: requireEntity(students.SV005, 'Missing SV005').id,
        loaiNguoiNhan: UserRole.SINH_VIEN,
        tieuDe: 'Bạn vừa nhận được lời mời vào nhóm nghiên cứu',
        noiDung: 'Nhóm AI HOU Vision đang chờ bạn phản hồi lời mời tham gia.',
        loaiThongBao: 'MOI_VAO_NHOM',
        loaiDoiTuong: AuditEntityType.LOI_MOI_NHOM,
        doiTuongId: pendingInvitation.id,
      },
      {
        nguoiNhanId: lecturerOne.id,
        loaiNguoiNhan: UserRole.GIANG_VIEN,
        tieuDe: 'Có đề tài mới chờ giảng viên duyệt',
        noiDung: 'Nhóm Web HOU Alpha đã nộp đề tài cho giảng viên hướng dẫn.',
        loaiThongBao: 'NOP_DE_TAI',
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: webTopic.id,
      },
      {
        nguoiNhanId: iotLeader.id,
        loaiNguoiNhan: UserRole.SINH_VIEN,
        tieuDe: 'Lời mời vào nhóm đã bị từ chối',
        noiDung: 'Sinh viên SV010 đã từ chối lời mời tham gia Nhóm IoT HOU Pioneer.',
        loaiThongBao: 'LOI_MOI_BI_TU_CHOI',
        loaiDoiTuong: AuditEntityType.LOI_MOI_NHOM,
        doiTuongId: rejectedInvitation.id,
      },
    ] satisfies Prisma.ThongBaoCreateManyInput[];

    await tx.thongBao.createMany({ data: notifications });

    const auditLogs = [
      {
        nguoiThucHienId: webLeader.id,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.DANG_KY_MANG,
        loaiDoiTuong: AuditEntityType.SINH_VIEN_DANG_KY_MANG,
        doiTuongId: requireEntity(
          registrationMap[`${webLeader.id.toString()}-${webArea.id.toString()}`],
          'Missing registration record for SV001'
        ).id,
        trangThaiSau: {
          sinhVienId: webLeader.id.toString(),
          mangNghienCuuId: webArea.id.toString(),
          trangThai: 'REGISTERED',
        },
      },
      {
        nguoiThucHienId: webLeader.id,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.TAO_NHOM,
        loaiDoiTuong: AuditEntityType.NHOM_NGHIEN_CUU,
        doiTuongId: webGroup.id,
        trangThaiSau: {
          tenNhom: webGroup.tenNhom,
          trangThai: GroupStatus.CHO_DUYET_DE_TAI,
          soLuongThanhVien: 3,
        },
      },
      {
        nguoiThucHienId: aiLeader.id,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.MOI_THANH_VIEN,
        loaiDoiTuong: AuditEntityType.LOI_MOI_NHOM,
        doiTuongId: pendingInvitation.id,
        trangThaiSau: { trangThai: InvitationStatus.CHO_XAC_NHAN },
        duLieuBoSung: {
          nhomNghienCuuId: aiGroup.id.toString(),
          sinhVienDuocMoiId: requireEntity(students.SV005, 'Missing SV005').id.toString(),
        },
      },
      {
        nguoiThucHienId: iotLeader.id,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.TU_CHOI_LOI_MOI,
        loaiDoiTuong: AuditEntityType.LOI_MOI_NHOM,
        doiTuongId: rejectedInvitation.id,
        trangThaiTruoc: { trangThai: InvitationStatus.CHO_XAC_NHAN },
        trangThaiSau: { trangThai: InvitationStatus.DA_TU_CHOI },
        duLieuBoSung: { lyDoTuChoi: rejectedInvitation.lyDoTuChoi },
      },
      {
        nguoiThucHienId: webLeader.id,
        vaiTroNguoiThucHien: UserRole.SINH_VIEN,
        hanhDong: AuditAction.NOP_DE_TAI,
        loaiDoiTuong: AuditEntityType.DE_TAI_NGHIEN_CUU,
        doiTuongId: webTopic.id,
        trangThaiSau: { trangThai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET },
      },
    ] satisfies Prisma.NhatKyKiemToanCreateManyInput[];

    await tx.nhatKyKiemToan.createMany({ data: auditLogs });
  });
}

async function main(): Promise<void> {
  const prisma = createPrismaClient();

  try {
    await seedDemoData(prisma);

    const summary = await Promise.all([
      prisma.sinhVien.count(),
      prisma.giangVien.count(),
      prisma.mangNghienCuu.count(),
      prisma.sinhVienDangKyMang.count(),
      prisma.nhomNghienCuu.count(),
      prisma.loiMoiNhom.count(),
      prisma.deTaiNghienCuu.count(),
      prisma.thongBao.count(),
      prisma.nhatKyKiemToan.count(),
    ]);

    console.log(
      formatForLog({
        message: 'Seeded HOU demo data successfully',
        counts: {
          sinhVien: summary[0],
          giangVien: summary[1],
          mangNghienCuu: summary[2],
          sinhVienDangKyMang: summary[3],
          nhomNghienCuu: summary[4],
          loiMoiNhom: summary[5],
          deTaiNghienCuu: summary[6],
          thongBao: summary[7],
          nhatKyKiemToan: summary[8],
        },
        quickAccess: {
          noResearchAreaCode: 'SV008',
          registeredNoGroupCode: 'SV009',
          studentRegistrationCode: 'SV008',
          leaderGroupCode: 'SV001',
          pendingInvitationCode: 'SV005',
          lecturerPendingReviewCode: 'GV001',
          lecturerAssignedGroupCode: 'GV002',
        },
      })
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown seed error';
  console.error(message);
  process.exit(1);
});
