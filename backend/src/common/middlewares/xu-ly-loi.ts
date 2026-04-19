import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exceptions';
import { sendError } from '../utils/phan-hoi';

function errorHandler(error: Error, _req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    sendError(res, {
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  sendError(res, {
    statusCode: 500,
    message: 'Internal server error',
    errors: [
      {
        code: 'INTERNAL_SERVER_ERROR',
        detail: process.env.NODE_ENV === 'production' ? undefined : error.message,
      },
    ],
  });
}

export default errorHandler;
