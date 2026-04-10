const { AppError } = require('../exceptions');
const { sendError } = require('../utils/response');

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return sendError(res, {
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors,
    });
  }

  return sendError(res, {
    statusCode: 500,
    message: 'Internal server error',
    errors: [
      {
        code: 'INTERNAL_SERVER_ERROR',
        detail: process.env.NODE_ENV === 'production' ? undefined : error.message,
      },
    ],
  });
}

module.exports = errorHandler;
