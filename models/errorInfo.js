const Sequelize = require("sequelize");
const User = require("./user");

class ErrorInfo extends Sequelize.Model {
  static init(sequelize) {
    const errInfoAttr = {
      errorId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      errorImg: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: false,
      },
      language: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: false,
      },
      errorcode: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: false,
      },
      problem: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: false,
      },
      solution: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: false,
      },
      userId: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: false,
      },
    };

    const errorinfoTbl = {
      sequelize,
      timestamps: true,
      modelName: "errorinfo",
      tableName: "errorinfo",
      paranoid: false,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    };

    return super.init(errInfoAttr, errorinfoTbl);
  }

  static associate(db) {
    db.ErrorInfo.belongsTo(db.User);
  }
}

module.exports = ErrorInfo;
