const db = require('../../../../config/database');
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const Address = db.sequelize.define('Address', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: uuidv4 },
  street: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING, allowNull: false },
  neighborhood: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
  zipCode: { type: DataTypes.STRING, allowNull: false },
  longitude: { type: DataTypes.DECIMAL, allowNull: false },
  latitude: { type: DataTypes.DECIMAL, allowNull: false },
});

module.exports = Address;
