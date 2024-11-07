const { pool } = require("../config/db");

// Função para listar todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        email, 
        user_type, 
        is_baptized,
        baptism_date,
        updated_at as created_at,
        phone,
        birth_date,
        status,
        address,
        theme_preference,
        notifications_preferences
      FROM users
      ORDER BY updated_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};

// Função para excluir um usuário
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const checkUser = await pool.query("SELECT id FROM users WHERE id = $1", [
      id,
    ]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ message: "Erro ao excluir usuário" });
  }
};

// Função para atualizar o tipo de usuário
exports.updateUserType = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_type } = req.body;

    const validUserTypes = [
      "visitante",
      "membro",
      "administrador",
      "pastor",
      "lider",
    ];
    if (!validUserTypes.includes(user_type)) {
      return res.status(400).json({ message: "Tipo de usuário inválido" });
    }

    const result = await pool.query(
      `UPDATE users 
       SET user_type = $1, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING id, name, email, user_type, is_baptized, baptism_date`,
      [user_type, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
};

// Função para obter detalhes de um usuário específico
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        email, 
        user_type, 
        is_baptized,
        baptism_date,
        updated_at as created_at,
        phone,
        birth_date,
        status,
        address,
        theme_preference,
        notifications_preferences
      FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar detalhes do usuário:", error);
    res.status(500).json({ message: "Erro ao buscar detalhes do usuário" });
  }
};

// Função para salvar informações do pastor
exports.savePastorInfo = async (req, res) => {
  try {
    const { user_id, data_ordenacao, formacao, especializacoes, biografia } =
      req.body;

    const result = await pool.query(
      `INSERT INTO pastores 
        (user_id, data_ordenacao, formacao, especializacoes, biografia)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, data_ordenacao, formacao, especializacoes, biografia]
    );

    res.status(201).json({
      message: "Informações do pastor salvas com sucesso!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao salvar informações do pastor:", error);
    res.status(500).json({
      message: "Erro ao salvar informações do pastor",
      error: error.message,
    });
  }
};

// Fun ```javascript
// Função para salvar informações do líder
exports.saveLiderInfo = async (req, res) => {
  try {
    const { user_id, area_lideranca, descricao_funcao, data_inicio } = req.body;

    const result = await pool.query(
      `INSERT INTO lideres 
        (user_id, area_lideranca, descricao_funcao, data_inicio)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, area_lideranca, descricao_funcao, data_inicio]
    );

    res.status(201).json({
      message: "Informações do líder salvas com sucesso!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao salvar informações do líder:", error);
    res.status(500).json({
      message: "Erro ao salvar informações do líder",
      error: error.message,
    });
  }
};

// Função para atualizar o status do usuário
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET status = $1, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING id, name, email, user_type, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar status do usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar status do usuário" });
  }
};

module.exports = exports;
