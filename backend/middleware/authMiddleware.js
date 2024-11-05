// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 1. Obter o token do cabeçalho da requisição
    const token = req.headers.authorization?.split(" ")[1]; // Usa a estrutura correta para obter o token

    // 2. Verificar se o token está presente
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    // 3. Verificar e decodificar o token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Use a chave secreta do ambiente
    req.user = { userId: decodedToken.userId }; // Armazena o ID do usuário decodificado na requisição

    console.log("Token decodificado:", decodedToken); // Log para debug
    next(); // Chama o próximo middleware ou rota
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

module.exports = authMiddleware;
