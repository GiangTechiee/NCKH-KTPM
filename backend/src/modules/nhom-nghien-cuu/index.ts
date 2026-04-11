import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { nhomNghienCuuController } from './controllers/nhom-nghien-cuu.controller';

const router = Router();

router.get('/nhom-cua-toi', xuLyBatDongBo(nhomNghienCuuController.layNhomCuaToi));
router.post('/nhom-nghien-cuu', xuLyBatDongBo(nhomNghienCuuController.taoNhomNghienCuu));
router.post(
  '/nhom-nghien-cuu/:groupId/moi-thanh-vien',
  xuLyBatDongBo(nhomNghienCuuController.moiThanhVien)
);

export default router;
