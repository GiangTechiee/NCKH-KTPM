import { AppError, AppErrorField } from './loi-ung-dung';

interface ForbiddenErrorOptions {
  message?: string;
  errorCode?: string;
  errors?: AppErrorField[];
}

class ForbiddenError extends AppError {
  constructor({ message = 'You do not have permission to perform this action', errorCode = 'FORBIDDEN', errors = [] }: ForbiddenErrorOptions = {}) {
    super({ message, statusCode: 403, errorCode, errors });
    this.name = 'ForbiddenError';
  }
}

export { ForbiddenError };
