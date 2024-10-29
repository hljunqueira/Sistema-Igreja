require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
const pool = require("./config/db");
const { createUserTable } = require("./models/User");
const app = express();
const PORT = process.env.PORT || 3001;
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
});

app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Importar rotas
const authRoutes = require("./routes/authRoutes");

// Usar rotas
app.use("/api", authRoutes);

// Rota de teste (GET)
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando!");
});

// Configuração HTTPS
const httpsOptions = {
  key: fs.readFileSync(
    path.join(__dirname, "certificates", "localhost-key.pem")
  ),
  cert: fs.readFileSync(path.join(__dirname, "certificates", "localhost.pem")),
};

// Criar servidor HTTPS
const server = https.createServer(httpsOptions, app);

// Inicie o servidor
server.listen(PORT, async () => {
  console.log(`Servidor HTTPS rodando na porta ${PORT}`);

  try {
    await createUserTable();
    console.log("Tabela de usuários criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar tabela de usuários:", error);
  }
});
