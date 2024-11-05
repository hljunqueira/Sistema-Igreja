// backend/controllers/userController.js
const { pool } = require("../config/db");
const cloudinary = require("../config/cloudinary");

// Função para obter o perfil do usuário
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT 
        id, name, email, user_type, profile_image_url,
        phone, birth_date, address, theme_preference, 
        notifications_preferences, is_baptized, baptism_date, status
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
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
    const userId = req.user.id;
    const {
      name,
      email,
      phone,
      birth_date,
      address,
      theme_preference,
      notifications_preferences,
      is_baptized,
      baptism_date,
    } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           birth_date = COALESCE($4, birth_date),
           address = COALESCE($5, address),
           theme_preference = COALESCE($6, theme_preference),
           notifications_preferences = COALESCE($7, notifications_preferences),
           is_baptized = COALESCE($8, is_baptized),
           baptism_date = COALESCE($9, baptism_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        name,
        email,
        phone,
        birth_date,
        address,
        theme_preference,
        notifications_preferences,
        is_baptized,
        baptism_date,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
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

    const userId = req.user.id;

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
      `UPDATE users 
       SET profile_image_url = $1, profile_image_id = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 RETURNING *`,
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

// Função para deletar a conta do usuário
exports.deleteUserAccount = async (req, res) => {
  const userId = req.user.id;
  const client = await pool.connect();
  try {
    // Buscar usuário atual
    const userResult = await client.query(
      "SELECT profile_image_id FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const user = userResult.rows[0];

    // Se existe uma imagem, deletar do Cloudinary
    if (user.profile_image_id) {
      try {
        await cloudinary.uploader.destroy(user.profile_image_id);
      } catch (error) {
        console.error("Erro ao deletar imagem do Cloudinary:", error);
      }
    }

    // Deletar o usuário do banco de dados
    await client.query("DELETE FROM users WHERE id = $1", [userId]);

    res.json({ message: "Conta deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar conta do usuário:", error);
    res.status(500).json({
      message: "Erro ao deletar conta do usuário",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    client.release();
  }
};

// ... resto do código existente, se houver ...
