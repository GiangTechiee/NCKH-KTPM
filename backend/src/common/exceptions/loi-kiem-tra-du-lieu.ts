import { AppError, AppErrorField } from './loi-ung-dung';

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors: AppErrorField[] = []) {
    super({ message, statusCode: 400, errorCode: 'VALIDATION_ERROR', errors });
    this.name = 'ValidationError';
  }
}

export { ValidationError };
