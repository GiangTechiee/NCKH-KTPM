import { Request, Response } from 'express';
import { sendSuccess } from '../../../common/utils/phan-hoi';
import { layMaGiangVienTuYeuCau } from '../../../common/utils/lay-ma-giang-vien-tu-yeu-cau';
import { nguoiDungService } from '../../nguoi-dung/services/nguoi-dung.service';
import { phanCongGiangVienService } from '../services/phan-cong-giang-vien.service';
import {
  layGroupIdGiangVienTuRequest,
  xacThucNhanHuongDanNhom,
} from '../validators/phan-cong-giang-vien.validator';

class PhanCongGiangVienController {
  async layDanhSachNhomDangHuongDan(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const data = await phanCongGiangVienService.layDanhSachNhomDangHuongDan(giangVien);

    return sendSuccess(response, {
      message: 'Lấy danh sách nhóm đang hướng dẫn thành công',
      data,
    });
  }

  async layDanhSachNhomCoTheNhan(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const data = await phanCongGiangVienService.layDanhSachNhomCoTheNhan(giangVien);

    return sendSuccess(response, {
      message: 'Lấy danh sách nhóm có thể nhận hướng dẫn thành công',
      data,
    });
  }

  async layChiTietNhomUngVien(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const groupId = layGroupIdGiangVienTuRequest(request);
    const data = await phanCongGiangVienService.layChiTietNhomUngVien(giangVien, groupId);

    return sendSuccess(response, {
      message: 'Lấy chi tiết nhóm nghiên cứu thành công',
      data,
    });
  }

  async nhanHuongDanNhom(request: Request, response: Response): Promise<Response> {
    const maGiangVien = layMaGiangVienTuYeuCau(request);
    const giangVien = await nguoiDungService.layGiangVienTheoMa(maGiangVien);
    const input = xacThucNhanHuongDanNhom(request);
    const data = await phanCongGiangVienService.nhanHuongDanNhom(giangVien, input.groupId);

    return sendSuccess(response, {
      message: 'Nhận hướng dẫn nhóm thành công',
      data,
    });
  }
}

const phanCongGiangVienController = new PhanCongGiangVienController();

export { PhanCongGiangVienController, phanCongGiangVienController };
