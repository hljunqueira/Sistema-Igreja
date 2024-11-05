// backend/config/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "software-church",
  password: "Maker@1", // sua senha do PostgreSQL
  port: 5432,
});

module.exports = pool;
