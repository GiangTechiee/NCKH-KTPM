import { Router } from 'express';
import { sendSuccess } from '../common/utils/phan-hoi';

import authRouter from './xac-thuc';
import userRouter from './nguoi-dung';
import researchAreaRegistrationRouter from './dang-ky-mang-nghien-cuu';
import researchGroupRouter from './nhom-nghien-cuu';
import groupMatchingRouter from './ghep-nhom';
import lecturerAssignmentRouter from './phan-cong-giang-vien';
import lecturerTopicProposalRouter from './de-tai-de-xuat';
import topicSubmissionRouter from './nop-de-tai';
import topicReviewRouter from './duyet-de-tai';
import workflowStatusRouter from './trang-thai-quy-trinh';
import notificationRouter from './thong-bao';
import auditLogRouter from './nhat-ky-kiem-toan';

const router = Router();

const registeredModules = [
  { path: '/mang-nghien-cuu/dang-mo', key: 'dang-ky-mang-nghien-cuu' },
  { path: '/dang-ky-mang-nghien-cuu', key: 'dang-ky-mang-nghien-cuu' },
  { path: '/nhom-cua-toi', key: 'nhom-nghien-cuu' },
  { path: '/nhom-nghien-cuu', key: 'nhom-nghien-cuu' },
  { path: '/loi-moi-nhom/:id/chap-nhan', key: 'ghep-nhom' },
  { path: '/loi-moi-nhom/:id/tu-choi', key: 'ghep-nhom' },
  { path: '/goi-y-ghep-nhom', key: 'ghep-nhom' },
  { path: '/giang-vien/nhom/dang-huong-dan', key: 'phan-cong-giang-vien' },
  { path: '/giang-vien/nhom/co-the-nhan', key: 'phan-cong-giang-vien' },
  { path: '/giang-vien/nhom/:groupId', key: 'phan-cong-giang-vien' },
  { path: '/giang-vien/nhom/:groupId/nhan-huong-dan', key: 'phan-cong-giang-vien' },
  { path: '/de-tai-cua-toi/co-the-chon', key: 'nop-de-tai' },
  { path: '/nop-de-tai', key: 'nop-de-tai' },
  { path: '/nop-de-tai/:id', key: 'nop-de-tai' },
  { path: '/giang-vien/de-tai-cho-duyet', key: 'duyet-de-tai' },
  { path: '/giang-vien/de-tai/:id/duyet', key: 'duyet-de-tai' },
  { path: '/giang-vien/de-tai/:id/yeu-cau-chinh-sua', key: 'duyet-de-tai' },
  { path: '/giang-vien/de-tai/:id/tu-choi', key: 'duyet-de-tai' },
  { path: '/giang-vien/de-tai/:id/chot', key: 'duyet-de-tai' },
  { path: '/xac-thuc', key: 'xac-thuc' },
  { path: '/nguoi-dung', key: 'nguoi-dung' },
  { path: '/phan-cong-giang-vien', key: 'phan-cong-giang-vien' },
  { path: '/de-tai-de-xuat', key: 'de-tai-de-xuat' },
  { path: '/nop-de-tai', key: 'nop-de-tai' },
  { path: '/duyet-de-tai', key: 'duyet-de-tai' },
  { path: '/trang-thai-quy-trinh/giang-vien', key: 'trang-thai-quy-trinh' },
  { path: '/trang-thai-quy-trinh', key: 'trang-thai-quy-trinh' },
  { path: '/thong-bao', key: 'thong-bao' },
  { path: '/audit-logs/:entityType/:entityId', key: 'nhat-ky-kiem-toan' },
];

router.get('/', (_req, res) => {
  return sendSuccess(res, {
    message: 'Backend modules have been registered successfully',
    data: {
      modules: registeredModules.map((m) => ({ path: `/api${m.path}`, key: m.key })),
    },
  });
});

router.use(researchAreaRegistrationRouter);
router.use(researchGroupRouter);
router.use(groupMatchingRouter);
router.use(lecturerAssignmentRouter);
router.use('/xac-thuc', authRouter);
router.use('/nguoi-dung', userRouter);
router.use('/de-tai-de-xuat', lecturerTopicProposalRouter);
router.use('/nop-de-tai', topicSubmissionRouter);
router.use('/duyet-de-tai', topicReviewRouter);
router.use('/trang-thai-quy-trinh', workflowStatusRouter);
router.use('/thong-bao', notificationRouter);
router.use('/audit-logs', auditLogRouter);

export default router;
