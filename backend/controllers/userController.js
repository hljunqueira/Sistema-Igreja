const cloudinary = require("../config/cloudinary");
const pool = require("../config/db");
const { getUserById, updateUser } = require("../models/User");

// Função para obter o perfil do usuário
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({
      message: "Erro ao buscar perfil do usuário",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Função para atualizar o perfil do usuário
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updatedUser = await updateUser(userId, req.body);

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({
      message: "Erro ao atualizar perfil do usuário",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Função para atualizar a imagem de perfil do usuário
exports.updateProfileImage = async (req, res) => {
  const client = await pool.connect();
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nenhuma imagem fornecida" });
    }

    const userId = req.user.userId;

    // Buscar usuário atual
    const userResult = await client.query(
      "SELECT profile_image_id FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const user = userResult.rows[0];

    // Se existe uma imagem anterior, deletar do Cloudinary
    if (user.profile_image_id) {
      try {
        await cloudinary.uploader.destroy(user.profile_image_id);
      } catch (error) {
        console.error("Erro ao deletar imagem antiga:", error);
      }
    }

    // Atualizar o usuário com a nova URL da imagem
    const updateResult = await client.query(
      "UPDATE users SET profile_image_url = $1, profile_image_id = $2 WHERE id = $3 RETURNING *",
      [req.file.path, req.file.filename, userId]
    );

    res.json({
      message: "Imagem de perfil atualizada com sucesso",
      user: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar imagem de perfil:", error);
    res.status(500).json({
      message: "Erro ao atualizar imagem de perfil",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    client.release();
  }
};

// Função para registrar um novo usuário
exports.registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    user_type,
    is_baptized,
    baptism_date,
    phone,
    birth_date,
  } = req.body;

  // Lógica para criar o usuário no banco de dados
  const query = `
    INSERT INTO users (name, email, password, user_type, is_baptized, baptism_date, phone, birth_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
  `;

  try {
    const result = await pool.query(query, [
      name,
      email,
      password,
      user_type,
      is_baptized,
      baptism_date,
      phone,
      birth_date,
    ]);
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

// ... resto do código existente, se houver ...
