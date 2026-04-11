import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { nopDeTaiController } from './controllers/nop-de-tai.controller';

const router = Router();

router.get('/de-tai-cua-toi/co-the-chon', xuLyBatDongBo(nopDeTaiController.layDeTaiCuaToi));
router.post('/nop-de-tai', xuLyBatDongBo(nopDeTaiController.nopDeTai));
router.put('/nop-de-tai/:id', xuLyBatDongBo(nopDeTaiController.capNhatDeTai));

export default router;
