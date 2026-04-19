import { Response } from 'express';
import { AppErrorField } from '../exceptions/loi-ung-dung';

interface SuccessPayload<T = unknown> {
  success: true;
  message: string;
  data: T | null;
}

interface ErrorPayload {
  success: false;
  message: string;
  errors: AppErrorField[];
}

function buildSuccessPayload<T>({ message = 'Operation completed successfully', data = null }: { message?: string; data?: T | null }): SuccessPayload<T> {
  return { success: true, message, data: data ?? null };
}

function buildErrorPayload({ message = 'Operation failed', errors = [] }: { message?: string; errors?: AppErrorField[] }): ErrorPayload {
  return { success: false, message, errors };
}

function sendSuccess<T>(res: Response, { statusCode = 200, message, data }: { statusCode?: number; message?: string; data?: T | null } = {}): Response {
  return res.status(statusCode).json(buildSuccessPayload({ message, data }));
}

function sendError(res: Response, { statusCode = 400, message, errors }: { statusCode?: number; message?: string; errors?: AppErrorField[] } = {}): Response {
  return res.status(statusCode).json(buildErrorPayload({ message, errors }));
}

export { buildSuccessPayload, buildErrorPayload, sendSuccess, sendError, SuccessPayload, ErrorPayload };
