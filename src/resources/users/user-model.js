const { DataTypes } = require('sequelize');
const db = require('../../../config/database');
const Role = require('./enums/role');

const UserModel = db.sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
      },
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

module.exports = UserModel;
