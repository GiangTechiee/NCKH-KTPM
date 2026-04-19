import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { deTaiDeXuatController } from './controllers/de-tai-de-xuat.controller';

const router = Router();

router.get('/', xuLyBatDongBo(deTaiDeXuatController.layDanhSachDeTaiDeXuat));
router.post('/', xuLyBatDongBo(deTaiDeXuatController.taoDeTaiDeXuat));
router.post('/:id/chon', xuLyBatDongBo(deTaiDeXuatController.chonDeTaiDeXuat));

export default router;
