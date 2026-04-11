import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { dangKyMangNghienCuuController } from './controllers/dang-ky-mang-nghien-cuu.controller';

const router = Router();

router.get('/mang-nghien-cuu/dang-mo', xuLyBatDongBo(dangKyMangNghienCuuController.layDanhSachMangDangMo));
router.get('/dang-ky-mang-nghien-cuu/hien-tai', xuLyBatDongBo(dangKyMangNghienCuuController.layDangKyHienTai));
router.post('/dang-ky-mang-nghien-cuu', xuLyBatDongBo(dangKyMangNghienCuuController.dangKyMang));
router.delete('/dang-ky-mang-nghien-cuu/huy', xuLyBatDongBo(dangKyMangNghienCuuController.huyDangKy));

export default router;
