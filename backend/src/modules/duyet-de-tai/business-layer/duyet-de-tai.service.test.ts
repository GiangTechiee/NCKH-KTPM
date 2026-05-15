import assert from 'node:assert/strict';
import test from 'node:test';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../common/exceptions';
import {
  AuditAction,
  GroupStatus,
  TopicSubmissionStatus,
  UserRole,
} from '../../../common/constants';
import { CoSoDuLieu, DuyetDeTaiRepository } from '../data-access-layer/duyet-de-tai.repository';
import { DuyetDeTaiService, QuyetDinhPheDuyet } from './duyet-de-tai.service';
import { TaoNhatKyKiemToanInput } from '../../nhat-ky-kiem-toan/types/nhat-ky-kiem-toan.types';
import { TaoThongBaoInput } from '../../thong-bao/types/thong-bao.types';

interface MockState {
  auditRecords: TaoNhatKyKiemToanInput[];
  groupStatuses: string[];
  notifications: TaoThongBaoInput[];
  updatedTopicStatuses: string[];
}

const transactionClient = {} as CoSoDuLieu;

function createTopic(overrides: Record<string, unknown> = {}) {
  return {
    id: 10n,
    nhomNghienCuuId: 20n,
    giangVienId: 30n,
    danhMucDeTaiGiangVienId: null,
    tenDeTai: 'He thong ho tro nghien cuu khoa hoc',
    loaiDeTai: 'NHOM_DE_XUAT',
    moTaVanDe: 'Mo ta van de',
    mucTieuNghienCuu: 'Muc tieu nghien cuu',
    ungDungThucTien: null,
    phamViNghienCuu: null,
    congNgheSuDung: null,
    lyDoLuaChon: null,
    nhanXetGiangVien: null,
    ghiChuChinhSua: null,
    soLanChinhSua: 0,
    trangThai: TopicSubmissionStatus.CHO_GIANG_VIEN_DUYET,
    thoiGianNop: new Date('2026-05-01T00:00:00.000Z'),
    thoiGianDuyet: null,
    thoiGianChot: null,
    hanChinhSua: null,
    ngayTao: new Date('2026-05-01T00:00:00.000Z'),
    ngayCapNhat: new Date('2026-05-01T00:00:00.000Z'),
    nhomNghienCuu: {
      id: 20n,
      tenNhom: 'Nhom 04',
      trangThai: GroupStatus.CHO_DUYET_DE_TAI,
      mangNghienCuu: { tenMang: 'Cong nghe phan mem' },
      thanhVien: [
        {
          id: 1n,
          sinhVienId: 100n,
          vaiTro: 'TRUONG_NHOM',
          sinhVien: { maSinhVien: 'SV001', hoTen: 'Tran Truong Giang' },
        },
      ],
    },
    ...overrides,
  };
}

function createService(topicOverride?: Record<string, unknown> | null) {
  const state: MockState = {
    auditRecords: [],
    groupStatuses: [],
    notifications: [],
    updatedTopicStatuses: [],
  };

  const topic = topicOverride === null ? null : createTopic(topicOverride);

  const repository = {
    async timDeTaiChoDuyetCuaGiangVien() {
      return topic ? [topic] : [];
    },
    async timDeTaiTheoId() {
      return topic;
    },
    async capNhatKetQuaDuyet(
      _deTaiId: bigint,
      duLieu: {
        trangThai: string;
        nhanXetGiangVien: string | null;
        ghiChuChinhSua: string | null;
        thoiGianDuyet: Date;
        hanChinhSua: Date | null;
      }
    ) {
      state.updatedTopicStatuses.push(duLieu.trangThai);

      if (!topic) {
        throw new Error('Topic fixture is missing');
      }

      return {
        ...topic,
        ...duLieu,
      };
    },
    async chotDeTai(_deTaiId: bigint, thoiGianChot: Date) {
      if (!topic) {
        throw new Error('Topic fixture is missing');
      }

      return {
        ...topic,
        trangThai: TopicSubmissionStatus.DA_CHOT,
        thoiGianChot,
      };
    },
    async capNhatTrangThaiNhom(_nhomNghienCuuId: bigint, trangThai: string) {
      state.groupStatuses.push(trangThai);
      return { id: 20n, trangThai };
    },
  } as unknown as DuyetDeTaiRepository;

  const prisma = {
    async $transaction<T>(callback: (coSoDuLieu: CoSoDuLieu) => Promise<T>): Promise<T> {
      return callback(transactionClient);
    },
  } as unknown as Pick<PrismaClient, '$transaction'>;

  const auditService = {
    async taoBanGhi(input: TaoNhatKyKiemToanInput): Promise<void> {
      state.auditRecords.push(input);
    },
  };

  const notificationService = {
    async taoNhieuThongBao(inputs: TaoThongBaoInput[]): Promise<void> {
      state.notifications.push(...inputs);
    },
  };

  return {
    service: new DuyetDeTaiService(repository, prisma, auditService, notificationService),
    state,
  };
}

async function assertRejectsWithAppError(
  action: () => Promise<unknown>,
  errorName: string,
  errorCode?: string
): Promise<void> {
  await assert.rejects(
    action,
    (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.name, errorName);

      if (errorCode) {
        assert.equal(error.errorCode, errorCode);
      }

      return true;
    }
  );
}

test('batBuocCoNhanXet returns true for approve decision with comment', () => {
  const { service } = createService();
  assert.equal(service.batBuocCoNhanXet(QuyetDinhPheDuyet.PHE_DUYET, 'Dong y phe duyet'), true);
});

test('batBuocCoNhanXet returns false for approve decision without comment', () => {
  const { service } = createService();
  assert.equal(service.batBuocCoNhanXet(QuyetDinhPheDuyet.PHE_DUYET, '   '), false);
});

test('batBuocCoNhanXet returns true for reject decision with reason', () => {
  const { service } = createService();
  assert.equal(service.batBuocCoNhanXet(QuyetDinhPheDuyet.TU_CHOI, null, 'Khong phu hop'), true);
});

test('batBuocCoNhanXet returns false for request changes decision without comment or reason', () => {
  const { service } = createService();
  assert.equal(service.batBuocCoNhanXet(QuyetDinhPheDuyet.YEU_CAU_CHINH_SUA, '', ''), false);
});

test('doiTrangThai rejects when topic does not exist', async () => {
  const { service } = createService(null);

  await assertRejectsWithAppError(
    () =>
      service.doiTrangThai({
        deTaiId: 10n,
        trangThaiMoi: TopicSubmissionStatus.DA_DUYET,
        nguoiThucHienId: 30n,
        thoiDiemCapNhat: new Date(),
        nhanXetGiangVien: 'Hop le',
        ghiChuChinhSua: null,
        hanChinhSua: null,
        coSoDuLieu: transactionClient,
      }),
    'NotFoundError',
    'NOT_FOUND'
  );
});

test('doiTrangThai rejects invalid status value', async () => {
  const { service } = createService();

  await assertRejectsWithAppError(
    () =>
      service.doiTrangThai({
        deTaiId: 10n,
        trangThaiMoi: 'SAI_TRANG_THAI' as TopicSubmissionStatus,
        nguoiThucHienId: 30n,
        thoiDiemCapNhat: new Date(),
        nhanXetGiangVien: 'Hop le',
        ghiChuChinhSua: null,
        hanChinhSua: null,
        coSoDuLieu: transactionClient,
      }),
    'ValidationError',
    'VALIDATION_ERROR'
  );
});

test('doiTrangThai rejects invalid status transition', async () => {
  const { service } = createService({ trangThai: TopicSubmissionStatus.DA_CHOT });

  await assertRejectsWithAppError(
    () =>
      service.doiTrangThai({
        deTaiId: 10n,
        trangThaiMoi: TopicSubmissionStatus.DA_DUYET,
        nguoiThucHienId: 30n,
        thoiDiemCapNhat: new Date(),
        nhanXetGiangVien: 'Hop le',
        ghiChuChinhSua: null,
        hanChinhSua: null,
        coSoDuLieu: transactionClient,
      }),
    'ConflictError',
    'INVALID_TOPIC_STATUS_TRANSITION'
  );
});

test('doiTrangThai updates topic when transition is valid', async () => {
  const { service, state } = createService();

  const result = await service.doiTrangThai({
    deTaiId: 10n,
    trangThaiMoi: TopicSubmissionStatus.DA_DUYET,
    nguoiThucHienId: 30n,
    thoiDiemCapNhat: new Date(),
    nhanXetGiangVien: 'Hop le',
    ghiChuChinhSua: null,
    hanChinhSua: null,
    coSoDuLieu: transactionClient,
  });

  assert.equal(result.trangThai, TopicSubmissionStatus.DA_DUYET);
  assert.deepEqual(state.updatedTopicStatuses, [TopicSubmissionStatus.DA_DUYET]);
});

test('duyetDeTai rejects when topic does not exist', async () => {
  const { service } = createService(null);

  await assertRejectsWithAppError(
    () => service.duyetDeTai(30n, { deTaiId: 10n, nhanXet: 'Hop le' }),
    'NotFoundError',
    'NOT_FOUND'
  );
});

test('duyetDeTai rejects lecturer without permission', async () => {
  const { service } = createService({ giangVienId: 999n });

  await assertRejectsWithAppError(
    () => service.duyetDeTai(30n, { deTaiId: 10n, nhanXet: 'Hop le' }),
    'ForbiddenError',
    'LECTURER_CANNOT_REVIEW_TOPIC'
  );
});

test('duyetDeTai rejects finalized topic', async () => {
  const { service } = createService({ trangThai: TopicSubmissionStatus.DA_CHOT });

  await assertRejectsWithAppError(
    () => service.duyetDeTai(30n, { deTaiId: 10n, nhanXet: 'Hop le' }),
    'ConflictError',
    'TOPIC_ALREADY_FINALIZED'
  );
});

test('duyetDeTai rejects topic that is not pending review', async () => {
  const { service } = createService({ trangThai: TopicSubmissionStatus.NHAP });

  await assertRejectsWithAppError(
    () => service.duyetDeTai(30n, { deTaiId: 10n, nhanXet: 'Hop le' }),
    'ConflictError',
    'TOPIC_NOT_PENDING_REVIEW'
  );
});

test('duyetDeTai rejects missing approval comment', async () => {
  const { service } = createService();

  await assertRejectsWithAppError(
    () => service.duyetDeTai(30n, { deTaiId: 10n, nhanXet: '   ' }),
    'ValidationError',
    'VALIDATION_ERROR'
  );
});

test('duyetDeTai approves topic, updates group, audits, and notifies members', async () => {
  const { service, state } = createService();

  const result = await service.duyetDeTai(30n, { deTaiId: 10n, nhanXet: 'Dong y phe duyet' });

  assert.equal(result.trangThai, TopicSubmissionStatus.DA_DUYET);
  assert.deepEqual(state.updatedTopicStatuses, [TopicSubmissionStatus.DA_DUYET]);
  assert.deepEqual(state.groupStatuses, [GroupStatus.DA_DUYET_DE_TAI]);
  assert.equal(state.auditRecords[0].hanhDong, AuditAction.DUYET_DE_TAI);
  assert.equal(state.auditRecords[0].vaiTroNguoiThucHien, UserRole.GIANG_VIEN);
  assert.equal(state.notifications.length, 1);
});

test('yeuCauChinhSua rejects missing comment', async () => {
  const { service } = createService();

  await assertRejectsWithAppError(
    () => service.yeuCauChinhSua(30n, { deTaiId: 10n, nhanXet: '' }),
    'ValidationError',
    'VALIDATION_ERROR'
  );
});

test('yeuCauChinhSua rejects when topic does not exist', async () => {
  const { service } = createService(null);

  await assertRejectsWithAppError(
    () => service.yeuCauChinhSua(30n, { deTaiId: 10n, nhanXet: 'Can chinh sua' }),
    'NotFoundError',
    'NOT_FOUND'
  );
});

test('yeuCauChinhSua rejects lecturer without permission', async () => {
  const { service } = createService({ giangVienId: 999n });

  await assertRejectsWithAppError(
    () => service.yeuCauChinhSua(30n, { deTaiId: 10n, nhanXet: 'Can chinh sua' }),
    'ForbiddenError',
    'LECTURER_CANNOT_REVIEW_TOPIC'
  );
});

test('yeuCauChinhSua rejects finalized topic', async () => {
  const { service } = createService({ trangThai: TopicSubmissionStatus.DA_CHOT });

  await assertRejectsWithAppError(
    () => service.yeuCauChinhSua(30n, { deTaiId: 10n, nhanXet: 'Can chinh sua' }),
    'ConflictError',
    'TOPIC_ALREADY_FINALIZED'
  );
});

test('yeuCauChinhSua rejects topic that is not pending review', async () => {
  const { service } = createService({ trangThai: TopicSubmissionStatus.NHAP });

  await assertRejectsWithAppError(
    () => service.yeuCauChinhSua(30n, { deTaiId: 10n, nhanXet: 'Can chinh sua' }),
    'ConflictError',
    'TOPIC_NOT_PENDING_REVIEW'
  );
});

test('yeuCauChinhSua stores revision request and updates group status', async () => {
  const { service, state } = createService();

  const result = await service.yeuCauChinhSua(30n, {
    deTaiId: 10n,
    nhanXet: 'Can bo sung muc tieu nghien cuu',
  });

  assert.equal(result.trangThai, TopicSubmissionStatus.CAN_CHINH_SUA);
  assert.deepEqual(state.updatedTopicStatuses, [TopicSubmissionStatus.CAN_CHINH_SUA]);
  assert.deepEqual(state.groupStatuses, [GroupStatus.CAN_CHINH_SUA_DE_TAI]);
  assert.equal(state.auditRecords[0].hanhDong, AuditAction.YEU_CAU_CHINH_SUA_DE_TAI);
});

test('tuChoiDeTai rejects missing reason', async () => {
  const { service } = createService();

  await assertRejectsWithAppError(
    () => service.tuChoiDeTai(30n, { deTaiId: 10n, nhanXet: '   ' }),
    'ValidationError',
    'VALIDATION_ERROR'
  );
});

test('tuChoiDeTai rejects when topic does not exist', async () => {
  const { service } = createService(null);

  await assertRejectsWithAppError(
    () => service.tuChoiDeTai(30n, { deTaiId: 10n, nhanXet: 'Khong phu hop' }),
    'NotFoundError',
    'NOT_FOUND'
  );
});

test('tuChoiDeTai rejects lecturer without permission', async () => {
  const { service } = createService({ giangVienId: 999n });

  await assertRejectsWithAppError(
    () => service.tuChoiDeTai(30n, { deTaiId: 10n, nhanXet: 'Khong phu hop' }),
    'ForbiddenError',
    'LECTURER_CANNOT_REVIEW_TOPIC'
  );
});

test('tuChoiDeTai rejects finalized topic', async () => {
  const { service } = createService({ trangThai: TopicSubmissionStatus.DA_CHOT });

  await assertRejectsWithAppError(
    () => service.tuChoiDeTai(30n, { deTaiId: 10n, nhanXet: 'Khong phu hop' }),
    'ConflictError',
    'TOPIC_ALREADY_FINALIZED'
  );
});

test('tuChoiDeTai rejects topic that is not pending review', async () => {
  const { service } = createService({ trangThai: TopicSubmissionStatus.NHAP });

  await assertRejectsWithAppError(
    () => service.tuChoiDeTai(30n, { deTaiId: 10n, nhanXet: 'Khong phu hop' }),
    'ConflictError',
    'TOPIC_NOT_PENDING_REVIEW'
  );
});

test('tuChoiDeTai stores rejection and returns group to topic selection', async () => {
  const { service, state } = createService();

  const result = await service.tuChoiDeTai(30n, {
    deTaiId: 10n,
    nhanXet: 'De tai chua phu hop voi mang nghien cuu',
  });

  assert.equal(result.trangThai, TopicSubmissionStatus.TU_CHOI);
  assert.deepEqual(state.updatedTopicStatuses, [TopicSubmissionStatus.TU_CHOI]);
  assert.deepEqual(state.groupStatuses, [GroupStatus.DANG_CHON_DE_TAI]);
  assert.equal(state.auditRecords[0].hanhDong, AuditAction.TU_CHOI_DE_TAI);
});
