// backend/middleware/cacheMiddleware.js
const mcache = require("memory-cache");

const cache = (duration) => {
  return (req, res, next) => {
    const key = "image-" + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      res.send(cachedBody);
      return;
    }

    res.sendResponse = res.send;
    res.send = (body) => {
      mcache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };
    next();
  };
};

module.exports = cache;
