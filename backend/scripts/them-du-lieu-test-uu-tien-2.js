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
    const existingStudent = await client.query(
      'select id from sinh_vien where ma_sinh_vien = $1',
      ['SV011']
    );

    if (existingStudent.rowCount === 0) {
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
          'SV011',
          'Phạm Ngọc An',
          'sv011@nckh-hou.test',
          'CNTT K17A',
          'Công nghệ thông tin',
          '0900000011',
        ]
      );

      const studentId = insertedStudent.rows[0].id;

      await client.query(
        `
          insert into sinh_vien_dang_ky_mang (
            sinh_vien_id,
            mang_nghien_cuu_id,
            trang_thai
          )
          values ($1, $2, $3)
        `,
        [studentId, 2, 'REGISTERED']
      );
    }

    const existingStudentWithoutRegistration = await client.query(
      'select id from sinh_vien where ma_sinh_vien = $1',
      ['SV012']
    );

    if (existingStudentWithoutRegistration.rowCount === 0) {
      await client.query(
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
        `,
        [
          'SV012',
          'Nguyễn Hoài Thu',
          'sv012@nckh-hou.test',
          'CNTT K17B',
          'Công nghệ thông tin',
          '0900000012',
        ]
      );
    }

    await client.query('commit');
    console.log('Đã bổ sung dữ liệu test ưu tiên 2');
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
