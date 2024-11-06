const { pool } = require("../config/db");

// Função para criar a tabela de usuários
const createUserTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        user_type VARCHAR(20) NOT NULL DEFAULT 'visitante',
        is_baptized BOOLEAN DEFAULT FALSE,
        baptism_date DATE,
        profile_image_url TEXT,
        profile_image_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending',
        phone VARCHAR(20),
        birth_date DATE,
        address JSONB DEFAULT '{}',
        theme_preference VARCHAR(10) DEFAULT 'light',
        notifications_preferences JSONB DEFAULT '{"email": true, "push": true}'
      )
    `;
    await pool.query(query);
    console.log("Tabela de usuários verificada/criada com sucesso");
  } catch (error) {
    console.error("Erro ao criar tabela de usuários:", error);
    throw error;
  }
};

// Função para adicionar colunas que estão faltando
const addMissingColumns = async () => {
  try {
    const columnsToAdd = [
      { name: "phone", type: "VARCHAR(20)" },
      { name: "birth_date", type: "DATE" },
      { name: "address", type: "JSONB", default: "'{}'" },
      { name: "theme_preference", type: "VARCHAR(10)", default: "'light'" },
      {
        name: "notifications_preferences",
        type: "JSONB",
        default: '\'{"email": true, "push": true}\'',
      },
      { name: "is_baptized", type: "BOOLEAN", default: "FALSE" },
      { name: "baptism_date", type: "DATE" },
      { name: "status", type: "VARCHAR(20)", default: "'pending'" },
      {
        name: "created_at",
        type: "TIMESTAMP WITH TIME ZONE",
        default: "CURRENT_TIMESTAMP",
      },
    ];

    for (const column of columnsToAdd) {
      const query = `
        DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = '${column.name}'
          ) THEN 
            ALTER TABLE users 
            ADD COLUMN ${column.name} ${column.type} ${
        column.default ? `DEFAULT ${column.default}` : ""
      };
          END IF;
        END $$;
      `;
      await pool.query(query);
      console.log(`Coluna ${column.name} verificada/criada com sucesso`);
    }
  } catch (error) {
    console.error("Erro ao adicionar colunas:", error);
    throw error;
  }
};

// Função para obter usuário por email
const getUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// Função para obter usuário por ID
const getUserById = async (id) => {
  const query = `
    SELECT 
      id, name, email, user_type, profile_image_url, profile_image_id,
      phone, birth_date, address, theme_preference, notifications_preferences,
      is_baptized, baptism_date, status
    FROM users 
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Função para atualizar usuário
const updateUser = async (id, userData) => {
  const query = `
    UPDATE users
    SET 
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      birth_date = COALESCE($4, birth_date),
      address = COALESCE($5, address),
      theme_preference = COALESCE($6, theme_preference),
      notifications_preferences = COALESCE($7, notifications_preferences),
      is_baptized = COALESCE($8, is_baptized),
      baptism_date = COALESCE($9, baptism_date),
      status = COALESCE($10, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $11
    RETURNING *
  `;
  const values = [
    userData.name,
    userData.email,
    userData.phone,
    userData.birth_date,
    userData.address,
    userData.theme_preference,
    userData.notifications_preferences,
    userData.is_baptized,
    userData.baptism_date,
    userData.status,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Função para criar a tabela de pastores
const createPastorTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS pastores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        data_ordenacao DATE,
        formacao TEXT,
        especializacoes TEXT[],
        biografia TEXT,
        status VARCHAR(20) DEFAULT 'ativo',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log("Tabela de pastores verificada/criada com sucesso");
  } catch (error) {
    console.error("Erro ao criar tabela de pastores:", error);
    throw error;
  }
};

// Função para criar a tabela de líderes
const createLiderTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS lideres (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        area_lideranca VARCHAR(100),
        descricao_funcao TEXT,
        data_inicio DATE,
        status VARCHAR(20) DEFAULT 'ativo',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log("Tabela de líderes verificada/criada com sucesso");
  } catch (error) {
    console.error("Erro ao criar tabela de líderes:", error);
    throw error;
  }
};

module.exports = {
  createUserTable,
  addMissingColumns,
  getUserByEmail,
  getUserById,
  updateUser,
  createPastorTable,
  createLiderTable,
};
