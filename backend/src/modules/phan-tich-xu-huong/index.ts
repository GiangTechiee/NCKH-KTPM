import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { phanTichXuHuongController } from './controllers/phan-tich-xu-huong.controller';

const router = Router();

router.post('/yeu-cau', xuLyBatDongBo(phanTichXuHuongController.taoYeuCauPhanTichXuHuong));
router.get('/yeu-cau', xuLyBatDongBo(phanTichXuHuongController.layDanhSachYeuCauPhanTich));

export default router;
