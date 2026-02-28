const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const BMIHistory = sequelize.define(
  "BMIHistory",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    bmi: { type: DataTypes.FLOAT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    bmr: { type: DataTypes.FLOAT, allowNull: false },
    dailyCalories: { type: DataTypes.FLOAT, allowNull: false },
    idealBodyWeight: { type: DataTypes.FLOAT, allowNull: true },
    advice: { type: DataTypes.STRING(500), allowNull: true },
  },
  {
    timestamps: true,
    tableName: "BMIHistory", // keep it as it is
  }
);

// Associations (note the quotes)
BMIHistory.belongsTo(User, { foreignKey: "userId", targetKey: "id", onDelete: "CASCADE" });
User.hasMany(BMIHistory, { foreignKey: "userId", sourceKey: "id", onDelete: "CASCADE" });
