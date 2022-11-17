const { Pool } = require("pg");
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_DATABASE);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_PORT);
console.log(process.env.PORT);
const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = db;
