const { NotFoundError } = require('../exceptions');

function notFoundHandler(req, res, next) {
  return next(
    new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`),
  );
}

module.exports = notFoundHandler;
