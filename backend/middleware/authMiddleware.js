// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const authMiddleware = async (req, res, next) => {
  try {
    // Extrai o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token recebido:", token);

    // Verifica se o token foi fornecido
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);

    // Busca o usuário no banco de dados
    const result = await pool.query(
      "SELECT id, user_type FROM users WHERE id = $1",
      [decoded.userId]
    );

    // Verifica se o usuário existe
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    // Adiciona os dados do usuário ao objeto req para uso posterior
    req.user = {
      id: result.rows[0].id,
      user_type: result.rows[0].user_type,
    };

    console.log("Usuário autenticado:", req.user);

    // Chama o próximo middleware ou rota
    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(401).json({
      message: "Token inválido ou expirado.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined, // Exibe mensagem de erro detalhada apenas em desenvolvimento
    });
  }
};

module.exports = authMiddleware;
