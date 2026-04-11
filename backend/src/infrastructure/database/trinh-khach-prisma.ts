import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const datasourceUrl = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

  if (!datasourceUrl) {
    throw new Error('Thiếu DATABASE_URL hoặc DIRECT_URL để khởi tạo Prisma client');
  }

  const adapter = new PrismaPg(datasourceUrl);

  return new PrismaClient({
    adapter,
  });
}

function getPrismaClient(): PrismaClient {
  if (!global.__prismaClient) {
    global.__prismaClient = createPrismaClient();
  }
  return global.__prismaClient;
}

export { createPrismaClient, getPrismaClient };
