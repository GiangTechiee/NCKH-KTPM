const AppError = require('./app-error');

class ForbiddenError extends AppError {
  constructor({
    message = 'You do not have permission to perform this action',
    errorCode = 'FORBIDDEN',
    errors = [],
  } = {}) {
    super({
      message,
      statusCode: 403,
      errorCode,
      errors,
    });

    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
