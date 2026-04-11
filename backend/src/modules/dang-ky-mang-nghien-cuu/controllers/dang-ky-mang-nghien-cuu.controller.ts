import { Request, Response } from 'express';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { layMaSinhVienTuYeuCau } from '../../../common/utils/lay-ma-sinh-vien-tu-yeu-cau';
import { nguoiDungService } from '../../nguoi-dung/services/nguoi-dung.service';
import { xacThucDangKyMangNghienCuu } from '../validators/dang-ky-mang-nghien-cuu.validator';
import { dangKyMangNghienCuuService } from '../services/dang-ky-mang-nghien-cuu.service';

class DangKyMangNghienCuuController {
  async layDanhSachMangDangMo(_request: Request, response: Response): Promise<Response> {
    const data = await dangKyMangNghienCuuService.layDanhSachMangDangMo();

    return sendSuccess(response, {
      message: 'Lấy danh sách mảng nghiên cứu đang mở thành công',
      data,
    });
  }

  async dangKyMang(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const input = xacThucDangKyMangNghienCuu(request.body);
    const data = await dangKyMangNghienCuuService.dangKyMang(sinhVien.id, input);

    return sendSuccess(response, {
      statusCode: 201,
      message: 'Đăng ký mảng nghiên cứu thành công',
      data,
    });
  }
}

const dangKyMangNghienCuuController = new DangKyMangNghienCuuController();

export { DangKyMangNghienCuuController, dangKyMangNghienCuuController };
