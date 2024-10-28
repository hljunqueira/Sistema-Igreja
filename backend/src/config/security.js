const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const securityConfig = {
  helmet: helmet(),
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições por janela
  }),
};

// backend/src/middleware/security.js
const securityMiddleware = async (req, res, next) => {
  await securityConfig.helmet(req, res, next);
  await securityConfig.rateLimit(req, res, next);
};
