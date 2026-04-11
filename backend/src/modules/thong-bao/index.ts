import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { thongBaoController } from './controllers/thong-bao.controller';

const router = Router();

router.get('/', xuLyBatDongBo(thongBaoController.lietKeThongBao));
router.patch('/:id/da-doc', xuLyBatDongBo(thongBaoController.danhDauDaDoc));

export default router;
