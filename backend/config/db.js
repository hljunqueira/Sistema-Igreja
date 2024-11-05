// backend/config/db.js
const { Pool } = require("pg");

// Configuração do pool
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "software-church",
  password: process.env.DB_PASSWORD || "Maker@1",
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Melhor tratamento de erros
pool.on("connect", () => {
  console.log("Base de Dados conectada com sucesso!");
});

pool.on("error", (err, client) => {
  console.error("Erro inesperado na conexão com o banco de dados:", err);
  console.error("Detalhes adicionais:", {
    code: err.code,
    detail: err.detail,
    table: err.table,
    constraint: err.constraint,
  });
  process.exit(-1);
});

// Função para testar a conexão
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Conexão com o banco de dados testada com sucesso!");
    client.release();
    return true;
  } catch (err) {
    console.error("Erro ao testar conexão com o banco de dados:", err);
    return false;
  }
};

module.exports = pool;
