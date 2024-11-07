// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { testConnection } = require("./config/db");
const {
  createUserTable,
  addMissingColumns,
  createPastorTable,
  createLiderTable,
} = require("./models/User");
const { createEventTable } = require("./models/Event");

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
});

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Permitir requisições do frontend
    credentials: true,
  })
);
app.use(express.json()); // Para lidar com JSON
app.use(limiter); // Aplicar rate limiting

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas
app.use("/api/auth", authRoutes); // Rotas de autenticação
app.use("/api/user", userRoutes); // Rotas de usuário
app.use("/api/admin", adminRoutes); // Rotas de admin
app.use("/api/events", eventRoutes); // Rotas de eventos

// Iniciar o servidor
const startServer = async () => {
  try {
    await testConnection();
    await createUserTable();
    await addMissingColumns();
    await createPastorTable();
    await createLiderTable();
    await createEventTable(); // Certifique-se de que esta linha está presente
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro durante a inicialização:", error);
  }
};

startServer();
