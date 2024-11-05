const authorizationMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.user_type)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    next();
  };
};

module.exports = authorizationMiddleware;
