const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

// Rota para listar todos os usuários
router.get(
  "/users",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          id, 
          name, 
          email, 
          user_type, 
          is_baptized,
          baptism_date,
          updated_at as created_at,
          phone,
          birth_date,
          status,
          address,
          theme_preference,
          notifications_preferences
        FROM users
        ORDER BY updated_at DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  }
);

// Rota para excluir um usuário
router.delete(
  "/users/:id",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar se o usuário existe
      const checkUser = await pool.query("SELECT id FROM users WHERE id = $1", [
        id,
      ]);

      if (checkUser.rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Excluir o usuário
      await pool.query("DELETE FROM users WHERE id = $1", [id]);

      res.json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      res.status(500).json({ message: "Erro ao excluir usuário" });
    }
  }
);

// Rota para atualizar o tipo de usuário
router.put(
  "/users/:id",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { user_type } = req.body;

      // Verificar se o tipo de usuário é válido
      const validUserTypes = ["visitante", "membro", "administrador"];
      if (!validUserTypes.includes(user_type)) {
        return res.status(400).json({ message: "Tipo de usuário inválido" });
      }

      // Atualizar o usuário
      const result = await pool.query(
        `UPDATE users 
         SET user_type = $1, 
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 
         RETURNING id, name, email, user_type, is_baptized, baptism_date`,
        [user_type, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  }
);

// Rota para obter detalhes de um usuário específico
router.get(
  "/users/:id",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT 
          id, 
          name, 
          email, 
          user_type, 
          is_baptized,
          baptism_date,
          updated_at as created_at,
          phone,
          birth_date,
          status,
          address,
          theme_preference,
          notifications_preferences
        FROM users WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário:", error);
      res.status(500).json({ message: "Erro ao buscar detalhes do usuário" });
    }
  }
);

module.exports = router;
