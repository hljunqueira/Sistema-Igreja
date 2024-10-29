const pool = require("../config/db");

const createUserTable = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `);
    console.log("Tabela de usuários criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar a tabela de usuários:", error);
  }
};

createUserTable();

module.exports = {
  createUserTable, // Você pode adicionar mais funções relacionadas ao modelo User aqui
};
