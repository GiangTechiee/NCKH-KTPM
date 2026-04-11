import { Request } from 'express';
import { ValidationError } from '../../../common/exceptions';
import { chuyenSangBigInt } from '../../../common/utils/chuyen-sang-bigint';
import { CapNhatDeTaiDto } from '../dto/cap-nhat-de-tai.dto';
import { NopDeTaiDto } from '../dto/nop-de-tai.dto';

function layChuoiHopLe(giaTri: unknown): string {
  return typeof giaTri === 'string' ? giaTri.trim() : '';
}

function layChuoiTuyChon(giaTri: unknown): string | null {
  const giaTriDaChuanHoa = layChuoiHopLe(giaTri);
  return giaTriDaChuanHoa || null;
}

function layCoXacNhanChuyenDeTai(giaTri: unknown): boolean {
  return giaTri === true;
}

function xacThucNoiDungDeTai(body: unknown): Omit<NopDeTaiDto, 'deTaiId'> {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Thiếu dữ liệu đề tài', [
      { field: 'body', code: 'BODY_REQUIRED', detail: 'Request body là bắt buộc' },
    ]);
  }

  const duLieu = body as Record<string, unknown>;
  const tenDeTai = layChuoiHopLe(duLieu.tenDeTai);
  const moTaVanDe = layChuoiHopLe(duLieu.moTaVanDe);
  const mucTieuNghienCuu = layChuoiHopLe(duLieu.mucTieuNghienCuu);

  if (!tenDeTai || tenDeTai.length < 10 || tenDeTai.length > 255) {
    throw new ValidationError('Tên đề tài không hợp lệ', [
      { field: 'tenDeTai', code: 'INVALID_TOPIC_TITLE', detail: 'Tên đề tài phải từ 10 đến 255 ký tự' },
    ]);
  }

  if (!moTaVanDe || moTaVanDe.length < 20) {
    throw new ValidationError('Mô tả vấn đề chưa hợp lệ', [
      { field: 'moTaVanDe', code: 'INVALID_PROBLEM_DESCRIPTION', detail: 'Mô tả vấn đề phải từ 20 ký tự' },
    ]);
  }

  if (!mucTieuNghienCuu || mucTieuNghienCuu.length < 20) {
    throw new ValidationError('Mục tiêu nghiên cứu chưa hợp lệ', [
      { field: 'mucTieuNghienCuu', code: 'INVALID_RESEARCH_GOALS', detail: 'Mục tiêu nghiên cứu phải từ 20 ký tự' },
    ]);
  }

  return {
    tenDeTai,
    moTaVanDe,
    mucTieuNghienCuu,
    ungDungThucTien: layChuoiTuyChon(duLieu.ungDungThucTien),
    phamViNghienCuu: layChuoiTuyChon(duLieu.phamViNghienCuu),
    congNgheSuDung: layChuoiTuyChon(duLieu.congNgheSuDung),
    lyDoLuaChon: layChuoiTuyChon(duLieu.lyDoLuaChon),
    xacNhanChuyenDeTai: layCoXacNhanChuyenDeTai(duLieu.xacNhanChuyenDeTai),
  };
}

function xacThucNopDeTai(body: unknown): NopDeTaiDto {
  return xacThucNoiDungDeTai(body);
}

function layDeTaiIdTuRequest(request: Request): bigint {
  return chuyenSangBigInt(request.params.id, 'id');
}

function xacThucCapNhatDeTai(request: Request): CapNhatDeTaiDto {
  return {
    deTaiId: layDeTaiIdTuRequest(request),
    ...xacThucNoiDungDeTai(request.body),
  };
}

export { layDeTaiIdTuRequest, xacThucCapNhatDeTai, xacThucNopDeTai };
