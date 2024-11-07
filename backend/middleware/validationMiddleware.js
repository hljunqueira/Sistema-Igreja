const { body, validationResult } = require("express-validator");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

// Estender dayjs com plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);

// Validação para atualização de perfil
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

// Validação para eventos
exports.validateEvent = [
  body("title").trim().notEmpty().withMessage("Título é obrigatório"),
  body("start_datetime")
    .notEmpty()
    .withMessage("Data/hora de início é obrigatória")
    .custom((value) => {
      if (!dayjs(value).isValid()) {
        throw new Error("Data/hora de início inválida");
      }
      return true;
    }),
  body("end_datetime")
    .notEmpty()
    .withMessage("Data/hora de término é obrigatória")
    .custom((value, { req }) => {
      if (!dayjs(value).isValid()) {
        throw new Error("Data/hora de término inválida");
      }
      if (dayjs(value).isBefore(dayjs(req.body.start_datetime))) {
        throw new Error(
          "A data/hora de término deve ser posterior à de início"
        );
      }
      return true;
    }),
  body("event_type")
    .trim()
    .notEmpty()
    .withMessage("Tipo de evento é obrigatório")
    .isIn([
      "workshop",
      "seminar",
      "conference",
      "meeting",
      "culto",
      "estudo",
      "oracao",
      "outro",
    ])
    .withMessage("Tipo de evento inválido"),
  body("is_recurring")
    .isBoolean()
    .withMessage("is_recurring deve ser um booleano"),
  body("recurrence_pattern")
    .optional()
    .custom((value, { req }) => {
      if (req.body.is_recurring && !value) {
        throw new Error(
          "Padrão de recorrência é obrigatório para eventos recorrentes"
        );
      }
      if (value && !["daily", "weekly", "monthly", "yearly"].includes(value)) {
        throw new Error("Padrão de recorrência inválido");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Erro de validação",
        errors: errors.array(),
      });
    }
    next();
  },
];
