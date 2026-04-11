import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { phanCongGiangVienController } from './controllers/phan-cong-giang-vien.controller';

const router = Router();

router.get('/giang-vien/nhom/dang-huong-dan', xuLyBatDongBo(phanCongGiangVienController.layDanhSachNhomDangHuongDan));
router.get('/giang-vien/nhom/co-the-nhan', xuLyBatDongBo(phanCongGiangVienController.layDanhSachNhomCoTheNhan));
router.post('/giang-vien/nhom/:groupId/nhan-huong-dan', xuLyBatDongBo(phanCongGiangVienController.nhanHuongDanNhom));
router.get('/giang-vien/nhom/:groupId', xuLyBatDongBo(phanCongGiangVienController.layChiTietNhomUngVien));

export default router;
