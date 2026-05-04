import { Request, Response } from 'express';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { phanTichXuHuongService } from '../services/phan-tich-xu-huong.service';
import { xacThucTaoYeuCauPhanTichXuHuong } from '../validators/phan-tich-xu-huong.validator';

class PhanTichXuHuongController {
  async taoYeuCauPhanTichXuHuong(request: Request, response: Response): Promise<Response> {
    const input = xacThucTaoYeuCauPhanTichXuHuong(request.body);
    const data = await phanTichXuHuongService.taoYeuCauPhanTichXuHuong(input);

    return sendSuccess(response, {
      statusCode: 201,
      message: data.message,
      data,
    });
  }

  async layDanhSachYeuCauPhanTich(_request: Request, response: Response): Promise<Response> {
    const data = await phanTichXuHuongService.layDanhSachYeuCauPhanTich();

    return sendSuccess(response, {
      message: 'Lấy danh sách yêu cầu phân tích xu hướng thành công',
      data,
    });
  }
}

const phanTichXuHuongController = new PhanTichXuHuongController();

export { PhanTichXuHuongController, phanTichXuHuongController };
