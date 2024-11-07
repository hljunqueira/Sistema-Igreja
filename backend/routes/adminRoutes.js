// C:\sistema-igreja\backend\routes\adminRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const adminController = require("../controllers/adminController");

// Rotas para gerenciamento de usuários
router.get(
  "/users",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  adminController.getAllUsers
);

router.delete(
  "/users/:id",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  adminController.deleteUser
);

router.put(
  "/users/:id",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  adminController.updateUserType
);

router.get(
  "/users/:id",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  adminController.getUserDetails
);

// Rotas para pastores e líderes
router.post(
  "/pastores",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  adminController.savePastorInfo
);

router.post(
  "/lideres",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  adminController.saveLiderInfo
);
router.put(
  "/users/:id/status",
  authMiddleware,
  authorizationMiddleware(["administrador"]),
  adminController.updateUserStatus
);

module.exports = router;
