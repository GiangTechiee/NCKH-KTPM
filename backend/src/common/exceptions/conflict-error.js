const AppError = require('./app-error');

class ConflictError extends AppError {
  constructor({
    message = 'Resource conflict detected',
    errorCode = 'CONFLICT',
    errors = [],
  } = {}) {
    super({
      message,
      statusCode: 409,
      errorCode,
      errors,
    });

    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
