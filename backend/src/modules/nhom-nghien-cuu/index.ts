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
router.delete(
  '/nhom-nghien-cuu/:groupId',
  xuLyBatDongBo(nhomNghienCuuController.xoaNhom)
);
router.post(
  '/nhom-nghien-cuu/:groupId/roi-nhom',
  xuLyBatDongBo(nhomNghienCuuController.roiNhom)
);

export default router;
