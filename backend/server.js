// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pool = require("./config/db");
const { createUserTable, addMissingColumns } = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
});

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(limiter);

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Inicialização do servidor
const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Conexão com o banco de dados estabelecida!");

    await createUserTable();
    await addMissingColumns();
    console.log("Estrutura da tabela de usuários verificada/atualizada!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro durante a inicialização:", error);
    process.exit(1);
  }
};

startServer();
