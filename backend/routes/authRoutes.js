// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Rota de Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const user = userResult.rows[0];

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remover senha do objeto do usuário
    delete user.password;

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profile_image_url,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro ao realizar login" });
  }
});

// Rota de Registro
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se o email já está em uso
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email já está em uso" });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Inserir novo usuário
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ message: "Erro ao realizar registro" });
  }
});

// Atualização de perfil (mantido do código anterior)
router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    // ... (manter o código existente da rota de atualização de perfil)
  }
);

module.exports = router;
