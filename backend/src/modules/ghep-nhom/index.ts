import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { ghepNhomController } from './controllers/ghep-nhom.controller';

const router = Router();

router.get('/goi-y-ghep-nhom', xuLyBatDongBo(ghepNhomController.layGoiYGhepNhom));
router.post('/goi-y-ghep-nhom/:groupId/tham-gia', xuLyBatDongBo(ghepNhomController.thamGiaNhom));
router.post('/loi-moi-nhom/:id/chap-nhan', xuLyBatDongBo(ghepNhomController.chapNhanLoiMoi));
router.post('/loi-moi-nhom/:id/tu-choi', xuLyBatDongBo(ghepNhomController.tuChoiLoiMoi));

export default router;
