"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const User = require("./user");
const ErrorInfo = require("./errorInfo");
const config = require(__dirname + "/../config/config.js");
const db = {};

const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  dialect: config.dialect,
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.ErrorInfo = ErrorInfo;

User.init(sequelize);
ErrorInfo.init(sequelize);

User.associate(db);
ErrorInfo.associate(db);
module.exports = db;
