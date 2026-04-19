import { PrismaClient } from '@prisma/client';
import { createPrismaClient } from '../infrastructure/database/trinh-khach-prisma';

type StudentTextUpdate = {
  maSinhVien: string;
  hoTen: string;
  tenKhoa?: string;
};

type LecturerTextUpdate = {
  maGiangVien: string;
  hoTen: string;
  tenBoMon?: string;
  chuyenMon?: string;
};

type ResearchAreaTextUpdate = {
  maMang: string;
  tenMang: string;
  moTa: string;
};

type GroupTextUpdate = {
  oldNames: string[];
  newName: string;
};

type TopicTextUpdate = {
  groupNames: string[];
  tenDeTai: string;
  moTaVanDe: string;
  mucTieuNghienCuu: string;
  ungDungThucTien: string;
  phamViNghienCuu: string;
  congNgheSuDung: string;
  lyDoLuaChon: string;
  nhanXetGiangVien?: string | null;
  ghiChuChinhSua?: string | null;
};

const studentUpdates: readonly StudentTextUpdate[] = [
  { maSinhVien: 'SV001', hoTen: 'Nguyễn Minh Anh', tenKhoa: 'Công nghệ thông tin' },
  { maSinhVien: 'SV002', hoTen: 'Trần Thu Hà', tenKhoa: 'Công nghệ thông tin' },
  { maSinhVien: 'SV003', hoTen: 'Lê Quang Huy', tenKhoa: 'Công nghệ thông tin' },
  { maSinhVien: 'SV004', hoTen: 'Phạm Gia Hân', tenKhoa: 'Công nghệ thông tin' },
  { maSinhVien: 'SV005', hoTen: 'Đỗ Đức Minh', tenKhoa: 'Công nghệ thông tin' },
  { maSinhVien: 'SV006', hoTen: 'Vũ Khánh Linh', tenKhoa: 'Điện tử - Viễn thông' },
  { maSinhVien: 'SV007', hoTen: 'Bùi Nhật Nam', tenKhoa: 'Điện tử - Viễn thông' },
  { maSinhVien: 'SV008', hoTen: 'Hoàng Mai Phương', tenKhoa: 'Công nghệ thông tin' },
  { maSinhVien: 'SV009', hoTen: 'Nguyễn Anh Khoa', tenKhoa: 'Công nghệ thông tin' },
  { maSinhVien: 'SV010', hoTen: 'Tạ Bảo Châu', tenKhoa: 'Điện tử - Viễn thông' },
  { maSinhVien: 'SV011', hoTen: 'Phạm Ngọc An', tenKhoa: 'Công nghệ thông tin' },
  { maSinhVien: 'SV012', hoTen: 'Nguyễn Hoài Thu', tenKhoa: 'Công nghệ thông tin' },
  { maSinhVien: 'SV013', hoTen: 'Lê Thu Trang', tenKhoa: 'Công nghệ thông tin' },
];

const lecturerUpdates: readonly LecturerTextUpdate[] = [
  {
    maGiangVien: 'GV001',
    hoTen: 'TS. Nguyễn Thị Lan',
    tenBoMon: 'Công nghệ phần mềm',
    chuyenMon: 'Phát triển ứng dụng web và kiến trúc hệ thống',
  },
  {
    maGiangVien: 'GV002',
    hoTen: 'TS. Trần Văn Đức',
    tenBoMon: 'Hệ thống thông tin',
    chuyenMon: 'Trí tuệ nhân tạo và phân tích dữ liệu',
  },
  {
    maGiangVien: 'GV003',
    hoTen: 'ThS. Phạm Thu Trang',
    tenBoMon: 'Điện tử viễn thông',
    chuyenMon: 'IoT và hệ thống nhúng',
  },
];

const researchAreaUpdates: readonly ResearchAreaTextUpdate[] = [
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

const groupUpdates: readonly GroupTextUpdate[] = [
  { oldNames: ['Nhom Web HOU Alpha', 'Nhóm Web HOU Alpha'], newName: 'Nhóm Web HOU Alpha' },
  { oldNames: ['Nhom AI HOU Vision', 'Nhóm AI HOU Vision'], newName: 'Nhóm AI HOU Vision' },
  { oldNames: ['Nhom IoT HOU Pioneer', 'Nhóm IoT HOU Pioneer'], newName: 'Nhóm IoT HOU Pioneer' },
];

const topicUpdates: readonly TopicTextUpdate[] = [
  {
    groupNames: ['Nhom Web HOU Alpha', 'Nhóm Web HOU Alpha'],
    tenDeTai: 'Hệ thống quản lý đề tài nghiên cứu sinh viên HOU',
    moTaVanDe:
      'Xây dựng hệ thống hỗ trợ sinh viên đăng ký mảng nghiên cứu, tạo nhóm và theo dõi tiến độ đề tài.',
    mucTieuNghienCuu: 'Số hóa quy trình nghiên cứu khoa học sinh viên tại Hanoi Open University.',
    ungDungThucTien:
      'Hỗ trợ Phòng Khoa học Công nghệ và Khoa Công nghệ thông tin quản lý thông tin đề tài tập trung.',
    phamViNghienCuu: 'Tập trung vào quy trình đăng ký mảng, tạo nhóm, ghép nhóm và duyệt đề tài.',
    congNgheSuDung: 'React, Node.js, TypeScript, Prisma, PostgreSQL',
    lyDoLuaChon: 'Đề tài sát với nhu cầu chuyển đổi số trong quản lý nghiên cứu khoa học sinh viên.',
    nhanXetGiangVien: 'Cần bổ sung thêm luồng nghiệp vụ cho vai trò giảng viên.',
    ghiChuChinhSua: null,
  },
  {
    groupNames: ['Nhom AI HOU Vision', 'Nhóm AI HOU Vision'],
    tenDeTai: 'Nền tảng phân tích hình ảnh y tế bằng trí tuệ nhân tạo',
    moTaVanDe:
      'Xây dựng hệ thống hỗ trợ phân tích ảnh y tế nhằm gợi ý bất thường trên dữ liệu hình ảnh phổ biến trong môi trường đào tạo.',
    mucTieuNghienCuu:
      'Đề xuất quy trình thu thập, xử lý, huấn luyện và đánh giá mô hình AI cho bài toán nhận diện bất thường trên ảnh y tế.',
    ungDungThucTien: 'Hỗ trợ đào tạo và tham khảo cho sinh viên ngành công nghệ thông tin và công nghệ y sinh.',
    phamViNghienCuu: 'Tập trung vào bộ dữ liệu ảnh mẫu có kích thước vừa phải và quy trình đánh giá cơ bản.',
    congNgheSuDung: 'Python, FastAPI, PyTorch, React',
    lyDoLuaChon: 'Đề tài phù hợp với mảng AI và có tính ứng dụng thực tế cao.',
    nhanXetGiangVien: 'Cần bổ sung rõ hơn bộ dữ liệu, cách đánh giá và kế hoạch triển khai giao diện demo.',
    ghiChuChinhSua: 'Cần bổ sung rõ hơn bộ dữ liệu, cách đánh giá và kế hoạch triển khai giao diện demo.',
  },
  {
    groupNames: ['Nhom IoT HOU Pioneer', 'Nhóm IoT HOU Pioneer'],
    tenDeTai: 'Nền tảng phân tích dữ liệu học tập và cảnh báo sớm cho sinh viên HOU',
    moTaVanDe:
      'Xây dựng nền tảng thu thập và phân tích dữ liệu học tập để phát hiện sớm nguy cơ chậm tiến độ nghiên cứu của sinh viên.',
    mucTieuNghienCuu:
      'Đề xuất mô hình phân tích, cảnh báo và dashboard hỗ trợ giảng viên theo dõi tiến độ nhóm nghiên cứu khoa học.',
    ungDungThucTien:
      'Hỗ trợ giảng viên và khoa theo dõi tiến độ thực hiện đề tài sinh viên theo thời gian thực.',
    phamViNghienCuu: 'Áp dụng cho Nhóm IoT HOU Pioneer trong bối cảnh demo hệ thống NCKH.',
    congNgheSuDung: 'React, Node.js, PostgreSQL, Prisma, dashboard phân tích',
    lyDoLuaChon: 'Phù hợp định hướng AI ứng dụng và gia tăng giá trị thực tiễn cho quy trình hướng dẫn đề tài.',
    nhanXetGiangVien: 'Đề tài phù hợp để tiếp tục triển khai và có thể chuyển sang trạng thái đã duyệt.',
    ghiChuChinhSua: null,
  },
];

const notificationReplacements: ReadonlyArray<readonly [string, string]> = [
  ['Nhom nghien cuu da duoc tao thanh cong', 'Nhóm nghiên cứu đã được tạo thành công'],
  ['Ban vua nhan duoc loi moi vao nhom nghien cuu', 'Bạn vừa nhận được lời mời vào nhóm nghiên cứu'],
  ['Co de tai moi cho giang vien duyet', 'Có đề tài mới chờ giảng viên duyệt'],
  ['Loi moi vao nhom da bi tu choi', 'Lời mời vào nhóm đã bị từ chối'],
  ['Đề tài cần chỉnh sửa', 'Đề tài cần chỉnh sửa'],
  ['Giảng viên TS. Tran Van Duc đã nhận hướng dẫn nhóm Nhóm AI HOU Vision.', 'Giảng viên TS. Trần Văn Đức đã nhận hướng dẫn nhóm Nhóm AI HOU Vision.'],
  ['Giảng viên TS. Tran Van Duc đã nhận hướng dẫn nhóm Nhóm IoT HOU Pioneer.', 'Giảng viên TS. Trần Văn Đức đã nhận hướng dẫn nhóm Nhóm IoT HOU Pioneer.'],
  ['Giảng viên TS. Nguyen Thi Lan đã nhận hướng dẫn nhóm Nhóm Web HOU Alpha.', 'Giảng viên TS. Nguyễn Thị Lan đã nhận hướng dẫn nhóm Nhóm Web HOU Alpha.'],
  ['Giảng viên TS. Tran Van Duc đã nhận hướng dẫn nhóm Nhom AI HOU Vision.', 'Giảng viên TS. Trần Văn Đức đã nhận hướng dẫn nhóm Nhóm AI HOU Vision.'],
  ['Giảng viên TS. Nguyen Thi Lan đã nhận hướng dẫn nhóm Nhom Web HOU Alpha.', 'Giảng viên TS. Nguyễn Thị Lan đã nhận hướng dẫn nhóm Nhóm Web HOU Alpha.'],
  ['Giảng viên TS. Tran Van Duc đã nhận hướng dẫn nhóm Nhom IoT HOU Pioneer.', 'Giảng viên TS. Trần Văn Đức đã nhận hướng dẫn nhóm Nhóm IoT HOU Pioneer.'],
  ['"Nen tang phan tich hinh anh y te bang tri tue nhan tao"', '"Nền tảng phân tích hình ảnh y tế bằng trí tuệ nhân tạo"'],
  ['"He thong quan ly de tai nghien cuu sinh vien HOU"', '"Hệ thống quản lý đề tài nghiên cứu sinh viên HOU"'],
  ['"Nen tang phan tich du lieu hoc tap va canh bao som cho sinh vien HOU"', '"Nền tảng phân tích dữ liệu học tập và cảnh báo sớm cho sinh viên HOU"'],
  ['Nen tang phan tich hinh anh y te bang tri tue nhan tao', 'Nền tảng phân tích hình ảnh y tế bằng trí tuệ nhân tạo'],
  ['He thong quan ly de tai nghien cuu sinh vien HOU', 'Hệ thống quản lý đề tài nghiên cứu sinh viên HOU'],
  ['Nen tang phan tich du lieu hoc tap va canh bao som cho sinh vien HOU', 'Nền tảng phân tích dữ liệu học tập và cảnh báo sớm cho sinh viên HOU'],
  ['Nhom Web HOU Alpha da san sang cho qua trinh duyet de tai.', 'Nhóm Web HOU Alpha đã sẵn sàng cho quá trình duyệt đề tài.'],
  ['Nhom AI HOU Vision dang cho ban phan hoi loi moi tham gia.', 'Nhóm AI HOU Vision đang chờ bạn phản hồi lời mời tham gia.'],
  ['Nhom Web HOU Alpha da nop de tai cho giang vien huong dan.', 'Nhóm Web HOU Alpha đã nộp đề tài cho giảng viên hướng dẫn.'],
  ['Sinh vien SV010 da tu choi loi moi tham gia Nhom IoT HOU Pioneer.', 'Sinh viên SV010 đã từ chối lời mời tham gia Nhóm IoT HOU Pioneer.'],
  ['TS. Tran Van Duc', 'TS. Trần Văn Đức'],
  ['TS. Nguyen Thi Lan', 'TS. Nguyễn Thị Lan'],
  ['ThS. Pham Thu Trang', 'ThS. Phạm Thu Trang'],
  ['Nhom IoT HOU Pioneer', 'Nhóm IoT HOU Pioneer'],
  ['Nhom AI HOU Vision', 'Nhóm AI HOU Vision'],
  ['Nhom Web HOU Alpha', 'Nhóm Web HOU Alpha'],
];

function applyTextReplacements(text: string | null | undefined): string | null | undefined {
  if (!text) {
    return text;
  }

  return notificationReplacements.reduce(
    (currentText, [searchValue, replaceValue]) => currentText.split(searchValue).join(replaceValue),
    text
  );
}

async function updateStudents(prisma: PrismaClient): Promise<number> {
  let count = 0;

  for (const student of studentUpdates) {
    const result = await prisma.sinhVien.updateMany({
      where: { maSinhVien: student.maSinhVien },
      data: {
        hoTen: student.hoTen,
        ...(student.tenKhoa ? { tenKhoa: student.tenKhoa } : {}),
      },
    });
    count += result.count;
  }

  return count;
}

async function updateLecturers(prisma: PrismaClient): Promise<number> {
  let count = 0;

  for (const lecturer of lecturerUpdates) {
    const result = await prisma.giangVien.updateMany({
      where: { maGiangVien: lecturer.maGiangVien },
      data: {
        hoTen: lecturer.hoTen,
        ...(lecturer.tenBoMon ? { tenBoMon: lecturer.tenBoMon } : {}),
        ...(lecturer.chuyenMon ? { chuyenMon: lecturer.chuyenMon } : {}),
      },
    });
    count += result.count;
  }

  return count;
}

async function updateResearchAreas(prisma: PrismaClient): Promise<number> {
  let count = 0;

  for (const area of researchAreaUpdates) {
    const result = await prisma.mangNghienCuu.updateMany({
      where: { maMang: area.maMang },
      data: {
        tenMang: area.tenMang,
        moTa: area.moTa,
      },
    });
    count += result.count;
  }

  return count;
}

async function updateGroupsAndTopics(prisma: PrismaClient): Promise<{ groupCount: number; topicCount: number }> {
  let groupCount = 0;
  let topicCount = 0;

  for (const groupUpdate of groupUpdates) {
    const group = await prisma.nhomNghienCuu.findFirst({
      where: { tenNhom: { in: groupUpdate.oldNames } },
      select: { id: true },
    });

    if (!group) {
      continue;
    }

    await prisma.nhomNghienCuu.update({
      where: { id: group.id },
      data: { tenNhom: groupUpdate.newName },
    });
    groupCount += 1;
  }

  for (const topicUpdate of topicUpdates) {
    const group = await prisma.nhomNghienCuu.findFirst({
      where: { tenNhom: { in: topicUpdate.groupNames } },
      select: { id: true },
    });

    if (!group) {
      continue;
    }

    const topic = await prisma.deTaiNghienCuu.findUnique({
      where: { nhomNghienCuuId: group.id },
      select: { id: true },
    });

    if (!topic) {
      continue;
    }

    await prisma.deTaiNghienCuu.update({
      where: { id: topic.id },
      data: {
        tenDeTai: topicUpdate.tenDeTai,
        moTaVanDe: topicUpdate.moTaVanDe,
        mucTieuNghienCuu: topicUpdate.mucTieuNghienCuu,
        ungDungThucTien: topicUpdate.ungDungThucTien,
        phamViNghienCuu: topicUpdate.phamViNghienCuu,
        congNgheSuDung: topicUpdate.congNgheSuDung,
        lyDoLuaChon: topicUpdate.lyDoLuaChon,
        ...(topicUpdate.nhanXetGiangVien !== undefined
          ? { nhanXetGiangVien: topicUpdate.nhanXetGiangVien }
          : {}),
        ...(topicUpdate.ghiChuChinhSua !== undefined
          ? { ghiChuChinhSua: topicUpdate.ghiChuChinhSua }
          : {}),
      },
    });
    topicCount += 1;
  }

  return { groupCount, topicCount };
}

async function updateNotifications(prisma: PrismaClient): Promise<number> {
  const notifications = await prisma.thongBao.findMany({
    select: {
      id: true,
      tieuDe: true,
      noiDung: true,
    },
  });

  let count = 0;

  for (const notification of notifications) {
    const nextTitle = applyTextReplacements(notification.tieuDe);
    const nextContent = applyTextReplacements(notification.noiDung);

    if (!nextTitle || !nextContent) {
      continue;
    }

    if (nextTitle === notification.tieuDe && nextContent === notification.noiDung) {
      continue;
    }

    await prisma.thongBao.update({
      where: { id: notification.id },
      data: {
        tieuDe: nextTitle,
        noiDung: nextContent,
      },
    });
    count += 1;
  }

  return count;
}

async function main(): Promise<void> {
  const prisma = createPrismaClient();

  try {
    const studentCount = await updateStudents(prisma);
    const lecturerCount = await updateLecturers(prisma);
    const researchAreaCount = await updateResearchAreas(prisma);
    const { groupCount, topicCount } = await updateGroupsAndTopics(prisma);
    const notificationCount = await updateNotifications(prisma);

    console.log(
      JSON.stringify(
        {
          message: 'Đã cập nhật dữ liệu demo có dấu thành công',
          updated: {
            students: studentCount,
            lecturers: lecturerCount,
            researchAreas: researchAreaCount,
            groups: groupCount,
            topics: topicCount,
            notifications: notificationCount,
          },
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown normalization error';
  console.error(message);
  process.exit(1);
});
