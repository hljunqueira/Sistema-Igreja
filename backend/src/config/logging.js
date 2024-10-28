const winston = require("winston");

const loggingConfig = {
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
};

const logger = winston.createLogger(loggingConfig);

// backend/src/middleware/logging.js
const loggingMiddleware = async (req, res, next) => {
  logger.info(`Requisição ${req.method} ${req.url}`);
  await next();
};
