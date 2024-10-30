// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("Auth Header:", authHeader); // Debug

    if (!authHeader) {
      return res.status(401).json({
        message: "Acesso negado. Header de autorização não fornecido.",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Token extraído:", token); // Debug

    if (!token) {
      return res.status(401).json({
        message: "Acesso negado. Token não fornecido.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado:", decoded); // Debug
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Erro na verificação do token:", error); // Debug
      return res.status(401).json({
        message: "Token inválido.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  } catch (error) {
    console.error("Erro no middleware de autenticação:", error);
    return res.status(500).json({
      message: "Erro interno no servidor",
    });
  }
};

module.exports = authMiddleware;
