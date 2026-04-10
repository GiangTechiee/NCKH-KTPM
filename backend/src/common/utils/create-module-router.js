const express = require('express');

const { sendSuccess } = require('./response');

function createModuleRouter({ moduleKey, displayName }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    return sendSuccess(res, {
      message: `Module ${displayName} is ready for implementation`,
      data: {
        moduleKey,
        displayName,
        ready: true,
      },
    });
  });

  return router;
}

module.exports = createModuleRouter;
