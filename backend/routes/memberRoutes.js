// backend/routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// Listar todos os membros
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM members ORDER BY name ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar membros:", error);
    res.status(500).json({ message: "Erro ao listar membros" });
  }
});

// Criar novo membro (versão atualizada)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      birthDate,
      baptismDate,
      maritalStatus,
      spouse,
      children,
      occupation,
      notes,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO members 
       (name, email, phone, address, birth_date, baptism_date, marital_status, spouse, children, occupation, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [
        name,
        email,
        phone,
        address,
        birthDate,
        baptismDate,
        maritalStatus,
        spouse,
        children,
        occupation,
        notes,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    res.status(500).json({ message: "Erro ao criar membro" });
  }
});

// Atualizar membro
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
      maritalStatus,
      spouse,
      children,
      occupation,
      notes,
    } = req.body;

    const result = await pool.query(
      `UPDATE members 
       SET name = $1, email = $2, phone = $3, 
           address = $4, birth_date = $5, baptism_date = $6,
           marital_status = $7, spouse = $8, children = $9,
           occupation = $10, notes = $11
       WHERE id = $12 
       RETURNING *`,
      [
        name,
        email,
        phone,
        address,
        birthDate,
        baptismDate,
        maritalStatus,
        spouse,
        children,
        occupation,
        notes,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Membro não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar membro:", error);
    res.status(500).json({ message: "Erro ao atualizar membro" });
  }
});

// Deletar membro
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
    res.status(500).json({ message: "Erro ao deletar membro" });
  }
});

module.exports = router;
