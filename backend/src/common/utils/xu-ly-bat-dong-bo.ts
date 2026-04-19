import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

function asyncHandler(handler: AsyncRequestHandler): RequestHandler {
  return function wrappedAsyncHandler(req: Request, res: Response, next: NextFunction): void {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export default asyncHandler;
