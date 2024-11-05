// backend/models/Dashboard.js
const pool = require("../config/db");

const createEventsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date TIMESTAMP NOT NULL,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela de eventos criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar tabela de eventos:", error);
    throw error;
  }
};

const createMinistriesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ministries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        leader VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela de ministérios criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar tabela de ministérios:", error);
    throw error;
  }
};

const getDashboardData = async () => {
  try {
    // Buscar total de membros
    const membersResult = await pool.query("SELECT COUNT(*) FROM members");
    const totalMembers = parseInt(membersResult.rows[0].count);

    // Buscar eventos próximos
    const eventsResult = await pool.query(
      "SELECT COUNT(*) FROM events WHERE date > CURRENT_TIMESTAMP"
    );
    const upcomingEvents = parseInt(eventsResult.rows[0].count);

    // Buscar total de ministérios
    const ministriesResult = await pool.query(
      "SELECT COUNT(*) FROM ministries"
    );
    const totalMinistries = parseInt(ministriesResult.rows[0].count);

    // Buscar crescimento de membros nos últimos 6 meses
    const memberGrowthResult = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM members
      WHERE created_at > CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `);

    const memberGrowth = memberGrowthResult.rows.map((row) => ({
      name: new Date(row.month).toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      }),
      membros: parseInt(row.count),
    }));

    return {
      totalMembers,
      upcomingEvents,
      totalMinistries,
      memberGrowth,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw error;
  }
};

module.exports = {
  createEventsTable,
  createMinistriesTable,
  getDashboardData,
};
