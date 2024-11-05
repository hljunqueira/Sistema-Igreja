// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

// Rota de registro - POST /api/register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Nome é obrigatório"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Senha deve ter no mínimo 6 caracteres"),
  ],
  async (req, res) => {
    try {
      // Validar inputs
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        email,
        password,
        user_type = "visitante",
        phone,
        birth_date,
        is_baptized,
        baptism_date,
      } = req.body;

      // Verificar se o email já existe
      const userExists = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      // Criptografar a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Inserir novo usuário
      const result = await pool.query(
        `INSERT INTO users (name, email, password, user_type, phone, birth_date, is_baptized, baptism_date) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING id, name, email, user_type`,
        [
          name,
          email,
          hashedPassword,
          user_type,
          phone,
          birth_date,
          is_baptized,
          baptism_date,
        ]
      );

      // Gerar token JWT
      const token = jwt.sign(
        { userId: result.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        message: "Usuário registrado com sucesso",
        user: result.rows[0],
        token,
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      res.status(500).json({ message: "Erro ao registrar usuário" });
    }
  }
);

// Rota de login - POST /api/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Verificar se o usuário existe
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Credenciais inválidas" });
      }

      const user = result.rows[0];

      // Verificar a senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Credenciais inválidas" });
      }

      // Gerar token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          user_type: user.user_type,
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro no servidor" });
    }
  }
);

// Rota para obter informações do usuário - GET /api/user
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Buscando usuário ID:", userId);

    const query = `
      SELECT id, name, email, user_type, profile_image_url
      FROM users 
      WHERE id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const userData = result.rows[0];
    console.log("Dados do usuário encontrados:", userData);

    res.json(userData);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ message: "Erro ao buscar dados do usuário" });
  }
});

module.exports = router;
