import { ValidationError } from '../../../common/exceptions';
import { chuyenSangBigInt } from '../../../common/utils/chuyen-sang-bigint';
import { DangKyMangNghienCuuDto } from '../dto/dang-ky-mang-nghien-cuu.dto';

function xacThucDangKyMangNghienCuu(body: unknown): DangKyMangNghienCuuDto {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Thiếu dữ liệu đăng ký mảng', [
      { field: 'body', code: 'BODY_REQUIRED', detail: 'Request body là bắt buộc' },
    ]);
  }

  const duLieu = body as Record<string, unknown>;

  return {
    mangNghienCuuId: chuyenSangBigInt(duLieu.mangNghienCuuId, 'mangNghienCuuId'),
  };
}

export { xacThucDangKyMangNghienCuu };
