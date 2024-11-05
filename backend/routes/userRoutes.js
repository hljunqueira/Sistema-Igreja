// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passwordController = require("../controllers/passwordController");
const authMiddleware = require("../middleware/authMiddleware");
const { handleUpload } = require("../middleware/uploadMiddleware");
const { validateProfileUpdate } = require("../middleware/validationMiddleware");

// Rota para obter o perfil do usuário
router.get("/profile", authMiddleware, userController.getUserProfile);

// Rota para atualizar o perfil do usuário
router.put(
  "/profile",
  authMiddleware,
  validateProfileUpdate,
  userController.updateUserProfile
);

// Rota para atualizar a imagem de perfil do usuário
router.post(
  "/profile/image",
  authMiddleware,
  handleUpload,
  userController.updateProfileImage
);

// Rota para alterar a senha do usuário
router.put(
  "/change-password",
  authMiddleware,
  passwordController.changePassword
);

module.exports = router;
