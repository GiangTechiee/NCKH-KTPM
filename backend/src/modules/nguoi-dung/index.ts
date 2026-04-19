import { Router } from 'express';
import xuLyBatDongBo from '../../common/utils/xu-ly-bat-dong-bo';
import { sendSuccess } from '../../common/utils/phan-hoi';
import { nguoiDungController } from './controllers/nguoi-dung.controller';

const router = Router();

router.get('/', (_request, response) => {
  return sendSuccess(response, {
    message: 'Module người dùng sẵn sàng phục vụ danh sách tài khoản',
    data: {
      endpoints: {
        students: '/api/nguoi-dung/sinh-vien',
        lecturers: '/api/nguoi-dung/giang-vien',
      },
    },
  });
});

router.get('/sinh-vien', xuLyBatDongBo(nguoiDungController.lietKeTaiKhoanSinhVien));
router.get('/giang-vien', xuLyBatDongBo(nguoiDungController.lietKeTaiKhoanGiangVien));

export default router;
