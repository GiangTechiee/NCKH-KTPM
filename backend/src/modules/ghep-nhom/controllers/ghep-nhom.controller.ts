import { Request, Response } from 'express';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { layMaSinhVienTuYeuCau } from '../../../common/utils/lay-ma-sinh-vien-tu-yeu-cau';
import { nguoiDungService } from '../../nguoi-dung/services/nguoi-dung.service';
import { ghepNhomService } from '../services/ghep-nhom.service';
import { layInvitationIdTuRequest, xacThucPhanHoiLoiMoi } from '../validators/ghep-nhom.validator';

class GhepNhomController {
  async layGoiYGhepNhom(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const data = await ghepNhomService.layGoiYGhepNhom(sinhVien.id);

    return sendSuccess(response, {
      message: 'Lấy gợi ý ghép nhóm thành công',
      data,
    });
  }

  async chapNhanLoiMoi(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const invitationId = layInvitationIdTuRequest(request);
    const data = await ghepNhomService.chapNhanLoiMoi(sinhVien.id, invitationId);

    return sendSuccess(response, {
      message: 'Chấp nhận lời mời tham gia nhóm thành công',
      data,
    });
  }

  async tuChoiLoiMoi(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const invitationId = layInvitationIdTuRequest(request);
    const input = xacThucPhanHoiLoiMoi(request.body);
    const data = await ghepNhomService.tuChoiLoiMoi(sinhVien.id, invitationId, input);

    return sendSuccess(response, {
      message: 'Từ chối lời mời tham gia nhóm thành công',
      data,
    });
  }
}

const ghepNhomController = new GhepNhomController();

export { GhepNhomController, ghepNhomController };
