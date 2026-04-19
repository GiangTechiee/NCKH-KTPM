require('../node_modules/dotenv').config({ path: `${__dirname}/../.env` });
const { Client } = require('../node_modules/pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const existing = await client.query(
      'select id from sinh_vien where ma_sinh_vien = $1',
      ['SV021']
    );

    if (existing.rowCount > 0) {
      console.log('SV021 đã tồn tại');
      await client.end();
      return;
    }

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
        'SV021',
        'Đỗ Hải Linh',
        'sv021@nckh-hou.test',
        'CNTT K17C',
        'Công nghệ thông tin',
        '0900000021',
      ]
    );

    console.log('Đã thêm SV021 chưa đăng ký mảng, chưa có nhóm, chưa có đề tài');
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});