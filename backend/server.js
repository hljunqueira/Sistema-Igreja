require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const pool = require("./config/db");
const { createUserTable } = require("./models/User");
const { createMemberTable } = require("./models/Member");

// Importar rotas
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: "Muitas requisições deste IP, tente novamente mais tarde.",
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json());

// Rotas de API
app.use("/api", authRoutes);
app.use("/api/members", memberRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando!");
});

// Função para inicializar o banco de dados
async function initializeDatabase() {
  try {
    await createUserTable();
    await createMemberTable();
    console.log("Tabelas criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
    process.exit(1); // Encerra o processo em caso de erro crítico
  }
}

// Iniciar servidor
const startServer = async () => {
  try {
    // Inicializar banco de dados
    await initializeDatabase();

    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      console.log(`Servidor HTTP rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on("unhandledRejection", (error) => {
  console.error("Erro não tratado:", error);
  process.exit(1);
});

// Iniciar aplicação
startServer();
