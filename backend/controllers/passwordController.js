// backend/controllers/passwordController.js
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

exports.changePassword = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validações
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Todas as senhas são obrigatórias",
      });
    }

    // Validação da nova senha
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "A nova senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais",
      });
    }

    // Verificar se a nova senha é diferente da atual
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "A nova senha deve ser diferente da senha atual",
      });
    }

    await client.query("BEGIN");

    // Buscar o usuário
    const userResult = await client.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const user = userResult.rows[0];

    // Verificar senha atual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Senha atual incorreta" });
    }

    // Criptografar e atualizar nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Atualizar senha no banco de dados
    await client.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, userId]
    );

    await client.query("COMMIT");

    res.json({
      message: "Senha alterada com sucesso",
      timestamp: new Date(),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({
      message: "Erro ao alterar senha",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    client.release();
  }
};
