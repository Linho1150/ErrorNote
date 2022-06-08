const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static init(sequelize) {
    const userAttr = {
      userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      phoneNumber: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      snsId: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      snsnickname: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
    };

    const userTbl = {
      sequelize,
      timestamps: true,
      modelName: "User",
      tableName: "users",
      paranoid: false,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    };

    return super.init(userAttr, userTbl);
  }

  static associate(db) {
    db.User.hasMany(db.ErrorInfo);
  }
}

module.exports = User;
