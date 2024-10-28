const express = require("express");
const StudentController = require("../controllers/StudentController");

const router = express.Router();

// Rotas de Estudantes
router.post("/students", StudentController.create);
router.get("/students", StudentController.findAll);
router.get("/students/:id", StudentController.findById);
router.put("/students/:id", StudentController.update);
router.delete("/students/:id", StudentController.delete);

module.exports = router;
