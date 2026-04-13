import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

function parseBooleanEnv(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const datasourceUrl = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

  if (!datasourceUrl) {
    throw new Error('Thiếu DATABASE_URL hoặc DIRECT_URL để khởi tạo Prisma client');
  }

  if (!/^postgres(ql)?:\/\//i.test(datasourceUrl)) {
    throw new Error(
      'DATABASE_URL/DIRECT_URL không hợp lệ. Cần dùng đầy đủ connection string PostgreSQL, ví dụ: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require'
    );
  }

  const rejectUnauthorized = parseBooleanEnv(
    process.env.PG_SSL_REJECT_UNAUTHORIZED,
    process.env.NODE_ENV === 'production'
  );

  const adapter = new PrismaPg({
    connectionString: datasourceUrl,
    ssl: {
      rejectUnauthorized,
    },
  });

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
