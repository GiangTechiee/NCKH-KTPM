import { LoaiPhanTichXuHuong } from '../types/phan-tich-xu-huong.types';

interface TaoYeuCauPhanTichXuHuongDto {
  quanLyId: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  loaiPhanTich: LoaiPhanTichXuHuong;
}

export { TaoYeuCauPhanTichXuHuongDto };
