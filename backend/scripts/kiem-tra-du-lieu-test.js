require('../node_modules/dotenv').config({ path: `${__dirname}/../.env` });
const { Client } = require('../node_modules/pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const students = await client.query(`
    select
      sv.ma_sinh_vien,
      sv.ho_ten,
      m.ten_mang,
      n.ten_nhom,
      tv.vai_tro,
      l.id as loi_moi_id,
      l.trang_thai as loi_moi_trang_thai
    from sinh_vien sv
    left join sinh_vien_dang_ky_mang dk on dk.sinh_vien_id = sv.id
    left join mang_nghien_cuu m on m.id = dk.mang_nghien_cuu_id
    left join thanh_vien_nhom_nghien_cuu tv
      on tv.sinh_vien_id = sv.id and tv.trang_thai_tham_gia = 'DA_CHAP_NHAN'
    left join nhom_nghien_cuu n on n.id = tv.nhom_nghien_cuu_id
    left join loi_moi_nhom l
      on l.sinh_vien_duoc_moi_id = sv.id and l.trang_thai = 'CHO_XAC_NHAN'
    order by sv.id
  `);

  const groups = await client.query(`
    select
      n.id,
      n.ten_nhom,
      n.so_luong_thanh_vien,
      n.trang_thai,
      sv.ma_sinh_vien as truong_nhom
    from nhom_nghien_cuu n
    join sinh_vien sv on sv.id = n.truong_nhom_sinh_vien_id
    order by n.id
  `);

  console.log(JSON.stringify({ students: students.rows, groups: groups.rows }, null, 2));
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
