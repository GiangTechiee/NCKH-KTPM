import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { dangKyMangNghienCuuController } from './controllers/dang-ky-mang-nghien-cuu.controller';

const router = Router();

router.get('/mang-nghien-cuu/dang-mo', xuLyBatDongBo(dangKyMangNghienCuuController.layDanhSachMangDangMo));
router.post('/dang-ky-mang-nghien-cuu', xuLyBatDongBo(dangKyMangNghienCuuController.dangKyMang));

export default router;
