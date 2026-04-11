import { AppError, AppErrorField } from './loi-ung-dung';

interface UnauthorizedErrorOptions {
  message?: string;
  errorCode?: string;
  errors?: AppErrorField[];
}

class UnauthorizedError extends AppError {
  constructor({ message = 'Authentication is required to access this resource', errorCode = 'UNAUTHORIZED', errors = [] }: UnauthorizedErrorOptions = {}) {
    super({ message, statusCode: 401, errorCode, errors });
    this.name = 'UnauthorizedError';
  }
}

export { UnauthorizedError };
