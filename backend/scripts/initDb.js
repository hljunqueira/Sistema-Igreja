require("dotenv").config();
const { createUserTable, createAdminUser } = require("../models/User");

async function initializeDatabase() {
  try {
    // Criar tabela de usuários
    await createUserTable();

    // Criar usuário admin
    await createAdminUser();

    console.log("Inicialização do banco de dados concluída!");
    process.exit(0);
  } catch (error) {
    console.error("Erro na inicialização do banco de dados:", error);
    process.exit(1);
  }
}

initializeDatabase();
