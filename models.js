const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_URL || {
    dialect: "sqlite",
    storage: "./database.sqlite",
  }
);

const Queue = sequelize.define("Queue", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serving: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

sequelize.sync();

module.exports = {
  Queue,
  sequelize,
};