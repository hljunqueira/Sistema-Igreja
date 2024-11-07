const { pool } = require("../config/db");
const { validationResult } = require("express-validator");

exports.createEvent = async (req, res) => {
  console.log("Dados recebidos no backend:", JSON.stringify(req.body, null, 2));

  // Validação do corpo da requisição
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Erros de validação:", JSON.stringify(errors.array(), null, 2));
    return res.status(400).json({
      message: "Erro de validação",
      errors: errors.array(),
    });
  }

  try {
    const {
      title,
      description,
      start_datetime,
      end_datetime,
      location,
      event_type,
      is_recurring,
      recurrence_pattern,
    } = req.body;

    const created_by = req.user.id;

    console.log("Criando evento com os seguintes dados:", {
      title,
      description,
      start_datetime,
      end_datetime,
      location,
      event_type,
      is_recurring,
      recurrence_pattern,
      created_by,
    });

    const result = await pool.query(
      `INSERT INTO events (
        title, description, start_datetime, end_datetime,
        location, event_type, is_recurring, recurrence_pattern, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        title,
        description,
        start_datetime,
        end_datetime,
        location,
        event_type,
        is_recurring,
        recurrence_pattern,
        created_by,
      ]
    );

    console.log(
      "Evento criado com sucesso:",
      JSON.stringify(result.rows[0], null, 2)
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({
      message: "Erro ao criar evento",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { start_datetime, end_datetime, event_type } = req.query;
    let query = "SELECT * FROM events";
    const queryParams = [];

    if (start_datetime || end_datetime || event_type) {
      query += " WHERE";
      if (start_datetime) {
        query += " start_datetime >= $" + (queryParams.length + 1);
        queryParams.push(start_datetime);
      }
      if (end_datetime) {
        query += queryParams.length ? " AND" : "";
        query += " end_datetime <= $" + (queryParams.length + 1);
        queryParams.push(end_datetime);
      }
      if (event_type) {
        query += queryParams.length ? " AND" : "";
        query += " event_type = $" + (queryParams.length + 1);
        queryParams.push(event_type);
      }
    }

    query += " ORDER BY start_datetime";

    console.log("Executando consulta:", query, "com parâmetros:", queryParams);

    const result = await pool.query(query, queryParams);
    console.log("Eventos encontrados:", JSON.stringify(result.rows, null, 2));
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    res.status(500).json({
      message: "Erro ao buscar eventos",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;
  console.log("Buscando evento com ID:", id);
  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      console.log("Evento não encontrado para ID:", id);
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    console.log("Evento encontrado:", JSON.stringify(result.rows[0], null, 2));
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    res.status(500).json({
      message: "Erro ao buscar evento",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  console.log("Atualizando evento com ID:", id);

  const {
    title,
    description,
    start_datetime,
    end_datetime,
    location,
    event_type,
    is_recurring,
    recurrence_pattern,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE events
       SET title = $1, description = $2, start_datetime = $3, end_datetime = $4, location = $5, event_type = $6, is_recurring = $7, recurrence_pattern = $8
       WHERE id = $9
       RETURNING *`,
      [
        title,
        description,
        start_datetime,
        end_datetime,
        location,
        event_type,
        is_recurring,
        recurrence_pattern,
        id,
      ]
    );
    if (result.rows.length === 0) {
      console.log("Evento não encontrado para atualização com ID:", id);
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    console.log(
      "Evento atualizado com sucesso:",
      JSON.stringify(result.rows[0], null, 2)
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    res.status(500).json({
      message: "Erro ao atualizar evento",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  console.log("Excluindo evento com ID:", id);
  try {
    const result = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      console.log("Evento não encontrado para exclusão com ID:", id);
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    console.log("Evento excluído com sucesso:", id);
    res.json({ message: "Evento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    res.status(500).json({
      message: "Erro ao excluir evento",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
