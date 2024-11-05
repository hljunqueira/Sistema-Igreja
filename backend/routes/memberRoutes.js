// backend/routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// Rota para adicionar um novo membro
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      birthDate,
      baptismDate,
      observations,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO members 
       (name, email, phone, address, birth_date, baptism_date, observations) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, email, phone, address, birthDate, baptismDate, observations]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao adicionar membro:", error);
    res
      .status(500)
      .json({ message: "Erro ao adicionar membro", error: error.message });
  }
});

// Rota para obter todos os membros
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM members ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar membros", error: error.message });
  }
});

// Rota para obter um membro específico
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM members WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Membro não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar membro:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar membro", error: error.message });
  }
});

// Rota para atualizar um membro
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      birthDate,
      baptismDate,
      observations,
    } = req.body;

    const result = await pool.query(
      `UPDATE members 
       SET name = $1, email = $2, phone = $3, address = $4, 
           birth_date = $5, baptism_date = $6, observations = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [name, email, phone, address, birthDate, baptismDate, observations, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Membro não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar membro:", error);
    res
      .status(500)
      .json({ message: "Erro ao atualizar membro", error: error.message });
  }
});

// Rota para deletar um membro
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM members WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Membro não encontrado" });
    }

    res.json({ message: "Membro deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar membro:", error);
    res
      .status(500)
      .json({ message: "Erro ao deletar membro", error: error.message });
  }
});

module.exports = router;
