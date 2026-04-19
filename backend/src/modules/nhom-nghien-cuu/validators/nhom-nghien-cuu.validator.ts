import { Request } from 'express';
import { ValidationError } from '../../../common/exceptions';
import { chuyenSangBigInt } from '../../../common/utils/chuyen-sang-bigint';
import { MoiThanhVienDto } from '../dto/moi-thanh-vien.dto';
import { TaoNhomNghienCuuDto } from '../dto/tao-nhom-nghien-cuu.dto';

function xacThucTaoNhomNghienCuu(body: unknown): TaoNhomNghienCuuDto {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Thiếu dữ liệu tạo nhóm', [
      { field: 'body', code: 'BODY_REQUIRED', detail: 'Request body là bắt buộc' },
    ]);
  }

  const duLieu = body as Record<string, unknown>;
  const tenNhom = typeof duLieu.tenNhom === 'string' ? duLieu.tenNhom.trim() : '';

  if (!tenNhom || tenNhom.length < 3 || tenNhom.length > 100) {
    throw new ValidationError('Tên nhóm không hợp lệ', [
      { field: 'tenNhom', code: 'INVALID_GROUP_NAME', detail: 'Tên nhóm phải từ 3 đến 100 ký tự' },
    ]);
  }

  return { tenNhom };
}

function xacThucMoiThanhVien(body: unknown): MoiThanhVienDto {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Thiếu dữ liệu mời thành viên', [
      { field: 'body', code: 'BODY_REQUIRED', detail: 'Request body là bắt buộc' },
    ]);
  }

  const duLieu = body as Record<string, unknown>;
  const maSinhVien = typeof duLieu.maSinhVien === 'string' ? duLieu.maSinhVien.trim() : '';

  if (!maSinhVien) {
    throw new ValidationError('Mã sinh viên được mời là bắt buộc', [
      { field: 'maSinhVien', code: 'STUDENT_CODE_REQUIRED' },
    ]);
  }

  return { maSinhVien };
}

function layGroupIdTuRequest(request: Request): bigint {
  return chuyenSangBigInt(request.params.groupId, 'groupId');
}

export { xacThucTaoNhomNghienCuu, xacThucMoiThanhVien, layGroupIdTuRequest };
