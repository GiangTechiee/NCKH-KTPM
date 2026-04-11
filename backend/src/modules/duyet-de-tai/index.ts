import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { duyetDeTaiController } from './controllers/duyet-de-tai.controller';

const router = Router();

router.get('/giang-vien/de-tai-cho-duyet', xuLyBatDongBo(duyetDeTaiController.layDanhSachChoDuyet));
router.post('/giang-vien/de-tai/:id/duyet', xuLyBatDongBo(duyetDeTaiController.duyetDeTai));
router.post(
  '/giang-vien/de-tai/:id/yeu-cau-chinh-sua',
  xuLyBatDongBo(duyetDeTaiController.yeuCauChinhSua)
);
router.post('/giang-vien/de-tai/:id/tu-choi', xuLyBatDongBo(duyetDeTaiController.tuChoiDeTai));
router.post('/giang-vien/de-tai/:id/chot', xuLyBatDongBo(duyetDeTaiController.chotDeTai));

export default router;
