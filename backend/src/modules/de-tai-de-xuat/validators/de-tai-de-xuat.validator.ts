import { ValidationError } from '../../../common/exceptions';
import { chuyenSangBigInt } from '../../../common/utils/chuyen-sang-bigint';
import { TaoDeTaiDeXuatDto } from '../dto/tao-de-tai-de-xuat.dto';

function layChuoiHopLe(giaTri: unknown): string {
  return typeof giaTri === 'string' ? giaTri.trim() : '';
}

function layChuoiTuyChon(giaTri: unknown): string | null {
  const giaTriDaChuanHoa = layChuoiHopLe(giaTri);
  return giaTriDaChuanHoa || null;
}

function xacThucTaoDeTaiDeXuat(body: unknown): TaoDeTaiDeXuatDto {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Thiếu dữ liệu đề tài đề xuất', [
      { field: 'body', code: 'BODY_REQUIRED', detail: 'Request body là bắt buộc' },
    ]);
  }

  const duLieu = body as Record<string, unknown>;
  const groupId = chuyenSangBigInt(duLieu.groupId, 'groupId');
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
    groupId,
    tenDeTai,
    moTaVanDe,
    mucTieuNghienCuu,
    ungDungThucTien: layChuoiTuyChon(duLieu.ungDungThucTien),
    phamViNghienCuu: layChuoiTuyChon(duLieu.phamViNghienCuu),
    congNgheSuDung: layChuoiTuyChon(duLieu.congNgheSuDung),
    lyDoLuaChon: layChuoiTuyChon(duLieu.lyDoLuaChon),
  };
}

export { xacThucTaoDeTaiDeXuat };
