import { ValidationError } from '../exceptions';

function chuyenSangBigInt(giaTri: unknown, tenTruong: string): bigint {
  if (typeof giaTri === 'bigint') {
    return giaTri;
  }

  if (typeof giaTri === 'number' && Number.isInteger(giaTri) && giaTri > 0) {
    return BigInt(giaTri);
  }

  if (typeof giaTri === 'string' && /^\d+$/.test(giaTri.trim())) {
    return BigInt(giaTri.trim());
  }

  throw new ValidationError('Dữ liệu đầu vào không hợp lệ', [
    {
      field: tenTruong,
      code: 'INVALID_BIGINT',
      detail: `${tenTruong} phải là số nguyên dương`,
    },
  ]);
}

export { chuyenSangBigInt };
