import { Request } from 'express';
import { UnauthorizedError } from '../exceptions';

function layMaSinhVienTuYeuCau(request: Request): string {
  const maSinhVien = request.header('x-ma-sinh-vien')?.trim();

  if (!maSinhVien) {
    throw new UnauthorizedError({
      message: 'Thiếu header x-ma-sinh-vien để xác định sinh viên hiện tại',
      errorCode: 'THIEU_MA_SINH_VIEN',
    });
  }

  return maSinhVien;
}

export { layMaSinhVienTuYeuCau };
