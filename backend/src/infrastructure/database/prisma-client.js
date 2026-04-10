const { PrismaClient } = require('@prisma/client');

const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL,
  });
}

function getPrismaClient() {
  if (!process.env.DIRECT_URL) {
    throw new Error('DIRECT_URL is required to initialize Prisma client');
  }

  if (!globalForPrisma.__prismaClient) {
    globalForPrisma.__prismaClient = createPrismaClient();
  }

  return globalForPrisma.__prismaClient;
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__getPrismaClient = getPrismaClient;
}

module.exports = {
  createPrismaClient,
  getPrismaClient,
};
