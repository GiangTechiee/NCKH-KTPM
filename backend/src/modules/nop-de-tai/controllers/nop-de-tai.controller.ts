import { Request, Response } from 'express';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { layMaSinhVienTuYeuCau } from '../../../common/utils/lay-ma-sinh-vien-tu-yeu-cau';
import { nguoiDungService } from '../../nguoi-dung/services/nguoi-dung.service';
import { nopDeTaiService } from '../services/nop-de-tai.service';
import { layDeTaiIdTuRequest, xacThucCapNhatDeTai, xacThucNopDeTai } from '../validators/nop-de-tai.validator';

class NopDeTaiController {
  async layDeTaiCuaToi(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const data = await nopDeTaiService.layDeTaiCuaToi(sinhVien.id);

    return sendSuccess(response, {
      message: 'Lấy thông tin đề tài của tôi thành công',
      data,
    });
  }

  async nopDeTai(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const input = xacThucNopDeTai(request.body);
    const data = await nopDeTaiService.nopDeTai(sinhVien.id, input);

    return sendSuccess(response, {
      statusCode: 201,
      message: 'Nộp đề tài thành công',
      data,
    });
  }

  async capNhatDeTai(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const input = xacThucCapNhatDeTai(request);
    const data = await nopDeTaiService.capNhatDeTai(sinhVien.id, input);

    return sendSuccess(response, {
      message: 'Cập nhật đề tài thành công',
      data,
    });
  }

  async xoaDeTai(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const deTaiId = layDeTaiIdTuRequest(request);
    const data = await nopDeTaiService.xoaDeTai(sinhVien.id, deTaiId);

    return sendSuccess(response, {
      message: 'Xóa đề tài thành công',
      data,
    });
  }
}

const nopDeTaiController = new NopDeTaiController();

export { NopDeTaiController, nopDeTaiController };
