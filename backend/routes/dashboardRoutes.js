// backend/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getDashboardData } = require("../models/Dashboard");

// Rota para obter dados do dashboard
router.get("/", authMiddleware, async (req, res) => {
  try {
    const dashboardData = await getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    res.status(500).json({
      message: "Erro ao buscar dados do dashboard",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
