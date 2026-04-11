import { Request, Response } from 'express';
import { chuyenSangBigInt } from '../../../common/utils/chuyen-sang-bigint';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { layMaGiangVienTuYeuCau } from '../../../common/utils/lay-ma-giang-vien-tu-yeu-cau';
import { layMaSinhVienTuYeuCau } from '../../../common/utils/lay-ma-sinh-vien-tu-yeu-cau';
import { nguoiDungService } from '../../nguoi-dung/services/nguoi-dung.service';
import { deTaiDeXuatService } from '../services/de-tai-de-xuat.service';
import { xacThucTaoDeTaiDeXuat } from '../validators/de-tai-de-xuat.validator';

class DeTaiDeXuatController {
  async layDanhSachDeTaiDeXuat(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const data = await deTaiDeXuatService.layDanhSachDeTaiDeXuatChoSinhVien(sinhVien.id);

    return sendSuccess(response, {
      message: 'Lấy danh sách đề tài đề xuất thành công',
      data,
    });
  }

  async taoDeTaiDeXuat(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const input = xacThucTaoDeTaiDeXuat(request.body);
    const data = await deTaiDeXuatService.taoDeTaiDeXuat(giangVien.id, input);

    return sendSuccess(response, {
      statusCode: 201,
      message: 'Tạo đề tài đề xuất thành công',
      data,
    });
  }

  async chonDeTaiDeXuat(request: Request, response: Response): Promise<Response> {
    const maSinhVien = layMaSinhVienTuYeuCau(request);
    const sinhVien = await nguoiDungService.laySinhVienTheoMa(maSinhVien);
    const deTaiId = chuyenSangBigInt(request.params.id, 'id');
    const data = await deTaiDeXuatService.chonDeTaiDeXuat(sinhVien.id, deTaiId);

    return sendSuccess(response, {
      message: 'Chọn đề tài đề xuất thành công',
      data,
    });
  }
}

const deTaiDeXuatController = new DeTaiDeXuatController();

export { DeTaiDeXuatController, deTaiDeXuatController };
