const authorizationMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // Verifica se o usuário está autenticado e se o tipo de usuário está na lista de permissões
    if (!req.user || !allowedRoles.includes(req.user.user_type)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    next(); // Permite o acesso à rota se a verificação passar
  };
};

module.exports = authorizationMiddleware;
