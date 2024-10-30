// backend/models/Member.js
const pool = require("../config/db");

const createMemberTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        birth_date DATE,
        baptism_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela de membros criada ou já existente");
  } catch (error) {
    console.error("Erro ao criar tabela de membros:", error);
    throw error;
  }
};

module.exports = { createMemberTable };
