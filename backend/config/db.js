// backend/config/db.js
const { Pool } = require("pg");

// Configuração do pool de conexões
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "software-church",
  password: process.env.DB_PASSWORD || "Maker@1", // Considere usar variáveis de ambiente para segurança
  port: process.env.DB_PORT || 5432,
  max: 20, // Número máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo em milissegundos que uma conexão pode ficar ociosa antes de ser liberada
  connectionTimeoutMillis: 2000, // Tempo em milissegundos para aguardar uma conexão antes de falhar
});

// Eventos do pool
pool.on("connect", () => {
  console.log("Base de Dados conectada com sucesso!");
});

pool.on("error", (err) => {
  console.error("Erro inesperado na conexão com o banco de dados:", err);
  process.exit(-1); // Finaliza o processo em caso de erro
});

// Função para testar a conexão
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    client.release(); // Libera o cliente após o uso
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    throw err; // Lança o erro para tratamento posterior
  }
};

module.exports = { pool, testConnection };
