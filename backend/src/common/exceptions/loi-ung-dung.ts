interface AppErrorField {
  field?: string;
  code?: string;
  detail?: string;
}

interface AppErrorOptions {
  message: string;
  statusCode?: number;
  errorCode?: string;
  errors?: AppErrorField[];
}

class AppError extends Error {
  statusCode: number;
  errorCode: string;
  errors: AppErrorField[];
  isOperational: boolean;

  constructor({ message, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', errors = [] }: AppErrorOptions) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = true;
  }
}

export { AppError, AppErrorOptions, AppErrorField };
