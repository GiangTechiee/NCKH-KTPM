import { Request, Response } from 'express';
import { UserRole } from '../../../common/constants';
import { UnauthorizedError } from '../../../common/exceptions';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { chuyenSangBigInt } from '../../../common/utils/chuyen-sang-bigint';
import { nguoiDungService } from '../../nguoi-dung/services/nguoi-dung.service';
import { thongBaoService } from '../services/thong-bao.service';
import { ThongBaoNguoiNhanHienTai } from '../types/thong-bao.types';

class ThongBaoController {
  private async xacDinhNguoiNhanHienTai(request: Request): Promise<ThongBaoNguoiNhanHienTai> {
    const maSinhVien = request.header('x-ma-sinh-vien')?.trim();
    if (maSinhVien) {
      const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);

      return {
        nguoiNhanId: sinhVien.id,
        loaiNguoiNhan: UserRole.SINH_VIEN,
      };
    }

    const maGiangVien = request.header('x-ma-giang-vien')?.trim();
    if (maGiangVien) {
      const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);

      return {
        nguoiNhanId: giangVien.id,
        loaiNguoiNhan: UserRole.GIANG_VIEN,
      };
    }

    throw new UnauthorizedError({
      message: 'Thiếu header định danh người dùng hiện tại',
      errorCode: 'MISSING_CURRENT_USER_HEADER',
      errors: [
        {
          field: 'x-ma-sinh-vien|x-ma-giang-vien',
          code: 'CURRENT_USER_HEADER_REQUIRED',
        },
      ],
    });
  }

  async lietKeThongBao(request: Request, response: Response): Promise<Response> {
    const nguoiNhanHienTai = await this.xacDinhNguoiNhanHienTai(request);
    const data = await thongBaoService.lietKeThongBaoCuaNguoiNhan(nguoiNhanHienTai);

    return sendSuccess(response, {
      message: 'Lấy danh sách thông báo thành công',
      data,
    });
  }

  async danhDauDaDoc(request: Request, response: Response): Promise<Response> {
    const nguoiNhanHienTai = await this.xacDinhNguoiNhanHienTai(request);
    const thongBaoId = chuyenSangBigInt(request.params.id, 'id');
    const data = await thongBaoService.danhDauThongBaoDaDoc(nguoiNhanHienTai, thongBaoId);

    return sendSuccess(response, {
      message: 'Đánh dấu thông báo đã đọc thành công',
      data,
    });
  }
}

const thongBaoController = new ThongBaoController();

thongBaoController.lietKeThongBao = thongBaoController.lietKeThongBao.bind(thongBaoController);
thongBaoController.danhDauDaDoc = thongBaoController.danhDauDaDoc.bind(thongBaoController);

export { ThongBaoController, thongBaoController };
