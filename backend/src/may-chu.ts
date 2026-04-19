import express from 'express';
import errorHandler from './common/middlewares/xu-ly-loi';
import notFoundHandler from './common/middlewares/xu-ly-khong-tim-thay';
import { sendSuccess } from './common/utils/phan-hoi';
import { getEnvConfig } from './infrastructure/config/moi-truong';
import moduleRouter from './modules';

// Hỗ trợ serialize BigInt sang JSON
declare global {
  interface BigInt {
    toJSON(): string;
  }
}
BigInt.prototype.toJSON = function toJSON() {
  return this.toString();
};

const app = express();
const envConfig = getEnvConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  return sendSuccess(res, {
    message: 'Backend API is running',
    data: { service: 'backend', environment: envConfig.nodeEnv },
  });
});

app.get('/api/health', (_req, res) => {
  return sendSuccess(res, {
    message: 'System health check completed successfully',
    data: { status: 'OK', timestamp: new Date().toISOString() },
  });
});

app.use('/api', moduleRouter);
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(envConfig.port, () => {
    console.log(`Server is running on port ${envConfig.port}`);
  });
}

export default app;
