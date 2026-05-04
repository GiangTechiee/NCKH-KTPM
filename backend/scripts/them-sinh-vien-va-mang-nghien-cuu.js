require('../node_modules/dotenv').config({ path: `${__dirname}/../.env` });
const { Client } = require('../node_modules/pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  await client.query('begin');

  try {
    console.log('🔄 Bắt đầu thêm dữ liệu sinh viên và mảng nghiên cứu...\n');

    // ========================================
    // 1. Thêm mảng nghiên cứu mới
    // ========================================
    console.log('📚 Thêm mảng nghiên cứu...');
    
    const existingAreas = await client.query(
      'select ma_mang from mang_nghien_cuu where ma_mang in ($1, $2, $3)',
      ['MANG004', 'MANG005', 'MANG006']
    );

    const existingAreaCodes = existingAreas.rows.map(row => row.ma_mang);

    const areasToInsert = [
      {
        maMang: 'MANG004',
        tenMang: 'Trí tuệ nhân tạo và Machine Learning',
        moTa: 'Nghiên cứu về AI, ML, Deep Learning, Computer Vision, NLP',
        thoiGianMoDangKy: new Date('2026-04-01'),
        thoiGianDongDangKy: new Date('2026-05-31'),
        trangThai: 'OPEN',
      },
      {
        maMang: 'MANG005',
        tenMang: 'An toàn và bảo mật thông tin',
        moTa: 'Nghiên cứu về cybersecurity, mã hóa, bảo mật mạng, ethical hacking',
        thoiGianMoDangKy: new Date('2026-04-01'),
        thoiGianDongDangKy: new Date('2026-05-31'),
        trangThai: 'OPEN',
      },
      {
        maMang: 'MANG006',
        tenMang: 'Internet of Things (IoT)',
        moTa: 'Nghiên cứu về IoT, embedded systems, smart devices, sensor networks',
        thoiGianMoDangKy: new Date('2026-04-01'),
        thoiGianDongDangKy: new Date('2026-05-31'),
        trangThai: 'OPEN',
      },
    ];

    for (const area of areasToInsert) {
      if (!existingAreaCodes.includes(area.maMang)) {
        await client.query(
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
          `,
          [
            area.maMang,
            area.tenMang,
            area.moTa,
            area.thoiGianMoDangKy,
            area.thoiGianDongDangKy,
            area.trangThai,
          ]
        );
        console.log(`  ✅ Đã thêm mảng: ${area.tenMang}`);
      } else {
        console.log(`  ⏭️  Bỏ qua mảng đã tồn tại: ${area.tenMang}`);
      }
    }

    // ========================================
    // 2. Thêm sinh viên mới
    // ========================================
    console.log('\n👥 Thêm sinh viên...');

    const studentsToInsert = [
      {
        maSinhVien: 'SV013',
        hoTen: 'Trần Minh Khang',
        email: 'sv013@nckh-hou.test',
        tenLop: 'CNTT K17A',
        tenKhoa: 'Công nghệ thông tin',
        soDienThoai: '0900000013',
        dangKyMang: 'MANG004', // Đăng ký mảng AI
      },
      {
        maSinhVien: 'SV014',
        hoTen: 'Lê Thị Hương',
        email: 'sv014@nckh-hou.test',
        tenLop: 'CNTT K17B',
        tenKhoa: 'Công nghệ thông tin',
        soDienThoai: '0900000014',
        dangKyMang: 'MANG005', // Đăng ký mảng Security
      },
      {
        maSinhVien: 'SV015',
        hoTen: 'Phạm Văn Đức',
        email: 'sv015@nckh-hou.test',
        tenLop: 'CNTT K17A',
        tenKhoa: 'Công nghệ thông tin',
        soDienThoai: '0900000015',
        dangKyMang: null, // Chưa đăng ký mảng
      },
      {
        maSinhVien: 'SV016',
        hoTen: 'Nguyễn Thị Mai',
        email: 'sv016@nckh-hou.test',
        tenLop: 'CNTT K17C',
        tenKhoa: 'Công nghệ thông tin',
        soDienThoai: '0900000016',
        dangKyMang: null, // Chưa đăng ký mảng
      },
      {
        maSinhVien: 'SV017',
        hoTen: 'Hoàng Văn Nam',
        email: 'sv017@nckh-hou.test',
        tenLop: 'CNTT K17B',
        tenKhoa: 'Công nghệ thông tin',
        soDienThoai: '0900000017',
        dangKyMang: 'MANG006', // Đăng ký mảng IoT
      },
      {
        maSinhVien: 'SV018',
        hoTen: 'Vũ Thị Lan',
        email: 'sv018@nckh-hou.test',
        tenLop: 'CNTT K17A',
        tenKhoa: 'Công nghệ thông tin',
        soDienThoai: '0900000018',
        dangKyMang: null, // Chưa đăng ký mảng
      },
      {
        maSinhVien: 'SV019',
        hoTen: 'Đặng Minh Tuấn',
        email: 'sv019@nckh-hou.test',
        tenLop: 'CNTT K17C',
        tenKhoa: 'Công nghệ thông tin',
        soDienThoai: '0900000019',
        dangKyMang: 'MANG004', // Đăng ký mảng AI
      },
      {
        maSinhVien: 'SV020',
        hoTen: 'Bùi Thị Hà',
        email: 'sv020@nckh-hou.test',
        tenLop: 'CNTT K17B',
        tenKhoa: 'Công nghệ thông tin',
        soDienThoai: '0900000020',
        dangKyMang: null, // Chưa đăng ký mảng
      },
    ];

    const existingStudents = await client.query(
      `select ma_sinh_vien from sinh_vien where ma_sinh_vien in (${studentsToInsert.map((_, i) => `$${i + 1}`).join(',')})`,
      studentsToInsert.map(s => s.maSinhVien)
    );

    const existingStudentCodes = existingStudents.rows.map(row => row.ma_sinh_vien);

    for (const student of studentsToInsert) {
      if (!existingStudentCodes.includes(student.maSinhVien)) {
        const insertedStudent = await client.query(
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
            returning id
          `,
          [
            student.maSinhVien,
            student.hoTen,
            student.email,
            student.tenLop,
            student.tenKhoa,
            student.soDienThoai,
          ]
        );

        const studentId = insertedStudent.rows[0].id;
        console.log(`  ✅ Đã thêm sinh viên: ${student.hoTen} (${student.maSinhVien})`);

        // Nếu sinh viên có đăng ký mảng, thêm vào bảng sinh_vien_dang_ky_mang
        if (student.dangKyMang) {
          const areaResult = await client.query(
            'select id from mang_nghien_cuu where ma_mang = $1',
            [student.dangKyMang]
          );

          if (areaResult.rowCount > 0) {
            const areaId = areaResult.rows[0].id;
            await client.query(
              `
                insert into sinh_vien_dang_ky_mang (
                  sinh_vien_id,
                  mang_nghien_cuu_id,
                  trang_thai
                )
                values ($1, $2, $3)
              `,
              [studentId, areaId, 'REGISTERED']
            );
            console.log(`     📝 Đã đăng ký mảng: ${student.dangKyMang}`);
          }
        } else {
          console.log(`     ⚠️  Chưa đăng ký mảng`);
        }
      } else {
        console.log(`  ⏭️  Bỏ qua sinh viên đã tồn tại: ${student.hoTen} (${student.maSinhVien})`);
      }
    }

    await client.query('commit');
    console.log('\n✅ Hoàn thành thêm dữ liệu sinh viên và mảng nghiên cứu!');
    console.log('\n📊 Tóm tắt:');
    console.log(`   - Đã thêm ${areasToInsert.length - existingAreaCodes.length} mảng nghiên cứu mới`);
    console.log(`   - Đã thêm ${studentsToInsert.length - existingStudentCodes.length} sinh viên mới`);
    console.log(`   - Sinh viên đã đăng ký mảng: ${studentsToInsert.filter(s => s.dangKyMang).length}`);
    console.log(`   - Sinh viên chưa đăng ký mảng: ${studentsToInsert.filter(s => !s.dangKyMang).length}`);
  } catch (error) {
    await client.query('rollback');
    console.error('\n❌ Lỗi khi thêm dữ liệu:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
