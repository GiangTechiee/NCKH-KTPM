import { Request, Response } from 'express';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { layMaGiangVienTuYeuCau } from '../../../common/utils/lay-ma-giang-vien-tu-yeu-cau';
import { nguoiDungService } from '../../nguoi-dung/services/nguoi-dung.service';
import { duyetDeTaiService } from '../services/duyet-de-tai.service';
import { layDeTaiIdDuyetTuRequest, xacThucDuyetDeTai } from '../validators/duyet-de-tai.validator';

class DuyetDeTaiController {
  async layDanhSachChoDuyet(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const data = await duyetDeTaiService.layDanhSachDeTaiChoDuyet(giangVien.id);

    return sendSuccess(response, {
      message: 'Lấy danh sách đề tài chờ duyệt thành công',
      data,
    });
  }

  async duyetDeTai(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const input = xacThucDuyetDeTai(request, false);
    const data = await duyetDeTaiService.duyetDeTai(giangVien.id, input);

    return sendSuccess(response, {
      message: 'Duyệt đề tài thành công',
      data,
    });
  }

  async yeuCauChinhSua(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const input = xacThucDuyetDeTai(request, true);
    const data = await duyetDeTaiService.yeuCauChinhSua(giangVien.id, input);

    return sendSuccess(response, {
      message: 'Yêu cầu chỉnh sửa đề tài thành công',
      data,
    });
  }

  async tuChoiDeTai(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const input = xacThucDuyetDeTai(request, true);
    const data = await duyetDeTaiService.tuChoiDeTai(giangVien.id, input);

    return sendSuccess(response, {
      message: 'Từ chối đề tài thành công',
      data,
    });
  }

  async chotDeTai(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const deTaiId = layDeTaiIdDuyetTuRequest(request);
    const data = await duyetDeTaiService.chotDeTai(giangVien.id, deTaiId);

    return sendSuccess(response, {
      message: 'Chốt đề tài thành công',
      data,
    });
  }
}

const duyetDeTaiController = new DuyetDeTaiController();

export { DuyetDeTaiController, duyetDeTaiController };
