import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPgPool(): Pool {
  const datasourceUrl = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

  if (!datasourceUrl) {
    throw new Error('Thiếu DATABASE_URL hoặc DIRECT_URL để khởi tạo kết nối cơ sở dữ liệu');
  }

  return new Pool({
    connectionString: datasourceUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

function createPrismaClient(): PrismaClient {
  const pool = global.__pgPool ?? createPgPool();
  global.__pgPool = pool;

  const adapter = new PrismaPg(pool);

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