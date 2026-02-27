const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  height: { type: DataTypes.FLOAT },
  weight: { type: DataTypes.FLOAT },
  lifestyle: { type: DataTypes.STRING },
}, {
  timestamps: true,
});

module.exports = User;
