import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { nhatKyKiemToanController } from './api-layer/nhat-ky-kiem-toan.controller';

const router = Router();

router.get('/:entityType/:entityId', xuLyBatDongBo(nhatKyKiemToanController.lietKeTheoDoiTuong));

export default router;
