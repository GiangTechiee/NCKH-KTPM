import { Router } from 'express';
import { sendSuccess } from './phan-hoi';

interface ModuleRouterOptions {
  moduleKey: string;
  displayName: string;
}

function createModuleRouter({ moduleKey, displayName }: ModuleRouterOptions): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    return sendSuccess(res, {
      message: `Module ${displayName} is ready for implementation`,
      data: { moduleKey, displayName, ready: true },
    });
  });

  return router;
}

export default createModuleRouter;
