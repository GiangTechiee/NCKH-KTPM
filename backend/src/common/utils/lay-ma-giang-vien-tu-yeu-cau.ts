import { Request } from 'express';
import { UnauthorizedError } from '../exceptions';

function layMaGiangVienTuYeuCau(request: Request): string {
  const maGiangVien = request.header('x-ma-giang-vien')?.trim();

  if (!maGiangVien) {
    throw new UnauthorizedError({
      message: 'Thiếu header x-ma-giang-vien để xác định giảng viên hiện tại',
      errorCode: 'THIEU_MA_GIANG_VIEN',
    });
  }

  return maGiangVien;
}

export { layMaGiangVienTuYeuCau };
