import { Request, Response } from 'express';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { chuyenSangBigInt } from '../../../common/utils/chuyen-sang-bigint';
import { nhatKyKiemToanService } from '../services/nhat-ky-kiem-toan.service';

class NhatKyKiemToanController {
  async lietKeTheoDoiTuong(request: Request, response: Response): Promise<Response> {
    const entityTypeParam = request.params.entityType;
    const loaiDoiTuong = Array.isArray(entityTypeParam) ? entityTypeParam[0]?.trim() : entityTypeParam?.trim();
    const doiTuongId = chuyenSangBigInt(request.params.entityId, 'entityId');
    const data = await nhatKyKiemToanService.lietKeTheoDoiTuong(loaiDoiTuong, doiTuongId);

    return sendSuccess(response, {
      message: 'Lấy nhật ký kiểm toán thành công',
      data,
    });
  }
}

const nhatKyKiemToanController = new NhatKyKiemToanController();

nhatKyKiemToanController.lietKeTheoDoiTuong = nhatKyKiemToanController.lietKeTheoDoiTuong.bind(nhatKyKiemToanController);

export { NhatKyKiemToanController, nhatKyKiemToanController };
