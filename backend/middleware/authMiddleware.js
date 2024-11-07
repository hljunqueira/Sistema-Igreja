const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const authMiddleware = async (req, res, next) => {
  try {
    // Extrai o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

    // Chama o próximo middleware ou rota
    next();
  } catch (error) {
    // Tratamento específico para erro de expiração do token
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado." });
    }

    console.error("Erro na autenticação:", error);
    return res.status(401).json({ message: "Token inválido." });
  }
};

module.exports = authMiddleware;
