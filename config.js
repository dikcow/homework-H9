const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "movies-database",
  password: "root@123",
  port: 5432,
});

module.exports = pool;
