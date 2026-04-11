import { AppError, AppErrorField } from './loi-ung-dung';

class NotFoundError extends AppError {
  constructor(message = 'Resource not found', errors: AppErrorField[] = []) {
    super({ message, statusCode: 404, errorCode: 'NOT_FOUND', errors });
    this.name = 'NotFoundError';
  }
}

export { NotFoundError };
