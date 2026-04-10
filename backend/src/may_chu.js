const express = require('express');

const errorHandler = require('./common/middlewares/error-handler');
const notFoundHandler = require('./common/middlewares/not-found-handler');
const { sendSuccess } = require('./common/utils/response');
const { getEnvConfig } = require('./infrastructure/config/env');
const moduleRouter = require('./modules');

if (typeof BigInt !== 'undefined' && !BigInt.prototype.toJSON) {
  BigInt.prototype.toJSON = function toJSON() {
    return this.toString();
  };
}

const app = express();
const envConfig = getEnvConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return sendSuccess(res, {
    message: 'Backend API is running',
    data: {
      service: 'backend',
      environment: envConfig.nodeEnv,
    },
  });
});

app.get('/api/health', (req, res) => {
  return sendSuccess(res, {
    message: 'System health check completed successfully',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
    },
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

module.exports = app;
