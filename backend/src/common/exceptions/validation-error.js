const AppError = require('./app-error');

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super({
      message,
      statusCode: 400,
      errorCode: 'VALIDATION_ERROR',
      errors,
    });

    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
