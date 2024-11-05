// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const {
  createEventsTable,
  createMinistriesTable,
} = require("./models/Dashboard");
const { createUserTable, createAdminUser } = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de logs detalhados
const logRequests = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
};

// Middlewares
app.use(logRequests);
app.use(
  cors({
    origin: "http://localhost:3000", // Permite requisições do frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verificar diretórios
const uploadsDir = path.join(__dirname, "uploads");
const profilesDir = path.join(uploadsDir, "profiles");

[uploadsDir, profilesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Diretório criado: ${dir}`);
  } else {
    console.log(`Diretório existente: ${dir}`);
  }
});

// Configurar pasta de uploads como estática
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rota de teste básica
app.get("/test", (req, res) => {
  res.json({ message: "Servidor está funcionando!" });
});

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "API está funcionando",
    timestamp: new Date().toISOString(),
  });
});

// Inicialização das tabelas
const initTables = async () => {
  try {
    console.log("Iniciando criação das tabelas...");
    await createUserTable();
    await createAdminUser();
    await createEventsTable();
    await createMinistriesTable();
    console.log("Todas as tabelas foram inicializadas com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar tabelas:", error);
  }
};

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error("Erro na aplicação:", err);
  res.status(500).json({
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Inicializa as tabelas
    await initTables();

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`=================================`);
      console.log(`Servidor iniciado com sucesso!`);
      console.log(`Porta: ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(`Uploads: ${uploadsDir}`);
      console.log(`Profiles: ${profilesDir}`);
      console.log(`=================================`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on("uncaughtException", (error) => {
  console.error("Erro não capturado:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Promise rejection não tratada:", error);
  process.exit(1);
});

// Inicia o servidor
startServer();

module.exports = app; // Para testes
