const express = require('express');

const { sendSuccess } = require('../common/utils/response');

const authModuleRouter = require('./xac-thuc');
const userModuleRouter = require('./nguoi-dung');
const researchAreaRegistrationModuleRouter = require('./dang-ky-mang-nghien-cuu');
const researchGroupModuleRouter = require('./nhom-nghien-cuu');
const groupMatchingModuleRouter = require('./ghep-nhom');
const lecturerAssignmentModuleRouter = require('./phan-cong-giang-vien');
const lecturerTopicProposalModuleRouter = require('./de-tai-de-xuat');
const topicSubmissionModuleRouter = require('./nop-de-tai');
const topicReviewModuleRouter = require('./duyet-de-tai');
const workflowStatusModuleRouter = require('./trang-thai-quy-trinh');
const notificationModuleRouter = require('./thong-bao');
const auditLogModuleRouter = require('./nhat-ky-kiem-toan');

const router = express.Router();

const registeredModules = [
  { path: '/xac-thuc', key: 'xac-thuc', router: authModuleRouter },
  { path: '/nguoi-dung', key: 'nguoi-dung', router: userModuleRouter },
  {
    path: '/dang-ky-mang-nghien-cuu',
    key: 'dang-ky-mang-nghien-cuu',
    router: researchAreaRegistrationModuleRouter,
  },
  {
    path: '/nhom-nghien-cuu',
    key: 'nhom-nghien-cuu',
    router: researchGroupModuleRouter,
  },
  { path: '/ghep-nhom', key: 'ghep-nhom', router: groupMatchingModuleRouter },
  {
    path: '/phan-cong-giang-vien',
    key: 'phan-cong-giang-vien',
    router: lecturerAssignmentModuleRouter,
  },
  {
    path: '/de-tai-de-xuat',
    key: 'de-tai-de-xuat',
    router: lecturerTopicProposalModuleRouter,
  },
  { path: '/nop-de-tai', key: 'nop-de-tai', router: topicSubmissionModuleRouter },
  {
    path: '/duyet-de-tai',
    key: 'duyet-de-tai',
    router: topicReviewModuleRouter,
  },
  {
    path: '/trang-thai-quy-trinh',
    key: 'trang-thai-quy-trinh',
    router: workflowStatusModuleRouter,
  },
  { path: '/thong-bao', key: 'thong-bao', router: notificationModuleRouter },
  {
    path: '/nhat-ky-kiem-toan',
    key: 'nhat-ky-kiem-toan',
    router: auditLogModuleRouter,
  },
];

router.get('/', (req, res) => {
  return sendSuccess(res, {
    message: 'Backend modules have been registered successfully',
    data: {
      modules: registeredModules.map((moduleItem) => ({
        path: `/api${moduleItem.path}`,
        key: moduleItem.key,
      })),
    },
  });
});

registeredModules.forEach((moduleItem) => {
  router.use(moduleItem.path, moduleItem.router);
});

module.exports = router;
