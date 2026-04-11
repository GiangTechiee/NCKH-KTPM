import { Request, Response } from 'express';
import { NotFoundError } from '../../../common/exceptions';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { layMaSinhVienTuYeuCau } from '../../../common/utils/lay-ma-sinh-vien-tu-yeu-cau';
import { nguoiDungService } from '../../nguoi-dung/services/nguoi-dung.service';
import { nhomNghienCuuService } from '../services/nhom-nghien-cuu.service';
import { layGroupIdTuRequest, xacThucMoiThanhVien, xacThucTaoNhomNghienCuu } from '../validators/nhom-nghien-cuu.validator';

class NhomNghienCuuController {
  async layNhomCuaToi(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const data = await nhomNghienCuuService.layNhomCuaToi(sinhVien.id);

    if (!data) {
      throw new NotFoundError('Sinh viên chưa có nhóm nghiên cứu');
    }

    return sendSuccess(response, {
      message: 'Lấy thông tin nhóm của tôi thành công',
      data,
    });
  }

  async taoNhomNghienCuu(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const input = xacThucTaoNhomNghienCuu(request.body);
    const data = await nhomNghienCuuService.taoNhomNghienCuu(sinhVien.id, input);

    return sendSuccess(response, {
      statusCode: 201,
      message: 'Tạo nhóm nghiên cứu thành công',
      data,
    });
  }

  async moiThanhVien(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const groupId = layGroupIdTuRequest(request);
    const input = xacThucMoiThanhVien(request.body);
    const data = await nhomNghienCuuService.moiThanhVien(sinhVien.id, groupId, input);

    return sendSuccess(response, {
      statusCode: 201,
      message: 'Gửi lời mời vào nhóm thành công',
      data,
    });
  }
}

const nhomNghienCuuController = new NhomNghienCuuController();

export { NhomNghienCuuController, nhomNghienCuuController };
