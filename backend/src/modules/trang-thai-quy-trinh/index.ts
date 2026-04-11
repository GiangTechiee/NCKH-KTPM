import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { trangThaiQuyTrinhController } from './controllers/trang-thai-quy-trinh.controller';

const router = Router();

router.get('/giang-vien', xuLyBatDongBo(trangThaiQuyTrinhController.layTienTrinhGiangVien));
router.get('/sinh-vien', xuLyBatDongBo(trangThaiQuyTrinhController.layTienTrinhSinhVien));

export default router;
