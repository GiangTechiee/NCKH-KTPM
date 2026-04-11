const DEFAULT_PORT = 3000;

interface EnvConfig {
  port: number;
  nodeEnv: string;
}

function parsePort(rawPort: string | undefined): number {
  const parsedPort = Number.parseInt(rawPort ?? '', 10);
  if (Number.isNaN(parsedPort) || parsedPort <= 0) {
    return DEFAULT_PORT;
  }
  return parsedPort;
}

function getEnvConfig(): EnvConfig {
  return {
    port: parsePort(process.env.PORT),
    nodeEnv: process.env.NODE_ENV ?? 'development',
  };
}

export { DEFAULT_PORT, getEnvConfig, EnvConfig };
