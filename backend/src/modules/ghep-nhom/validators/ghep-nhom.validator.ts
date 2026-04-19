import { Request } from 'express';
import { ValidationError } from '../../../common/exceptions';
import { chuyenSangBigInt } from '../../../common/utils/chuyen-sang-bigint';
import { PhanHoiLoiMoiDto } from '../dto/phan-hoi-loi-moi.dto';

function layInvitationIdTuRequest(request: Request): bigint {
  return chuyenSangBigInt(request.params.id, 'id');
}

function layGroupIdTuRequest(request: Request): bigint {
  return chuyenSangBigInt(request.params.groupId, 'groupId');
}

function xacThucPhanHoiLoiMoi(body: unknown): PhanHoiLoiMoiDto {
  if (!body || typeof body !== 'object') {
    return {};
  }

  const duLieu = body as Record<string, unknown>;
  const lyDoTuChoi = typeof duLieu.lyDoTuChoi === 'string' ? duLieu.lyDoTuChoi.trim() : undefined;

  if (lyDoTuChoi !== undefined && lyDoTuChoi.length > 500) {
    throw new ValidationError('Lý do từ chối không hợp lệ', [
      { field: 'lyDoTuChoi', code: 'REJECT_REASON_TOO_LONG', detail: 'Tối đa 500 ký tự' },
    ]);
  }

  return { lyDoTuChoi };
}

export { layInvitationIdTuRequest, layGroupIdTuRequest, xacThucPhanHoiLoiMoi };
