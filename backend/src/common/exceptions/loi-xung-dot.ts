import { AppError, AppErrorField } from './loi-ung-dung';

interface ConflictErrorOptions {
  message?: string;
  errorCode?: string;
  errors?: AppErrorField[];
}

class ConflictError extends AppError {
  constructor({ message = 'Resource conflict detected', errorCode = 'CONFLICT', errors = [] }: ConflictErrorOptions = {}) {
    super({ message, statusCode: 409, errorCode, errors });
    this.name = 'ConflictError';
  }
}

export { ConflictError };
