function buildSuccessPayload({
  message = 'Operation completed successfully',
  data = null,
}) {
  return {
    success: true,
    message,
    data,
  };
}

function buildErrorPayload({
  message = 'Operation failed',
  errors = [],
}) {
  return {
    success: false,
    message,
    errors,
  };
}

function sendSuccess(res, {
  statusCode = 200,
  message,
  data,
} = {}) {
  return res.status(statusCode).json(buildSuccessPayload({ message, data }));
}

function sendError(res, {
  statusCode = 400,
  message,
  errors,
} = {}) {
  return res.status(statusCode).json(buildErrorPayload({ message, errors }));
}

module.exports = {
  buildSuccessPayload,
  buildErrorPayload,
  sendSuccess,
  sendError,
};
