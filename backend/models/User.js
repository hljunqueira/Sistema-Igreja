const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const createUserTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        profile_image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela de usuários criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar a tabela de usuários:", error);
    throw error;
  }
};

const createAdminUser = async () => {
  try {
    // Verifica se já existe um admin
    const adminExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      ["admin@admin.com"]
    );

    if (adminExists.rows.length === 0) {
      // Cria hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Admin@123", salt);

      // Insere o usuário admin
      await pool.query(
        "INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4)",
        ["Admin", "admin@admin.com", hashedPassword, true]
      );
      console.log("Usuário admin criado com sucesso!");
    } else {
      console.log("Usuário admin já existe!");
    }
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error);
  }
};

module.exports = {
  createUserTable,
  createAdminUser,
};
