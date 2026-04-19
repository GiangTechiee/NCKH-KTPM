import { Request, Response } from 'express';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { layMaGiangVienTuYeuCau } from '../../../common/utils/lay-ma-giang-vien-tu-yeu-cau';
import { layMaSinhVienTuYeuCau } from '../../../common/utils/lay-ma-sinh-vien-tu-yeu-cau';
import { nguoiDungService } from '../../nguoi-dung/services/nguoi-dung.service';
import { trangThaiQuyTrinhService } from '../services/trang-thai-quy-trinh.service';

class TrangThaiQuyTrinhController {
  async layTienTrinhGiangVien(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const data = await trangThaiQuyTrinhService.layTienTrinhGiangVien(giangVien.id);

    return sendSuccess(response, {
      message: 'Lấy tiến trình giảng viên thành công',
      data,
    });
  }

  async layTienTrinhSinhVien(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const data = await trangThaiQuyTrinhService.layTienTrinhSinhVien(sinhVien.id);

    return sendSuccess(response, {
      message: 'Lấy tiến trình sinh viên thành công',
      data,
    });
  }
}

const trangThaiQuyTrinhController = new TrangThaiQuyTrinhController();

export { TrangThaiQuyTrinhController, trangThaiQuyTrinhController };
