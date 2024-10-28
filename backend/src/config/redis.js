const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// backend/src/services/CacheService.js
class CacheService {
  async get(key) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key, value) {
    await redis.set(key, JSON.stringify(value));
  }

  async del(key) {
    await redis.del(key);
  }
}

// backend/src/middleware/cache.js
const cacheService = new CacheService();

const cacheMiddleware = async (req, res, next) => {
  const cacheKey = req.url;
  const cachedResponse = await cacheService.get(cacheKey);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  await next();

  const response = res._getJSONData();
  await cacheService.set(cacheKey, response);
};
