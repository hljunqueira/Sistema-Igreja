// backend/middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 uploads por 15 minutos
  delayMs: 0, // sem delay
});

module.exports = uploadLimiter;
