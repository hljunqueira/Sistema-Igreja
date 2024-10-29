const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

// Validações para registro
const registerValidations = [
  body("name")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nome deve ter entre 2 e 50 caracteres"),

  body("email")
    .notEmpty()
    .withMessage("Email é obrigatório")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await pool.query(
        "SELECT 1 FROM users WHERE email = $1",
        [email]
      );
      if (existingUser.rows.length > 0) {
        throw new Error("Este email já está cadastrado");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("A senha deve ter pelo menos 6 caracteres")
    .matches(/\d/)
    .withMessage("A senha deve conter pelo menos um número")
    .matches(/[A-Z]/)
    .withMessage("A senha deve conter pelo menos uma letra maiúscula"),
];

// Validações para login
const loginValidations = [
  body("email")
    .notEmpty()
    .withMessage("Email é obrigatório")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Senha é obrigatória"),
];

// Rota de Registro - POST /api/register
router.post("/register", registerValidations, async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Erro de validação",
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Inserir usuário no banco de dados
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    // Gerar token JWT
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Usuário criado com sucesso!",
      token,
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
      },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({
      message: "Erro interno do servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Rota de Login - POST /api/login
router.post("/login", loginValidations, async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Erro de validação",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({
        message: "Credenciais inválidas",
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Credenciais inválidas",
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Retornar resposta de sucesso
    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      message: "Erro interno do servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Rota para obter informações do usuário - GET /api/user
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json(user.rows[0]);
  } catch (error) {
    console.error("Erro ao obter informações do usuário:", error);
    res.status(500).json({
      message: "Erro interno do servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Rota para atualizar senha - PUT /api/user/password
router.put(
  "/user/password",
  [
    authMiddleware,
    body("currentPassword").notEmpty().withMessage("Senha atual é obrigatória"),
    body("newPassword")
      .notEmpty()
      .withMessage("Nova senha é obrigatória")
      .isLength({ min: 6 })
      .withMessage("A nova senha deve ter pelo menos 6 caracteres")
      .matches(/\d/)
      .withMessage("A nova senha deve conter pelo menos um número")
      .matches(/[A-Z]/)
      .withMessage("A nova senha deve conter pelo menos uma letra maiúscula"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Erro de validação",
          errors: errors.array(),
        });
      }

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      // Verificar senha atual
      const user = await pool.query(
        "SELECT password FROM users WHERE id = $1",
        [userId]
      );
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.rows[0].password
      );

      if (!isValidPassword) {
        return res.status(401).json({
          message: "Senha atual incorreta",
        });
      }

      // Atualizar senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
        hashedPassword,
        userId,
      ]);

      res.status(200).json({
        message: "Senha atualizada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      res.status(500).json({
        message: "Erro interno do servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);
module.exports = router;
