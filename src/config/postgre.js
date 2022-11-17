const { Pool } = require("pg");
console.log(process.env.HOST);
console.log(process.env.USER);
console.log(process.env.DATABASE);
console.log(process.env.PASSWORD);
console.log(process.env.PORT);
const db = new Pool({
  // host: process.env.HOST,
  // user: process.env.USER,
  // database: process.env.DATABASE,
  // password: process.env.PASSWORD,
  // port: process.env.PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = db;
