// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");

// Rota de login - POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
  ],
  authController.login
);

// Rota de registro - POST /api/auth/register
router.post("/register", authController.register);

// Rota de verificação de autenticação - GET /api/auth/verify-auth
router.get("/verify-auth", authMiddleware, authController.verifyAuth);

// Rota de recuperação de senha - POST /api/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// Rota de redefinição de senha - POST /api/auth/reset-password
router.post("/reset-password", authController.resetPassword);

module.exports = router;
