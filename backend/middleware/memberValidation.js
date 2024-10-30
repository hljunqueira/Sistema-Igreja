// backend/middleware/memberValidation.js

const memberValidation = (req, res, next) => {
  const { name, email, phone } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Nome inválido");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Email inválido");
  }

  if (phone && !/^\d{10,11}$/.test(phone)) {
    errors.push("Telefone inválido");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = memberValidation;
