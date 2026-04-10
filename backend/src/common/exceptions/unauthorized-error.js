const AppError = require('./app-error');

class UnauthorizedError extends AppError {
  constructor({
    message = 'Authentication is required to access this resource',
    errorCode = 'UNAUTHORIZED',
    errors = [],
  } = {}) {
    super({
      message,
      statusCode: 401,
      errorCode,
      errors,
    });

    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
