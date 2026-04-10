const DEFAULT_PORT = 3000;

function parsePort(rawPort) {
  const parsedPort = Number.parseInt(rawPort, 10);

  if (Number.isNaN(parsedPort) || parsedPort <= 0) {
    return DEFAULT_PORT;
  }

  return parsedPort;
}

function getEnvConfig() {
  return {
    port: parsePort(process.env.PORT),
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

module.exports = {
  DEFAULT_PORT,
  getEnvConfig,
};
