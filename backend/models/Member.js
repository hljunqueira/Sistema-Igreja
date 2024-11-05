// backend/models/Member.js
const pool = require("../config/db");

const createMemberTable = async () => {
  try {
    await pool.query(`
// backend/models/Member.js (continuação)
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        birth_date DATE,
        baptism_date DATE,
        observations TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela de membros criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar a tabela de membros:", error);
  }
};

module.exports = {
  createMemberTable,
};
