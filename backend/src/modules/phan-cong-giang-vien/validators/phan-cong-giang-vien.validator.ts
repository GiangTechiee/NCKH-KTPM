import { Request } from 'express';
import { chuyenSangBigInt } from '../../../common/utils/chuyen-sang-bigint';
import { NhanHuongDanNhomDto } from '../dto/nhan-huong-dan-nhom.dto';

function layGroupIdGiangVienTuRequest(request: Request): bigint {
  return chuyenSangBigInt(request.params.groupId, 'groupId');
}

function xacThucNhanHuongDanNhom(request: Request): NhanHuongDanNhomDto {
  return {
    groupId: layGroupIdGiangVienTuRequest(request),
  };
}

export { layGroupIdGiangVienTuRequest, xacThucNhanHuongDanNhom };
