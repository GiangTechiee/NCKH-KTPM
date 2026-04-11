import { Request } from 'express';
import { ValidationError } from '../../../common/exceptions';
import { chuyenSangBigInt } from '../../../common/utils/chuyen-sang-bigint';
import { DuyetDeTaiDto } from '../dto/duyet-de-tai.dto';

function layDeTaiIdDuyetTuRequest(request: Request): bigint {
  return chuyenSangBigInt(request.params.id, 'id');
}

function xacThucDuyetDeTai(request: Request, batBuocNhanXet = false): DuyetDeTaiDto {
  const nhanXet = typeof request.body?.nhanXet === 'string' ? request.body.nhanXet.trim() : '';

  if (batBuocNhanXet && !nhanXet) {
    throw new ValidationError('Nhận xét là bắt buộc cho thao tác này', [
      { field: 'nhanXet', code: 'COMMENT_REQUIRED' },
    ]);
  }

  return {
    deTaiId: layDeTaiIdDuyetTuRequest(request),
    nhanXet: nhanXet || null,
  };
}

export { layDeTaiIdDuyetTuRequest, xacThucDuyetDeTai };
