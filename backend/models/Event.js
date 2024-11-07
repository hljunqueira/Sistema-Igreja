const { pool } = require("../config/db");

// Função para criar a tabela de eventos
const createEventTable = async () => {
  try {
    const query = `
      DROP TABLE IF EXISTS events CASCADE;
      CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
        end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
        location VARCHAR(255),
        event_type VARCHAR(50) NOT NULL,
        is_recurring BOOLEAN DEFAULT FALSE,
        recurrence_pattern VARCHAR(50),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Criar índices para otimização
      CREATE INDEX idx_events_start_datetime ON events(start_datetime);
      CREATE INDEX idx_events_event_type ON events(event_type);
      CREATE INDEX idx_events_created_by ON events(created_by);
    `;
    await pool.query(query);
    console.log("Tabela de eventos recriada com sucesso");
  } catch (error) {
    console.error("Erro ao criar tabela de eventos:", error);
    throw error;
  }
};

// Exportar a função
module.exports = {
  createEventTable,
};
