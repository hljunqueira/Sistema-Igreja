const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", // Substitua pelo seu usuário do PostgreSQL, se necessário
  host: "localhost",
  database: "sistemacasadeoracao", // Nome do seu banco de dados
  password: "Maker@1", // Substitua pela sua senha do PostgreSQL
  port: 5432, // Porta padrão do PostgreSQL
});

pool.on("error", (err, client) => {
  console.error("Erro inesperado na conexão com o banco de dados:", err);
  process.exit(-1); // Encerra a aplicação em caso de erro na conexão
});

module.exports = pool;
