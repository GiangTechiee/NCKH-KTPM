import { Request, Response } from 'express';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { nguoiDungService } from '../services/nguoi-dung.service';

class NguoiDungController {
  async lietKeTaiKhoanSinhVien(_request: Request, response: Response): Promise<Response> {
    const data = await nguoiDungService.lietKeTaiKhoanSinhVien();

    return sendSuccess(response, {
      message: 'Lấy danh sách tài khoản sinh viên thành công',
      data,
    });
  }

  async lietKeTaiKhoanGiangVien(_request: Request, response: Response): Promise<Response> {
    const data = await nguoiDungService.lietKeTaiKhoanGiangVien();

    return sendSuccess(response, {
      message: 'Lấy danh sách tài khoản giảng viên thành công',
      data,
    });
  }
}

const nguoiDungController = new NguoiDungController();

export { NguoiDungController, nguoiDungController };
