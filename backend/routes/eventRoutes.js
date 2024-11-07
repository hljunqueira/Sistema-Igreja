const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");
const { validateEvent } = require("../middleware/validationMiddleware");

// Rota para criar um novo evento com autenticação e validação
router.post("/", authMiddleware, validateEvent, eventController.createEvent);

// Rota para obter todos os eventos
router.get("/", eventController.getEvents);

// Rota para obter um evento específico pelo ID
router.get("/:id", eventController.getEventById);

// Rota para atualizar um evento pelo ID com autenticação e validação
router.put("/:id", authMiddleware, validateEvent, eventController.updateEvent);

// Rota para excluir um evento pelo ID com autenticação
router.delete("/:id", authMiddleware, eventController.deleteEvent);

module.exports = router;
