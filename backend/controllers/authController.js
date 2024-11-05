// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { getUserByEmail, getUserById, createUser } = require("../models/User");

exports.login = async (req, res) => {
  try {
    console.log("Tentativa de login:", req.body);
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await getUserByEmail(email);
    console.log("Usuário encontrado:", user ? "Sim" : "Não");

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Verificar a senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("Senha válida:", isValidPassword ? "Sim" : "Não");

    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, userType: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Remover a senha antes de enviar os dados do usuário
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      user_type: user.user_type,
    };

    console.log("Login bem-sucedido:", userData);

    res.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      message: "Erro ao processar login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.verifyAuth = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    console.error("Erro na verificação de autenticação:", error);
    res.status(401).json({
      authenticated: false,
      message: "Erro na verificação de autenticação",
    });
  }
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email já está em uso" });
    }

    // Criar um novo usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        user_type: newUser.user_type,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    console.error("Erro ao obter informações do usuário:", error);
    res.status(500).json({ message: " Erro ao obter informações do usuário" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Lógica para enviar email de recuperação de senha
    // Exemplo: gerar um token e enviar um email com o link para redefinição de senha
    res.json({ message: "Email de recuperação enviado" });
  } catch (error) {
    console.error("Erro ao enviar email de recuperação:", error);
    res.status(500).json({ message: "Erro ao enviar email de recuperação" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    // Lógica para verificar o token e redefinir a senha
    res.json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ message: "Erro ao redefinir senha" });
  }
};
