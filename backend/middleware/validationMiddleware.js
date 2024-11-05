// backend/middleware/validationMiddleware.js
const { body, validationResult } = require("express-validator");

exports.validateProfileUpdate = [
  body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
  body("email").isEmail().withMessage("Email inválido"),
  body("phone")
    .optional()
    .matches(/^\+?[\d\s-]+$/)
    .withMessage("Telefone inválido"),
  body("birth_date")
    .optional()
    .isDate()
    .withMessage("Data de nascimento inválida"),
  body("address")
    .optional()
    .isObject()
    .withMessage("Endereço deve ser um objeto"),
  body("notifications_preferences").optional().isObject(),
  body("theme_preference").optional().isIn(["light", "dark"]),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
