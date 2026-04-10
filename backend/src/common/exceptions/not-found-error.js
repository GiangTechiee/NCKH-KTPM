const AppError = require('./app-error');

class NotFoundError extends AppError {
  constructor(message = 'Resource not found', errors = []) {
    super({
      message,
      statusCode: 404,
      errorCode: 'NOT_FOUND',
      errors,
    });

    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
