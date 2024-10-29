// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1. Obter o token do cabeçalho da requisição
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // 2. Verificar se o token está presente
  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });
  }

  // 3. Verificar e decodificar o token
  try {
    const decoded = jwt.verify(token, "suaChaveSecreta"); // Substitua pela sua chave secreta
    req.user = decoded; // Armazena as informações do usuário decodificadas na requisição
    next(); // Chama o próximo middleware ou rota
  } catch (error) {
    return res.status(400).json({ message: "Token inválido." });
  }
};

module.exports = authMiddleware;
