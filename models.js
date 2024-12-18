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
  ticketNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

const Availability = sequelize.define("Availability", {
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

sequelize.sync().then(async () => {
  // Check if any rows exist in the Availability table
  const availabilityCount = await Availability.count();

  if (availabilityCount === 0) {
    // No rows exist, so create a default row
    await Availability.create({ isAvailable: true });
    console.log("Default availability created.");
  }
});

module.exports = {
  Queue,
  Availability,
  sequelize,
};
