const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

// Rota para listar todos os usuários (apenas para administradores)
router.get(
  "/users",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id, name, email, user_type, created_at FROM users"
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  }
);

// Rota para atualizar o tipo de usuário (apenas para administradores)
router.put(
  "/users/:id",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { user_type } = req.body;
      const result = await pool.query(
        "UPDATE users SET user_type = $1 WHERE id = $2 RETURNING id, name, email, user_type",
        [user_type, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  }
);

module.exports = router;
