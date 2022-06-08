require("dotenv").config();
const env = process.env;

const config = {
  username: env.DB_ID,
  password: env.DB_PW,
  database: env.DB_NAME,
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
};

module.exports = config;
